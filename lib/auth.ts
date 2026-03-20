import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { resolveAppAuthSecret } from "@/lib/modules/auth/secrets";
import { loadUserProfileById } from "@/lib/modules/auth/user-profiles";
import { isJornaleiroRole } from "@/lib/modules/auth/session";
import { supabaseAdmin } from "@/lib/supabase";
import { normalizeBrazilianDocument } from "@/lib/documents";
import { getActiveBancaRowForUser } from "@/lib/jornaleiro-banca";

const LOCAL_DEV_ADMIN_EMAIL = "admin@guiadasbancas.com";
const LOCAL_DEV_ADMIN_PASSWORD = "admin123";

function normalizeAdminIdentifier(value: string) {
  return value.trim().toLowerCase();
}

function buildAdminLoginAliases(email: string) {
  const normalizedEmail = normalizeAdminIdentifier(email);
  const aliases = new Set<string>([normalizedEmail]);

  const localPart = normalizedEmail.includes("@")
    ? normalizedEmail.split("@")[0]
    : normalizedEmail;

  if (localPart) aliases.add(localPart);
  aliases.add("administrador");

  return aliases;
}

function getEmergencyAdminCredentials() {
  const envEmail = process.env.ADMIN_LOGIN_EMAIL?.trim().toLowerCase();
  const envPassword = process.env.ADMIN_LOGIN_PASSWORD;
  const emergencyAdminEnabled =
    process.env.ALLOW_EMERGENCY_ADMIN_LOGIN === "true" || process.env.NODE_ENV !== "production";

  if (envEmail && envPassword && emergencyAdminEnabled) {
    return {
      email: envEmail,
      password: envPassword,
      source: "env",
    } as const;
  }

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return {
    email: LOCAL_DEV_ADMIN_EMAIL,
    password: LOCAL_DEV_ADMIN_PASSWORD,
    source: "local-dev",
  } as const;
}

async function authorizeEmergencyAdmin(rawEmail: string, rawPassword: string) {
  const credentials = getEmergencyAdminCredentials();
  const normalizedEmail = normalizeAdminIdentifier(rawEmail);

  if (!credentials) return null;

  const acceptedAliases =
    credentials.source === "local-dev"
      ? buildAdminLoginAliases(credentials.email)
      : new Set<string>([credentials.email]);
  const matchesEmergencyCredentials =
    acceptedAliases.has(normalizedEmail) &&
    rawPassword === credentials.password;

  if (!matchesEmergencyCredentials) {
    return null;
  }

  const { data: profiles, error } = await supabaseAdmin
    .from("user_profiles")
    .select("id, full_name, role, active, avatar_url, email")
    .eq("role", "admin")
    .eq("active", true)
    .limit(10);

  if (error || !profiles || profiles.length === 0) {
    console.error("❌ [AUTHORIZE] Falha ao buscar perfil admin de emergência:", error?.message);
    return null;
  }

  const matchedProfile =
    profiles.find((profile) => profile.email?.trim().toLowerCase() === normalizedEmail) ??
    profiles[0];

  console.warn(`⚠️ [AUTHORIZE] Usando login admin de emergência (${credentials.source})`);

  return {
    id: matchedProfile.id,
    email: matchedProfile.email?.trim().toLowerCase() || credentials.email,
    name: matchedProfile.full_name || "Administrador",
    role: "admin",
    banca_id: null,
    avatar_url: matchedProfile.avatar_url || null,
  };
}

function isSupabaseSchemaAuthFailure(message: string | undefined | null) {
  return /database error querying schema/i.test(message || "");
}

function collectNormalizedDocuments(values: Array<unknown>) {
  const documents = new Set<string>();

  for (const value of values) {
    const normalized = normalizeBrazilianDocument(typeof value === "string" ? value : "");
    if (normalized) {
      documents.add(normalized);
    }
  }

  return documents;
}

async function authorizeEmergencyJornaleiro(rawEmail: string, rawPassword: string) {
  const normalizedEmail = normalizeAdminIdentifier(rawEmail);
  const normalizedDocument = normalizeBrazilianDocument(rawPassword);

  if (!normalizedEmail || !normalizedDocument) {
    return null;
  }

  const { data: userId, error: userIdError } = await supabaseAdmin.rpc("get_user_id_by_email", {
    user_email: normalizedEmail,
  });

  if (userIdError || !userId) {
    return null;
  }

  const { data: profile, error: profileError } = await loadUserProfileById<{
    id: string;
    role: string | null;
    full_name: string | null;
    active: boolean | null;
    avatar_url: string | null;
    banca_id: string | null;
    cpf: string | null;
    blocked?: boolean | null;
  }>({
    userId: userId as string,
    select: "id, role, full_name, active, avatar_url, banca_id, cpf, blocked",
  });

  if (profileError || !profile) {
    return null;
  }

  if (!isJornaleiroRole(profile.role) || profile.active === false || profile.blocked === true) {
    return null;
  }

  const banca = await getActiveBancaRowForUser(profile.id, "id, cpf, cnpj, cotista_cnpj_cpf, user_id");
  const acceptedDocuments = collectNormalizedDocuments([
    profile.cpf,
    (banca as any)?.cpf,
    (banca as any)?.cnpj,
    (banca as any)?.cotista_cnpj_cpf,
  ]);

  if (!acceptedDocuments.has(normalizedDocument)) {
    return null;
  }

  console.warn("⚠️ [AUTHORIZE] Usando login emergencial do jornaleiro via CPF/CNPJ cadastrado");

  return {
    id: profile.id,
    email: normalizedEmail,
    name: profile.full_name || "Jornaleiro",
    role: profile.role || "jornaleiro",
    banca_id: profile.banca_id || null,
    avatar_url: profile.avatar_url || null,
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 [AUTHORIZE] Iniciando...", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ [AUTHORIZE] Credenciais vazias");
          return null;
        }

        try {
          const emergencyAdmin = await authorizeEmergencyAdmin(
            credentials.email as string,
            credentials.password as string,
          );
          if (emergencyAdmin) {
            return emergencyAdmin;
          }

          // 1. Autenticar com Supabase Auth
          console.log("🔐 [AUTHORIZE] Tentando signInWithPassword...");
          const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          if (authError) {
            console.log("❌ [AUTHORIZE] Erro auth:", authError.message, authError);
            if (isSupabaseSchemaAuthFailure(authError.message)) {
              const emergencyJornaleiro = await authorizeEmergencyJornaleiro(
                credentials.email as string,
                credentials.password as string,
              );

              if (emergencyJornaleiro) {
                return emergencyJornaleiro;
              }
            }

            const emergencyAdmin = await authorizeEmergencyAdmin(
              credentials.email as string,
              credentials.password as string,
            );
            if (emergencyAdmin) return emergencyAdmin;
            return null;
          }

          if (!authData.user) {
            console.log("❌ [AUTHORIZE] Auth OK mas sem user");
            const emergencyAdmin = await authorizeEmergencyAdmin(
              credentials.email as string,
              credentials.password as string,
            );
            if (emergencyAdmin) return emergencyAdmin;
            return null;
          }

          console.log("✅ [AUTHORIZE] Auth OK, user_id:", authData.user.id);

          // 2. Buscar perfil do usuário (com retry para usuários recém-criados)
          console.log("🔐 [AUTHORIZE] Buscando perfil...");
          let profile = null;
          let attempts = 0;
          const maxAttempts = 3;
          
          while (!profile && attempts < maxAttempts) {
            attempts++;
            console.log(`🔄 [AUTHORIZE] Tentativa ${attempts}/${maxAttempts}...`);
            
            const { data, error: profileError } = await supabaseAdmin
              .from('user_profiles')
              .select('*')
              .eq('id', authData.user.id)
              .single();

            if (data) {
              profile = data;
              break;
            }

            if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = not found
              console.log("❌ [AUTHORIZE] Erro ao buscar perfil:", profileError.message);
              return null;
            }

            // Se não encontrou, aguardar 500ms antes de tentar novamente
            if (attempts < maxAttempts) {
              console.log("⏳ [AUTHORIZE] Perfil não encontrado, aguardando 500ms...");
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }

          if (!profile) {
            console.log("❌ [AUTHORIZE] Perfil não encontrado após", maxAttempts, "tentativas");
            return null;
          }

          console.log("✅ [AUTHORIZE] Perfil encontrado:", { role: profile.role, active: profile.active, full_name: profile.full_name });

          if (profile.active === false) {
            console.log("❌ [AUTHORIZE] Usuário inativo");
            return null;
          }

          console.log("✅ [AUTHORIZE] Login completo! Role:", profile.role);

          // Retornar dados do usuário para o token
          return {
            id: authData.user.id,
            email: authData.user.email!,
            name: profile.full_name,
            role: profile.role,
            banca_id: profile.banca_id,
            avatar_url: profile.avatar_url,
          };
        } catch (error) {
          console.error("❌ [AUTHORIZE] Exception:", error);
          const emergencyAdmin = await authorizeEmergencyAdmin(
            credentials.email as string,
            credentials.password as string,
          );
          if (emergencyAdmin) return emergencyAdmin;
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Adicionar dados customizados ao token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.banca_id = user.banca_id;
        token.avatar_url = user.avatar_url;
      }
      return token;
    },
    async session({ session, token }) {
      // Adicionar dados customizados à sessão
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.banca_id = token.banca_id as string | null;
        session.user.avatar_url = token.avatar_url as string | null;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Após login bem-sucedido, redireciona baseado no role
      // Se a URL já é absoluta e do mesmo domínio, usa ela
      if (url.startsWith(baseUrl)) return url;
      // Se é uma URL relativa, adiciona o baseUrl
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Caso contrário, volta para a home
      return baseUrl;
    },
  },
  pages: {
    signIn: "/entrar", // Página de login unificada
    error: "/entrar", // Redireciona erros para a página de login
  },
  session: {
    strategy: "jwt",
  },
  secret: resolveAppAuthSecret() ?? undefined,
});

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbQuery } from "@/lib/mysql";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Buscar usuário
          const [[user]] = await dbQuery<any>(
            `SELECT u.id, u.email, u.password_hash,
                    up.role, up.full_name, up.phone, up.avatar_url, up.banca_id
             FROM users u
             INNER JOIN user_profiles up ON up.user_id = u.id
             WHERE u.email = ? AND up.active = 1
             LIMIT 1`,
            [credentials.email as string]
          );

          if (!user || !user.password_hash) {
            console.log("❌ Usuário não encontrado:", credentials.email);
            return null;
          }

          // Validar senha
          const valid = await bcrypt.compare(
            credentials.password as string,
            user.password_hash
          );
          
          if (!valid) {
            console.log("❌ Senha inválida para:", credentials.email);
            return null;
          }

          console.log("✅ Login bem-sucedido:", credentials.email, "| Role:", user.role);

          // Retornar dados do usuário para o token
          return {
            id: user.id,
            email: user.email,
            name: user.full_name,
            role: user.role,
            banca_id: user.banca_id,
            avatar_url: user.avatar_url,
          };
        } catch (error) {
          console.error("❌ Erro no authorize:", error);
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
  },
  pages: {
    signIn: "/jornaleiro",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

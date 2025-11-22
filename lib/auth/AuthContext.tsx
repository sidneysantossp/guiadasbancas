"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn as nextSignIn, signOut as nextSignOut, useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";

export type UserRole = "admin" | "jornaleiro" | "cliente";

export interface UserProfile {
  id: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  banca_id: string | null;
  active: boolean;
  email_verified: boolean;
  blocked?: boolean;
  blocked_reason?: string | null;
  blocked_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: { id: string; email: string; name?: string | null } | null;
  profile: UserProfile | null;
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, metadata: { full_name: string; role: UserRole }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  isAdmin: boolean;
  isJornaleiro: boolean;
  isCliente: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<{ id: string; email: string; name?: string | null } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Carregar perfil do usuário a partir da sessão NextAuth
  useEffect(() => {
    setLoading(status === "loading");
    if (status === "authenticated" && session?.user) {
      const u = session.user as any;
      const rawRole = (u.role as string) || "cliente";
      // Normalizar roles legadas (ex: 'seller') para manter compatibilidade
      const normalizedRole: UserRole = (rawRole === "jornaleiro" || rawRole === "seller")
        ? "jornaleiro"
        : (rawRole === "admin" ? "admin" : "cliente");

      setUser({ id: u.id, email: u.email, name: u.name });
      setProfile({
        id: u.id,
        role: normalizedRole,
        full_name: u.name ?? null,
        phone: null,
        avatar_url: (u.avatar_url as string) ?? null,
        banca_id: (u.banca_id as string) ?? null,
        active: true,
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } else if (status === "unauthenticated") {
      setUser(null);
      setProfile(null);
    }
  }, [status, session]);

  // loading control initial
  useEffect(() => {
    setLoading(status === "loading");
  }, [status]);

  // Login
  const signIn = async (email: string, password: string) => {
    const res = await nextSignIn("credentials", { redirect: false, email, password });
    if (res?.error) return { error: new Error(res.error) };
    return { error: null };
  };

  // Registro
  const signUp = async (email: string, password: string, metadata: { full_name: string; role: UserRole }) => {
    try {
      console.log('🔐 Iniciando signup para:', email);
      
      // 1. Criar usuário via API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          full_name: metadata.full_name,
          role: metadata.role,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        console.error('❌ Signup API error:', data.error);
        return { error: new Error(data.error || 'Erro ao criar conta') };
      }

      console.log('✅ Conta criada com sucesso! ID:', data.user?.id);

      // 2. Aguardar 500ms para garantir que o usuário foi criado
      await new Promise(resolve => setTimeout(resolve, 500));

      // 3. Fazer login automático após criar conta
      console.log('🔑 Tentando login automático...');
      const loginResult = await nextSignIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (loginResult?.error) {
        console.error('❌ Login automático falhou:', loginResult.error);
        return { error: new Error('Conta criada, mas falha ao fazer login. Por favor, faça login manualmente.') };
      }

      if (loginResult?.ok) {
        console.log('✅ Login automático bem-sucedido!');
      }

      return { error: null };
    } catch (err) {
      console.error('💥 Exception in signUp:', err);
      return { error: new Error('Erro inesperado ao criar conta') };
    }
  };

  // Logout
  const signOut = async () => {
    await nextSignOut({ callbackUrl: "/" });
  };

  // Atualizar perfil
  const updateProfile = async (_updates: Partial<UserProfile>) => {
    return { error: new Error("Not implemented in NextAuth layer") };
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAdmin: profile?.role === "admin" || (session?.user as any)?.role === "admin",
    isJornaleiro:
      profile?.role === "jornaleiro" ||
      (session?.user as any)?.role === "jornaleiro" ||
      (session?.user as any)?.role === "seller",
    isCliente:
      profile?.role === "cliente" ||
      (!profile && (session?.user as any)?.role === "cliente"),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook para proteger rotas
export function useRequireAuth(requiredRole?: UserRole) {
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role as UserRole | undefined;
  const loading = status === "loading";
  const user = session?.user ? { id: (session.user as any).id, email: session.user.email! } : null;
  const profile: UserProfile | null = session?.user
    ? {
        id: (session.user as any).id,
        role: (role as UserRole) || "cliente",
        full_name: (session.user as any).name ?? null,
        phone: null,
        avatar_url: (session.user as any).avatar_url ?? null,
        banca_id: (session.user as any).banca_id ?? null,
        active: true,
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    : null;
  return { user, profile, loading };
}

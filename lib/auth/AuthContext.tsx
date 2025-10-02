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
      setUser({ id: u.id, email: u.email, name: u.name });
      setProfile({
        id: u.id,
        role: (u.role as UserRole) || "cliente",
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
        console.error('Signup API error:', data.error);
        return { error: new Error(data.error || 'Erro ao criar conta') };
      }

      return { error: null };
    } catch (err) {
      console.error('Exception in signUp:', err);
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
    isAdmin: profile?.role === "admin",
    isJornaleiro: profile?.role === "jornaleiro",
    isCliente: profile?.role === "cliente",
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

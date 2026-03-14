"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";

type ValidatedAdminSession =
  | { authenticated: true; profile?: { id?: string; full_name?: string | null; role?: string | null }; user?: { email?: string | null } }
  | { authenticated: false };

async function waitForValidatedAdminSession(attempts = 6, delayMs = 250): Promise<ValidatedAdminSession | null> {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const sessionRes = await fetch("/api/auth/validate-session", {
        method: "GET",
        cache: "no-store",
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      const sessionData = await sessionRes.json().catch(() => null);

      if (sessionRes.ok && sessionData?.authenticated === true) {
        return sessionData as ValidatedAdminSession;
      }
    } catch {
      // noop: retry abaixo
    }

    if (attempt < attempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return null;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Se já logado como admin, redireciona
    try {
      const auth = localStorage.getItem("gb:adminAuth");
      if (auth === "1") router.replace("/admin/dashboard");
    } catch {}
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: normalizedEmail,
        password,
      });

      if (!result?.error) {
        const sessionData = await waitForValidatedAdminSession();

        if (
          sessionData?.authenticated === true &&
          sessionData?.profile?.role === "admin"
        ) {
          const adminData = {
            id: sessionData.profile.id,
            name: sessionData.profile.full_name || "Administrador",
            email: sessionData.user?.email || normalizedEmail,
            role: "admin",
          };

          localStorage.setItem("gb:adminAuth", "1");
          localStorage.setItem("gb:admin", JSON.stringify(adminData));
          router.replace("/admin/dashboard");
          return;
        }

        await signOut({ redirect: false });
        setError("Acesso negado. Sua conta não possui perfil de administrador ou a sessão não foi confirmada.");
        return;
      }

      setError("Credenciais inválidas. Verifique seu email e senha.");
    } catch {
      setError("Ocorreu um erro ao efetuar login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-12 w-12 text-[#ff5c00]"
              fill="currentColor"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" ry="2" opacity="0.15" />
              <rect x="6" y="7" width="12" height="2" rx="1" />
              <rect x="6" y="11" width="9" height="2" rx="1" />
              <rect x="6" y="15" width="6" height="2" rx="1" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Painel Administrativo
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Acesse o sistema de gestão do Guia das Bancas
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-4 rounded-md border border-red-300 bg-red-50 text-red-700 text-sm px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#ff5c00] focus:outline-none focus:ring-1 focus:ring-[#ff5c00]"
                placeholder="Seu email ou identificador"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#ff5c00] focus:outline-none focus:ring-1 focus:ring-[#ff5c00]"
                placeholder="Sua senha"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-[#ff5c00] hover:underline">
              ← Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

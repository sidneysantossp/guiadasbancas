"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function JornaleiroLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [branding, setBranding] = useState<{ logoUrl: string; logoAlt: string } | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  // Se já está autenticado como jornaleiro, redireciona
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "jornaleiro") {
      setRedirecting(true);
      router.replace("/jornaleiro/academy");
    }
  }, [status, session?.user?.role]);

  // Carregar branding para exibir a mesma logo da navbar
  useEffect(() => {
    const loadBranding = async () => {
      try {
        const res = await fetch("/api/admin/branding", { cache: "no-store" });
        const j = await res.json().catch(() => ({}));
        if (j?.success && j?.data) {
          setBranding({ logoUrl: j.data.logo_url || j.data.logoUrl, logoAlt: j.data.logo_alt || j.data.logoAlt || "Logo" });
        }
      } catch {}
    };
    loadBranding();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🔐 Tentando login jornaleiro:", email);
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/jornaleiro/academy",
      });

      if (result?.error) {
        console.error("❌ Erro no login:", result.error);
        setError("Email ou senha inválidos");
        setLoading(false);
        return;
      }

      if (result?.ok) {
        console.log("✅ Login bem-sucedido, redirecionando...");
        // Não fazer push manual, deixar o useEffect handle
        // O useEffect vai detectar a mudança de sessão e redirecionar
      }
    } catch (err: any) {
      console.error("❌ Exceção no login:", err);
      setError(err.message || "Erro ao fazer login");
      setLoading(false);
    }
  };

  // Se está carregando auth ou redirecionando, mostra loading
  if (status === "loading" || redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{redirecting ? "Redirecionando..." : "Carregando..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4">
      <div className="max-w-md w-full">
        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo centralizada dentro do card */}
          <div className="mb-6 text-center">
            <Link href="/" className="inline-block">
              {branding?.logoUrl ? (
                <Image
                  src={branding.logoUrl}
                  alt={branding.logoAlt || "Logo"}
                  width={180}
                  height={60}
                  className="h-12 w-auto object-contain"
                  priority
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-10 w-10 mx-auto text-[#ff5c00]"
                  aria-hidden
                  fill="currentColor"
                >
                  <rect x="3" y="4" width="18" height="16" rx="2" ry="2" opacity="0.15" />
                  <rect x="6" y="7" width="12" height="2" rx="1" />
                  <rect x="6" y="11" width="9" height="2" rx="1" />
                  <rect x="6" y="15" width="6" height="2" rx="1" />
                </svg>
              )}
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="••••••••"
                  aria-describedby="password-visibility-toggle"
                />
                <button
                  type="button"
                  id="password-visibility-toggle"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.73 2.1-3.64 3.95-5.22"/><path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-."/><path d="M1 1l22 22"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              <div className="mt-2 text-right">
                <Link href="/jornaleiro/esqueci-senha" className="text-sm text-orange-700 hover:underline">Esqueci minha senha</Link>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Divisor */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Não tem uma conta?
              </span>
            </div>
          </div>

          {/* Link de Registro */}
          <div className="mt-6">
            <Link
              href="/jornaleiro/registrar"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-orange-300 rounded-lg text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors"
            >
              {/* Ícone minimalista */}
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Cadastrar minha banca
            </Link>
          </div>
        </div>

        {/* Link para cliente */}
        <p className="mt-8 text-center text-sm text-gray-600">
          É cliente?{" "}
          <Link href="/minha-conta" className="text-orange-600 hover:text-orange-700 font-medium">
            Fazer login como cliente
          </Link>
        </p>
        <p className="mt-3 text-center text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700 underline">
            ← Voltar para Home
          </Link>
        </p>
      </div>
    </div>
  );
}

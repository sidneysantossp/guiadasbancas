"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function JornaleiroLoginPageClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [branding, setBranding] = useState<{ logoUrl: string; logoAlt: string } | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Se já está autenticado como jornaleiro, redireciona
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "jornaleiro") {
      setRedirecting(true);
      router.replace("/jornaleiro/dashboard");
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

    // REGRA CRÍTICA: Limpar sessão de usuário comum antes de login como jornaleiro
    // Apenas UMA sessão pode estar ativa por vez!
    try {
      const localUser = localStorage.getItem("gb:user");
      if (localUser) {
        console.log('[Auth] 🚨 Detectada sessão de usuário comum - limpando antes de login como jornaleiro');
        localStorage.removeItem("gb:user");
        localStorage.removeItem("gb:userProfile");
        localStorage.removeItem("gb:userCreatedAt");
        localStorage.removeItem("gb:orders");
        localStorage.removeItem("gb:addresses");
        localStorage.removeItem("gb:wishlist");
        try { window.dispatchEvent(new Event('gb:user:changed')); } catch {}
      }
    } catch {}

    try {
      console.log("🔐 Tentando login jornaleiro:", email);
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/jornaleiro/dashboard",
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
  if (!mounted || status === "loading" || redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{redirecting ? "Redirecionando..." : "Carregando painel..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Coluna esquerda: imagem + texto (desktop) */}
      <div className="relative hidden lg:flex lg:w-1/2 items-stretch overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format')",
          }}
        />
        {/* Overlay laranja */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[70%] py-12 px-10 bg-[#ff7a1f]/90">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
            BEM-VINDO AO<br />
            <span className="text-white">GUIA DAS BANCAS</span>
          </h1>
          <p className="mt-4 text-white/90 text-lg">
            Gerencie sua banca de forma fácil e rápida
          </p>
        </div>
      </div>

      {/* Coluna direita: formulário (desktop) / Card centralizado (mobile) */}
      <div className="flex-1 flex items-center justify-center min-h-screen lg:min-h-0 relative">
        {/* Background mobile */}
        <div 
          className="absolute inset-0 lg:hidden bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format')",
          }}
        />
        <div className="absolute inset-0 lg:hidden bg-[#3d3d3d]/70" />

        {/* Card do formulário */}
        <div className="relative z-10 w-full max-w-md mx-4 lg:mx-0 bg-white rounded-3xl lg:rounded-none lg:bg-transparent shadow-2xl lg:shadow-none">
          {/* Versão mobile: curva laranja decorativa no topo */}
          <div className="lg:hidden absolute -top-6 left-0 right-0 h-32 bg-[#ff7a1f] rounded-t-[100px] opacity-20" />
          
          <div className="relative px-8 py-10 lg:px-12 lg:py-0">
            {/* Logo e título */}
            <div className="text-center mb-8">
              {branding?.logoUrl ? (
                <Image
                  src={branding.logoUrl}
                  alt={branding.logoAlt}
                  width={160}
                  height={48}
                  className="mx-auto h-12 w-auto object-contain"
                />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-[#ff7a1f] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <span className="text-2xl font-bold text-[#ff7a1f]">Guia das Bancas</span>
                </div>
              )}
              <h2 className="mt-6 text-xl font-semibold text-gray-900">Acesse o Painel</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Seu E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border-0 bg-[#E8F0FE] px-4 py-3.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff7a1f]/50"
                  placeholder="voce@suabanca.com"
                />
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border-0 bg-[#E8F0FE] px-4 py-3.5 pr-12 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff7a1f]/50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Lembrar + Esqueci senha */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#ff7a1f] focus:ring-[#ff7a1f]" />
                  <span className="text-sm text-gray-600">Lembrar de mim</span>
                </label>
                <Link href="/jornaleiro/esqueci-senha" className="text-sm font-medium text-[#00a6c0] hover:underline">
                  Esqueci a Senha
                </Link>
              </div>

              {/* Erro */}
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Botão */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#ff7a1f] hover:bg-[#ff8c3a] px-4 py-3.5 text-base font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff7a1f]/50 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Quer ser um parceiro?{" "}
                <Link href="/jornaleiro/registrar" className="font-semibold text-[#ff7a1f] hover:underline">
                  Cadastre-se aqui
                </Link>
              </p>
            </div>

            {/* Voltar */}
            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
                ← Voltar para a Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

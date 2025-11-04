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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
  if (!mounted || status === "loading" || redirecting) {
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
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://as2.ftcdn.net/v2/jpg/11/20/53/79/1000_F_1120537938_14oq2ICAOJO5rajUWMqFQfV8hsqOnW8Q.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/40" />

      <div className="relative z-10 flex min-h-screen items-stretch">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-12 md:gap-12 md:py-20 md:flex-row md:items-center md:justify-between">
          <div className="text-white md:max-w-xl md:order-1 order-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-white/80">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a7 7 0 0 1-7 7H6a2 2 0 0 1-2-2Z" opacity="0.35" />
                <path d="M7 10h5M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M6 4h12a2 2 0 0 1 2 2v3H4V6a2 2 0 0 1 2-2Z" />
              </svg>
              Portal do Jornaleiro
            </span>
            <h1 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              Você faz tudo pela sua banca. O Guia das Bancas faz por você também.
            </h1>
            <p className="mt-4 text-base text-white/85 sm:text-lg">
              Gerencie pedidos, catálogo e campanhas em um só lugar. Acesse o portal exclusivo para parceiros e impulsione o seu negócio.
            </p>
          </div>

          <div className="w-full max-w-md rounded-3xl bg-white/95 p-8 shadow-2xl backdrop-blur md:order-2 order-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Portal do Parceiro</h2>
              <p className="text-sm text-gray-500">Gerencie sua banca de forma rápida e segura</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-[#ff2d55] focus:outline-none focus:ring-2 focus:ring-[#ff2d55]/40"
                  placeholder="voce@suabanca.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm shadow-sm focus:border-[#ff2d55] focus:outline-none focus:ring-2 focus:ring-[#ff2d55]/40"
                    placeholder="Digite sua senha"
                    aria-describedby="password-visibility-toggle"
                  />
                  <button
                    type="button"
                    id="password-visibility-toggle"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.73 2.1-3.64 3.95-5.22" />
                        <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-" />
                        <path d="M1 1l22 22" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="text-right">
                  <Link href="/jornaleiro/esqueci-senha" className="text-sm font-medium text-[#ff2d55] hover:underline">
                    Esqueci minha senha
                  </Link>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-[#ff6a00] to-[#ff922b] px-4 py-3 text-base font-semibold text-white shadow-lg shadow-[#ff7a1f]/30 transition-all hover:from-[#ff7a1f] hover:to-[#ffad42] focus:outline-none focus:ring-2 focus:ring-[#ff7a1f]/60 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Entrando..." : "Continuar"}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-3 text-center text-sm">
              <Link href="/jornaleiro/esqueci-senha" className="font-medium text-[#ff2d55] hover:underline">
                Preciso de ajuda para acessar
              </Link>
              <p className="text-gray-600">
                Ainda não tem cadastro?
                {" "}
                <Link href="/jornaleiro/registrar" className="font-semibold text-[#ff2d55] hover:underline">
                  Cadastre sua banca
                </Link>
              </p>
              <p className="text-gray-500">
                É cliente?
                {" "}
                <Link href="/minha-conta" className="font-medium text-[#ff2d55] hover:underline">
                  Entrar como cliente
                </Link>
              </p>
              <Link href="/" className="text-gray-400 hover:text-gray-600">
                ← Voltar para a Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

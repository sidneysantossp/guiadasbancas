"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";

function EntrarPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const { data: nextAuthSession } = useSession();
  const fromCheckout = searchParams?.get('checkout') === 'true';
  const redirectParam = searchParams?.get('redirect');

  // Verificar se já está logado
  useEffect(() => {
    try {
      const raw = localStorage.getItem("gb:user");
      if (raw) {
        router.replace("/minha-conta");
      }
    } catch {}
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) { setError("Informe seu e-mail"); return; }
    if (mode === "register" && !name.trim()) { setError("Informe seu nome"); return; }
    
    // REGRA CRÍTICA: Se há sessão NextAuth ativa (jornaleiro/admin), fazer logout primeiro
    if (nextAuthSession?.user) {
      try {
        sessionStorage.clear();
        await nextAuthSignOut({ redirect: false });
      } catch (e) {
        console.error('[Auth] Erro ao fazer logout do NextAuth:', e);
      }
    }
    
    // Mock auth: aceita qualquer email/senha
    // IMPORTANTE: Usar nome real, não parte do email
    const payload = { name: name.trim() || 'Cliente', email };
    try {
      localStorage.setItem("gb:user", JSON.stringify(payload));
      try { window.dispatchEvent(new Event('gb:user:changed')); } catch {}
      if (!localStorage.getItem("gb:userCreatedAt")) {
        const now = new Date().toISOString();
        localStorage.setItem("gb:userCreatedAt", now);
      }
    } catch {}
    
    // Redirecionar - prioridade: 1) parâmetro redirect da URL, 2) checkout, 3) localStorage, 4) minha-conta
    if (redirectParam) {
      router.push(redirectParam as any);
    } else if (fromCheckout) {
      router.push('/checkout');
    } else {
      const redirect = localStorage.getItem("gb:redirectAfterLogin") || "/minha-conta";
      try { localStorage.removeItem("gb:redirectAfterLogin"); } catch {}
      router.push(redirect as any);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Coluna esquerda: imagem + texto (desktop) */}
      <div className="relative hidden lg:flex lg:w-1/2 items-stretch overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1585241936939-be4099591252?q=80&w=1200&auto=format')",
          }}
        />
        {/* Overlay laranja */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[70%] py-12 px-10 bg-[#ff7a1f]/90">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
            BEM-VINDO AO<br />
            <span className="text-white">GUIA DAS BANCAS</span>
          </h1>
          <p className="mt-4 text-white/90 text-lg">
            Sua banca favorita na palma da mão
          </p>
        </div>
      </div>

      {/* Coluna direita: formulário (desktop) / Card centralizado (mobile) */}
      <div className="flex-1 flex items-center justify-center min-h-screen lg:min-h-0 relative">
        {/* Background mobile */}
        <div 
          className="absolute inset-0 lg:hidden bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1585241936939-be4099591252?q=80&w=800&auto=format')",
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
              <div className="flex items-center justify-center gap-2">
                <div className="h-10 w-10 rounded-full bg-[#ff7a1f] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-[#ff7a1f]">Guia das Bancas</span>
              </div>
              <h2 className="mt-6 text-xl font-semibold text-gray-900">
                {mode === "login" ? "Acesse sua Conta" : "Criar nova Conta"}
              </h2>
            </div>

            {/* Mensagem do checkout */}
            {fromCheckout && (
              <div className="mb-6 rounded-lg bg-orange-50 border border-orange-200 p-3">
                <p className="text-sm text-orange-800">
                  Para finalizar seu pedido, faça login ou{" "}
                  <button onClick={() => setMode("register")} className="font-semibold underline">
                    crie uma conta
                  </button>
                </p>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
              {/* Nome (apenas registro) */}
              {mode === "register" && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Seu Nome
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border-0 bg-[#E8F0FE] px-4 py-3.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff7a1f]/50"
                    placeholder="Digite seu nome completo"
                  />
                </div>
              )}

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
                  placeholder="seu@email.com"
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

              {/* Lembrar + Esqueci senha (apenas login) */}
              {mode === "login" && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#ff7a1f] focus:ring-[#ff7a1f]" />
                    <span className="text-sm text-gray-600">Lembrar de mim</span>
                  </label>
                  <Link href="/esqueci-senha" className="text-sm font-medium text-[#00a6c0] hover:underline">
                    Esqueci a Senha
                  </Link>
                </div>
              )}

              {/* Erro */}
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Botão */}
              <button
                type="submit"
                className="w-full rounded-lg bg-[#ff7a1f] hover:bg-[#ff8c3a] px-4 py-3.5 text-base font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff7a1f]/50 focus:ring-offset-2"
              >
                {mode === "login" ? "Entrar" : "Criar Conta"}
              </button>
            </form>

            {/* Alternar login/registro */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {mode === "login" ? (
                  <>
                    Não tem conta?{" "}
                    <button onClick={() => setMode("register")} className="font-semibold text-[#ff7a1f] hover:underline">
                      Crie agora
                    </button>
                  </>
                ) : (
                  <>
                    Já tem conta?{" "}
                    <button onClick={() => setMode("login")} className="font-semibold text-[#ff7a1f] hover:underline">
                      Entrar
                    </button>
                  </>
                )}
              </p>
            </div>

            {/* Links jornaleiro e distribuidor */}
            <div className="mt-4 pt-4 border-t border-gray-200 text-center space-y-2">
              <p className="text-sm text-gray-600">
                É jornaleiro?{" "}
                <Link href="/jornaleiro" className="font-semibold text-[#ff7a1f] hover:underline">
                  Acesse o painel aqui
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                É distribuidor?{" "}
                <Link href="/distribuidor" className="font-semibold text-blue-600 hover:underline">
                  Acesse o portal
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

export default function EntrarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <EntrarPageContent />
    </Suspense>
  );
}

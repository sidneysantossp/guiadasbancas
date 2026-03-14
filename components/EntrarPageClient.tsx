"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import type { Route } from "next";
import {
  clearDistribuidorClientAuth,
  hydrateDistribuidorClientAuth,
  persistDistribuidorClientAuth,
} from "@/lib/distribuidor-client-auth";

type EntrarPageClientProps = {
  audience?: "cliente" | "distribuidor";
};

function resolveDashboardByRole(role?: string): string {
  if (role === "jornaleiro" || role === "seller") return "/jornaleiro/dashboard";
  if (role === "admin") return "/admin/dashboard";
  return "/minha-conta";
}

function EntrarPageContent({ audience = "cliente" }: EntrarPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionState = useSession();
  const session = audience === "distribuidor" ? null : sessionState?.data;
  const status =
    audience === "distribuidor"
      ? "unauthenticated"
      : (sessionState?.status ?? "unauthenticated");
  
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const fromCheckout = searchParams?.get('checkout') === 'true';
  const redirectParam = searchParams?.get('redirect');
  const callbackUrlParam = searchParams?.get('callbackUrl');
  const redirectTarget = redirectParam || callbackUrlParam;
  const registerHref = redirectTarget
    ? `/registrar/cliente?redirect=${encodeURIComponent(redirectTarget)}`
    : fromCheckout
      ? "/registrar/cliente?redirect=/checkout"
      : "/registrar";
  const chooseAccessHref = redirectTarget
    ? `/entrar?redirect=${encodeURIComponent(redirectTarget)}`
    : fromCheckout
      ? "/entrar?checkout=true"
      : "/entrar";
  const title =
    audience === "distribuidor"
      ? "Entrar no portal do distribuidor"
      : "Entrar na sua conta";
  const description =
    audience === "distribuidor"
      ? "Acesse seu portal para continuar operando."
      : "Acesse sua conta para continuar comprando";
  const loginIdentifierLabel =
    audience === "distribuidor" ? "E-mail ou identificador" : "E-mail";
  const loginIdentifierPlaceholder =
    audience === "distribuidor" ? "seu@email.com ou nome do distribuidor" : "seu@email.com";

  // Redirecionar se já está logado
  useEffect(() => {
    if (audience === "distribuidor") {
      void hydrateDistribuidorClientAuth().then((distribuidor) => {
        if (distribuidor?.id) {
          router.replace("/distribuidor/dashboard");
        }
      });
      return;
    }

    if (status === "authenticated" && session?.user) {
      const role = (session.user as any)?.role;

      // Se houver sessão NextAuth ativa, limpar autenticação antiga de distribuidor
      clearDistribuidorClientAuth();

      // Cliente comum - respeitar redirect explicitamente
      if (redirectTarget) {
        router.replace(redirectTarget);
      } else if (fromCheckout) {
        router.replace("/checkout");
      } else {
        router.replace(resolveDashboardByRole(role));
      }
      return;
    }

    // Sessão local do distribuidor (não usa NextAuth)
    if (status === "unauthenticated") {
      void hydrateDistribuidorClientAuth().then((distribuidor) => {
        if (distribuidor?.id) {
          router.replace("/distribuidor/dashboard");
        }
      });
    }
  }, [audience, status, session, router, redirectTarget, fromCheckout]);

  // Limpar dados antigos do localStorage ao carregar
  useEffect(() => {
    // Limpar dados de autenticação antiga baseada em localStorage
    try {
      localStorage.removeItem("gb:user");
      localStorage.removeItem("gb:userProfile");
      localStorage.removeItem("gb:userCreatedAt");
    } catch {}
  }, []);

  useEffect(() => {
    if (searchParams?.get("registered") === "true") {
      setSuccessMessage("Conta criada com sucesso. Faça login para continuar.");
    }
  }, [searchParams]);

  async function handleRegister() {
    setError(null);
    setSuccessMessage(null);
    
    if (!name.trim()) {
      setError("Informe seu nome completo");
      return;
    }
    
    if (!email.trim()) {
      setError("Informe seu e-mail");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Informe um e-mail válido");
      return;
    }
    
    if (!password.trim()) {
      setError("Informe sua senha");
      return;
    }
    
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("As senhas não conferem");
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. Criar conta via API
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
          full_name: name.trim(),
          role: "cliente", // Usuário comum
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Erro ao criar conta");
        setLoading(false);
        return;
      }
      
      // 2. Fazer login automaticamente após registro
      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password: password,
      });
      
      if (result?.error) {
        setSuccessMessage("Conta criada com sucesso! Faça login para continuar.");
        setMode("login");
        setPassword("");
        setConfirmPassword("");
      } else if (result?.ok) {
        // Login bem-sucedido - o useEffect vai redirecionar
      }
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    setError(null);
    setSuccessMessage(null);
    
    if (!email.trim()) {
      setError(audience === "distribuidor" ? "Informe seu e-mail ou identificador" : "Informe seu e-mail");
      return;
    }

    const normalizedIdentifier = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (audience !== "distribuidor" && !emailRegex.test(normalizedIdentifier)) {
      setError("Informe um e-mail válido");
      return;
    }
    
    if (!password.trim()) {
      setError("Informe sua senha");
      return;
    }
    
    setLoading(true);
    
    try {
      if (audience === "distribuidor") {
        const distRes = await fetch("/api/distribuidor/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: normalizedIdentifier,
            password,
          }),
        });

        const distData = await distRes.json().catch(() => ({}));

        if (distRes.ok && distData?.success && distData?.distribuidor) {
          persistDistribuidorClientAuth({
            distribuidor: distData.distribuidor,
          });
          router.replace("/distribuidor/dashboard");
          return;
        }

        setError("Identificador ou senha incorretos");
        return;
      }

      // Primeiro tenta login unificado via NextAuth (cliente/jornaleiro/admin)
      const result = await signIn("credentials", {
        redirect: false,
        email: normalizedIdentifier,
        password: password,
      });

      if (result?.ok) {
        return; // useEffect cuidará do redirecionamento
      }

      setError("E-mail ou senha incorretos");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (mode === "register") {
      await handleRegister();
    } else {
      await handleLogin();
    }
  }

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
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
            backgroundImage: "url('https://images.unsplash.com/photo-1585241936939-be4099591252?q=80&w=1200&auto=format')",
          }}
        />
        <div className="absolute inset-0 lg:hidden bg-black/40" />
        
        {/* Card do formulário */}
        <div className="relative z-10 w-full max-w-md mx-4 lg:mx-auto px-6 py-8 bg-white rounded-2xl shadow-xl lg:shadow-none lg:rounded-none lg:bg-transparent">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-6">
            <h1 className="text-2xl font-bold text-[#ff7a1f]">Guia das Bancas</h1>
          </div>

          {/* Título */}
          <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">{title}</h2>
          <p className="mt-2 text-gray-600">{description}</p>

          {/* Mensagem de sucesso */}
          {successMessage && (
            <div className="mt-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {/* Nome (apenas registro) */}
            {mode === "register" && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border-0 bg-[#E8F0FE] px-4 py-3.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff7a1f]/50"
                  placeholder="Seu nome completo"
                  disabled={loading}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {loginIdentifierLabel}
              </label>
              <input
                id="email"
                type={audience === "distribuidor" ? "text" : "email"}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border-0 bg-[#E8F0FE] px-4 py-3.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff7a1f]/50"
                placeholder={loginIdentifierPlaceholder}
                disabled={loading}
              />
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
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

            {/* Confirmar senha (apenas registro) */}
            {mode === "register" && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar senha
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border-0 bg-[#E8F0FE] px-4 py-3.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff7a1f]/50"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            )}

            {/* Lembrar + Esqueci senha (apenas login) */}
            {mode === "login" && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#ff7a1f] focus:ring-[#ff7a1f]" />
                  <span className="text-sm text-gray-600">Lembrar de mim</span>
                </label>
                {audience === "cliente" ? (
                  <Link href="/esqueci-senha" className="text-sm font-medium text-[#00a6c0] hover:underline">
                    Esqueci a Senha
                  </Link>
                ) : (
                  <span className="text-sm text-gray-400">Suporte via equipe comercial</span>
                )}
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
              disabled={loading}
              className="w-full rounded-lg bg-[#ff7a1f] hover:bg-[#ff8c3a] disabled:bg-gray-400 px-4 py-3.5 text-base font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff7a1f]/50 focus:ring-offset-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {mode === "login" ? "Entrando..." : "Criando conta..."}
                </span>
              ) : (
                mode === "login" ? "Entrar" : "Criar Conta"
              )}
            </button>
          </form>

          {/* Alternar login/registro */}
          <div className="mt-6 text-center">
            {audience === "cliente" ? (
              <p className="text-sm text-gray-600">
                {mode === "login" ? (
                  <>
                    Não tem conta?{" "}
                    <Link
                      href={registerHref as Route}
                      className="font-semibold text-[#ff7a1f] hover:underline"
                    >
                      Escolha seu cadastro
                    </Link>
                  </>
                ) : (
                  <>
                    Já tem conta?{" "}
                    <button 
                      onClick={() => { setMode("login"); setError(null); setSuccessMessage(null); }} 
                      className="font-semibold text-[#ff7a1f] hover:underline"
                      disabled={loading}
                    >
                      Entrar
                    </button>
                  </>
                )}
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Precisa acessar outra área?{" "}
                <Link
                  href={chooseAccessHref as Route}
                  className="font-semibold text-[#ff7a1f] hover:underline"
                >
                  Escolha o tipo de acesso
                </Link>
              </p>
            )}
          </div>

          {audience === "cliente" && (
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Vai acessar o painel da banca?{" "}
                <Link
                  href={chooseAccessHref as Route}
                  className="font-semibold text-[#ff7a1f] hover:underline"
                >
                  Escolha outro tipo de acesso
                </Link>
              </p>
            </div>
          )}

          {/* Voltar */}
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
              ← Voltar para a Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EntrarPageClient(props: EntrarPageClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <EntrarPageContent {...props} />
    </Suspense>
  );
}

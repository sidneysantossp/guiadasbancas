"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Hedvig_Letters_Serif } from "next/font/google";
import { IconTruck } from "@tabler/icons-react";

const hedvig = Hedvig_Letters_Serif({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
  fallback: ["serif"],
});

export default function DistribuidorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Buscar distribuidor pelo email
      const res = await fetch('/api/distribuidor/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Credenciais inválidas');
        setLoading(false);
        return;
      }

      // Salvar dados do distribuidor no localStorage
      localStorage.setItem("gb:distribuidorAuth", "1");
      localStorage.setItem("gb:distribuidor", JSON.stringify(data.distribuidor));
      
      router.push('/distribuidor/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Coluna esquerda: imagem + texto (desktop) */}
      <div className="relative hidden lg:flex lg:w-1/2 items-stretch overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format')",
          }}
        />
        {/* Overlay azul */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[70%] py-12 px-10 bg-[#1e3a5f]/90">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
            PORTAL DO<br />
            <span className="text-blue-300">DISTRIBUIDOR</span>
          </h1>
          <p className="mt-4 text-white/90 text-lg">
            Gerencie seus produtos, pedidos e bancas parceiras
          </p>
        </div>
      </div>

      {/* Coluna direita: formulário */}
      <div className="flex-1 flex items-center justify-center min-h-screen lg:min-h-0 relative">
        {/* Background mobile */}
        <div 
          className="absolute inset-0 lg:hidden bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format')",
          }}
        />
        <div className="absolute inset-0 lg:hidden bg-[#1e3a5f]/70" />

        {/* Card do formulário */}
        <div className="relative z-10 w-full max-w-md mx-4 lg:mx-0 bg-white rounded-3xl lg:rounded-none lg:bg-transparent shadow-2xl lg:shadow-none">
          <div className="relative px-8 py-10 lg:px-12 lg:py-0">
            {/* Logo e título */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2">
                <div className="h-12 w-12 rounded-full bg-[#1e3a5f] flex items-center justify-center">
                  <IconTruck className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className={`text-2xl tracking-wide lowercase ${hedvig.className} text-black`}>
                  <span className="font-bold text-[#ff5c00]">g</span>uia das bancas
                </span>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Portal do Distribuidor
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Acesse sua conta para gerenciar sua operação
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border-0 bg-[#E8F0FE] px-4 py-3.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
                    className="w-full rounded-lg border-0 bg-[#E8F0FE] px-4 py-3.5 pr-12 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
                className="w-full rounded-lg bg-[#1e3a5f] hover:bg-[#2a4a73] disabled:opacity-50 px-4 py-3.5 text-base font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center space-y-3">
              <p className="text-sm text-gray-600">
                Não tem acesso?{" "}
                <a href="mailto:contato@guiadasbancas.com" className="font-semibold text-blue-600 hover:underline">
                  Entre em contato
                </a>
              </p>
              <Link href="/" className="block text-sm text-gray-400 hover:text-gray-600">
                ← Voltar para a Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

export default function JornaleiroLoginPage() {
  const router = useRouter();
  const { user, profile, signIn, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Se já está autenticado como jornaleiro, redireciona
  useEffect(() => {
    if (!authLoading && user && profile?.role === 'jornaleiro') {
      router.replace("/jornaleiro/dashboard");
    }
  }, [user, profile, authLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log('🔐 Tentando login jornaleiro:', email);
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        setError(signInError.message || "Erro ao fazer login");
        setLoading(false);
        return;
      }

      // Aguardar perfil carregar
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
      setLoading(false);
    }
  };

  // Se está carregando auth, mostra loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="text-4xl font-bold text-orange-600">
              Guia das Bancas
            </div>
          </Link>
          <p className="mt-2 text-gray-600">Painel do Jornaleiro</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
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
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="••••••••"
              />
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
              className="w-full flex items-center justify-center px-4 py-3 border border-orange-300 rounded-lg text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors"
            >
              📊 Cadastrar minha banca
            </Link>
          </div>

          {/* Link para Debug */}
          <div className="mt-4 text-center">
            <Link
              href="/debug/auth"
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              🔧 Página de Debug
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
      </div>
    </div>
  );
}

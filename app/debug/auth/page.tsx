"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DebugAuthPage() {
  const [email, setEmail] = useState("teste@jornaleiro.com");
  const [password, setPassword] = useState("senha123");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult({ status: "Testando conexão..." });

    try {
      // 1. Testar conexão básica
      const { data: healthCheck, error: healthError } = await supabase
        .from("user_profiles")
        .select("count")
        .limit(1);

      if (healthError) {
        setResult({
          status: "❌ ERRO DE CONEXÃO",
          error: healthError.message,
          details: healthError,
        });
        setLoading(false);
        return;
      }

      setResult({
        status: "✅ Conexão OK",
        message: "Supabase está respondendo",
      });
    } catch (error: any) {
      setResult({
        status: "❌ ERRO",
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setResult({ status: "Tentando login..." });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setResult({
          status: "❌ ERRO NO LOGIN",
          error: error.message,
          code: error.status,
          details: error,
        });
        setLoading(false);
        return;
      }

      setResult({
        status: "✅ LOGIN SUCESSO",
        user: {
          id: data.user?.id,
          email: data.user?.email,
          created_at: data.user?.created_at,
        },
        session: {
          access_token: data.session?.access_token?.substring(0, 20) + "...",
          expires_at: data.session?.expires_at,
        },
      });
    } catch (error: any) {
      setResult({
        status: "❌ EXCEÇÃO",
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const createTestUser = async () => {
    setLoading(true);
    setResult({ status: "Criando usuário de teste..." });

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: "Usuário Teste",
            role: "jornaleiro",
          },
        },
      });

      if (error) {
        setResult({
          status: "❌ ERRO AO CRIAR USUÁRIO",
          error: error.message,
          details: error,
        });
        setLoading(false);
        return;
      }

      setResult({
        status: "✅ USUÁRIO CRIADO",
        user: {
          id: data.user?.id,
          email: data.user?.email,
          created_at: data.user?.created_at,
        },
        message: "Agora tente fazer login!",
      });
    } catch (error: any) {
      setResult({
        status: "❌ EXCEÇÃO",
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const checkEnvVars = () => {
    setResult({
      status: "🔍 VARIÁVEIS DE AMBIENTE",
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? "✅ Definida"
        : "❌ Não definida",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? "✅ Definida (" +
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) +
          "...)"
        : "❌ Não definida",
      url_value: process.env.NEXT_PUBLIC_SUPABASE_URL,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Debug de Autenticação</h1>

        {/* Variáveis de Ambiente */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">1. Variáveis de Ambiente</h2>
          <button
            onClick={checkEnvVars}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Verificar Variáveis
          </button>
        </div>

        {/* Teste de Conexão */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">2. Teste de Conexão</h2>
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Testando..." : "Testar Conexão"}
          </button>
        </div>

        {/* Criar Usuário */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">3. Criar Usuário de Teste</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <button
              onClick={createTestUser}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Criando..." : "Criar Usuário"}
            </button>
          </div>
        </div>

        {/* Teste de Login */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">4. Teste de Login</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <button
              onClick={testLogin}
              disabled={loading}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? "Testando..." : "Testar Login"}
            </button>
          </div>
        </div>

        {/* Resultado */}
        {result && (
          <div className="bg-gray-900 text-green-400 rounded-lg shadow p-6 font-mono text-sm">
            <h2 className="text-xl font-semibold mb-4 text-white">Resultado:</h2>
            <pre className="whitespace-pre-wrap overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {/* Instruções */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">📝 Instruções:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
            <li>Primeiro, verifique as variáveis de ambiente</li>
            <li>Teste a conexão com o Supabase</li>
            <li>Crie um usuário de teste</li>
            <li>Tente fazer login com o usuário criado</li>
            <li>Se tudo funcionar, use as mesmas credenciais em /login</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

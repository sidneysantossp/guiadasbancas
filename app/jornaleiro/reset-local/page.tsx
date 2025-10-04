"use client";

import { useState } from "react";

export default function ResetLocalPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setMessage(null); setLoading(true);
    console.log("🔧 Iniciando reset para:", email);
    
    try {
      const res = await fetch("/api/admin/test-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      console.log("📡 Response status:", res.status);
      const data = await res.json();
      console.log("📦 Response data:", data);
      
      if (!res.ok || data.error) {
        const errorMsg = data.hint 
          ? `${data.error}\n\nDica: ${data.hint}` 
          : (data.error || "Falha ao redefinir senha");
        setError(errorMsg);
      } else {
        setMessage("✅ Senha redefinida com sucesso! Você já pode fazer login.");
        setEmail("");
        setPassword("");
      }
    } catch (e: any) {
      console.error("❌ Exception:", e);
      setError(`Erro de rede: ${e?.message || "Erro inesperado"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Redefinir senha (local)</h1>
        <p className="text-sm text-gray-600 mb-6">Apenas para ambiente local/desenvolvimento.</p>

        {process.env.NEXT_PUBLIC_ALLOW_LOCAL_RESET !== "true" && (
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 text-amber-800 text-sm px-3 py-2">
            Ative a variável <code>ALLOW_LOCAL_RESET=true</code> no seu .env.local e reinicie o servidor.
          </div>
        )}

        {message && (
          <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm px-3 py-2">{message}</div>
        )}
        {error && (
          <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 text-rose-700 text-sm px-3 py-2">{error}</div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="usuario@exemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nova senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="8+ caracteres"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.73 2.1-3.64 3.95-5.22"/><path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-."></path><path d="M1 1l22 22"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Atualizando..." : "Redefinir senha"}
          </button>
        </form>
      </div>
    </div>
  );
}

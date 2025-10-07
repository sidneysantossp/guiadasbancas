"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null); setError(null); setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/jornaleiro/nova-senha`;
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (err) {
        setError(err.message || "Não foi possível enviar o email de recuperação.");
      } else {
        setMessage("Enviamos um link de redefinição para seu email, caso exista em nosso sistema.");
      }
    } catch (e: any) {
      setError(e?.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Recuperar senha</h1>
        <p className="text-sm text-gray-600 mb-6">Informe o seu email para receber o link de redefinição.</p>

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
              placeholder="seu@email.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar link"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link href="/jornaleiro" className="block text-sm text-orange-700 hover:underline">← Voltar ao login</Link>
          <Link href="/" className="block text-sm text-gray-500 hover:text-gray-700 underline">← Voltar para Home</Link>
        </div>
      </div>
    </div>
  );
}

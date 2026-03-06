"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/admin/ToastProvider";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

export default function ApiKeysPage() {
  const toast = useToast();
  const [keys, setKeys] = useState({
    groq: "",
    groqModel: "llama-3.1-8b-instant",
    openai: "",
    gemini: "",
    deepseek: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      const res = await fetchAdminWithDevFallback("/api/admin/settings/api-keys", {
        cache: "no-store",
      });
      const json = await res.json();
      if (json.success) {
        setKeys({
          groq: json.data.groq || "",
          groqModel: json.data.groqModel || "llama-3.1-8b-instant",
          openai: json.data.openai || "",
          gemini: json.data.gemini || "",
          deepseek: json.data.deepseek || ""
        });
      }
    } catch (e) {
      console.error(e);
      // Silently fail on load error or show generic message
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetchAdminWithDevFallback("/api/admin/settings/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(keys)
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Chaves salvas com sucesso");
      } else {
        throw new Error(json.error || "Erro ao salvar");
      }
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar chaves");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Chaves de API</h1>
        <p className="text-gray-600">Configure as chaves para integração com serviços de IA.</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-white p-2 text-orange-600 shadow-sm">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Provedor recomendado para o editor com IA</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Quando a chave da Groq estiver preenchida, ela passa a ser usada automaticamente
                  no recurso <span className="font-medium">Gerar com IA</span> do cadastro e da edição de produtos.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Groq API Key</label>
            <input
              type="password"
              value={keys.groq}
              onChange={e => setKeys({ ...keys, groq: e.target.value })}
              placeholder="gsk_..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Usada como provedor preferencial do botão "Gerar com IA".</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo Groq</label>
            <input
              type="text"
              value={keys.groqModel}
              onChange={e => setKeys({ ...keys, groqModel: e.target.value })}
              placeholder="llama-3.1-8b-instant"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Sugestão inicial: <code>llama-3.1-8b-instant</code>.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OpenAI API Key</label>
            <input
              type="password"
              value={keys.openai}
              onChange={e => setKeys({...keys, openai: e.target.value})}
              placeholder="sk-..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Usada para geração de textos e descrições.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gemini API Key (Google)</label>
            <input
              type="password"
              value={keys.gemini}
              onChange={e => setKeys({...keys, gemini: e.target.value})}
              placeholder="AIza..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">DeepSeek API Key</label>
            <input
              type="password"
              value={keys.deepseek}
              onChange={e => setKeys({...keys, deepseek: e.target.value})}
              placeholder="sk-..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#ff5c00] text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

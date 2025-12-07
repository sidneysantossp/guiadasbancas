"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/admin/ToastProvider";

export default function ApiKeysPage() {
  const toast = useToast();
  const [keys, setKeys] = useState({
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
      const res = await fetch("/api/admin/settings/api-keys");
      const json = await res.json();
      if (json.success) {
        setKeys({
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
      const res = await fetch("/api/admin/settings/api-keys", {
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

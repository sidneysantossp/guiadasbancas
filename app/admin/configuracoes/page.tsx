"use client";

import { useEffect, useState } from "react";

type Setting = {
  id: string;
  key: string;
  value: string;
  description: string;
  is_secret: boolean;
};

export default function AdminConfiguracoesPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings?keys=asaas_api_key,asaas_environment");
      const data = await res.json();
      if (data.success) {
        setSettings(data.data || []);
        const values: Record<string, string> = {};
        data.data?.forEach((s: Setting) => {
          values[s.key] = s.is_secret ? "" : s.value;
        });
        setEditValues(values);
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (key: string) => {
    if (!editValues[key] && settings.find(s => s.key === key)?.is_secret) {
      alert("Por favor, insira um valor para salvar");
      return;
    }

    setSaving(key);
    try {
      const setting = settings.find(s => s.key === key);
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          value: editValues[key],
          description: setting?.description,
          is_secret: setting?.is_secret,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Configuração salva com sucesso!");
        loadSettings();
      } else {
        alert(data.error || "Erro ao salvar");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar configuração");
    } finally {
      setSaving(null);
    }
  };

  const testAsaasConnection = async () => {
    setSaving("test");
    try {
      const res = await fetch("/api/asaas/test-connection", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Conexão OK!\n\nAmbiente: ${data.environment}\nWallet ID: ${data.walletId}`);
      } else {
        alert(`❌ Erro na conexão:\n${data.error}`);
      }
    } catch (error) {
      alert("Erro ao testar conexão");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Configure as integrações da plataforma</p>
      </div>

      {/* Asaas Config */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Asaas - Gateway de Pagamentos</h2>
              <p className="text-sm text-gray-600">Integração para cobranças via PIX, Boleto e Cartão</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Ambiente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ambiente
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="asaas_environment"
                  value="sandbox"
                  checked={editValues.asaas_environment === "sandbox"}
                  onChange={(e) => setEditValues({ ...editValues, asaas_environment: e.target.value })}
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">
                  <span className="font-medium">Sandbox</span>
                  <span className="text-gray-500 ml-1">(testes)</span>
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="asaas_environment"
                  value="production"
                  checked={editValues.asaas_environment === "production"}
                  onChange={(e) => setEditValues({ ...editValues, asaas_environment: e.target.value })}
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">
                  <span className="font-medium">Produção</span>
                  <span className="text-gray-500 ml-1">(real)</span>
                </span>
              </label>
            </div>
            <button
              onClick={() => handleSave("asaas_environment")}
              disabled={saving === "asaas_environment"}
              className="mt-2 text-sm text-green-600 hover:underline disabled:opacity-50"
            >
              {saving === "asaas_environment" ? "Salvando..." : "Salvar ambiente"}
            </button>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key do Asaas
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showSecrets.asaas_api_key ? "text" : "password"}
                  value={editValues.asaas_api_key || ""}
                  onChange={(e) => setEditValues({ ...editValues, asaas_api_key: e.target.value })}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="$aact_..."
                />
                <button
                  type="button"
                  onClick={() => setShowSecrets({ ...showSecrets, asaas_api_key: !showSecrets.asaas_api_key })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecrets.asaas_api_key ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <button
                onClick={() => handleSave("asaas_api_key")}
                disabled={saving === "asaas_api_key"}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {saving === "asaas_api_key" ? "Salvando..." : "Salvar"}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Obtenha sua API Key em{" "}
              <a href="https://www.asaas.com/account/api" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                asaas.com/account/api
              </a>
            </p>
          </div>

          {/* Testar Conexão */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={testAsaasConnection}
              disabled={saving === "test"}
              className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition disabled:opacity-50 flex items-center gap-2"
            >
              {saving === "test" ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Testando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Testar Conexão
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Documentação */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <h3 className="font-semibold text-blue-800">📚 Documentação</h3>
        <p className="text-sm text-blue-700 mt-1">
          Consulte a documentação da API Asaas para mais informações sobre a integração.
        </p>
        <a
          href="https://docs.asaas.com/docs/visao-geral"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-blue-600 hover:underline text-sm"
        >
          Acessar documentação
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}

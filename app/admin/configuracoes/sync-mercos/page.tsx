"use client";

import { useEffect, useState } from "react";

type HealthResult = {
  distribuidor: string;
  success: boolean;
  error?: string;
  latency_ms?: number;
  sample?: {
    id: number;
    nome: string;
    ultima_alteracao?: string;
    saldo_estoque?: number;
    ativo?: boolean;
    excluido?: boolean;
  } | null;
};

type HealthResponse = {
  success: boolean;
  executado_em?: string;
  total?: number;
  resultados?: HealthResult[];
  error?: string;
};

export default function SyncMercosPage() {
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);

  const loadHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/mercos/health');
      const json = await res.json();
      setHealth(json);
    } catch (err) {
      setHealth({ success: false, error: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const runSync = async (full: boolean) => {
    setSyncLoading(true);
    setSyncResult(null);
    try {
      const res = await fetch(`/api/cron/sync-mercos${full ? '?full=true' : ''}`, {
        method: 'POST',
      });
      const json = await res.json();
      setSyncResult(json);
    } catch (err) {
      setSyncResult({ success: false, error: (err as Error).message });
    } finally {
      setSyncLoading(false);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Sync Mercos</h1>
        <p className="text-sm text-gray-600">Healthcheck, sincronização manual e configuração de intervalo.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Healthcheck</h2>
          <p className="text-sm text-gray-600">Valida tokens e leitura de produto (ultima_alteracao desc).</p>
          <button
            onClick={loadHealth}
            disabled={loading}
            className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Checando...' : 'Rodar health agora'}
          </button>
          {health && (
            <div className="mt-4 text-sm">
              {!health.success && <p className="text-red-600">Erro: {health.error}</p>}
              {health.success && (
                <>
                  <p className="text-gray-700">Execução: {health.executado_em}</p>
                  <p className="text-gray-700">Distribuidores: {health.total}</p>
                  <div className="mt-3 space-y-2 max-h-72 overflow-auto pr-1">
                    {health.resultados?.map((r) => (
                      <div key={r.distribuidor} className="rounded-md border p-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{r.distribuidor}</span>
                          <span className={r.success ? 'text-green-600' : 'text-red-600'}>
                            {r.success ? 'OK' : 'Erro'}
                          </span>
                        </div>
                        {r.latency_ms !== undefined && (
                          <p className="text-xs text-gray-600">Latência: {r.latency_ms}ms</p>
                        )}
                        {r.error && <p className="text-xs text-red-600">{r.error}</p>}
                        {r.sample && (
                          <p className="text-xs text-gray-700">Produto: {r.sample.nome} (ID {r.sample.id})</p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Sincronização Manual</h2>
          <p className="text-sm text-gray-600">Dispara o endpoint de sync global já existente.</p>
          <div className="mt-3 flex flex-col gap-2">
            <button
              onClick={() => runSync(false)}
              disabled={syncLoading}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60"
            >
              {syncLoading ? 'Enviando...' : 'Sync incremental'}
            </button>
            <button
              onClick={() => runSync(true)}
              disabled={syncLoading}
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700 disabled:opacity-60"
            >
              {syncLoading ? 'Enviando...' : 'Sync completo (full)'}
            </button>
          </div>
          {syncResult && (
            <div className="mt-3 text-xs max-h-48 overflow-auto pr-1">
              <pre className="whitespace-pre-wrap text-gray-800 bg-gray-50 rounded p-2">
                {JSON.stringify(syncResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Automação (cron)</h2>
          <p className="text-sm text-gray-600">Configure seu cron externo para POST /api/cron/sync-mercos com Authorization: Bearer CRON_SECRET.</p>
          <ul className="mt-3 list-disc pl-4 text-sm text-gray-700 space-y-1">
            <li>Recomendado: */15 * * * * (a cada 15 min) ou conforme carga.</li>
            <li>Healthcheck automático: /api/cron/health-mercos (mesmo header).</li>
            <li>CRON_SECRET deve estar definido no ambiente.</li>
          </ul>
          <p className="mt-3 text-xs text-gray-500">Dica: use cron-job.org ou Vercel Cron para acionar.</p>
        </div>
      </div>
    </div>
  );
}

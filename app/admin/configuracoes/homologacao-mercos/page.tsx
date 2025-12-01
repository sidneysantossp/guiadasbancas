"use client";

import { useEffect, useMemo, useState } from "react";

type Distribuidor = {
  id: string;
  nome: string;
};

type Categoria = {
  id: number;
  nome: string;
  ultima_alteracao?: string;
};

type HealthResponse = {
  success: boolean;
  error?: string;
  distribuidor?: Distribuidor;
  total_categorias?: number;
  encontrados?: number;
  prefix?: string;
  categorias?: Categoria[];
};

type DistribuidoresResponse = {
  success: boolean;
  data?: Distribuidor[];
  error?: string;
};

export default function HomologacaoMercosPage() {
  const [distribuidores, setDistribuidores] = useState<Distribuidor[]>([]);
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [prefix, setPrefix] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HealthResponse | null>(null);

  const currentDist = useMemo(
    () => distribuidores.find((d) => d.id === selected),
    [distribuidores, selected]
  );

  const loadDistribuidores = async () => {
    try {
      const res = await fetch('/api/admin/distribuidores');
      const json = (await res.json()) as DistribuidoresResponse;
      if (json.success && json.data) {
        setDistribuidores(json.data);
        setSelected(json.data[0]?.id);
      }
    } catch (err) {
      console.error('Erro ao carregar distribuidores', err);
    }
  };

  useEffect(() => {
    loadDistribuidores();
  }, []);

  const buscarCategorias = async () => {
    if (!prefix.trim()) {
      setResult({ success: false, error: 'Informe o prefixo informado pela Mercos.' });
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/mercos/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prefix: prefix.trim(), distribuidorId: selected }),
      });
      const json = (await res.json()) as HealthResponse;
      setResult(json);
    } catch (err) {
      setResult({ success: false, error: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Homologação Mercos</h1>
        <p className="text-sm text-gray-600">Auxílio para responder a etapa de categorias (GET) na homologação Mercos.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Categoria de Produto - GET (Etapa 1/3)</h2>
          <p className="text-sm text-gray-600 mt-1">
            Informe o prefixo enviado pela Mercos (campo <strong>nome</strong> que se inicia com...). Vamos buscar no catálogo e listar o nome completo.
          </p>

          <div className="mt-4 flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">Distribuidor Mercos</label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              {distribuidores.map((d) => (
                <option key={d.id} value={d.id}>{d.nome}</option>
              ))}
            </select>

            <label className="text-sm font-medium text-gray-700">Prefixo do campo nome (ex.: 990a65fd)</label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="Digite o prefixo informado pela Mercos"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />

            <button
              onClick={buscarCategorias}
              disabled={loading}
              className="w-full md:w-auto rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? 'Buscando...' : 'Buscar categorias'}
            </button>
          </div>

          {result && (
            <div className="mt-4 rounded-lg border bg-gray-50 p-3 text-sm">
              {!result.success && <p className="text-red-600">Erro: {result.error}</p>}
              {result.success && (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    Distribuidor: <strong>{result.distribuidor?.nome || currentDist?.nome}</strong>
                  </p>
                  <p className="text-gray-700">Prefixo: {result.prefix}</p>
                  <p className="text-gray-700">Total categorias (Mercos): {result.total_categorias}</p>
                  <p className="text-gray-700">Encontrados com prefixo: {result.encontrados}</p>

                  <div className="mt-2 max-h-72 overflow-auto rounded border bg-white">
                    <table className="min-w-full text-xs">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">ID</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">Nome completo</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">Última alteração</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.categorias?.map((cat) => (
                          <tr key={cat.id} className="border-b last:border-0">
                            <td className="px-3 py-2 align-top font-mono">{cat.id}</td>
                            <td className="px-3 py-2 align-top">{cat.nome}</td>
                            <td className="px-3 py-2 align-top text-gray-600">{cat.ultima_alteracao || '-'}</td>
                          </tr>
                        ))}
                        {(!result.categorias || result.categorias.length === 0) && (
                          <tr>
                            <td colSpan={3} className="px-3 py-4 text-center text-gray-500">Nenhuma categoria encontrada com esse prefixo.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold">Como usar (Homologação)</h3>
          <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-gray-700">
            <li>No painel da Mercos, copie o prefixo indicado (campo nome inicia com ...).</li>
            <li>Cole o prefixo, escolha o distribuidor e clique em “Buscar categorias”.</li>
            <li>Use o nome completo exibido para responder no portal de homologação.</li>
            <li>Se não aparecer, rode uma sincronização de categorias na Mercos e tente novamente.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function DebugMercosPage() {
  const params = useParams();
  const router = useRouter();
  const distribuidorId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(5);

  const fetchDebugData = async () => {
    setLoading(true);
    setError("");
    try {
      const url = `/api/admin/distribuidores/${distribuidorId}/mercos-raw-debug?limit=${limit}${
        searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""
      }`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Erro ao buscar dados");
        return;
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebugData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/admin/distribuidores/${distribuidorId}/sync`}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Voltar para sincronização
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold mb-2">Debug API Mercos</h1>
        <p className="text-gray-600 mb-6">
          Visualize os dados brutos retornados pela API Mercos para diagnosticar problemas
        </p>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar produto
            </label>
            <input
              type="text"
              placeholder="Ex: TJ02, código ou nome"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value) || 5)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchDebugData}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Carregando..." : "Buscar"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            <strong>Erro:</strong> {error}
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Distribuidor */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-2">Distribuidor</h2>
              <div className="text-sm space-y-1">
                <div><strong>ID:</strong> {result.distribuidor.id}</div>
                <div><strong>Nome:</strong> {result.distribuidor.name}</div>
                <div><strong>Base URL:</strong> {result.distribuidor.base_url}</div>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-2">Estatísticas</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {result.estatisticas.total_retornados}
                  </div>
                  <div className="text-sm text-gray-600">Total retornados</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {result.estatisticas.com_codigo}
                  </div>
                  <div className="text-sm text-gray-600">Com código</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {result.estatisticas.sem_codigo}
                  </div>
                  <div className="text-sm text-gray-600">Sem código</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {result.estatisticas.percentual_com_codigo}%
                  </div>
                  <div className="text-sm text-gray-600">% com código</div>
                </div>
              </div>
            </div>

            {/* Campos disponíveis */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-2">Campos Disponíveis na API</h2>
              <div className="flex flex-wrap gap-2">
                {result.campos_disponiveis.map((campo: string) => (
                  <span
                    key={campo}
                    className={`px-2 py-1 text-xs rounded ${
                      campo === "codigo"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {campo}
                  </span>
                ))}
              </div>
            </div>

            {/* Exemplos */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-2">Exemplos de Produtos</h2>
              <div className="space-y-4">
                {result.exemplos.produto_com_codigo && (
                  <div>
                    <h3 className="text-sm font-semibold text-green-700 mb-1">
                      ✅ Produto COM código
                    </h3>
                    <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                      {JSON.stringify(result.exemplos.produto_com_codigo, null, 2)}
                    </pre>
                  </div>
                )}
                {result.exemplos.produto_sem_codigo && (
                  <div>
                    <h3 className="text-sm font-semibold text-red-700 mb-1">
                      ❌ Produto SEM código
                    </h3>
                    <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                      {JSON.stringify(result.exemplos.produto_sem_codigo, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Produtos no banco sem codigo_mercos */}
            {result.produtos_db_sem_codigo && result.produtos_db_sem_codigo.length > 0 && (
              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <h2 className="font-semibold text-lg mb-2 text-orange-800">
                  ⚠️ Produtos no Banco SEM codigo_mercos
                </h2>
                <p className="text-sm text-orange-700 mb-3">
                  Estes produtos estão no banco mas não têm codigo_mercos, então o upload de
                  imagens não funcionará para eles.
                </p>
                <div className="space-y-2">
                  {result.produtos_db_sem_codigo.map((p: any) => (
                    <div key={p.id} className="bg-white p-2 rounded text-sm">
                      <div><strong>Nome:</strong> {p.name}</div>
                      <div><strong>Mercos ID:</strong> {p.mercos_id}</div>
                      <div className="text-red-600"><strong>Código Mercos:</strong> {p.codigo_mercos || "(vazio)"}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Produtos RAW */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-2">Produtos RAW da API</h2>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto max-h-96">
                {JSON.stringify(result.produtos_raw, null, 2)}
              </pre>
            </div>

            {/* Dica */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <p className="text-sm text-blue-800">
                <strong>💡 Dica:</strong> {result.dica}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

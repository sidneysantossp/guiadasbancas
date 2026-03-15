'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchAdminWithDevFallback } from '@/lib/admin-client-fetch';

type Produto = {
  id: string;
  name: string;
  codigo_mercos: string;
  mercos_id: number | null;
  distribuidor_id: string | null;
  active: boolean;
  created_at: string;
};

type Stats = {
  totalSemImagem: number;
  totalComImagem: number;
  totalComCodigo: number;
  percentualSemImagem: string;
};

export default function ProdutosSemImagensPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [distribuidores, setDistribuidores] = useState<{ id: string; nome: string }[]>([]);
  const [selectedDistribuidor, setSelectedDistribuidor] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const ITEMS_PER_PAGE = 50;

  // Buscar distribuidores
  useEffect(() => {
    const fetchDistribuidores = async () => {
      try {
        const res = await fetchAdminWithDevFallback('/api/admin/distribuidores');
        const json = await res.json();
        if (json.data) {
          setDistribuidores(json.data);
        }
      } catch (error) {
        console.error('Erro ao buscar distribuidores:', error);
      }
    };
    fetchDistribuidores();
  }, []);

  // Buscar produtos sem imagens
  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          limit: ITEMS_PER_PAGE.toString(),
          offset: ((currentPage - 1) * ITEMS_PER_PAGE).toString(),
        });
        if (selectedDistribuidor) {
          params.set('distribuidor_id', selectedDistribuidor);
        }

        const res = await fetchAdminWithDevFallback(`/api/admin/produtos/sem-imagens?${params.toString()}`);
        const json = await res.json();

        if (json.success) {
          setProdutos(json.data || []);
          setStats(json.stats);
          setTotalProdutos(json.pagination?.total || 0);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, [currentPage, selectedDistribuidor]);

  // Filtrar produtos por busca local
  const filteredProdutos = searchTerm
    ? produtos.filter(p => 
        p.codigo_mercos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : produtos;

  const totalPages = Math.ceil(totalProdutos / ITEMS_PER_PAGE);

  const handleExportCSV = () => {
    const params = new URLSearchParams({ export: 'csv' });
    if (selectedDistribuidor) {
      params.set('distribuidor_id', selectedDistribuidor);
    }
    const exportUrl = `/api/admin/produtos/sem-imagens?${params.toString()}`;

    void fetchAdminWithDevFallback(exportUrl)
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error || 'Erro ao exportar CSV');
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = objectUrl;
        anchor.download = `produtos-sem-imagens-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(objectUrl);
      })
      .catch((error) => {
        console.error('Erro ao exportar CSV:', error);
        alert(error.message || 'Erro ao exportar CSV');
      });
  };

  const copyAllCodigos = () => {
    const codigos = filteredProdutos.map(p => p.codigo_mercos).join('\n');
    navigator.clipboard.writeText(codigos);
    alert(`${filteredProdutos.length} códigos copiados para a área de transferência!`);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos sem Imagens</h1>
          <p className="mt-1 text-sm text-gray-600">
            Lista de produtos com código Mercos que não possuem imagens vinculadas
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/produtos/upload-imagens"
            className="px-4 py-2 text-sm font-medium text-white bg-[#ff5c00] rounded-lg hover:bg-[#e55400]"
          >
            📤 Upload de Imagens
          </Link>
          <Link
            href="/admin/produtos"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Voltar
          </Link>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-2xl font-bold text-red-700">{stats.totalSemImagem.toLocaleString()}</div>
            <div className="text-sm text-red-600">Sem imagem</div>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{stats.totalComImagem.toLocaleString()}</div>
            <div className="text-sm text-green-600">Com imagem</div>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{stats.totalComCodigo.toLocaleString()}</div>
            <div className="text-sm text-blue-600">Total com código</div>
          </div>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="text-2xl font-bold text-orange-700">{stats.percentualSemImagem}</div>
            <div className="text-sm text-orange-600">% sem imagem</div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Distribuidor</label>
          <select
            value={selectedDistribuidor}
            onChange={(e) => {
              setSelectedDistribuidor(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#ff5c00] focus:border-[#ff5c00]"
          >
            <option value="">Todos os distribuidores</option>
            {distribuidores.map((d) => (
              <option key={d.id} value={d.id}>{d.nome}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código ou nome..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#ff5c00] focus:border-[#ff5c00]"
          />
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          📥 Exportar CSV
        </button>

        <button
          onClick={copyAllCodigos}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          📋 Copiar Códigos
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando...</div>
        ) : filteredProdutos.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'Nenhum produto encontrado com esse filtro' : 'Nenhum produto sem imagem encontrado'}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Código</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nome do Produto</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mercos ID</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProdutos.map((produto) => (
                    <tr key={produto.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-[#ff5c00]">
                          {produto.codigo_mercos}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-md truncate">
                        {produto.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                        {produto.mercos_id || '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          produto.active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {produto.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, totalProdutos)} de {totalProdutos.toLocaleString()} produtos
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Dicas */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-900 mb-2">💡 Dicas para vincular imagens:</h3>
        <ol className="list-decimal list-inside text-sm text-yellow-800 space-y-1">
          <li>Exporte a lista de códigos usando o botão "Exportar CSV" ou "Copiar Códigos"</li>
          <li>Renomeie as imagens com os códigos correspondentes (ex: <code className="bg-yellow-100 px-1 rounded">AKOTO001.jpg</code>)</li>
          <li>Use a página de <Link href="/admin/produtos/upload-imagens" className="text-[#ff5c00] underline">Upload de Imagens</Link> para vincular automaticamente</li>
        </ol>
      </div>
    </div>
  );
}

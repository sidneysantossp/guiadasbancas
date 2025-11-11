'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFetchAuth } from '@/lib/hooks/useFetchAuth';
import CotistaStatusAlert from '@/components/CotistaStatusAlert';

interface ProdutoDistribuidor {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_qty: number;
  images: string[];
  mercos_id: number;
  distribuidor_id: string;
  enabled: boolean;
  custom_price: number | null;
  custom_description: string | null;
  custom_status: string;
  custom_pronta_entrega: boolean;
  custom_sob_encomenda: boolean;
  custom_pre_venda: boolean;
  custom_stock_enabled: boolean;
  custom_stock_qty: number | null;
  modificado_em: string | null;
  customizacao_id: string | null;
  distribuidor_price: number;
  effective_price: number;
  track_stock: boolean;
  pronta_entrega: boolean;
  sob_encomenda: boolean;
  pre_venda: boolean;
}

export default function CatalogoDistribuidorPage() {
  const router = useRouter();
  const fetchAuth = useFetchAuth();
  const [produtos, setProdutos] = useState<ProdutoDistribuidor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [isCotista, setIsCotista] = useState(false);

  useEffect(() => {
    loadProdutos();
  }, []);

  const loadProdutos = async () => {
    try {
      const response = await fetchAuth('/api/jornaleiro/catalogo-distribuidor');
      const data = await response.json();

      if (data.success) {
        setProdutos(data.data || data.products || []);
        setIsCotista(data.is_cotista === true);
      } else {
        alert('Erro ao carregar produtos: ' + data.error);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      alert('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (productId: string, currentEnabled: boolean) => {
    setUpdating(productId);
    try {
      const response = await fetchAuth(`/api/jornaleiro/catalogo-distribuidor/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify({ enabled: !currentEnabled }),
      });

      const data = await response.json();

      if (data.success) {
        // Atualizar localmente
        setProdutos(produtos.map(p => 
          p.id === productId ? { ...p, enabled: !currentEnabled } : p
        ));
      } else {
        alert('Erro ao alternar produto: ' + data.error);
      }
    } catch (error) {
      console.error('Erro ao alternar produto:', error);
      alert('Erro ao alternar produto');
    } finally {
      setUpdating(null);
    }
  };

  const handlePriceChange = async (productId: string, newPrice: string) => {
    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue < 0) return;

    setUpdating(productId);
    try {
      const response = await fetchAuth(`/api/jornaleiro/catalogo-distribuidor/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify({ custom_price: priceValue }),
      });

      const data = await response.json();

      if (data.success) {
        setProdutos(produtos.map(p =>
          p.id === productId ? { ...p, custom_price: priceValue, effective_price: priceValue } : p
        ));
      } else {
        alert('Erro ao atualizar preço: ' + data.error);
      }
    } catch (error) {
      console.error('Erro ao atualizar preço:', error);
      alert('Erro ao atualizar preço');
    } finally {
      setUpdating(null);
    }
  };

  const filteredProdutos = produtos.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.mercos_id.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5c00] mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Catálogo de Distribuidores
        </h1>
        <p className="text-gray-600">
          Gerencie os produtos disponibilizados pelos distribuidores para sua banca.
          Todos os produtos são habilitados automaticamente e sincronizados a cada 15 minutos.
        </p>
      </div>

      {/* Alerta de status de cotista */}
      <div className="mb-6">
        <CotistaStatusAlert 
          isCotista={isCotista} 
          stats={{
            proprios: 0, // Não aplicável nesta página
            distribuidores: produtos.length
          }}
        />
      </div>

      {/* Barra de busca */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nome ou ID Mercos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
        />
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total de Produtos</p>
          <p className="text-2xl font-bold text-gray-900">{produtos.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Habilitados</p>
          <p className="text-2xl font-bold text-green-600">
            {produtos.filter(p => p.enabled).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Desabilitados</p>
          <p className="text-2xl font-bold text-gray-600">
            {produtos.filter(p => !p.enabled).length}
          </p>
        </div>
      </div>

      {/* Tabela de produtos */}
      {filteredProdutos.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum produto encontrado</h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchTerm ? 'Tente buscar por outro termo' : 'Cadastre sua banca para ver o catálogo de produtos dos distribuidores'}
          </p>
          {!searchTerm && (
            <Link 
              href="/jornaleiro/banca" 
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff5c00] hover:bg-[#ff6a1a]"
            >
              Cadastrar Minha Banca
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Habilitado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço Distribuidor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seu Preço
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProdutos.map((produto) => (
                <tr key={produto.id} className={!produto.enabled ? 'opacity-50' : ''}>
                  {/* Toggle Habilitado */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggle(produto.id, produto.enabled)}
                      disabled={updating === produto.id}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        produto.enabled ? 'bg-[#ff5c00]' : 'bg-gray-300'
                      } ${updating === produto.id ? 'opacity-50' : ''}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          produto.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Produto */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {produto.images && produto.images.length > 0 ? (
                          <img
                            className="h-10 w-10 rounded object-cover"
                            src={produto.images[0]}
                            alt={produto.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{produto.name}</div>
                        <div className="text-sm text-gray-500">ID: {produto.mercos_id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Estoque */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {produto.custom_stock_enabled ? (
                        <>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            (produto.custom_stock_qty || 0) > 0
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {produto.custom_stock_qty || 0} un. (próprio)
                          </span>
                          <span className="text-xs text-gray-500">
                            Dist: {produto.stock_qty} un.
                          </span>
                        </>
                      ) : (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          produto.stock_qty > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {produto.stock_qty} un.
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Preço Distribuidor */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      R$ {produto.distribuidor_price.toFixed(2)}
                    </div>
                  </td>

                  {/* Seu Preço (editável) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={produto.custom_price || produto.distribuidor_price}
                        onChange={(e) => handlePriceChange(produto.id, e.target.value)}
                        onBlur={(e) => handlePriceChange(produto.id, e.target.value)}
                        disabled={updating === produto.id}
                        className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#ff5c00] focus:border-transparent"
                      />
                      {produto.custom_price && produto.custom_price !== produto.distribuidor_price && (
                        <span className="text-xs text-green-600 font-medium">
                          ({((produto.custom_price - produto.distribuidor_price) / produto.distribuidor_price * 100).toFixed(0)}%)
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Ações */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/jornaleiro/catalogo-distribuidor/editar/${produto.id}`}
                      className="text-[#ff5c00] hover:text-[#e05400] inline-flex items-center gap-1"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Informações */}
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Sincronização automática:</strong> Os produtos são sincronizados a cada 15 minutos.
              Suas customizações de preço e configurações são preservadas durante a sincronização.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

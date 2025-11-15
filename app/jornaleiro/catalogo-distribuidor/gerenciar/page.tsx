"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/admin/ToastProvider";
import CotistaStatusAlert from '@/components/CotistaStatusAlert';

type Product = {
  id: string;
  name: string;
  price: number;
  stock_qty: number;
  images: string[];
  distribuidor_nome?: string;
  category_name?: string;
  // Customização
  custom_price?: number;
  custom_stock_enabled?: boolean;
  custom_stock_qty?: number;
  custom_status?: 'available' | 'unavailable' | 'out_of_stock';
  enabled?: boolean;
};

export default function GerenciarCatalogoPage() {
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isCotista, setIsCotista] = useState<boolean | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedDistribuidor, setSelectedDistribuidor] = useState<string>("");


  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Verificar se é cotista
      const bancaRes = await fetch('/api/jornaleiro/banca');
      const bancaJson = await bancaRes.json();
      setIsCotista(bancaJson?.data?.is_cotista === true && !!bancaJson?.data?.cotista_id);
      
      const res = await fetch('/api/jornaleiro/catalogo-distribuidor');
      const json = await res.json();
      
      if (json.success) {
        setProducts(json.products || []);
      } else {
        toast.error(json.error || "Erro ao carregar produtos");
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, products.length, pageSize, selectedDistribuidor]);

  // Extrair lista única de distribuidores
  const distribuidores = Array.from(
    new Set(products.map(p => p.distribuidor_nome).filter(Boolean))
  ).sort();

  const filteredProducts = products.filter(p => {
    const matchSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase());
    const matchDistribuidor = selectedDistribuidor === "" || p.distribuidor_nome === selectedDistribuidor;
    return matchSearch && matchDistribuidor;
  });
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const pagedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  // Removido modal: redirecionamento direto para edição do produto

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Catálogo de Distribuidores</h1>
        <p className="text-sm text-gray-600 mt-1">
          Customize preços, estoque e disponibilidade dos produtos de distribuidores na sua banca
        </p>
      </div>

      {/* Alerta de status de cotista */}
      {isCotista !== null && (
        <CotistaStatusAlert 
          isCotista={isCotista} 
          stats={{
            proprios: 0, // Não aplicável nesta página
            distribuidores: products.length
          }}
        />
      )}

      {/* Search and Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar produtos
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Digite o nome do produto..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por distribuidor
            </label>
            <select
              value={selectedDistribuidor}
              onChange={(e) => setSelectedDistribuidor(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="">Todos os distribuidores ({products.length})</option>
              {distribuidores.map((dist) => (
                <option key={dist} value={dist}>
                  {dist} ({products.filter(p => p.distribuidor_nome === dist).length})
                </option>
              ))}
            </select>
          </div>
        </div>
        {(search || selectedDistribuidor) && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <span>Filtros ativos:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded">
                Busca: "{search}"
                <button
                  onClick={() => setSearch("")}
                  className="hover:text-orange-900"
                >
                  ✕
                </button>
              </span>
            )}
            {selectedDistribuidor && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded">
                Distribuidor: {selectedDistribuidor}
                <button
                  onClick={() => setSelectedDistribuidor("")}
                  className="hover:text-blue-900"
                >
                  ✕
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearch("");
                setSelectedDistribuidor("");
              }}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Limpar todos
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">
            {selectedDistribuidor ? `Produtos - ${selectedDistribuidor}` : 'Total de Produtos'}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{filteredProducts.length}</p>
          {selectedDistribuidor && (
            <p className="text-xs text-gray-500 mt-1">de {products.length} no total</p>
          )}
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Habilitados</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {filteredProducts.filter(p => p.enabled !== false).length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Customizados</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            {filteredProducts.filter(p => p.custom_price || p.custom_stock_enabled).length}
          </p>
        </div>
      </div>

      {/* Products List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando produtos...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 rounded-lg border border-gray-200 bg-white">
          <p className="text-gray-500">
            {search ? 'Nenhum produto encontrado' : 'Nenhum produto disponível'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {pagedProducts.map((product) => (
            <div
              key={product.id}
              className={`rounded-lg border bg-white p-4 hover:shadow-md transition-shadow ${
                product.enabled === false ? 'opacity-60 border-gray-300' : 'border-gray-200'
              }`}
            >
              <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100">
                {product.images && product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sem imagem
                  </div>
                )}
                {product.enabled === false && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">Desabilitado</span>
                  </div>
                )}
              </div>

              <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                {product.name}
              </h3>

              {product.distribuidor_nome && (
                <p className="text-xs text-orange-600 font-medium mb-3">
                  {product.distribuidor_nome.split(' ')[0]}
                </p>
              )}

              <div className="space-y-2 text-xs text-gray-600 mb-3">
                <div className="flex items-center justify-between">
                  <span>Preço original:</span>
                  <span className={product.custom_price ? "line-through" : "font-semibold"}>
                    {formatPrice(product.price)}
                  </span>
                </div>
                {product.custom_price && (
                  <div className="flex items-center justify-between text-orange-600 font-semibold">
                    <span>Preço customizado:</span>
                    <span>{formatPrice(product.custom_price)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Estoque:</span>
                  <span className="font-semibold">
                    {product.custom_stock_enabled 
                      ? product.custom_stock_qty
                      : product.stock_qty
                    }
                  </span>
                </div>
              </div>

              <Link
                href={`/jornaleiro/produtos/${product.id}`}
                className="w-full inline-flex items-center justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-700"
              >
                Ver Detalhes
              </Link>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredProducts.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            Mostrando {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, filteredProducts.length)} de {filteredProducts.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 disabled:opacity-50"
            >
              «
            </button>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 disabled:opacity-50"
            >
              Próxima
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 disabled:opacity-50"
            >
              »
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Itens por página</span>
            <select
              value={pageSize}
              onChange={(e) => { const v = parseInt(e.target.value); setPageSize(v || 25); setPage(1); }}
              className="rounded-md border border-gray-300 px-2 py-1 text-sm"
            >
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      )}

      
    </div>
  );
}

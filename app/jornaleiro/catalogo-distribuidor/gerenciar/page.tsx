"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/admin/ToastProvider";

type Product = {
  id: string;
  name: string;
  price: number;
  distribuidor_price?: number; // Preço com markup
  stock_qty: number;
  images: string[];
  distribuidor_nome?: string;
  category_name?: string;
  codigo_mercos?: string;
  // Customização
  custom_price?: number;
  custom_stock_enabled?: boolean;
  custom_stock_qty?: number;
  custom_status?: 'available' | 'unavailable' | 'out_of_stock';
  enabled?: boolean;
};

type DistribuidorInfo = {
  nome: string;
  count: number;
};

export default function GerenciarCatalogoPage() {
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [allDistribuidores, setAllDistribuidores] = useState<DistribuidorInfo[]>([]); // Lista completa de distribuidores com contagem
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedDistribuidor, setSelectedDistribuidor] = useState<string>("");
  const [isCotista, setIsCotista] = useState<boolean | null>(null); // null = carregando
  // Debounce para busca
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('q', debouncedSearch);
      if (selectedDistribuidor) params.set('distribuidor', selectedDistribuidor);
      
      const timestamp = Date.now();
      const res = await fetch(`/api/jornaleiro/catalogo-distribuidor?${params.toString()}&t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const json = await res.json();
      
      // Verificar se é cotista
      setIsCotista(json.is_cotista === true);
      
      if (json.success) {
        setProducts(json.products || []);
        // Se a API retornar a lista de todos os distribuidores, usamos ela
        if (json.distribuidores) {
            // Verificar se é array de strings (legado) ou objetos (novo)
            const first = json.distribuidores[0];
            if (typeof first === 'string') {
               setAllDistribuidores(json.distribuidores.map((d: string) => ({ nome: d, count: 0 })));
            } else {
               setAllDistribuidores(json.distribuidores);
            }
        }
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
  }, [debouncedSearch, selectedDistribuidor]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, products.length, pageSize, selectedDistribuidor]);

  // Usar a lista retornada pela API ou extrair dos produtos (fallback)
  const distribuidores: DistribuidorInfo[] = allDistribuidores.length > 0 && allDistribuidores[0].count > 0
    ? allDistribuidores 
    : Array.from(new Set(products.map(p => p.distribuidor_nome).filter(Boolean) as string[])).sort().map(nome => ({
        nome,
        count: products.filter(p => p.distribuidor_nome === nome).length
      }));
      
  // Total real aproximado (soma das contagens se disponível, ou products.length se for filtrado)
  // Se estiver filtrando, queremos mostrar quantos achou. Se não, o total global.
  const totalDisplay = selectedDistribuidor || search 
    ? products.length 
    : (allDistribuidores.reduce((acc, d) => acc + d.count, 0) || products.length);

  // Filtragem local apenas para paginação, já que o grosso é feito no servidor
  const filteredProducts = products; // Os produtos já vêm filtrados do servidor
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const pagedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  // Removido modal: redirecionamento direto para edição do produto

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(price);
  };

  // Mensagem de WhatsApp
  const whatsappMessage = encodeURIComponent("Olá! Sou Jornaleiro e gostaria de saber como faço para ter acesso ao Catálogo de Distribuidores do Guia das Bancas");
  const whatsappUrl = `https://wa.me/5511994683425?text=${whatsappMessage}`;

  return (
    <div className="space-y-6 relative">
      {/* Overlay de bloqueio para não-cotistas - apenas no conteúdo central */}
      {isCotista === false && (
        <div className="absolute inset-0 z-40 flex items-center justify-center min-h-[500px]">
          {/* Backdrop com blur */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg" />
          
          {/* Card de mensagem */}
          <div className="relative z-10 max-w-lg mx-4 bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-200">
            {/* Ícone */}
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            {/* Título */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Acesso ao Catálogo de Distribuidores
            </h2>
            
            {/* Mensagem */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              Para ter acesso ao catálogo de distribuidores, entre em contato conosco. 
              Tenha acesso a um portfólio de <strong className="text-orange-600">mais de 5.000 produtos</strong> com 
              <strong className="text-orange-600"> descontos exclusivos</strong> para você, jornaleiro, faturar ainda mais!
            </p>
            
            {/* Botão WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Falar com a equipe via WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Catálogo de Distribuidores</h1>
        <p className="text-sm text-gray-600 mt-1">
          Customize preços, estoque e disponibilidade dos produtos de distribuidores na sua banca
        </p>
      </div>

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
              placeholder="Digite o nome ou código do produto..."
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
              <option value="">Todos os distribuidores ({totalDisplay})</option>
              {distribuidores.map((dist) => (
                <option key={dist.nome} value={dist.nome}>
                  {dist.nome} ({dist.count})
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
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalDisplay}</p>
          {selectedDistribuidor && (
            <p className="text-xs text-gray-500 mt-1">de {allDistribuidores.reduce((acc, d) => acc + d.count, 0)} no total</p>
          )}
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Habilitados</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {totalDisplay}
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
              className={`rounded-lg border bg-white p-4 hover:shadow-md transition-shadow flex flex-col ${
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

              <div className="flex-1 flex flex-col">
                <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                  {product.name}
                </h3>

                {product.codigo_mercos && (
                  <p className="text-[11px] text-gray-500 font-mono mb-1">
                    {product.codigo_mercos}
                  </p>
                )}

                {product.distribuidor_nome && (
                  <p className="text-xs text-orange-600 font-medium mb-3">
                    {product.distribuidor_nome.split(' ')[0]}
                  </p>
                )}

                <div className="space-y-2 text-xs text-gray-600 mb-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span>Preço:</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(product.custom_price || product.distribuidor_price || product.price)}
                    </span>
                  </div>
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
                  className="w-full inline-flex items-center justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-700 mt-auto"
                >
                  Ver Detalhes
                </Link>
              </div>
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

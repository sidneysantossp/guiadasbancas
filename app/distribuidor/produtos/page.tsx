"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconSearch,
  IconFilter,
  IconBox,
  IconCheck,
  IconX,
  IconEdit,
  IconEye,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  stock_qty: number;
  image_url?: string;
  images?: string[];
  category?: string;
  category_id?: string;
  codigo_mercos?: string;
  mercos_id?: number;
  active: boolean;
  track_stock?: boolean;
  origem?: string;
  sincronizado_em?: string;
};

type Category = {
  id: string;
  name: string;
  count: number;
  visible?: boolean;
};

export default function DistribuidorProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filterActive, setFilterActive] = useState<string>("all"); // all, active, inactive
  const [distribuidor, setDistribuidor] = useState<any>(null);

  useEffect(() => {
    // Carregar dados do distribuidor do localStorage
    const raw = localStorage.getItem("gb:distribuidor");
    console.log('[Produtos] Dados do localStorage:', raw);
    if (raw) {
      const parsed = JSON.parse(raw);
      console.log('[Produtos] ID do distribuidor:', parsed?.id);
      setDistribuidor(parsed);
    }
  }, []);

  // Buscar categorias da API
  const fetchCategories = async () => {
    if (!distribuidor?.id) return;
    
    try {
      const res = await fetch(`/api/distribuidor/categories?id=${distribuidor.id}`);
      const json = await res.json();
      
      if (json.success) {
        // Mapear para o formato esperado e filtrar apenas categorias visíveis com produtos
        const cats: Category[] = (json.data || [])
          .filter((c: any) => c.visible !== false && c.product_count > 0)
          .map((c: any) => ({
            id: c.name, // Usar nome como ID para filtro
            name: c.name,
            count: c.product_count,
            visible: c.visible,
          }))
          .sort((a: Category, b: Category) => a.name.localeCompare(b.name));
        
        setCategories(cats);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    if (!distribuidor?.id) return;
    
    try {
      setLoading(true);
      
      console.log('[Produtos] Chamando API com id:', distribuidor.id);
      const res = await fetch(`/api/distribuidor/products?id=${distribuidor.id}&active=false`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const json = await res.json();
      console.log('[Produtos] Resposta da API:', json);
      
      if (json.success) {
        console.log('[Produtos] Total recebido:', json.data?.length || 0);
        setProducts(json.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (distribuidor?.id) {
      fetchProducts();
      fetchCategories();
    }
  }, [distribuidor?.id]);

  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, filterActive]);

  const filteredProducts = products.filter(p => {
    const matchSearch = search === "" || 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.codigo_mercos && p.codigo_mercos.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = selectedCategory === "" || p.category === selectedCategory;
    const matchActive = filterActive === "all" || 
      (filterActive === "active" && p.active) ||
      (filterActive === "inactive" && !p.active);
    return matchSearch && matchCategory && matchActive;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const pagedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(price);
  };

  const handleToggleActive = async (productId: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/distribuidor/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          distribuidorId: distribuidor.id,
          updates: { active: !currentActive }
        }),
      });
      
      const json = await res.json();
      
      if (json.success) {
        setProducts(products.map(p => 
          p.id === productId ? { ...p, active: !currentActive } : p
        ));
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Produtos</h1>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie preços, estoque e disponibilidade dos seus produtos
          </p>
        </div>
        <Link
          href="/distribuidor/produtos/novo"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <IconBox size={18} />
          Novo Produto
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar produtos
            </label>
            <div className="relative">
              <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Digite o nome ou código do produto..."
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Filtro por Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Todas as categorias ({products.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name} ({cat.count})
                </option>
              ))}
            </select>
          </div>
          
          {/* Filtro por Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>

        {/* Filtros ativos */}
        {(search || selectedCategory || filterActive !== "all") && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span>Filtros ativos:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded">
                Busca: "{search}"
                <button onClick={() => setSearch("")} className="hover:text-blue-900">
                  <IconX size={14} />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded">
                Categoria: {selectedCategory}
                <button onClick={() => setSelectedCategory("")} className="hover:text-green-900">
                  <IconX size={14} />
                </button>
              </span>
            )}
            {filterActive !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded">
                Status: {filterActive === "active" ? "Ativos" : "Inativos"}
                <button onClick={() => setFilterActive("all")} className="hover:text-purple-900">
                  <IconX size={14} />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("");
                setFilterActive("all");
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Limpar todos
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Total de Produtos</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Ativos</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {products.filter(p => p.active).length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Inativos</p>
          <p className="text-2xl font-bold text-gray-500 mt-1">
            {products.filter(p => !p.active).length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Categorias</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{categories.length}</p>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-3 text-gray-500">Carregando produtos...</p>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-gray-200 bg-white">
          <IconBox size={48} className="mx-auto text-gray-300" />
          <p className="mt-3 text-gray-500">
            {search || selectedCategory ? 'Nenhum produto encontrado com esses filtros' : 'Nenhum produto cadastrado'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {pagedProducts.map((product) => (
            <div
              key={product.id}
              className={`rounded-xl border bg-white p-4 hover:shadow-lg transition-all flex flex-col ${
                !product.active ? 'opacity-60 border-gray-300' : 'border-gray-200'
              }`}
            >
              {/* Imagem */}
              <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100">
                {(product.image_url || (product.images && product.images[0])) ? (
                  <Image
                    src={product.image_url || product.images![0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    Sem imagem
                  </div>
                )}
                {!product.active && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold px-2 py-1 bg-red-500 rounded">
                      Inativo
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col">
                <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                  {product.name}
                </h3>

                {(product.codigo_mercos || product.mercos_id) && (
                  <p className="text-[11px] text-gray-500 font-mono mb-1">
                    {product.codigo_mercos || `#${product.mercos_id}`}
                  </p>
                )}

                <div className="flex items-center gap-2 mb-2">
                  {product.category && (
                    <span className="text-xs text-blue-600 font-medium">
                      {product.category}
                    </span>
                  )}
                  {product.origem === 'mercos' && (
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                      Mercos
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-gray-600 mb-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span>Preço:</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Estoque:</span>
                    <span className={`font-semibold ${product.stock_qty > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {product.stock_qty}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleToggleActive(product.id, product.active)}
                    className={`flex-1 inline-flex items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
                      product.active
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={product.active ? 'Desativar' : 'Ativar'}
                  >
                    {product.active ? <IconCheck size={14} /> : <IconX size={14} />}
                    {product.active ? 'Ativo' : 'Inativo'}
                  </button>
                  <Link
                    href={`/distribuidor/produtos/${product.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-2 py-2 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    <IconEdit size={14} />
                    Editar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredProducts.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-600">
            Mostrando {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, filteredProducts.length)} de {filteredProducts.length}
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 disabled:opacity-50 hover:bg-gray-50"
            >
              <IconChevronsLeft size={16} />
            </button>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 disabled:opacity-50 hover:bg-gray-50"
            >
              <IconChevronLeft size={16} />
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 disabled:opacity-50 hover:bg-gray-50"
            >
              <IconChevronRight size={16} />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 disabled:opacity-50 hover:bg-gray-50"
            >
              <IconChevronsRight size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Por página:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(parseInt(e.target.value)); setPage(1); }}
              className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
            >
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

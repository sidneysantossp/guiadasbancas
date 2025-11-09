"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useToast } from "@/components/admin/ToastProvider";

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [customPrice, setCustomPrice] = useState<string>("");
  const [useCustomStock, setUseCustomStock] = useState(false);
  const [customStockQty, setCustomStockQty] = useState<string>("0");
  const [customStatus, setCustomStatus] = useState<string>("available");
  const [enabled, setEnabled] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
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

  const filteredProducts = products.filter(p => 
    search === "" || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setCustomPrice(product.custom_price?.toString() || product.price.toString());
    setUseCustomStock(product.custom_stock_enabled || false);
    setCustomStockQty((product.custom_stock_qty || product.stock_qty).toString());
    setCustomStatus(product.custom_status || 'available');
    setEnabled(product.enabled !== false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleSave = async () => {
    if (!selectedProduct) return;

    try {
      setSaving(true);
      
      const res = await fetch(`/api/jornaleiro/catalogo-distribuidor/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled,
          custom_price: customPrice ? parseFloat(customPrice) : null,
          custom_stock_enabled: useCustomStock,
          custom_stock_qty: useCustomStock ? parseInt(customStockQty) : null,
          custom_status: customStatus,
        })
      });

      const json = await res.json();

      if (json.success) {
        toast.success("Produto atualizado com sucesso!");
        closeModal();
        fetchProducts();
      } else {
        toast.error(json.error || "Erro ao salvar");
      }
    } catch (error) {
      console.error('Error saving:', error);
      toast.error("Erro ao salvar customização");
    } finally {
      setSaving(false);
    }
  };

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

      {/* Search */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar produtos..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Total de Produtos</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Habilitados</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {products.filter(p => p.enabled !== false).length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Customizados</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            {products.filter(p => p.custom_price || p.custom_stock_enabled).length}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
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

              <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                {product.name}
              </h3>

              <div className="space-y-2 text-xs text-gray-600 mb-3">
                {product.distribuidor_nome && (
                  <p>📦 {product.distribuidor_nome}</p>
                )}
                {product.category_name && (
                  <p>🏷️ {product.category_name}</p>
                )}
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
                      ? `${product.custom_stock_qty} (próprio)`
                      : `${product.stock_qty} (distribuidor)`
                    }
                  </span>
                </div>
              </div>

              <button
                onClick={() => openModal(product)}
                className="w-full rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-700"
              >
                Customizar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Customizar Produto</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Product Info */}
              <div className="flex gap-4 pb-4 border-b">
                <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {selectedProduct.images && selectedProduct.images[0] ? (
                    <Image
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      Sem imagem
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Preço original: {formatPrice(selectedProduct.price)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Estoque distribuidor: {selectedProduct.stock_qty}
                  </p>
                </div>
              </div>

              {/* Enable/Disable */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Exibir este produto na minha banca
                  </span>
                </label>
              </div>

              {/* Custom Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço Customizado (opcional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  placeholder="Deixe vazio para usar preço original"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Defina um preço diferente do distribuidor para este produto
                </p>
              </div>

              {/* Custom Stock */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={useCustomStock}
                    onChange={(e) => setUseCustomStock(e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Usar estoque próprio (não sincronizar com distribuidor)
                  </span>
                </label>

                {useCustomStock && (
                  <input
                    type="number"
                    value={customStockQty}
                    onChange={(e) => setCustomStockQty(e.target.value)}
                    placeholder="Quantidade em estoque"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {useCustomStock 
                    ? "Você controlará manualmente o estoque deste produto"
                    : "O estoque será sincronizado automaticamente com o distribuidor"
                  }
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status do Produto
                </label>
                <select
                  value={customStatus}
                  onChange={(e) => setCustomStatus(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="available">Disponível</option>
                  <option value="unavailable">Indisponível</option>
                  <option value="out_of_stock">Sem estoque</option>
                </select>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar Customização'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

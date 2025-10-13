"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/admin/ToastProvider";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  price_original?: number;
  discount_percent?: number;
  images: string[];
  rating_avg?: number;
  reviews_count: number;
  pronta_entrega: boolean;
  sob_encomenda: boolean;
  pre_venda: boolean;
  active: boolean;
}

const durationOptions = [
  { days: 7, label: '7 dias', price: 'Gratuito' },
  { days: 15, label: '15 dias', price: 'Gratuito' },
  { days: 30, label: '30 dias', price: 'Gratuito' }
];

export default function CreateCampaignPage() {
  const router = useRouter();
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(7);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Buscar produtos ativos do jornaleiro
      const res = await fetch('/api/jornaleiro/products');
      const json = await res.json();
      
      if (json.success) {
        // A API retorna "items" ao invés de "data"
        setProducts(json.items?.filter((p: Product) => p.active) || []);
        setApiMessage(json.message || null);
      } else {
        toast.error(json.error || 'Erro ao carregar produtos');
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const getEndDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedProduct) {
      toast.error('Selecione um produto para a campanha');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/jornaleiro/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer seller-token'
        },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          banca_id: 'temp-banca-id', // TODO: Pegar do contexto do jornaleiro
          duration_days: selectedDuration,
          title: `Campanha - ${selectedProduct.name}`,
          description: `Promoção especial do produto ${selectedProduct.name}`
        })
      });

      if (res.ok) {
        toast.success('Campanha enviada para aprovação!');
        router.push('/jornaleiro/campanhas');
      } else {
        toast.error('Erro ao criar campanha');
      }
    } catch (error) {
      toast.error('Erro ao criar campanha');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nova Campanha Publicitária</h1>
        <p className="text-gray-600">Selecione um produto e configure sua campanha promocional</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Seleção de produto */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">1. Selecione o Produto</h2>
            
            {/* Busca */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            {loading ? (
              <div className="text-center py-8">Carregando produtos...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📦</div>
                {apiMessage ? (
                  <>
                    <p className="mb-3">{apiMessage}</p>
                    <Link
                      href="/jornaleiro/banca"
                      className="inline-block bg-[#ff5c00] text-white px-4 py-2 rounded-lg hover:opacity-90 text-sm font-medium"
                    >
                      Cadastrar Banca
                    </Link>
                  </>
                ) : (
                  <>
                    <p>Nenhum produto encontrado</p>
                    <Link
                      href="/jornaleiro/produtos/create"
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      Criar primeiro produto
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedProduct?.id === product.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex gap-4">
                      <img
                        src={product.images[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 flex items-center gap-2">
                          {product.name}
                          <Link
                            href={`/jornaleiro/produtos/${product.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                            title="Editar produto"
                          >
                            👁️
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-bold text-gray-900">
                            R$ {product.price.toFixed(2)}
                          </span>
                          {product.price_original && (
                            <span className="text-sm text-gray-500 line-through">
                              R$ {product.price_original.toFixed(2)}
                            </span>
                          )}
                          {product.discount_percent && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                              -{product.discount_percent}%
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1 mt-2">
                          {product.pronta_entrega && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              ✅ Pronta Entrega
                            </span>
                          )}
                          {product.sob_encomenda && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              📋 Sob Encomenda
                            </span>
                          )}
                          {product.pre_venda && (
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                              🔮 Pré-Venda
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Aviso sobre edição */}
          {selectedProduct && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-amber-600 text-lg">💡</div>
                <div>
                  <h3 className="text-sm font-medium text-amber-800">Quer alterar informações do produto?</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Para modificar preço, descrição ou outras informações, acesse a página de edição do produto.
                  </p>
                  <Link
                    href={`/jornaleiro/produtos/${selectedProduct.id}`}
                    className="inline-block mt-2 text-sm text-amber-800 hover:text-amber-900 font-medium"
                  >
                    Editar produto →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Configurações da campanha */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">2. Duração da Campanha</h2>
            
            <div className="space-y-3">
              {durationOptions.map((option) => (
                <label
                  key={option.days}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedDuration === option.days
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="duration"
                      value={option.days}
                      checked={selectedDuration === option.days}
                      onChange={(e) => setSelectedDuration(Number(e.target.value))}
                      className="text-blue-500"
                    />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-600">
                        Até {getEndDate(option.days)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {option.price}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Preview da campanha */}
          {selectedProduct && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Preview da Campanha</h3>
              
              <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-orange-50 to-red-50">
                <div className="relative">
                  <img
                    src={selectedProduct.images[0] || '/placeholder-product.jpg'}
                    alt={selectedProduct.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  {selectedProduct.discount_percent && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      {selectedProduct.discount_percent}% OFF
                    </div>
                  )}
                </div>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <span key={star} className="text-yellow-400 text-sm">⭐</span>
                    ))}
                    <span className="text-xs text-gray-500">({selectedProduct.reviews_count})</span>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 line-clamp-2">
                    {selectedProduct.name}
                  </h4>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {selectedProduct.description}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">
                      R$ {selectedProduct.price.toFixed(2)}
                    </span>
                    {selectedProduct.price_original && (
                      <span className="text-sm text-gray-500 line-through">
                        R$ {selectedProduct.price_original.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    <span className="text-gray-600">Sua Banca</span>
                    <button className="ml-auto text-gray-400">❤️</button>
                    <button className="bg-orange-500 text-white px-3 py-1 rounded text-xs">
                      🛒
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botão de envio */}
          <button
            onClick={handleSubmit}
            disabled={!selectedProduct || submitting}
            className="w-full bg-[#ff5c00] text-white py-3 rounded-lg font-medium hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Enviando...' : 'Enviar para Aprovação'}
          </button>

          {/* Informações */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">ℹ️ Processo de Aprovação</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• Sua campanha será analisada em até 24h</p>
              <p>• Você receberá uma notificação com o resultado</p>
              <p>• Campanhas aprovadas entram no ar automaticamente</p>
              <p>• Acompanhe o desempenho em tempo real</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

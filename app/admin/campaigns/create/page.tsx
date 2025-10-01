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
  banca_id: string;
}

interface Banca {
  id: string;
  name: string;
  cover_image?: string;
}

const durationOptions = [
  { days: 7, label: '7 dias', price: 'Gratuito' },
  { days: 15, label: '15 dias', price: 'Gratuito' },
  { days: 30, label: '30 dias', price: 'Gratuito' }
];

export default function AdminCreateCampaignPage() {
  const router = useRouter();
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [bancas, setBancas] = useState<Banca[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedBanca, setSelectedBanca] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(7);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bancaSearchTerm, setBancaSearchTerm] = useState('');
  const [showBancaDropdown, setShowBancaDropdown] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.banca-dropdown')) {
        setShowBancaDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Buscar produtos
      const productsRes = await fetch('/api/admin/products', {
        headers: { 'Authorization': 'Bearer admin-token' }
      });
      const productsJson = await productsRes.json();
      
      // Buscar bancas
      const bancasRes = await fetch('/api/admin/bancas', {
        headers: { 'Authorization': 'Bearer admin-token' }
      });
      const bancasJson = await bancasRes.json();
      
      if (productsJson.success) {
        setProducts(productsJson.data.filter((p: Product) => p.active));
      }
      
      if (bancasJson.success) {
        setBancas(bancasJson.data);
      }
    } catch (error) {
      toast.error('Erro ao carregar dados');
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
                         product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBanca = !selectedBanca || product.banca_id === selectedBanca;
    return matchesSearch && matchesBanca;
  });

  const filteredBancas = bancas.filter(banca => 
    !bancaSearchTerm || banca.name.toLowerCase().includes(bancaSearchTerm.toLowerCase())
  );

  const selectedBancaName = bancas.find(b => b.id === selectedBanca)?.name || '';

  const handleBancaSelect = (banca: Banca) => {
    setSelectedBanca(banca.id);
    setBancaSearchTerm(banca.name);
    setShowBancaDropdown(false);
  };

  const handleSubmit = async () => {
    if (!selectedProduct) {
      toast.error('Selecione um produto para a campanha');
      return;
    }

    if (!title.trim()) {
      toast.error('Digite um título para a campanha');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          banca_id: selectedProduct.banca_id,
          duration_days: selectedDuration,
          title: title.trim(),
          description: description.trim() || `Campanha promocional criada pelo admin para ${selectedProduct.name}`,
          status: 'approved' // Admin pode aprovar diretamente
        })
      });

      if (res.ok) {
        toast.success('Campanha criada e aprovada com sucesso!');
        router.push('/admin/campaigns');
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Campanha (Admin)</h1>
          <p className="text-gray-600">Crie uma campanha publicitária diretamente como administrador</p>
        </div>
        <Link
          href="/admin/campaigns"
          className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
        >
          Voltar
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Seleção de produto */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">1. Selecione o Produto</h2>
            
            {/* Filtros */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Buscar produto:</label>
                <input
                  type="text"
                  placeholder="Nome ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div className="relative banca-dropdown">
                <label className="block text-sm font-medium mb-1">Filtrar por banca:</label>
                <input
                  type="text"
                  placeholder="Digite o nome da banca..."
                  value={bancaSearchTerm}
                  onChange={(e) => {
                    setBancaSearchTerm(e.target.value);
                    setShowBancaDropdown(true);
                    if (!e.target.value) {
                      setSelectedBanca('');
                    }
                  }}
                  onFocus={() => setShowBancaDropdown(true)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                
                {showBancaDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setSelectedBanca('');
                          setBancaSearchTerm('');
                          setShowBancaDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                      >
                        Todas as bancas
                      </button>
                      {filteredBancas.map((banca) => (
                        <button
                          key={banca.id}
                          onClick={() => handleBancaSelect(banca)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                        >
                          {banca.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">Carregando produtos...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📦</div>
                <p>Nenhum produto encontrado</p>
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
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
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
                        <div className="text-xs text-gray-500 mt-1">
                          Banca: {bancas.find(b => b.id === product.banca_id)?.name || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Informações da campanha */}
          {selectedProduct && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">2. Informações da Campanha</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Título da campanha: *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={`Promoção ${selectedProduct.name}`}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Descrição (opcional):</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição adicional da campanha..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Configurações da campanha */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">3. Duração da Campanha</h2>
            
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
                    <span className="text-gray-600">
                      {bancas.find(b => b.id === selectedProduct.banca_id)?.name || 'Banca'}
                    </span>
                    <button className="ml-auto text-gray-400">❤️</button>
                    <button className="bg-orange-500 text-white px-3 py-1 rounded text-xs">
                      🛒
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botão de criação */}
          <button
            onClick={handleSubmit}
            disabled={!selectedProduct || !title.trim() || submitting}
            className="w-full bg-[#ff5c00] text-white py-3 rounded-lg font-medium hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Criando...' : 'Criar e Aprovar Campanha'}
          </button>

          {/* Informações */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-800 mb-2">✅ Privilégios do Admin</h4>
            <div className="text-xs text-green-700 space-y-1">
              <p>• Campanhas criadas pelo admin são aprovadas automaticamente</p>
              <p>• Entram no ar imediatamente após criação</p>
              <p>• Podem ser editadas e gerenciadas livremente</p>
              <p>• Aparecem na seção "Ofertas Relâmpago" da home</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

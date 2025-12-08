'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFetchAuth } from '@/lib/hooks/useFetchAuth';
import Image from 'next/image';
import { useToast } from '@/components/ToastProvider';
import { IconArrowLeft, IconLoader2, IconSave, IconX, IconPlus, IconTrash } from '@tabler/icons-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_qty: number;
  images: string[];
  custom_price: number | null;
  custom_description: string | null;
  custom_status: string;
  custom_pronta_entrega: boolean;
  custom_sob_encomenda: boolean;
  custom_pre_venda: boolean;
  custom_stock_enabled: boolean;
  custom_stock_qty: number | null;
  custom_featured: boolean;
  distribuidor_price: number;
  track_stock: boolean;
  pronta_entrega: boolean;
  sob_encomenda: boolean;
}

interface Banca {
  id: string;
  name: string;
}

export default function DistribuidorProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchWithAuth } = useFetchAuth();
  const { showToast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bancas, setBancas] = useState<Banca[]>([]);
  
  const [formData, setFormData] = useState({
    custom_price: '',
    custom_description: '',
    custom_status: 'disponivel',
    custom_pronta_entrega: false,
    custom_sob_encomenda: false,
    custom_pre_venda: false,
    custom_stock_enabled: false,
    custom_stock_qty: '',
    custom_featured: false,
    selected_bancas: [] as string[]
  });

  useEffect(() => {
    const productId = params.id as string;
    if (!productId) return;

    // Carregar produto
    const loadProduct = async () => {
      try {
        const response = await fetchWithAuth(`/api/distribuidor/products/${productId}`);
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/distribuidor/login');
            return;
          }
          throw new Error('Erro ao carregar produto');
        }
        
        const data = await response.json();
        setProduct(data);
        
        // Preencher formulário
        setFormData({
          custom_price: data.custom_price ? data.custom_price.toString() : '',
          custom_description: data.custom_description || '',
          custom_status: data.custom_status || 'disponivel',
          custom_pronta_entrega: data.custom_pronta_entrega || false,
          custom_sob_encomenda: data.custom_sob_encomenda || false,
          custom_pre_venda: data.custom_pre_venda || false,
          custom_stock_enabled: data.custom_stock_enabled || false,
          custom_stock_qty: data.custom_stock_qty ? data.custom_stock_qty.toString() : '',
          custom_featured: data.custom_featured || false,
          selected_bancas: []
        });
      } catch (error) {
        console.error('Erro:', error);
        showToast('Erro ao carregar produto', 'error');
      } finally {
        setLoading(false);
      }
    };

    // Carregar bancas
    const loadBancas = async () => {
      try {
        const response = await fetchWithAuth('/api/distribuidor/bancas');
        if (response.ok) {
          const data = await response.json();
          setBancas(data);
        }
      } catch (error) {
        console.error('Erro ao carregar bancas:', error);
      }
    };

    loadProduct();
    loadBancas();
  }, [params.id, fetchWithAuth, router, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetchWithAuth(`/api/distribuidor/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          custom_price: formData.custom_price ? parseFloat(formData.custom_price) : null,
          custom_description: formData.custom_description,
          custom_status: formData.custom_status,
          custom_pronta_entrega: formData.custom_pronta_entrega,
          custom_sob_encomenda: formData.custom_sob_encomenda,
          custom_pre_venda: formData.custom_pre_venda,
          custom_stock_enabled: formData.custom_stock_enabled,
          custom_stock_qty: formData.custom_stock_qty ? parseInt(formData.custom_stock_qty) : null,
          custom_featured: formData.custom_featured,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar produto');
      }

      showToast('Produto atualizado com sucesso!', 'success');
      router.push('/distribuidor/produtos');
    } catch (error) {
      console.error('Erro:', error);
      showToast('Erro ao salvar produto', 'error');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    const amount = parseFloat(numbers) / 100;
    return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const parseCurrency = (value: string): number => {
    const numbers = value.replace(/\D/g, '');
    return parseFloat(numbers) / 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <IconLoader2 className="animate-spin h-8 w-8 text-[#ff5c00]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Produto não encontrado</h1>
          <Link href="/distribuidor/produtos" className="text-[#ff5c00] hover:underline">
            Voltar para produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link 
                href="/distribuidor/produtos" 
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <IconArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Editar Produto: {product.name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações do Produto */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Informações do Produto</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Imagens */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagens
                </label>
                <div className="flex gap-4">
                  {product.images?.slice(0, 3).map((image, index) => (
                    <div key={index} className="relative w-24 h-24 border rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`Imagem ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <p className="text-gray-900">{product.name}</p>
              </div>

              {/* Descrição Original */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição Original
                </label>
                <p className="text-gray-900 text-sm">{product.description || '-'}</p>
              </div>

              {/* Preço de Distribuidor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço de Distribuidor
                </label>
                <p className="text-gray-900">
                  R$ {product.distribuidor_price?.toFixed(2) || '0,00'}
                </p>
              </div>

              {/* Estoque */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estoque
                </label>
                <p className="text-gray-900">{product.stock_qty} unidades</p>
              </div>
            </div>
          </div>

          {/* Configurações Personalizadas */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Configurações Personalizadas</h2>
            
            <div className="space-y-4">
              {/* Preço Personalizado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço Personalizado
                </label>
                <input
                  type="text"
                  value={formatCurrency(formData.custom_price)}
                  onChange={(e) => setFormData({...formData, custom_price: formatCurrency(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff5c00] focus:border-[#ff5c00]"
                  placeholder="R$ 0,00"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Deixe em branco para usar o preço padrão
                </p>
              </div>

              {/* Descrição Personalizada */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição Personalizada
                </label>
                <textarea
                  value={formData.custom_description}
                  onChange={(e) => setFormData({...formData, custom_description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff5c00] focus:border-[#ff5c00]"
                  placeholder="Adicione uma descrição personalizada para este produto..."
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.custom_status}
                  onChange={(e) => setFormData({...formData, custom_status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff5c00] focus:border-[#ff5c00]"
                >
                  <option value="disponivel">Disponível</option>
                  <option value="indisponivel">Indisponível</option>
                  <option value="sob_encomenda">Sob Encomenda</option>
                  <option value="pre_venda">Pré-venda</option>
                </select>
              </div>

              {/* Opções de Venda */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Opções de Venda
                </label>
                
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.custom_pronta_entrega}
                      onChange={(e) => setFormData({...formData, custom_pronta_entrega: e.target.checked})}
                      className="rounded border-gray-300 text-[#ff5c00] focus:ring-[#ff5c00]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Pronta Entrega</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.custom_sob_encomenda}
                      onChange={(e) => setFormData({...formData, custom_sob_encomenda: e.target.checked})}
                      className="rounded border-gray-300 text-[#ff5c00] focus:ring-[#ff5c00]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Sob Encomenda</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.custom_pre_venda}
                      onChange={(e) => setFormData({...formData, custom_pre_venda: e.target.checked})}
                      className="rounded border-gray-300 text-[#ff5c00] focus:ring-[#ff5c00]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Pré-venda</span>
                  </label>
                </div>
              </div>

              {/* Controle de Estoque */}
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.custom_stock_enabled}
                    onChange={(e) => setFormData({...formData, custom_stock_enabled: e.target.checked})}
                    className="rounded border-gray-300 text-[#ff5c00] focus:ring-[#ff5c00]"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Controlar Estoque Personalizado</span>
                </label>
                
                {formData.custom_stock_enabled && (
                  <div>
                    <input
                      type="number"
                      value={formData.custom_stock_qty}
                      onChange={(e) => setFormData({...formData, custom_stock_qty: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ff5c00] focus:border-[#ff5c00]"
                      placeholder="Quantidade em estoque"
                    />
                  </div>
                )}
              </div>

              {/* Destaque */}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.custom_featured}
                  onChange={(e) => setFormData({...formData, custom_featured: e.target.checked})}
                  className="rounded border-gray-300 text-[#ff5c00] focus:ring-[#ff5c00]"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Produto em Destaque</span>
              </label>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-4">
            <Link
              href="/distribuidor/produtos"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-[#ff5c00] text-white rounded-md hover:bg-[#e55000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <IconLoader2 className="animate-spin h-4 w-4" />
                  Salvando...
                </>
              ) : (
                <>
                  <IconSave className="h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

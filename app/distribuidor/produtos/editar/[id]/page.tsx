'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFetchAuth } from '@/lib/hooks/useFetchAuth';
import Image from 'next/image';
import { useToast } from '@/components/ToastProvider';
import { IconArrowLeft, IconLoader2, IconCheck, IconAlertTriangle, IconPhoto } from '@tabler/icons-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  base_price?: number;
  price_original?: number | null;
  category?: string;
  category_id?: string;
  active?: boolean;
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
  pre_venda?: boolean;
  origem?: string | null;
  created_at?: string;
  sincronizado_em?: string;
  codigo_mercos?: string | null;
}

interface Banca {
  id: string;
  name: string;
}

export default function DistribuidorProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const fetchWithAuth = useFetchAuth();
  const toast = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bancas, setBancas] = useState<Banca[]>([]);
  const [distribuidor, setDistribuidor] = useState<any>(null);
  
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
    const raw = localStorage.getItem('gb:distribuidor');
    if (!raw) {
      router.push('/distribuidor/login');
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setDistribuidor(parsed);
    } catch (error) {
      console.error('Erro ao ler distribuidor do storage:', error);
      router.push('/distribuidor/login');
    }
  }, [router]);

  useEffect(() => {
    const productId = params.id as string;
    if (!productId || !distribuidor?.id) return;

    // Carregar produto
    const loadProduct = async () => {
      try {
        const response = await fetchWithAuth(`/api/distribuidor/products?id=${distribuidor.id}&productId=${productId}&active=false`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/distribuidor/login');
            return;
          }
          throw new Error('Erro ao carregar produto');
        }
        const json = await response.json();
        const data = json.product || json.data?.[0];
        if (!data) {
          throw new Error('Produto não encontrado para este distribuidor');
        }

        setProduct(data);

        // Valor base (sem markup) e valor final (com markup ou custom)
        const basePrice = data.base_price ?? data.price ?? 0;
        const finalPrice = data.custom_price != null
          ? data.custom_price
          : (data.distribuidor_price ?? basePrice);

        // Preencher formulário
        setFormData({
          custom_price: formatCurrency(finalPrice),
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
        toast.error('Erro ao carregar produto');
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
  }, [params.id, distribuidor?.id, fetchWithAuth, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetchWithAuth('/api/distribuidor/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: params.id,
          distribuidorId: distribuidor?.id,
          updates: {
            custom_price: formData.custom_price ? parseCurrency(formData.custom_price) : null,
            custom_description: formData.custom_description,
            custom_status: formData.custom_status,
            custom_pronta_entrega: formData.custom_pronta_entrega,
            custom_sob_encomenda: formData.custom_sob_encomenda,
            custom_pre_venda: formData.custom_pre_venda,
            custom_stock_enabled: formData.custom_stock_enabled,
            custom_stock_qty: formData.custom_stock_qty ? parseInt(formData.custom_stock_qty) : null,
            custom_featured: formData.custom_featured,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar produto');
      }

      toast.success('Produto atualizado com sucesso!');
      router.push('/distribuidor/produtos');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao salvar produto');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value: string | number) => {
    if (value === null || value === undefined) return '';
    // Se já é número ou string decimal, formatar direto
    if (typeof value === 'number') {
      return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    const clean = value.replace(',', '.');
    const parsed = parseFloat(clean);
    if (!isNaN(parsed) && clean.includes('.')) {
      return parsed.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    // Máscara ao digitar (centavos)
    const numbers = value.toString().replace(/\D/g, '');
    if (!numbers) return '';
    const amount = parseFloat(numbers) / 100;
    return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const parseCurrency = (value: string): number => {
    const numbers = value.replace(/\D/g, '');
    return parseFloat(numbers) / 100;
  };

  const handlePriceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, custom_price: formatCurrency(value) }));
  };

  const priceNumber = formData.custom_price ? parseCurrency(formData.custom_price) : null;
  const finalPrice = priceNumber ?? product?.distribuidor_price ?? product?.base_price ?? product?.price ?? 0;

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Código</p>
                  <p className="text-base font-semibold text-gray-900">{product.codigo_mercos || product.id}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {product.category && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 font-medium">Categoria: {product.category}</span>
                  )}
                  {product.active === false && (
                    <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 font-medium text-yellow-700">
                      <IconAlertTriangle className="h-4 w-4" /> Inativo
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nome do Produto</label>
                  <input
                    value={product.name}
                    disabled
                    className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">Nome original sincronizado do distribuidor</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Descrição Original</label>
                    <textarea
                      value={product.description || '-'}
                      disabled
                      rows={4}
                      className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Descrição Personalizada</label>
                    <textarea
                      value={formData.custom_description}
                      onChange={(e) => setFormData({ ...formData, custom_description: e.target.value })}
                      rows={4}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#ff5c00] focus:outline-none focus:ring-1 focus:ring-[#ff5c00]"
                      placeholder="Adicione uma descrição personalizada que aparecerá para suas bancas parceiras..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Disponibilidade e Destaque</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.custom_status}
                    onChange={(e) => setFormData({ ...formData, custom_status: e.target.value })}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff5c00] focus:outline-none focus:ring-1 focus:ring-[#ff5c00]"
                  >
                    <option value="disponivel">Disponível</option>
                    <option value="indisponivel">Indisponível</option>
                    <option value="sob_encomenda">Sob Encomenda</option>
                    <option value="pre_venda">Pré-venda</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.custom_pronta_entrega}
                    onChange={(e) => setFormData({ ...formData, custom_pronta_entrega: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-[#ff5c00] focus:ring-[#ff5c00]"
                  />
                  <span className="text-sm text-gray-700">Pronta Entrega</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.custom_sob_encomenda}
                    onChange={(e) => setFormData({ ...formData, custom_sob_encomenda: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-[#ff5c00] focus:ring-[#ff5c00]"
                  />
                  <span className="text-sm text-gray-700">Sob Encomenda</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.custom_pre_venda}
                    onChange={(e) => setFormData({ ...formData, custom_pre_venda: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-[#ff5c00] focus:ring-[#ff5c00]"
                  />
                  <span className="text-sm text-gray-700">Pré-venda</span>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Estoque</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estoque do distribuidor</p>
                  <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                    <span className="text-base font-semibold text-gray-900">{product.stock_qty} unidades</span>
                    {product.track_stock ? (
                      <span className="text-xs rounded-full bg-green-100 px-2 py-1 font-medium text-green-700">Controlado</span>
                    ) : (
                      <span className="text-xs rounded-full bg-gray-100 px-2 py-1 font-medium text-gray-600">Sem controle</span>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.custom_stock_enabled}
                      onChange={(e) => setFormData({ ...formData, custom_stock_enabled: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-[#ff5c00] focus:ring-[#ff5c00]"
                    />
                    <span className="text-sm font-medium text-gray-700">Controlar meu próprio estoque</span>
                  </label>
                  {formData.custom_stock_enabled && (
                    <input
                      type="number"
                      value={formData.custom_stock_qty}
                      onChange={(e) => setFormData({ ...formData, custom_stock_qty: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff5c00] focus:outline-none focus:ring-1 focus:ring-[#ff5c00]"
                      placeholder="Quantidade disponível"
                    />
                  )}
                  <p className="text-xs text-gray-500">
                    Se ativado, o estoque exibido para as bancas parceiras usará o valor acima em vez do estoque do distribuidor.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Imagens</h2>
              {product.images && product.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {product.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
                      <Image
                        src={image}
                        alt={`Imagem ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-500">
                  <IconPhoto className="h-6 w-6 mb-2 text-gray-400" />
                  Nenhuma imagem cadastrada
                </div>
              )}
            </div>

            <div className="bg-white shadow rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Preços</h2>

              <div className="space-y-1">
                <p className="text-sm text-gray-600">Preço do distribuidor</p>
                <input
                  value={`R$ ${(product.base_price ?? product.price).toFixed(2)}`}
                  disabled
                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 font-semibold"
                />
                <p className="text-xs text-gray-500">Valor bruto sincronizado do catálogo (sem markup).</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Preço personalizado</p>
                <input
                  type="text"
                  value={formData.custom_price ? `R$ ${formData.custom_price}` : ''}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff5c00] focus:outline-none focus:ring-1 focus:ring-[#ff5c00]"
                  placeholder="R$ 0,00"
                />
                <p className="text-xs text-gray-500">Valor final para o jornaleiro (com markup). Deixe em branco para usar o markup padrão.</p>
              </div>

              <div className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Preço final exibido</span>
                  <span className="font-semibold">R$ {finalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Este é o preço que as bancas parceiras verão ao acessar seu catálogo.
                </p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Resumo</h2>
                <div className="text-right text-sm text-gray-500">
                  <p>Última atualização: {new Date(product.created_at || product.sincronizado_em || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li><strong>Origem:</strong> {product.origem || 'distribuidor'}</li>
                <li><strong>Controle de estoque:</strong> {product.track_stock ? 'Ativo' : 'Desabilitado'}</li>
                <li><strong>Disponibilidade base:</strong> {product.pronta_entrega ? 'Pronta entrega' : product.sob_encomenda ? 'Sob encomenda' : 'Indefinida'}</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full px-4 py-3 bg-[#ff5c00] text-white rounded-md hover:bg-[#e55000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <IconLoader2 className="animate-spin h-4 w-4" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <IconCheck className="h-4 w-4" />
                    Salvar alterações
                  </>
                )}
              </button>
              <Link
                href="/distribuidor/produtos"
                className="w-full text-center px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

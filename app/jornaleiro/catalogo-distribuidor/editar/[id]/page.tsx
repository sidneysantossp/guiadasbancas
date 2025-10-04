'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFetchAuth } from '@/lib/hooks/useFetchAuth';
import Image from 'next/image';
import { useToast } from '@/components/ToastProvider';

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

export default function EditarProdutoDistribuidorPage() {
  const params = useParams();
  const router = useRouter();
  const fetchAuth = useFetchAuth();
  const toast = useToast();

  const [produto, setProduto] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [customPrice, setCustomPrice] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customStatus, setCustomStatus] = useState('available');
  const [customProntaEntrega, setCustomProntaEntrega] = useState(false);
  const [customSobEncomenda, setCustomSobEncomenda] = useState(false);
  const [customPreVenda, setCustomPreVenda] = useState(false);
  const [customStockEnabled, setCustomStockEnabled] = useState(false);
  const [customStockQty, setCustomStockQty] = useState('0');
  const [customFeatured, setCustomFeatured] = useState(false);

  useEffect(() => {
    loadProduto();
  }, []);

  const loadProduto = async () => {
    try {
      const response = await fetchAuth('/api/jornaleiro/catalogo-distribuidor');
      const data = await response.json();

      if (data.success) {
        const prod = data.data.find((p: Product) => p.id === params.id);
        if (prod) {
          setProduto(prod);
          setCustomPrice(prod.custom_price?.toString() || prod.distribuidor_price.toString());
          setCustomDescription(prod.custom_description || '');
          setCustomStatus(prod.custom_status);
          setCustomProntaEntrega(prod.custom_pronta_entrega);
          setCustomSobEncomenda(prod.custom_sob_encomenda);
          setCustomPreVenda(prod.custom_pre_venda);
          setCustomStockEnabled(prod.custom_stock_enabled || false);
          setCustomStockQty(prod.custom_stock_qty?.toString() || '0');
          setCustomFeatured(prod.custom_featured || false);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!produto) return;

    setSaving(true);
    try {
      const response = await fetchAuth(`/api/jornaleiro/catalogo-distribuidor/${produto.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          custom_price: parseFloat(customPrice),
          custom_description: customDescription,
          custom_status: customStatus,
          custom_pronta_entrega: customProntaEntrega,
          custom_sob_encomenda: customSobEncomenda,
          custom_pre_venda: customPreVenda,
          custom_stock_enabled: customStockEnabled,
          custom_stock_qty: customStockEnabled ? parseInt(customStockQty) : null,
          custom_featured: customFeatured,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Produto atualizado com sucesso!');
        setTimeout(() => {
          router.push('/jornaleiro/catalogo-distribuidor');
        }, 1500);
      } else {
        toast.error('Erro ao salvar: ' + data.error);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar produto. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5c00] mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Produto não encontrado</h2>
          <Link href="/jornaleiro/catalogo-distribuidor" className="text-[#ff5c00] hover:underline mt-4 inline-block">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link
          href="/jornaleiro/catalogo-distribuidor"
          className="text-[#ff5c00] hover:underline flex items-center gap-2 mb-4"
        >
          ← Voltar ao Catálogo
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Editar Produto do Catálogo</h1>
        <p className="text-gray-600 mt-2">
          Customize as informações do produto para sua banca
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Informações bloqueadas (somente leitura) */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Informações do Distribuidor (Somente Leitura)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Produto
              </label>
              <input
                type="text"
                value={produto.name}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estoque Disponível
              </label>
              <input
                type="number"
                value={produto.stock_qty}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição Original
              </label>
              <textarea
                value={produto.description}
                disabled
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Imagens (bloqueado) */}
          {produto.images && produto.images.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagens do Distribuidor
              </label>
              <div className="flex gap-2">
                {produto.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Produto ${idx + 1}`}
                    className="h-20 w-20 object-cover rounded border-2 border-gray-300"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Campos editáveis */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Suas Customizações
          </h2>

          {/* Preço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço de Venda *
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="text-sm">
                <p className="text-gray-600">Preço do distribuidor:</p>
                <p className="font-semibold text-gray-900">R$ {produto.distribuidor_price.toFixed(2)}</p>
                {parseFloat(customPrice) > produto.distribuidor_price && (
                  <p className="text-green-600 text-xs mt-1">
                    Margem: {(((parseFloat(customPrice) - produto.distribuidor_price) / produto.distribuidor_price) * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Descrição Adicional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição Adicional (Opcional)
            </label>
            <textarea
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              rows={4}
              placeholder="Adicione informações extras sobre o produto..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Esta descrição será exibida junto com a descrição original do distribuidor
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status do Produto *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="available"
                  checked={customStatus === 'available'}
                  onChange={(e) => setCustomStatus(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Disponível</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="unavailable"
                  checked={customStatus === 'unavailable'}
                  onChange={(e) => setCustomStatus(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Indisponível</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="hidden"
                  checked={customStatus === 'hidden'}
                  onChange={(e) => setCustomStatus(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Oculto</span>
              </label>
            </div>
          </div>

          {/* Gestão de Estoque */}
          <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <label className="flex items-center cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={customStockEnabled}
                onChange={(e) => setCustomStockEnabled(e.target.checked)}
                className="mr-3 h-5 w-5 text-[#ff5c00] rounded focus:ring-2 focus:ring-[#ff5c00]"
              />
              <div>
                <span className="text-sm font-semibold text-gray-900">
                  Gerenciar meu próprio estoque
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  Ative para usar seu estoque ao invés do estoque do distribuidor
                </p>
              </div>
            </label>

            {customStockEnabled && (
              <div className="mt-4 pl-2 border-l-4 border-[#ff5c00]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade em Estoque *
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="0"
                    value={customStockQty}
                    onChange={(e) => setCustomStockQty(e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                    required
                  />
                  <span className="text-sm text-gray-600">unidades</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <strong>Estoque do distribuidor:</strong> {produto.stock_qty} un.
                  {produto.stock_qty === 0 && (
                    <span className="text-red-600 ml-2">
                      (Esgotado no distribuidor - usando seu estoque)
                    </span>
                  )}
                </p>
                
                {parseInt(customStockQty) > 0 && produto.stock_qty === 0 && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded flex items-start gap-2">
                    <i className="fa-regular fa-circle-check text-green-600 mt-0.5"></i>
                    <p className="text-xs text-green-700 flex-1">
                      Este produto ficará <strong>disponível para compra</strong> na sua banca mesmo com o estoque do distribuidor esgotado.
                    </p>
                  </div>
                )}
              </div>
            )}

            {!customStockEnabled && (
              <p className="text-xs text-gray-600 pl-2">
                O estoque será sincronizado automaticamente com o distribuidor ({produto.stock_qty} un. disponíveis)
              </p>
            )}
          </div>

          {/* Tipo de Entrega */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Entrega
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={customProntaEntrega}
                  onChange={(e) => setCustomProntaEntrega(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Pronta Entrega</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={customSobEncomenda}
                  onChange={(e) => setCustomSobEncomenda(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Sob Encomenda</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={customPreVenda}
                  onChange={(e) => setCustomPreVenda(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Pré-Venda</span>
              </label>
            </div>
          </div>

          {/* Destacar em Ofertas */}
          <div className="border-2 border-amber-200 rounded-lg p-4 bg-amber-50">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={customFeatured}
                onChange={(e) => setCustomFeatured(e.target.checked)}
                className="mr-3 h-5 w-5 text-amber-500 rounded focus:ring-2 focus:ring-amber-500"
              />
              <div>
                <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <i className="fa-regular fa-star text-amber-500"></i>
                  Destacar em Ofertas e Promoções
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  Este produto aparecerá na galeria de ofertas e promoções da sua banca
                </p>
              </div>
            </label>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-[#ff5c00] text-white px-6 py-3 rounded-lg hover:bg-[#e05400] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <Link
              href="/jornaleiro/catalogo-distribuidor"
              className="flex-1 text-center border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </div>

      {/* Aviso */}
      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Importante:</strong> Você não pode alterar o nome, imagens originais, descrição base ou estoque deste produto,
              pois ele é gerenciado pelo distribuidor. Suas customizações (preço, descrição adicional, status e tipo de entrega)
              serão preservadas durante as sincronizações automáticas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

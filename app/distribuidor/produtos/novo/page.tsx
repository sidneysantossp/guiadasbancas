'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/admin/ToastProvider';
import {
  getDistribuidorAuthHeaders,
  readDistribuidorClientAuth,
} from '@/lib/distribuidor-client-auth';
import { IconArrowLeft, IconCheck, IconLoader2, IconPhoto, IconPlugConnected } from '@tabler/icons-react';

type CategoryOption = {
  id: string;
  name: string;
  product_count?: number;
  source?: string;
};

export default function DistribuidorProdutoNovoPage() {
  const router = useRouter();
  const toast = useToast();
  const [distribuidor, setDistribuidor] = useState<any>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    stock_qty: '0',
    codigo_mercos: '',
    images: '',
    active: true,
    track_stock: true,
    pronta_entrega: true,
    sob_encomenda: false,
    pre_venda: false,
  });

  useEffect(() => {
    const { distribuidor: sessionDistribuidor } = readDistribuidorClientAuth();
    if (!sessionDistribuidor) {
      router.replace('/distribuidor/login');
      return;
    }
    setDistribuidor(sessionDistribuidor);
  }, [router]);

  useEffect(() => {
    const loadCategories = async () => {
      if (!distribuidor?.id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/distribuidor/categories?id=${distribuidor.id}`, {
          headers: getDistribuidorAuthHeaders({ distribuidorId: distribuidor.id }),
        });

        if (!response.ok) {
          throw new Error('Não foi possível carregar as categorias');
        }

        const json = await response.json();
        if (json.success) {
          setCategories(json.data || []);
        }
      } catch (error: any) {
        toast.error(error?.message || 'Erro ao carregar categorias');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [distribuidor?.id, toast]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!distribuidor?.id) {
      toast.error('Distribuidor não identificado');
      return;
    }

    setSaving(true);

    try {
      const imageUrls = form.images
        .split(/[\n,]/)
        .map((image) => image.trim())
        .filter(Boolean);

      const response = await fetch('/api/distribuidor/products', {
        method: 'POST',
        headers: getDistribuidorAuthHeaders({ distribuidorId: distribuidor.id, includeJson: true }),
        body: JSON.stringify({
          distribuidorId: distribuidor.id,
          name: form.name,
          description: form.description,
          category_id: form.category_id || null,
          price: Number(form.price),
          stock_qty: Number(form.stock_qty),
          codigo_mercos: form.codigo_mercos || null,
          images: imageUrls,
          active: form.active,
          track_stock: form.track_stock,
          pronta_entrega: form.pronta_entrega,
          sob_encomenda: form.sob_encomenda,
          pre_venda: form.pre_venda,
        }),
      });

      const json = await response.json().catch(() => ({}));
      if (!response.ok || json?.success === false) {
        throw new Error(json?.error || 'Erro ao cadastrar produto');
      }

      toast.success('Produto criado com sucesso');
      router.push('/distribuidor/produtos');
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao cadastrar produto');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/distribuidor/produtos"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <IconArrowLeft size={16} />
          Voltar
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Produto</h1>
          <p className="text-sm text-gray-600">Cadastre um item manualmente no catálogo do distribuidor.</p>
        </div>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <div className="flex items-start gap-3">
          <IconPlugConnected size={20} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Quando usar cadastro manual</p>
            <p className="mt-1">
              Use esta tela para itens fora da Mercos ou para cadastrar rapidamente novos produtos. Os produtos
              sincronizados da Mercos continuam sendo atualizados pela integração.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nome do Produto</label>
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Ex.: Revista especial edição março"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Descreva o produto para as bancas parceiras"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Categoria</label>
                  <select
                    value={form.category_id}
                    onChange={(event) => setForm((current) => ({ ...current, category_id: event.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    disabled={loading}
                  >
                    <option value="">Sem categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                        {category.source === 'mercos' ? ' (Mercos)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Código Mercos / SKU</label>
                  <input
                    value={form.codigo_mercos}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, codigo_mercos: event.target.value.toUpperCase() }))
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase"
                    placeholder="Opcional"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Preço de custo</label>
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.price}
                    onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="0,00"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Estoque</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock_qty}
                    onChange={(event) => setForm((current) => ({ ...current, stock_qty: event.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-gray-900">
              <IconPhoto size={18} />
              <h2 className="text-lg font-semibold">Imagens</h2>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Se já tiver URLs das imagens, cole aqui. Se preferir, você também pode vincular imagens depois pela tela
              de importação em massa.
            </p>
            <textarea
              value={form.images}
              onChange={(event) => setForm((current) => ({ ...current, images: event.target.value }))}
              rows={4}
              className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Uma URL por linha ou separadas por vírgula"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Disponibilidade</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Produto ativo
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.track_stock}
                  onChange={(event) => setForm((current) => ({ ...current, track_stock: event.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Controlar estoque
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.pronta_entrega}
                  onChange={(event) => setForm((current) => ({ ...current, pronta_entrega: event.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Pronta entrega
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.sob_encomenda}
                  onChange={(event) => setForm((current) => ({ ...current, sob_encomenda: event.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Sob encomenda
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.pre_venda}
                  onChange={(event) => setForm((current) => ({ ...current, pre_venda: event.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Pré-venda
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Publicação</h2>
            <p className="mt-2 text-sm text-gray-600">
              Assim que salvar, o produto entra no catálogo do distribuidor e poderá ser visto pelas bancas com acesso
              à rede parceira.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="submit"
                disabled={saving || loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? <IconLoader2 size={18} className="animate-spin" /> : <IconCheck size={18} />}
                {saving ? 'Salvando...' : 'Cadastrar produto'}
              </button>
              <Link
                href="/distribuidor/produtos"
                className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

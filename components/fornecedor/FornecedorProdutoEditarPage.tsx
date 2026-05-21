"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { IconAlertTriangle, IconArrowLeft, IconCheck, IconLoader2 } from "@tabler/icons-react";
import ProductImageUploader from "@/components/admin/ProductImageUploader";
import { useToast } from "@/components/admin/ToastProvider";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type Product = {
  id: string;
  sku: string | null;
  name: string;
  description: string | null;
  category_id: string | null;
  category_name: string | null;
  image_url: string | null;
  images: string[];
  cost_price: number;
  price: number;
  stock_quantity: number;
  available_quantity: number;
  track_stock: boolean;
  availability_status: "in_stock" | "on_demand" | "quote";
  min_order_quantity: number;
  pack_size: number;
  delivery_lead_time: string | null;
  active: boolean;
  visible: boolean;
  visible_jornaleiro: boolean;
  visible_banca: boolean;
  created_at: string | null;
  updated_at: string | null;
};

type CategoryOption = {
  id: string;
  name: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function formatInputNumber(value: number | null | undefined) {
  if (value == null) return "";
  return String(Number(value || 0));
}

function availabilityLabel(value: Product["availability_status"]) {
  if (value === "on_demand") return "Sob encomenda";
  if (value === "quote") return "Pré-venda";
  return "Pronta entrega";
}

function formatDeliveryLeadTime(daysInput: string) {
  const days = Math.floor(Number(String(daysInput || "").replace(",", ".")));
  if (!Number.isFinite(days) || days <= 0) return "";
  return days === 1 ? "1 dia" : `${days} dias`;
}

function extractDeliveryDays(value: string | null | undefined) {
  const match = String(value || "").match(/\d+/);
  return match?.[0] || "";
}

async function uploadProductImages(images: string[]) {
  const uploadedUrls: string[] = [];

  for (const src of images) {
    if (src.startsWith("data:")) {
      const blob = await (await fetch(src)).blob();
      const form = new FormData();
      form.append("file", blob, `fornecedor-${Date.now()}.png`);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.ok || !json?.url) {
        throw new Error("Falha no upload de imagem");
      }
      uploadedUrls.push(json.url);
    } else if (src.trim()) {
      uploadedUrls.push(src.trim());
    }
  }

  return uploadedUrls;
}

export default function FornecedorProdutoEditarPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    sku: "",
    cost_price: "",
    price: "",
    stock_quantity: "",
    track_stock: true,
    active: true,
    visible: true,
    visible_jornaleiro: true,
    visible_banca: false,
    availability_status: "in_stock" as Product["availability_status"],
    min_order_quantity: "1",
    pack_size: "1",
    delivery_lead_time: "",
    images: [] as string[],
  });

  useEffect(() => {
    const load = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        const [productResponse, categoriesResponse] = await Promise.all([
          fetchAdminWithDevFallback(`/api/admin/atacado/products/${productId}`),
          fetchAdminWithDevFallback("/api/admin/categories"),
        ]);

        const productJson = await productResponse.json().catch(() => null);
        if (!productResponse.ok || productJson?.success === false || !productJson?.data) {
          throw new Error(productJson?.error || "Produto não encontrado");
        }

        const data = productJson.data as Product;
        setProduct(data);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          category_id: data.category_id || "",
          sku: data.sku || "",
          cost_price: formatInputNumber(data.cost_price),
          price: formatInputNumber(data.price),
          stock_quantity: formatInputNumber(data.stock_quantity),
          track_stock: data.track_stock !== false,
          active: data.active !== false,
          visible: data.visible !== false,
          visible_jornaleiro: data.visible_jornaleiro !== false,
          visible_banca: data.visible_banca === true,
          availability_status: data.availability_status || "in_stock",
          min_order_quantity: formatInputNumber(data.min_order_quantity || 1),
          pack_size: formatInputNumber(data.pack_size || 1),
          delivery_lead_time: data.delivery_lead_time || "",
          images: Array.isArray(data.images) && data.images.length ? data.images : data.image_url ? [data.image_url] : [],
        });

        const categoriesJson = await categoriesResponse.json().catch(() => null);
        if (categoriesJson?.success) setCategories(categoriesJson.data || []);
      } catch (error: any) {
        toast.error(error?.message || "Erro ao carregar produto");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [productId, toast]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      const uploadedImageUrls = await uploadProductImages(formData.images);
      const allowsOpenPrice = formData.availability_status === "on_demand" || formData.availability_status === "quote";
      const parsedPrice = formData.price.trim() ? Number(formData.price) : 0;
      const finalPrice = Number.isFinite(parsedPrice) ? parsedPrice : 0;

      const response = await fetchAdminWithDevFallback(`/api/admin/atacado/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category_id: formData.category_id || null,
          sku: formData.sku || null,
          supplier_reference: formData.sku || null,
          cost_price: allowsOpenPrice && finalPrice <= 0 ? 0 : Number(formData.cost_price || finalPrice || 0),
          price: allowsOpenPrice && finalPrice <= 0 ? 0 : finalPrice,
          stock_quantity: Number(formData.stock_quantity),
          track_stock: formData.track_stock,
          active: formData.active,
          visible: formData.visible,
          visible_jornaleiro: formData.visible_jornaleiro,
          visible_banca: formData.visible_banca,
          availability_status: formData.availability_status,
          min_order_quantity: Number(formData.min_order_quantity),
          pack_size: Number(formData.pack_size),
          delivery_lead_time: formData.delivery_lead_time,
          image_url: uploadedImageUrls[0] || null,
          images: uploadedImageUrls,
        }),
      });

      const json = await response.json().catch(() => null);
      if (!response.ok || json?.success === false) {
        throw new Error(json?.error || "Erro ao salvar produto");
      }

      toast.success("Produto atualizado com sucesso!");
      router.push("/fornecedor/produtos");
    } catch (error: any) {
      toast.error(error?.message || "Erro ao salvar produto");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <IconLoader2 className="h-8 w-8 animate-spin text-[#ff5c00]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Produto não encontrado</h1>
          <Link href="/fornecedor/produtos" className="text-[#ff5c00] hover:underline">
            Voltar para produtos
          </Link>
        </div>
      </div>
    );
  }

  const isInactive = formData.active === false || formData.visible === false;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/fornecedor/produtos" className="mr-4 flex items-center text-gray-600 hover:text-gray-900">
                <IconArrowLeft className="mr-2 h-5 w-5" />
                Voltar
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Editar Produto: {product.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-1 text-sm text-gray-500">Código</p>
                  <p className="text-base font-semibold text-gray-900">{product.sku || product.id}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {product.category_name ? (
                    <span className="rounded-full bg-gray-100 px-3 py-1 font-medium">Categoria: {product.category_name}</span>
                  ) : null}
                  {isInactive ? (
                    <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 font-medium text-yellow-700">
                      <IconAlertTriangle className="h-4 w-4" /> Inativo
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 grid gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nome do Produto</label>
                  <input
                    value={formData.name}
                    onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-[#ff5c00] focus:outline-none focus:ring-1 focus:ring-[#ff5c00]"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Descrição</label>
                    <textarea
                      value={formData.description}
                      onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                      rows={4}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#ff5c00] focus:outline-none focus:ring-1 focus:ring-[#ff5c00]"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Categoria</label>
                      <select
                        value={formData.category_id}
                        onChange={(event) => setFormData((current) => ({ ...current, category_id: event.target.value }))}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#ff5c00] focus:outline-none focus:ring-1 focus:ring-[#ff5c00]"
                      >
                        <option value="">Sem categoria</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Código Mercos / SKU</label>
                      <input
                        value={formData.sku}
                        onChange={(event) => setFormData((current) => ({ ...current, sku: event.target.value.toUpperCase() }))}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm uppercase focus:border-[#ff5c00] focus:outline-none focus:ring-1 focus:ring-[#ff5c00]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Disponibilidade e Destaque</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.availability_status}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        availability_status: event.target.value as Product["availability_status"],
                        price:
                          (event.target.value === "on_demand" || event.target.value === "quote") && !current.price
                            ? "0"
                            : current.price,
                      }))
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff5c00] focus:outline-none focus:ring-1 focus:ring-[#ff5c00]"
                  >
                    <option value="in_stock">Disponível</option>
                    <option value="on_demand">Sob Encomenda</option>
                    <option value="quote">Pré-venda</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Prazo médio sob encomenda (dias)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={extractDeliveryDays(formData.delivery_lead_time)}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        delivery_lead_time: formatDeliveryLeadTime(event.target.value),
                      }))
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff5c00] focus:outline-none focus:ring-1 focus:ring-[#ff5c00]"
                    placeholder="Ex.: 7"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Esse prazo aparece para o jornaleiro no detalhe do Marketplace.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(event) => setFormData((current) => ({ ...current, active: event.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-[#ff5c00] focus:ring-[#ff5c00]"
                  />
                  <span className="text-sm text-gray-700">Produto ativo</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.visible}
                    onChange={(event) => setFormData((current) => ({ ...current, visible: event.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-[#ff5c00] focus:ring-[#ff5c00]"
                  />
                  <span className="text-sm text-gray-700">Visível</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.visible_jornaleiro}
                    onChange={(event) => setFormData((current) => ({ ...current, visible_jornaleiro: event.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-[#ff5c00] focus:ring-[#ff5c00]"
                  />
                  <span className="text-sm text-gray-700">Jornaleiro</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.visible_banca}
                    onChange={(event) => setFormData((current) => ({ ...current, visible_banca: event.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-[#ff5c00] focus:ring-[#ff5c00]"
                  />
                  <span className="text-sm text-gray-700">Banca</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.track_stock}
                    onChange={(event) => setFormData((current) => ({ ...current, track_stock: event.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-[#ff5c00] focus:ring-[#ff5c00]"
                  />
                  <span className="text-sm text-gray-700">Controlar estoque</span>
                </label>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Estoque</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Estoque do fornecedor</p>
                  <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                    <span className="text-base font-semibold text-gray-900">{product.available_quantity} unidades</span>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      {formData.track_stock ? "Controlado" : "Sem controle"}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Quantidade disponível</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.stock_quantity}
                    onChange={(event) => setFormData((current) => ({ ...current, stock_quantity: event.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff5c00] focus:outline-none focus:ring-1 focus:ring-[#ff5c00]"
                    placeholder="Quantidade disponível"
                  />
                  <p className="text-xs text-gray-500">
                    O estoque exibido para as bancas parceiras usará este valor, descontando quantidades reservadas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Imagens</h2>
              <ProductImageUploader
                images={formData.images}
                onChange={(images) => setFormData((current) => ({ ...current, images }))}
                maxImages={4}
              />
            </div>

            <div className="space-y-4 rounded-lg bg-white p-6 shadow">
              <h2 className="text-lg font-semibold text-gray-900">Preços</h2>

              <div className="space-y-1">
                <p className="text-sm text-gray-600">Preço de custo</p>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost_price}
                  onChange={(event) => setFormData((current) => ({ ...current, cost_price: event.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 font-semibold text-gray-900 focus:border-[#ff5c00] focus:outline-none focus:ring-1 focus:ring-[#ff5c00]"
                />
                <p className="text-xs text-gray-500">Valor bruto de aquisição do produto.</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Preço personalizado</p>
                <input
                  type="number"
                  min={formData.availability_status === "on_demand" || formData.availability_status === "quote" ? "0" : "0.01"}
                  step="0.01"
                  value={formData.price}
                  onChange={(event) => setFormData((current) => ({ ...current, price: event.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff5c00] focus:outline-none focus:ring-1 focus:ring-[#ff5c00]"
                  placeholder="0,00"
                />
                <p className="text-xs text-gray-500">
                  {formData.availability_status === "on_demand" || formData.availability_status === "quote"
                    ? "Sob encomenda e pré-venda podem ficar com valor 0 para compra com preço a definir."
                    : "Pronta entrega precisa de valor maior que zero."}
                </p>
              </div>

              <div className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Preço final exibido</span>
                  <span className="font-semibold">
                    {(formData.availability_status === "on_demand" || formData.availability_status === "quote") && Number(formData.price || 0) <= 0
                      ? "Valor a definir"
                      : formatCurrency(Number(formData.price))}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Este é o preço que as bancas parceiras verão ao acessar seu catálogo.</p>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Resumo</h2>
                <div className="text-right text-sm text-gray-500">
                  <p>Última atualização: {new Date(product.updated_at || product.created_at || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li>
                  <strong>Origem:</strong> fornecedor
                </li>
                <li>
                  <strong>Controle de estoque:</strong> {formData.track_stock ? "Ativo" : "Desabilitado"}
                </li>
                <li>
                  <strong>Disponibilidade base:</strong> {availabilityLabel(formData.availability_status)}
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[#ff5c00] px-4 py-3 text-white transition-colors hover:bg-[#e55000] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
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
                href="/fornecedor/produtos"
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-center text-gray-700 transition-colors hover:bg-gray-50"
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

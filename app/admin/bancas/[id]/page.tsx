"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useParams } from "next/navigation";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type BancaDetail = {
  banca: {
    id: string;
    user_id: string | null;
    name: string | null;
    address: string | null;
    cep: string | null;
    phone: string | null;
    whatsapp: string | null;
    cover_image: string | null;
    profile_image: string | null;
    active: boolean;
    approved: boolean;
    featured: boolean;
    description: string | null;
    tpu_url: string | null;
    created_at: string | null;
    updated_at: string | null;
    lat: number | null;
    lng: number | null;
  };
  owner: {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    role: string | null;
    blocked: boolean;
    blocked_reason: string | null;
  } | null;
  subscription: {
    id: string;
    status: string | null;
    current_period_start: string | null;
    current_period_end: string | null;
    contracted_price: number | null;
    plan: {
      id: string;
      name: string | null;
      type: string | null;
      price: number | null;
      billing_cycle: string | null;
    } | null;
  } | null;
  entitlements: {
    planType: string;
    canAccessDistributorCatalog: boolean;
    isLegacyCotistaLinked: boolean;
    isPaidPlanUnlocked: boolean;
  };
  metrics: {
    orders_30d: number;
    open_orders_30d: number;
    revenue_30d: number;
    total_products: number;
    active_products: number;
    featured_products: number;
    distributor_customizations: number;
    disabled_partner_items: number;
  };
  recent_orders: Array<{
    id: string;
    user_id: string | null;
    customer_name: string | null;
    total: number | null;
    status: string | null;
    payment_method: string | null;
    created_at: string | null;
  }>;
  recent_products: Array<{
    id: string;
    name: string | null;
    price: number | null;
    active: boolean | null;
    featured: boolean | null;
    distribuidor_id: string | null;
    created_at: string | null;
  }>;
};

function formatCurrency(value?: number | null) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function SummaryCard({
  title,
  value,
  helper,
}: {
  title: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{helper}</div>
    </div>
  );
}

export default function AdminBancaDetailPage() {
  const params = useParams();
  const bancaId = params.id as string;
  const [data, setData] = useState<BancaDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetchAdminWithDevFallback(`/api/admin/bancas/${bancaId}`);
        const json = await response.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Erro ao carregar detalhe da banca:", error);
      } finally {
        setLoading(false);
      }
    };

    if (bancaId) load();
  }, [bancaId]);

  if (loading) {
    return <div className="py-16 text-center text-sm text-gray-500">Carregando banca...</div>;
  }

  if (!data) {
    return <div className="py-16 text-center text-sm text-gray-500">Banca não encontrada.</div>;
  }

  const planName = data.subscription?.plan?.name || "Free / sem assinatura";
  const contractedValue = data.subscription?.contracted_price ?? data.subscription?.plan?.price ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <Link href={"/admin/bancas" as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
            Voltar para bancas
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-gray-900">{data.banca.name || "Banca sem nome"}</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Hub operacional da banca, unindo cadastro, dono, assinatura, catálogo e pedidos recentes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {data.owner?.id ? (
            <Link
              href={`/admin/jornaleiros/${data.owner.id}` as Route}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
            >
              Ver jornaleiro
            </Link>
          ) : null}
          <Link
            href={`/admin/cms/bancas/${data.banca.id}` as Route}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
          >
            Editar no CMS
          </Link>
          <Link
            href={`/banca/${data.banca.id}` as Route}
            target="_blank"
            className="rounded-xl bg-[#ff5c00] px-4 py-2 text-sm font-medium text-white hover:bg-[#e65300]"
          >
            Ver banca pública
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <SummaryCard title="Plano" value={planName} helper={formatCurrency(contractedValue)} />
        <SummaryCard title="Pedidos 30d" value={data.metrics.orders_30d} helper={`${data.metrics.open_orders_30d} em aberto`} />
        <SummaryCard title="Receita 30d" value={formatCurrency(data.metrics.revenue_30d)} helper="Volume recente da banca" />
        <SummaryCard title="Produtos" value={data.metrics.total_products} helper={`${data.metrics.active_products} ativos`} />
        <SummaryCard title="Catálogo parceiro" value={data.entitlements.canAccessDistributorCatalog ? "Liberado" : "Não"} helper={data.entitlements.planType} />
        <SummaryCard title="Cadastro" value={formatDate(data.banca.created_at)} helper={data.banca.active ? "Operação ativa" : "Operação pausada"} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Dados da banca</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div><span className="font-medium text-gray-900">Endereço:</span> {data.banca.address || "—"}</div>
            <div><span className="font-medium text-gray-900">CEP:</span> {data.banca.cep || "—"}</div>
            <div><span className="font-medium text-gray-900">Telefone:</span> {data.banca.phone || "—"}</div>
            <div><span className="font-medium text-gray-900">WhatsApp:</span> {data.banca.whatsapp || "—"}</div>
            <div><span className="font-medium text-gray-900">Descrição:</span> {data.banca.description || "Sem descrição"}</div>
            <div><span className="font-medium text-gray-900">TPU:</span> {data.banca.tpu_url || "Não configurado"}</div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Conta proprietária e assinatura</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div><span className="font-medium text-gray-900">Dono:</span> {data.owner?.full_name || "Sem usuário vinculado"}</div>
            <div><span className="font-medium text-gray-900">E-mail:</span> {data.owner?.email || "—"}</div>
            <div><span className="font-medium text-gray-900">Telefone:</span> {data.owner?.phone || "—"}</div>
            <div><span className="font-medium text-gray-900">Bloqueado:</span> {data.owner?.blocked ? "Sim" : "Não"}</div>
            <div><span className="font-medium text-gray-900">Assinatura:</span> {data.subscription?.status || "Sem assinatura paga"}</div>
            <div><span className="font-medium text-gray-900">Catálogo parceiro:</span> {data.entitlements.canAccessDistributorCatalog ? "Liberado" : "Bloqueado"}</div>
            <div><span className="font-medium text-gray-900">Legado cotista:</span> {data.entitlements.isLegacyCotistaLinked ? "Sim" : "Não"}</div>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Pedidos recentes</h2>
            <Link href={`/admin/orders?bancaId=${data.banca.id}` as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {data.recent_orders.length > 0 ? (
              data.recent_orders.map((order) => (
                <div key={order.id} className="rounded-xl border border-gray-200 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-gray-900">Pedido #{order.id}</div>
                      <div className="text-xs text-gray-500">{order.customer_name || "Cliente"} · {formatDate(order.created_at)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{formatCurrency(order.total)}</div>
                      <div className="text-xs text-gray-500">{order.status || "sem status"}</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link href={`/admin/orders/${order.id}` as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
                      Abrir pedido
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
                Nenhum pedido recente para esta banca.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Produtos recentes</h2>
            <Link href={"/admin/products" as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
              Ver catálogo
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {data.recent_products.length > 0 ? (
              data.recent_products.map((product) => (
                <div key={product.id} className="rounded-xl border border-gray-200 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-gray-900">{product.name || "Produto sem nome"}</div>
                      <div className="text-xs text-gray-500">
                        {product.distribuidor_id ? "Origem distribuidor" : "Catálogo próprio"} · {formatDate(product.created_at)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{formatCurrency(product.price)}</div>
                      <div className="text-xs text-gray-500">
                        {product.active === false ? "Inativo" : "Ativo"} · {product.featured ? "Destaque" : "Normal"}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link href={`/admin/products/${product.id}` as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
                      Abrir produto
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
                Nenhum produto recente encontrado para esta banca.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

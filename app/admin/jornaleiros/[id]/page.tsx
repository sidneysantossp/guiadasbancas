"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useParams } from "next/navigation";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type JornaleiroDetail = {
  profile: {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    role: string | null;
    active: boolean;
    blocked: boolean;
    blocked_reason: string | null;
    blocked_at: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
  banca: {
    id: string;
    user_id: string | null;
    name: string | null;
    address: string | null;
    cep: string | null;
    whatsapp: string | null;
    active: boolean;
    approved: boolean;
    featured: boolean;
    cover_image: string | null;
    profile_image: string | null;
    description: string | null;
    tpu_url: string | null;
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
    payments: Array<{
      id: string;
      amount: number | null;
      status: string | null;
      due_date: string | null;
      paid_at: string | null;
      created_at: string | null;
    }>;
  } | null;
  metrics: {
    orders_30d: number;
    open_orders_30d: number;
    revenue_30d: number;
    total_products: number;
    active_products: number;
    featured_products: number;
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
    category_id: string | null;
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

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "green" | "amber" | "red" | "blue" | "gray";
}) {
  const tones = {
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-gray-100 text-gray-700",
  };

  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{label}</span>;
}

export default function AdminJornaleiroDetailPage() {
  const params = useParams();
  const jornaleiroId = params.id as string;
  const [data, setData] = useState<JornaleiroDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetchAdminWithDevFallback(`/api/admin/jornaleiros/${jornaleiroId}`);
        const json = await response.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Erro ao carregar detalhe do jornaleiro:", error);
      } finally {
        setLoading(false);
      }
    };

    if (jornaleiroId) {
      load();
    }
  }, [jornaleiroId]);

  if (loading) {
    return <div className="py-16 text-center text-sm text-gray-500">Carregando jornaleiro...</div>;
  }

  if (!data) {
    return <div className="py-16 text-center text-sm text-gray-500">Jornaleiro não encontrado.</div>;
  }

  const accountStatus = data.profile.blocked
    ? { label: "Bloqueado", tone: "red" as const }
    : data.banca?.approved
      ? { label: "Operando", tone: "green" as const }
      : data.banca
        ? { label: "Pendente", tone: "amber" as const }
        : { label: "Sem banca", tone: "gray" as const };

  const planName = data.subscription?.plan?.name || "Free / sem assinatura";
  const planValue = data.subscription?.contracted_price ?? data.subscription?.plan?.price ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <Link href={"/admin/jornaleiros" as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
            Voltar para jornaleiros
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-gray-900">{data.profile.full_name || "Jornaleiro sem nome"}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusPill label={accountStatus.label} tone={accountStatus.tone} />
            <StatusPill
              label={data.subscription?.status ? `Assinatura ${data.subscription.status}` : "Sem assinatura paga"}
              tone={data.subscription ? "blue" : "gray"}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Conta operacional ligada à banca, com visão de assinatura, catálogo e desempenho recente.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/admin/users/${data.profile.id}` as Route}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
          >
            Ver conta base
          </Link>
          {data.banca?.id ? (
            <>
              <Link
                href={`/admin/cms/bancas/${data.banca.id}` as Route}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
              >
                Editar banca
              </Link>
              <Link
                href={`/banca/${data.banca.id}` as Route}
                target="_blank"
                className="rounded-xl bg-[#ff5c00] px-4 py-2 text-sm font-medium text-white hover:bg-[#e65300]"
              >
                Ver banca pública
              </Link>
            </>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <SummaryCard title="Plano atual" value={planName} helper={formatCurrency(planValue)} />
        <SummaryCard title="Pedidos 30d" value={data.metrics.orders_30d} helper={`${data.metrics.open_orders_30d} em aberto`} />
        <SummaryCard title="Receita 30d" value={formatCurrency(data.metrics.revenue_30d)} helper="Volume recente da banca" />
        <SummaryCard title="Produtos" value={data.metrics.total_products} helper={`${data.metrics.active_products} ativos`} />
        <SummaryCard title="Destaques" value={data.metrics.featured_products} helper="Produtos marcados em destaque" />
        <SummaryCard title="Conta criada" value={formatDate(data.profile.created_at)} helper={data.profile.email || "Sem e-mail"} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Conta e operação</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Contato</div>
              <div className="mt-3 space-y-2 text-sm text-gray-700">
                <div><span className="font-medium text-gray-900">E-mail:</span> {data.profile.email || "—"}</div>
                <div><span className="font-medium text-gray-900">Telefone:</span> {data.profile.phone || "—"}</div>
                <div><span className="font-medium text-gray-900">Última atualização:</span> {formatDate(data.profile.updated_at)}</div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Banca vinculada</div>
              {data.banca ? (
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                  <div className="font-medium text-gray-900">{data.banca.name}</div>
                  <div>{data.banca.address || "Sem endereço cadastrado"}</div>
                  <div><span className="font-medium text-gray-900">WhatsApp:</span> {data.banca.whatsapp || "—"}</div>
                  <div className="flex flex-wrap gap-2">
                    <StatusPill label={data.banca.approved ? "Aprovada" : "Pendente"} tone={data.banca.approved ? "green" : "amber"} />
                    <StatusPill label={data.banca.active ? "Ativa" : "Pausada"} tone={data.banca.active ? "green" : "gray"} />
                  </div>
                </div>
              ) : (
                <div className="mt-3 text-sm text-gray-500">Este jornaleiro ainda não concluiu o vínculo com a banca.</div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Assinatura e cobrança</h2>
            <Link href={"/admin/assinaturas" as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
              Ver todas
            </Link>
          </div>

          {data.subscription ? (
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{data.subscription.plan?.name || "Plano sem nome"}</div>
                    <div className="text-xs text-gray-500">
                      {data.subscription.plan?.billing_cycle || "mensal"} · {formatCurrency(planValue)}
                    </div>
                  </div>
                  <StatusPill label={data.subscription.status || "sem status"} tone="blue" />
                </div>
                <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
                  <div><span className="font-medium text-gray-900">Início:</span> {formatDate(data.subscription.current_period_start)}</div>
                  <div><span className="font-medium text-gray-900">Próximo ciclo:</span> {formatDate(data.subscription.current_period_end)}</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-900">Cobranças recentes</div>
                <div className="mt-3 space-y-2">
                  {(data.subscription.payments || []).length > 0 ? (
                    data.subscription.payments.map((payment) => (
                      <div key={payment.id} className="rounded-xl border border-gray-200 px-4 py-3 text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-gray-900">{formatCurrency(payment.amount)}</span>
                          <span className="text-gray-500">{payment.status || "sem status"}</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          Vencimento {formatDate(payment.due_date)} · Pago em {formatDate(payment.paid_at)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
                      Sem cobranças recentes vinculadas a esta assinatura.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
              O jornaleiro ainda opera no Free ou sem assinatura estruturada.
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Pedidos recentes</h2>
            <Link href={"/admin/orders" as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
              Operar pedidos
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
                Nenhum pedido recente encontrado para esta operação.
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
                      <div className="text-xs text-gray-500">{formatDate(product.created_at)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{formatCurrency(product.price)}</div>
                      <div className="text-xs text-gray-500">
                        {product.active === false ? "Inativo" : "Ativo"} · {product.featured ? "Destaque" : "Normal"}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link href={`/admin/products/${product.id}/edit` as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
                      Editar produto
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
                Este jornaleiro ainda não possui produtos cadastrados.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

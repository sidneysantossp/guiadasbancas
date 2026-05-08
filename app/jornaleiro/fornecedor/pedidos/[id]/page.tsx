"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IconArrowLeft, IconExternalLink } from "@tabler/icons-react";
import JornaleiroPageHeading from "@/components/jornaleiro/JornaleiroPageHeading";
import { useToast } from "@/components/admin/ToastProvider";

type WholesaleOrderItem = {
  id: string;
  product_name: string;
  product_image: string | null;
  product_sku: string | null;
  availability_status: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type WholesaleOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string | null;
  shipping_address: string | null;
  shipping_cep: string | null;
  subtotal: number;
  shipping_fee: number;
  total: number;
  payment_method: string;
  payment_status: string;
  status: string;
  asaas_invoice_url: string | null;
  asaas_pix_payload: string | null;
  shipping_method: string | null;
  tracking_code: string | null;
  notes: string | null;
  admin_notes: string | null;
  created_at: string | null;
  updated_at: string | null;
  items: WholesaleOrderItem[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusLabel(value: string) {
  const labels: Record<string, string> = {
    draft: "Valor a definir",
    pending_payment: "Em aprovação",
    paid: "Pagamento aprovado",
    purchasing: "Em aprovação",
    separating: "Separando",
    ready_to_ship: "A caminho",
    shipped: "A caminho",
    delivered: "Concluído",
    cancelled: "Cancelado",
  };
  return labels[value] || value;
}

function paymentLabel(value: string) {
  const labels: Record<string, string> = {
    pix: "PIX",
    credit_card: "Cartão de crédito",
    manual: "Manual",
  };
  return labels[value] || value;
}

function paymentStatusLabel(value: string) {
  const labels: Record<string, string> = {
    pending: "Pendente",
    confirmed: "Confirmado",
    overdue: "Vencido",
    refunded: "Estornado",
    cancelled: "Cancelado",
    failed: "Falhou",
  };
  return labels[value] || value;
}

function statusClass(value: string) {
  if (["delivered"].includes(value)) return "bg-green-50 text-green-700";
  if (["separating", "ready_to_ship", "shipped"].includes(value)) return "bg-blue-50 text-blue-700";
  if (["cancelled"].includes(value)) return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

export default function JornaleiroFornecedorPedidoDetalhePage() {
  const toast = useToast();
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<WholesaleOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/jornaleiro/atacado/orders/${params.id}`, {
          credentials: "include",
          cache: "no-store",
        });
        const json = await response.json().catch(() => null);
        if (!response.ok || !json?.success) {
          throw new Error(json?.error || "Não foi possível carregar o pedido");
        }
        setOrder(json.data);
      } catch (error: any) {
        toast.error(error?.message || "Erro ao carregar pedido do Marketplace");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) loadOrder();
  }, [params.id, toast]);

  if (loading) {
    return <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">Carregando pedido...</div>;
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <Link href="/jornaleiro/fornecedor/pedidos" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#ff5c00]">
          <IconArrowLeft size={17} />
          Voltar aos pedidos
        </Link>
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          Pedido não encontrado.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link href="/jornaleiro/fornecedor/pedidos" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#ff5c00]">
        <IconArrowLeft size={17} />
        Voltar aos pedidos
      </Link>

      <JornaleiroPageHeading
        title={`Pedido #${order.order_number}`}
        description={`Criado em ${formatDate(order.created_at)}`}
        actions={
          <span className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${statusClass(order.status)}`}>
            {statusLabel(order.status)}
          </span>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Produtos ({order.items.length})</h2>
            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-gray-200 p-3 sm:flex-row sm:items-center">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                    {item.product_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.product_image} alt={item.product_name} className="absolute inset-0 h-full w-full object-contain p-1" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold uppercase leading-5 text-gray-900">{item.product_name}</div>
                    <div className="mt-1 text-xs text-gray-500">{item.product_sku || "SKU pendente"}</div>
                    <div className="mt-2 text-sm text-gray-600">
                      {item.quantity} x {item.unit_price <= 0 ? "valor a definir" : formatCurrency(item.unit_price)}
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Total do item</div>
                    <div className="mt-1 text-lg font-bold text-gray-900">
                      {item.total_price <= 0 ? "A definir" : formatCurrency(item.total_price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Dados do pedido</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <InfoBlock label="Banca" value={order.customer_name} />
              <InfoBlock label="Telefone" value={order.customer_phone || "-"} />
              <InfoBlock label="Entrega" value={order.shipping_method || "A combinar"} />
              <InfoBlock label="Rastreamento" value={order.tracking_code || "Ainda não informado"} />
              <InfoBlock label="Endereço" value={order.shipping_address || "-"} className="md:col-span-2" />
              <InfoBlock label="CEP" value={order.shipping_cep || "-"} />
            </div>
            {order.notes || order.admin_notes ? (
              <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
                {order.notes ? <p>{order.notes}</p> : null}
                {order.admin_notes ? <p className="mt-2">{order.admin_notes}</p> : null}
              </div>
            ) : null}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Checkout</h2>
            <div className="mt-4 space-y-3 text-sm">
              <SummaryLine label="Subtotal" value={order.subtotal <= 0 ? "A definir" : formatCurrency(order.subtotal)} />
              <SummaryLine label="Frete" value={order.shipping_fee <= 0 ? "A combinar" : formatCurrency(order.shipping_fee)} />
              <SummaryLine label="Pagamento" value={paymentLabel(order.payment_method)} />
              <SummaryLine label="Status do pagamento" value={paymentStatusLabel(order.payment_status)} />
              <div className="border-t border-gray-200 pt-3">
                <SummaryLine
                  label="Total"
                  value={order.total <= 0 ? "Valor a definir" : formatCurrency(order.total)}
                  strong
                />
              </div>
            </div>
            {order.asaas_invoice_url ? (
              <a
                href={order.asaas_invoice_url}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#ff5c00] px-4 text-sm font-semibold text-white hover:bg-[#e05400]"
              >
                Abrir cobrança
                <IconExternalLink size={17} />
              </a>
            ) : null}
          </section>

          {order.asaas_pix_payload ? (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">Pix copia e cola</h2>
              <p className="mt-3 break-all rounded-xl bg-gray-50 p-3 text-xs leading-5 text-gray-600">{order.asaas_pix_payload}</p>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function InfoBlock({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-2xl bg-gray-50 p-4 ${className}`.trim()}>
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{label}</div>
      <div className="mt-2 text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function SummaryLine({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-gray-600">{label}</span>
      <span className={`${strong ? "text-lg font-bold text-gray-900" : "font-semibold text-gray-900"}`}>{value}</span>
    </div>
  );
}

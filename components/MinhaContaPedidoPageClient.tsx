"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { signOut as nextAuthSignOut, useSession } from "next-auth/react";
import MinhaContaSidebar from "@/components/minha-conta/MinhaContaSidebar";

type OrderDetail = {
  id: string;
  order_number?: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  customer_address?: string | null;
  banca_id: string;
  banca_name?: string;
  banca_address?: string;
  banca_whatsapp?: string;
  items: Array<{
    id?: string;
    product_id?: string;
    product_name?: string;
    product_image?: string;
    quantity?: number;
    unit_price?: number;
    total_price?: number;
  }>;
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: string;
  payment_method: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  estimated_delivery?: string | null;
  discount?: number;
  coupon_code?: string | null;
  coupon_discount?: number;
  tax?: number;
  addons_total?: number;
};

export default function MinhaContaPedidoPageClient() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const orderId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState<string>("");

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace("/entrar/cliente");
      return;
    }

    let active = true;
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const [profileResponse, orderResponse] = await Promise.all([
          fetch("/api/minha-conta/profile", {
            credentials: "include",
            cache: "no-store",
          }),
          fetch(`/api/orders/${encodeURIComponent(orderId)}?scope=customer`, {
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        const [profileJson, orderJson] = await Promise.all([
          profileResponse.json().catch(() => null),
          orderResponse.json().catch(() => null),
        ]);

        if (!active) return;

        if (profileResponse.ok && profileJson?.success) {
          setProfileAvatar(profileJson.data?.profile?.avatar_url || "");
        } else {
          setProfileAvatar(((session?.user as any)?.avatar_url as string | null) || "");
        }

        if (!orderResponse.ok || !orderJson?.ok || !orderJson?.data) {
          throw new Error(orderJson?.error || "Pedido nao encontrado");
        }

        setOrder(orderJson.data);
      } catch (fetchError: any) {
        if (active) setError(fetchError?.message || "Nao foi possivel carregar o pedido");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOrder();
    return () => {
      active = false;
    };
  }, [orderId, router, session?.user, status]);

  const items = useMemo(() => order?.items || [], [order]);
  const displayOrderNumber = order?.order_number || order?.id || "";
  const normalizedStatus = String(order?.status || "").toLowerCase();
  const isCompleted = ["completed", "entregue"].includes(normalizedStatus);
  const isCancelled = ["cancelled", "cancelado", "canceled"].includes(normalizedStatus);

  async function logout() {
    await nextAuthSignOut({ callbackUrl: "/" });
  }

  async function cancelOrder() {
    if (!order || updatingStatus || isCompleted || isCancelled) return;

    try {
      setUpdatingStatus(true);
      setError(null);

      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: order.id,
          status: "cancelado",
          scope: "customer",
        }),
      });

      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.ok) {
        throw new Error(json?.error || "Nao foi possivel cancelar o pedido");
      }

      setOrder((current) => (current ? { ...current, status: json.data?.status || "cancelado" } : current));
    } catch (cancelError: any) {
      setError(cancelError?.message || "Nao foi possivel cancelar o pedido");
    } finally {
      setUpdatingStatus(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="container-max py-8">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-48 rounded bg-gray-200" />
          <div className="h-96 rounded-xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  if (!order) {
    return (
      <section className="container-max py-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-700">{error || "Pedido nao encontrado."}</div>
          <div className="mt-3">
            <button onClick={() => router.push("/minha-conta?menu=pedidos")} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50">
              Voltar
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container-max py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <MinhaContaSidebar
          currentKey="pedidos"
          userName={session?.user?.name || order.customer_name || "Usuario"}
          userEmail={session?.user?.email || order.customer_email || ""}
          avatarUrl={profileAvatar}
          onLogout={logout}
        />

        <div className="space-y-4 lg:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff5c00]">Compras e beneficios</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-lg font-semibold sm:text-xl">Pedido #{displayOrderNumber}</h1>
                <span className={`inline-flex items-center rounded-full px-2 py-[2px] text-[12px] font-semibold ${isCompleted ? "bg-emerald-50 text-emerald-700" : isCancelled ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700"}`}>
                  {isCompleted ? "Concluido" : isCancelled ? "Cancelado" : "Em andamento"}
                </span>
              </div>

              {!isCompleted && !isCancelled ? (
                <button
                  type="button"
                  onClick={cancelOrder}
                  disabled={updatingStatus}
                  className="rounded-md border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                >
                  {updatingStatus ? "Cancelando..." : "Cancelar pedido"}
                </button>
              ) : null}
            </div>

            <div className="mt-2 text-sm text-gray-600">
              Veja o resumo do pedido, a banca responsavel e a forma de pagamento sem depender de telas soltas da conta.
            </div>
            <div className="mt-1 text-[12px] text-gray-500">Data do pedido: {new Date(order.created_at).toLocaleString("pt-BR")}</div>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : null}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <h2 className="text-base font-semibold">Itens</h2>
                <div className="mt-3 space-y-2">
                  {items.map((item, index) => (
                    <div key={item.id || `${item.product_id || "item"}-${index}`} className="rounded-xl border border-gray-200 p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                          {item.product_image ? <Image src={item.product_image} alt={item.product_name || "Produto"} fill sizes="40px" className="object-cover" /> : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold">{item.product_name || "Produto"}</div>
                          <div className="text-[12px] text-gray-600">
                            Preco:{" "}
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(item.unit_price || 0))}
                          </div>
                        </div>
                        <div className="text-sm font-semibold">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(item.total_price || 0))}
                        </div>
                        <div className="ml-2 text-[12px] text-gray-600">Qtd: {Number(item.quantity || 0)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {order.customer_address ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <h2 className="text-base font-semibold">Entrega</h2>
                  <div className="mt-3 text-sm text-gray-700">{order.customer_address}</div>
                  {order.notes ? <div className="mt-2 text-sm text-gray-500">Obs.: {order.notes}</div> : null}
                </div>
              ) : null}
            </div>

            <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold">Resumo</h2>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(order.subtotal || 0))}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Taxa de entrega</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(order.shipping_fee || 0))}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Desconto</span>
                  <span className="text-emerald-700">
                    (-) {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number((order.discount || 0) + (order.coupon_discount || 0)))}
                  </span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex items-center justify-between text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-extrabold">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(order.total || 0))}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-semibold">Informacoes da banca</h3>
                <div className="mt-2 space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">
                  {order.banca_name ? <div className="font-medium text-gray-800">Banca: {order.banca_name}</div> : null}
                  {order.banca_whatsapp ? (
                    <a
                      href={`https://wa.me/${order.banca_whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 hover:underline"
                    >
                      WhatsApp: {order.banca_whatsapp}
                    </a>
                  ) : null}
                  {order.banca_address ? <div className="text-gray-700">{order.banca_address}</div> : null}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-semibold">Pagamento</h3>
                <div className="mt-2 rounded-xl border border-gray-200 bg-white p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-600">Metodo</span>
                    <span className="font-medium">{formatPaymentMethod(order.payment_method)}</span>
                  </div>
                  {order.estimated_delivery ? (
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="text-gray-600">Previsao</span>
                      <span className="font-medium">{new Date(order.estimated_delivery).toLocaleString("pt-BR")}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatPaymentMethod(value: string) {
  const method = String(value || "").toLowerCase();
  if (method === "pix") return "PIX";
  if (method === "card" || method === "cartao") return "Cartao";
  if (method === "cash" || method === "dinheiro") return "Dinheiro";
  return value || "-";
}

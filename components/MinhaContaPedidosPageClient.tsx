"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut as nextAuthSignOut, useSession } from "next-auth/react";
import MinhaContaSidebar from "@/components/minha-conta/MinhaContaSidebar";

type AccountOrder = {
  id: string;
  total: number;
  status: string;
  created_at: string;
  banca_name?: string;
  shipping_fee?: number;
  items?: Array<{
    product_name?: string;
    product_image?: string;
    quantity?: number;
  }>;
};

type AccountProfile = {
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  created_at: string | null;
};

function PedidosContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ordersTab, setOrdersTab] = useState<"andamento" | "concluidos" | "cancelados">("andamento");

  const finalStatuses = useMemo(() => ["completed", "entregue"], []);
  const cancelledStatuses = useMemo(() => ["cancelled", "cancelado", "canceled"], []);

  const inProgressOrders = useMemo(
    () =>
      orders.filter((order) => {
        const statusValue = String(order.status || "").toLowerCase();
        return !finalStatuses.includes(statusValue) && !cancelledStatuses.includes(statusValue);
      }),
    [cancelledStatuses, finalStatuses, orders],
  );

  const completedOrders = useMemo(
    () => orders.filter((order) => finalStatuses.includes(String(order.status || "").toLowerCase())),
    [finalStatuses, orders],
  );

  const cancelledOrders = useMemo(
    () => orders.filter((order) => cancelledStatuses.includes(String(order.status || "").toLowerCase())),
    [cancelledStatuses, orders],
  );

  const totalSpent = useMemo(
    () =>
      orders
        .filter((order) => !cancelledStatuses.includes(String(order.status || "").toLowerCase()))
        .reduce((sum, order) => sum + Number(order.total || 0), 0),
    [cancelledStatuses, orders],
  );

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace("/entrar/cliente");
    }
  }, [router, status]);

  useEffect(() => {
    if (status !== "authenticated") return;

    let active = true;
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [profileResponse, ordersResponse] = await Promise.all([
          fetch("/api/minha-conta/profile", {
            credentials: "include",
            cache: "no-store",
          }),
          fetch("/api/orders?limit=50&sort=created_at&order=desc&scope=customer", {
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        const [profileJson, ordersJson] = await Promise.all([
          profileResponse.json().catch(() => null),
          ordersResponse.json().catch(() => null),
        ]);

        if (!active) return;

        if (profileResponse.ok && profileJson?.success) {
          setProfile(profileJson.data?.profile || null);
        }

        if (!ordersResponse.ok || !Array.isArray(ordersJson?.items)) {
          throw new Error(ordersJson?.error || "Nao foi possivel carregar seus pedidos");
        }

        setOrders(ordersJson.items || []);
      } catch (fetchError: any) {
        if (active) setError(fetchError?.message || "Nao foi possivel carregar seus pedidos");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [status]);

  async function logout() {
    await nextAuthSignOut({ callbackUrl: "/" });
  }

  const activeList =
    ordersTab === "andamento" ? inProgressOrders : ordersTab === "concluidos" ? completedOrders : cancelledOrders;

  return (
    <section className="container-max py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <MinhaContaSidebar
          currentKey="pedidos"
          userName={profile?.full_name || session?.user?.name || "Usuario"}
          userEmail={profile?.email || session?.user?.email || ""}
          userMeta={profile?.phone || profile?.created_at ? [profile?.phone, profile?.created_at ? formatJoined(profile.created_at) : null].filter(Boolean).join(" · ") : null}
          avatarUrl={profile?.avatar_url || ((session?.user as any)?.avatar_url as string | null) || ""}
          onLogout={logout}
        />

        <main className="space-y-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-md lg:col-span-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff5c00]">Compras do cliente</p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">Pedidos</h1>
            <p className="mt-2 text-sm text-gray-600">
              O historico operacional da sua conta: compras abertas, concluidas e canceladas em um unico fluxo.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <div className="font-semibold">Objetivo desta area</div>
            <p className="mt-2 text-blue-800">
              Acompanhar pedidos em andamento, revisar recorrencia e agir rapido quando houver qualquer atrito na compra.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Pedidos" value={orders.length} description="Compras registradas pela sua conta." />
            <MetricCard label="Em andamento" value={inProgressOrders.length} description="Pedidos que ainda pedem acompanhamento." />
            <MetricCard label="Concluidos" value={completedOrders.length} description="Compras finalizadas com sucesso." />
            <MetricCard
              label="Total gasto"
              value={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalSpent)}
              description="Movimentacao total da conta na plataforma."
            />
          </div>

          <div className="flex gap-6 text-sm">
            {([
              { key: "andamento", label: "Em andamento" },
              { key: "concluidos", label: "Concluidos" },
              { key: "cancelados", label: "Cancelados" },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setOrdersTab(tab.key)}
                className={`relative pb-2 font-semibold ${ordersTab === tab.key ? "text-black" : "text-gray-500"}`}
              >
                {tab.label}
                {ordersTab === tab.key ? <span className="absolute -bottom-[1px] left-0 h-[3px] w-full rounded bg-[#ff5c00]" /> : null}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
              Carregando pedidos...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">{error}</div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {activeList.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
                  {ordersTab === "andamento"
                    ? "Voce nao possui pedidos em andamento."
                    : ordersTab === "concluidos"
                      ? "Voce ainda nao concluiu pedidos."
                      : "Voce nao possui pedidos cancelados."}
                </div>
              ) : (
                activeList.map((order) => (
                  <Link key={order.id} href={`/minha-conta/pedidos/${order.id}`} className="rounded-xl border border-gray-200 p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">Pedido {order.id}</div>
                        <div className="text-xs text-gray-500">{order.banca_name || "Banca"}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(order.total || 0))}
                        </div>
                        <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString("pt-BR")}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 font-medium text-gray-600">
                        {String(order.status || "pedido").replace(/_/g, " ")}
                      </span>
                      <span className="text-gray-500">{order.items?.length || 0} item(ns)</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">Praticidade de compra</h2>
              <div className="mt-3 space-y-3 text-sm text-gray-600">
                <div className="rounded-xl border border-gray-200 p-3">
                  <div className="font-semibold text-gray-900">Use a central de compras</div>
                  <p className="mt-1">Veja recorrencia, bancas mais usadas e sinais para recomprar melhor.</p>
                  <Link href="/minha-conta/inteligencia" className="mt-3 inline-flex text-sm font-semibold text-[#ff5c00] hover:opacity-80">
                    Abrir central
                  </Link>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">Dados de apoio</h2>
              <div className="mt-3 space-y-3 text-sm text-gray-600">
                <div className="rounded-xl border border-gray-200 p-3">
                  <div className="font-semibold text-gray-900">Revise seus enderecos</div>
                  <p className="mt-1">Enderecos corretos reduzem erro de entrega e aceleram o checkout.</p>
                  <Link href="/minha-conta/enderecos" className="mt-3 inline-flex text-sm font-semibold text-[#ff5c00] hover:opacity-80">
                    Abrir enderecos
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </section>
  );
}

function MetricCard({ label, value, description }: { label: string; value: string | number; description: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{label}</div>
      <div className="mt-3 text-2xl font-semibold text-gray-900">{value}</div>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}

function formatJoined(dateStr: string) {
  try {
    const date = new Date(dateStr);
    const formatted = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
    return `Entrou em ${formatted.replace(/\./g, "")}`;
  } catch {
    return "";
  }
}

export default function MinhaContaPedidosPageClient() {
  return (
    <Suspense
      fallback={
        <div className="container-max py-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 rounded bg-gray-200" />
            <div className="mt-4 h-64 rounded-xl bg-gray-200" />
          </div>
        </div>
      }
    >
      <PedidosContent />
    </Suspense>
  );
}

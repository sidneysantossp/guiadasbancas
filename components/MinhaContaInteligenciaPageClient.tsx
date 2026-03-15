"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import MinhaContaSidebar from "@/components/minha-conta/MinhaContaSidebar";

type IntelligenceResponse = {
  summary: {
    total_orders: number;
    in_progress_orders: number;
    completed_orders: number;
    total_spent: number;
    average_ticket: number;
    favorites_count: number;
    available_coupons: number;
  };
  recent_orders: Array<{
    id: string;
    total: number;
    status: string;
    created_at: string;
    banca_name: string;
  }>;
  top_bancas: Array<{
    bancaName: string;
    orders: number;
    total: number;
  }>;
  reorder_candidates: Array<{
    product_id: string;
    product_name: string;
    banca_name: string;
    purchases: number;
    quantity: number;
    last_purchased_at: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
  }>;
  coupons: Array<{
    id: string;
    code: string;
    title: string;
    discount_text: string;
    banca_name: string;
    source_label: string;
  }>;
};

function IntelligenceContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [data, setData] = useState<IntelligenceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileAvatar, setProfileAvatar] = useState<string>("");
  const [profilePhone, setProfilePhone] = useState<string>("");
  const [profileCreatedAt, setProfileCreatedAt] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace("/entrar/cliente");
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const [profileResponse, intelligenceResponse] = await Promise.all([
          fetch("/api/minha-conta/profile", {
            cache: "no-store",
            credentials: "include",
          }),
          fetch("/api/minha-conta/inteligencia", {
            cache: "no-store",
            credentials: "include",
          }),
        ]);

        const [profileJson, intelligenceJson] = await Promise.all([
          profileResponse.json().catch(() => null),
          intelligenceResponse.json().catch(() => null),
        ]);

        if (profileResponse.ok && profileJson?.success) {
          const profile = profileJson.data?.profile;
          setProfileAvatar(profile?.avatar_url || "");
          setProfilePhone(profile?.phone || "");
          setProfileCreatedAt(profile?.created_at || null);
        } else {
          const sessionAvatar = ((session?.user as any)?.avatar_url as string | null) || "";
          setProfileAvatar(sessionAvatar);
        }

        if (!intelligenceResponse.ok || !intelligenceJson?.success) {
          throw new Error(intelligenceJson?.error || "Não foi possível carregar a central de compras");
        }
        setData(intelligenceJson.data);
      } catch (fetchError: any) {
        setError(fetchError?.message || "Não foi possível carregar a central de compras");
      } finally {
        setLoading(false);
      }
    })();
  }, [router, session?.user, status]);

  const sessionUser = session?.user;
  const userName = sessionUser?.name || "Usuário";
  const userEmail = sessionUser?.email || "";

  async function logout() {
    try {
      sessionStorage.clear();
    } catch {}
    await nextAuthSignOut({ callbackUrl: "/" });
  }

  return (
    <section className="container-max py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <MinhaContaSidebar
          currentKey="inteligencia"
          userName={userName}
          userEmail={userEmail}
          userMeta={profilePhone || profileCreatedAt ? [profilePhone, profileCreatedAt ? formatJoined(profileCreatedAt) : null].filter(Boolean).join(" · ") : null}
          avatarUrl={profileAvatar}
          onLogout={logout}
        />

        <main className="space-y-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-md lg:col-span-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff5c00]">
              Visão da conta
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">Central de compras</h1>
            <p className="mt-2 text-sm text-gray-600">
              Uma leitura rápida do seu histórico de pedidos, das bancas que você mais compra e do que vale fazer agora para comprar melhor.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
              Carregando inteligência da conta...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">{error}</div>
          ) : data ? (
            <>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Pedidos</div>
                  <div className="mt-3 text-2xl font-semibold text-gray-900">{data.summary.total_orders}</div>
                  <p className="mt-1 text-sm text-gray-500">Total de compras feitas pela sua conta.</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Em andamento</div>
                  <div className="mt-3 text-2xl font-semibold text-gray-900">{data.summary.in_progress_orders}</div>
                  <p className="mt-1 text-sm text-gray-500">Pedidos que ainda pedem acompanhamento.</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Total gasto</div>
                  <div className="mt-3 text-2xl font-semibold text-gray-900">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(data.summary.total_spent)}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Volume financeiro movimentado na plataforma.</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Favoritos</div>
                  <div className="mt-3 text-2xl font-semibold text-gray-900">{data.summary.favorites_count}</div>
                  <p className="mt-1 text-sm text-gray-500">Produtos salvos para comparar ou comprar depois.</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Cupons ativos</div>
                  <div className="mt-3 text-2xl font-semibold text-gray-900">{data.summary.available_coupons}</div>
                  <p className="mt-1 text-sm text-gray-500">Beneficios com aderencia a sua conta.</p>
                </div>
              </div>

              {data.recommendations.length > 0 ? (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                  <div className="font-semibold">Próximos melhores passos</div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {data.recommendations.map((recommendation) => (
                      <div key={recommendation.title} className="rounded-xl border border-blue-200 bg-white/80 p-3">
                        <div className="font-medium text-blue-900">{recommendation.title}</div>
                        <p className="mt-1 text-blue-800">{recommendation.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <h2 className="text-base font-semibold text-gray-900">Pedidos recentes</h2>
                  <div className="mt-3 space-y-3">
                    {data.recent_orders.length === 0 ? (
                      <div className="text-sm text-gray-500">Nenhum pedido encontrado.</div>
                    ) : (
                      data.recent_orders.map((order) => (
                        <div key={order.id} className="rounded-xl border border-gray-200 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold text-gray-900">Pedido {order.id}</div>
                              <div className="text-xs text-gray-500">{order.banca_name}</div>
                            </div>
                            <div className="text-sm font-semibold text-gray-900">
                              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(order.total)}
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleString("pt-BR")}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <h2 className="text-base font-semibold text-gray-900">Bancas mais recorrentes</h2>
                  <div className="mt-3 space-y-3">
                    {data.top_bancas.length === 0 ? (
                      <div className="text-sm text-gray-500">Ainda não há recorrência suficiente para leitura.</div>
                    ) : (
                      data.top_bancas.map((banca) => (
                        <div key={banca.bancaName} className="rounded-xl border border-gray-200 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-sm font-semibold text-gray-900">{banca.bancaName}</div>
                            <div className="text-xs font-medium text-gray-500">{banca.orders} pedido(s)</div>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            Total movimentado:{" "}
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(banca.total)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>

              <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-gray-900">Cupons prontos para compra</h2>
                  <Link href="/minha-conta/cupons" className="text-sm font-semibold text-[#ff5c00] hover:opacity-80">
                    Ver cupons
                  </Link>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {data.coupons.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 px-4 py-5 text-sm text-gray-500 md:col-span-2 xl:col-span-3">
                      Sua conta ainda nao tem cupons priorizados.
                    </div>
                  ) : (
                    data.coupons.map((coupon) => (
                      <div key={`${coupon.id}:${coupon.code}`} className="rounded-xl border border-gray-200 p-3">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ff5c00]">
                          {coupon.source_label}
                        </div>
                        <div className="mt-2 text-sm font-semibold text-gray-900">{coupon.title}</div>
                        <div className="mt-1 text-xs text-gray-500">{coupon.banca_name}</div>
                        <div className="mt-3 inline-flex rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-extrabold tracking-[0.12em] text-[#ff5c00]">
                          {coupon.code}
                        </div>
                        <div className="mt-2 text-sm text-gray-600">{coupon.discount_text}</div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-gray-900">Oportunidades de recompra</h2>
                  <Link href="/minha-conta/pedidos" className="text-sm font-semibold text-[#ff5c00] hover:opacity-80">
                    Ver historico
                  </Link>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {data.reorder_candidates.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 px-4 py-5 text-sm text-gray-500 md:col-span-2 xl:col-span-3">
                      Ainda nao ha itens suficientes para leitura de recompra.
                    </div>
                  ) : (
                    data.reorder_candidates.map((candidate) => (
                      <div key={`${candidate.product_id}:${candidate.last_purchased_at}`} className="rounded-xl border border-gray-200 p-3">
                        <div className="text-sm font-semibold text-gray-900">{candidate.product_name}</div>
                        <div className="mt-1 text-xs text-gray-500">{candidate.banca_name}</div>
                        <div className="mt-3 grid gap-2 text-sm text-gray-600">
                          <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                            <span>Compras</span>
                            <span className="font-medium text-gray-800">{candidate.purchases}</span>
                          </div>
                          <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                            <span>Qtd total</span>
                            <span className="font-medium text-gray-800">{candidate.quantity}</span>
                          </div>
                          <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                            <span>Ultima compra</span>
                            <span className="font-medium text-gray-800">{new Date(candidate.last_purchased_at).toLocaleDateString("pt-BR")}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </>
          ) : null}
        </main>
      </div>
    </section>
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

export default function MinhaContaInteligenciaPageClient() {
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
      <IntelligenceContent />
    </Suspense>
  );
}

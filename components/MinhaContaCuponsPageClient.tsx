"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut as nextAuthSignOut, useSession } from "next-auth/react";
import MinhaContaSidebar from "@/components/minha-conta/MinhaContaSidebar";

type CouponItem = {
  id: string;
  code: string;
  title: string;
  discount_text: string;
  benefit_type: "percent" | "fixed" | "free_shipping" | "unknown";
  benefit_value: number | null;
  seller_id: string;
  banca_name: string;
  active: boolean;
  highlight: boolean;
  expires_at: string | null;
  created_at: string | null;
  source: "recent" | "favorite" | "marketplace";
  source_label: string;
};

type CouponsResponse = {
  summary: {
    available_count: number;
    expiring_soon_count: number;
    recent_bancas_count: number;
  };
  items: CouponItem[];
};

type AccountProfile = {
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  created_at: string | null;
};

function CuponsContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [data, setData] = useState<CouponsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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
        const [profileResponse, couponsResponse] = await Promise.all([
          fetch("/api/minha-conta/profile", {
            credentials: "include",
            cache: "no-store",
          }),
          fetch("/api/minha-conta/cupons", {
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        const [profileJson, couponsJson] = await Promise.all([
          profileResponse.json().catch(() => null),
          couponsResponse.json().catch(() => null),
        ]);

        if (!active) return;

        if (profileResponse.ok && profileJson?.success) {
          setProfile(profileJson.data?.profile || null);
        }

        if (!couponsResponse.ok || !couponsJson?.success) {
          throw new Error(couponsJson?.error || "Nao foi possivel carregar seus cupons");
        }

        setData(couponsJson.data);
      } catch (fetchError: any) {
        if (active) setError(fetchError?.message || "Nao foi possivel carregar seus cupons");
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

  async function useCoupon(coupon: CouponItem) {
    try {
      await navigator.clipboard.writeText(coupon.code);
    } catch {}

    try {
      localStorage.setItem("gb:checkout:coupon", coupon.code);
    } catch {}

    setCopiedCode(coupon.code);
    setTimeout(() => setCopiedCode(null), 1500);
    router.push(`/checkout?coupon=${encodeURIComponent(coupon.code)}`);
  }

  return (
    <section className="container-max py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <MinhaContaSidebar
          currentKey="cupons"
          userName={profile?.full_name || session?.user?.name || "Usuario"}
          userEmail={profile?.email || session?.user?.email || ""}
          userMeta={profile?.phone || profile?.created_at ? [profile?.phone, profile?.created_at ? formatJoined(profile.created_at) : null].filter(Boolean).join(" · ") : null}
          avatarUrl={profile?.avatar_url || ((session?.user as any)?.avatar_url as string | null) || ""}
          onLogout={logout}
        />

        <main className="space-y-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-md lg:col-span-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff5c00]">
              Beneficios ativos
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">Cupons</h1>
            <p className="mt-2 text-sm text-gray-600">
              Incentivos reais de compra ligados a bancas com relevancia para voce dentro do marketplace.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <div className="font-semibold">Objetivo desta area</div>
            <p className="mt-2 text-blue-800">
              Organizar beneficios acionaveis e levar voce ao checkout com o codigo certo, sem depender de busca manual.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
              Carregando cupons...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">{error}</div>
          ) : data ? (
            <>
              <div className="grid gap-3 md:grid-cols-3">
                <MetricCard
                  label="Cupons ativos"
                  value={data.summary.available_count}
                  description="Beneficios disponiveis para uso imediato."
                />
                <MetricCard
                  label="Expiram em breve"
                  value={data.summary.expiring_soon_count}
                  description="Cupons com janela curta de uso."
                />
                <MetricCard
                  label="Bancas recorrentes"
                  value={data.summary.recent_bancas_count}
                  description="Origens com historico recente na sua conta."
                />
              </div>

              {data.items.length === 0 ? (
                <div className="grid place-items-center rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-600">
                  <div className="font-semibold">Sua conta ainda nao tem cupons priorizados</div>
                  <div className="mt-1 text-gray-500">Compre em mais bancas, salve favoritos ou acompanhe vitrines para destravar novos incentivos.</div>
                  <Link href="/buscar" className="mt-4 rounded-md bg-[#ff5c00] px-4 py-2 font-semibold text-white hover:opacity-95">
                    Explorar bancas e produtos
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                  {data.items.map((coupon) => (
                    <div key={`${coupon.seller_id}:${coupon.code}`} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="inline-flex rounded-full bg-[#fff7f2] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ff5c00]">
                            {coupon.source_label}
                          </div>
                          <div className="mt-3 text-base font-semibold text-gray-900">{coupon.title}</div>
                          <div className="mt-1 text-sm text-gray-500">{coupon.banca_name}</div>
                        </div>
                        <div className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-extrabold tracking-[0.12em] text-[#ff5c00]">
                          {coupon.code}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 text-sm text-gray-600">
                        <InfoRow label="Beneficio" value={coupon.discount_text} />
                        <InfoRow
                          label="Validade"
                          value={coupon.expires_at ? formatDate(coupon.expires_at) : "Sem data de expiração"}
                        />
                        <InfoRow
                          label="Uso"
                          value={coupon.source === "recent" ? "Compatível com sua recorrência de compra" : coupon.source === "favorite" ? "Relacionado aos seus interesses salvos" : "Disponível no marketplace"}
                        />
                      </div>

                      <div className="mt-4 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => useCoupon(coupon)}
                          className="rounded-md bg-[#ff5c00] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-95"
                        >
                          {copiedCode === coupon.code ? "Copiado!" : "Usar no checkout"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : null}
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md bg-gray-50 px-3 py-2">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium text-gray-800">{value}</span>
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

function formatDate(dateStr: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
      .format(new Date(dateStr))
      .replace(/\./g, "");
  } catch {
    return dateStr;
  }
}

export default function MinhaContaCuponsPageClient() {
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
      <CuponsContent />
    </Suspense>
  );
}

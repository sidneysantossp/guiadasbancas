"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut as nextAuthSignOut, useSession } from "next-auth/react";
import MinhaContaSidebar from "@/components/minha-conta/MinhaContaSidebar";

type FavoriteItem = {
  id: string;
  product_id: string;
  created_at: string;
  products?: {
    id: string;
    name: string;
    price: number;
    banca_id?: string | null;
    images?: string[];
  };
};

type AccountProfile = {
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  created_at: string | null;
};

function FavoritosContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        const [profileResponse, favoritesResponse] = await Promise.all([
          fetch("/api/minha-conta/profile", {
            credentials: "include",
            cache: "no-store",
          }),
          fetch("/api/favorites", {
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        const [profileJson, favoritesJson] = await Promise.all([
          profileResponse.json().catch(() => null),
          favoritesResponse.json().catch(() => null),
        ]);

        if (!active) return;

        if (profileResponse.ok && profileJson?.success) {
          setProfile(profileJson.data?.profile || null);
        }

        if (!favoritesResponse.ok || !favoritesJson?.success) {
          throw new Error(favoritesJson?.error || "Nao foi possivel carregar seus favoritos");
        }

        setFavorites(favoritesJson.data || []);
      } catch (fetchError: any) {
        if (active) setError(fetchError?.message || "Nao foi possivel carregar seus favoritos");
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

  async function removeFavorite(productId: string) {
    try {
      setRemovingId(productId);
      const response = await fetch(`/api/favorites?product_id=${encodeURIComponent(productId)}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.success) {
        throw new Error(json?.error || "Nao foi possivel remover o favorito");
      }
      setFavorites((current) => current.filter((item) => item.product_id !== productId));
    } catch (removeError: any) {
      setError(removeError?.message || "Nao foi possivel remover o favorito");
    } finally {
      setRemovingId(null);
    }
  }

  const favoritesCount = favorites.length;
  const observedValue = useMemo(
    () => favorites.reduce((sum, item) => sum + Number(item.products?.price || 0), 0),
    [favorites],
  );
  const uniqueBancas = useMemo(
    () => new Set(favorites.map((item) => item.products?.banca_id).filter(Boolean)).size,
    [favorites],
  );

  return (
    <section className="container-max py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <MinhaContaSidebar
          currentKey="favoritos"
          userName={profile?.full_name || session?.user?.name || "Usuario"}
          userEmail={profile?.email || session?.user?.email || ""}
          userMeta={profile?.phone || profile?.created_at ? [profile?.phone, profile?.created_at ? formatJoined(profile.created_at) : null].filter(Boolean).join(" · ") : null}
          avatarUrl={profile?.avatar_url || ((session?.user as any)?.avatar_url as string | null) || ""}
          onLogout={logout}
        />

        <main className="space-y-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-md lg:col-span-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff5c00]">
              Interesses salvos
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">Favoritos</h1>
            <p className="mt-2 text-sm text-gray-600">
              Uma area para guardar produtos relevantes e voltar para eles quando fizer sentido comprar.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <div className="font-semibold">Objetivo desta area</div>
            <p className="mt-2 text-blue-800">
              Ajudar voce a comparar melhor, acompanhar interesse recorrente e reduzir atrito na hora de comprar.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Produtos salvos"
              value={favoritesCount}
              description="Itens que voce marcou para voltar depois."
            />
            <MetricCard
              label="Valor observado"
              value={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(observedValue)}
              description="Soma de referencia dos itens favoritos."
            />
            <MetricCard
              label="Bancas diferentes"
              value={uniqueBancas}
              description="Diversidade de origem dos itens acompanhados."
            />
          </div>

          {loading ? (
            <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
              Carregando favoritos...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">{error}</div>
          ) : favorites.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-600">
              <div className="font-semibold">Voce ainda nao tem favoritos</div>
              <div className="mt-1 text-gray-500">Salve produtos para decidir melhor depois ou comprar com menos atrito.</div>
              <Link href="/buscar" className="mt-4 rounded-md bg-[#ff5c00] px-4 py-2 font-semibold text-white hover:opacity-95">
                Explorar produtos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {favorites.map((favorite) => {
                const product = favorite.products;
                if (!product) return null;

                return (
                  <div key={favorite.id} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative h-20 w-20 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                        {product.images?.[0] ? (
                          <Image src={product.images[0]} alt={product.name} fill sizes="80px" className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 grid place-items-center text-[11px] font-medium text-gray-400">
                            Sem imagem
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="line-clamp-2 text-sm font-semibold text-gray-900">{product.name}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          Salvo em {new Date(favorite.created_at).toLocaleDateString("pt-BR")}
                        </div>
                        <div className="mt-2 text-base font-semibold text-[#ff5c00]">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(product.price || 0))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => removeFavorite(product.id)}
                        disabled={removingId === product.id}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
                      >
                        {removingId === product.id ? "Removendo..." : "Remover"}
                      </button>
                      <Link
                        href={`/produto/${product.id}`}
                        className="rounded-md bg-[#ff5c00] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-95"
                      >
                        Ver produto
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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

export default function MinhaContaFavoritosPageClient() {
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
      <FavoritosContent />
    </Suspense>
  );
}

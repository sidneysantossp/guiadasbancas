"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import { loadStoredLocation, type UserLocation, haversineKm } from "@/lib/location";
import { buildBancaHref } from "@/lib/slug";

export type Arrival = {
  id: string;
  name: string;
  cover: string;
  avatar: string;
  feeLabel: string;
  distanceLabel: string;
  itemsLabel: string;
  href: string;
};

const FALLBACK_ARRIVALS: Arrival[] = [
  {
    id: "fallback-1",
    name: "Banca Modelo",
    cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=60",
    avatar: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=200&auto=format&fit=crop",
    feeLabel: "Entrega combinada",
    distanceLabel: "Próximo de você",
    itemsLabel: "Atualizando catálogo",
    href: "/bancas",
  },
];

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#fff3ec] text-[#ff5c00] px-2 py-[3px] text-[11px] font-semibold">
      {children}
    </span>
  );
}

function FeeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
      <path d="M12 1a11 11 0 100 22 11 11 0 000-22zm1 17h-2v-2h2v2zm0-4h-2V6h2v8z" />
    </svg>
  );
}
function DistanceIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5z"/>
    </svg>
  );
}
function ItemsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
      <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
    </svg>
  );
}

function ArrivalCard({ a }: { a: Arrival }) {
  return (
    <Link href={a.href as any} className="block rounded-2xl bg-white border border-[#ff5c00] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Imagem com padding */}
      <div className="p-2">
        <div className="relative h-32 w-full rounded-xl overflow-hidden">
          <Image src={a.cover} alt={a.name} fill className="object-cover" />
        </div>
      </div>
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white shadow">
            <Image src={a.avatar} alt={a.name} width={36} height={36} className="h-full w-full object-cover" />
          </div>
          <div className="text-[13px] font-semibold leading-tight line-clamp-1">{a.name}</div>
        </div>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <Chip><FeeIcon /> {a.feeLabel}</Chip>
          <Chip><DistanceIcon /> {a.distanceLabel}</Chip>
          <Chip><ItemsIcon /> {a.itemsLabel}</Chip>
        </div>
      </div>
    </Link>
  );
}

export default function NewArrivals() {
  const [w, setW] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [userLoc, setUserLoc] = useState<UserLocation | null>(null);
  const [arrivals, setArrivals] = useState<Arrival[]>([]);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  useEffect(() => {
    try {
      setUserLoc(loadStoredLocation());
    } catch {}
  }, []);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/bancas", { cache: "no-store" });
        if (!res.ok) throw new Error("fail");
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];
        const sorted = [...list]
          .filter((b: any) => b?.active !== false)
          .sort((a: any, b: any) => {
            const aTime = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bTime = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
            if (aTime && bTime) return bTime - aTime;
            if (aTime) return -1;
            if (bTime) return 1;
            return (b.order ?? 0) - (a.order ?? 0);
          })
          .slice(0, 6);

        const mapped: Arrival[] = sorted.map((b: any) => {
          const cover = b.cover || b.images?.cover || "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=60";
          const avatar = b.avatar || b.images?.avatar || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=60";
          const payments = Array.isArray(b.payments) ? b.payments.filter(Boolean) : [];
          const categories = Array.isArray(b.categories) ? b.categories.filter(Boolean) : [];
          const distance = (() => {
            const lat = typeof b.lat === "number" ? b.lat : b.location?.lat;
            const lng = typeof b.lng === "number" ? b.lng : b.location?.lng;
            if (!userLoc || typeof lat !== "number" || typeof lng !== "number") return null;
            try {
              return haversineKm({ lat: userLoc.lat, lng: userLoc.lng }, { lat, lng });
            } catch {
              return null;
            }
          })();
          const distanceLabel = distance == null
            ? (b.addressObj?.city ? b.addressObj.city : "Confira detalhes")
            : distance < 1
              ? `${Math.round(distance * 1000)} m`
              : `${distance.toFixed(1)} km`;
          const feeLabel = payments.length ? `Aceita ${payments.slice(0, 2).join(", ")}` : "Entrega combinada";
          const itemsLabel = categories.length ? `${categories.length} categoria${categories.length > 1 ? "s" : ""}` : "Catálogo em atualização";
          const href = buildBancaHref(b.name || "Banca", b.id, userLoc || b.addressObj?.uf || "sp");
          return {
            id: b.id,
            name: b.name || "Banca",
            cover,
            avatar,
            feeLabel,
            distanceLabel,
            itemsLabel,
            href,
          } satisfies Arrival;
        });

        if (active) setArrivals(mapped);
      } catch {
        if (active) setArrivals([]);
      }
    })();
    return () => {
      active = false;
    };
  }, [userLoc]);
  const perView = w < 640 ? 1 : w < 1024 ? 2 : 3;

  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);
  const data = arrivals.length > 0 ? arrivals : FALLBACK_ARRIVALS;
  const items = useMemo(() => {
    if (data.length === 0) return [] as Arrival[];
    if (data.length >= 6) return data;
    const repeated: Arrival[] = [];
    while (repeated.length < 6) {
      repeated.push(...data);
    }
    return repeated.slice(0, 6);
  }, [data]);
  const track = useMemo(() => [...items, ...items], [items]);

  useEffect(() => {
    setIndex(0);
  }, [items.length]);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => i + 1);
      setAnimating(true);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="w-full">
      <div className="container-max">
        <div className="rounded-2xl bg-gradient-to-r from-[#f6f7ff] to-[#f9fbff] p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" width="23" height="23" fill="#ff5c00" aria-hidden>
                <path d="M14 3l-2 2 3 3 2-2 3 3c-1 3-4 6-7 7l-3-3-2 2-2-2-1 1v-3l6-6c2-2 6-3 6-3l-3 3zM5 18l3 1-2 2H4v-2l1-1z"/>
              </svg>
              <h2 className="text-[15px] sm:text-[16px] font-semibold"><span className="text-[#ff5c00]">Bancas</span> recém chegadas!</h2>
            </div>
            <Link href={("/bancas" as Route)} className="text-[var(--color-primary)] text-sm font-medium hover:underline">Ver todos</Link>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex gap-4"
                style={{
                  transform: `translateX(-${(index * (100 / perView))}%)`,
                  transition: animating ? "transform 600ms ease" : "none",
                }}
                onTransitionEnd={() => {
                  if (index >= items.length) {
                    setAnimating(false);
                    setIndex(0);
                    requestAnimationFrame(() => setAnimating(true));
                  }
                }}
              >
                {track.map((a, i) => (
                  <div key={`${a.id}-${i}`} style={{ flex: `0 0 calc(${100 / perView}% - 1rem)` }} className="shrink-0">
                    <ArrivalCard a={a} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

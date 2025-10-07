"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Route } from "next";
import { buildBancaHref } from "@/lib/slug";
import { loadStoredLocation, type UserLocation } from "@/lib/location";

export type SimpleBanca = {
  id: string;
  name: string;
  cover: string;
  href: string;
};

function useTopBancas(limit = 9) {
  const [items, setItems] = useState<SimpleBanca[]>([]);
  const [userLoc, setUserLoc] = useState<UserLocation | null>(null);

  useEffect(() => {
    try { setUserLoc(loadStoredLocation()); } catch {}
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/bancas", { cache: "no-store" });
        if (!res.ok) throw new Error("fail");
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];
        const filtered = list.filter((b: any) => b?.active !== false).slice(0, limit);
        const mapped: SimpleBanca[] = filtered.map((b: any) => {
          const cover = b.cover || b.images?.cover ||
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=60";
          const href = buildBancaHref(b.name || "Banca", b.id, (userLoc?.state || "sp") as any);
          return { id: b.id, name: b.name || "Banca", cover, href };
        });
        if (active) setItems(mapped);
      } catch {
        if (active) setItems([]);
      }
    })();
    return () => { active = false; };
  }, [userLoc, limit]);

  return items;
}

export default function BancasMegaMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itens = useTopBancas(9);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const scheduleClose = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => setOpen(false), 200);
  };
  const cancelClose = () => {
    if (closeTimeout.current) { clearTimeout(closeTimeout.current); closeTimeout.current = null; }
  };

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-sm font-medium hover:text-[var(--color-primary)]"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Bancas
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 mt-3 w-[960px] xl:w-[1100px] rounded-xl border border-gray-200 bg-white shadow-lg z-50"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="grid grid-rows-3 grid-flow-col gap-x-8 gap-y-4 p-5">
            {itens.map((b) => (
              <Link
                key={b.id}
                href={b.href as Route}
                className="flex items-center gap-3 rounded-md p-2 hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                <div className="relative h-10 w-16 rounded-md overflow-hidden ring-1 ring-black/10">
                  <Image src={b.cover} alt={b.name} fill className="object-cover" />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-black font-medium line-clamp-1 max-w-[200px]">{b.name}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="px-5 pb-5">
            <Link
              href={("/bancas" as Route)}
              className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
              onClick={() => setOpen(false)}
            >
              Ver mais
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

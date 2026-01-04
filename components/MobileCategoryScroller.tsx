"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { categories as fallbackCategories } from "@/components/categoriesData";

type PublicCategory = {
  id: string;
  name: string;
  image: string;
  link: string; // full internal route
  order: number;
};

// Mobile-only rotating carousel (3 per view), square tiles, label below.
// Rendered above the hero and below search.
type MobileCategoryScrollerProps = {
  initialCategories?: PublicCategory[];
};

export default function MobileCategoryScroller({ initialCategories }: MobileCategoryScrollerProps) {
  const seeded = Array.isArray(initialCategories) && initialCategories.length > 0;
  const [cats, setCats] = useState<PublicCategory[] | null>(seeded ? initialCategories : null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [pause, setPause] = useState(false);
  const perView = 4; // show 4 items per view on mobile

  useEffect(() => {
    if (seeded) {
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/categories', { cache: 'force-cache', next: { revalidate: 300 } as any });
        if (!res.ok) throw new Error('failed');
        const j = await res.json();
        if (mounted) setCats(Array.isArray(j?.data) && j.data.length ? j.data : []);
      } catch {
        if (mounted) setCats([]);
      }
    })();
    return () => { mounted = false; };
  }, [seeded]);

  // Normalize to a unified shape
  const baseItems = useMemo(() => {
    if (cats && cats.length > 0) {
      return cats.map((c) => ({ key: c.id, name: c.name, image: c.image, link: c.link }));
    }
    // fallback to static when API has nothing yet
    return fallbackCategories.map((c, i) => ({ key: c.slug+':'+i, name: c.name, image: c.image || '', link: `/categorias?cat=${c.slug}` }));
  }, [cats]);

  // Auto-scroll one card at a time with smooth behavior; wraps back to start
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (!baseItems.length) return;
    const step = () => {
      if (!wrapRef.current) return;
      const c = wrapRef.current;
      const cardWidth = c.clientWidth / perView;
      const nextLeft = c.scrollLeft + cardWidth;
      const maxLeft = c.scrollWidth - c.clientWidth - 1;
      if (nextLeft > maxLeft) {
        // wrap to start
        c.scrollTo({ left: 0, behavior: 'auto' });
      } else {
        c.scrollTo({ left: nextLeft, behavior: 'smooth' });
      }
    };
    const id = setInterval(() => { if (!pause) step(); }, 3800);
    return () => clearInterval(id);
  }, [baseItems.length, pause]);

  // Pause autoplay briefly on user interaction
  useEffect(() => {
    const c = wrapRef.current;
    if (!c) return;
    let t: any;
    const onInteract = () => {
      setPause(true);
      clearTimeout(t);
      t = setTimeout(() => setPause(false), 3000);
    };
    c.addEventListener('touchstart', onInteract, { passive: true });
    c.addEventListener('wheel', onInteract, { passive: true } as any);
    c.addEventListener('scroll', onInteract, { passive: true });
    return () => {
      c.removeEventListener('touchstart', onInteract as any);
      c.removeEventListener('wheel', onInteract as any);
      c.removeEventListener('scroll', onInteract as any);
      clearTimeout(t);
    };
  }, [wrapRef.current]);

  return (
    <div className="block md:hidden w-full bg-white">
      <div className="container-max">
        <div className="relative py-1">
          <div className="overflow-x-auto no-scrollbar" ref={wrapRef}>
            <div className="flex gap-0 snap-x snap-mandatory">
              {baseItems.map((c, i) => (
                <Link
                  key={`${c.key}-${i}`}
                  href={c.link as any}
                  className="group shrink-0 flex flex-col items-center gap-2 snap-start"
                  style={{ flex: `0 0 ${100 / perView}%` }}
                >
                  <div className={`relative h-16 w-16 rounded-2xl overflow-hidden shadow-lg shadow-black/10 transition-transform group-hover:-translate-y-0.5`}>
                    {c.image ? (
                      <Image src={c.image} alt={c.name} fill sizes="64px" className="object-cover" />
                    ) : (
                      <div className="grid place-items-center h-full w-full bg-white">
                        <span className="text-xs text-[#ff5c00] font-semibold">{c.name[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-800 font-medium text-center leading-3 line-clamp-1">{c.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar{ display: none; }
        .no-scrollbar{ -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

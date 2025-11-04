"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SafeImage from "./SafeImage";
import { useCategories } from "@/lib/useCategories";

function useItemsPerView(length: number) {
  const [w, setW] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const isMobile = w < 640;
  if (isMobile) return { perView: 2, isMobile: true };
  if (w < 1024) return { perView: 4, isMobile: false };
  return { perView: Math.min(8, Math.max(1, length)), isMobile: false };
}

export default function CategoryCarousel() {
  const { items } = useCategories();
  const filtered = items.filter((c) => {
    const n = (c.name || '').trim().toLowerCase();
    const link = (c.link || '').toLowerCase();
    const byName = n === 'diversos' || n === 'sem categoria';
    const byLink = link.includes('/diversos') || link.includes('/sem-categoria');
    const byId = c.key === 'aaaaaaaa-0000-0000-0000-000000000001' || c.key === 'bbbbbbbb-0000-0000-0000-000000000001';
    return !(byName || byLink || byId);
  });
  const { perView, isMobile } = useItemsPerView(filtered.length);
  const [index, setIndex] = useState(0); // índice do primeiro item no trilho
  const [animating, setAnimating] = useState(true);
  const hasEnough = filtered.length > perView;
  const maxIndex = Math.max(0, filtered.length - perView);
  const pageCount = Math.max(1, Math.ceil(filtered.length / perView));
  const showControls = filtered.length > 0;

  // Trilho com itens duplicados para loop suave
  const trackItems = useMemo(() => filtered, [filtered]);

  // Avança 1 item por vez com slide
  useEffect(() => {
    if (!hasEnough) return;
    const id = setInterval(() => {
      setIndex((i) => {
        const next = i + 1;
        return next > maxIndex ? 0 : next;
      });
      setAnimating(true);
    }, 4500);
    return () => clearInterval(id);
  }, [hasEnough, maxIndex]);

  useEffect(() => {
    setIndex(0);
  }, [perView, filtered.length]);

  const prev = () => setIndex((i) => {
    const next = Math.max(0, i - perView);
    setAnimating(true);
    return next;
  });
  const next = () => setIndex((i) => {
    const nextIndex = Math.min(maxIndex, i + perView);
    setAnimating(true);
    return nextIndex;
  });
  const goToPage = (page: number) => {
    const clamped = Math.max(0, Math.min(pageCount - 1, page));
    setIndex(clamped * perView);
    setAnimating(true);
  };

  return (
    <section id="buy-by-category" className="w-full">
      <div className="container-max">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">Compre por categoria</h2>
          <Link href="/categorias" className="text-[var(--color-primary)] text-sm font-medium hover:underline">Explorar mais</Link>
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <div className="container-max">
          {/* Slider: múltiplos por view, avançando 1 por vez com slide */}
          <div className="relative py-2">
            <div className="overflow-hidden">
              <div
                className="flex"
                style={{
                  transform: `translateX(-${(index * 100) / perView}%)`,
                  transition: animating ? "transform 600ms ease" : "none",
                }}
                onTransitionEnd={() => { /* no-op */ }}
              >
                {trackItems.map((c, i) => (
                  <Link
                    key={`${c.key}-${i}`}
                    href={c.link as any}
                    className="group flex shrink-0 flex-col items-center gap-2 py-2"
                    style={{
                      flex: `0 0 ${100 / perView}%`,
                    }}
                  >
                    <div className={`relative h-24 w-24 sm:h-28 sm:w-28 md:h-28 md:w-28 rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-sm transition-transform group-hover:-translate-y-0.5`}>
                      <SafeImage src={c.image} alt={c.name} fill className="object-cover" />
                    </div>
                    <div className="text-sm text-gray-800 font-medium text-center">{c.name}</div>
                  </Link>
                ))}
            </div>
          </div>
            {showControls && (
              <div className="mt-4 flex items-center justify-center gap-3 sm:hidden">
                <button
                  type="button"
                  onClick={prev}
                  className="h-9 w-9 rounded-full border border-[#5c4ad8]/30 text-[#5c4ad8] transition hover:bg-[#5c4ad8]/10 disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={!hasEnough || index === 0}
                  aria-label="Categorias anteriores"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: pageCount }).map((_, page) => {
                    const isActive = Math.floor(index / perView) === page;
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page)}
                        className={`h-2.5 rounded-full transition ${isActive ? "w-6 bg-[#5c4ad8]" : "w-2.5 bg-gray-300 hover:bg-gray-400"}`}
                        aria-label={`Ir para página ${page + 1}`}
                      />
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={next}
                  className="h-9 w-9 rounded-full border border-[#5c4ad8]/30 text-[#5c4ad8] transition hover:bg-[#5c4ad8]/10 disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={!hasEnough || index >= maxIndex}
                  aria-label="Próximas categorias"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            )}
        </div>
        </div>
      </div>
    </section>
  );
}

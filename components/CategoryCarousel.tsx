"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SafeImage from "./SafeImage";
import { useCategories, type UICategory } from "@/lib/useCategories";

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

type CategoryCarouselProps = {
  initialItems?: UICategory[];
};

export default function CategoryCarousel({ initialItems }: CategoryCarouselProps) {
  const { items } = useCategories(initialItems);
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
    <section 
      id="buy-by-category" 
      className="w-full bg-white z-30 md:-mt-3 lg:-mt-4 xl:-mt-4 md:pt-2 lg:pt-3"
    >
      <div className="w-full overflow-hidden">
        <div className="container-max">
          {/* Slider: múltiplos por view, avançando 1 por vez com slide */}
          <div className="relative py-2">
            {/* Seta Esquerda - Desktop */}
            {hasEnough && (
              <button
                type="button"
                onClick={prev}
                disabled={index === 0}
                aria-label="Categorias anteriores"
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 items-center justify-center rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed h-9 w-9"
              >
                <svg viewBox="0 0 24 24" className="text-gray-600 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}

            {/* Seta Direita - Desktop */}
            {hasEnough && (
              <button
                type="button"
                onClick={next}
                disabled={index >= maxIndex}
                aria-label="Próximas categorias"
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 items-center justify-center rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed h-9 w-9"
              >
                <svg viewBox="0 0 24 24" className="text-gray-600 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            )}

            <div className={`overflow-hidden ${hasEnough ? 'md:mx-10' : ''}`}>
              <div
                className="flex"
                style={{
                  transform: `translateX(-${(index * 100) / perView}%)`,
                  transition: animating ? "transform 600ms ease" : "none",
                  willChange: "transform",
                  backfaceVisibility: "hidden"
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
                    <div 
                      className="relative overflow-hidden shadow-sm group-hover:-translate-y-0.5 transition-transform h-14 w-14 sm:h-16 sm:w-16 md:h-16 md:w-16 rounded-[14px] sm:rounded-[16px]"
                    >
                      <SafeImage src={c.image} alt={c.name} fill className="object-cover" />
                    </div>
                    <div className="text-gray-800 font-medium text-center text-sm">
                      {c.name}
                    </div>
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

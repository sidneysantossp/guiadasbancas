"use client";
import { useEffect, useMemo, useState } from "react";

// REMOVIDO: Todos os banners mock foram removidos
// Agora só exibe banners reais cadastrados via API

export default function MiniBanners() {
  const [w, setW] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const perView = w < 640 ? 1 : w < 1024 ? 2 : 3; // 3 por visualização em desktop
  const ITEM_W = 370;
  const ITEM_H = 175;
  const GAP = 16; // gap-4

  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [remote, setRemote] = useState<string[] | null>(null);

  // Load from API with fallback
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/mini-banners', { cache: 'no-store' });
        const j = await res.json();
        const list: string[] = Array.isArray(j?.data)
          ? (j.data as Array<{ image_url: string }>).map((it) => it.image_url).filter(Boolean)
          : [];
        if (list.length) setRemote(list);
      } catch {
        // silent fallback
      }
    })();
  }, []);

  // Se não tiver banners da API, retorna lista vazia (não renderiza nada)
  const items = useMemo(() => {
    if (!remote || !remote.length) return [];
    return remote; // Usar apenas os banners cadastrados, sem duplicar
  }, [remote]);
  const track = useMemo(() => [...items, ...items], [items]);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setIndex((i) => i + 1);
      setAnimating(true);
    }, 4000);
    return () => clearInterval(id);
  }, [isPaused]);

  const maxIndex = Math.max(0, items.length - perView);
  
  const prev = () => {
    const currentIndex = index % items.length;
    const newIndex = currentIndex === 0 ? maxIndex : currentIndex - 1;
    setIndex(newIndex);
    setAnimating(true);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };
  
  const next = () => {
    setIndex((i) => i + 1);
    setAnimating(true);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  // Não renderizar nada se não houver banners reais da API
  if (!items.length) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="container-max">
        <div className="relative md:px-6">
          <div className="overflow-hidden">
            <div
              className="flex gap-4"
              style={{
                transform: `translateX(-${index * (ITEM_W + GAP)}px)`,
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
              {track.map((src, i) => (
                <div
                  key={`${i}-${src}`}
                  className="shrink-0"
                  style={{ flex: `0 0 ${ITEM_W}px`, width: `${ITEM_W}px`, height: `${ITEM_H}px` }}
                >
                  <img
                    src={src}
                    alt={`Mini banner ${i + 1}`}
                    className="w-full h-full rounded-xl shadow-sm object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            
            {/* Desktop arrows */}
            {items.length > perView && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Anterior"
                  className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Próximo"
                  className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

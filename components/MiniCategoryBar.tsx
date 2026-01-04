"use client";

import Link from "next/link";
import SafeImage from "./SafeImage";
import { useRef, useState, useEffect } from "react";
import { useCategories, type UICategory } from "@/lib/useCategories";

// Pequena barra de categorias que fica sticky no topo ao rolar a página

type Props = { targetId?: string; initialItems?: UICategory[] };
export default function MiniCategoryBar({ targetId = "buy-by-category", initialItems }: Props) {
  const [visible, setVisible] = useState(false);
  const { items } = useCategories(initialItems);
  const filtered = items.filter((c) => {
    const n = (c.name || '').trim().toLowerCase();
    return n !== 'diversos' && n !== 'sem categoria';
  });
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById(targetId);
      if (!el) return setVisible(false);
      const rect = el.getBoundingClientRect();
      // exibe somente depois que a parte superior da seção passou 60px acima do topo
      setVisible(rect.top < -60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Autoscroll suave no desktop quando houver overflow
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const first = scroller.querySelector<HTMLElement>('a');
    const chipW = first ? first.getBoundingClientRect().width : 72;
    const gap = 14; // md:gap-3.5 ~ 14px
    const visibleCount = Math.max(1, Math.floor(scroller.clientWidth / (chipW + gap)));
    if (filtered.length <= visibleCount) return; // sem overflow, não auto-rola

    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const animateTo = (targetLeft: number, duration = 600) => {
      const el = scrollerRef.current;
      if (!el) return;
      const start = el.scrollLeft;
      const change = targetLeft - start;
      const startTime = performance.now();
      const step = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = easeInOutCubic(t);
        if (!scrollerRef.current) return;
        scrollerRef.current.scrollLeft = start + change * eased;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const stepFn = () => {
      const el = scrollerRef.current;
      if (!el) return;
      const delta = chipW + gap;
      const track = trackRef.current;
      const halfWidth = track ? Math.floor(track.scrollWidth / 2) : Math.floor(el.scrollWidth / 2);
      const next = el.scrollLeft + delta;
      // Caso ultrapasse a metade (fim do primeiro bloco), anima até lá e aplica reset sem salto
      if (next >= halfWidth) {
        animateTo(next, 600);
        setTimeout(() => {
          const el2 = scrollerRef.current;
          if (!el2) return;
          el2.scrollLeft = el2.scrollLeft - halfWidth;
        }, 620);
      } else {
        animateTo(next, 600);
      }
    };

    const id = setInterval(() => { if (!pause) stepFn(); }, 3200);
    return () => clearInterval(id);
  }, [filtered, pause]);

  // Pausar ao interagir (hover/wheel/touch)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let t: any;
    const onInteract = () => {
      setPause(true);
      clearTimeout(t);
      t = setTimeout(() => setPause(false), 3000);
    };
    el.addEventListener('mouseenter', onInteract);
    el.addEventListener('wheel', onInteract as any, { passive: true } as any);
    el.addEventListener('touchstart', onInteract as any, { passive: true } as any);
    return () => {
      el.removeEventListener('mouseenter', onInteract as any);
      el.removeEventListener('wheel', onInteract as any);
      el.removeEventListener('touchstart', onInteract as any);
      clearTimeout(t);
    };
  }, []);

  return (
    <div
      className={`hidden md:block md:fixed md:top-0 md:left-0 md:right-0 z-30 border-b border-gray-200 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm transition-transform duration-300 ${
        visible ? "md:translate-y-0" : "md:-translate-y-full md:pointer-events-none"
      }`}
    >
      <div className="container-max">
        <div className="mx-auto max-w-[680px] xl:max-w-[760px] 2xl:max-w-[820px]">
          <div ref={scrollerRef} className="py-2 overflow-x-auto no-scrollbar">
            <div ref={trackRef} className="flex items-center gap-3.5">
            {[...filtered, ...filtered].map((c, idx) => (
              <Link
                key={`${c.key}-${idx}`}
                href={c.link as any}
                className="shrink-0 flex flex-col items-center gap-1 px-1"
              >
                <div className="h-12 w-12 xl:h-14 xl:w-14 rounded-2xl grid place-items-center shadow-sm bg-white ring-1 ring-black/10 overflow-hidden">
                  <SafeImage src={c.image} alt={c.name} width={84} height={84} className="h-full w-full object-cover" />
                </div>
                <span className="text-[11px] leading-3 text-gray-800 font-medium text-center">{c.name}</span>
              </Link>
            ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar{ display:none; }
        .no-scrollbar{ -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>
    </div>
  );
}

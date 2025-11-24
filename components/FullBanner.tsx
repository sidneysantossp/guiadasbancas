"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import Image from "next/image";

type HeroSlide = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  gradientFrom: string;
  gradientTo: string;
  cta1Text: string;
  cta1Link: string;
  cta1Style: "primary" | "outline";
  cta2Text: string;
  cta2Link: string;
  cta2Style: "primary" | "outline";
  active: boolean;
  order: number;
};

type SliderConfig = {
  autoPlayTime: number;
  transitionSpeed: number;
  showArrows: boolean;
  showDots: boolean;
  heightDesktop: number;
  heightMobile: number;
};

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    title: "Sua banca favorita\nagora delivery",
    description: "Jornais, revistas, papelaria, snacks e muito mais direto da sua banca de confiança.",
    imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=1600&auto=format&fit=crop",
    imageAlt: "Banca de jornal com revistas e jornais ao fundo",
    gradientFrom: "#ff7a33",
    gradientTo: "#e64a00",
    cta1Text: "Peça agora",
    cta1Link: "/bancas-perto-de-mim",
    cta1Style: "primary",
    cta2Text: "Sou jornaleiro",
    cta2Link: "/jornaleiro",
    cta2Style: "outline",
    active: true,
    order: 1
  },
  {
    id: "slide-2",
    title: "Revistas, jornais\ne colecionáveis",
    description: "Encontre os lançamentos e clássicos nas bancas mais próximas de você.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop",
    imageAlt: "Pilha de revistas coloridas",
    gradientFrom: "#ffa366",
    gradientTo: "#ff5c00",
    cta1Text: "Ver departamentos",
    cta1Link: "/departamentos",
    cta1Style: "primary",
    cta2Text: "Bancas próximas",
    cta2Link: "/bancas-perto-de-mim",
    cta2Style: "outline",
    active: true,
    order: 2
  },
  {
    id: "slide-3",
    title: "Tudo de conveniência\nem poucos cliques",
    description: "Bebidas, snacks, pilhas, papelaria e recargas com entrega rápida.",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1600&auto=format&fit=crop",
    imageAlt: "Loja de conveniência com prateleiras e bebidas",
    gradientFrom: "#ffd6c2",
    gradientTo: "#ff5c00",
    cta1Text: "Explorar agora",
    cta1Link: "/bancas-perto-de-mim",
    cta1Style: "primary",
    cta2Text: "Como funciona",
    cta2Link: "/minha-conta",
    cta2Style: "outline",
    active: true,
    order: 3
  }
];

const DEFAULT_CONFIG: SliderConfig = {
  autoPlayTime: 6000,
  transitionSpeed: 600,
  showArrows: true,
  showDots: true,
  heightDesktop: 520,
  heightMobile: 560
};

const FALLBACK_ROUTE = "/";

const ensureInternalLink = (value: unknown): string => {
  if (typeof value !== "string") {
    return FALLBACK_ROUTE;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return FALLBACK_ROUTE;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return FALLBACK_ROUTE;
  }

  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed.replace(/^\/+/u, "")}`;

  return normalized;
};

const parsePositiveNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value === "string") {
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric > 0) {
      return numeric;
    }
  }

  return undefined;
};

const normalizeSliderConfig = (raw: unknown): Partial<SliderConfig> => {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  const candidate = raw as Partial<Record<keyof SliderConfig, unknown>>;
  const normalized: Partial<SliderConfig> = {};

  const autoPlayTime = parsePositiveNumber(candidate.autoPlayTime);
  if (autoPlayTime !== undefined) {
    normalized.autoPlayTime = autoPlayTime;
  }

  const transitionSpeed = parsePositiveNumber(candidate.transitionSpeed);
  if (transitionSpeed !== undefined) {
    normalized.transitionSpeed = transitionSpeed;
  }

  if (typeof candidate.showArrows === "boolean") {
    normalized.showArrows = candidate.showArrows;
  }

  if (typeof candidate.showDots === "boolean") {
    normalized.showDots = candidate.showDots;
  }

  const heightDesktop = parsePositiveNumber(candidate.heightDesktop);
  if (heightDesktop !== undefined) {
    normalized.heightDesktop = heightDesktop;
  }

  const heightMobile = parsePositiveNumber(candidate.heightMobile);
  if (heightMobile !== undefined) {
    normalized.heightMobile = heightMobile;
  }

  return normalized;
};

export default function FullBanner({ bancaId }: { bancaId?: string }) {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [config, setConfig] = useState<SliderConfig>(DEFAULT_CONFIG);
  const [index, setIndex] = useState(0);
  const [coupon, setCoupon] = useState<{ title: string; code: string; discountText: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    // Carregar slides da API (com cache habilitado)
    const loadSlides = async () => {
      try {
        const response = await fetch('/api/admin/hero-slides', { 
          next: { revalidate: 60 } as any // Cache de 60 segundos
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            const adminSlides = Array.isArray(result.data) ? result.data : [];
            const onlyActive = adminSlides.filter((s: any) => s?.active);
            const ordered = onlyActive
              .sort((a: any, b: any) => (a?.order ?? 999) - (b?.order ?? 999))
              // Não exibir slides com imagens de Unsplash (mock)
              .filter((s: any) => typeof s.imageUrl === 'string' && !s.imageUrl.includes('images.unsplash.com'));
            setSlides(ordered.length > 0 ? ordered : []);
            if (result.config) {
              setConfig(result.config);
            } else {
              // fallback: buscar config explicitamente
              try {
                const cfgRes = await fetch('/api/admin/hero-slides?type=config', {
                  next: { revalidate: 60 } as any
                });
                if (cfgRes.ok) {
                  const cfgJ = await cfgRes.json();
                  if (cfgJ?.success && cfgJ?.data) setConfig(cfgJ.data);
                }
              } catch {}
            }
          } else {
            setSlides([]);
          }
        } else {
          setSlides([]);
        }
      } catch {
        setSlides([]);
      }
    };

    loadSlides();
    
    // Carregar cupom em destaque apenas se tiver bancaId específico
    const loadCoupon = async () => {
      if (!bancaId) {
        // Se não tiver bancaId, não carrega cupom (não mostra na home geral)
        return;
      }
      
      try {
        const res = await fetch(`/api/coupons/highlight?sellerId=${bancaId}`, {
          next: { revalidate: 60 } as any
        });
        if (!res.ok) return;
        const j = await res.json();
        if (j?.ok && j?.data) {
          setCoupon({ title: j.data.title, code: j.data.code, discountText: j.data.discountText });
        }
      } catch {}
    };
    loadCoupon();
  }, [bancaId]);

  useEffect(() => {
    if (slides.length === 0) return;
    
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, config.autoPlayTime);
    
    return () => clearInterval(id);
  }, [slides.length, config.autoPlayTime]);

  const go = (dir: -1 | 1) => {
    setIndex((prev) => (prev + dir + slides.length) % slides.length);
  };

  // Touch swipe handlers (mobile) — hooks must be declared before any conditional return
  const touchRef = useRef<{ startX: number; startY: number; active: boolean; lockedAxis?: 'x'|'y' } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { startX: t.clientX, startY: t.clientY, active: true };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const state = touchRef.current;
    if (!state || !state.active) return;
    const t = e.touches[0];
    const dx = t.clientX - state.startX;
    const dy = t.clientY - state.startY;
    if (!state.lockedAxis) {
      state.lockedAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
    // If horizontal gesture, prevent vertical scroll to allow smooth swipe
    if (state.lockedAxis === 'x') {
      e.preventDefault();
    }
  };

  if (slides.length === 0) {
    return null; // Não renderizar se não houver slides
  }

  const slide = slides[index];
  // Garantir que não usamos altura mobile muito baixa vinda do CMS (ex.: 360px)
  const mobileHeight = Math.max(config.heightMobile ?? 0, 380);
  const onTouchEnd = (e: React.TouchEvent) => {
    const state = touchRef.current;
    touchRef.current = null;
    if (!state) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - state.startX;
    const dy = touch.clientY - state.startY;
    // Trigger only for horizontal, with a threshold
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) {
        go(1); // swipe left -> next
      } else {
        go(-1); // swipe right -> prev
      }
    }
  };

  const showCta1 = Boolean(slide?.cta1Text?.trim() && slide?.cta1Link?.trim());
  const showCta2 = Boolean(slide?.cta2Text?.trim() && slide?.cta2Link?.trim());

  // Renderizar o banner mesmo antes da imagem carregar, mas com transição suave
  // A verificação anterior causava o problema: se heroLoaded=false, retornava null
  // e a imagem nunca carregava porque o componente não renderizava!

  return (
    <section 
      className={`relative w-full z-0 mb-3 pt-1 pb-1 sm:mb-6 sm:pt-0 sm:pb-4 px-0 sm:px-0 mt-[50px] sm:mt-0 transition-opacity duration-500 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      <div 
        className="relative w-full overflow-hidden fb-h"
        style={{ height: `${mobileHeight}px` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <style jsx>{`
          @media (min-width: 768px) {
            .fb-h {
              height: ${config.heightDesktop}px !important;
            }
          }
        `}</style>
        {/* Slides wrapper */}
        <div
          className="h-full w-full"
          style={{
            transition: `background ${config.transitionSpeed}ms ease`,
          }}
        >
          {/* Background image */}
          <Image
            src={slide.imageUrl}
            alt={slide.imageAlt}
            fill
            priority
            onLoadingComplete={() => setHeroLoaded(true)}
            className="object-cover"
            sizes="100vw"
          />
          {/* Gradient overlay */}
          <div 
            className="absolute inset-0 mix-blend-multiply opacity-70 pointer-events-none"
            style={{
              background: `linear-gradient(to right, ${slide.gradientFrom}, ${slide.gradientTo})`
            }}
          />
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />

          {/* Content */}
          <div className="relative z-20 h-full w-full px-0 pt-8 pb-10 sm:pt-16 sm:pb-16">
            <div className="flex h-full w-full items-center">
              <div className="w-full text-white">
                <div className="container-max px-4 sm:px-6 md:px-10">
                  <div className="max-w-2xl">
                  <h1 className="whitespace-pre-line text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight drop-shadow-lg mb-5">
                    {slide.title.replace(/\n/g, '\n')}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-white/95 drop-shadow-md leading-relaxed mb-7 sm:mb-9">
                    {slide.description}
                  </p>
                  {(showCta1 || showCta2) && (
                    <div className="mt-5 flex flex-row items-start gap-3 sm:gap-4">
                      {showCta1 && (
                        <Link
                          href={slide.cta1Link as Route}
                          className={
                            slide.cta1Style === "primary"
                              ? "self-start relative z-50 inline-flex items-center justify-center rounded-md sm:rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-[#ff5c00] shadow-xl hover:bg-white/95 hover:scale-105 transition-all duration-200 min-w-[130px] sm:px-7 sm:py-4 sm:text-lg sm:min-w-[200px]"
                              : "self-start relative z-50 inline-flex items-center justify-center rounded-md sm:rounded-2xl border-2 border-white/90 bg-transparent px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:border-white transition-all duration-200 min-w-[130px] sm:px-7 sm:py-4 sm:text-lg sm:min-w-[200px]"
                          }
                        >
                          {slide.cta1Text}
                        </Link>
                      )}
                      {showCta2 && (
                        <Link
                          href={slide.cta2Link as Route}
                          className={
                            slide.cta2Style === "primary"
                              ? "self-start relative z-50 inline-flex items-center justify-center rounded-md sm:rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-[#ff5c00] shadow-xl hover:bg-white/95 hover:scale-105 transition-all duration-200 min-w-[130px] sm:px-7 sm:py-4 sm:text-lg sm:min-w-[200px]"
                              : "self-start relative z-50 inline-flex items-center justify-center rounded-md sm:rounded-2xl border-2 border-white/90 bg-transparent px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:border-white transition-all duration-200 min-w-[130px] sm:px-7 sm:py-4 sm:text-lg sm:min-w-[200px]"
                          }
                        >
                          {slide.cta2Text}
                        </Link>
                      )}
                    </div>
                  )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          {config.showArrows && (
            <>
              <button
                onClick={() => go(-1)}
                aria-label="Anterior"
                className="absolute z-40 left-4 top-1/2 -translate-y-1/2 hidden md:grid place-items-center h-12 w-12 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 hover:scale-110 transition-all duration-200 shadow-lg"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Próximo"
                className="absolute z-40 right-4 top-1/2 -translate-y-1/2 hidden md:grid place-items-center h-12 w-12 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 hover:scale-110 transition-all duration-200 shadow-lg"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 6l6 6-6 6"/>
                </svg>
              </button>
            </>
          )}

          {/* Dots */}
          {config.showDots && slides.length > 1 && (
            <div className="absolute z-40 bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setIndex(i)}
                  aria-label={`Ir para slide ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2.5 bg-white/60"}`}
                />
              ))}
            </div>
          )}

          {/* Coupon Card - bottom-right overlay (dinâmico) */}
          {coupon && (
            <div className="absolute right-3 bottom-3 md:right-6 md:bottom-6 z-30">
              <button
                type="button"
                onClick={async ()=>{ try { await navigator.clipboard.writeText(coupon.code); setCopied(true); setTimeout(()=>setCopied(false), 1200); } catch {} }}
                className="group relative overflow-hidden rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md text-white shadow-xl focus:outline-none focus:ring-2 focus:ring-white/40"
                title="Clique para copiar o código"
              >
                <div className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-white/10" />
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#ff7a33] text-white shadow ring-1 ring-black/10">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M3 7h18v4H3zM6 11v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-7" />
                    </svg>
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="text-[11px] uppercase tracking-wide text-white/90">{coupon.title}</div>
                    <div className="text-lg md:text-xl font-extrabold tracking-wider">{coupon.code}</div>
                  </div>
                </div>
                <div className="px-4 pb-3 text-[11px] text-white/90">
                  Use no checkout e ganhe <span className="font-semibold">{coupon.discountText}</span>
                  {copied && <span className="ml-2 rounded bg-white/20 px-2 py-[2px] text-[10px]">Copiado!</span>}
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

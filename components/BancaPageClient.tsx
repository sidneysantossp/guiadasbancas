"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import TrustBadges from "@/components/TrustBadges";
import { buildBancaHref } from "@/lib/slug";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { haversineKm, loadStoredLocation, UserLocation } from "@/lib/location";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { shippingConfig } from "@/components/shippingConfig";
import FreeShippingProgress from "@/components/FreeShippingProgress";
import { ui } from "@/lib/ui";
import homeCategories from "@/data/categories.json";

export type BancaDetail = {
  id: string;
  name: string;
  cover: string;
  avatar: string;
  open: boolean;
  rating?: number;
  reviews?: number;
  lat: number;
  lng: number;
  description?: string;
  phone?: string;
  address?: string;
  hours?: string;
  hoursArray?: Array<{ key: string; label: string; open: boolean; start: string; end: string }>;
  socials?: { facebook?: string; instagram?: string; gmb?: string };
  categories?: string[];
  payments?: string[];
  gallery?: string[];
  featured?: boolean;
  ctaUrl?: string;
};

export type ProdutoResumo = {
  id: string;
  name: string;
  image: string;
  price: number;
  priceOriginal?: number;
  rating?: number;
  reviews?: number;
  ready?: boolean;
  category?: string;
  discountPercent?: number; // para ofertas
  stockQty?: number;
  couponCode?: string;
  sob_encomenda?: boolean;
  pre_venda?: boolean;
  pronta_entrega?: boolean;
};

const FALLBACK_BANCA: BancaDetail = {
  id: "banca-fallback",
  name: "Banca",
  cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=60",
  avatar: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=200&auto=format&fit=crop",
  open: true,
  rating: 4.7,
  reviews: 0,
  lat: -23.5617,
  lng: -46.6560,
  description: "Estamos atualizando as informações desta banca.",
  phone: undefined,
  address: "",
  hours: "Seg a Sáb, 08h - 20h",
};

function Stars({ value = 5 }: { value?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-[2px] text-[#f59e0b]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden>
          {i < full ? (
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.402 8.164L12 18.896 4.664 23.16l1.402-8.164L.132 9.21l8.2-1.192L12 .587z" />
          ) : i === full && half ? (
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.402 8.164L12 18.896V.587z" />
          ) : (
            <path d="M22 9.21l-8.2-1.192L12 .587 10.2 8.018 2 9.21l5.934 5.786L6.532 23.16 12 18.896l5.468 4.264-1.402-8.164L22 9.21z" fillOpacity="0.25" />
          )}
        </svg>
      ))}
    </span>
  );
}

// Helpers to map Admin CMS data into UI labels
function formatAddress(addr?: { cep?: string; street?: string; number?: string; neighborhood?: string; city?: string; uf?: string; complement?: string }) {
  if (!addr) return '';
  const line1 = [addr.street, addr.number].filter(Boolean).join(', ');
  const line2 = [addr.neighborhood, addr.city, addr.uf].filter(Boolean).join(' - ');
  const cep = addr.cep ? `CEP ${addr.cep}` : '';
  return [line1, line2, cep].filter(Boolean).join(' | ');
}

function summarizeHours(hours?: Array<{ key: string; label: string; open: boolean; start: string; end: string }>): { open: boolean; label?: string } {
  if (!Array.isArray(hours) || hours.length === 0) return { open: true, label: undefined };
  const map: Record<string, { open: boolean; start: string; end: string; label: string }> = {};
  for (const h of hours) map[h.key] = { open: h.open, start: h.start, end: h.end, label: h.label };
  const now = new Date();
  const dayIdx = now.getDay(); // 0=Sun .. 6=Sat
  const key = ['sun','mon','tue','wed','thu','fri','sat'][dayIdx];
  const info = map[key];
  if (!info) return { open: true, label: undefined };
  const [sh, sm] = (info.start || '00:00').split(':').map(Number);
  const [eh, em] = (info.end || '23:59').split(':').map(Number);
  const cur = now.getHours() * 60 + now.getMinutes();
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const isOpen = info.open && cur >= startMin && cur <= endMin;
  const label = info.open ? `${info.label}: ${info.start} - ${info.end}` : `${info.label}: Fechado`;
  return { open: isOpen, label };
}

function DistancePill({ km }: { km: number | null }) {
  if (km == null) return null;
  const r = Math.ceil(km);
  const label = r > 3 ? "+3 km" : `${Math.max(1, r)} km`;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#eef6ff] text-[#1e73ff] px-2 py-[3px] text-[11px] font-semibold">
      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5z"/></svg>
      {label}
    </span>
  );
}

function OpenBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#eaffe9] text-emerald-700 px-2 py-[2px] text-[10px] font-semibold shadow">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      Banca Aberta
    </span>
  );
}

function ClosedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 px-2 py-[2px] text-[10px] font-semibold shadow">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      Banca Fechada
    </span>
  );
}

function ProductCard({ p, phone }: { p: ProdutoResumo; phone?: string }) {
  const [liked, setLiked] = useState(false);
  const { addToCart, items } = useCart();
  const { show } = useToast();
  const subtotal = items.reduce((s, it) => s + (it.price ?? 0) * it.qty, 0);
  const qualifies = shippingConfig.freeShippingEnabled || subtotal >= shippingConfig.freeShippingThreshold;
  const outOfStock = Boolean(p.ready) && (p.stockQty != null) && (p.stockQty <= 0);
  
  
  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col">
      <div className="relative w-full group h-48 sm:h-56">
        {/* Wrapper com padding para a imagem, mantendo cantos arredondados internos */}
        <div className="absolute inset-0 p-2">
          <div className="relative h-full w-full rounded-[14px] overflow-hidden">
            <Image src={p.image} alt={p.name} fill className="object-contain bg-gray-50" />
            {/* Link absoluto cobrindo a imagem para ir à página do produto */}
            <Link
              href={("/produto/" + slugify(p.name) + "-" + p.id) as Route}
              aria-label={`Ver detalhes de ${p.name}`}
              className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c00]"
            />
            {/* Efeito hover sutil sobre a imagem */}
            <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/5 transition" />
            {/* Badge de desconto no canto superior esquerdo */}
            {(() => {
              const baseDiscount = typeof p.discountPercent === 'number' ? p.discountPercent : (p.priceOriginal && p.priceOriginal > p.price ? Math.round((1 - p.price / p.priceOriginal) * 100) : 0);
              const d = Math.max(0, Math.min(90, baseDiscount || 0));
              if (d <= 0) return null;
              return (
                <span className="absolute left-2 top-2 z-10 inline-flex items-center rounded-md bg-[#ff5c00] text-white px-2 py-[2px] text-[11px] font-semibold shadow">
                  -{d}%
                </span>
              );
            })()}
            {/* Esgotado badge */}
            {outOfStock && (
              <span className="absolute right-2 top-2 z-10 inline-flex items-center rounded-md bg-rose-600 text-white px-2 py-[2px] text-[11px] font-semibold shadow">
                Esgotado
              </span>
            )}
          </div>
        </div>
        {/* Ícone flutuante de carrinho sob a imagem */}
        <button
          onClick={() => { if (!outOfStock) { addToCart({ id: p.id, name: p.name, price: p.price, image: p.image }, 1); show(<span>Adicionado ao carrinho.</span>); } }}
          aria-label="Adicionar ao carrinho"
          disabled={outOfStock}
          className={`absolute -bottom-5 right-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border ${outOfStock ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed' : 'border-gray-200 bg-white shadow hover:bg-gray-50'}`}
        >
          <Image src="https://cdn-icons-png.flaticon.com/128/4982/4982841.png" alt="Carrinho" width={20} height={20} className={`h-5 w-5 object-contain ${outOfStock ? 'opacity-60' : ''}`} />
        </button>
      </div>
      <div className="p-2.5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1">
          {p.pronta_entrega && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-[2px] text-[10px] font-semibold">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
              Pronta Entrega
            </span>
          )}
          {p.sob_encomenda && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-2 py-[2px] text-[10px] font-semibold">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Sob Encomenda
            </span>
          )}
          {p.pre_venda && (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 text-purple-700 px-2 py-[2px] text-[10px] font-semibold">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Pré-Venda
            </span>
          )}
          {/* Fallback para produtos com track_stock ativo mas sem flags específicas */}
          {p.ready && !p.pronta_entrega && !p.sob_encomenda && !p.pre_venda && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-[2px] text-[10px] font-semibold">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
              Pronta Entrega
            </span>
          )}
        </div>
        <Link href={("/produto/" + slugify(p.name) + "-" + p.id) as Route} className="mt-2 text-[13px] font-semibold hover:underline">{p.name}</Link>
        <div className="mt-1 flex items-center gap-2">
          <Stars value={(p as any).rating ?? 5} />
          {typeof (p as any).reviews === 'number' && (
            <span className="text-[11px] text-gray-500">{(p as any).reviews} avaliações</span>
          )}
        </div>
        
        {/* Seção inferior com preços e botões sempre alinhados */}
        <div className="mt-auto pt-2 flex flex-col gap-1.5">
          {/* Preço com rótulos: 'De:' (antigo) e 'Por:' (atual) */}
          <div className="flex flex-col gap-0.5">
            {typeof p.discountPercent === 'number' && p.discountPercent > 0 ? (
              <>
                <div className="text-[12px] text-gray-600">
                  De: {(() => { const old = p.price / (1 - p.discountPercent / 100); return <span className="text-gray-400 line-through">R$ {old.toFixed(2)}</span>; })()}
                </div>
                <div className="text-[18px] text-[#ff5c00] font-extrabold">Por: R$ {p.price.toFixed(2)}</div>
              </>
            ) : (
              <div className="text-[18px] text-[#ff5c00] font-extrabold">Por: R$ {p.price.toFixed(2)}</div>
            )}
          </div>
          
          {p.couponCode && (
            <div>
              <span className="inline-flex items-center gap-1 rounded-md bg-[#fff3ec] text-[#ff5c00] px-2 py-[2px] text-[10px] font-semibold border border-[#ffd7bd]">
                Cupom: {p.couponCode}
              </span>
            </div>
          )}
          
          {/* Ações: botão carrinho laranja + botão Whats verde */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => { if (!outOfStock) { addToCart({ id: p.id, name: p.name, price: p.price, image: p.image }, 1); show(<span>Adicionado ao carrinho.</span>); } }}
              disabled={outOfStock}
              className={`w-full rounded px-2.5 py-1 text-[11px] font-semibold ${outOfStock ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#ff5c00] text-white hover:opacity-95'}`}
            >
              {outOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
            </button>
            {phone ? (
              <a
                href={`https://wa.me/${phone.replace(/\D/g, "")}\?text=${encodeURIComponent(`Olá! Gostaria de comprar ${p.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full inline-flex items-center justify-center gap-1.5 rounded border px-2.5 py-1 text-[11px] font-semibold ${outOfStock ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50 pointer-events-none' : 'border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/15'}`}
              >
                <Image src="https://cdn-icons-png.flaticon.com/128/733/733585.png" alt="WhatsApp" width={14} height={14} className="h-3.5 w-3.5 object-contain" />
                {outOfStock ? 'Indisponível' : 'Comprar'}
              </a>
            ) : (
              <button
                disabled
                className="w-full inline-flex items-center justify-center gap-1.5 rounded border border-gray-300 text-gray-400 px-2.5 py-1 text-[11px] font-semibold cursor-not-allowed"
              >
                <Image src="https://cdn-icons-png.flaticon.com/128/733/733585.png" alt="WhatsApp" width={14} height={14} className="h-3.5 w-3.5 object-contain opacity-50" />
                Comprar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const CATEGORY_LOOKUP = (() => {
  const map = new Map<string, string>();
  try {
    if (Array.isArray(homeCategories)) {
      for (const c of homeCategories as any[]) {
        if (c?.id && c?.name) {
          map.set(String(c.id), String(c.name));
        }
      }
    }
  } catch {}
  return map;
})();

const normalizeCategory = (raw: any): string => {
  const value = typeof raw === "string" ? raw.trim() : String(raw || "").trim();
  if (!value) return "";
  return CATEGORY_LOOKUP.get(value) ?? value;
};

export default function BancaPageClient({ bancaId }: { bancaId: string }) {
  const [loc, setLoc] = useState<UserLocation | null>(null);
  useEffect(() => setLoc(loadStoredLocation()), []);

  const [banca, setBanca] = useState<BancaDetail>(FALLBACK_BANCA);
  const [produtos, setProdutos] = useState<ProdutoResumo[]>([]);
  const [produtosDestaque, setProdutosDestaque] = useState<ProdutoResumo[]>([]);
  
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const [loadingDestaque, setLoadingDestaque] = useState(false);
  const [highlightCoupon, setHighlightCoupon] = useState<null | { title: string; code: string; discountText: string; expiresAt?: string }>(null);
  const { show } = useToast();
  const [hoursOpen, setHoursOpen] = useState(false);
  const hoursRef = useRef<HTMLDivElement | null>(null);
  const [infoTab, setInfoTab] = useState<'Sobre' | 'Horários' | 'Como comprar' | 'Como chegar'>('Sobre');
  useEffect(() => {
    if (!hoursOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (hoursRef.current && !hoursRef.current.contains(e.target as Node)) setHoursOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [hoursOpen]);

  // Definir aba padrão via hash (#como-chegar) ou query (?tab=como-chegar)
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const url = new URL(window.location.href);
      const q = (url.searchParams.get('tab') || window.location.hash.replace('#','') || '').toLowerCase();
      const map: Record<string, typeof infoTab> = {
        'sobre': 'Sobre',
        'horarios': 'Horários',
        'horários': 'Horários',
        'como-comprar': 'Como comprar',
        'como comprar': 'Como comprar',
        'como-chegar': 'Como chegar',
        'como chegar': 'Como chegar',
      };
      if (q && map[q]) setInfoTab(map[q]);
    } catch {}
  }, []);

  

  // Indicadores removidos a pedido (mantida apenas auto-rolagem)

  // Fetch banca real
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/admin/bancas?id=${encodeURIComponent(bancaId)}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch banca');
        const j = await res.json();
        const it = j?.data || null;
        if (!it) throw new Error('Banca not found');
        const cover = it.cover || it.images?.cover || FALLBACK_BANCA.cover;
        const avatar = it.avatar || it.images?.avatar || FALLBACK_BANCA.avatar;
        const lat = typeof it.lat === 'number' ? it.lat : (it.location?.lat ?? FALLBACK_BANCA.lat);
        const lng = typeof it.lng === 'number' ? it.lng : (it.location?.lng ?? FALLBACK_BANCA.lng);
        const address = it.address || formatAddress(it.addressObj);
        const phone = it.contact?.whatsapp;
        const { open, label } = summarizeHours(it.hours);
        const mapped: BancaDetail = {
          id: it.id,
          name: it.name || FALLBACK_BANCA.name,
          cover,
          avatar,
          open,
          rating: typeof it.rating === 'number' ? it.rating : FALLBACK_BANCA.rating,
          reviews: typeof it.reviews === 'number' ? it.reviews : FALLBACK_BANCA.reviews,
          lat,
          lng,
          description: it.description || FALLBACK_BANCA.description,
          phone,
          address,
          hours: label,
          hoursArray: Array.isArray(it.hours) ? it.hours : undefined,
          socials: it.socials,
          categories: Array.isArray(it.categories) ? it.categories.map((cat: any) => normalizeCategory(cat)).filter(Boolean) : undefined,
          payments: Array.isArray(it.payments) ? it.payments : undefined,
          gallery: Array.isArray(it.gallery) ? it.gallery : undefined,
          featured: Boolean(it.featured),
          ctaUrl: typeof it.ctaUrl === 'string' ? it.ctaUrl : undefined,
        };
        if (active) setBanca(mapped);
      } catch {
        if (active) setBanca(FALLBACK_BANCA);
      }
    })();
    return () => { active = false; };
  }, [banca?.id, bancaId]);

  // Fetch produtos da banca usando endpoint direto
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingProdutos(true);
        const idForProducts = banca?.id || bancaId;
        const res = await fetch(`/api/banca/${encodeURIComponent(idForProducts)}/products`, { cache: 'no-store' });
        const json = await res.json();
        
        if (!res.ok || !json.success) {
          if (active) setProdutos([]);
          return;
        }
        
        const items = Array.isArray(json.products) ? json.products : [];
        const mapped = items.map((item: any) => {
          const images = Array.isArray(item.images) ? item.images : [];
          const price = Number(item.price ?? 0);
          const priceOriginal = item.price_original != null ? Number(item.price_original) : undefined;
          const discountPercentRaw = item.discount_percent != null ? Number(item.discount_percent) : undefined;
          const discountCalculated = priceOriginal && priceOriginal > price ? Math.round((1 - price / priceOriginal) * 100) : 0;
          const discountPercent = discountPercentRaw != null ? discountPercentRaw : discountCalculated;
          const categoryRaw = item.category_name || item.category_id || item.category;
          const stockQty = item.stock_qty != null ? Number(item.stock_qty) : undefined;
          const couponCode = typeof item.coupon_code === 'string' ? item.coupon_code : undefined;
          return {
            id: item.id,
            name: item.name || 'Produto',
            image: images[0] || "https://via.placeholder.com/400x300?text=Produto",
            price,
            priceOriginal,
            rating: item.rating_avg,
            reviews: item.reviews_count,
            ready: Boolean(item.track_stock),
            stockQty,
            category: normalizeCategory(categoryRaw),
            discountPercent,
            couponCode,
            sob_encomenda: Boolean(item.sob_encomenda),
            pre_venda: Boolean(item.pre_venda),
            pronta_entrega: Boolean(item.pronta_entrega),
          } satisfies ProdutoResumo;
        });
        if (active) setProdutos(mapped);
      } catch {
        if (active) setProdutos([]);
      } finally {
        if (active) setLoadingProdutos(false);
      }
    })();
    return () => { active = false; };
  }, [banca?.id, bancaId]);

  // Fetch produtos em destaque da banca
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingDestaque(true);
        const idForProducts = banca?.id || bancaId;
        const res = await fetch(`/api/banca/${encodeURIComponent(idForProducts)}/featured`, { cache: 'no-store' });
        const json = await res.json();
        
        if (!res.ok || !json.success) {
          if (active) setProdutosDestaque([]);
          return;
        }
        
        const items = Array.isArray(json.products) ? json.products : [];
        const mapped = items.map((item: any) => {
          const images = Array.isArray(item.images) ? item.images : [];
          const price = Number(item.price ?? 0);
          const priceOriginal = item.price_original != null ? Number(item.price_original) : undefined;
          const discountPercentRaw = item.discount_percent != null ? Number(item.discount_percent) : undefined;
          const discountCalculated = priceOriginal && priceOriginal > price ? Math.round((1 - price / priceOriginal) * 100) : 0;
          const discountPercent = discountPercentRaw != null ? discountPercentRaw : discountCalculated;
          const categoryRaw = item.category_name || item.category_id || item.category;
          const stockQty = item.stock_qty != null ? Number(item.stock_qty) : undefined;
          const couponCode = typeof item.coupon_code === 'string' ? item.coupon_code : undefined;
          return {
            id: item.id,
            name: item.name || 'Produto',
            image: images[0] || "https://via.placeholder.com/400x300?text=Produto",
            price,
            priceOriginal,
            rating: item.rating_avg,
            reviews: item.reviews_count,
            ready: Boolean(item.track_stock),
            stockQty,
            category: normalizeCategory(categoryRaw),
            discountPercent,
            couponCode,
            sob_encomenda: Boolean(item.sob_encomenda),
            pre_venda: Boolean(item.pre_venda),
            pronta_entrega: Boolean(item.pronta_entrega),
          } satisfies ProdutoResumo;
        });
        if (active) setProdutosDestaque(mapped);
      } catch {
        if (active) setProdutosDestaque([]);
      } finally {
        if (active) setLoadingDestaque(false);
      }
    })();
    return () => { active = false; };
  }, [banca?.id, bancaId]);

  // Cupom em destaque da banca
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const sellerId = banca?.id || bancaId;
        if (!sellerId) return;
        const res = await fetch(`/api/coupons/highlight?sellerId=${encodeURIComponent(sellerId)}`, { cache: 'no-store' });
        const json = await res.json();
        const item = json?.data;
        if (active) {
          if (item) setHighlightCoupon({ title: item.title, code: item.code, discountText: item.discountText, expiresAt: item.expiresAt });
          else setHighlightCoupon(null);
        }
      } catch {
        if (active) setHighlightCoupon(null);
      }
    })();
    return () => { active = false; };
  }, [banca?.id, bancaId]);

  const km = useMemo(() => (loc && banca ? haversineKm({ lat: loc.lat, lng: loc.lng }, { lat: banca.lat, lng: banca.lng }) : null), [loc, banca]);
  const { items, addToCart } = useCart();
  const subtotal = items.reduce((s, it) => s + (it.price ?? 0) * it.qty, 0);
  const qualifies = shippingConfig.freeShippingEnabled || subtotal >= shippingConfig.freeShippingThreshold;

  // Share handler (Web Share API com fallback para copiar link)
  const handleShare = useCallback(async () => {
    try {
      if (typeof window === 'undefined') return;
      const shareData: ShareData = {
        title: banca?.name || 'Guia das Bancas',
        text: 'Confira esta banca no Guia das Bancas',
        url: window.location.href,
      };
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        show(<span>Link copiado!</span>);
      }
    } catch {}
  }, [banca?.name, show]);

  // Traçar rota com geolocalização do usuário (Google Maps ou Waze)
  const handleRoute = useCallback((provider: 'google' | 'waze' = 'google') => {
    try {
      const dest = (typeof banca?.lat === 'number' && typeof banca?.lng === 'number' && !Number.isNaN(banca.lat) && !Number.isNaN(banca.lng))
        ? `${banca!.lat},${banca!.lng}`
        : (banca?.address ? encodeURIComponent(banca.address) : encodeURIComponent(banca?.name || ''));
      const openDirections = (origin?: string) => {
        let href = '';
        if (provider === 'google') {
          href = origin
            ? `https://www.google.com/maps/dir/?api=1&destination=${dest}&origin=${origin}`
            : `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
        } else {
          // Waze: usa ll=lat,lng quando possível, senão q=address
          if (typeof banca?.lat === 'number' && typeof banca?.lng === 'number' && !Number.isNaN(banca.lat) && !Number.isNaN(banca.lng)) {
            href = `https://waze.com/ul?ll=${banca.lat},${banca.lng}&navigate=yes`;
          } else {
            href = `https://waze.com/ul?q=${dest}&navigate=yes`;
          }
        }
        window.open(href, '_blank');
      };
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const origin = `${pos.coords.latitude},${pos.coords.longitude}`;
            openDirections(origin);
          },
          () => openDirections(),
          { enableHighAccuracy: true, timeout: 8000 }
        );
      } else {
        openDirections();
      }
    } catch {}
  }, [banca?.lat, banca?.lng, banca?.address, banca?.name]);

  // Ofertas e Promoções: ordenação
  const [offerSort, setOfferSort] = useState<"discount" | "price" | "rating">("discount");
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const offers = useMemo(() => {
    const enriched = produtos.map((p) => {
      const discount = typeof p.discountPercent === 'number' ? p.discountPercent : (p.priceOriginal && p.priceOriginal > p.price ? Math.round((1 - p.price / p.priceOriginal) * 100) : 0);
      const safeDiscount = Math.max(0, Math.min(90, discount || 0));
      const oldPrice = p.priceOriginal && p.priceOriginal > 0 ? p.priceOriginal : safeDiscount > 0 ? p.price / (1 - safeDiscount / 100) : p.price;
      return { ...p, oldPrice, newPrice: p.price, discount: safeDiscount };
    }).filter((p) => (p.discount ?? 0) > 0);
    if (enriched.length > 0) return enriched;
    return produtos.slice(0, 8).map((p) => ({ ...p, oldPrice: p.priceOriginal ?? p.price, newPrice: p.price, discount: 0 }));
  }, [produtos]);
  const offersSorted = useMemo(() => {
    const arr = [...offers];
    if (offerSort === "price") arr.sort((a,b) => (a.newPrice as number) - (b.newPrice as number));
    else if (offerSort === "rating") arr.sort((a,b) => (b.rating ?? 0) - (a.rating ?? 0));
    else arr.sort((a,b) => (b.discount as number) - (a.discount as number));
    return arr;
  }, [offers, offerSort]);

  // Auto-rolagem do slider de ofertas no mobile (pausa em interação/aba oculta)
  const autoScrollRef = useRef<number | null>(null);
  useEffect(() => {
    try {
      if (!scrollerRef.current) return;
      if (typeof window === 'undefined') return;
      const isMobile = window.innerWidth < 640; // sm breakpoint
      if (!isMobile) return;
      const el = scrollerRef.current;
      const cardWidth = 260; // aprox largura do card + gap

      const start = () => {
        if (autoScrollRef.current) return;
        autoScrollRef.current = window.setInterval(() => {
          const maxScroll = el.scrollWidth - el.clientWidth;
          const next = el.scrollLeft + cardWidth;
          if (next >= maxScroll - 5) {
            el.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            el.scrollBy({ left: cardWidth, behavior: 'smooth' });
          }
        }, 4000);
      };
      const stop = () => {
        if (autoScrollRef.current) {
          window.clearInterval(autoScrollRef.current);
          autoScrollRef.current = null;
        }
      };

      // iniciar
      start();

      // Pausar/retomar em interações
      const onEnter = () => stop();
      const onLeave = () => start();
      const onVisibility = () => {
        if (document.hidden) stop(); else start();
      };
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
      el.addEventListener('touchstart', onEnter, { passive: true });
      el.addEventListener('touchend', onLeave, { passive: true });
      el.addEventListener('pointerdown', onEnter);
      el.addEventListener('pointerup', onLeave);
      document.addEventListener('visibilitychange', onVisibility);

      return () => {
        stop();
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.removeEventListener('touchstart', onEnter as any);
        el.removeEventListener('touchend', onLeave as any);
        el.removeEventListener('pointerdown', onEnter);
        el.removeEventListener('pointerup', onLeave);
        document.removeEventListener('visibilitychange', onVisibility);
      };
    } catch {}
  }, []);

  // Categorias (dinâmicas) com chips em slider
  const allCategories = useMemo(() => {
    const fromBanca = Array.isArray(banca.categories) ? banca.categories.map((c) => normalizeCategory(c)).filter(Boolean) : [];
    const fromProducts = Array.from(new Set(produtos.map((p) => normalizeCategory(p.category)).filter(Boolean)));
    const combined = Array.from(new Set([...fromBanca, ...fromProducts]));
    if (combined.length > 0) return combined;
    try {
      const src = Array.isArray(homeCategories) ? homeCategories : [];
      const filtered = src.filter((c: any) => c?.active !== false);
      const ordered = filtered.sort((a: any,b: any) => (a?.order ?? 0) - (b?.order ?? 0));
      const names = ordered.map((c: any) => String(c?.name || "").trim()).filter(Boolean);
      if (names.length > 0) return names;
    } catch {}
    return [];
  }, [banca.categories, produtos]);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const catScrollerRef = useRef<HTMLDivElement | null>(null);
  const [hasCatOverflow, setHasCatOverflow] = useState(false);

  // Auto-rolagem do slider de categorias (todas as larguras; apenas os chips após 'Todos')
  useEffect(() => {
    try {
      const el = catScrollerRef.current;
      if (!el || typeof window === 'undefined') return;
      const step = 160; // px por passo

      const start = () => {
        const max = el.scrollWidth - el.clientWidth;
        if (max <= 0) return; // sem overflow, não há por que rotacionar
        // passo inicial rápido para evidenciar movimento
        setTimeout(() => { try { el.scrollBy({ left: Math.min(step, max), behavior: 'smooth' }); } catch {} }, 800);
        return window.setInterval(() => {
          const m = el.scrollWidth - el.clientWidth;
          const next = el.scrollLeft + step;
          if (next >= m - 5) el.scrollTo({ left: 0, behavior: 'smooth' });
          else el.scrollBy({ left: step, behavior: 'smooth' });
        }, 3200);
      };

      let timer = start();
      const stop = () => { if (timer) { window.clearInterval(timer); timer = undefined as any; } };
      const resume = () => { stop(); timer = start(); };

      // Pausa/retoma em interação e visibilidade
      const onEnter = () => stop();
      const onLeave = () => resume();
      const onVisibility = () => { if (document.hidden) stop(); else resume(); };
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
      el.addEventListener('touchstart', onEnter, { passive: true } as any);
      el.addEventListener('touchend', onLeave as any, { passive: true } as any);
      document.addEventListener('visibilitychange', onVisibility);

      // detectar overflow e atualizar em resize
      const checkOverflow = () => {
        try { setHasCatOverflow(el.scrollWidth > el.clientWidth + 4); } catch {}
      };
      // checar após layout
      checkOverflow();
      setTimeout(checkOverflow, 0);
      requestAnimationFrame(checkOverflow);
      const onResize = () => checkOverflow();
      window.addEventListener('resize', onResize);

      return () => {
        stop();
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.removeEventListener('touchstart', onEnter as any);
        el.removeEventListener('touchend', onLeave as any);
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('resize', onResize);
      };
    } catch {}
  }, []);

  // Persistência simples de preferências (ofertas e categoria)
  useEffect(() => {
    try {
      const s = localStorage.getItem("gdb_offerSort");
      if (s === "discount" || s === "price" || s === "rating") setOfferSort(s);
      const c = localStorage.getItem("gdb_activeCategory");
      setActiveCategory(c || 'Todos');
    } catch {}
  }, []);
  useEffect(() => { try { localStorage.setItem("gdb_offerSort", offerSort); } catch {} }, [offerSort]);
  useEffect(() => { try { localStorage.setItem("gdb_activeCategory", activeCategory); } catch {} }, [activeCategory]);
  const produtosFiltrados = useMemo(() => {
    const base = (!activeCategory || activeCategory === 'Todos')
      ? produtos
      : produtos.filter(p => normalizeCategory(p.category).toLowerCase() === activeCategory.toLowerCase());
    // Não filtrar sem estoque; a UI indicará 'Esgotado'
    return base;
  }, [activeCategory, produtos]);

  // Paginação com carregamento incremental por página (30 itens/page)
  const pageSize = 30;
  const batchSize = 12; // quantidade carregada por vez dentro da página
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(produtosFiltrados.length / pageSize));
  const pageStart = (currentPage - 1) * pageSize;
  const pageSlice = useMemo(() => produtosFiltrados.slice(pageStart, pageStart + pageSize), [produtosFiltrados, pageStart]);
  const [batchCount, setBatchCount] = useState(1);
  const endRef = useRef<HTMLDivElement | null>(null);
  const productsTopRef = useRef<HTMLDivElement | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const canLoadMoreWithinPage = (batchCount * batchSize) < pageSlice.length;
  const visibleProducts = useMemo(() => pageSlice.slice(0, Math.min(pageSlice.length, batchCount * batchSize)), [pageSlice, batchCount]);
  // Reset ao trocar categoria ou página
  useEffect(() => { setCurrentPage(1); setBatchCount(1); }, [activeCategory]);
  useEffect(() => { setBatchCount(1); }, [currentPage]);
  useEffect(() => {
    // rolar para o topo da seção produtos quando muda de página
    try { productsTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch {}
  }, [currentPage]);
  useEffect(() => {
    if (!endRef.current) return;
    const el = endRef.current;
    const obs = new IntersectionObserver((entries) => {
      const e = entries[0];
      if (e && e.isIntersecting && canLoadMoreWithinPage && !isLoadingMore) {
        setIsLoadingMore(true);
        setTimeout(() => { setBatchCount(c => c + 1); setIsLoadingMore(false); }, 300);
      }
    }, { root: null, rootMargin: '200px', threshold: 0.01 });
    obs.observe(el);
    return () => { try { obs.unobserve(el); obs.disconnect(); } catch {} };
  }, [canLoadMoreWithinPage, isLoadingMore, pageSlice.length]);

  if (!banca) return null;

  return (
    <section className="container-max pt-0 sm:pt-4 pb-28 sm:pb-32">
      {/* Capa + Header da Banca */}
      <div className="relative h-72 sm:h-72 w-full rounded-2xl overflow-hidden border border-gray-200">
        <Image src={banca.cover} alt={banca.name} fill className="object-cover" />
        {banca.featured && (
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 text-[#ff5c00] border border-orange-200 px-2 py-[2px] text-[10px] font-semibold shadow">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
              Destaque
            </span>
          </div>
        )}
        {/* Ações: ícones em coluna no banner, alinhados à direita (mobile e desktop) */}
        <div className="absolute right-2 top-2 md:right-3 md:top-3 z-10 flex flex-col gap-2">
          {banca.phone && (
            <a
              href={`https://wa.me/${banca.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="group relative grid place-items-center h-8 w-8 md:h-9 md:w-9 rounded-full bg-white/60 backdrop-blur-md shadow border border-white/40"
            >
              <Image src="https://cdn-icons-png.flaticon.com/128/733/733585.png" alt="" width={16} height={16} className="h-4 w-4 object-contain" />
              <span className="sr-only">WhatsApp</span>
              <span role="tooltip" className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[10px] text-white opacity-0 translate-y-1 transition group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">WhatsApp</span>
            </a>
          )}
          
          {/* ícone de ligar removido para ganhar espaço */}
          {true && (
            <a
              href="#"
              onClick={(e)=>{ e.preventDefault(); handleShare(); }}
              aria-label="Compartilhar"
              className="group relative grid place-items-center h-8 w-8 md:h-9 md:w-9 rounded-full bg-white/60 backdrop-blur-md shadow border border-white/40"
            >
              <Image src="https://cdn-icons-png.flaticon.com/128/3989/3989188.png" alt="" width={16} height={16} className="h-4 w-4 object-contain" />
              <span className="sr-only">Compartilhar</span>
              <span role="tooltip" className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[10px] text-white opacity-0 translate-y-1 transition group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">Compartilhar</span>
            </a>
          )}
          {banca.socials?.facebook && (
            <a
              href={banca.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="group relative grid place-items-center h-8 w-8 md:h-9 md:w-9 rounded-full bg-white/60 backdrop-blur-md shadow border border-white/40"
            >
              <Image src="https://cdn-icons-png.flaticon.com/128/4628/4628653.png" alt="Facebook" width={16} height={16} className="h-4 w-4 object-contain" />
              <span className="sr-only">Facebook</span>
              <span role="tooltip" className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[10px] text-white opacity-0 translate-y-1 transition group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">Facebook</span>
            </a>
          )}
          {banca.socials?.instagram && (
            <a
              href={banca.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="group relative grid place-items-center h-8 w-8 md:h-9 md:w-9 rounded-full bg-white/60 backdrop-blur-md shadow border border-white/40"
            >
              <Image src="https://cdn-icons-png.flaticon.com/128/1077/1077042.png" alt="Instagram" width={16} height={16} className="h-4 w-4 object-contain" />
              <span className="sr-only">Instagram</span>
              <span role="tooltip" className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[10px] text-white opacity-0 translate-y-1 transition group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">Instagram</span>
            </a>
          )}
          {banca.socials?.gmb && (
            <a
              href={banca.socials.gmb}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google"
              className="group relative grid place-items-center h-8 w-8 md:h-9 md:w-9 rounded-full bg-white/60 backdrop-blur-md shadow border border-white/40"
            >
              <Image src="https://cdn-icons-png.flaticon.com/128/300/300221.png" alt="Google" width={16} height={16} className="h-4 w-4 object-contain" />
              <span className="sr-only">Google</span>
              <span role="tooltip" className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[10px] text-white opacity-0 translate-y-1 transition group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">Google</span>
            </a>
          )}
        </div>
        <div className="absolute left-4 bottom-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-white p-1 shadow ring-1 ring-black/5 overflow-hidden">
              <div className="h-full w-full rounded-full overflow-hidden">
                <Image src={banca.avatar} alt={banca.name} width={56} height={56} className="h-full w-full object-cover" />
              </div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-semibold text-white drop-shadow">{banca.name}</div>
              <div className="mt-1 flex items-center gap-2">
                {banca.open ? <OpenBadge /> : <ClosedBadge />}
                <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-2 py-[2px]">
                  <Stars value={banca.rating ?? 5} />
                  <span className="text-[11px] text-gray-700">{banca.reviews ?? 0}</span>
                </div>
                {km != null && (
                  <div className="inline-flex items-center gap-1 rounded-full bg-white/80 backdrop-blur px-2 py-[2px] text-[11px] text-gray-700">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5z"/></svg>
                    {Math.ceil(km) > 3 ? "+3 km" : `${Math.max(1, Math.ceil(km))} km`}
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Frete grátis (compacto) logo abaixo do banner */}
      <div className="mt-2 rounded-xl border border-gray-200 bg-white p-2">
        <FreeShippingProgress subtotal={subtotal} />
      </div>

      {/* Pagamento Facilitado, Compra Segura, Banca Verificada */}
      <div className="mt-3">
        <TrustBadges />
      </div>

      {/* Info rápidas e CTA */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-[12px] text-gray-700" />
        {/* Grupo de botões (texto): oculto para ganhar espaço no desktop */}
        <div className="hidden items-center gap-2 flex-wrap">
          {banca.phone && (
            <a
              href={`https://wa.me/${banca.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-[#25D366] text-[#128C7E] font-semibold px-3 py-2 leading-tight hover:bg-emerald-50 text-xs"
            >
              <Image src="https://cdn-icons-png.flaticon.com/128/733/733585.png" alt="WhatsApp" width={14} height={14} className="h-3.5 w-3.5 object-contain" />
              WhatsApp
            </a>
          )}
          {/* Como chegar */}
          <a
            href={(() => {
              if (banca.lat && banca.lng) return `https://www.google.com/maps/search/?api=1&query=${banca.lat},${banca.lng}`;
              if (banca.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(banca.address)}`;
              return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(banca.name)}`;
            })()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-gray-300 text-gray-700 font-semibold px-3 py-2 leading-tight hover:bg-gray-50 text-xs"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 11a4 4 0 110-8 4 4 0 010 8z"/></svg>
            Como chegar
          </a>
          {/* Ligar */}
          {banca.phone && (
            <a
              href={`tel:${banca.phone.replace(/\D/g, "")}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-gray-300 text-gray-700 font-semibold px-3 py-2 leading-tight hover:bg-gray-50 text-xs"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M6.6 10.8a15.05 15.05 0 006.6 6.6l2.2-2.2c.2-.2.5-.3.8-.2 1 .3 2 .5 3.1.5.4 0 .7.3.7.7V20c0 .4-.3.7-.7.7C10.1 20.7 3.3 13.9 3.3 5.4c0-.4.3-.7.7-.7H6c.4 0 .7.3.7.7 0 1.1.2 2.1.5 3.1.1.3 0 .6-.2.8l-2.2 2.2z"/></svg>
              Ligar
            </a>
          )}
          {/* Visitar site */}
          {banca.ctaUrl && (
            <a
              href={banca.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-indigo-300 text-indigo-700 font-semibold px-3 py-2 leading-tight hover:bg-indigo-50 text-xs"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"/><path d="M5 5h6v2H7v10h10v-4h2v6H5z"/></svg>
              Visitar site
            </a>
          )}
        </div>
      </div>

      {/* Abas: Sobre | Horários */}
      <div className="mt-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-6" aria-label="Tabs">
            {['Sobre','Horários','Como comprar','Como chegar'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={()=>setInfoTab(t as 'Sobre'|'Horários'|'Como comprar'|'Como chegar')}
                className={`whitespace-nowrap border-b-2 px-1 pb-2 text-sm font-medium ${infoTab===t ? 'border-[#ff5c00] text-[#ff5c00]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                aria-current={infoTab===t ? 'page' : undefined}
              >
                {t}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 pb-4 border-b border-gray-200">
          {infoTab === 'Sobre' && (
            <div>
              {banca.description ? (
                <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: banca.description }} />
              ) : (
                <p className="text-sm text-gray-700">
                  Jornaleiro é uma plataforma que conecta você às melhores bancas do seu bairro. Entre em contato com o jornaleiro para saber mais sobre produtos, promoções e serviços disponíveis nesta banca.
                </p>
              )}
            </div>
          )}
          {infoTab === 'Horários' && (
            <div>
              {Array.isArray(banca.hoursArray) && banca.hoursArray.length > 0 ? (
                <div className="mt-1">
                  <h2 className="text-base sm:text-lg font-semibold mb-2">Horário de funcionamento</h2>
                  <div className="overflow-hidden rounded-xl border border-gray-200">
                    <table className="w-full text-sm">
                      <tbody>
                        {banca.hoursArray!.map((h, i) => (
                          <tr key={i} className="divide-x divide-gray-100 odd:bg-white even:bg-gray-50">
                            <td className="px-3 py-2 w-36 text-gray-700 font-medium">{h.label}</td>
                            <td className="px-3 py-2">
                              {h.open ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700">
                                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                                  {h.start} - {h.end}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-gray-500">
                                  <span className="inline-block h-2 w-2 rounded-full bg-gray-400" />
                                  Fechado
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Horários não informados.</p>
              )}
            </div>
          )}
          {infoTab === 'Como comprar' && (
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-2">Como comprar</h2>
              <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
                <li>
                  <span className="font-semibold">Escolha seus produtos</span> — navegue pelas categorias e selecione o que deseja.
                </li>
                <li>
                  <span className="font-semibold">Adicione ao seu carrinho</span> — ajuste quantidades conforme necessário.
                </li>
                <li>
                  <span className="font-semibold">Faça o seu pedido ao Jornaleiro</span> — finalize e confirme os itens.
                </li>
                <li>
                  <span className="font-semibold">Confirme o pagamento</span> — siga as instruções de pagamento disponibilizadas.
                </li>
                <li>
                  <span className="font-semibold">Combine a entrega</span> — defina com o jornaleiro o melhor horário e local. Pronto!
                </li>
              </ol>
              {Array.isArray(banca.payments) && banca.payments.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-base font-semibold">Formas de pagamento</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {banca.payments!.map((p, i) => (
                      <span key={i} className="inline-flex items-center rounded-md bg-white px-2 py-1 text-[12px] text-gray-700 border border-gray-200">
                        {p.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {infoTab === 'Como chegar' && (
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-2">Como chegar</h2>
              <p className="text-sm text-gray-700 mb-3">
                {banca.address
                  ? banca.address
                  : (Number.isFinite(banca.lat) && Number.isFinite(banca.lng)
                    ? `Coordenadas: ${banca.lat}, ${banca.lng}`
                    : 'Endereço não informado.')}
              </p>
              {(() => {
                const hasCoords = typeof banca.lat === 'number' && typeof banca.lng === 'number' && !Number.isNaN(banca.lat) && !Number.isNaN(banca.lng);
                const query = hasCoords
                  ? `${banca.lat},${banca.lng}`
                  : (banca.address ? encodeURIComponent(banca.address) : encodeURIComponent(banca.name));
                const embedSrc = `https://www.google.com/maps?q=${query}&output=embed`;
                const openHref = `https://www.google.com/maps/search/?api=1&query=${query}`;
                return (
                  <div>
                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                      <iframe
                        title="Mapa - Como chegar"
                        src={embedSrc}
                        className="w-full h-56 sm:h-72"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        aria-label="Mapa do endereço"
                      />
                    </div>
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="text-xs text-gray-600">
                        {km != null ? (
                          <span>Distância aproximada: <span className="font-semibold text-gray-800">{km.toFixed(1)} km</span></span>
                        ) : (
                          <span>Distância indisponível</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={()=>handleRoute('google')}
                          className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                        >
                          <Image src="https://cdn-icons-png.flaticon.com/128/2702/2702604.png" alt="Google Maps" width={16} height={16} className="h-4 w-4 object-contain" />
                          Google Maps
                        </button>
                        <button
                          type="button"
                          onClick={()=>handleRoute('waze')}
                          className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                        >
                          <Image src="https://cdn-icons-png.flaticon.com/128/3771/3771526.png" alt="Waze" width={16} height={16} className="h-4 w-4 object-contain" />
                          Waze
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
          
        </div>
      </div>

      {/* Galeria de imagens */}
      {Array.isArray(banca.gallery) && banca.gallery.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg sm:text-xl font-semibold">Galeria</h2>
          <div className="mt-2 flex gap-3 overflow-x-auto pb-1">
            {banca.gallery.map((src, i) => (
              <div key={i} className="relative h-28 w-44 rounded-xl overflow-hidden border border-gray-200 shadow-sm shrink-0">
                <Image src={src} alt={`${banca.name} - foto ${i+1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      

      {/* Horários completos movidos para a aba "Horários" */}

      {/* Selos (agora sobrepostos ao banner) */}

      {/* Ofertas e Promoções */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 whitespace-nowrap">
            <span className="text-[#ff5c00]">🔥</span> Ofertas e Promoções
          </h2>
        </div>
        <div
          className="mt-2 rounded-xl p-2 relative overflow-hidden"
          style={{
            backgroundImage: "url('https://stackfood-react.6amtech.com/static/paidAdds.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* leve véu para legibilidade */}
          <div className="absolute inset-0 bg-white/50" />
          <div className="relative">
            <button
              aria-label="Anterior"
              onClick={() => { scrollerRef.current?.scrollBy({ left: -260, behavior: 'smooth' }); }}
              className="hidden sm:grid place-items-center absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 shadow hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            </button>
            <button
              aria-label="Próximo"
              onClick={() => { scrollerRef.current?.scrollBy({ left: 260, behavior: 'smooth' }); }}
              className="hidden sm:grid place-items-center absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 shadow hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
            </button>
            <div ref={scrollerRef} className="relative flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2">
              {loadingDestaque ? (
                <div className="flex items-center justify-center w-full py-8">
                  <div className="text-sm text-gray-500">Carregando ofertas...</div>
                </div>
              ) : produtosDestaque.length === 0 ? (
                <div className="flex items-center justify-center w-full py-8">
                  <div className="text-center text-gray-500">
                    <div className="text-sm">Nenhuma oferta em destaque</div>
                    <div className="text-xs mt-1">Configure produtos em destaque no painel do jornaleiro</div>
                  </div>
                </div>
              ) : (
                produtosDestaque.map((p) => {
                const oldPrice = p.priceOriginal || (p.discountPercent ? p.price / (1 - p.discountPercent / 100) : p.price);
                const newPrice = p.price;
                return (
                  <div key={p.id} className="min-w-[240px] snap-start rounded-xl bg-white border border-amber-100 shadow-sm overflow-hidden">
                    <div className="relative h-32 w-full bg-gray-50">
                      <Image src={p.image} alt={p.name} fill className="object-contain" />
                      {/* Ribbon de desconto */}
                      <div className="absolute left-0 top-0">
                        <div className="relative w-[110px] h-[0px]">
                          <span
                            className="absolute -left-6 top-2 rotate-[-35deg] bg-rose-500 text-white text-[10px] font-bold px-6 py-1 shadow"
                            style={{background: ui.rose.text}}
                          >-{Math.round(p.discountPercent ?? 0)}% OFF</span>
                        </div>
                      </div>
                      {/* Badge Pronta Entrega */}
                      {p.ready && (
                        <div className="absolute right-2 top-2">
                          <span className="inline-flex items-center rounded-md bg-emerald-50 text-emerald-700 px-2 py-[2px] text-[10px] font-semibold border border-emerald-100">
                            Pronta Entrega
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <div className="text-[13px] font-semibold line-clamp-1">{p.name}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-extrabold text-[14px]" style={{color: ui.brand.primary}}>R$ {newPrice.toFixed(2)}</span>
                        <span className="text-[11px] text-gray-400 line-through">R$ {oldPrice.toFixed(2)}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[11px] text-gray-500 flex items-center gap-1"><Stars value={p.rating ?? 4.5} /> ({p.reviews ?? 0})</span>
                        <button
                          onClick={() => { addToCart({ id: p.id, name: p.name, price: newPrice, image: p.image }, 1); show(<span>Adicionado ao carrinho.</span>); }}
                          className="rounded-md px-2 py-1 text-[11px] font-semibold text-white hover:opacity-95"
                          style={{background: ui.brand.primary}}
                        >Adicionar</button>
                      </div>
                    </div>
                  </div>
                );
              })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Produtos da Banca */}
      <h2 ref={productsTopRef} className="mt-8 mb-0 text-lg sm:text-xl font-semibold">Produtos desta Banca</h2>

      {/* Barra de chips (Todos fixo) + seta à direita + limpar filtro */}
      <div className="mt-0 sticky top-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-100 w-full max-w-full overflow-x-hidden">
        <div className="flex items-center justify-between px-1 pt-0">
          <div className="text-[11px] sm:text-[12px] text-gray-500">Navegue por uma Categoria</div>
          <div className="flex items-center gap-2">
            {activeCategory !== 'Todos' && (
              <button onClick={()=>setActiveCategory('Todos')} className="text-[12px] text-[#ff5c00] font-medium hover:underline">Limpar filtro</button>
            )}
            <div className="flex items-center gap-1 z-10">
              <button
                type="button"
                aria-label="Categorias anteriores"
                onClick={()=>{ const el = catScrollerRef.current; if (el) el.scrollBy({ left: -220, behavior: 'smooth' }); }}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
              </button>
              <button
                type="button"
                aria-label="Próximas categorias"
                onClick={()=>{ const el = catScrollerRef.current; if (el) el.scrollBy({ left: 220, behavior: 'smooth' }); }}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
              </button>
            </div>
          </div>
        </div>
        <div className="relative flex items-stretch gap-2 px-1 pb-2">
          {/* Chip 'Todos' fixo */}
          <div className="shrink-0 py-2">
            <button
              onClick={()=> setActiveCategory('Todos')}
              className={`whitespace-nowrap rounded-full border px-2 py-1 text-[11px] sm:px-3 sm:py-1.5 sm:text-[12px] ${activeCategory==='Todos'?"border-[#ff5c00] text-white bg-[#ff5c00]":"border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
            >Todos</button>
          </div>
          {/* Scroller somente com demais categorias */}
          <div className="relative flex-1 min-w-0 max-w-full">
            <div ref={catScrollerRef} className="no-scrollbar flex items-center gap-2 w-full max-w-full overflow-x-auto overflow-y-hidden py-2 pr-10 whitespace-nowrap">
              {allCategories.map((name) => (
                <button
                  key={name}
                  onClick={()=>{ setActiveCategory(name); }}
                  className={`whitespace-nowrap rounded-full border px-2 py-1 text-[11px] sm:px-3 sm:py-1.5 sm:text-[12px] ${activeCategory===name?"border-[#ff5c00] text-white bg-[#ff5c00]":"border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
                >{name}</button>
              ))}
            </div>
            {/* mobile hint: gradiente à direita */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent sm:hidden" />
          </div>
        </div>
      </div>
      {loadingProdutos ? (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">Carregando produtos...</div>
      ) : visibleProducts.length === 0 ? (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">Nenhum produto publicado nesta banca ainda.</div>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {visibleProducts.map((p) => (
              <ProductCard key={p.id} p={p} phone={banca.phone} />
            ))}
          </div>
          {/* Loader / sentinela para infinite scroll */}
          <div ref={endRef} className="mt-3 flex items-center justify-center">
            {isLoadingMore ? (
              <span className="text-sm text-gray-500">Carregando...</span>
            ) : !canLoadMoreWithinPage ? (
              <span className="text-[12px] text-gray-400">Fim da página</span>
            ) : null}
          </div>

          {/* Paginação */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={()=> setCurrentPage(p => Math.max(1, p-1))}
              disabled={currentPage === 1}
              className={`rounded-md border px-3 py-1 text-sm ${currentPage===1 ? 'text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed' : 'text-gray-700 border-gray-300 bg-white hover:bg-gray-50'}`}
            >Anterior</button>
            {(() => {
              const btns: JSX.Element[] = [];
              const maxBtns = 5;
              let start = Math.max(1, currentPage - 2);
              let end = Math.min(totalPages, start + maxBtns - 1);
              if (end - start + 1 < maxBtns) start = Math.max(1, end - maxBtns + 1);
              if (start > 1) btns.push(<span key="start-ellipsis" className="px-1 text-sm text-gray-500">...</span>);
              for (let i = start; i <= end; i++) {
                btns.push(
                  <button
                    key={i}
                    onClick={()=> setCurrentPage(i)}
                    className={`min-w-[32px] rounded-md border px-2 py-1 text-sm ${currentPage===i ? 'border-[#ff5c00] bg-orange-50 text-[#ff5c00]' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                  >{i}</button>
                );
              }
              if (end < totalPages) btns.push(<span key="end-ellipsis" className="px-1 text-sm text-gray-500">...</span>);
              return btns;
            })()}
            <button
              type="button"
              onClick={()=> setCurrentPage(p => Math.min(totalPages, p+1))}
              disabled={currentPage === totalPages}
              className={`rounded-md border px-3 py-1 text-sm ${currentPage===totalPages ? 'text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed' : 'text-gray-700 border-gray-300 bg-white hover:bg-gray-50'}`}
            >Próxima</button>
          </div>
        </>
      )}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

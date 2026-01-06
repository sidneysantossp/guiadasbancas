"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import TrustBadges from "@/components/TrustBadges";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import Head from "next/head";
import SEOBreadcrumbs from "@/components/SEOBreadcrumbs";
import { shippingConfig } from "@/components/shippingConfig";

export type ProductDetail = {
  id: string;
  name: string;
  images: string[];
  price: number;
  oldPrice?: number;
  rating?: number;
  reviews?: number;
  ready?: boolean;
  discountLabel?: string;
  vendor: {
    id: string;
    name: string;
    avatar: string;
    distanceKm?: number | null;
    phone?: string;
  };
  stock?: number;
  description?: string;
  specs?: Record<string, string>;
};

// MOCK removido - dados devem vir exclusivamente da API

// Tipos para produtos relacionados
type RelatedProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  codigo_mercos?: string;
};

function Stars({ value = 5 }: { value?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-[2px] text-[#f59e0b]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
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

function SocialShare({ title }: { title: string }) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = `${title}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const tw = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copiado!");
    } catch (_) {
      // noop
    }
  };

  return (
    <div className="mt-4 text-sm md:flex md:items-center md:gap-3">
      <span className="text-gray-700 font-medium">Compartilhar:</span>
      <div className="mt-2 md:mt-0 flex items-center gap-3 flex-wrap">
        <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md border border-gray-200 p-2 hover:bg-gray-50" title="Compartilhar no WhatsApp">
          <Image src="https://cdn-icons-png.flaticon.com/128/733/733585.png" alt="WhatsApp" width={16} height={16} className="h-4 w-4 object-contain" />
        </a>
        <a href={fb} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md border border-gray-200 p-2 hover:bg-gray-50" title="Compartilhar no Facebook">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#1877f2]" fill="currentColor"><path d="M22 12a10 10 0 10-11.6 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.4 3h-1.8v7A10 10 0 0022 12z"/></svg>
        </a>
        <a href={tw} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md border border-gray-200 p-2 hover:bg-gray-50" title="Compartilhar no X (Twitter)">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M22 5.8c-.7.3-1.5.6-2.2.7.8-.5 1.4-1.2 1.7-2.1-.7.4-1.6.8-2.4 1C18.3 4.6 17.3 4 16.1 4c-2.2 0-3.9 2-3.4 4.1-3-.1-5.7-1.6-7.5-3.8-.9 1.6-.5 3.7 1.1 4.7-.6 0-1.2-.2-1.7-.5 0 1.8 1.3 3.4 3.1 3.7-.6.2-1.3.2-2 .1.6 1.6 2.1 2.7 3.9 2.7-1.5 1.2-3.3 1.8-5.2 1.8H3c1.9 1.2 4.1 2 6.5 2 7.8 0 12.2-6.8 11.9-12.9.8-.6 1.4-1.2 1.6-1.9z"/></svg>
        </a>
        <button onClick={copy} className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 hover:bg-gray-50">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M16 1H4a2 2 0 00-2 2v12h2V3h12V1zm3 4H8a2 2 0 00-2 2v12a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 14H8V7h11v12z"/></svg>
          Copiar link
        </button>
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

function generateProductSchema(product: ProductDetail, reviews: any[], reviewStats: any) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://guiadasbancas.com";
  const productUrl = `${baseUrl}/produto/${slugify(product.name)}-${product.id}`;
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productUrl,
    "name": product.name,
    "description": product.description || `${product.name} disponível nas bancas próximas de você.`,
    "image": product.images.map(img => img.startsWith('http') ? img : `${baseUrl}${img}`),
    "url": productUrl,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Guia das Bancas"
    },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "BRL",
      "price": product.price.toFixed(2),
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": (product.stock || 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": product.vendor.name,
        "url": baseUrl
      }
    },
    "aggregateRating": reviewStats && reviewStats.total > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": reviewStats.average,
      "reviewCount": reviewStats.total,
      "bestRating": 5,
      "worstRating": 1
    } : undefined,
    "review": reviews.map(review => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": 5,
        "worstRating": 1
      },
      "author": {
        "@type": "Person",
        "name": review.user_name
      },
      "reviewBody": review.comment,
      "datePublished": review.created_at
    })),
    "category": "Revistas e Jornais",
    "productID": product.id
  };

  return JSON.parse(JSON.stringify(schema));
}

function generateBreadcrumbSchema(product: ProductDetail) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://guiadasbancas.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Início",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Produtos",
        "item": `${baseUrl}/produtos`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `${baseUrl}/produto/${slugify(product.name)}-${product.id}`
      }
    ]
  };
}

function useItemsPerView() {
  const [w, setW] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  if (w < 640) return 2;      // mobile: 2
  if (w < 1024) return 3;     // tablet: 3
  return 4;                   // desktop: 4
}

function RelatedCarousel({ items }: { items: RelatedProduct[] }) {
  const perView = useItemsPerView();
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);
  const { addToCart, items: cartItems } = useCart();
  const subtotal = cartItems.reduce((s, it) => s + (it.price ?? 0) * it.qty, 0);
  const qualifies = shippingConfig.freeShippingEnabled || subtotal >= shippingConfig.freeShippingThreshold;
  const { show } = useToast();
  const [fav, setFav] = useState<Record<string, boolean>>({});

  const track = useMemo(() => [...items, ...items], [items]);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => i + perView);
      setAnimating(true);
    }, 4500);
    return () => clearInterval(id);
  }, [perView]);

  return (
    <section className="mt-10">
      <h2 className="text-lg sm:text-xl font-semibold">Produtos Relacionados</h2>
      <div className="relative mt-3">
        <div className="overflow-hidden">
          <div
            className="flex"
            style={{
              transform: `translateX(-${(index * 100) / perView}%)`,
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
            {track.map((it, i) => (
              <div
                key={`${it.id}-${i}`}
                className="flex shrink-0 flex-col items-stretch px-1"
                style={{ flex: `0 0 ${100 / perView}%` }}
              >
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-3 h-full">
                  {/* Imagem */}
                  <div className="relative h-36 w-full rounded-[14px] overflow-hidden group">
                    <Image src={it.image} alt={it.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover" />
                    {/* Link absoluto cobrindo a imagem */}
                    <Link
                      href={("/produto/" + slugify(it.name) + "-" + it.id) as Route}
                      aria-label={`Ver detalhes de ${it.name}`}
                      className="absolute inset-0 rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c00]"
                    />
                    {/* Overlay hover sutil */}
                    <div className="pointer-events-none absolute inset-0 rounded-[14px] bg-black/0 group-hover:bg-black/5 transition" />
                    {/* Overlay actions */}
                    <div className="absolute right-2 top-2 flex items-center gap-2">
                      {/* Visualizar */}
                      <Link
                        href={("/produto/" + slugify(it.name) + "-" + it.id) as Route}
                        className="backdrop-blur bg-white/60 hover:bg-white/80 h-8 w-8 rounded-md grid place-items-center shadow transition"
                        aria-label="Visualizar"
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 115-5 5 5 0 01-5 5zm0-8a3 3 0 103 3 3 3 0 00-3-3z"/></svg>
                      </Link>
                      {/* Favoritar */}
                      <button
                        onClick={() => setFav((m) => ({ ...m, [it.id]: !m[it.id] }))}
                        aria-pressed={!!fav[it.id]}
                        aria-label="Favoritar"
                        className={`backdrop-blur h-8 w-8 rounded-md grid place-items-center shadow transition ${fav[it.id] ? "bg-rose-500/90 text-white" : "bg-white/60 hover:bg-white/80 text-gray-700"}`}
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 21s-6.7-4.4-9.2-7.7A5.6 5.6 0 0112 6.3a5.6 5.6 0 019.2 7C18.7 16.6 12 21 12 21z"/></svg>
                      </button>
                      {/* Adicionar ao carrinho */}
                      <button
                        onClick={() => { addToCart({ id: it.id, name: it.name, price: it.price, image: it.image }, 1); show(<span>Adicionado ao carrinho. <Link href={("/carrinho" as Route)} className="underline font-semibold">Ver carrinho</Link></span>); }}
                        aria-label="Adicionar ao carrinho"
                        className="backdrop-blur bg-white/60 hover:bg-white/80 h-8 w-8 rounded-md grid place-items-center shadow transition"
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M7 4h-2l-1 2h2l3.6 7.6-1.35 2.45A1 1 0 0010.1 18h8.4v-2h-7.3l.9-1.6h5.8a1 1 0 00.9-.6L22 7H6.2zM7 20a2 2 0 102-2 2 2 0 00-2 2zm8 0a2 2 0 102-2 2 2 0 00-2 2z"/></svg>
                      </button>
                    </div>
                  </div>
                  {/* Título + Badge */}
                  <div className="mt-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-1 md:gap-2">
                    <div className="flex-1">
                      <Link href={("/produto/" + slugify(it.name) + "-" + it.id) as Route} className="text-[13px] font-semibold line-clamp-2 hover:underline">
                        {it.name}
                      </Link>
                      {it.codigo_mercos && (
                        <p className="text-[10px] text-gray-600 mt-0.5">Cód: {it.codigo_mercos}</p>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-[2px] text-[10px] font-semibold whitespace-nowrap md:mt-0 mt-1">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
                      Pronta Entrega
                    </span>
                  </div>
                  {/* Preço */}
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-[#ff5c00] font-extrabold">R$ {it.price.toFixed(2)}</span>
                    <span className="text-gray-400 line-through text-xs">R$ {(it.price * 1.3).toFixed(2)}</span>
                  </div>
                  {/* Ações */}
                  <div className="mt-3 space-y-2">
                    <button
                      className="w-full rounded-lg bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] text-white text-xs font-semibold px-4 py-2.5 shadow hover:opacity-95"
                      onClick={() => { addToCart({ id: it.id, name: it.name, price: it.price, image: it.image }, 1); show("Adicionado ao carrinho"); }}
                    >
                      Adicionar ao carrinho
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window === "undefined") return;
                        const baseUrl = window.location.origin || "https://guiadasbancas.com";
                        const productPath = "/produto/" + slugify(it.name) + "-" + it.id;
                        const productUrl = baseUrl + productPath;
                        const text = `Olá! Tenho interesse no produto: ${it.name} (R$ ${it.price.toFixed(2)}).\n\nVer produto: ${productUrl}`;
                        const msg = encodeURIComponent(text);
                        const url = `https://wa.me?text=${msg}`;
                        window.location.href = url;
                      }}
                      className="w-full rounded-md border border-[#ff5c00] text-[#ff5c00] text-[10px] font-semibold px-3 py-1.5 leading-tight hover:bg-[#fff3ec] inline-flex items-center justify-center gap-1.5"
                    >
                      <Image src="https://cdn-icons-png.flaticon.com/128/733/733585.png" alt="WhatsApp" width={14} height={14} className="h-3.5 w-3.5 object-contain" />
                      Comprar pelo WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Setas de navegação */}
        <button
          aria-label="Anterior"
          onClick={() => { setAnimating(true); setIndex((i) => Math.max(0, i - perView)); }}
          className="hidden sm:grid place-items-center absolute left-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/95 shadow hover:bg-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </button>
        <button
          aria-label="Próximo"
          onClick={() => { setAnimating(true); setIndex((i) => i + perView); }}
          className="hidden sm:grid place-items-center absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/95 shadow hover:bg-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
        </button>
      </div>
    </section>
  );
}

function ReadyBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-[2px] text-[10px] font-semibold">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
      Pronta Entrega
    </span>
  );
}

function DiscountBadge({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-[#1e73ff] text-white px-2 py-1 text-[11px] font-semibold">{text}</span>
  );
}

export default function ProductPageClient({ productId, bancaIdOverride }: { productId: string; bancaIdOverride?: string }) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);

  // Buscar produto real do backend
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Se temos bancaIdOverride, passar para a API
        const apiUrl = bancaIdOverride 
          ? `/api/products/${productId}?banca=${bancaIdOverride}`
          : `/api/products/${productId}`;
        
        const res = await fetch(apiUrl, { cache: "no-store" });
        if (!res.ok) throw new Error("Produto não encontrado");
        
        const json = await res.json();
        const p = json?.data || json;
        
        if (!p || !p.id) {
          throw new Error("Dados do produto inválidos");
        }
        
        // Usar bancaIdOverride se fornecido (para produtos de distribuidor)
        const effectiveBancaId = bancaIdOverride || p.banca_id;
        
        // Buscar dados da banca - usar effectiveBancaId (override ou do produto)
        let bancaData = null;
        if (effectiveBancaId) {
          try {
            const bancaRes = await fetch(`/api/bancas/${effectiveBancaId}`, { cache: "no-store" });
            if (bancaRes.ok) {
              const bancaJson = await bancaRes.json();
              bancaData = bancaJson?.data || bancaJson;
            }
          } catch (e) {
            console.error("Erro ao buscar dados da banca:", e);
          }
        }
        
        // Combinar imagens principais com galeria
        const mainImages = Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []);
        const galleryImages = Array.isArray(p.gallery_images) ? p.gallery_images : [];
        const allImages = [...mainImages, ...galleryImages].filter(Boolean);
        
        const hasDiscount = typeof p.discount_percent === 'number' && p.discount_percent > 0;
        const computedOldPrice = hasDiscount
          ? (p.price_original || (p.price && p.discount_percent ? p.price / (1 - p.discount_percent / 100) : undefined))
          : undefined;

        // Mapear dados do backend para o formato esperado
        const mappedProduct: ProductDetail = {
          id: p.id,
          name: p.name || "Produto sem nome",
          images: allImages.length > 0 ? allImages : ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1200&auto=format&fit=crop"],
          price: p.price || 0,
          oldPrice: computedOldPrice,
          rating: p.rating_avg || 4.5,
          reviews: p.reviews_count || 0,
          ready: Boolean(p.pronta_entrega || p.ready),
          discountLabel: hasDiscount ? `-${p.discount_percent}%` : undefined,
          vendor: {
            id: effectiveBancaId || "banca-unknown",
            name: bancaData?.name || "Banca Local",
            avatar: bancaData?.avatar || bancaData?.images?.avatar || "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=200&auto=format&fit=crop",
            distanceKm: null,
            phone: bancaData?.contact?.whatsapp || bancaData?.phone || bancaData?.telefone || bancaData?.whatsapp_phone,
          },
          stock: p.stock_qty || 0,
          description: p.description_full || p.description || "Descrição não disponível",
          specs: p.specifications ? (typeof p.specifications === 'string' ? JSON.parse(p.specifications) : p.specifications) : {},
        };
        
        console.log("Produto carregado com sucesso:", mappedProduct.name);
        setProduct(mappedProduct);
        
        // Buscar produtos relacionados da mesma categoria
        if (p.category_id) {
          try {
            const relatedRes = await fetch(`/api/products/related/${p.category_id}?exclude=${productId}&limit=12`);
            if (relatedRes.ok) {
              const relatedJson = await relatedRes.json();
              const relatedList = Array.isArray(relatedJson?.data) ? relatedJson.data : [];
              
              // Já vem filtrado da API
              const filtered = relatedList.slice(0, 8);
              
              setRelatedProducts(filtered);
              console.log(`[ProductPage] Produtos relacionados carregados: ${filtered.length}`);
            }
          } catch (e) {
            console.error("Erro ao buscar produtos relacionados:", e);
          }
        } else if (p.banca_id) {
          // Fallback: buscar produtos da mesma banca se não tiver categoria
          try {
            const relatedRes = await fetch(`/api/bancas/${p.banca_id}/products?limit=12`);
            if (relatedRes.ok) {
              const relatedJson = await relatedRes.json();
              const relatedList = Array.isArray(relatedJson?.items) ? relatedJson.items : (Array.isArray(relatedJson?.data) ? relatedJson.data : []);
              
              // Filtrar produtos diferentes do atual e com imagem
              const filtered = relatedList
                .filter((rp: any) => rp.id !== productId && rp.images && rp.images.length > 0)
                .slice(0, 8)
                .map((rp: any) => ({
                  id: rp.id,
                  name: rp.name || 'Produto',
                  image: rp.images[0],
                  price: Number(rp.price || 0),
                  codigo_mercos: rp.codigo_mercos,
                }));
              
              setRelatedProducts(filtered);
              console.log(`[ProductPage] Produtos relacionados (fallback banca) carregados: ${filtered.length}`);
            }
          } catch (e) {
            console.error("Erro ao buscar produtos relacionados (fallback banca):", e);
          }
        }
      } catch (e: any) {
        const errorMessage = e?.message || (typeof e === 'string' ? e : 'Erro desconhecido');
        console.error("Erro ao carregar produto:", errorMessage, "ProductId:", productId);
        setError(errorMessage || "Erro ao carregar produto");
        // Não usar fallback mock - mostrar erro real
      } finally {
        setLoading(false);
      }
    };
    
    if (productId) {
      loadProduct();
    }
  }, [productId, bancaIdOverride]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5c00] mx-auto"></div>
          <div className="text-lg font-medium mt-4">Carregando produto...</div>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-lg font-medium text-red-600">Produto não encontrado</div>
          <div className="text-sm text-gray-500 mt-1">{error}</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const max = Math.max(1, product.images.length - 1);
  const { addToCart, items } = useCart();
  const { show } = useToast();

  const handleWhatsAppMain = () => {
    if (typeof window === "undefined") return;
    const rawPhone = product.vendor.phone;
    const digits = rawPhone ? rawPhone.replace(/\D/g, "") : "";
    const productUrl = window.location.href;
    const text = `Olá! Tenho interesse no produto: ${product.name} (R$ ${product.price.toFixed(2)}).\n\nVer produto: ${productUrl}`;
    const msg = encodeURIComponent(text);
    const base = digits ? `https://wa.me/${digits}` : "https://wa.me";
    const url = `${base}?text=${msg}`;
    window.location.href = url;
  };

  // Gerar dados estruturados
  const productSchema = generateProductSchema(product, reviews, reviewStats);
  const breadcrumbSchema = generateBreadcrumbSchema(product);

  return (
    <>
      {/* Dados Estruturados JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      
      <section className="container-max max-w-5xl py-2 md:py-8 pb-24">
        {/* Breadcrumbs */}
        <SEOBreadcrumbs 
          items={[
            { name: "Início", href: "/" },
            { name: "Produtos", href: "/produtos" },
            { name: product.name }
          ]}
        />
        
        {/* Top: Galeria + Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
        {/* Galeria */}
        <div>
          <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-gray-200 bg-white">
            <Image src={product.images[active]} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-4" />
            {product.ready && (
              <div className="absolute right-3 top-3"><ReadyBadge /></div>
            )}
          </div>
          <div className="mt-1 md:mt-3 grid grid-cols-5 gap-3">
            {product.images.map((src, i) => (
              <button key={i} onClick={() => setActive(i)} className={`relative h-16 rounded-xl overflow-hidden border bg-white ${active===i?"border-[var(--color-primary)]":"border-gray-200"}`}>
                <Image src={src} alt={`thumb-${i}`} fill sizes="64px" className="object-contain p-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Info direita */}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">{product.name}</h1>
          {product.description && (
            <p className="mt-1 text-sm text-gray-700 line-clamp-2">{product.description}</p>
          )}
          <div className="mt-2 flex items-center gap-2">
            <Stars value={product.rating} />
            <span className="text-sm text-gray-600">{product.reviews} avaliações</span>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-extrabold text-[#ff5c00]">R$ {product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <span className="text-gray-400 line-through">R$ {product.oldPrice.toFixed(2)}</span>
            )}
          </div>

          {/* (Vendedor movido para baixo, após TrustBadges) */}

          {/* Quantidade + Ações */}
          <div className="mt-5 flex items-center gap-3">
            <div className="inline-flex items-center rounded-lg border border-gray-300 overflow-hidden">
              <button onClick={() => setQty((q) => Math.max(1, q-1))} className="px-3 py-2 text-sm">-</button>
              <span className="px-4 py-2 text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => q+1)} className="px-3 py-2 text-sm">+</button>
            </div>
            <button
              className="flex-1 rounded-lg bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] text-white font-semibold px-4 py-2 shadow hover:opacity-95"
              onClick={() => { addToCart({ id: product.id, name: product.name, price: product.price, image: product.images[0], banca_id: product.vendor.id, banca_name: product.vendor.name }, qty); show(<span>Adicionado ao carrinho. <Link href={("/carrinho" as Route)} className="underline font-semibold">Ver carrinho</Link></span>); }}
            >
              Adicionar ao carrinho
            </button>
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={handleWhatsAppMain}
              className="w-full rounded-md border border-[#ff5c00] text-[#ff5c00] font-semibold px-4 py-2.5 hover:bg-[#fff3ec] text-sm inline-flex items-center justify-center gap-2"
            >
              <Image src="https://cdn-icons-png.flaticon.com/128/733/733585.png" alt="WhatsApp" width={16} height={16} className="h-4 w-4 object-contain" />
              Comprar pelo WhatsApp
            </button>
          </div>

          {/* Selo de confiança */}
          <TrustBadges className="mt-4" variant="ecom" />

          {/* Vendedor (Jornaleiro) — movido para baixo, após badges */}
          <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link 
                  href={`/banca/${product.vendor.id}` as Route}
                  className="h-10 w-10 rounded-full overflow-hidden ring-1 ring-black/5 hover:ring-2 hover:ring-[#ff5c00] transition-all"
                  title={`Ver perfil de ${product.vendor.name}`}
                >
                  <Image src={product.vendor.avatar} alt={product.vendor.name} width={40} height={40} className="h-full w-full object-cover" />
                </Link>
                <div>
                  <Link 
                    href={`/banca/${product.vendor.id}` as Route}
                    className="text-sm font-semibold leading-tight hover:text-[#ff5c00] transition-colors"
                  >
                    {product.vendor.name}
                  </Link>
                  {product.vendor.distanceKm != null && (
                    <div className="text-[12px] text-gray-600">≈ {product.vendor.distanceKm.toFixed(1)} km de você</div>
                  )}
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-[2px] text-[10px] font-semibold">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Banca Verificada
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Descrição, Especificações, Avaliações */}
      <div className="mt-8">
        <Tabs product={product} />
      </div>

      {/* Veja mais produtos desta banca */}
      {relatedProducts.length > 0 && <RelatedCarousel items={relatedProducts} />}
    </section>
    </>
  );
}

function Tabs({ product }: { product: ProductDetail }) {
  const [tab, setTab] = useState<"descricao" | "especificacoes" | "avaliacoes">("descricao");
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<any>(null);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Carregar avaliações quando a aba for selecionada
  useEffect(() => {
    if (tab === "avaliacoes" && reviews.length === 0) {
      const loadReviews = async () => {
        try {
          setLoadingReviews(true);
          const res = await fetch(`/api/products/${product.id}/reviews`);
          if (res.ok) {
            const data = await res.json();
            setReviews(data.data.reviews || []);
            setReviewStats(data.data.stats || null);
          }
        } catch (e) {
          console.error("Erro ao carregar avaliações:", e);
        } finally {
          setLoadingReviews(false);
        }
      };
      loadReviews();
    }
  }, [tab, product.id, reviews.length]);
  return (
    <div>
      <div className="border-b border-gray-200">
        <div className="flex gap-6 text-sm">
          <button className={`relative pb-2 font-semibold ${tab === "descricao" ? "text-black" : "text-gray-500"}`} onClick={() => setTab("descricao")}>Descrição {tab === "descricao" && <span className="absolute left-0 -bottom-[1px] h-[3px] w-full rounded bg-[#ff5c00]" />}</button>
          <button className={`relative pb-2 font-semibold ${tab === "especificacoes" ? "text-black" : "text-gray-500"}`} onClick={() => setTab("especificacoes")}>Especificações {tab === "especificacoes" && <span className="absolute left-0 -bottom-[1px] h-[3px] w-full rounded bg-[#ff5c00]" />}</button>
          <button className={`relative pb-2 font-semibold ${tab === "avaliacoes" ? "text-black" : "text-gray-500"}`} onClick={() => setTab("avaliacoes")}>Avaliações ({reviewStats?.total ?? product.reviews ?? 0}) {tab === "avaliacoes" && <span className="absolute left-0 -bottom-[1px] h-[3px] w-full rounded bg-[#ff5c00]" />}</button>
        </div>
      </div>

      {tab === "descricao" && (
        <div className="mt-4 text-sm text-gray-700 leading-relaxed">
          {product.description && product.description.includes('<') ? (
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          ) : (
            <div>{product.description}</div>
          )}
          <div className="border-t border-gray-200 mt-4 pt-4">
            <SocialShare title={product.name} />
          </div>
        </div>
      )}

      {tab === "especificacoes" && (
        <div className="mt-4">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(product.specs || {}).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
                <dt className="text-gray-600">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {tab === "avaliacoes" && (
        <div className="mt-4">
          {loadingReviews ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#ff5c00]"></div>
              <span className="ml-2 text-sm text-gray-600">Carregando avaliações...</span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-sm">Nenhuma avaliação ainda</div>
              <div className="text-xs mt-1">Seja o primeiro a avaliar este produto!</div>
            </div>
          ) : (
            <div className="space-y-4">
              {reviewStats && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#ff5c00]">{reviewStats.average}</div>
                      <Stars value={reviewStats.average} />
                      <div className="text-xs text-gray-500 mt-1">{reviewStats.total} avaliações</div>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map(star => (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span className="w-3">{star}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[#ff5c00] h-2 rounded-full" 
                              style={{ width: `${reviewStats.total > 0 ? (reviewStats.distribution[star] / reviewStats.total) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="w-6 text-gray-500">{reviewStats.distribution[star]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {reviews.map((review) => (
                <div key={review.id} className="rounded-xl border border-gray-200 p-4 bg-white">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={review.user_avatar} alt={review.user_name} width={40} height={40} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-sm font-semibold">{review.user_name}</div>
                        {review.verified_purchase && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Compra verificada</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Stars value={review.rating} />
                        <span className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

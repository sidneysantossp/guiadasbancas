"use client";

import Image from "next/image";
import Link from "next/link";
import { buildBancaHref } from "@/lib/slug";
import type { Route } from "next";
import { useEffect, useMemo, useState } from "react";
import { haversineKm, loadStoredLocation, UserLocation } from "@/lib/location";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { shippingConfig } from "@/components/shippingConfig";

// Mocks simples (substituir por API futuramente)
export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  vendor: string;
  vendorAvatar?: string;
  lat: number;
  lng: number;
  rating?: number;
  reviews?: number;
  ready?: boolean;
  bancaId?: string;
  phone?: string;
};

export type Banca = {
  id: string;
  name: string;
  cover: string;
  avatar?: string;
  lat: number;
  lng: number;
  itemsCount: number;
  rating?: number;
  reviews?: number;
  open?: boolean;
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Chocolate Sprinkle Donut",
    price: 120,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop",
    vendor: "Banca Centro",
    lat: -23.5617,
    lng: -46.6560,
  },
  {
    id: "p2",
    name: "Croissant",
    price: 47.5,
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop",
    vendor: "Banca Paulista",
    vendorAvatar: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=200&auto=format&fit=crop",
    lat: -23.5660,
    lng: -46.6530,
    rating: 4.8,
    reviews: 12,
    ready: true,
  },
  {
    id: "p3",
    name: "Samosa",
    price: 2,
    image: "https://images.unsplash.com/photo-1604908176997-43162a5fae9b?q=80&w=800&auto=format&fit=crop",
    vendor: "Banca Liberdade",
    vendorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    lat: -23.5631,
    lng: -46.6397,
    rating: 4.5,
    reviews: 7,
    ready: true,
  },
];

const MOCK_BANCAS: Banca[] = [
  {
    id: "b1",
    name: "Banca Centro",
    cover: "https://images.unsplash.com/photo-1529429612777-728c1e7f1f3f?q=80&w=1200&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=200&auto=format&fit=crop",
    lat: -23.5617,
    lng: -46.6560,
    itemsCount: 128,
    rating: 4.7,
    reviews: 31,
    open: true,
  },
  {
    id: "b2",
    name: "Banca Paulista",
    cover: "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?q=80&w=1200&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    lat: -23.5660,
    lng: -46.6530,
    itemsCount: 86,
    rating: 4.9,
    reviews: 18,
    open: true,
  },
  {
    id: "b3",
    name: "Banca Liberdade",
    cover: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200&auto=format&fit=crop",
    lat: -23.5631,
    lng: -46.6397,
    itemsCount: 73,
    rating: 4.6,
    reviews: 11,
    open: false,
  },
];

function DistancePill({ km }: { km: number | null }) {
  if (km == null) return null;
  const r = Math.ceil(km);
  const label = r > 3 ? "+3 km" : `${Math.max(1, r)} km`;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#fff3ec] text-[#ff5c00] px-2 py-[3px] text-[11px] font-semibold">
      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5z"/></svg>
      {label}
    </span>
  );
}

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

function ReadyBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-[2px] text-[10px] font-semibold">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
      Pronta Entrega
    </span>
  );
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function ProductCard({ p, km }: { p: Product; km: number | null }) {
  const [fav, setFav] = useState(false);
  const { addToCart } = useCart();
  const { show } = useToast();
  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">
      <div className="relative h-40 sm:h-44 lg:h-36 w-full group">
        <Image src={p.image} alt={p.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw" className="object-cover" />
        {/* Link absoluto cobrindo a imagem */}
        <Link
          href={("/produto/" + slugify(p.name) + "-" + p.id) as Route}
          aria-label={`Ver detalhes de ${p.name}`}
          className="absolute inset-0 rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c00]"
        />
        {/* Efeito hover sutil sobre a imagem */}
        <div className="pointer-events-none absolute inset-0 rounded-[14px] bg-black/0 group-hover:bg-black/5 transition" />
        {p.ready && (
          <div className="absolute left-2 top-2">
            <ReadyBadge />
          </div>
        )}
      </div>
      <div className="p-3">
        <Link href={("/produto/" + slugify(p.name) + "-" + p.id) as Route} className="text-[13px] font-semibold line-clamp-1 hover:underline">{p.name}</Link>
        <div className="mt-1 flex items-center justify-between">
          <Stars value={p.rating ?? 5} />
          <span className="text-[11px] text-gray-500">{p.reviews ?? 0} avaliações</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[#ff5c00] font-extrabold">R$ {p.price.toFixed(2)}</span>
          <DistancePill km={km} />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-6 w-6 rounded-full overflow-hidden">
              <Image src={p.vendorAvatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"} alt={p.vendor} width={24} height={24} className="h-full w-full object-cover" />
            </div>
            <span className="text-[12px] text-gray-700 font-medium truncate">{p.vendor}</span>
          </div>
          <span className="text-[11px] text-gray-500">&nbsp;</span>
        </div>

        <div className="mt-2 flex flex-col gap-1.5">
          <button
            type="button"
            className="w-full rounded-md bg-[#ff5c00] text-white text-[11px] font-semibold py-1.5 hover:opacity-95"
            onClick={() => {
              addToCart(
                {
                  id: p.id,
                  name: p.name,
                  price: p.price,
                  image: p.image,
                  banca_id: p.bancaId,
                  banca_name: p.vendor,
                },
                1
              );
              show(
                <span>
                  Adicionado ao carrinho. {" "}
                  <Link href="/carrinho" className="underline font-semibold">
                    Ver carrinho
                  </Link>
                </span>
              );
            }}
          >
            Adicionar ao carrinho
          </button>

          {p.phone && (
            <a
              href={`https://wa.me/${String(p.phone).replace(/\D/g, "")}?text=${encodeURIComponent(
                `Olá! Tenho interesse no produto: ${p.name} (R$ ${p.price.toFixed(2)}).\n\nVer produto: https://guiadasbancas.com/produto/${slugify(p.name)}-${p.id}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] text-[11px] font-semibold py-1.5 hover:bg-[#25D366]/15"
            >
              <Image
                src="https://cdn-icons-png.flaticon.com/128/733/733585.png"
                alt="WhatsApp"
                width={14}
                height={14}
                className="h-3.5 w-3.5 object-contain"
              />
              Comprar pelo WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function OpenBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-[2px] text-[11px] font-semibold shadow">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      Banca Aberta
    </span>
  );
}

function ClosedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 px-2 py-[2px] text-[11px] font-semibold shadow">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      Banca Fechada
    </span>
  );
}

function BancaCard({ b, km, loc, description }: { b: Banca; km: number | null; loc: UserLocation | null; description?: string }) {
  const distanceLabel = km == null ? null : (km > 3 ? "+3Km" : `${Math.max(1, Math.round(km))}Km`);
  return (
    <Link href={(buildBancaHref(b.name, b.id, loc) as Route)} className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition block">
      <div className="relative h-36 w-full">
        <Image src={b.cover} alt={b.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw" className="object-cover" />
        <div className="absolute left-2 bottom-2">{b.open ? <OpenBadge /> : <ClosedBadge />}</div>
      </div>
      <div className="p-3">
        {/* Estrelas à esquerda com nota */}
        <div className="flex items-center gap-2">
          <Stars value={b.rating ?? 5} />
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[12px] font-semibold text-emerald-700">{(b.rating ?? 5).toFixed(1)}</span>
        </div>
        {/* Avatar + nome */}
        <div className="mt-2 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-white p-1 shadow ring-1 ring-gray-200 overflow-hidden">
            <Image src={b.avatar || "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=200&auto=format&fit=crop"} alt={b.name} width={28} height={28} className="h-full w-full object-cover rounded-full" />
          </div>
          <div className="text-[13px] font-semibold leading-snug line-clamp-2">{b.name}</div>
        </div>
        {/* Descrição curta abaixo do título */}
        {description && (
          <div className="mt-1 text-[12px] text-gray-700 line-clamp-2">{description}</div>
        )}
        {/* Ver no Mapa */}
        <div className="mt-1 flex items-center">
          <span className="inline-flex items-center gap-1 text-[12px] text-black">
            <Image src="https://cdn-icons-png.flaticon.com/128/2875/2875433.png" alt="Mapa" width={14} height={14} className="h-3.5 w-3.5 rounded-full object-contain" />
            Ver no Mapa
          </span>
        </div>
        {/* Contagem de produtos */}
        <div className="mt-1 text-[12px] text-gray-600">{b.itemsCount} Produtos</div>
      </div>
    </Link>
  );
}

type CategoryResultsClientProps = {
  slug: string;
  title: string;
  initialCategories?: Array<{ id: string; name: string; link?: string }>;
};

export default function CategoryResultsClient({ slug, title, initialCategories }: CategoryResultsClientProps) {
  const [loc, setLoc] = useState<UserLocation | null>(null);
  const [tab, setTab] = useState<"produtos" | "bancas">("produtos");
  // Filtros (aba Bancas)
  const [maxKm, setMaxKm] = useState<number>(5);
  const [minStars, setMinStars] = useState<number>(0);
  // Filtros (aba Produtos)
  const [prodMaxKm, setProdMaxKm] = useState<number>(5);
  const [prodMinStars, setProdMinStars] = useState<number>(0);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(0); // 0 = qualquer preço
  
  // Estados para dados reais
  const [products, setProducts] = useState<Product[]>([]);
  const [bancas, setBancas] = useState<Banca[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLoc(loadStoredLocation());
  }, []);

  // Buscar produtos e bancas reais por categoria
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log(`[CategoryResults] Buscando dados para categoria: ${slug}`);
        
        // 1. Buscar categoria pelo slug
        let categoryId = '';
        let allCategories = Array.isArray(initialCategories) ? initialCategories : [];

        if (allCategories.length === 0) {
          const categoriesRes = await fetch('/api/categories');
          if (categoriesRes.ok) {
            const categoriesData = await categoriesRes.json();
            allCategories = Array.isArray(categoriesData?.data) ? categoriesData.data : [];
          }
        }

        if (allCategories.length > 0) {
          const category = allCategories.find((cat: any) =>
            cat.link?.includes(`/${slug}`) ||
            cat.id === slug ||
            cat.name.toLowerCase() === slug.toLowerCase()
          );

          if (category) {
            categoryId = category.id;
            console.log(`[CategoryResults] Categoria encontrada: ${category.name} (ID: ${categoryId})`);
          } else {
            console.log(`[CategoryResults] Categoria não encontrada para slug: ${slug}`);
          }
        }
        
        // 2. Buscar produtos da categoria via Supabase
        if (categoryId) {
          const productsRes = await fetch(`/api/products/public?category=${categoryId}&limit=100`);
          if (productsRes.ok) {
            const productsData = await productsRes.json();
            const productsArray = Array.isArray(productsData?.items) ? productsData.items : (Array.isArray(productsData?.data) ? productsData.data : []);
            
            console.log(`[CategoryResults] Produtos encontrados: ${productsArray.length}`);
            
            // Buscar informações das bancas para cada produto
            const bancasMap = new Map<string, any>();
            const bancasRes = await fetch('/api/bancas');
            if (bancasRes.ok) {
              const bancasData = await bancasRes.json();
              const bancasArray = Array.isArray(bancasData?.data) ? bancasData.data : (Array.isArray(bancasData) ? bancasData : []);
              bancasArray.forEach((banca: any) => {
                bancasMap.set(banca.id, banca);
              });
            }
            
            // Mapear produtos com informações da banca
            const mappedProducts: Product[] = productsArray
              .filter((item: any) => item.images && item.images.length > 0 && item.active !== false)
              .map((item: any) => {
                const banca = item.banca_id ? bancasMap.get(item.banca_id) : null;
                return {
                  id: item.id,
                  name: item.name || 'Produto',
                  price: Number(item.price || 0),
                  image: item.images[0],
                  vendor: banca?.name || 'Banca',
                  vendorAvatar: banca?.avatar || banca?.cover_image || '',
                  lat: banca?.lat || -23.5505,
                  lng: banca?.lng || -46.6333,
                  rating: item.rating_avg || 5,
                  reviews: item.reviews_count || 0,
                  ready: true,
                  bancaId: item.banca_id,
                  phone: banca?.contact?.whatsapp || banca?.whatsapp || banca?.phone || banca?.telefone || banca?.whatsapp_phone,
                };
              });
            
            setProducts(mappedProducts);
            console.log(`[CategoryResults] Produtos mapeados: ${mappedProducts.length}`);
            
            // 3. Buscar bancas que possuem produtos dessa categoria
            const uniqueBancaIds = new Set<string>(productsArray.map((p: any) => p.banca_id).filter(Boolean));
            console.log(`[CategoryResults] Bancas únicas com produtos: ${uniqueBancaIds.size}`);
            
            const mappedBancas: Banca[] = Array.from(uniqueBancaIds)
              .map((bancaId: string) => bancasMap.get(bancaId))
              .filter(Boolean)
              .filter((banca: any) => banca.active !== false)
              .map((banca: any) => {
                // Contar quantos produtos dessa categoria a banca tem
                const productsCount = productsArray.filter((p: any) => p.banca_id === banca.id).length;
                
                // Log para debug de coordenadas
                console.log(`[CategoryResults] Banca "${banca.name}":`, {
                  lat: banca.lat,
                  lng: banca.lng,
                  hasCoordinates: !!(banca.lat && banca.lng)
                });
                
                return {
                  id: banca.id,
                  name: banca.name || 'Banca',
                  cover: banca.cover_image || banca.cover || '',
                  avatar: banca.avatar || banca.cover_image || '',
                  lat: banca.lat || -23.5505,
                  lng: banca.lng || -46.6333,
                  itemsCount: productsCount,
                  rating: 4.5,
                  reviews: 0,
                  open: true,
                };
              });
            
            setBancas(mappedBancas);
            console.log(`[CategoryResults] Bancas mapeadas: ${mappedBancas.length}`);
          }
        } else {
          console.log('[CategoryResults] Usando dados mock - categoria não encontrada');
          setProducts(MOCK_PRODUCTS);
          setBancas(MOCK_BANCAS);
        }
        
      } catch (error) {
        console.error('[CategoryResults] Erro ao buscar dados:', error);
        setProducts(MOCK_PRODUCTS);
        setBancas(MOCK_BANCAS);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug, initialCategories]);

  const sortedProducts = useMemo(() => {
    const dataSource = products.length > 0 ? products : MOCK_PRODUCTS;

    const withinKm = (d: number | null) => {
      if (d == null) return true; // sem loc, não filtra por km
      if (prodMaxKm >= 5) return true; // 5+ km = mostrar todos
      return d <= prodMaxKm + 1e-9;
    };

    const meetsStars = (r?: number) => {
      if (prodMinStars === 0) return true;
      return (r ?? 0) >= prodMinStars;
    };

    const meetsPrice = (price: number) => {
      if (maxPriceFilter <= 0) return true; // 0 = qualquer preço
      return price <= maxPriceFilter + 1e-9;
    };

    if (!loc) {
      const filtered = dataSource.filter((p) => meetsStars(p.rating) && meetsPrice(p.price));
      return filtered.map((p) => ({ p, km: null as number | null }));
    }

    return [...dataSource]
      .map((p) => ({ p, km: haversineKm({ lat: loc.lat, lng: loc.lng }, { lat: p.lat, lng: p.lng }) }))
      .filter(({ p, km }) => withinKm(km) && meetsStars(p.rating) && meetsPrice(p.price))
      .sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity));
  }, [loc, products, prodMaxKm, prodMinStars, maxPriceFilter]);

  const maxAvailablePrice = useMemo(() => {
    const dataSource = products.length > 0 ? products : MOCK_PRODUCTS;
    const max = dataSource.reduce((m, p) => Math.max(m, p.price || 0), 0);
    return max > 0 ? Math.ceil(max) : 500;
  }, [products]);

  const sortedBancas = useMemo(() => {
    const dataSource = bancas.length > 0 ? bancas : MOCK_BANCAS;
    if (!loc) {
      console.log('[CategoryResults] Sem localização do usuário - não ordena por distância');
      return dataSource.map((b) => ({ b, km: null as number | null }));
    }
    
    console.log('[CategoryResults] Localização do usuário:', { lat: loc.lat, lng: loc.lng });
    
    const sorted = [...dataSource]
      .map((b) => {
        const km = haversineKm({ lat: loc.lat, lng: loc.lng }, { lat: b.lat, lng: b.lng });
        console.log(`[CategoryResults] Distância para "${b.name}":`, {
          bancaLat: b.lat,
          bancaLng: b.lng,
          distanciaKm: km.toFixed(2)
        });
        return { b, km };
      })
      .sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity));
    
    return sorted;
  }, [loc, bancas]);

  // Descrições curtas temporárias
  const DESCRIPTIONS: Record<string, string> = {
    b1: "Desde 1982 conectando leitores com as melhores revistas e jornais da região.",
    b2: "Tradição e curadoria especial de títulos com atendimento rápido.",
    b3: "Quadrinhos, papelaria e aquela conversa boa com o jornaleiro.",
  };

  // Aplicação dos filtros
  const filteredBancas = useMemo(() => {
    console.log(`[CategoryResults] Aplicando filtros: maxKm=${maxKm}, minStars=${minStars}`);
    
    const withinKm = (d: number | null) => {
      if (d == null) return true; // sem loc, não filtra por km
      if (maxKm >= 5) return true; // 5+ km = mostrar todos
      return d <= maxKm + 1e-9;
    };
    const meetsStars = (r?: number) => {
      if (minStars === 0) return true; // "Qualquer" = mostrar todos
      return (r ?? 0) >= minStars;
    };
    
    const filtered = sortedBancas.filter(({ b, km }) => {
      const passKm = withinKm(km);
      const passStars = meetsStars(b.rating);
      
      console.log(`[CategoryResults] Filtro "${b.name}":`, {
        distancia: km?.toFixed(2) || 'null',
        passaDistancia: passKm,
        rating: b.rating,
        passaRating: passStars,
        incluido: passKm && passStars
      });
      
      return passKm && passStars;
    });
    
    console.log(`[CategoryResults] Filtrados: ${filtered.length} de ${sortedBancas.length}`);
    return filtered;
  }, [sortedBancas, maxKm, minStars]);

  if (!mounted) {
    return (
      <section className="container-max pt-3 pb-32">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600">Carregando...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="container-max pt-3 pb-32">
      
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600">Carregando produtos...</div>
        </div>
      )}

      {!loading && (
        <>
      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <div className="flex gap-6 text-sm">
          <button
            className={`relative pb-2 font-semibold ${tab === "produtos" ? "text-black" : "text-gray-500"}`}
            onClick={() => setTab("produtos")}
          >
            Produtos
            {tab === "produtos" && <span className="absolute left-0 -bottom-[1px] h-[3px] w-full rounded bg-[#ff5c00]" />}
          </button>
          <button
            className={`relative pb-2 font-semibold ${tab === "bancas" ? "text-black" : "text-gray-500"}`}
            onClick={() => setTab("bancas")}
          >
            Bancas
            {tab === "bancas" && <span className="absolute left-0 -bottom-[1px] h-[3px] w-full rounded bg-[#ff5c00]" />}
          </button>
        </div>
      </div>

      {/* Content */}
      {tab === "produtos" ? (
        <>
          {/* Layout Produtos: sidebar de filtros + lista de produtos */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-[260px,1fr] gap-4 items-start">
            {/* Sidebar filtros Produtos */}
            <aside className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
              <div className="text-sm font-semibold text-gray-800">Filtros</div>
              <div className="text-xs text-gray-600">Resultados: <span className="font-semibold">{sortedProducts.length}</span></div>

              {/* Filtro preço máximo */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-800">Preço máximo</div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={maxAvailablePrice}
                    step={1}
                    value={maxPriceFilter}
                    onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                    className="accent-[#ff5c00] range-orange flex-1"
                  />
                  <span className="text-xs text-gray-700 w-24 text-right">
                    {maxPriceFilter <= 0 ? 'Sem limite' : `Até R$ ${maxPriceFilter.toFixed(0)}`}
                  </span>
                </div>
              </div>

              {/* Filtro distância */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-800">Bancas mais próximas</div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.5}
                    value={prodMaxKm}
                    onChange={(e)=>setProdMaxKm(Number(e.target.value))}
                    className="accent-[#ff5c00] range-orange flex-1"
                  />
                  <span className="text-xs text-gray-700 w-12 text-right">{prodMaxKm>=5? '5+Km' : `${prodMaxKm.toFixed(1)}Km`}</span>
                </div>
              </div>

              {/* Filtro avaliação */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-800">Avaliação</div>
                <div className="flex flex-wrap gap-2">
                  {[0,1,2,3,4,5].map((n)=> (
                    <button
                      key={n}
                      type="button"
                      onClick={()=>setProdMinStars(n)}
                      className={`h-8 px-2 rounded-md border text-sm ${prodMinStars===n? 'bg-[#fff3ec] border-[#ffd7bd] text-[#ff5c00]' : 'bg-white border-gray-300 text-gray-700'}`}
                    >
                      {n===0? 'Qualquer' : `${n}+★`}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Lista de produtos */}
            <div>
              {sortedProducts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg viewBox="0 0 24 24" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 15s1.5 2 4 2 4-2 4-2"/>
                    <path d="M9 9h.01M15 9h.01"/>
                  </svg>
                  <p className="text-gray-600 font-medium">Nenhum produto encontrado com esses filtros</p>
                  <p className="text-sm text-gray-500 mt-1">Tente ajustar o preço, a distância ou a avaliação mínima</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {sortedProducts.map(({ p, km }) => (
                    <ProductCard key={p.id} p={p} km={km} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <style jsx>{`
            .range-orange::-webkit-slider-runnable-track{background:#ffe2d2;height:6px;border-radius:9999px}
            .range-orange::-moz-range-track{background:#ffe2d2;height:6px;border-radius:9999px}
            .range-orange::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:16px;height:16px;background:#ff5c00;border-radius:9999px;margin-top:-5px;border:2px solid #fff;box-shadow:0 0 0 1px #ffd7bd}
            .range-orange::-moz-range-thumb{width:16px;height:16px;background:#ff5c00;border:2px solid #fff;border-radius:9999px;box-shadow:0 0 0 1px #ffd7bd}
          `}</style>
        </>
      ) : (
        <>
          <p className="mt-6 text-sm text-gray-700">
            Confira abaixo as Bancas mais próximas de você para compra do produto
            {" "}
            <span className="text-[#ff5c00] font-semibold">“{title}”</span>.
          </p>

          {/* Layout com sidebar de filtros (esquerda) + lista de bancas (direita) */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-[260px,1fr] gap-4 items-start">
            {/* Sidebar de filtros */}
            <aside className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
              <div className="text-sm font-semibold text-gray-800">Filtros</div>
              <div className="text-xs text-gray-600">Resultados: <span className="font-semibold">{filteredBancas.length}</span></div>

              {/* Filtro distância */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-800">Distância</div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.5}
                    value={maxKm}
                    onChange={(e)=>setMaxKm(Number(e.target.value))}
                    className="accent-[#ff5c00] range-orange flex-1"
                  />
                  <span className="text-xs text-gray-700 w-12 text-right">{maxKm>=5? '5+Km' : `${maxKm.toFixed(1)}Km`}</span>
                </div>
              </div>

              {/* Filtro avaliação */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-800">Avaliação</div>
                <div className="flex flex-wrap gap-2">
                  {[0,1,2,3,4,5].map((n)=> (
                    <button
                      key={n}
                      type="button"
                      onClick={()=>setMinStars(n)}
                      className={`h-8 px-2 rounded-md border text-sm ${minStars===n? 'bg-[#fff3ec] border-[#ffd7bd] text-[#ff5c00]' : 'bg-white border-gray-300 text-gray-700'}`}
                    >
                      {n===0? 'Qualquer' : `${n}+★`}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Lista de bancas */}
            <div>
              {filteredBancas.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg viewBox="0 0 24 24" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 15s1.5 2 4 2 4-2 4-2"/>
                    <path d="M9 9h.01M15 9h.01"/>
                  </svg>
                  <p className="text-gray-600 font-medium">Nenhuma banca encontrada com esses filtros</p>
                  <p className="text-sm text-gray-500 mt-1">Tente ajustar a distância ou avaliação mínima</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredBancas.map(({ b, km }) => (
                    <BancaCard key={b.id} b={b} km={km} loc={loc} description={DESCRIPTIONS[b.id as keyof typeof DESCRIPTIONS]} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <style jsx>{`
            .range-orange::-webkit-slider-runnable-track{background:#ffe2d2;height:6px;border-radius:9999px}
            .range-orange::-moz-range-track{background:#ffe2d2;height:6px;border-radius:9999px}
            .range-orange::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:16px;height:16px;background:#ff5c00;border-radius:9999px;margin-top:-5px;border:2px solid #fff;box-shadow:0 0 0 1px #ffd7bd}
            .range-orange::-moz-range-thumb{width:16px;height:16px;background:#ff5c00;border:2px solid #fff;border-radius:9999px;box-shadow:0 0 0 1px #ffd7bd}
          `}</style>
        </>
      )}
      </>
      )}
    </section>
  );
}

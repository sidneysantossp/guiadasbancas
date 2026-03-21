"use client";

// Removido next/image - usando img nativo para evitar falhas em produção
import Link from "next/link";
import { buildBancaHref } from "@/lib/slug";
import { buildPublicProductPath } from "@/lib/product-url";
import type { Route } from "next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { haversineKm, loadStoredLocation, UserLocation } from "@/lib/location";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { shippingConfig } from "@/components/shippingConfig";
import CategoryCarousel from "@/components/CategoryCarousel";
import CatalogSidebar from "@/components/CatalogSidebar";

const FALLBACK_CATEGORY_GROUPS: Record<string, string[]> = {
  Panini: [
    "Colecionáveis",
    "Conan",
    "DC Comics",
    "Disney",
    "Disney Comics",
    "Marvel",
    "Marvel Comics",
    "Mangás",
    "Maurício de Sousa Produções",
    "Panini Books",
    "Panini Comics",
    "Panini Magazines",
    "Panini Partwork",
    "Planet Manga",
  ],
  Bebidas: ["Energéticos", "Bebidas"],
  Bomboniere: [
    "Balas e Drops",
    "Balas a Granel",
    "Biscoitos",
    "Chicletes",
    "Chocolates",
    "Doces",
    "Pirulitos",
    "Salgadinhos",
    "Snacks",
  ],
  Brinquedos: ["Blocos de Montar", "Carrinhos", "Massinha", "Pelúcias", "Brinquedos", "Livros Infantis"],
  Cartas: ["Baralhos", "Baralhos e Cards", "Cards Colecionáveis", "Cards Pokémon", "Jogos Copag", "Jogos de Cartas"],
  Diversos: [
    "Acessórios",
    "Acessórios Celular",
    "Adesivos Times",
    "Chaveiros",
    "Diversos",
    "Guarda-Chuvas",
    "Mochilas",
    "Outros",
    "Papelaria",
    "Utilidades",
    "Figurinhas",
  ],
  Eletrônicos: ["Caixas de Som", "Fones de Ouvido", "Informática", "Pilhas", "Eletrônicos"],
  "Pokémon": ["Cards Pokémon", "Fichários Pokémon"],
  Tabacaria: [
    "Boladores",
    "Carvão Narguile",
    "Charutos e Cigarrilhas",
    "Cigarros",
    "Essências",
    "Filtros",
    "Incensos",
    "Isqueiros",
    "Palheiros",
    "Piteiras",
    "Porta Cigarros",
    "Seda OCB",
    "Tabaco e Seda",
    "Tabacos Importados",
    "Trituradores",
  ],
};

type SidebarMenuSubcategory = {
  name: string;
  href: string;
};

type SidebarMenuNode = {
  name: string;
  link: string;
  subcategories: SidebarMenuSubcategory[];
  order?: number;
};

const HIDDEN_TOP_DUPLICATE_CATEGORIES = new Set(
  ["50", "60"].map((value) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
  )
);

const isHiddenTopDuplicateCategory = (name: string): boolean => {
  const normalized = String(name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
  return HIDDEN_TOP_DUPLICATE_CATEGORIES.has(normalized);
};

// Tipos para produtos e bancas (dados vêm do Supabase)
export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
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

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function normalizeCategoryKey(value: string): string {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

const CATEGORY_ALIASES: Record<string, string> = {
  "disney comics": "disney",
  "marvel comics": "marvel",
  "planet manga": "mangas",
  "manga": "mangas",
};

function canonicalCategory(value: string): string {
  const normalized = normalizeCategoryKey(value);
  return CATEGORY_ALIASES[normalized] || normalized;
}

function buildCategoryRoute(categoryName: string, subcategoryName?: string) {
  const rootPath = `/categorias/${slugify(categoryName || "categoria")}`;
  if (!subcategoryName) return rootPath;
  return `${rootPath}?sub=${encodeURIComponent(slugify(subcategoryName))}`;
}

function ProductCard({ p, km }: { p: Product; km: number | null }) {
  // Extrair código do produto (ID sem UUID da banca se for composto)
  const productCode = p.id.includes('-') ? p.id.split('-')[0] : p.id;
  const productHref = buildPublicProductPath(p.name, p.vendor, p.id) as Route;
  
  return (
    <Link 
      href={productHref}
      className="block rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
    >
      <div className="relative h-40 sm:h-44 lg:h-36 w-full group">
        <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        {/* Efeito hover sutil sobre a imagem */}
        <div className="pointer-events-none absolute inset-0 rounded-[14px] bg-black/0 group-hover:bg-black/5 transition" />
      </div>
      <div className="p-3">
        <div className="text-[13px] font-semibold line-clamp-1">{p.name}</div>
        {/* Código do produto */}
        <div className="text-[10px] text-gray-400 mt-0.5">Cód: {productCode.substring(0, 8)}</div>
        <div className="mt-1 flex items-center justify-between">
          <Stars value={p.rating ?? 5} />
          <span className="text-[11px] text-gray-500">{p.reviews ?? 0} avaliações</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[#ff5c00] font-extrabold">R$ {p.price.toFixed(2)}</span>
          <DistancePill km={km} />
        </div>
        <div className="mt-2 flex items-center gap-2 min-w-0">
          <div className="h-6 w-6 rounded-full overflow-hidden flex-shrink-0">
            <img src={p.vendorAvatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"} alt={p.vendor} className="h-full w-full object-cover" loading="lazy" />
          </div>
          <span className="text-[12px] text-gray-700 font-medium truncate">{p.vendor}</span>
        </div>
      </div>
    </Link>
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
        <img src={b.cover} alt={b.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
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
            <img src={b.avatar || "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=200&auto=format&fit=crop"} alt={b.name} className="h-full w-full object-cover rounded-full" loading="lazy" />
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
            <img src="https://cdn-icons-png.flaticon.com/128/2875/2875433.png" alt="Mapa" className="h-3.5 w-3.5 rounded-full object-contain" loading="lazy" />
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
  sub?: string;
  title: string;
  initialCategories?: Array<{ id: string; name: string; link?: string; image?: string }>;
};

export default function CategoryResultsClient({ slug, sub, title, initialCategories }: CategoryResultsClientProps) {
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
  const [sidebarMenuNodes, setSidebarMenuNodes] = useState<SidebarMenuNode[]>([]);
  
  // Paginação de produtos
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 48;

  // Estado da categoria ativa e sanfonas
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());

  const toggleAccordion = (name: string) => {
    setOpenAccordions((prev) => {
      if (prev.has(name)) return new Set();
      return new Set([name]);
    });
  };

  const effectiveSidebarMenu = useMemo<SidebarMenuNode[]>(
    () => sidebarMenuNodes,
    [sidebarMenuNodes]
  );

  const knownSubcategories = useMemo(() => {
    const fromMenu = effectiveSidebarMenu.flatMap((node) =>
      node.subcategories.map((subcategory) => subcategory.name)
    );
    if (fromMenu.length > 0) return Array.from(new Set(fromMenu));
    return Array.from(new Set(Object.values(FALLBACK_CATEGORY_GROUPS).flat()));
  }, [effectiveSidebarMenu]);

  const knownRootCategories = useMemo(() => {
    const fromMenu = effectiveSidebarMenu.map((node) => node.name);
    if (fromMenu.length > 0) return Array.from(new Set(fromMenu));
    return Object.keys(FALLBACK_CATEGORY_GROUPS);
  }, [effectiveSidebarMenu]);

  const resolveCategoryForItem = useCallback((item: any): string => {
    const explicitCategory =
      (typeof item?.category_name === "string" && item.category_name.trim()) ||
      (typeof item?.category === "string" && item.category.trim()) ||
      "";

    const normalizedSlug = normalizeCategoryKey((slug || "").replace(/-/g, " "));
    const normalizedSub = normalizeCategoryKey((sub || "").replace(/-/g, " "));
    const slugIsRootCategory = knownRootCategories.some(
      (candidate) => normalizeCategoryKey(candidate) === normalizedSlug
    );

    const routeSubcategoryHint = normalizedSub || (!slugIsRootCategory ? normalizedSlug : "");
    if (routeSubcategoryHint) {
      const exactByHint = knownSubcategories.find(
        (candidate) => normalizeCategoryKey(candidate) === routeSubcategoryHint
      );
      if (exactByHint) return exactByHint;
    }

    const productName = normalizeCategoryKey(item?.name || "");
    if (productName) {
      const byName = [...knownSubcategories]
        .sort((a, b) => b.length - a.length)
        .find((candidate) => productName.includes(normalizeCategoryKey(candidate)));
      if (byName) return byName;
    }

    if (explicitCategory) {
      const exactByExplicit = knownSubcategories.find(
        (candidate) => normalizeCategoryKey(candidate) === normalizeCategoryKey(explicitCategory)
      );
      if (exactByExplicit) return exactByExplicit;
      return explicitCategory;
    }

    const normalizedHint = normalizeCategoryKey(((sub || slug) || "").replace(/-/g, " "));
    if (normalizedHint) {
      const fallbackByHint = knownSubcategories.find(
        (candidate) => normalizeCategoryKey(candidate) === normalizedHint
      );
      if (fallbackByHint) return fallbackByHint;
    }

    return "";
  }, [knownRootCategories, knownSubcategories, slug, sub]);

  // Extrair categorias únicas dos produtos (usa products não filtrados para mostrar todas as categorias)
  const allCategories = useMemo(() => {
    const categorySet = new Set<string>();
    for (const p of products) {
      // Tentar extrair categoria do produto (pode vir do nome da categoria ou ID)
      if ((p as any).category && typeof (p as any).category === 'string') {
        categorySet.add((p as any).category.trim());
      }
    }
    return Array.from(categorySet).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [products]);

  // Separar categorias em grupos e avulsas
  const { groupedCategories, standaloneCategories } = useMemo(() => {
    if (effectiveSidebarMenu.length > 0) {
      const grouped: Record<string, string[]> = {};
      const standalone: string[] = [];

      for (const node of effectiveSidebarMenu) {
        if (isHiddenTopDuplicateCategory(node.name)) continue;
        const uniqueSubs = Array.from(
          new Set(
            (node.subcategories || [])
              .map((sub) => String(sub?.name || "").trim())
              .filter(Boolean)
          )
        );
        if (uniqueSubs.length > 0) {
          grouped[node.name] = uniqueSubs;
        } else {
          standalone.push(node.name);
        }
      }

      return { groupedCategories: grouped, standaloneCategories: standalone };
    }

    const allSubcats = new Set<string>();
    const groupNames = new Set(Object.keys(FALLBACK_CATEGORY_GROUPS));
    Object.values(FALLBACK_CATEGORY_GROUPS).forEach(subs => subs.forEach(s => allSubcats.add(s)));
    
    const grouped: Record<string, string[]> = {};
    const standalone: string[] = [];
    
    // Para cada grupo, verificar quais subcategorias existem nos produtos
    for (const [groupName, subcats] of Object.entries(FALLBACK_CATEGORY_GROUPS)) {
      const existingSubs = subcats.filter(s => allCategories.includes(s));
      if (existingSubs.length > 0) {
        grouped[groupName] = existingSubs.sort((a, b) => a.localeCompare(b, 'pt-BR'));
      }
    }
    
    // Categorias que não pertencem a nenhum grupo
    for (const cat of allCategories) {
      if (!allSubcats.has(cat) && !groupNames.has(cat)) {
        standalone.push(cat);
      }
    }
    
    return { groupedCategories: grouped, standaloneCategories: standalone.sort((a, b) => a.localeCompare(b, 'pt-BR')) };
  }, [allCategories, effectiveSidebarMenu]);

  const orderedSidebarItems = useMemo(() => {
    const groupedMap = new Map<string, string[]>(Object.entries(groupedCategories));
    const standaloneSet = new Set(standaloneCategories);

    if (effectiveSidebarMenu.length === 0) {
      return [
        ...Array.from(groupedMap.entries()).map(([name, subcats]) => ({
          type: "group" as const,
          name,
          href: buildCategoryRoute(name),
          subcats: subcats.map((subcat) => ({
            name: subcat,
            href: buildCategoryRoute(name, subcat),
          })),
        })),
        ...standaloneCategories.map((name) => ({
          type: "standalone" as const,
          name,
          href: buildCategoryRoute(name),
        })),
      ];
    }

    const orderedItems: Array<
      | { type: "group"; name: string; href: string; subcats: SidebarMenuSubcategory[] }
      | { type: "standalone"; name: string; href: string }
    > = [];
    const usedGroups = new Set<string>();
    const usedStandalone = new Set<string>();

    for (const node of effectiveSidebarMenu) {
      const name = String(node.name || "").trim();
      if (!name || isHiddenTopDuplicateCategory(name)) continue;

      if (groupedMap.has(name) && !usedGroups.has(name)) {
        usedGroups.add(name);
        orderedItems.push({
          type: "group",
          name,
          href: node.link || buildCategoryRoute(name),
          subcats: node.subcategories || [],
        });
        continue;
      }

      if (standaloneSet.has(name) && !usedStandalone.has(name)) {
        usedStandalone.add(name);
        orderedItems.push({ type: "standalone", name, href: node.link || buildCategoryRoute(name) });
      }
    }

    for (const [name, subcats] of groupedMap.entries()) {
      if (!usedGroups.has(name)) {
        orderedItems.push({
          type: "group",
          name,
          href: buildCategoryRoute(name),
          subcats: subcats.map((subcat) => ({
            name: subcat,
            href: buildCategoryRoute(name, subcat),
          })),
        });
      }
    }

    for (const name of standaloneCategories) {
      if (!usedStandalone.has(name)) {
        orderedItems.push({ type: "standalone", name, href: buildCategoryRoute(name) });
      }
    }

    return orderedItems;
  }, [groupedCategories, standaloneCategories, effectiveSidebarMenu]);

  const sidebarCategoryOptions = useMemo(() => {
    const options = orderedSidebarItems.flatMap((item) =>
      item.type === "group"
        ? item.subcats.map((subcat) => ({ name: subcat.name, href: subcat.href }))
        : [{ name: item.name, href: item.href }]
    );
    const unique = new Map<string, { name: string; href: string }>();
    for (const option of options) {
      const key = String(option.name || "").trim();
      if (!key || unique.has(key)) continue;
      unique.set(key, option);
    }
    return Array.from(unique.values());
  }, [orderedSidebarItems]);

  // Auto-abrir a sanfona da categoria buscada baseado no slug/sub, com match exato de slug
  useEffect(() => {
    const target = (sub || slug || "").trim();
    const targetSlug = slugify(target);

    if (!targetSlug) {
      setOpenAccordions(new Set());
      setActiveCategory("Todos");
      return;
    }

    for (const [groupName, subcats] of Object.entries(groupedCategories)) {
      if (slugify(groupName) === targetSlug) {
        setOpenAccordions(new Set([groupName]));
        setActiveCategory("Todos");
        return;
      }

      const matchedSub = subcats.find((subcat) => slugify(subcat) === targetSlug);
      if (matchedSub) {
        setOpenAccordions(new Set([groupName]));
        setActiveCategory(matchedSub);
        return;
      }
    }

    // Se não houver correspondência clara no agrupamento, não força filtro local.
    setOpenAccordions(new Set());
    setActiveCategory("Todos");
  }, [slug, sub, groupedCategories]);

  const currentRootHref = useMemo(() => {
    const currentRoot = orderedSidebarItems.find(
      (item) => slugify(item.name) === slugify(slug)
    );
    return currentRoot?.href || `/categorias/${slug}`;
  }, [orderedSidebarItems, slug]);

  const sidebarCardItems = useMemo(
    () =>
      orderedSidebarItems.map((item) => {
        if (item.type === "group") {
          return {
            type: "group" as const,
            label: item.name,
            active: slugify(item.name) === slugify(slug),
            href: item.href,
            expanded: openAccordions.has(item.name),
            onToggle: () => toggleAccordion(item.name),
            children: item.subcats.map((subcat) => ({
              label: subcat.name,
              href: subcat.href,
              active: slugify(subcat.name) === slugify(sub || ""),
            })),
          };
        }

        return {
          type: "standalone" as const,
          label: item.name,
          href: item.href,
          active: !sub && slugify(item.name) === slugify(slug),
        };
      }),
    [openAccordions, orderedSidebarItems, slug, sub]
  );

  // Reset da página ao trocar de categoria
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  useEffect(() => {
    setMounted(true);
    setLoc(loadStoredLocation());
  }, []);

  useEffect(() => {
    let mountedRef = true;

    async function loadSidebarCategories() {
      try {
        const res = await fetch('/api/categories?menu_version=20260305-sidebar', { cache: 'no-store' });
        if (!res.ok) return;

        const json = await res.json();
        const tree = Array.isArray(json?.tree) ? json.tree : [];
        if (!mountedRef || tree.length === 0) return;

        const mapped: SidebarMenuNode[] = tree
          .map((root: any) => ({
            name: String(root?.name || '').trim(),
            link: String(root?.link || buildCategoryRoute(String(root?.name || '').trim())),
            subcategories: Array.from(
              new Map(
                (Array.isArray(root?.subcategories) ? root.subcategories : [])
                  .map((subItem: any) => {
                    const subName = String(subItem?.name || '').trim();
                    const subLink = String(
                      subItem?.link || buildCategoryRoute(String(root?.name || '').trim(), subName)
                    );
                    if (!subName) return null;
                    return [subName, { name: subName, href: subLink }];
                  })
                  .filter(Boolean) as Array<[string, SidebarMenuSubcategory]>
              ).values()
            ),
            order: typeof root?.order === "number" ? root.order : undefined,
          }))
          .filter((node: SidebarMenuNode) => node.name);

        if (mapped.length > 0) {
          mapped.sort((a, b) => {
            const orderA = typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
            const orderB = typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
            if (orderA !== orderB) return orderA - orderB;
            return a.name.localeCompare(b.name, "pt-BR");
          });
          setSidebarMenuNodes(mapped);
        }
      } catch {
        // fallback estático
      }
    }

    loadSidebarCategories();
    return () => {
      mountedRef = false;
    };
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
        // SEMPRE usar categoryName para passar pelo mapeamento de subcategorias
        // Se tiver sub, passar como parâmetro para filtrar subcategoria específica
        if (categoryId || slug) {
          const subParam = sub ? `&sub=${encodeURIComponent(sub)}` : '';
          const productsRes = await fetch(`/api/products/public?categoryName=${encodeURIComponent(slug)}${subParam}&limit=500`);
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
            
            // Buscar TODAS as bancas ativas para associar produtos de distribuidor
            // (não apenas cotistas, pois todas as bancas podem vender produtos de distribuidor)
            const todasBancasAtivas = Array.from(bancasMap.values())
              .filter((banca: any) => banca.active !== false);
            
            // Verificar se há produtos de distribuidor (sem banca_id)
            const hasDistribuidorProducts = productsArray.some((p: any) => p.distribuidor_id && !p.banca_id);
            
            // Mapear produtos com informações da banca
            const mappedProducts: Product[] = [];
            
              productsArray
              .filter((item: any) => item.active !== false)
              .forEach((item: any) => {
                const productImage =
                  item.image ||
                  (Array.isArray(item.images) && item.images.length > 0
                    ? item.images[0]
                    : "https://placehold.co/400x400/e5e7eb/666666?text=Sem+Imagem");

                if (item.banca_id) {
                  // Produto com banca específica
                  const banca = bancasMap.get(item.banca_id);
                  mappedProducts.push({
                    id: item.id,
                    name: item.name || 'Produto',
                    price: Number(item.price || 0),
                    image: productImage,
                    category: resolveCategoryForItem(item),
                    vendor: banca?.name || 'Banca',
                    vendorAvatar: banca?.avatar || banca?.cover_image || '',
                    lat: banca?.lat || -23.5505,
                    lng: banca?.lng || -46.6333,
                    rating: item.rating_avg || 5,
                    reviews: item.reviews_count || 0,
                    ready: Boolean(item.pronta_entrega),
                    bancaId: item.banca_id,
                    phone: banca?.contact?.whatsapp || banca?.whatsapp || banca?.phone || banca?.telefone || banca?.whatsapp_phone,
                  });
                } else if (item.distribuidor_id && todasBancasAtivas.length > 0) {
                  // Produto de distribuidor - criar uma instância para cada banca ativa elegível
                  todasBancasAtivas.forEach((banca: any) => {
                    mappedProducts.push({
                      id: `${item.id}-${banca.id}`,
                      name: item.name || 'Produto',
                      price: Number(item.price || 0),
                      image: productImage,
                      category: resolveCategoryForItem(item),
                      vendor: banca.name || 'Banca',
                      vendorAvatar: banca.avatar || banca.cover_image || '',
                      lat: banca.lat || -23.5505,
                      lng: banca.lng || -46.6333,
                      rating: item.rating_avg || 5,
                      reviews: item.reviews_count || 0,
                      ready: Boolean(item.pronta_entrega),
                      bancaId: banca.id,
                      phone: banca.contact?.whatsapp || banca.whatsapp || banca.phone || banca.telefone || banca.whatsapp_phone,
                    });
                  });
                }
              });
            
            setProducts(mappedProducts);
            console.log(`[CategoryResults] Produtos mapeados (com bancas elegiveis): ${mappedProducts.length}`);
            
            // 3. Buscar bancas que possuem produtos dessa categoria
            const uniqueBancaIds = new Set<string>(productsArray.map((p: any) => p.banca_id).filter(Boolean));
            
            let allBancasToShow: any[] = [];
            
            if (hasDistribuidorProducts) {
              // Se ha produtos de distribuidor, mostrar todas as bancas ativas elegiveis
              console.log(`[CategoryResults] Produtos de distribuidor detectados - mostrando todas bancas ativas elegiveis`);
              allBancasToShow = todasBancasAtivas;
            } else {
              // Apenas bancas que têm produtos próprios dessa categoria
              allBancasToShow = Array.from(uniqueBancaIds)
                .map((bancaId: string) => bancasMap.get(bancaId))
                .filter(Boolean)
                .filter((banca: any) => banca.active !== false);
            }
            
            const mappedBancas: Banca[] = allBancasToShow.map((banca: any) => {
              const productsCount = productsArray.filter((p: any) => p.banca_id === banca.id).length;
              const totalCount = productsCount > 0 ? productsCount : productsArray.filter((p: any) => p.distribuidor_id).length;
              
              return {
                id: banca.id,
                name: banca.name || 'Banca',
                cover: banca.cover_image || banca.cover || '',
                avatar: banca.avatar || banca.cover_image || '',
                lat: banca.lat || -23.5505,
                lng: banca.lng || -46.6333,
                itemsCount: totalCount,
                rating: 4.5,
                reviews: 0,
                open: true,
              };
            });
            
            setBancas(mappedBancas);
            console.log(`[CategoryResults] Bancas mapeadas: ${mappedBancas.length}`);
          }
        } else {
          console.log('[CategoryResults] Categoria não encontrada - buscando por nome do slug');
          // Tentar buscar produtos pelo nome da categoria (slug)
          const productsRes = await fetch(`/api/products/public?categoryName=${encodeURIComponent(slug)}&limit=500`);
          if (productsRes.ok) {
            const productsData = await productsRes.json();
            const productsArray = Array.isArray(productsData?.items) ? productsData.items : (Array.isArray(productsData?.data) ? productsData.data : []);
            
            if (productsArray.length > 0) {
              console.log(`[CategoryResults] Produtos encontrados por nome: ${productsArray.length}`);
              
              const bancasMap = new Map<string, any>();
              const bancasRes = await fetch('/api/bancas');
              if (bancasRes.ok) {
                const bancasData = await bancasRes.json();
                const bancasArray = Array.isArray(bancasData?.data) ? bancasData.data : (Array.isArray(bancasData) ? bancasData : []);
                bancasArray.forEach((banca: any) => {
                  bancasMap.set(banca.id, banca);
                });
              }
              
              // Buscar TODAS as bancas ativas para associar produtos de distribuidor
              const todasBancasAtivas = Array.from(bancasMap.values())
                .filter((banca: any) => banca.active !== false);
              
              const mappedProducts: Product[] = [];
              
              productsArray
                .filter((item: any) => item.active !== false)
                .forEach((item: any) => {
                  const productImage =
                    item.image ||
                    (Array.isArray(item.images) && item.images.length > 0
                      ? item.images[0]
                      : "https://placehold.co/400x400/e5e7eb/666666?text=Sem+Imagem");

                  if (item.banca_id) {
                    // Produto com banca específica
                    const banca = bancasMap.get(item.banca_id);
                    mappedProducts.push({
                      id: item.id,
                      name: item.name || 'Produto',
                      price: Number(item.price || 0),
                      image: productImage,
                      category: resolveCategoryForItem(item),
                      vendor: banca?.name || 'Banca',
                      vendorAvatar: banca?.avatar || banca?.cover_image || '',
                      lat: banca?.lat || -23.5505,
                      lng: banca?.lng || -46.6333,
                      rating: item.rating_avg || 5,
                      reviews: item.reviews_count || 0,
                      ready: Boolean(item.pronta_entrega),
                      bancaId: item.banca_id,
                      phone: banca?.contact?.whatsapp || banca?.whatsapp || banca?.phone || banca?.telefone || banca?.whatsapp_phone,
                    });
                  } else if (item.distribuidor_id && todasBancasAtivas.length > 0) {
                    // Produto de distribuidor - criar uma instância para cada banca ativa elegível
                    todasBancasAtivas.forEach((banca: any) => {
                      mappedProducts.push({
                        id: `${item.id}-${banca.id}`, // ID único para cada combinação produto-banca
                        name: item.name || 'Produto',
                        price: Number(item.price || 0),
                        image: productImage,
                        category: resolveCategoryForItem(item),
                        vendor: banca.name || 'Banca',
                        vendorAvatar: banca.avatar || banca.cover_image || '',
                        lat: banca.lat || -23.5505,
                        lng: banca.lng || -46.6333,
                        rating: item.rating_avg || 5,
                        reviews: item.reviews_count || 0,
                        ready: Boolean(item.pronta_entrega),
                        bancaId: banca.id,
                        phone: banca.contact?.whatsapp || banca.whatsapp || banca.phone || banca.telefone || banca.whatsapp_phone,
                      });
                    });
                  }
                });
              
              console.log(`[CategoryResults] Produtos mapeados (com bancas elegiveis): ${mappedProducts.length}`);
              setProducts(mappedProducts);
              
              // Verificar se há produtos de distribuidor (sem banca_id)
              const hasDistribuidorProducts = productsArray.some((p: any) => p.distribuidor_id && !p.banca_id);
              const uniqueBancaIds = new Set<string>(productsArray.map((p: any) => p.banca_id).filter(Boolean));
              
              let allBancasToShow: any[] = [];
              
              if (hasDistribuidorProducts) {
                // Se ha produtos de distribuidor, mostrar todas as bancas ativas elegiveis
                console.log(`[CategoryResults] Produtos de distribuidor detectados - buscando todas bancas ativas elegiveis`);
                allBancasToShow = Array.from(bancasMap.values())
                  .filter((banca: any) => banca.active !== false);
                console.log(`[CategoryResults] Bancas ativas elegiveis encontradas: ${allBancasToShow.length}`);
              } else {
                // Apenas bancas que têm produtos próprios dessa categoria
                allBancasToShow = Array.from(uniqueBancaIds)
                  .map((bancaId: string) => bancasMap.get(bancaId))
                  .filter(Boolean)
                  .filter((banca: any) => banca.active !== false);
              }
              
              const mappedBancas: Banca[] = allBancasToShow.map((banca: any) => {
                const productsCount = productsArray.filter((p: any) => p.banca_id === banca.id).length;
                // Para bancas sem produto proprio na categoria, usar o volume de produtos de distribuidor
                const totalCount = productsCount > 0 ? productsCount : productsArray.filter((p: any) => p.distribuidor_id).length;
                return {
                  id: banca.id,
                  name: banca.name || 'Banca',
                  cover: banca.cover_image || banca.cover || '',
                  avatar: banca.avatar || banca.cover_image || '',
                  lat: banca.lat || -23.5505,
                  lng: banca.lng || -46.6333,
                  itemsCount: totalCount,
                  rating: 4.5,
                  reviews: 0,
                  open: true,
                };
              });
              
              setBancas(mappedBancas);
              console.log(`[CategoryResults] Bancas mapeadas (categoryName): ${mappedBancas.length}`);
            } else {
              console.log('[CategoryResults] Nenhum produto encontrado para esta categoria');
              setProducts([]);
              setBancas([]);
            }
          } else {
            setProducts([]);
            setBancas([]);
          }
        }
        
      } catch (error) {
        console.error('[CategoryResults] Erro ao buscar dados:', error);
        setProducts([]);
        setBancas([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug, sub, initialCategories]);

  const sortedProducts = useMemo(() => {
    const dataSource = products;

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

    const meetsCategory = (p: Product) => {
      if (activeCategory === 'Todos') return true;
      const pCategory = canonicalCategory(p.category || '');
      return pCategory === canonicalCategory(activeCategory);
    };

    if (!loc) {
      const filtered = dataSource.filter((p) => meetsStars(p.rating) && meetsPrice(p.price) && meetsCategory(p));
      return filtered.map((p) => ({ p, km: null as number | null }));
    }

    return [...dataSource]
      .map((p) => ({ p, km: haversineKm({ lat: loc.lat, lng: loc.lng }, { lat: p.lat, lng: p.lng }) }))
      .filter(({ p, km }) => withinKm(km) && meetsStars(p.rating) && meetsPrice(p.price) && meetsCategory(p))
      .sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity));
  }, [loc, products, prodMaxKm, prodMinStars, maxPriceFilter, activeCategory]);

  const maxAvailablePrice = useMemo(() => {
    const max = products.reduce((m, p) => Math.max(m, p.price || 0), 0);
    return max > 0 ? Math.ceil(max) : 500;
  }, [products]);

  const sortedBancas = useMemo(() => {
    const dataSource = bancas;
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
      
      {/* Carrossel de Categorias - sem initialItems para buscar da API com imagens */}
      <div className="mb-4">
        <CategoryCarousel />
      </div>
      
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
          {/* Layout Produtos: sidebar de categorias + lista de produtos */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6 items-start">
            {/* Sidebar de Categorias - Menu em Sanfona */}
            <aside className="hidden lg:block">
              <div className="sticky top-4">
                <CatalogSidebar
                  title="Categorias"
                  summary={
                    <>
                      Resultados:{" "}
                      <span className="font-semibold text-gray-700">{sortedProducts.length}</span>
                    </>
                  }
                  allItem={{
                    label: "Todos os Produtos",
                    href: currentRootHref,
                    active: !sub,
                  }}
                  items={sidebarCardItems}
                />

                {/* Filtros adicionais abaixo do menu de categorias */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Filtros</h3>
                  
                  {/* Filtro preço máximo */}
                  <div className="space-y-2 mb-4">
                    <div className="text-sm font-medium text-gray-700">Preço máximo</div>
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
                      <span className="text-xs text-gray-600 w-24 text-right">
                        {maxPriceFilter <= 0 ? 'Sem limite' : `Até R$ ${maxPriceFilter.toFixed(0)}`}
                      </span>
                    </div>
                  </div>

                  {/* Filtro distância */}
                  <div className="space-y-2 mb-4">
                    <div className="text-sm font-medium text-gray-700">Distância</div>
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
                      <span className="text-xs text-gray-600 w-12 text-right">{prodMaxKm>=5? '5+Km' : `${prodMaxKm.toFixed(1)}Km`}</span>
                    </div>
                  </div>

                  {/* Filtro avaliação */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Avaliação</div>
                    <div className="flex flex-wrap gap-1.5">
                      {[0,1,2,3,4,5].map((n)=> (
                        <button
                          key={n}
                          type="button"
                          onClick={()=>setProdMinStars(n)}
                          className={`h-7 px-2 rounded-md border text-xs ${prodMinStars===n? 'bg-[#fff3ec] border-[#ffd7bd] text-[#ff5c00]' : 'bg-white border-gray-300 text-gray-700'}`}
                        >
                          {n===0? 'Qualquer' : `${n}+★`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Lista de produtos */}
            <div className="min-w-0">
              {/* Barra de chips mobile (categorias) - visível apenas em telas menores */}
              <div className="lg:hidden mb-4 sticky top-[60px] z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-100 -mx-4 px-4 py-2 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-500">Categorias ({sortedProducts.length} produtos)</div>
                  {sub && (
                    <Link
                      href={currentRootHref as Route}
                      className="text-xs font-medium text-[#ff5c00] hover:underline"
                    >
                      Limpar filtro
                    </Link>
                  )}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  <Link
                    href={currentRootHref as Route}
                    className={`whitespace-nowrap shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      !sub
                        ? 'border-[#ff5c00] bg-[#ff5c00] text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Todos
                  </Link>
                  {sidebarCategoryOptions.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href as Route}
                      className={`whitespace-nowrap shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        slugify(cat.name) === slugify(sub || slug)
                          ? 'border-[#ff5c00] bg-[#ff5c00] text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

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
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                    {sortedProducts
                      .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                      .map(({ p, km }) => (
                        <ProductCard key={p.id} p={p} km={km} />
                      ))}
                  </div>
                  
                  {/* Paginação */}
                  {sortedProducts.length > ITEMS_PER_PAGE && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Anterior
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.ceil(sortedProducts.length / ITEMS_PER_PAGE) }).map((_, i) => {
                          const page = i + 1;
                          const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
                          // Mostrar apenas páginas próximas da atual
                          if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                                  currentPage === page
                                    ? 'bg-[#ff5c00] text-white'
                                    : 'border border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="px-1">...</span>;
                          }
                          return null;
                        })}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(sortedProducts.length / ITEMS_PER_PAGE), p + 1))}
                        disabled={currentPage >= Math.ceil(sortedProducts.length / ITEMS_PER_PAGE)}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Próxima
                      </button>
                      
                      <span className="ml-4 text-sm text-gray-500">
                        Página {currentPage} de {Math.ceil(sortedProducts.length / ITEMS_PER_PAGE)}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <style jsx>{`
            .range-orange::-webkit-slider-runnable-track{background:#ffe2d2;height:6px;border-radius:9999px}
            .range-orange::-moz-range-track{background:#ffe2d2;height:6px;border-radius:9999px}
            .range-orange::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:16px;height:16px;background:#ff5c00;border-radius:9999px;margin-top:-5px;border:2px solid #fff;box-shadow:0 0 0 1px #ffd7bd}
            .range-orange::-moz-range-thumb{width:16px;height:16px;background:#ff5c00;border:2px solid #fff;border-radius:9999px;box-shadow:0 0 0 1px #ffd7bd}
            .no-scrollbar::-webkit-scrollbar{display:none}
            .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
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

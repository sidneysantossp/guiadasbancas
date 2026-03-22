"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { categoryMenu as fallbackCategoryMenu } from "./categoryMenuData";
import {
  IconBallpen,
  IconBook2,
  IconBottle,
  IconCards,
  IconCategory2,
  IconDeviceLaptop,
  IconDog,
  IconGift,
  IconNews,
  IconPuzzle,
  IconSmoking,
  IconTag,
} from "@tabler/icons-react";

type MenuSubcategory = {
  id: string;
  name: string;
  slug: string;
  link: string;
};

type MenuCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  link: string;
  order: number;
  subcategories: MenuSubcategory[];
};

interface CategoryBarProps {
  visible?: boolean;
}

type IconKey =
  | "drink"
  | "smoke"
  | "collectible"
  | "news"
  | "books"
  | "candy"
  | "stationery"
  | "cards"
  | "toys"
  | "electronics"
  | "pet"
  | "promo"
  | "default";

const ICON_KEYS = new Set<IconKey>([
  "drink",
  "smoke",
  "collectible",
  "news",
  "books",
  "candy",
  "stationery",
  "cards",
  "toys",
  "electronics",
  "pet",
  "promo",
  "default",
]);

const LEGACY_ICON_MAP: Record<string, IconKey> = {
  "🍺": "drink",
  "🚬": "smoke",
  "⚽": "collectible",
  "📰": "news",
  "📚": "books",
  "🍫": "candy",
  "✏️": "stationery",
  "🎮": "cards",
  "🧸": "toys",
  "🔌": "electronics",
  "🐶": "pet",
  "🏷️": "promo",
  "📦": "default",
};

const ICON_RULES: Array<{ pattern: RegExp; icon: IconKey }> = [
  { pattern: /(bebida|energet|suco|agua|refriger|cervej|vinho|cafe|cha)/i, icon: "drink" },
  { pattern: /(tabac|cigar|charut|nargu|essenc|isqueir|palheiro|incenso|seda)/i, icon: "smoke" },
  { pattern: /(revista|jornal|magazin)/i, icon: "news" },
  { pattern: /(papelaria|caneta|caderno|escritorio)/i, icon: "stationery" },
  { pattern: /(carta|card|jogo|pokemon|baralho)/i, icon: "cards" },
  { pattern: /(brinquedo|pelucia|massinha|carrinho)/i, icon: "toys" },
  { pattern: /(eletron|fone|caixa de som|informatic|pilha|celular|acessorio)/i, icon: "electronics" },
  { pattern: /(pet|cao|cachorro|gato)/i, icon: "pet" },
  { pattern: /(promoc|oferta|desconto)/i, icon: "promo" },
  { pattern: /(snack|doce|chocol|bala|chiclete|bombon|bomboniere|salgad)/i, icon: "candy" },
  { pattern: /(livro|book)/i, icon: "books" },
  { pattern: /(panini|figurinh|album|colecion|comics|manga|hq|marvel|dc|disney|conan)/i, icon: "collectible" },
];

function slugify(value: string): string {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function iconForCategory(name: string): IconKey {
  for (const rule of ICON_RULES) {
    if (rule.pattern.test(name || "")) return rule.icon;
  }
  return "default";
}

function resolveIconKey(rawIcon: unknown, categoryName: string): IconKey {
  if (typeof rawIcon === "string" && rawIcon.trim()) {
    const normalizedRaw = rawIcon.trim();
    const normalizedLower = normalizedRaw.toLowerCase();
    if (ICON_KEYS.has(normalizedLower as IconKey)) {
      return normalizedLower as IconKey;
    }
    if (LEGACY_ICON_MAP[normalizedRaw]) return LEGACY_ICON_MAP[normalizedRaw];
    if (LEGACY_ICON_MAP[normalizedLower]) return LEGACY_ICON_MAP[normalizedLower];
  }
  return iconForCategory(categoryName);
}

function CategoryIcon({
  icon,
  name,
  className = "h-4 w-4 text-current",
}: {
  icon?: string;
  name: string;
  className?: string;
}) {
  const iconKey = resolveIconKey(icon, name);
  const props = { stroke: 1.8, className };

  switch (iconKey) {
    case "drink":
      return <IconBottle {...props} />;
    case "smoke":
      return <IconSmoking {...props} />;
    case "news":
      return <IconNews {...props} />;
    case "books":
      return <IconBook2 {...props} />;
    case "candy":
      return <IconGift {...props} />;
    case "stationery":
      return <IconBallpen {...props} />;
    case "cards":
      return <IconCards {...props} />;
    case "toys":
      return <IconPuzzle {...props} />;
    case "electronics":
      return <IconDeviceLaptop {...props} />;
    case "pet":
      return <IconDog {...props} />;
    case "promo":
      return <IconTag {...props} />;
    case "collectible":
      return <IconCards {...props} />;
    case "default":
    default:
      return <IconCategory2 {...props} />;
  }
}

function resolveLink(name: string, link?: string): string {
  if (typeof link === "string") {
    const normalized = link.trim();
    if (normalized.startsWith("/categorias")) return normalized;
    if (normalized.startsWith("/categoria/")) {
      return normalized.replace("/categoria/", "/categorias/");
    }
    if (normalized.startsWith("/")) return normalized;
  }
  return `/categorias/${slugify(name) || "categoria"}`;
}

function toFallbackMenu(): MenuCategory[] {
  return fallbackCategoryMenu.map((category, index) => ({
    id: `fallback-${category.slug}-${index}`,
    name: category.name,
    slug: category.slug || slugify(category.name),
    icon: resolveIconKey(category.icon, category.name),
    link: `/categorias/${category.slug}`,
    order: index,
    subcategories: (category.subcategories || []).map((subcategory, subIndex) => ({
      id: `fallback-${category.slug}-${subcategory.slug}-${subIndex}`,
      name: subcategory.name,
      slug: subcategory.slug || slugify(subcategory.name),
      link: `/categorias/${subcategory.slug || slugify(subcategory.name)}`,
    })),
  }));
}

function normalizeMenuTree(rawTree: any[]): MenuCategory[] {
  const parsed = (Array.isArray(rawTree) ? rawTree : [])
    .map((raw, index) => {
      const name = (raw?.name || "").toString().trim();
      if (!name) return null;

      const id = (raw?.id || `${slugify(name)}-${index}`).toString();
      const slug = (raw?.slug || slugify(name) || id).toString();
      const link = resolveLink(name, raw?.link);
      const subcategories = (Array.isArray(raw?.subcategories) ? raw.subcategories : [])
        .map((sub: any, subIndex: number) => {
          const subName = (sub?.name || "").toString().trim();
          if (!subName) return null;
          const subId = (sub?.id || `${id}-sub-${subIndex}`).toString();
          const subSlug = (sub?.slug || slugify(subName) || subId).toString();
          return {
            id: subId,
            name: subName,
            slug: subSlug,
            link: resolveLink(subName, sub?.link),
          } as MenuSubcategory;
        })
        .filter(Boolean) as MenuSubcategory[];

      return {
        id,
        name,
        slug,
        icon: resolveIconKey(raw?.icon, name),
        link,
        order: typeof raw?.order === "number" ? raw.order : index,
        subcategories,
      } as MenuCategory;
    })
    .filter(Boolean) as MenuCategory[];

  const mergedByName = new Map<string, MenuCategory>();

  for (const category of parsed) {
    const categoryKey = slugify(category.name) || category.id;
    const existing = mergedByName.get(categoryKey);

    if (!existing) {
      mergedByName.set(categoryKey, {
        ...category,
        subcategories: [...category.subcategories],
      });
      continue;
    }

    if (category.subcategories.length > existing.subcategories.length) {
      existing.icon = category.icon;
      existing.link = category.link;
    }

    existing.order = Math.min(existing.order, category.order);

    const subByName = new Map<string, MenuSubcategory>();
    for (const subcategory of existing.subcategories) {
      subByName.set(slugify(subcategory.name) || subcategory.id, subcategory);
    }
    for (const subcategory of category.subcategories) {
      const subKey = slugify(subcategory.name) || subcategory.id;
      if (!subByName.has(subKey)) {
        subByName.set(subKey, subcategory);
      }
    }
    existing.subcategories = Array.from(subByName.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "pt-BR")
    );
  }

  const normalized = Array.from(mergedByName.values());

  normalized.sort((a, b) => {
    const byChildren = b.subcategories.length - a.subcategories.length;
    if (byChildren !== 0) return byChildren;
    if (a.order !== b.order) return a.order - b.order;
    return a.name.localeCompare(b.name, "pt-BR");
  });

  return normalized;
}

function dedupeSubcategories(items: MenuSubcategory[]): MenuSubcategory[] {
  const byKey = new Map<string, MenuSubcategory>();
  for (const item of items) {
    const key = slugify(item.name) || item.id;
    if (!byKey.has(key)) byKey.set(key, item);
  }
  return Array.from(byKey.values());
}

function prepareMegaMenu(items: MenuCategory[]): MenuCategory[] {
  if (!Array.isArray(items) || items.length === 0) return items;

  return items
    .map((category, index) => ({
      ...category,
      order: typeof category.order === "number" ? category.order : index,
      subcategories: dedupeSubcategories(
        (category.subcategories || []).filter((sub) => {
          const normalized = (sub.name || "").trim();
          return normalized.length > 0 && !/^\d+$/.test(normalized);
        })
      ),
    }))
    .sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.name.localeCompare(b.name, "pt-BR");
    });
}

const FALLBACK_MENU = prepareMegaMenu(toFallbackMenu());
const CURATED_SHORTCUT_SLUGS = fallbackCategoryMenu.map((category) => slugify(category.name));

function selectShortcutItems(items: MenuCategory[]): MenuCategory[] {
  if (!Array.isArray(items) || items.length === 0) return [];

  const bySlug = new Map(items.map((category) => [slugify(category.name), category]));
  const curated = CURATED_SHORTCUT_SLUGS.map((slug) => bySlug.get(slug)).filter(Boolean) as MenuCategory[];

  return curated.length > 0 ? curated : items.slice(0, 8);
}

export default function CategoryBar({ visible = true }: CategoryBarProps) {
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuCategory[]>(FALLBACK_MENU);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeMenuItems = menuItems.length > 0 ? menuItems : FALLBACK_MENU;
  const shortcutMenuItems = selectShortcutItems(activeMenuItems);

  const scheduleClose = useCallback(() => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => {
      setMenuOpen(false);
      setActiveIndex(null);
    }, 200);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  }, []);

  const handleCategoryHover = useCallback(
    (index: number) => {
      if (index < 0 || index >= activeMenuItems.length) return;
      cancelClose();
      setActiveIndex(index);
      setMenuOpen(true);
    },
    [activeMenuItems.length, cancelClose]
  );

  const handleBarEnter = useCallback(() => {
    cancelClose();
  }, [cancelClose]);

  const handleBarLeave = useCallback(() => {
    scheduleClose();
  }, [scheduleClose]);

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadRealCategories() {
      try {
        const response = await fetch("/api/categories?menu_version=20260305-2", { cache: "no-store" });
        if (!response.ok) return;
        const json = await response.json();
        const parsedTree = prepareMegaMenu(normalizeMenuTree(json?.tree || []));
        if (!mounted || parsedTree.length === 0) return;
        setMenuItems(parsedTree);
      } catch {
        // Mantém fallback estático em caso de erro de API
      }
    }

    loadRealCategories();
    return () => {
      mounted = false;
    };
  }, []);

  // Fecha o menu ao trocar para um índice inválido após atualizar categorias
  useEffect(() => {
    if (activeIndex === null) return;
    if (activeIndex >= activeMenuItems.length) {
      setActiveIndex(activeMenuItems.length > 0 ? 0 : null);
    }
  }, [activeIndex, activeMenuItems.length]);

  // Close on click outside
  useEffect(() => {
    if (!menuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setActiveIndex(null);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setActiveIndex(null);
      }
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [menuOpen]);

  if (!visible) return null;
  if (!isClientMounted) {
    return <div className="hidden md:block border-t border-gray-100 bg-white relative z-40" />;
  }

  const activeCategory: MenuCategory | null =
    activeIndex !== null ? activeMenuItems[activeIndex] || null : null;

  return (
    <div
      ref={barRef}
      className="hidden md:block border-t border-gray-100 bg-white relative z-40"
      onMouseEnter={handleBarEnter}
      onMouseLeave={handleBarLeave}
    >
      <div className="container-max">
        <nav className="flex items-center gap-0 text-sm overflow-x-auto scrollbar-hide">
          <button
            type="button"
            onMouseEnter={() => handleCategoryHover(0)}
            onClick={() => {
              if (menuOpen) {
                setMenuOpen(false);
                setActiveIndex(null);
              } else if (activeMenuItems.length > 0) {
                handleCategoryHover(0);
              }
            }}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-2.5 font-semibold transition-colors ${
              menuOpen
                ? "text-[#ff5c00] bg-orange-50"
                : "text-gray-800 hover:text-[#ff5c00]"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            Todas as Categorias
            <svg
              viewBox="0 0 24 24"
              className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <div className="h-5 w-px bg-gray-200" />

          {shortcutMenuItems.map((category) => (
            <Link
              key={category.id}
              href={category.link as any}
              className={`whitespace-nowrap px-3 py-2.5 font-medium transition-colors ${
                menuOpen && activeCategory?.id === category.id
                  ? "text-[#ff5c00]"
                  : "text-gray-600 hover:text-[#ff5c00]"
              }`}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>

      {menuOpen && (
        <div
          className="absolute left-1/2 top-full z-50 mt-2 w-[1080px] max-w-[96vw] -translate-x-1/2"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex min-h-[300px] max-h-[460px]">
              <div className="w-[250px] flex-shrink-0 border-r border-gray-100 py-3 overflow-y-auto">
                {activeMenuItems.map((category, index) => (
                  <button
                    key={category.id}
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => {
                      setMenuOpen(false);
                      setActiveIndex(null);
                      window.location.href = category.link;
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
                      activeIndex === index
                        ? "bg-orange-50 text-[#ff5c00] font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="w-6 text-center flex-shrink-0 inline-flex items-center justify-center">
                      <CategoryIcon icon={category.icon} name={category.name} />
                    </span>
                    <span>{category.name}</span>
                    <svg
                      viewBox="0 0 24 24"
                      className={`h-4 w-4 ml-auto flex-shrink-0 transition-opacity ${
                        activeIndex === index ? "opacity-100" : "opacity-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                ))}
              </div>

              <div className="flex-1 p-5 overflow-hidden">
                {activeCategory && (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-flex items-center justify-center rounded-md bg-gray-100 text-gray-600 h-7 w-7">
                        <CategoryIcon
                          icon={activeCategory.icon}
                          name={activeCategory.name}
                          className="h-4 w-4 text-gray-600"
                        />
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">
                        {activeCategory.name}
                      </h3>
                    </div>

                    {activeCategory.subcategories.length > 0 ? (
                      <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-1 max-h-[300px] overflow-y-auto pr-2">
                        {activeCategory.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory.id}
                            href={subcategory.link as any}
                            onClick={() => {
                              setMenuOpen(false);
                              setActiveIndex(null);
                            }}
                            className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#ff5c00] transition-colors"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                            {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                        Explore produtos desta categoria.
                      </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Link
                        href={activeCategory.link as any}
                        onClick={() => {
                          setMenuOpen(false);
                          setActiveIndex(null);
                        }}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-[#ff5c00] hover:underline"
                      >
                        Ver tudo em {activeCategory.name}
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 6l6 6-6 6" />
                        </svg>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

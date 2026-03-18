import { supabaseAdmin } from "@/lib/supabase";

type DistributorCategoryLookup = { id: string; nome: string };
type BancaCategoryLookup = { id: string; name: string };

type CategoryLookupCache = {
  allDistCats: DistributorCategoryLookup[];
  allBancaCats: BancaCategoryLookup[];
  expiresAt: number;
};

export interface PublicCatalogCategoryResolution {
  categoryId: string;
  categoryIds: string[];
  nameSearchTerms: string[];
  categoryNameById: Map<string, string>;
  includeDistribuidor: boolean;
}

const CATEGORY_LOOKUP_TTL_MS = 5 * 60 * 1000;

const SLUG_ALIASES: Record<string, string> = {
  cigarros: "tabacaria",
  snacks: "bomboniere",
  quadrinhos: "panini",
  jogos: "cartas",
  presentes: "diversos",
  acessorios: "diversos",
};

const CATEGORY_SUBCATEGORIES: Record<string, string[]> = {
  tabacaria: ["Boladores", "Carvão Narguile", "Charutos e Cigarrilhas", "Cigarros", "Essências", "Filtro", "Filtros", "Incensos", "Isqueiros", "Palheiros", "Piteira", "Piteiras", "Porta Cigarros", "Seda", "Seda OCB", "Tabaco", "Tabaco e Seda", "Tabacos Importados", "Trituradores"],
  bebidas: ["Energéticos", "Energético", "Bebidas", "Bebida", "Cerveja", "Cervejas", "Água", "Águas", "Refrigerantes", "Refrigerante", "Sucos", "Suco", "Isotônicos", "Isotônico"],
  bomboniere: ["Bala", "Bala Doce", "Balas e Drops", "Balas a Granel", "Biscoitos", "Chiclete", "Chicletes", "Chocolate", "Chocolates", "Doces", "Pirulito", "Pirulitos", "Salgados", "Salgadinhos", "Snacks"],
  brinquedos: ["Adesivos", "Blocos de Montar", "Bonecos", "Brinquedos", "Caminhão", "Carrinhos", "Educativos", "Esportivo", "Lança Bolhas", "Massinha", "Pelúcia", "Pelúcias", 'Tipo "Lego"', "Livros Infantis"],
  cartas: ["Baralhos", "Baralhos e Cards", "Cards Colecionáveis", "Cards Pokémon", "Jogos Copag", "Jogos de Cartas"],
  eletronicos: ["Acessórios para eletrônicos", "Adaptadores", "Cabo", "Caixa de som", "Caixas de Som", "Carregador com tomada", "Carregador Portátil", "Carregador veicular", "Fone", "Fone de ouvido", "Fones de Ouvido", "Informática", "Pilhas", "Eletrônicos"],
  informatica: ["Informática"],
  papelaria: ["Papelaria", "Adesivos", "Canetas", "Cadernos", "Material Escolar"],
  telefonia: ["Telefonia", "Chip Pré", "Capinha Para Celular", "Acessórios Celular"],
  diversos: ["Acessórios", "Acessórios Celular", "Adesivos Times", "Chaveiros", "Diversos", "Guarda-Chuvas", "Mochilas", "Outros", "Papelaria", "Utilidades", "Figurinhas"],
  pokemon: ["Cards Pokémon", "Fichários Pokémon"],
  panini: ["Colecionáveis", "Conan", "DC Comics", "Disney Comics", "Marvel Comics", "Maurício de Sousa Produções", "Panini Books", "Panini Comics", "Panini Magazines", "Panini Partwork", "Planet Manga", "HQs", "HQ", "Comics", "Quadrinhos", "Mangás", "Manga", "Graphic Novels", "Graphic Novel", "Revistas", "Gibis", "Gibi"],
  marvel: ["Marvel Comics", "Marvel", "Vingadores", "Avengers", "Homem-Aranha", "Spider-Man", "X-Men", "Deadpool", "Wolverine", "Thor", "Hulk", "Homem de Ferro", "Iron Man", "Capitão América", "Captain America"],
  manga: ["Planet Manga", "Mangá", "Mangás", "Manga", "Anime", "Naruto", "One Piece", "Dragon Ball", "Demon Slayer", "Jujutsu Kaisen", "My Hero Academia", "Attack on Titan", "Death Note", "Bleach", "Hunter x Hunter"],
  mauricio: ["Maurício de Sousa Produções", "Maurício de Sousa", "Turma da Mônica", "Mônica", "Cebolinha", "Cascão", "Magali", "Chico Bento", "Pelezinho", "Horácio", "Astronauta", "Piteco"],
};

const SUB_SLUG_TO_NAMES: Record<string, string[]> = {
  cigarros: ["Cigarros"],
  charutos: ["Charutos e Cigarrilhas", "Charutos"],
  tabaco: ["Tabaco e Seda", "Tabacos Importados", "Tabaco"],
  essencias: ["Essências"],
  narguile: ["Carvão Narguile", "Narguilé"],
  "seda-papel": ["Seda OCB", "Seda", "Papel"],
  seda: ["Seda", "Seda OCB"],
  filtro: ["Filtro", "Filtros"],
  isqueiros: ["Isqueiros"],
  piteira: ["Piteira", "Piteiras"],
  bebidas: ["Bebidas", "Bebida"],
  cerveja: ["Cerveja", "Cervejas"],
  refrigerante: ["Refrigerante", "Refrigerantes"],
  energetico: ["Energéticos", "Energético"],
  energeticos: ["Energéticos", "Energético"],
  agua: ["Água", "Águas"],
  suco: ["Suco", "Sucos"],
  destilados: ["Destilados"],
  vinho: ["Vinho", "Vinhos"],
  cafe: ["Café"],
  cha: ["Chá", "Chás"],
  bala: ["Bala", "Balas e Drops", "Balas a Granel"],
  "bala-doce": ["Bala Doce", "Bala"],
  chiclete: ["Chiclete", "Chicletes"],
  doces: ["Doces"],
  salgados: ["Salgados", "Salgadinhos", "Snacks"],
  chocolates: ["Chocolates"],
  "balas-chicletes": ["Balas e Drops", "Chicletes", "Balas a Granel"],
  salgadinhos: ["Salgadinhos", "Snacks"],
  biscoitos: ["Biscoitos"],
  "amendoins-castanhas": ["Amendoins", "Castanhas"],
  figurinhas: ["Figurinhas", "Colecionáveis"],
  albuns: ["Álbuns"],
  "cards-colecao": ["Cards Colecionáveis"],
  mangas: ["Planet Manga", "Mangá", "Mangás"],
  quadrinhos: ["Quadrinhos", "HQs", "Gibis", "Comics", "Panini Comics"],
  "graphic-novels": ["Graphic Novels", "Graphic Novel"],
  marvel: ["Marvel Comics", "Marvel"],
  "marvel-comics": ["Marvel Comics", "Marvel"],
  "dc-comics": ["DC Comics"],
  "disney-comics": ["Disney Comics", "Disney"],
  "panini-books": ["Panini Books"],
  "panini-comics": ["Panini Comics"],
  "panini-magazines": ["Panini Magazines"],
  "panini-partwork": ["Panini Partwork"],
  "planet-manga": ["Planet Manga", "Mangá", "Mangás"],
  "mauricio-de-sousa-producoes": ["Maurício de Sousa Produções", "Maurício de Sousa"],
  independentes: ["Independentes"],
  "panini-collections": ["Colecionáveis"],
  "pokemon-tcg": ["Cards Pokémon"],
  yugioh: ["Yu-Gi-Oh"],
  magic: ["Magic"],
  miniaturas: ["Miniaturas"],
  pelucias: ["Pelúcias"],
  colecionaveis: ["Colecionáveis"],
  bonecos: ["Bonecos"],
  carrinhos: ["Carrinhos"],
  educativos: ["Educativos"],
  esportivo: ["Esportivo"],
  caminhao: ["Caminhão"],
  utilidades: ["Utilidades"],
  chaveiros: ["Chaveiros"],
  canetas: ["Canetas"],
  cadernos: ["Cadernos"],
  "material-escolar": ["Material Escolar", "Papelaria"],
  adesivos: ["Adesivos", "Adesivos Times"],
  cabo: ["Cabo"],
  adaptadores: ["Adaptadores"],
  "caixa-de-som": ["Caixa de som", "Caixas de Som"],
  "carregador-com-tomada": ["Carregador com tomada"],
  "carregador-portatil": ["Carregador Portátil"],
  "carregador-veicular": ["Carregador veicular"],
  fone: ["Fone", "Fone de ouvido", "Fones de Ouvido"],
  "fone-de-ouvido": ["Fone de ouvido", "Fones de Ouvido"],
  informatica: ["Informática"],
  papelaria: ["Papelaria"],
  telefonia: ["Telefonia"],
  "chip-pre": ["Chip Pré"],
};

let categoryLookupCache: CategoryLookupCache | null = null;
let categoryLookupPromise: Promise<{
  allDistCats: DistributorCategoryLookup[];
  allBancaCats: BancaCategoryLookup[];
}> | null = null;

function normalizeText(value: string): string {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSlug(value: string): string {
  return normalizeText(value).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

function slugBase(value: string): string {
  const slug = normalizeSlug(value);
  return slug.endsWith("s") && slug.length > 1 ? slug.slice(0, -1) : slug;
}

function slugMatches(a: string, b: string): boolean {
  const sa = slugBase(a);
  const sb = slugBase(b);
  return !!sa && !!sb && sa === sb;
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function buildSlugCandidates(raw: string): string[] {
  const normalized = normalizeSlug(raw);
  if (!normalized) return [];
  const variants = [normalized];
  if (normalized.endsWith("s")) variants.push(normalized.slice(0, -1));
  else variants.push(`${normalized}s`);
  return uniqueStrings(variants);
}

function resolveSubcategoryNamesBySlug(opts: {
  requestedSubSlug: string;
  fallbackSlug: string;
  parentKey: string;
  parentMap: Record<string, string[]>;
  slugMap: Record<string, string[]>;
}): string[] | null {
  const { requestedSubSlug, fallbackSlug, parentKey, parentMap, slugMap } = opts;
  const candidateKeys = uniqueStrings([
    ...buildSlugCandidates(requestedSubSlug),
    ...buildSlugCandidates(fallbackSlug),
  ]);

  if (candidateKeys.length === 0) return null;

  for (const key of candidateKeys) {
    const mapped = slugMap[key];
    if (mapped && mapped.length > 0) {
      return uniqueStrings(mapped);
    }
  }

  const parentSubs = parentMap[parentKey] || [];
  if (parentSubs.length > 0) {
    const matchedParentSubs = parentSubs.filter((name) => {
      const nameSlug = normalizeSlug(name);
      return candidateKeys.some((candidate) => slugMatches(nameSlug, candidate));
    });
    if (matchedParentSubs.length > 0) return uniqueStrings(matchedParentSubs);
  }

  if (requestedSubSlug) {
    const allKnownSubs = uniqueStrings(Object.values(parentMap).flat());
    const matchedGlobal = allKnownSubs.filter((name) => {
      const nameSlug = normalizeSlug(name);
      return candidateKeys.some((candidate) => slugMatches(nameSlug, candidate));
    });
    if (matchedGlobal.length > 0) return matchedGlobal;
  }

  return null;
}

async function getCategoryLookups() {
  const now = Date.now();
  if (categoryLookupCache && categoryLookupCache.expiresAt > now) {
    return {
      allDistCats: categoryLookupCache.allDistCats,
      allBancaCats: categoryLookupCache.allBancaCats,
    };
  }

  if (!categoryLookupPromise) {
    categoryLookupPromise = (async () => {
      const [distRes, bancaRes] = await Promise.all([
        supabaseAdmin.from("distribuidor_categories").select("id, nome"),
        supabaseAdmin.from("categories").select("id, name"),
      ]);

      const allDistCats = Array.isArray(distRes.data) ? (distRes.data as DistributorCategoryLookup[]) : [];
      const allBancaCats = Array.isArray(bancaRes.data) ? (bancaRes.data as BancaCategoryLookup[]) : [];

      categoryLookupCache = {
        allDistCats,
        allBancaCats,
        expiresAt: Date.now() + CATEGORY_LOOKUP_TTL_MS,
      };

      return { allDistCats, allBancaCats };
    })().finally(() => {
      categoryLookupPromise = null;
    });
  }

  return categoryLookupPromise;
}

export async function resolvePublicCatalogCategoryFilters(params: {
  category?: string | null;
  categoryName?: string | null;
  subSlug?: string | null;
}): Promise<PublicCatalogCategoryResolution> {
  const requestedCategoryId = String(params.category || "");
  const requestedCategoryName = String(params.categoryName || "");
  const requestedSubSlug = String(params.subSlug || "");

  const { allDistCats, allBancaCats } = await getCategoryLookups();
  const categoryNameById = new Map<string, string>();

  for (const category of allDistCats || []) {
    if (category?.id && category?.nome) {
      categoryNameById.set(category.id, category.nome);
    }
  }

  for (const category of allBancaCats || []) {
    if (category?.id && category?.name) {
      categoryNameById.set(category.id, category.name);
    }
  }

  let categoryId = requestedCategoryId;
  let categoryIds: string[] = [];
  let nameSearchTerms: string[] = [];

  if (requestedCategoryName && !categoryId) {
    const searchName = requestedCategoryName.replace(/-/g, " ").toLowerCase();
    const resolvedName = SLUG_ALIASES[searchName] || searchName;
    const normalizedResolvedSlug = normalizeSlug(resolvedName);
    const normalizedSubSlug = normalizeSlug(requestedSubSlug);
    const resolvedSubSlug = normalizedSubSlug || normalizedResolvedSlug;

    const subCategoryNames = resolveSubcategoryNamesBySlug({
      requestedSubSlug: normalizedSubSlug,
      fallbackSlug: resolvedSubSlug,
      parentKey: normalizedResolvedSlug,
      parentMap: CATEGORY_SUBCATEGORIES,
      slugMap: SUB_SLUG_TO_NAMES,
    });

    const subcategories = subCategoryNames || CATEGORY_SUBCATEGORIES[normalizedResolvedSlug];

    if (subcategories && subcategories.length > 0) {
      const label = requestedSubSlug
        ? `subcategoria "${requestedSubSlug}"`
        : `categoria pai "${resolvedName}"`;
      console.log(`[API Public] ${label} - buscando: ${subcategories.join(", ")}`);

      const matchedDist = (allDistCats || []).filter((category) =>
        subcategories.some((subcategory) => normalizeText(category.nome || "") === normalizeText(subcategory))
      );
      if (matchedDist.length > 0) {
        categoryIds = matchedDist.map((category) => category.id);
      }

      const matchedBancaCats = (allBancaCats || []).filter((category) =>
        subcategories.some((subcategory) => normalizeText(category.name || "") === normalizeText(subcategory))
      );
      if (matchedBancaCats.length > 0) {
        categoryIds = [...categoryIds, ...matchedBancaCats.map((category) => category.id)];
      }

      nameSearchTerms = subcategories.map((subcategory) => subcategory.toLowerCase());

      if (!requestedSubSlug) {
        if (!nameSearchTerms.includes(resolvedName)) {
          nameSearchTerms.push(resolvedName);
        }
        const singular = resolvedName.endsWith("s") ? resolvedName.slice(0, -1) : null;
        if (singular && !nameSearchTerms.includes(singular)) {
          nameSearchTerms.push(singular);
        }
      }

      console.log(
        `[API Public] categoryIds: ${categoryIds.length}, nameSearchTerms: ${nameSearchTerms.length}`
      );
    } else {
      const normalizedResolved = normalizeText(resolvedName);
      const matchedBancaCategory = allBancaCats.find((item) =>
        normalizeText(item.name || "").includes(normalizedResolved)
      );
      if (matchedBancaCategory) {
        categoryId = matchedBancaCategory.id;
      }

      const matchedDistributorCategory = allDistCats.find((item) =>
        normalizeText(item.nome || "").includes(normalizedResolved)
      );
      if (matchedDistributorCategory) {
        categoryIds = [matchedDistributorCategory.id];
      }

      nameSearchTerms = [resolvedName];
      console.log(
        `[API Public] Busca simples: categoryId=${categoryId || "none"}, categoryIds=${categoryIds.length}, nome="${resolvedName}"`
      );
    }
  }

  return {
    categoryId,
    categoryIds,
    nameSearchTerms,
    categoryNameById,
    includeDistribuidor: !!(categoryId || requestedCategoryName || categoryIds.length > 0),
  };
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function sortItemsByDistance<T extends { lat?: number | string | null; lng?: number | string | null }>(params: {
  items: T[];
  userLat: number | null;
  userLng: number | null;
  randomizeWhenNoLocation?: boolean;
}): Array<T & { distance: number | null }> {
  const { items, userLat, userLng, randomizeWhenNoLocation = false } = params;
  const hasUserLocation = Number.isFinite(userLat) && Number.isFinite(userLng);

  const sortedItems = items.map((item) => {
    if (!hasUserLocation) {
      return { ...item, distance: null };
    }

    const lat = Number(item.lat);
    const lng = Number(item.lng);
    const distance = Number.isFinite(lat) && Number.isFinite(lng)
      ? calculateDistance(userLat as number, userLng as number, lat, lng)
      : null;

    return { ...item, distance };
  });

  if (hasUserLocation) {
    sortedItems.sort((a, b) => {
      const da = typeof a.distance === "number" ? a.distance : Number.POSITIVE_INFINITY;
      const db = typeof b.distance === "number" ? b.distance : Number.POSITIVE_INFINITY;
      return da - db;
    });
  } else if (randomizeWhenNoLocation) {
    sortedItems.sort(() => Math.random() - 0.5);
  }

  return sortedItems;
}

export function interleaveItemsByGroup<T>(params: {
  items: T[];
  getGroupKey: (item: T) => string;
  getDistance?: (item: T) => number | null;
}): T[] {
  const { items, getGroupKey, getDistance } = params;
  const itemsByGroup = new Map<string, T[]>();

  for (const item of items) {
    const key = getGroupKey(item);
    if (!itemsByGroup.has(key)) itemsByGroup.set(key, []);
    itemsByGroup.get(key)!.push(item);
  }

  const groups = Array.from(itemsByGroup.entries())
    .map(([groupId, groupItems]) => {
      const avgDistance = getDistance
        ? groupItems.reduce((acc, item) => {
            const distance = getDistance(item);
            return acc + (typeof distance === "number" ? distance : 9999);
          }, 0) / Math.max(1, groupItems.length)
        : 0;

      return { groupId, groupItems, avgDistance };
    })
    .sort((a, b) => a.avgDistance - b.avgDistance);

  const interleaved: T[] = [];
  const maxGroupSize = groups.length > 0 ? Math.max(...groups.map((group) => group.groupItems.length)) : 0;

  for (let index = 0; index < maxGroupSize; index++) {
    for (const group of groups) {
      if (index < group.groupItems.length) {
        interleaved.push(group.groupItems[index]);
      }
    }
  }

  return interleaved;
}

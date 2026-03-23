import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { readAuthenticatedUserClaims } from "@/lib/modules/auth/session";
import { canPreviewMarketplaceBanca, isPublishedMarketplaceBanca } from "@/lib/public-banca-access";
import { resolveBancaPlanEntitlements } from "@/lib/plan-entitlements";
import { supabaseAdmin } from "@/lib/supabase";
import {
  BAMBINO_GROUPED_ROOTS,
  BAMBINO_ROOT_CATEGORY_ORDER,
  BRANCALEONE_GROUPED_ROOTS,
  BRANCALEONE_ROOT_CATEGORY_ORDER,
  normalizeCategoryText,
} from "@/lib/catalog/fallbackCategories";

export const revalidate = 60;
export const dynamic = "force-dynamic";

const MERCOS_DEFAULT_BASE_URL = "https://app.mercos.com/api/v1";
const BAMBINO_DISTRIBUIDOR_ID = "3a989c56-bbd3-4769-b076-a83483e39542";
const BRANCALEONE_DISTRIBUIDOR_ID = "1511df09-1f4a-4e68-9f8c-05cd06be6269";
const SUPPORTED_DISTRIBUIDOR_IDS = new Set([
  BRANCALEONE_DISTRIBUIDOR_ID,
  BAMBINO_DISTRIBUIDOR_ID,
]);

type DistribuidorConfig = {
  id: string;
  nome: string | null;
  base_url: string | null;
  mercos_application_token: string | null;
  mercos_company_token: string | null;
  application_token: string | null;
  company_token: string | null;
};

type DistribuidorCategory = {
  id: string;
  distribuidor_id: string;
  nome: string;
  mercos_id: number | null;
  categoria_pai_id: number | null;
  ativo: boolean;
  created_at?: string | null;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeMercosTimestamp(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  return value.includes("T") ? value : value.replace(" ", "T");
}

function bumpIsoSecond(iso: string): string {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return iso;
  return new Date(dt.getTime() + 1000).toISOString();
}

function distribuidorPriority(nome: string | null | undefined): number {
  const value = String(nome || "").toLowerCase();
  if (value.includes("brancaleone")) return 0;
  if (value.includes("bambino")) return 1;
  return 99;
}

function sortDistribuidores(a: DistribuidorConfig, b: DistribuidorConfig): number {
  const priorityDiff = distribuidorPriority(a.nome) - distribuidorPriority(b.nome);
  if (priorityDiff !== 0) return priorityDiff;
  return String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR");
}

function dedupeOrdered(items: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    if (!item || seen.has(item)) continue;
    seen.add(item);
    out.push(item);
  }
  return out;
}

async function fetchMercosCategoryOrder(distribuidor: DistribuidorConfig): Promise<Map<number, number>> {
  const appToken = distribuidor.mercos_application_token || distribuidor.application_token;
  const companyToken = distribuidor.mercos_company_token || distribuidor.company_token;

  if (!appToken || !companyToken) {
    return new Map<number, number>();
  }

  const baseUrl = (distribuidor.base_url || MERCOS_DEFAULT_BASE_URL).replace(/\/$/, "");
  const orderedIds: number[] = [];
  const seen = new Set<number>();

  let cursorDate = "2020-01-01T00:00:00";
  let cursorId: number | null = null;
  let page = 0;

  while (page < 50) {
    page += 1;

    const qp = new URLSearchParams();
    qp.set("alterado_apos", cursorDate);
    qp.set("limit", "200");
    qp.set("order_by", "ultima_alteracao");
    qp.set("order_direction", "asc");
    if (cursorId !== null) qp.set("id_maior_que", String(cursorId));

    const url = `${baseUrl}/categorias?${qp.toString()}`;
    const response = await fetch(url, {
      headers: {
        ApplicationToken: appToken,
        CompanyToken: companyToken,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.status === 429) {
      const body = await response.json().catch(() => ({ tempo_ate_permitir_novamente: 2 }));
      const waitSeconds = Math.max(1, Number(body?.tempo_ate_permitir_novamente) || 2);
      await sleep(Math.min(waitSeconds, 5) * 1000);
      continue;
    }

    if (!response.ok) {
      console.warn(
        `[CATEGORIES-API] Mercos indisponível para ${distribuidor.nome || distribuidor.id}: ${response.status}`
      );
      break;
    }

    const raw = await response.json().catch(() => []);
    const categories = Array.isArray(raw) ? raw : [];

    if (categories.length === 0) {
      break;
    }

    for (const cat of categories) {
      const mercosId = Number(cat?.id);
      if (Number.isFinite(mercosId) && !seen.has(mercosId)) {
        seen.add(mercosId);
        orderedIds.push(mercosId);
      }
    }

    const limited = response.headers.get("MEUSPEDIDOS_LIMITOU_REGISTROS") === "1";
    if (!limited) {
      break;
    }

    const last = categories[categories.length - 1];
    const nextDateRaw = normalizeMercosTimestamp(last?.ultima_alteracao);
    const nextId = Number(last?.id);

    if (!nextDateRaw) break;

    if (!Number.isFinite(nextId)) {
      cursorDate = bumpIsoSecond(nextDateRaw);
      cursorId = null;
    } else if (nextDateRaw === cursorDate && cursorId === nextId) {
      cursorDate = bumpIsoSecond(nextDateRaw);
      cursorId = null;
    } else {
      cursorDate = nextDateRaw;
      cursorId = nextId;
    }

    await sleep(120);
  }

  const orderMap = new Map<number, number>();
  orderedIds.forEach((mercosId, index) => orderMap.set(mercosId, index));
  return orderMap;
}

/**
 * API de categorias do perfil da banca.
 *
 * - Busca categorias de distribuidores (Brancaleone/Bambino, quando presentes no catálogo ativo).
 * - Preserva ordem original da Mercos para categoria e subcategoria.
 * - A tela do perfil filtra estas categorias por aquelas que realmente têm produtos.
 */
export async function GET(_request: NextRequest, context: { params: { id: string } }) {
  try {
    const bancaId = context.params.id;
    if (!bancaId) {
      return NextResponse.json({ error: "ID da banca é obrigatório" }, { status: 400 });
    }

    const supabase = supabaseAdmin;
    const session = await auth();
    const claims = readAuthenticatedUserClaims(session);

    const { data: banca } = await supabase
      .from("bancas")
      .select("id, user_id, active, approved, is_cotista, cotista_id")
      .eq("id", bancaId)
      .single();

    const partnerLinked = banca?.is_cotista === true || Boolean(banca?.cotista_id);
    const canPreview = canPreviewMarketplaceBanca({
      bancaId: banca?.id,
      bancaUserId: (banca as any)?.user_id,
      viewerUserId: claims?.id,
      viewerBancaId: claims?.bancaId,
      viewerRole: claims?.role,
    });

    if (!isPublishedMarketplaceBanca(banca) && !canPreview) {
      return NextResponse.json({
        success: true,
        banca_id: bancaId,
        is_cotista: partnerLinked,
        partner_linked: partnerLinked,
        can_access_distributor_catalog: false,
        partner_catalog_access: false,
        categories: [],
        hierarchy: {},
        standalone: [],
      });
    }

    const entitlements = banca
      ? await resolveBancaPlanEntitlements({
          id: banca.id,
          is_cotista: banca.is_cotista,
          cotista_id: banca.cotista_id,
        })
      : null;

    if (!entitlements?.canAccessDistributorCatalog) {
      return NextResponse.json({
        success: true,
        banca_id: bancaId,
        is_cotista: partnerLinked,
        partner_linked: partnerLinked,
        can_access_distributor_catalog: false,
        partner_catalog_access: false,
        categories: [],
        hierarchy: {},
        standalone: [],
      });
    }

    const { data: distributorProducts } = await supabase
      .from("products")
      .select("distribuidor_id")
      .eq("active", true)
      .not("distribuidor_id", "is", null);

    const distribuidorIds = Array.from(
      new Set(
        (distributorProducts || [])
          .map((row) => row.distribuidor_id)
          .filter((id): id is string => Boolean(id) && SUPPORTED_DISTRIBUIDOR_IDS.has(String(id)))
      )
    ) as string[];

    if (distribuidorIds.length === 0) {
      return NextResponse.json({
        success: true,
        banca_id: bancaId,
        is_cotista: partnerLinked,
        partner_linked: partnerLinked,
        can_access_distributor_catalog: true,
        partner_catalog_access: true,
        preview_mode: canPreview && !isPublishedMarketplaceBanca(banca),
        categories: [],
        hierarchy: {},
        standalone: [],
      });
    }

    const [distCategoriesResult, distribuidoresResult] = await Promise.all([
      supabase
        .from("distribuidor_categories")
        .select("id, distribuidor_id, nome, mercos_id, categoria_pai_id, ativo, created_at")
        .in("distribuidor_id", distribuidorIds)
        .eq("ativo", true),
      supabase
        .from("distribuidores")
        .select(
          "id, nome, base_url, mercos_application_token, mercos_company_token, application_token, company_token"
        )
        .in("id", distribuidorIds),
    ]);

    const allCategories = (distCategoriesResult.data || []) as DistribuidorCategory[];
    const distribuidores = ((distribuidoresResult.data || []) as DistribuidorConfig[]).sort(sortDistribuidores);

    if (allCategories.length === 0 || distribuidores.length === 0) {
      return NextResponse.json({
        success: true,
        banca_id: bancaId,
        is_cotista: partnerLinked,
        partner_linked: partnerLinked,
        can_access_distributor_catalog: true,
        partner_catalog_access: true,
        preview_mode: canPreview && !isPublishedMarketplaceBanca(banca),
        categories: [],
        hierarchy: {},
        standalone: [],
      });
    }

    const categoriesByDistribuidor = new Map<string, DistribuidorCategory[]>();
    for (const cat of allCategories) {
      if (!categoriesByDistribuidor.has(cat.distribuidor_id)) {
        categoriesByDistribuidor.set(cat.distribuidor_id, []);
      }
      categoriesByDistribuidor.get(cat.distribuidor_id)!.push(cat);
    }

    const mercosOrderEntries = await Promise.all(
      distribuidores.map(async (dist) => {
        try {
          const order = await fetchMercosCategoryOrder(dist);
          return [dist.id, order] as const;
        } catch (error) {
          console.warn(
            `[CATEGORIES-API] Falha ao buscar ordem Mercos para ${dist.nome || dist.id}:`,
            error
          );
          return [dist.id, new Map<number, number>()] as const;
        }
      })
    );

    const mercosOrderByDistribuidor = new Map<string, Map<number, number>>(mercosOrderEntries);

    const hierarchy: Record<string, string[]> = {};
    const standalone: string[] = [];
    const flatCategories: string[] = [];
    const flatSeen = new Set<string>();

    const pushFlat = (name: string) => {
      if (!name || flatSeen.has(name)) return;
      flatSeen.add(name);
      flatCategories.push(name);
    };

    const addStandalone = (name: string) => {
      if (!name) return;
      if (!standalone.includes(name)) standalone.push(name);
      pushFlat(name);
    };

    for (const dist of distribuidores) {
      const distRows = categoriesByDistribuidor.get(dist.id) || [];
      if (distRows.length === 0) continue;

      const mercosOrder = mercosOrderByDistribuidor.get(dist.id) || new Map<number, number>();

      const getRowOrder = (row: DistribuidorCategory): number => {
        if (typeof row.mercos_id === "number" && mercosOrder.has(row.mercos_id)) {
          return mercosOrder.get(row.mercos_id)!;
        }
        return Number.MAX_SAFE_INTEGER;
      };

      const sortedRows = [...distRows].sort((a, b) => {
        const orderDiff = getRowOrder(a) - getRowOrder(b);
        if (orderDiff !== 0) return orderDiff;

        const mercosA = typeof a.mercos_id === "number" ? a.mercos_id : Number.MAX_SAFE_INTEGER;
        const mercosB = typeof b.mercos_id === "number" ? b.mercos_id : Number.MAX_SAFE_INTEGER;
        if (mercosA !== mercosB) return mercosA - mercosB;

        const createdDiff = String(a.created_at || "").localeCompare(String(b.created_at || ""));
        if (createdDiff !== 0) return createdDiff;

        return a.nome.localeCompare(b.nome, "pt-BR");
      });

      const rowByMercos = new Map<number, DistribuidorCategory>();
      for (const row of sortedRows) {
        if (typeof row.mercos_id === "number") rowByMercos.set(row.mercos_id, row);
      }

      const childrenByParent = new Map<number, DistribuidorCategory[]>();
      for (const row of sortedRows) {
        if (typeof row.categoria_pai_id !== "number") continue;
        if (!rowByMercos.has(row.categoria_pai_id)) continue;
        if (!childrenByParent.has(row.categoria_pai_id)) {
          childrenByParent.set(row.categoria_pai_id, []);
        }
        childrenByParent.get(row.categoria_pai_id)!.push(row);
      }

      let rootRows = sortedRows.filter((row) => {
        if (typeof row.categoria_pai_id !== "number") return true;
        return !rowByMercos.has(row.categoria_pai_id);
      });

      if (dist.id === BAMBINO_DISTRIBUIDOR_ID) {
        const bambinoOrderMap = new Map<string, number>();
        BAMBINO_ROOT_CATEGORY_ORDER.forEach((name, index) =>
          bambinoOrderMap.set(normalizeCategoryText(name), index)
        );

        rootRows = rootRows
          .filter((row) => bambinoOrderMap.has(normalizeCategoryText(row.nome)))
          .sort((a, b) => {
            const orderA = bambinoOrderMap.get(normalizeCategoryText(a.nome)) ?? Number.MAX_SAFE_INTEGER;
            const orderB = bambinoOrderMap.get(normalizeCategoryText(b.nome)) ?? Number.MAX_SAFE_INTEGER;
            return orderA - orderB;
          });
      }

      if (dist.id === BRANCALEONE_DISTRIBUIDOR_ID) {
        const brancaleoneOrderMap = new Map<string, number>();
        BRANCALEONE_ROOT_CATEGORY_ORDER.forEach((name, index) =>
          brancaleoneOrderMap.set(normalizeCategoryText(name), index)
        );

        rootRows = rootRows
          .filter((row) => brancaleoneOrderMap.has(normalizeCategoryText(row.nome)))
          .sort((a, b) => {
            const orderA = brancaleoneOrderMap.get(normalizeCategoryText(a.nome)) ?? Number.MAX_SAFE_INTEGER;
            const orderB = brancaleoneOrderMap.get(normalizeCategoryText(b.nome)) ?? Number.MAX_SAFE_INTEGER;
            return orderA - orderB;
          });
      }

      const collectDescendants = (parentMercosId: number, visited: Set<number>): string[] => {
        const children = childrenByParent.get(parentMercosId) || [];
        const names: string[] = [];

        for (const child of children) {
          if (typeof child.mercos_id !== "number") continue;
          if (visited.has(child.mercos_id)) continue;
          visited.add(child.mercos_id);

          names.push(child.nome);
          names.push(...collectDescendants(child.mercos_id, visited));
        }

        return names;
      };

      for (const root of rootRows) {
        const isBambinoStandaloneRoot =
          dist.id === BAMBINO_DISTRIBUIDOR_ID &&
          !BAMBINO_GROUPED_ROOTS.has(normalizeCategoryText(root.nome));

        if (isBambinoStandaloneRoot) {
          addStandalone(root.nome);
          continue;
        }

        const isBrancaleoneStandaloneRoot =
          dist.id === BRANCALEONE_DISTRIBUIDOR_ID &&
          !BRANCALEONE_GROUPED_ROOTS.has(normalizeCategoryText(root.nome));

        if (isBrancaleoneStandaloneRoot) {
          addStandalone(root.nome);
          continue;
        }

        if (typeof root.mercos_id !== "number") {
          addStandalone(root.nome);
          continue;
        }

        const descendants = dedupeOrdered(collectDescendants(root.mercos_id, new Set<number>()));

        if (descendants.length > 0) {
          if (!hierarchy[root.nome]) {
            hierarchy[root.nome] = [];
          }

          for (const childName of descendants) {
            if (!hierarchy[root.nome].includes(childName)) {
              hierarchy[root.nome].push(childName);
            }
          }

          pushFlat(root.nome);
          for (const childName of hierarchy[root.nome]) pushFlat(childName);
          continue;
        }

        addStandalone(root.nome);
      }
    }

    console.log(
      `[CATEGORIES-API] Banca ${bancaId}: ${Object.keys(hierarchy).length} grupos, ${standalone.length} categorias avulsas`
    );

    return NextResponse.json(
      {
        success: true,
        banca_id: bancaId,
        is_cotista: partnerLinked,
        partner_linked: partnerLinked,
        can_access_distributor_catalog: true,
        partner_catalog_access: true,
        preview_mode: canPreview && !isPublishedMarketplaceBanca(banca),
        categories: flatCategories,
        hierarchy,
        standalone,
        total_categories: flatCategories.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error: any) {
    console.error("Erro ao buscar categorias da banca:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}

import { getDistribuidorNetworkBancas } from "@/lib/distribuidor-access";
import { getDistribuidorProductIds } from "@/lib/modules/distribuidor/orders";
import { supabaseAdmin } from "@/lib/supabase";

type DistribuidorBancaPedido = {
  banca_id: string | null;
  items?: unknown;
  status?: string | null;
  created_at?: string | null;
};

type DistribuidorBancaCustomization = {
  banca_id: string;
  product_id: string;
  enabled?: boolean | null;
};

const CUSTOMIZATION_BATCH_SIZE = 200;

function parseOrderItems(rawItems: unknown): Array<{
  product_id?: string | null;
  total_price?: number | null;
}> {
  if (!rawItems) return [];

  if (typeof rawItems === "string") {
    try {
      const parsed = JSON.parse(rawItems);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return Array.isArray(rawItems) ? rawItems : [];
}

async function loadDistribuidorBancaCustomizations(productIds: string[]) {
  if (productIds.length === 0) {
    return [] as DistribuidorBancaCustomization[];
  }

  const customizations: DistribuidorBancaCustomization[] = [];

  for (let index = 0; index < productIds.length; index += CUSTOMIZATION_BATCH_SIZE) {
    const batch = productIds.slice(index, index + CUSTOMIZATION_BATCH_SIZE);
    const { data, error } = await supabaseAdmin
      .from("banca_produtos_distribuidor")
      .select("banca_id, product_id, enabled")
      .in("product_id", batch);

    if (error) {
      throw error;
    }

    customizations.push(...((data || []) as DistribuidorBancaCustomization[]));
  }

  return customizations;
}

export async function getDistribuidorBancasOverview(params: {
  distribuidorId: string;
  query?: string;
}) {
  const bancas = await getDistribuidorNetworkBancas();
  const productIds = await getDistribuidorProductIds(params.distribuidorId);
  const productIdSet = new Set(productIds);

  const [
    { count: totalProdutosDistribuidor },
    bancasProdutos,
    { data: pedidos },
  ] = await Promise.all([
    supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("distribuidor_id", params.distribuidorId),
    loadDistribuidorBancaCustomizations(productIds),
    bancas.length
      ? supabaseAdmin
          .from("orders")
          .select("banca_id, items, status, created_at")
          .in(
            "banca_id",
            bancas.map((banca) => banca.id)
          )
      : Promise.resolve({ data: [] as DistribuidorBancaPedido[] }),
  ]);

  const totalProdutosBase = totalProdutosDistribuidor || 0;
  const customizations = bancasProdutos;
  const orders = (pedidos || []) as DistribuidorBancaPedido[];
  const normalizedQuery = (params.query || "").trim().toLowerCase();

  const items = bancas
    .map((banca) => {
      const canAccessDistributorCatalog = banca.can_access_distributor_catalog;
      const produtosBanca = customizations.filter((customization) => customization.banca_id === banca.id);
      const produtosDesativados = produtosBanca.filter((product) => product.enabled === false);
      const produtosAtivosCount = canAccessDistributorCatalog
        ? Math.max(totalProdutosBase - produtosDesativados.length, 0)
        : 0;

      const pedidosBancaComProdutos = orders
        .filter((pedido) => pedido.banca_id === banca.id)
        .map((pedido) => {
          const itensDistribuidor = parseOrderItems(pedido.items).filter((item) => {
            const productId = item.product_id || null;
            return !!productId && productIdSet.has(productId);
          });

          if (itensDistribuidor.length === 0) {
            return null;
          }

          return {
            ...pedido,
            itens_distribuidor: itensDistribuidor,
          };
        })
        .filter(Boolean) as Array<
        DistribuidorBancaPedido & {
          itens_distribuidor: Array<{ total_price?: number | null }>;
        }
      >;

      let valorTotal = 0;
      for (const pedido of pedidosBancaComProdutos) {
        valorTotal += pedido.itens_distribuidor.reduce(
          (acc, item) => acc + (Number(item.total_price) || 0),
          0
        );
      }

      const ultimoPedido = [...pedidosBancaComProdutos].sort(
        (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      )[0];

      const temProdutosDistribuidor =
        canAccessDistributorCatalog &&
        (produtosAtivosCount > 0 || produtosBanca.length > 0 || pedidosBancaComProdutos.length > 0);

      return {
        id: banca.id,
        name: banca.name,
        address: banca.address,
        whatsapp: banca.contact_phone || banca.whatsapp || banca.phone,
        cover_image: banca.cover_image,
        avatar: banca.cover_image,
        active: banca.active !== false,
        created_at: banca.created_at,
        lat: banca.lat,
        lng: banca.lng,
        is_cotista: banca.is_legacy_cotista_linked,
        plan_type: banca.plan_type,
        can_access_distributor_catalog: canAccessDistributorCatalog,
        tem_produtos_distribuidor: temProdutosDistribuidor,
        produtos_distribuidor: canAccessDistributorCatalog ? totalProdutosBase : 0,
        produtos_ativos: produtosAtivosCount,
        total_pedidos: pedidosBancaComProdutos.length,
        pedidos_pendentes: pedidosBancaComProdutos.filter((pedido) =>
          ["novo", "confirmado"].includes(String(pedido.status || ""))
        ).length,
        valor_total: valorTotal,
        ultimo_pedido_status: ultimoPedido?.status || null,
        ultimo_pedido_data: ultimoPedido?.created_at || null,
      };
    })
    .filter((banca) => {
      if (!normalizedQuery) return true;

      const searchFields = [banca.name, banca.address, banca.whatsapp].join(" ").toLowerCase();
      return searchFields.includes(normalizedQuery);
    })
    .sort((a, b) => {
      if (a.can_access_distributor_catalog && !b.can_access_distributor_catalog) return -1;
      if (!a.can_access_distributor_catalog && b.can_access_distributor_catalog) return 1;
      if (a.tem_produtos_distribuidor && !b.tem_produtos_distribuidor) return -1;
      if (!a.tem_produtos_distribuidor && b.tem_produtos_distribuidor) return 1;
      return a.name.localeCompare(b.name);
    });

  return {
    items,
    stats: {
      total_bancas: items.length,
      bancas_com_acesso: items.filter((banca) => banca.can_access_distributor_catalog).length,
      bancas_com_produtos: items.filter((banca) => banca.tem_produtos_distribuidor).length,
      total_pedidos: items.reduce((acc, banca) => acc + banca.total_pedidos, 0),
      valor_total: items.reduce((acc, banca) => acc + banca.valor_total, 0),
    },
  };
}

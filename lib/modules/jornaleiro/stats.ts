import { loadJornaleiroActor } from "@/lib/modules/jornaleiro/access";
import { loadActiveJornaleiroBancaRow } from "@/lib/modules/jornaleiro/bancas";
import { resolveBancaPlanEntitlements } from "@/lib/plan-entitlements";
import { supabaseAdmin } from "@/lib/supabase";

async function ensureJornaleiro(userId: string) {
  const { actor, error } = await loadJornaleiroActor(userId);

  if (error) {
    throw new Error(error.message || "Erro ao validar acesso do jornaleiro");
  }

  if (!actor.isJornaleiro) {
    throw new Error("FORBIDDEN_JORNALEIRO");
  }
}

export async function loadJornaleiroStats(userId: string) {
  await ensureJornaleiro(userId);

  const banca = await loadActiveJornaleiroBancaRow<{
    id: string;
    is_cotista?: boolean | null;
    cotista_id?: string | null;
  }>({
    userId,
    select: "id, is_cotista, cotista_id",
  });

  if (!banca) {
    return {
      success: true,
      data: {
        produtosProprios: 0,
        produtosDistribuidor: 0,
        produtosAtivos: 0,
        pedidosHoje: 0,
        pedidosPendentes: 0,
        faturamentoHoje: 0,
      },
    };
  }

  const hoje = new Date();
  const hojeStart = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).toISOString();
  const entitlements = await resolveBancaPlanEntitlements(banca);

  const [
    produtosPropriosRes,
    produtosDistribuidorRes,
    pedidosHojeRes,
    pedidosPendentesRes,
    faturamentoRes,
  ] = await Promise.all([
    supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("banca_id", banca.id)
      .eq("active", true),
    entitlements.canAccessDistributorCatalog
      ? supabaseAdmin
          .from("products")
          .select("*", { count: "exact", head: true })
          .not("distribuidor_id", "is", null)
          .eq("active", true)
      : Promise.resolve({ count: 0, error: null }),
    supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("banca_id", banca.id)
      .gte("created_at", hojeStart),
    supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("banca_id", banca.id)
      .not("status", "in", '("entregue","cancelado")'),
    supabaseAdmin
      .from("orders")
      .select("total")
      .eq("banca_id", banca.id)
      .gte("created_at", hojeStart),
  ]);

  if (produtosPropriosRes.error) throw new Error(produtosPropriosRes.error.message);
  if ((produtosDistribuidorRes as any).error) throw new Error((produtosDistribuidorRes as any).error.message);
  if (pedidosHojeRes.error) throw new Error(pedidosHojeRes.error.message);
  if (pedidosPendentesRes.error) throw new Error(pedidosPendentesRes.error.message);
  if (faturamentoRes.error) throw new Error(faturamentoRes.error.message);

  const produtosProprios = produtosPropriosRes.count || 0;
  const produtosDistribuidor = entitlements.canAccessDistributorCatalog
    ? ((produtosDistribuidorRes as any).count || 0)
    : 0;
  const pedidosHoje = pedidosHojeRes.count || 0;
  const pedidosPendentes = pedidosPendentesRes.count || 0;
  const faturamentoHoje = (faturamentoRes.data || []).reduce(
    (acc: number, order: { total?: number | string | null }) => acc + Number(order.total || 0),
    0
  );

  return {
    success: true,
    data: {
      produtosProprios,
      produtosDistribuidor,
      produtosAtivos: produtosProprios + produtosDistribuidor,
      pedidosHoje,
      pedidosPendentes,
      faturamentoHoje,
      isCotista: entitlements.isLegacyCotistaLinked,
      canAccessDistributorCatalog: entitlements.canAccessDistributorCatalog,
      planType: entitlements.planType,
    },
  };
}

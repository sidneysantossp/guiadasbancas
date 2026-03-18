import { getDistribuidorAccessibleBancas } from "@/lib/distribuidor-access";
import { supabaseAdmin } from "@/lib/supabase";
import { getDistribuidorOrderMetrics } from "@/lib/modules/distribuidor/orders";

export async function getDistribuidorStats(params: {
  distribuidorId: string;
  debug?: boolean;
}) {
  const [{ count: totalProdutos }, { count: produtosAtivos }, { count: produtosInativos }, { data: distribuidor, error: distribuidorError }, orderMetrics, accessibleBancas] =
    await Promise.all([
      supabaseAdmin
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("distribuidor_id", params.distribuidorId),
      supabaseAdmin
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("distribuidor_id", params.distribuidorId)
        .eq("active", true),
      supabaseAdmin
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("distribuidor_id", params.distribuidorId)
        .eq("active", false),
      supabaseAdmin
        .from("distribuidores")
        .select("nome, ultima_sincronizacao, total_produtos")
        .eq("id", params.distribuidorId)
        .single(),
      getDistribuidorOrderMetrics({ distribuidorId: params.distribuidorId }),
      getDistribuidorAccessibleBancas(),
    ]);

  if (distribuidorError) {
    throw distribuidorError;
  }

  const produtosNull = (totalProdutos || 0) - (produtosAtivos || 0) - (produtosInativos || 0);
  const totalReal = (produtosAtivos || 0) + (produtosInativos || 0) + (produtosNull || 0);
  const totalFinal = totalReal > (totalProdutos || 0) ? totalReal : (totalProdutos || 0);

  const data = {
    totalProdutos: totalFinal,
    produtosAtivos: produtosAtivos || 0,
    totalPedidosHoje: orderMetrics.totalPedidosHoje,
    totalPedidos: orderMetrics.totalPedidos,
    totalBancas: accessibleBancas.length,
    faturamentoMes: orderMetrics.faturamentoMes,
    ultimaSincronizacao: distribuidor?.ultima_sincronizacao || null,
  };

  if (!params.debug) {
    return { data };
  }

  return {
    contagens: {
      totalProdutos: totalProdutos || 0,
      produtosAtivos: produtosAtivos || 0,
      produtosInativos: produtosInativos || 0,
      produtosNull,
      soma: totalReal,
      totalFinal,
      inconsistente: (produtosAtivos || 0) > (totalProdutos || 0),
    },
    distribuidor: {
      nome: distribuidor?.nome,
      total_produtos_campo: distribuidor?.total_produtos,
    },
    data,
  };
}

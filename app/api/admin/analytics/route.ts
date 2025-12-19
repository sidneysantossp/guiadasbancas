import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Verificar se é admin
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";

    // Calcular data inicial
    let startDate = new Date();
    switch (period) {
      case "7d": startDate.setDate(startDate.getDate() - 7); break;
      case "30d": startDate.setDate(startDate.getDate() - 30); break;
      case "90d": startDate.setDate(startDate.getDate() - 90); break;
      case "all": startDate = new Date("2020-01-01"); break;
    }

    // Buscar todos os eventos
    const { data: events, error } = await supabaseAdmin
      .from("analytics_events")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Admin Analytics] Erro:", error);
      return NextResponse.json({ success: false, error: "Erro ao buscar dados" }, { status: 500 });
    }

    // Estatísticas gerais
    const stats = {
      total_events: events?.length || 0,
      page_views: events?.filter(e => e.event_type === "page_view").length || 0,
      product_views: events?.filter(e => e.event_type === "product_view").length || 0,
      product_clicks: events?.filter(e => e.event_type === "product_click").length || 0,
      add_to_cart: events?.filter(e => e.event_type === "add_to_cart").length || 0,
      whatsapp_clicks: events?.filter(e => e.event_type === "whatsapp_click").length || 0,
      checkout_starts: events?.filter(e => e.event_type === "checkout_start").length || 0,
      checkout_completes: events?.filter(e => e.event_type === "checkout_complete").length || 0,
      searches: events?.filter(e => e.event_type === "search").length || 0,
      unique_sessions: new Set(events?.map(e => e.session_id).filter(Boolean)).size,
    };

    // Agrupar por dia
    const dailyStats: Record<string, Record<string, number>> = {};
    events?.forEach(event => {
      const date = new Date(event.created_at).toISOString().split("T")[0];
      if (!dailyStats[date]) {
        dailyStats[date] = {
          page_views: 0, product_views: 0, add_to_cart: 0,
          whatsapp_clicks: 0, checkout_completes: 0, total: 0
        };
      }
      dailyStats[date].total++;
      if (dailyStats[date][event.event_type] !== undefined) {
        dailyStats[date][event.event_type]++;
      }
    });

    const chartData = Object.entries(dailyStats)
      .map(([date, counts]) => ({ date, ...counts }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top bancas por interações
    const bancaStats: Record<string, number> = {};
    events?.forEach(event => {
      if (event.banca_id) {
        bancaStats[event.banca_id] = (bancaStats[event.banca_id] || 0) + 1;
      }
    });

    const bancaIds = Object.keys(bancaStats);
    let topBancas: any[] = [];

    if (bancaIds.length > 0) {
      const { data: bancas } = await supabaseAdmin
        .from("bancas")
        .select("id, name, profile_image")
        .in("id", bancaIds);

      topBancas = bancaIds
        .map(id => {
          const banca = bancas?.find(b => b.id === id);
          return {
            id,
            name: banca?.name || "Banca removida",
            image: banca?.profile_image,
            interactions: bancaStats[id]
          };
        })
        .sort((a, b) => b.interactions - a.interactions)
        .slice(0, 10);
    }

    // Top produtos mais interagidos
    const productStats: Record<string, { views: number; clicks: number; cart: number; whatsapp: number }> = {};
    events?.forEach(event => {
      if (event.product_id) {
        if (!productStats[event.product_id]) {
          productStats[event.product_id] = { views: 0, clicks: 0, cart: 0, whatsapp: 0 };
        }
        if (event.event_type === "product_view") productStats[event.product_id].views++;
        if (event.event_type === "product_click") productStats[event.product_id].clicks++;
        if (event.event_type === "add_to_cart") productStats[event.product_id].cart++;
        if (event.event_type === "whatsapp_click") productStats[event.product_id].whatsapp++;
      }
    });

    const productIds = Object.keys(productStats);
    let topProducts: any[] = [];

    if (productIds.length > 0) {
      const { data: products } = await supabaseAdmin
        .from("products")
        .select("id, name, image, banca_id, bancas(name)")
        .in("id", productIds);

      topProducts = productIds
        .map(id => {
          const product = products?.find(p => p.id === id);
          const stats = productStats[id];
          return {
            id,
            name: product?.name || "Produto removido",
            image: product?.image,
            banca_name: (product?.bancas as any)?.name,
            ...stats,
            total: stats.views + stats.clicks + stats.cart + stats.whatsapp
          };
        })
        .sort((a, b) => b.total - a.total)
        .slice(0, 20);
    }

    // Termos de busca mais populares
    const searchTerms: Record<string, number> = {};
    events?.filter(e => e.event_type === "search").forEach(event => {
      const term = event.metadata?.search_term?.toLowerCase();
      if (term) {
        searchTerms[term] = (searchTerms[term] || 0) + 1;
      }
    });

    const topSearches = Object.entries(searchTerms)
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return NextResponse.json({
      success: true,
      stats,
      chartData,
      topBancas,
      topProducts,
      topSearches,
      period,
    });
  } catch (e: any) {
    console.error("[Admin Analytics] Erro:", e);
    return NextResponse.json({ success: false, error: e?.message || "Erro interno" }, { status: 500 });
  }
}

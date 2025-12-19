import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      banca_id, 
      product_id, 
      event_type, 
      session_id, 
      user_identifier,
      metadata 
    } = body;

    if (!event_type) {
      return NextResponse.json(
        { success: false, error: "event_type é obrigatório" },
        { status: 400 }
      );
    }

    // Capturar informações do request
    const ip_address = request.headers.get("x-forwarded-for") || 
                       request.headers.get("x-real-ip") || 
                       "unknown";
    const user_agent = request.headers.get("user-agent") || "";
    const referrer = request.headers.get("referer") || "";

    // Inserir evento
    const { data, error } = await supabaseAdmin
      .from("analytics_events")
      .insert({
        banca_id: banca_id || null,
        product_id: product_id || null,
        event_type,
        session_id: session_id || null,
        user_identifier: user_identifier || null,
        metadata: metadata || {},
        ip_address,
        user_agent,
        referrer
      })
      .select()
      .single();

    if (error) {
      console.error("[Analytics] Erro ao inserir evento:", error);
      return NextResponse.json(
        { success: false, error: "Erro ao registrar evento" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, event_id: data.id });
  } catch (e: any) {
    console.error("[Analytics] Erro:", e);
    return NextResponse.json(
      { success: false, error: e?.message || "Erro interno" },
      { status: 500 }
    );
  }
}

// GET para buscar estatísticas (usado pelo relatório do jornaleiro)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const banca_id = searchParams.get("banca_id");
    const period = searchParams.get("period") || "7d"; // 7d, 30d, 90d, all
    const event_type = searchParams.get("event_type");

    if (!banca_id) {
      return NextResponse.json(
        { success: false, error: "banca_id é obrigatório" },
        { status: 400 }
      );
    }

    // Calcular data inicial baseada no período
    let startDate = new Date();
    switch (period) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(startDate.getDate() - 90);
        break;
      case "all":
        startDate = new Date("2020-01-01");
        break;
    }

    // Query base
    let query = supabaseAdmin
      .from("analytics_events")
      .select("*")
      .eq("banca_id", banca_id)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false });

    if (event_type) {
      query = query.eq("event_type", event_type);
    }

    const { data: events, error } = await query;

    if (error) {
      console.error("[Analytics] Erro ao buscar eventos:", error);
      return NextResponse.json(
        { success: false, error: "Erro ao buscar eventos" },
        { status: 500 }
      );
    }

    // Calcular estatísticas
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
    };

    // Agrupar por dia para gráficos
    const dailyStats: Record<string, Record<string, number>> = {};
    events?.forEach(event => {
      const date = new Date(event.created_at).toISOString().split("T")[0];
      if (!dailyStats[date]) {
        dailyStats[date] = {
          page_views: 0,
          product_views: 0,
          product_clicks: 0,
          add_to_cart: 0,
          whatsapp_clicks: 0,
          checkout_completes: 0,
        };
      }
      if (dailyStats[date][event.event_type] !== undefined) {
        dailyStats[date][event.event_type]++;
      }
    });

    // Converter para array ordenado
    const chartData = Object.entries(dailyStats)
      .map(([date, counts]) => ({ date, ...counts }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top produtos mais visualizados/clicados
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

    // Buscar nomes dos produtos
    const productIds = Object.keys(productStats);
    let topProducts: any[] = [];
    
    if (productIds.length > 0) {
      const { data: products } = await supabaseAdmin
        .from("products")
        .select("id, name, image")
        .in("id", productIds);

      topProducts = productIds
        .map(id => {
          const product = products?.find(p => p.id === id);
          return {
            id,
            name: product?.name || "Produto removido",
            image: product?.image,
            ...productStats[id],
            total: productStats[id].views + productStats[id].clicks + productStats[id].cart + productStats[id].whatsapp
          };
        })
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);
    }

    return NextResponse.json({
      success: true,
      stats,
      chartData,
      topProducts,
      period,
    });
  } catch (e: any) {
    console.error("[Analytics] Erro:", e);
    return NextResponse.json(
      { success: false, error: e?.message || "Erro interno" },
      { status: 500 }
    );
  }
}

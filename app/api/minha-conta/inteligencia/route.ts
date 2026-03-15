import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

const FINAL_ORDER_STATUSES = ["completed", "entregue", "cancelled", "cancelado", "canceled"];

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: "Usuário inválido" }, { status: 401 });
    }

    const [{ data: orders, error: ordersError }, { count: favoritesCount, error: favoritesError }] = await Promise.all([
      supabaseAdmin
        .from("orders")
        .select("id, total, status, created_at, banca_id, bancas:banca_id(name)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(100),
      supabaseAdmin
        .from("user_favorites")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
    ]);

    if (ordersError) {
      throw new Error(ordersError.message);
    }
    if (favoritesError) {
      throw new Error(favoritesError.message);
    }

    const safeOrders = orders || [];
    const totalOrders = safeOrders.length;
    const inProgressOrders = safeOrders.filter((order) => !FINAL_ORDER_STATUSES.includes(String(order.status || "").toLowerCase())).length;
    const completedOrders = safeOrders.filter((order) => ["completed", "entregue"].includes(String(order.status || "").toLowerCase())).length;
    const totalSpent = safeOrders
      .filter((order) => !["cancelled", "cancelado", "canceled"].includes(String(order.status || "").toLowerCase()))
      .reduce((sum, order) => sum + Number(order.total || 0), 0);
    const averageTicket = totalOrders > 0 ? totalSpent / Math.max(totalOrders, 1) : 0;

    const topBancasMap = new Map<string, { bancaName: string; orders: number; total: number }>();
    safeOrders.forEach((order: any) => {
      const bancaName = order?.bancas?.name || "Banca";
      const current = topBancasMap.get(bancaName) || { bancaName, orders: 0, total: 0 };
      current.orders += 1;
      current.total += Number(order.total || 0);
      topBancasMap.set(bancaName, current);
    });

    const topBancas = Array.from(topBancasMap.values())
      .sort((left, right) => right.orders - left.orders || right.total - left.total)
      .slice(0, 5);

    const recommendations = [
      totalOrders === 0
        ? {
            title: "Faça sua primeira compra",
            description: "Explore bancas próximas e comece a criar histórico de compra dentro da plataforma.",
          }
        : null,
      inProgressOrders > 0
        ? {
            title: "Acompanhe seus pedidos em andamento",
            description: "Você tem pedidos que ainda dependem de acompanhamento até a conclusão.",
          }
        : null,
      (favoritesCount || 0) === 0
        ? {
            title: "Monte sua lista de favoritos",
            description: "Salve produtos e bancas de interesse para comprar com menos atrito depois.",
          }
        : null,
    ].filter(Boolean);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          total_orders: totalOrders,
          in_progress_orders: inProgressOrders,
          completed_orders: completedOrders,
          total_spent: totalSpent,
          average_ticket: averageTicket,
          favorites_count: favoritesCount || 0,
        },
        recent_orders: safeOrders.slice(0, 5).map((order: any) => ({
          id: order.id,
          total: Number(order.total || 0),
          status: order.status,
          created_at: order.created_at,
          banca_name: order?.bancas?.name || "Banca",
        })),
        top_bancas: topBancas,
        recommendations,
      },
    });
  } catch (error: any) {
    console.error("[API Minha Conta Inteligencia] Erro:", error);
    return NextResponse.json({ error: error?.message || "Erro ao carregar inteligência da conta" }, { status: 500 });
  }
}

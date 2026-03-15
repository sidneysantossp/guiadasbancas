import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPersonalizedCouponsForUser } from "@/lib/minha-conta-coupons";
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

    const [
      { data: orders, error: ordersError },
      { count: favoritesCount, error: favoritesError },
      couponsData,
    ] = await Promise.all([
      supabaseAdmin
        .from("orders")
        .select("id, total, status, created_at, banca_id, items, bancas:banca_id(name)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(100),
      supabaseAdmin
        .from("user_favorites")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
      getPersonalizedCouponsForUser(userId, 6).catch((couponError) => {
        console.warn("[API Minha Conta Inteligencia] Falha ao carregar cupons:", couponError);
        return {
          summary: {
            available_count: 0,
            expiring_soon_count: 0,
            recent_bancas_count: 0,
          },
          items: [],
        };
      }),
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
    const availableCoupons = couponsData.summary.available_count;

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

    const reorderMap = new Map<
      string,
      {
        product_id: string;
        product_name: string;
        banca_name: string;
        purchases: number;
        quantity: number;
        last_purchased_at: string;
      }
    >();

    safeOrders
      .filter((order: any) => ["completed", "entregue"].includes(String(order.status || "").toLowerCase()))
      .forEach((order: any) => {
        const bancaName = order?.bancas?.name || "Banca";
        const createdAt = order?.created_at || null;
        const items = Array.isArray(order?.items) ? order.items : [];

        items.forEach((item: any) => {
          const productId = String(item?.product_id || item?.id || item?.product_name || "").trim();
          const productName = String(item?.product_name || item?.name || "Produto").trim();
          if (!productId && !productName) return;

          const key = productId || productName.toLowerCase();
          const current = reorderMap.get(key) || {
            product_id: productId || key,
            product_name: productName,
            banca_name: bancaName,
            purchases: 0,
            quantity: 0,
            last_purchased_at: createdAt,
          };

          current.purchases += 1;
          current.quantity += Number(item?.quantity || 0);
          if (createdAt && (!current.last_purchased_at || Date.parse(createdAt) > Date.parse(current.last_purchased_at))) {
            current.last_purchased_at = createdAt;
          }

          reorderMap.set(key, current);
        });
      });

    const reorderCandidates = Array.from(reorderMap.values())
      .sort((left, right) => {
        if (right.purchases !== left.purchases) return right.purchases - left.purchases;
        return Date.parse(right.last_purchased_at || "") - Date.parse(left.last_purchased_at || "");
      })
      .slice(0, 6);

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
      availableCoupons > 0
        ? {
            title: "Aproveite seus cupons ativos",
            description: `Sua conta tem ${availableCoupons} cupom(ns) disponivel(is) para bancas com historico ou relevancia para voce.`,
          }
        : null,
      reorderCandidates.length > 0
        ? {
            title: "Revisite itens com recompra potencial",
            description: `Sua conta ja mostra ${reorderCandidates.length} produto(s) com historico de recompra ou recorrencia.`,
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
          available_coupons: availableCoupons,
        },
        recent_orders: safeOrders.slice(0, 5).map((order: any) => ({
          id: order.id,
          total: Number(order.total || 0),
          status: order.status,
          created_at: order.created_at,
          banca_name: order?.bancas?.name || "Banca",
        })),
        top_bancas: topBancas,
        reorder_candidates: reorderCandidates,
        coupons: couponsData.items,
        recommendations,
      },
    });
  } catch (error: any) {
    console.error("[API Minha Conta Inteligencia] Erro:", error);
    return NextResponse.json({ error: error?.message || "Erro ao carregar inteligência da conta" }, { status: 500 });
  }
}

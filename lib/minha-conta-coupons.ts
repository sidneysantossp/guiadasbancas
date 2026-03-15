import { supabaseAdmin } from "@/lib/supabase";
import { isCouponActive, parseCouponBenefit } from "@/lib/coupon-engine";

export type PersonalizedCouponSource = "recent" | "favorite" | "marketplace";

export type PersonalizedCouponItem = {
  id: string;
  code: string;
  title: string;
  discount_text: string;
  benefit_type: ReturnType<typeof parseCouponBenefit>["type"];
  benefit_value: number | null;
  seller_id: string;
  banca_name: string;
  active: boolean;
  highlight: boolean;
  expires_at: string | null;
  created_at: string | null;
  source: PersonalizedCouponSource;
  source_label: string;
};

export type PersonalizedCouponsSummary = {
  available_count: number;
  expiring_soon_count: number;
  recent_bancas_count: number;
};

function getSourceLabel(source: PersonalizedCouponSource) {
  switch (source) {
    case "recent":
      return "Compra recorrente";
    case "favorite":
      return "Interesse salvo";
    default:
      return "Marketplace";
  }
}

export async function getPersonalizedCouponsForUser(userId: string, limit = 12) {
  const now = Date.now();

  const [
    { data: orders, error: ordersError },
    { data: favorites, error: favoritesError },
    { data: coupons, error: couponsError },
  ] = await Promise.all([
    supabaseAdmin
      .from("orders")
      .select("banca_id, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(40),
    supabaseAdmin
      .from("user_favorites")
      .select("products:product_id(banca_id)")
      .eq("user_id", userId)
      .limit(60),
    supabaseAdmin
      .from("coupons")
      .select("id, seller_id, title, code, discount_text, active, highlight, expires_at, created_at")
      .eq("active", true)
      .order("highlight", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(80),
  ]);

  if (ordersError) throw new Error(ordersError.message);
  if (favoritesError) throw new Error(favoritesError.message);
  if (couponsError) throw new Error(couponsError.message);

  const recentBancaIds = Array.from(
    new Set((orders || []).map((order: any) => order?.banca_id).filter(Boolean)),
  ) as string[];

  const favoriteBancaIds = Array.from(
    new Set(
      (favorites || [])
        .map((favorite: any) => favorite?.products?.banca_id)
        .filter(Boolean),
    ),
  ) as string[];

  const activeCoupons = (coupons || []).filter((coupon: any) =>
    isCouponActive(Boolean(coupon.active), coupon.expires_at || null, now),
  );

  const bancaIds = Array.from(
    new Set(activeCoupons.map((coupon: any) => coupon?.seller_id).filter(Boolean)),
  ) as string[];

  const { data: bancas, error: bancasError } = bancaIds.length
    ? await supabaseAdmin.from("bancas").select("id, name").in("id", bancaIds)
    : { data: [], error: null };

  if (bancasError) throw new Error(bancasError.message);

  const bancaMap = new Map((bancas || []).map((banca: any) => [banca.id, banca.name || "Banca"]));
  const expiringSoonThreshold = now + 1000 * 60 * 60 * 24 * 7;

  const items = activeCoupons
    .map((coupon: any) => {
      const source: PersonalizedCouponSource = recentBancaIds.includes(coupon.seller_id)
        ? "recent"
        : favoriteBancaIds.includes(coupon.seller_id)
          ? "favorite"
          : "marketplace";
      const benefit = parseCouponBenefit(coupon.discount_text || "");

      return {
        id: coupon.id,
        code: coupon.code,
        title: coupon.title || "Cupom",
        discount_text: coupon.discount_text || "",
        benefit_type: benefit.type,
        benefit_value: benefit.value,
        seller_id: coupon.seller_id,
        banca_name: bancaMap.get(coupon.seller_id) || "Banca",
        active: Boolean(coupon.active),
        highlight: Boolean(coupon.highlight),
        expires_at: coupon.expires_at || null,
        created_at: coupon.created_at || null,
        source,
        source_label: getSourceLabel(source),
      } satisfies PersonalizedCouponItem;
    })
    .sort((left, right) => {
      const sourceWeight = { recent: 0, favorite: 1, marketplace: 2 };
      const sourceDelta = sourceWeight[left.source] - sourceWeight[right.source];
      if (sourceDelta !== 0) return sourceDelta;
      if (left.highlight !== right.highlight) return left.highlight ? -1 : 1;
      return Date.parse(right.created_at || "") - Date.parse(left.created_at || "");
    })
    .slice(0, limit);

  const expiringSoonCount = items.filter((coupon) => {
    if (!coupon.expires_at) return false;
    const timestamp = Date.parse(coupon.expires_at);
    return Number.isFinite(timestamp) && timestamp <= expiringSoonThreshold;
  }).length;

  return {
    summary: {
      available_count: items.length,
      expiring_soon_count: expiringSoonCount,
      recent_bancas_count: recentBancaIds.length,
    } satisfies PersonalizedCouponsSummary,
    items,
  };
}

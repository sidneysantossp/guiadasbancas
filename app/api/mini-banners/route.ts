import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Surrogate-Control": "no-store",
  };

  try {
    const { data, error } = await supabase
      .from("mini_banners")
      .select("id,image_url,display_order")
      .eq("active", true)
      .order("display_order", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ success: true, data }, { headers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Erro ao buscar mini banners" }, { status: 500, headers });
  }
}

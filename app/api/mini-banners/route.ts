import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("mini_banners")
      .select("id,image_url,display_order")
      .eq("active", true)
      .order("display_order", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Erro ao buscar mini banners" }, { status: 500 });
  }
}

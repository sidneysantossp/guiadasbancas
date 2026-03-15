import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { data, error } = await supabaseAdmin
      .from("mini_banners")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Erro ao listar" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;
    const body = await request.json();
    const { image_url, display_order = 0, active = true } = body || {};
    if (!image_url) {
      return NextResponse.json({ success: false, error: "image_url é obrigatório" }, { status: 400 });
    }
    const { data, error } = await supabaseAdmin
      .from("mini_banners")
      .insert({ image_url, display_order, active })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Erro ao criar" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { JOURNALEIRO_MARKETING_PATH } from "@/lib/jornaleiro-marketing";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const DEFAULT_BANNER = {
  title: "É jornaleiro?",
  subtitle: "Registre sua banca agora",
  description:
    "Anuncie seus produtos, receba pedidos pelo WhatsApp e alcance clientes perto de você com o Guia das Bancas.",
  button_text: "Quero me cadastrar",
  button_link: JOURNALEIRO_MARKETING_PATH,
  image_url: "",
  background_color: "#000000",
  text_color: "#FFFFFF",
  button_color: "#FF5C00",
  button_text_color: "#FFFFFF",
  overlay_opacity: 0.45,
  text_position: "bottom-left",
  active: true,
};

export async function GET() {
  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Surrogate-Control": "no-store",
  };

  try {
    const { data, error } = await supabaseAdmin
      .from("vendor_banners")
      .select("*")
      .eq("active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ success: true, data: DEFAULT_BANNER }, { headers });
    }

    return NextResponse.json({ success: true, data }, { headers });
  } catch {
    return NextResponse.json({ success: true, data: DEFAULT_BANNER }, { headers });
  }
}

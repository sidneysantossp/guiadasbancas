import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const DEFAULT_BANNER = {
  title: "Indique a Plataforma e ganhe benefícios",
  subtitle: "Programa de Indicação",
  description:
    "Convide amigos e familiares para conhecer as melhores bancas. Você ajuda a comunidade e ainda pode ganhar recompensas.",
  button_text: "Indicar agora",
  button_link: "/indicar",
  image_url:
    "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?q=80&w=1600&auto=format&fit=crop",
  background_color: "#1f2937",
  text_color: "#ffffff",
  button_color: "#f97316",
  button_text_color: "#ffffff",
  overlay_opacity: 0.5,
  text_position: "center-left",
  active: true,
};

export async function GET() {
  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Surrogate-Control": "no-store",
  };

  try {
    const { data, error } = await supabaseAdmin
      .from("referral_banners")
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

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export type BrandingConfig = {
  logoUrl: string;
  logoAlt: string;
  siteName: string;
  primaryColor: string;
  secondaryColor: string;
  favicon: string;
};

const DEFAULT_BRANDING: BrandingConfig = {
  logoUrl: "",
  logoAlt: "Guia das Bancas",
  siteName: "Guia das Bancas",
  primaryColor: "#ff5c00",
  secondaryColor: "#ff7a33",
  favicon: "/favicon.svg"
};

async function readBranding(): Promise<BrandingConfig> {
  try {
    const { data, error } = await supabaseAdmin
      .from('branding')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      return DEFAULT_BRANDING;
    }

    return {
      logoUrl: data.logo_url || "",
      logoAlt: data.logo_alt || "Guia das Bancas",
      siteName: data.site_name || "Guia das Bancas",
      primaryColor: data.primary_color || "#ff5c00",
      secondaryColor: data.secondary_color || "#ff7a33",
      favicon: data.favicon || "/favicon.svg"
    };
  } catch {
    return DEFAULT_BRANDING;
  }
}

async function writeBranding(config: BrandingConfig) {
  const brandingData = {
    logo_url: config.logoUrl || null,
    logo_alt: config.logoAlt,
    site_name: config.siteName,
    primary_color: config.primaryColor,
    secondary_color: config.secondaryColor,
    favicon: config.favicon
  };

  // Verificar se já existe um registro
  const { data: existing } = await supabaseAdmin
    .from('branding')
    .select('id')
    .limit(1);

  if (existing && existing.length > 0) {
    // Atualizar registro existente
    await supabaseAdmin
      .from('branding')
      .update(brandingData)
      .eq('id', existing[0].id);
  } else {
    // Inserir novo registro
    await supabaseAdmin
      .from('branding')
      .insert(brandingData);
  }
}

function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return Boolean(authHeader && authHeader === "Bearer admin-token");
}

export async function GET(request: NextRequest) {
  try {
    const config = await readBranding();
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao carregar configurações" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const data = body?.data as Partial<BrandingConfig>;
    
    const currentConfig = await readBranding();
    const updatedConfig: BrandingConfig = {
      ...currentConfig,
      ...data,
      logoUrl: (data.logoUrl || "").toString(),
      logoAlt: (data.logoAlt || currentConfig.logoAlt).toString(),
      siteName: (data.siteName || currentConfig.siteName).toString(),
      primaryColor: (data.primaryColor || currentConfig.primaryColor).toString(),
      secondaryColor: (data.secondaryColor || currentConfig.secondaryColor).toString(),
      favicon: (data.favicon || currentConfig.favicon).toString(),
    };

    await writeBranding(updatedConfig);
    return NextResponse.json({ success: true, data: updatedConfig });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao salvar configurações" }, { status: 500 });
  }
}

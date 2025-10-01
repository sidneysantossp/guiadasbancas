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
      .select('logo_url, logo_alt, site_name, primary_color, secondary_color, favicon')
      .limit(1)
      .single();

    if (error || !data) {
      console.log('No branding config found, using default');
      return DEFAULT_BRANDING;
    }

    return {
      logoUrl: data.logo_url || "",
      logoAlt: data.logo_alt || "Guia das Bancas",
      siteName: data.site_name || "Guia das Bancas",
      primaryColor: data.primary_color || "#ff5c00",
      secondaryColor: data.secondary_color || "#ff7a33",
      favicon: data.favicon || "/favicon.svg",
    };
  } catch (e) {
    console.error('Supabase error, using default branding:', e);
    return DEFAULT_BRANDING;
  }
}

async function writeBranding(config: BrandingConfig) {
  try {
    // Tentar atualizar primeiro
    const { data: existingData } = await supabaseAdmin
      .from('branding')
      .select('id')
      .limit(1)
      .single();

    const brandingData = {
      logo_url: config.logoUrl || null,
      logo_alt: config.logoAlt,
      site_name: config.siteName,
      primary_color: config.primaryColor,
      secondary_color: config.secondaryColor,
      favicon: config.favicon,
      updated_at: new Date().toISOString()
    };

    if (existingData) {
      // Atualizar registro existente
      const { error } = await supabaseAdmin
        .from('branding')
        .update(brandingData)
        .eq('id', existingData.id);
      
      if (error) throw error;
    } else {
      // Criar novo registro
      const { error } = await supabaseAdmin
        .from('branding')
        .insert({
          ...brandingData,
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
    }
  } catch (error) {
    console.error('Error writing branding config:', error);
    throw error;
  }
}

// Função removida - tabela já existe no Supabase

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
    
    console.log('Branding PUT - received data:', JSON.stringify(data, null, 2));
    
    const currentConfig = await readBranding();
    console.log('Branding PUT - current config:', JSON.stringify(currentConfig, null, 2));
    
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

    console.log('Branding PUT - updated config:', JSON.stringify(updatedConfig, null, 2));

    await writeBranding(updatedConfig);
    
    // Verificar se salvou corretamente
    const savedConfig = await readBranding();
    console.log('Branding PUT - saved config:', JSON.stringify(savedConfig, null, 2));
    
    return NextResponse.json({ success: true, data: savedConfig });
  } catch (error) {
    console.error('Branding PUT error:', error);
    return NextResponse.json({ success: false, error: "Erro ao salvar configurações" }, { status: 500 });
  }
}

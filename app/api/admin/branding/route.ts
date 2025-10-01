import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

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
    console.log('Writing branding config:', config);
    
    // Tentar inserir primeiro (caso não exista)
    const brandingData = {
      id: '00000000-0000-0000-0000-000000000001', // ID fixo para singleton
      logo_url: config.logoUrl || null,
      logo_alt: config.logoAlt,
      site_name: config.siteName,
      primary_color: config.primaryColor,
      secondary_color: config.secondaryColor,
      favicon: config.favicon,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Primeiro tentar inserir
    let { data, error } = await supabaseAdmin
      .from('branding')
      .insert(brandingData)
      .select();

    // Se falhar por conflito, fazer update
    if (error && error.code === '23505') { // Unique constraint violation
      console.log('Record exists, updating...');
      const updateData = {
        id: brandingData.id,
        logo_url: brandingData.logo_url,
        logo_alt: brandingData.logo_alt,
        site_name: brandingData.site_name,
        primary_color: brandingData.primary_color,
        secondary_color: brandingData.secondary_color,
        favicon: brandingData.favicon,
        updated_at: brandingData.updated_at
      };
      
      const result = await supabaseAdmin
        .from('branding')
        .update(updateData)
        .eq('id', brandingData.id)
        .select();
      
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    console.log('Branding config saved successfully:', data);
    return data;
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

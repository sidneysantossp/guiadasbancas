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
  socialInstagram: string;
  socialFacebook: string;
  socialYoutube: string;
  socialLinkedin: string;
};

const DEFAULT_BASE64_LOGO = "data:image/png;base64,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";

const DEFAULT_BRANDING: BrandingConfig = {
  logoUrl: DEFAULT_BASE64_LOGO,
  logoAlt: "Guia das Bancas",
  siteName: "Guia das Bancas",
  primaryColor: "#ff5c00",
  secondaryColor: "#ff7a33",
  favicon: "/favicon.svg",
  socialInstagram: "",
  socialFacebook: "",
  socialYoutube: "",
  socialLinkedin: ""
};

async function readBranding(): Promise<BrandingConfig> {
  try {
    const { data, error } = await supabaseAdmin
      .from('branding')
      .select('logo_url, logo_alt, site_name, primary_color, secondary_color, favicon, social_instagram, social_facebook, social_youtube, social_linkedin')
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
      socialInstagram: data.social_instagram || "",
      socialFacebook: data.social_facebook || "",
      socialYoutube: data.social_youtube || "",
      socialLinkedin: data.social_linkedin || "",
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
      social_instagram: config.socialInstagram || null,
      social_facebook: config.socialFacebook || null,
      social_youtube: config.socialYoutube || null,
      social_linkedin: config.socialLinkedin || null,
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
        social_instagram: brandingData.social_instagram,
        social_facebook: brandingData.social_facebook,
        social_youtube: brandingData.social_youtube,
        social_linkedin: brandingData.social_linkedin,
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
      socialInstagram: (data.socialInstagram ?? currentConfig.socialInstagram ?? "").toString(),
      socialFacebook: (data.socialFacebook ?? currentConfig.socialFacebook ?? "").toString(),
      socialYoutube: (data.socialYoutube ?? currentConfig.socialYoutube ?? "").toString(),
      socialLinkedin: (data.socialLinkedin ?? currentConfig.socialLinkedin ?? "").toString(),
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

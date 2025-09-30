import { NextRequest, NextResponse } from "next/server";
import { dbQuery } from "@/lib/mysql";

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
    await ensureBrandingTable();
    const [rows] = await dbQuery<any>(`SELECT logo_url, logo_alt, site_name, primary_color, secondary_color, favicon FROM branding LIMIT 1`);
    const row = Array.isArray(rows) && rows[0];
    if (!row) return DEFAULT_BRANDING;
    return {
      logoUrl: row.logo_url || "",
      logoAlt: row.logo_alt || "Guia das Bancas",
      siteName: row.site_name || "Guia das Bancas",
      primaryColor: row.primary_color || "#ff5c00",
      secondaryColor: row.secondary_color || "#ff7a33",
      favicon: row.favicon || "/favicon.svg",
    };
  } catch (e) {
    return DEFAULT_BRANDING;
  }
}

async function writeBranding(config: BrandingConfig) {
  await ensureBrandingTable();
  const [rows] = await dbQuery<any>(`SELECT id FROM branding LIMIT 1`);
  if (Array.isArray(rows) && rows.length > 0) {
    const id = rows[0].id;
    await dbQuery(
      `UPDATE branding SET logo_url = ?, logo_alt = ?, site_name = ?, primary_color = ?, secondary_color = ?, favicon = ?, updated_at = NOW() WHERE id = ?`,
      [config.logoUrl || null, config.logoAlt, config.siteName, config.primaryColor, config.secondaryColor, config.favicon, id]
    );
  } else {
    await dbQuery(
      `INSERT INTO branding (id, logo_url, logo_alt, site_name, primary_color, secondary_color, favicon, created_at, updated_at)
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [config.logoUrl || null, config.logoAlt, config.siteName, config.primaryColor, config.secondaryColor, config.favicon]
    );
  }
}

async function ensureBrandingTable() {
  await dbQuery(
    `CREATE TABLE IF NOT EXISTS branding (
      id CHAR(36) NOT NULL PRIMARY KEY,
      logo_url TEXT,
      logo_alt VARCHAR(255) NOT NULL DEFAULT 'Guia das Bancas',
      site_name VARCHAR(255) NOT NULL DEFAULT 'Guia das Bancas',
      primary_color VARCHAR(7) NOT NULL DEFAULT '#ff5c00',
      secondary_color VARCHAR(7) NOT NULL DEFAULT '#ff7a33',
      favicon VARCHAR(500) DEFAULT '/favicon.svg',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB`
  );
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

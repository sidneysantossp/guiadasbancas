import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export type BrandingConfig = {
  logoUrl: string;
  logoAlt: string;
  siteName: string;
  primaryColor: string;
  secondaryColor: string;
  favicon: string;
};

const BRANDING_PATH = path.join(process.cwd(), "data", "branding.json");

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
    const raw = await fs.readFile(BRANDING_PATH, "utf-8");
    const parsed = JSON.parse(raw || "{}");
    return { ...DEFAULT_BRANDING, ...parsed };
  } catch {
    return DEFAULT_BRANDING;
  }
}

async function writeBranding(config: BrandingConfig) {
  await fs.mkdir(path.dirname(BRANDING_PATH), { recursive: true });
  await fs.writeFile(BRANDING_PATH, JSON.stringify(config, null, 2), "utf-8");
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

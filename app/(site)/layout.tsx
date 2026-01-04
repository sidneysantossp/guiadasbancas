import { ReactNode } from "react";
import { unstable_cache } from "next/cache";
import Navbar from "@/components/Navbar";
import AppFooter, { FooterData, SimpleCategory } from "@/components/AppFooter";
import FloatingCart from "@/components/FloatingCart";
import CookieConsent from "@/components/CookieConsent";
import SiteProviders from "@/components/SiteProviders";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { categories as fallbackCategories } from "@/components/categoriesData";
import type { BrandingConfig } from "@/types/branding";
import { CACHE_TTL } from "@/lib/data/cache";

const DEFAULT_FOOTER_DATA: FooterData = {
  title: "Guia das Bancas",
  description:
    "Conectamos você às melhores bancas da sua região. Descubra produtos, ofertas e o jornaleiro mais próximo.",
  socialLinks: {
    instagram: "https://instagram.com/guiadasbancas",
    facebook: "https://facebook.com/guiadasbancas",
    twitter: "https://twitter.com/guiadasbancas",
    youtube: "https://youtube.com/@guiadasbancas",
  },
  links: {
    institucional: [
      { id: "1", text: "Sobre nós", url: "/sobre-nos", section: "institucional", order: 1 },
      { id: "2", text: "Como funciona", url: "/como-funciona", section: "institucional", order: 2 },
      { id: "3", text: "Blog", url: "/blog", section: "institucional", order: 3 },
      { id: "4", text: "Imprensa", url: "/imprensa", section: "institucional", order: 4 },
    ],
    para_voce: [
      { id: "5", text: "Minha conta", url: "/minha-conta", section: "para_voce", order: 1 },
      { id: "6", text: "Pedidos", url: "/minha-conta?tab=pedidos", section: "para_voce", order: 2 },
      { id: "7", text: "Favoritos", url: "/minha-conta?tab=favoritos", section: "para_voce", order: 3 },
      { id: "8", text: "Suporte", url: "/suporte", section: "para_voce", order: 4 },
    ],
    para_jornaleiro: [
      { id: "9", text: "Cadastre sua banca", url: "/jornaleiro/cadastro", section: "para_jornaleiro", order: 1 },
      { id: "10", text: "Fazer login", url: "/jornaleiro/login", section: "para_jornaleiro", order: 2 },
      { id: "11", text: "Central de ajuda", url: "/jornaleiro/ajuda", section: "para_jornaleiro", order: 3 },
      { id: "12", text: "Termos para Parceiros", url: "/termos-parceiros", section: "para_jornaleiro", order: 4 },
    ],
    atalhos: [
      { id: "13", text: "Bancas perto de você", url: "/bancas-perto-de-mim", section: "atalhos", order: 1 },
      { id: "14", text: "Buscar produtos", url: "/buscar", section: "atalhos", order: 2 },
      { id: "15", text: "Ofertas relampago", url: "/promocoes", section: "atalhos", order: 3 },
      { id: "16", text: "Categorias", url: "/categorias", section: "atalhos", order: 4 },
    ],
  },
};

const getFooterCategories = unstable_cache(async (): Promise<SimpleCategory[]> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, link, order, visible")
      .eq("active", true)
      .order("order", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackCategories.map((cat, index) => ({
        id: cat.slug,
        name: cat.name,
        link: `/categorias/${cat.slug}`,
      }));
    }

    const visibleData = data.filter((cat: any) => cat.visible !== false);
    const source = visibleData.length > 0 ? visibleData : data;

    return source.map((cat: any, index: number) => ({
      id: cat.id || String(index),
      name: cat.name || "Categoria",
      link: cat.link || `/categorias/${cat.id || ""}`,
    }));
  } catch {
    return fallbackCategories.map((cat) => ({
      id: cat.slug,
      name: cat.name,
      link: `/categorias/${cat.slug}`,
    }));
  }
}, ["site-footer-categories"], { revalidate: CACHE_TTL.footer });

const getBranding = unstable_cache(async (): Promise<BrandingConfig | null> => {
  try {
    const { data, error } = await supabaseAdmin
      .from("branding")
      .select("logo_url, logo_alt, site_name, primary_color, secondary_color, favicon, social_instagram, social_facebook, social_youtube, social_linkedin")
      .limit(1)
      .single();

    if (error || !data) return null;
    return {
      logoUrl: data.logo_url || "",
      logoAlt: data.logo_alt || "Guia das Bancas",
      siteName: data.site_name || "Guia das Bancas",
      primaryColor: data.primary_color || "",
      secondaryColor: data.secondary_color || "",
      favicon: data.favicon || "",
      socialInstagram: data.social_instagram || "",
      socialFacebook: data.social_facebook || "",
      socialYoutube: data.social_youtube || "",
      socialLinkedin: data.social_linkedin || "",
    };
  } catch {
    return null;
  }
}, ["site-branding"], { revalidate: CACHE_TTL.branding });

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [footerCategories, branding] = await Promise.all([
    getFooterCategories(),
    getBranding(),
  ]);
  const brandingLogo = branding?.logoUrl
    ? { url: branding.logoUrl, alt: branding.logoAlt || "Guia das Bancas" }
    : null;

  return (
    <SiteProviders>
      <Navbar initialBranding={branding ?? undefined} />
      <main className="pt-[140px] md:pt-[80px]">{children}</main>
      <AppFooter
        initialFooterData={DEFAULT_FOOTER_DATA}
        initialCategories={footerCategories}
        initialBrandingLogo={brandingLogo}
      />
      <FloatingCart />
      <CookieConsent />
    </SiteProviders>
  );
}

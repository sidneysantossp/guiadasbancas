import { Suspense } from "react";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { categories as fallbackCategories } from "@/components/categoriesData";
import FullBanner from "@/components/FullBanner";
import MobileCategoryScroller from "@/components/MobileCategoryScroller";
import MiniCategoryBar from "@/components/MiniCategoryBar";
import CategoryCarousel from "@/components/CategoryCarousel";
import BancasSections from "@/components/BancasSections";
import nextDynamic from "next/dynamic";

export const revalidate = 30;

type HomeBanca = {
  id: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  cover: string;
  profile_image?: string;
  rating?: number;
  featured?: boolean;
  active: boolean;
  order: number;
};

type HomeCategory = {
  id: string;
  name: string;
  image: string;
  link: string;
  order: number;
};

type HeroSlide = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  gradientFrom: string;
  gradientTo: string;
  cta1Text: string;
  cta1Link: string;
  cta1Style: "primary" | "outline";
  cta2Text: string;
  cta2Link: string;
  cta2Style: "primary" | "outline";
  active: boolean;
  order: number;
};

type SliderConfig = {
  autoPlayTime: number;
  transitionSpeed: number;
  showArrows: boolean;
  showDots: boolean;
  heightDesktop: number;
  heightMobile: number;
};

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    title: "Sua banca favorita\nagora delivery",
    description: "Jornais, revistas, papelaria, snacks e muito mais direto da sua banca de confiança.",
    imageUrl: "https://images.unsplash.com/photo-1521334726092-b509a19597d6?q=80&w=1600&auto=format&fit=crop",
    imageAlt: "Banca de jornal com revistas e jornais ao fundo",
    gradientFrom: "#ff7a33",
    gradientTo: "#e64a00",
    cta1Text: "Peça agora",
    cta1Link: "/bancas-perto-de-mim",
    cta1Style: "primary",
    cta2Text: "Sou jornaleiro",
    cta2Link: "/jornaleiro",
    cta2Style: "outline",
    active: true,
    order: 1
  },
  {
    id: "slide-2",
    title: "Revistas, jornais\ne colecionáveis",
    description: "Encontre os lançamentos e clássicos nas bancas mais próximas de você.",
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
    imageAlt: "Pilha de revistas coloridas",
    gradientFrom: "#ffa366",
    gradientTo: "#ff5c00",
    cta1Text: "Ver departamentos",
    cta1Link: "/departamentos",
    cta1Style: "primary",
    cta2Text: "Bancas próximas",
    cta2Link: "/bancas-perto-de-mim",
    cta2Style: "outline",
    active: true,
    order: 2
  },
  {
    id: "slide-3",
    title: "Tudo de conveniência\nem poucos cliques",
    description: "Bebidas, snacks, pilhas, papelaria e recargas com entrega rápida.",
    imageUrl: "https://images.unsplash.com/photo-1601050690597-9b614fb3a3e7?q=80&w=1600&auto=format&fit=crop",
    imageAlt: "Loja de conveniência com prateleiras e bebidas",
    gradientFrom: "#ffd6c2",
    gradientTo: "#ff5c00",
    cta1Text: "Explorar agora",
    cta1Link: "/bancas-perto-de-mim",
    cta1Style: "primary",
    cta2Text: "Como funciona",
    cta2Link: "/minha-conta",
    cta2Style: "outline",
    active: true,
    order: 3
  }
];

const DEFAULT_SLIDER_CONFIG: SliderConfig = {
  autoPlayTime: 6000,
  transitionSpeed: 600,
  showArrows: true,
  showDots: true,
  heightDesktop: 520,
  heightMobile: 360
};

function toHeroSlide(dbSlide: any): HeroSlide {
  return {
    id: dbSlide.id,
    title: dbSlide.title,
    description: dbSlide.description,
    imageUrl: dbSlide.image_url,
    imageAlt: dbSlide.image_alt,
    gradientFrom: dbSlide.gradient_from,
    gradientTo: dbSlide.gradient_to,
    cta1Text: dbSlide.cta1_text,
    cta1Link: dbSlide.cta1_link,
    cta1Style: dbSlide.cta1_style,
    cta2Text: dbSlide.cta2_text,
    cta2Link: dbSlide.cta2_link,
    cta2Style: dbSlide.cta2_style,
    active: dbSlide.active,
    order: dbSlide.order
  };
}

function toSliderConfig(dbCfg: any): SliderConfig {
  return {
    autoPlayTime: dbCfg.auto_play_time,
    transitionSpeed: dbCfg.transition_speed,
    showArrows: dbCfg.show_arrows,
    showDots: dbCfg.show_dots,
    heightDesktop: dbCfg.height_desktop,
    heightMobile: dbCfg.height_mobile
  };
}

async function getHeroSlides(): Promise<{ slides: HeroSlide[]; config: SliderConfig }> {
  try {
    console.log("[home] 🔍 Buscando hero slides do Supabase...");
    const [{ data: slideData, error: slideError }, { data: cfgData, error: cfgError }] = await Promise.all([
      supabase.from("hero_slides").select("*").order("order", { ascending: true }),
      supabase.from("slider_config").select("*").single(),
    ]);

    if (slideError) {
      console.error("[home] ❌ Erro ao buscar hero slides:", slideError);
      console.log("[home] ⚠️ Usando DEFAULT_HERO_SLIDES como fallback");
    } else {
      console.log("[home] ✅ Hero slides carregados:", slideData?.length || 0, "slides");
    }

    if (cfgError) {
      console.error("[home] ❌ Erro ao buscar slider config:", cfgError);
      console.log("[home] ⚠️ Usando DEFAULT_SLIDER_CONFIG como fallback");
    } else {
      console.log("[home] ✅ Slider config carregado");
    }

    const slides = Array.isArray(slideData)
      ? slideData.map(toHeroSlide).filter((slide) => slide.active)
      : [];
    const config = cfgData ? toSliderConfig(cfgData) : DEFAULT_SLIDER_CONFIG;

    const result = {
      slides: slides.length > 0 ? slides : DEFAULT_HERO_SLIDES,
      config
    };

    console.log("[home] 📊 Resultado final:", {
      slidesCount: result.slides.length,
      usingDefaults: slides.length === 0,
      config: result.config
    });

    return result;
  } catch (error) {
    console.error("[home] 💥 Exception ao buscar hero slides:", error);
    console.log("[home] ⚠️ Usando dados DEFAULT como fallback");
    return { slides: DEFAULT_HERO_SLIDES, config: DEFAULT_SLIDER_CONFIG };
  }
}

async function getFeaturedBancas(limit = 50): Promise<HomeBanca[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("bancas")
      .select("id, name, address, lat, lng, cover_image, profile_image, rating, featured, active")
      .eq("active", true)
      .order("featured", { ascending: false, nullsFirst: false })
      .order("rating", { ascending: false, nullsFirst: false })
      .order("name", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("[home] Erro ao buscar bancas:", error);
      return [];
    }

    return (data || []).map((banca: any) => ({
      id: banca.id,
      name: banca.name,
      address: banca.address,
      lat: banca.lat,
      lng: banca.lng,
      cover: banca.cover_image || "",
      profile_image: banca.profile_image || "",
      rating: banca.rating ?? 4.7,
      featured: banca.featured === true,
      active: true,
      order: 0,
    }));
  } catch (error) {
    console.error("[home] Exception ao buscar bancas:", error);
    return [];
  }
}

async function getCategories(): Promise<HomeCategory[]> {
  try {
    // Usar supabaseAdmin para bypassar RLS e garantir leitura do campo visible
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("id, name, image, link, order, visible")
      .eq("active", true)
      .eq("visible", true)
      .order("order", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackCategories.map((cat, index) => ({
        id: cat.slug,
        name: cat.name,
        image: cat.image || "",
        link: `/categorias/${cat.slug}`,
        order: index,
      }));
    }

    return data.map((cat: any, index: number) => ({
      id: cat.id,
      name: cat.name,
      image: cat.image || "",
      link: cat.link,
      order: typeof cat.order === "number" ? cat.order : index,
    }));
  } catch (error) {
    console.error("[home] Exception ao buscar categorias:", error);
    return fallbackCategories.map((cat, index) => ({
      id: cat.slug,
      name: cat.name,
      image: cat.image || "",
      link: `/categorias/${cat.slug}`,
      order: index,
    }));
  }
}

const ReferralPlatformBannerWrapper = nextDynamic(
  () => import("@/components/ReferralPlatformBannerWrapper"),
  { ssr: false }
);
const MostSearchedProducts = nextDynamic(() => import("@/components/MostSearchedProducts"), { 
  ssr: false
});
const CampaignSection = nextDynamic(() => import("@/components/CampaignSection"), { 
  ssr: false
});
const BrancaleoneProducts = nextDynamic(() => import("@/components/BrancaleoneProducts"), { 
  ssr: false
});
const MiniBanners = nextDynamic(() => import("@/components/MiniBanners"), { 
  ssr: false
});
const TopReviewed = nextDynamic(() => import("@/components/TopReviewed"), {
  ssr: false
});
const FavoritePicks = nextDynamic(() => import("@/components/FavoritePicks"), {
  ssr: false
});
const TrendingProducts = nextDynamic(() => import("@/components/TrendingProducts"), {
  ssr: false
});
const MarvelComicsProducts = nextDynamic(() => import("@/components/MarvelComicsProducts"), {
  ssr: false
});
const PlanetMangaProducts = nextDynamic(() => import("@/components/PlanetMangaProducts"), {
  ssr: false
});
const ReferralBanner = nextDynamic(() => import("@/components/ReferralBanner"), { 
  ssr: false
});
const Newsletter = nextDynamic(() => import("@/components/Newsletter"), { 
  ssr: false
});
const Testimonials = nextDynamic(() => import("@/components/Testimonials"), { 
  ssr: false
});

export default async function HomePage() {
  const hero = await getHeroSlides();
  const initialBancas = await getFeaturedBancas(50);
  const initialCategories = await getCategories();
  const initialCategoryItems = initialCategories.map((cat) => ({
    key: cat.id,
    name: cat.name,
    image: cat.image,
    link: cat.link,
  }));
  return (
    <div className="">{/* full-bleed, colado na navbar */}
      <div>
        <FullBanner initialSlides={hero.slides} initialConfig={hero.config} />
      </div>
      <MobileCategoryScroller initialCategories={initialCategories} />
      <MiniCategoryBar initialItems={initialCategoryItems} />
      {/* PRIORIDADE ALTA: Primeiro scroll */}
      <Suspense fallback={null}>
        <div className="hidden md:block md:pt-2 md:pb-4 lg:pt-0 lg:pb-4">
          <CategoryCarousel initialItems={initialCategoryItems} />
        </div>
      </Suspense>

      <Suspense fallback={null}>
        <BancasSections initialBancas={initialBancas} />
      </Suspense>

      {/* Mini banners logo abaixo das bancas */}
      <Suspense fallback={null}>
        <div className="py-6">
          <MiniBanners />
        </div>
      </Suspense>

      {/* HQs & Comics */}
      <Suspense fallback={null}>
        <TrendingProducts />
      </Suspense>

      {/* Marvel Comics */}
      <Suspense fallback={null}>
        <MarvelComicsProducts />
      </Suspense>

      {/* Planet Manga */}
      <Suspense fallback={null}>
        <PlanetMangaProducts />
      </Suspense>


      {/* Mundo Marvel (Brancaleone) logo após HQs & Comics */}
      <Suspense fallback={null}>
        <BrancaleoneProducts />
      </Suspense>

      {/* Banner de Indicação da Plataforma (Referral) logo após Mundo Marvel */}
      <Suspense fallback={null}>
        <div className="py-6">
          <ReferralBanner />
        </div>
      </Suspense>

      {/* LAZY LOADING: Carrega conforme scroll, apenas com dados reais */}
      <Suspense fallback={null}>
        <MostSearchedProducts />
      </Suspense>

      {/* Bomboniere */}
      <Suspense fallback={null}>
        <TopReviewed />
      </Suspense>

      {/* Bebidas */}
      <Suspense fallback={null}>
        <FavoritePicks />
      </Suspense>

      <Suspense fallback={null}>
        <div className="py-6">
          <CampaignSection />
        </div>
      </Suspense>

      {/* Banner de Indicação da Plataforma */}
      <ReferralPlatformBannerWrapper />

      {/* Depoimentos de clientes */}
      <Suspense fallback={null}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={null}>
        <div className="pt-6 pb-16">
          <Newsletter />
        </div>
      </Suspense>
    </div>
  );
}

// Metadados para SEO
export const metadata = {
  title: 'Guia das Bancas - Encontre Revistas, Jornais e Muito Mais',
  description: 'Descubra bancas próximas e compre online revistas, jornais, doces e muito mais!',
};

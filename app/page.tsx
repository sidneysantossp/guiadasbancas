import FullBanner from "@/components/FullBanner";
import nextDynamic from "next/dynamic";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ReferralPlatformBannerWrapper = nextDynamic(
  () => import("@/components/ReferralPlatformBannerWrapper"),
  { ssr: false }
);

const MiniCategoryBar = nextDynamic(() => import("@/components/MiniCategoryBar"));
const MobileCategoryScroller = nextDynamic(() => import("@/components/MobileCategoryScroller"));
const CategoryCarousel = nextDynamic(() => import("@/components/CategoryCarousel"), { 
  ssr: false
});
const FeaturedBancas = nextDynamic(() => import("@/components/FeaturedBancas"), { 
  ssr: false
});

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
const TurmaMonicaStrip = nextDynamic(() => import("@/components/TurmaMonicaStrip"), {
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
const ReferralBanner = nextDynamic(() => import("@/components/ReferralBanner"), { 
  ssr: false
});
const Newsletter = nextDynamic(() => import("@/components/Newsletter"), { 
  ssr: false
});
const Testimonials = nextDynamic(() => import("@/components/Testimonials"), { 
  ssr: false
});

export default function HomePage() {
  return (
    <div className="">{/* full-bleed, colado na navbar */}
      <div>
        <FullBanner />
      </div>
      <MobileCategoryScroller />
      <MiniCategoryBar />
      {/* PRIORIDADE ALTA: Primeiro scroll */}
      <Suspense fallback={null}>
        <div className="hidden md:block md:pt-2 md:pb-4 lg:pt-0 lg:pb-4">
          <CategoryCarousel />
        </div>
      </Suspense>

      <Suspense fallback={null}>
        <FeaturedBancas />
      </Suspense>

      {/* Mini banners + Turma da Mônica logo abaixo das bancas */}
      <Suspense fallback={null}>
        <div className="py-6">
          <MiniBanners />
        </div>
      </Suspense>

      <Suspense fallback={null}>
        <TurmaMonicaStrip />
      </Suspense>

      {/* HQs & Comics logo após Turma da Mônica */}
      <Suspense fallback={null}>
        <TrendingProducts />
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
        <div className="pt-6 pb-0">
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

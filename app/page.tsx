import FullBanner from "@/components/FullBanner";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Banner de indicação com SSR desabilitado para evitar erros de hidratação
const ReferralPlatformBannerWrapper = dynamic(
  () => import("@/components/ReferralPlatformBannerWrapper"),
  { ssr: false }
);


// CRÍTICO: Apenas componentes above-fold carregam imediatamente
const MiniCategoryBar = dynamic(() => import("@/components/MiniCategoryBar"));
const MobileCategoryScroller = dynamic(() => import("@/components/MobileCategoryScroller"));
// PRIORIDADE ALTA: Componentes visíveis no primeiro scroll
const CategoryCarousel = dynamic(() => import("@/components/CategoryCarousel"), { 
  ssr: false
});
const FeaturedBancas = dynamic(() => import("@/components/FeaturedBancas"), { 
  ssr: false
});

// LAZY: Componentes below-fold carregam sob demanda
const MostSearchedProducts = dynamic(() => import("@/components/MostSearchedProducts"), { 
  ssr: false
});
const CampaignSection = dynamic(() => import("@/components/CampaignSection"), { 
  ssr: false
});
const BrancaleoneProducts = dynamic(() => import("@/components/BrancaleoneProducts"), { 
  ssr: false
});
const MiniBanners = dynamic(() => import("@/components/MiniBanners"), { 
  ssr: false
});
// Seções antigas baseadas em mock (TurmaDaMonica, MarvelComics, FavoritePicks, TopReviewed, NewArrivals)
// foram removidas da home para evitar qualquer dado fictício na vitrine principal.
const ReferralBanner = dynamic(() => import("@/components/ReferralBanner"), { 
  ssr: false
});
const Newsletter = dynamic(() => import("@/components/Newsletter"), { 
  ssr: false
});

// Import movido para o topo do arquivo

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

      {/* LAZY LOADING: Carrega conforme scroll, apenas com dados reais */}
      <Suspense fallback={null}>
        <MostSearchedProducts />
      </Suspense>

      <Suspense fallback={null}>
        <div className="py-6">
          <CampaignSection />
        </div>
      </Suspense>

      <Suspense fallback={null}>
        <BrancaleoneProducts />
      </Suspense>

      <Suspense fallback={null}>
        <div className="py-6">
          <MiniBanners />
        </div>
      </Suspense>

      <Suspense fallback={null}>
        <div className="py-6">
          <ReferralBanner />
        </div>
      </Suspense>

      {/* Banner de Indicação da Plataforma */}
      <ReferralPlatformBannerWrapper />

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

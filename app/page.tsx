import FullBanner from "@/components/FullBanner";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Banner de indicação com SSR desabilitado para evitar erros de hidratação
const ReferralPlatformBannerWrapper = dynamic(
  () => import("@/components/ReferralPlatformBannerWrapper"),
  { ssr: false, loading: () => <div className="py-6"><div className="container-max"><div className="h-64 bg-gray-200 rounded-2xl"></div></div></div> }
);


// CRÍTICO: Apenas componentes above-fold carregam imediatamente
const MiniCategoryBar = dynamic(() => import("@/components/MiniCategoryBar"));
const MobileCategoryScroller = dynamic(() => import("@/components/MobileCategoryScroller"));
// PRIORIDADE ALTA: Componentes visíveis no primeiro scroll
const CategoryCarousel = dynamic(() => import("@/components/CategoryCarousel"), { 
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
});
const FeaturedBancas = dynamic(() => import("@/components/FeaturedBancas"), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});

// LAZY: Componentes below-fold carregam sob demanda
const MostSearchedProducts = dynamic(() => import("@/components/MostSearchedProducts"), { 
  ssr: false,
  loading: () => <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
});
const CampaignSection = dynamic(() => import("@/components/CampaignSection"), { 
  ssr: false,
  loading: () => <div className="h-40 bg-gray-100 animate-pulse rounded-lg" />
});
const BrancaleoneProducts = dynamic(() => import("@/components/BrancaleoneProducts"), { 
  ssr: false,
  loading: () => <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
});
const MiniBanners = dynamic(() => import("@/components/MiniBanners"), { 
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
});
const FavoritePicks = dynamic(() => import("@/components/FavoritePicks"), { 
  ssr: false,
  loading: () => <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
});
const TopReviewed = dynamic(() => import("@/components/TopReviewed"), { 
  ssr: false,
  loading: () => <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
});
const NewArrivals = dynamic(() => import("@/components/NewArrivals"), { 
  ssr: false,
  loading: () => <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
});
const ReferralBanner = dynamic(() => import("@/components/ReferralBanner"), { 
  ssr: false,
  loading: () => <div className="h-24 bg-gray-100 animate-pulse rounded-lg" />
});
const Newsletter = dynamic(() => import("@/components/Newsletter"), { 
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
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
      <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-lg mx-4" />}>
        <div className="py-8 hidden md:block">
          <CategoryCarousel />
        </div>
      </Suspense>

      <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg mx-4" />}>
        <div className="py-6">
          <FeaturedBancas />
        </div>
      </Suspense>

      {/* LAZY LOADING: Carrega conforme scroll */}
      <Suspense fallback={<div className="h-48 bg-gray-100 animate-pulse rounded-lg mx-4" />}>
        <div className="py-6">
          <MostSearchedProducts />
        </div>
      </Suspense>

      <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse rounded-lg mx-4" />}>
        <div className="py-6">
          <CampaignSection />
        </div>
      </Suspense>

      <Suspense fallback={<div className="h-48 bg-gray-100 animate-pulse rounded-lg mx-4" />}>
        <BrancaleoneProducts />
      </Suspense>

      <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-lg mx-4" />}>
        <div className="py-6">
          <MiniBanners />
        </div>
      </Suspense>

      <Suspense fallback={<div className="h-48 bg-gray-100 animate-pulse rounded-lg mx-4" />}>
        <div className="py-6">
          <FavoritePicks />
        </div>
      </Suspense>

      <Suspense fallback={<div className="h-48 bg-gray-100 animate-pulse rounded-lg mx-4" />}>
        <div className="py-6">
          <TopReviewed />
        </div>
      </Suspense>

      <Suspense fallback={<div className="h-24 bg-gray-100 animate-pulse rounded-lg mx-4" />}>
        <div className="py-6">
          <ReferralBanner />
        </div>
      </Suspense>

      <Suspense fallback={<div className="h-48 bg-gray-100 animate-pulse rounded-lg mx-4" />}>
        <div className="py-6">
          <NewArrivals />
        </div>
      </Suspense>

      {/* Banner de Indicação da Plataforma */}
      <ReferralPlatformBannerWrapper />

      <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-lg mx-4" />}>
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

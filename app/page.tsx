import FullBanner from "@/components/FullBanner";
import TrustBadges from "@/components/TrustBadges";
import dynamic from "next/dynamic";

// Componentes com SSR habilitado (removido ssr: false)
const CategoryCarousel = dynamic(() => import("@/components/CategoryCarousel"));
const MiniCategoryBar = dynamic(() => import("@/components/MiniCategoryBar"));
const MobileCategoryScroller = dynamic(() => import("@/components/MobileCategoryScroller"));
const FeaturedBancas = dynamic(() => import("@/components/FeaturedBancas"));
const MostSearchedProducts = dynamic(() => import("@/components/MostSearchedProducts"));

// Componentes below-fold - lazy load
const CampaignSection = dynamic(() => import("@/components/CampaignSection"), { ssr: false });
const TrendingProducts = dynamic(() => import("@/components/TrendingProducts"), { ssr: false });
const MiniBanners = dynamic(() => import("@/components/MiniBanners"), { ssr: false });
const FavoritePicks = dynamic(() => import("@/components/FavoritePicks"), { ssr: false });
const TopReviewed = dynamic(() => import("@/components/TopReviewed"), { ssr: false });
const NewArrivals = dynamic(() => import("@/components/NewArrivals"), { ssr: false });
const ReferralBanner = dynamic(() => import("@/components/ReferralBanner"), { ssr: false });
const Newsletter = dynamic(() => import("@/components/Newsletter"), { ssr: false });
const VendorSignupBanner = dynamic(() => import("@/components/VendorSignupBanner"), { ssr: false });

export default function HomePage() {
  return (
    <div className="">{/* full-bleed, colado na navbar */}
      {/* Hero: colado na navbar (sem margem extra) */}
      <div className="mt-0">
        <FullBanner />
      </div>
      {/* Mobile: small icon scroller below hero */}
      <MobileCategoryScroller />
      {/* Desktop sticky bar */}
      <MiniCategoryBar />
      {/* Trust badges under hero (ecommerce style, centered) */}
      <div className="py-3">
        <div className="container-max">
          <TrustBadges variant="ecom" className="md:justify-items-center max-w-6xl mx-auto" />
        </div>
      </div>
      {/* Desktop: categories should appear below the hero */}
      <div className="py-8 hidden md:block">
        <CategoryCarousel />
      </div>
      <div className="py-6">
        <FeaturedBancas />
      </div>
      <div className="py-6">
        <MostSearchedProducts />
      </div>
      <div className="py-6">
        <CampaignSection />
      </div>
      <div className="py-6">
        <TrendingProducts />
      </div>
      <div className="py-6">
        <MiniBanners />
      </div>
      <div className="py-6">
        <FavoritePicks />
      </div>
      <div className="py-6">
        <TopReviewed />
      </div>
      <div className="py-6">
        <ReferralBanner />
      </div>
      <div className="py-6">
        <NewArrivals />
      </div>
      <div className="py-6">
        <VendorSignupBanner />
      </div>
      <div className="py-6">
        <Newsletter />
      </div>
    </div>
  );
}

// Metadados para SEO
export const metadata = {
  title: 'Guia das Bancas - Encontre Revistas, Jornais e Muito Mais',
  description: 'Descubra bancas próximas e compre online revistas, jornais, doces e muito mais!',
};

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";

export type AdItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta?: string;
  rating?: number;
  reviews?: number;
  badgeText?: string; // ex: 45% OFF
  vendorName: string;
  vendorAvatar: string;
  vendorId: string;
};

const ADS: AdItem[] = [
  {
    id: "ad1",
    title: "Summer Blowout Sale!",
    subtitle: "Dive into savings with our Summer Blowout Sale! Enjoy incredible deals.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    cta: "",
    rating: 4.7,
    reviews: 34,
    vendorName: "Banca Paulista",
    vendorAvatar: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=96&auto=format&fit=crop",
    vendorId: "b1",
  },
  {
    id: "ad2",
    title: "Taste the Flavors",
    subtitle: "Indulge in culinary delights at our Food Fest Extravaganza!",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
    cta: "",
    rating: 4.7,
    reviews: 31,
    badgeText: "45% OFF",
    vendorName: "Banca Moema",
    vendorAvatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=96&auto=format&fit=crop",
    vendorId: "b3",
  },
  {
    id: "ad3",
    title: "Bold Bites, Black Bun Delight",
    subtitle: "Discover unbeatable deals with our 45% off sale! Explore a wide range.",
    image: "https://images.unsplash.com/photo-1550547660-8b1290f252a9?q=80&w=1200&auto=format&fit=crop",
    cta: "Order Now!",
    rating: 4.7,
    reviews: 33,
    vendorName: "Banca Jardins",
    vendorAvatar: "https://images.unsplash.com/photo-1546456073-6712f79251bb?q=80&w=96&auto=format&fit=crop",
    vendorId: "b5",
  },
  {
    id: "ad4",
    title: "Incredible Deals",
    subtitle: "Your favorites with special discounts this week only!",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop",
    rating: 4.6,
    reviews: 28,
    vendorName: "Banca Ibirapuera",
    vendorAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=96&auto=format&fit=crop",
    vendorId: "b2",
  },
  {
    id: "ad5",
    title: "Novidades da Semana",
    subtitle: "Itens colecionáveis e edições limitadas com preços especiais.",
    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop",
    cta: "",
    rating: 4.8,
    reviews: 26,
    vendorName: "Banca Augusta",
    vendorAvatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=96&auto=format&fit=crop",
    vendorId: "b4",
  },
];

function RatingPill({ rating = 4.7, reviews = 30 }: { rating?: number; reviews?: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-[#fff3ec] text-[#ff5c00] px-2 py-[6px] text-xs font-semibold shadow-sm">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.869 1.402-8.168L.132 9.21l8.2-1.192z" />
      </svg>
      {rating.toFixed(1)} <span className="opacity-70">({reviews}+)</span>
    </span>
  );
}

function HeartButton() {
  return (
    <button aria-label="Favoritar" className="ml-auto rounded-full p-2 text-gray-500 hover:text-[#ff5c00]">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </button>
  );
}

function AdCard({ ad }: { ad: AdItem }) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
      <div className="relative h-40 sm:h-44 w-full">
        <Image src={ad.image} alt={ad.title} fill className="object-cover" />
        {ad.badgeText && (
          <span className="absolute top-3 left-3 rounded-xl bg-white/90 text-[#ff5c00] text-xs font-extrabold px-2 py-1 shadow">{ad.badgeText}</span>
        )}
        {ad.cta && (
          <span className="absolute left-3 bottom-3 rounded-md bg-[#ff5c00] text-white text-[11px] font-semibold px-2 py-1 shadow">{ad.cta}</span>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center">
          <RatingPill rating={ad.rating} reviews={ad.reviews} />
          <HeartButton />
        </div>
        <div className="mt-2 font-semibold text-[15px] leading-snug line-clamp-2">{ad.title}</div>
        <div className="text-[12px] text-gray-600 line-clamp-2">{ad.subtitle}</div>
        <div className="mt-3 flex items-center justify-between">
          <Link href={("/bancas/" + ad.vendorId) as Route} className="flex items-center gap-2 min-w-0 hover:opacity-90">
            <div className="h-7 w-7 rounded-full overflow-hidden border border-white shadow">
              <Image src={ad.vendorAvatar} alt={ad.vendorName} width={28} height={28} className="h-full w-full object-cover" />
            </div>
            <span className="text-xs font-medium text-gray-800 truncate">{ad.vendorName}</span>
          </Link>
          <Link href="#" className="inline-flex items-center justify-center rounded-full border border-[#ff5c00] text-[#ff5c00] hover:bg-[#fff3ec] w-8 h-8 shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdsHighlights() {
  const [w, setW] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const perView = w < 640 ? 1 : w < 1024 ? 2 : 4;

  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);
  const items = useMemo(() => {
    const minCount = 6;
    if (ADS.length >= minCount) return ADS;
    const out: AdItem[] = [];
    let i = 0;
    while (out.length < minCount) {
      out.push(ADS[i % ADS.length]);
      i++;
    }
    return out;
  }, []);
  const trackItems = useMemo(() => [...items, ...items], [items]);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => i + 1);
      setAnimating(true);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="w-full">
      <div className="container-max">
        <div
          className="rounded-2xl p-4 sm:p-6"
          style={{
            backgroundImage: "url(https://stackfood-react.6amtech.com/static/paidAdds.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Image src="https://stackfood-react.6amtech.com/_next/static/media/fire.612dd1de.svg" alt="Fogo" width={23} height={23} />
            <h2 className="text-lg sm:text-xl font-semibold">Ofertas Relâmpago</h2>
          </div>
          <p className="text-sm text-gray-700">Confira ofertas especiais das bancas anunciantes e destaque os principais produtos da sua região.</p>
        </div>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex gap-4"
              style={{
                transform: `translateX(-${(index * (100 / perView))}%)`,
                transition: animating ? "transform 600ms ease" : "none",
              }}
              onTransitionEnd={() => {
                if (index >= items.length) {
                  setAnimating(false);
                  setIndex(0);
                  requestAnimationFrame(() => setAnimating(true));
                }
              }}
            >
              {trackItems.map((ad, i) => (
                <div key={`${ad.id}-${i}`} style={{ flex: `0 0 calc(${100 / perView}% - 1rem)` }} className="shrink-0">
                  <AdCard ad={ad} />
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

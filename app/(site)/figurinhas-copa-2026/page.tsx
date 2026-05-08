import type { Metadata } from "next";
import WorldCupLaunchLanding from "@/components/landing/WorldCupLaunchLanding";
import { getPublicCategories } from "@/lib/data/categories";

const PATH = "/figurinhas-copa-2026";
const CANONICAL_PATH = "/copa-2026/pre-venda-album-figurinhas";
const TITLE = "Figurinhas e álbuns da Copa 2026 perto de você | Guia das Bancas";
const DESCRIPTION =
  "Encontre bancas cadastradas perto de você para comprar, reservar ou encomendar álbum, envelopes e figurinhas da Copa do Mundo 2026.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: CANONICAL_PATH,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PATH,
    siteName: "Guia das Bancas",
    type: "website",
  },
  keywords: [
    "figurinhas copa 2026 perto de mim",
    "comprar figurinhas copa 2026",
    "album copa 2026 perto de mim",
    "pré-venda álbum copa 2026",
    "pré-venda figurinhas copa 2026",
    "bancas de jornal perto de mim",
    "comprar figurinhas em banca",
  ],
};

export default async function WorldCupStickersCampaignPage() {
  const initialCategories = await getPublicCategories();

  return <WorldCupLaunchLanding initialCategories={initialCategories} />;
}

import type { Metadata } from "next";
import JornaleiroPartnerLanding from "@/components/landing/JornaleiroPartnerLanding";
import { JOURNALEIRO_MARKETING_PATH } from "@/lib/jornaleiro-marketing";
import { loadJornaleiroPartnerLandingDocument } from "@/lib/jornaleiro-partner-landing";

export const metadata: Metadata = {
  title: "Sua banca vendendo pela internet | Guia das Bancas",
  description:
    "Cadastre sua banca, apareça no Google, receba pedidos por WhatsApp e Pix e ative sua vitrine online direto do celular com o Guia das Bancas.",
  alternates: {
    canonical: JOURNALEIRO_MARKETING_PATH,
  },
  openGraph: {
    title: "Sua banca vendendo pela internet | Guia das Bancas",
    description:
      "Loja online para bancas de jornal com presença no Google, pedidos por WhatsApp e catálogo parceiro integrado.",
    url: JOURNALEIRO_MARKETING_PATH,
    siteName: "Guia das Bancas",
    type: "website",
  },
  keywords: [
    "cadastro de banca de jornal",
    "plataforma para jornaleiro",
    "loja online para banca",
    "banca no Google",
    "pedido por WhatsApp para banca",
    "catálogo de distribuidores para banca",
  ],
};

export default async function ParaJornaleirosPage() {
  const { document } = await loadJornaleiroPartnerLandingDocument();
  return <JornaleiroPartnerLanding content={document} />;
}

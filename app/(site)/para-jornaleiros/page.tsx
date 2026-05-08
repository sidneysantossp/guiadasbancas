import type { Metadata } from "next";
import JornaleiroPartnerLanding from "@/components/landing/JornaleiroPartnerLanding";
import { JOURNALEIRO_MARKETING_PATH } from "@/lib/jornaleiro-marketing";

export const metadata: Metadata = {
  title: "Sua banca pronta para vender no WhatsApp | Guia das Bancas",
  description:
    "Cadastre sua banca grátis e comece com 4.000+ produtos já disponíveis para vender direto pelo WhatsApp.",
  alternates: {
    canonical: JOURNALEIRO_MARKETING_PATH,
  },
  openGraph: {
    title: "Sua banca pronta para vender no WhatsApp | Guia das Bancas",
    description:
      "Cadastro gratuito para jornaleiros com catálogo pronto e venda direta pelo WhatsApp.",
    url: JOURNALEIRO_MARKETING_PATH,
    siteName: "Guia das Bancas",
    type: "website",
  },
  keywords: [
    "cadastro de banca de jornal",
    "plataforma para jornaleiro",
    "vender pelo WhatsApp",
    "catálogo pronto para banca",
    "pedido por WhatsApp para banca",
    "banca de jornal online",
  ],
};

export default function ParaJornaleirosPage() {
  return <JornaleiroPartnerLanding />;
}

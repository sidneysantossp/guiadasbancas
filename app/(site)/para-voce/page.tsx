import type { Metadata } from "next";
import ConsumerReservationLanding from "@/components/landing/ConsumerReservationLanding";
import {
  CONSUMER_RESERVATION_PATH,
  DEFAULT_CONSUMER_RESERVATION_DOCUMENT,
} from "@/lib/consumer-reservation-marketing";

export const metadata: Metadata = {
  title: "Pré-reserva de figurinhas e álbuns da Copa 2026 | Guia das Bancas",
  description:
    "Encontre bancas perto de você, fale direto com o jornaleiro e faça a pré-reserva de figurinhas e álbuns da Copa 2026 com mais praticidade, segurança e preço justo.",
  alternates: {
    canonical: CONSUMER_RESERVATION_PATH,
  },
  openGraph: {
    title: "Pré-reserva de figurinhas e álbuns da Copa 2026 | Guia das Bancas",
    description:
      "Garanta sua pré-reserva com bancas da sua região, direto com o jornaleiro, antes que o lote acabe.",
    url: CONSUMER_RESERVATION_PATH,
    siteName: "Guia das Bancas",
    type: "website",
  },
  keywords: [
    "pré-reserva copa 2026",
    "figurinhas copa 2026",
    "álbum copa 2026",
    "banca perto de mim",
    "jornaleiro perto de mim",
    "comprar figurinhas copa 2026",
  ],
};

export default function ParaVocePage() {
  return <ConsumerReservationLanding content={DEFAULT_CONSUMER_RESERVATION_DOCUMENT} />;
}

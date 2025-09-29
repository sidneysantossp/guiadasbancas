"use client";

import Image from "next/image";
import Link from "next/link";

export default function VendorSignupBanner() {
  return (
    <section className="w-full">
      <div className="container-max">
        <Link href={"/jornaleiro/registrar" as any} aria-label="Ir para cadastro de jornaleiro" className="relative w-full overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow block">
          <div className="relative h-96 sm:h-64 md:h-72 w-full">
            <Image
              src="https://videos.openai.com/vg-assets/assets%2Ftask_01k5j8fxmtftwsry71a12br25b%2F1758328370_img_1.webp?st=2025-09-29T01%3A16%3A44Z&se=2025-10-05T02%3A16%3A44Z&sks=b&skt=2025-09-29T01%3A16%3A44Z&ske=2025-10-05T02%3A16%3A44Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=5e5fc900-07cf-43e7-ab5b-314c0d877bb0&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=hGGb1M9QCdg2VCguQMGFJvWKVUdxita%2FC6ibbsloAMk%3D&az=oaivgprodscus"
              alt="Cadastre sua banca de jornal"
              fill
              className="object-cover object-[100%_0%] sm:object-[100%_30%]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 to-black/25 px-3 sm:px-5 md:px-8 text-white flex flex-col items-start justify-end md:justify-center gap-2 sm:gap-3 pb-6 sm:pb-6 md:pb-8">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
                É jornaleiro?
              </h3>
              <div className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight">
                Registre sua banca agora
              </div>
              <p className="text-sm sm:text-base max-w-2xl opacity-90">
                Anuncie seus produtos, receba pedidos pelo WhatsApp e alcance clientes perto de você com o Guia das Bancas.
              </p>
              <Link
                href={"/jornaleiro/registrar" as any}
                className="inline-flex items-center justify-center rounded-md bg-white text-[#ff5c00] text-sm font-semibold px-4 py-2 shadow hover:opacity-95"
                onClick={(e) => e.stopPropagation()}
              >
                Quero me cadastrar
              </Link>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

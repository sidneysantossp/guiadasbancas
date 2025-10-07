"use client";

import Link from "next/link";
import Image from "next/image";

export default function ReferralBanner() {
  return (
    <section className="w-full">
      <div className="container-max">
        <div className="relative h-60 sm:h-72 md:h-80 w-full overflow-hidden rounded-2xl">
          <Image
            src="https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?q=80&w=1600&auto=format&fit=crop"
            alt="Indique a Plataforma"
            fill
            className="object-cover rounded-2xl"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20 px-4 sm:px-6 md:px-8 py-12 sm:py-16 text-white flex flex-col items-start justify-center gap-3">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight">
              Indique a Plataforma e ganhe benefícios
            </h3>
            <p className="text-sm sm:text-base max-w-2xl opacity-90">
              Convide amigos e familiares para conhecer as melhores bancas. Você ajuda a comunidade e ainda pode ganhar recompensas.
            </p>
            <Link
              href="/minha-conta"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-base font-bold text-[#ff5c00] shadow-xl hover:bg-white/95 hover:scale-105 transition-all duration-200 min-w-[160px] sm:px-7 sm:py-4 sm:text-lg sm:min-w-[200px]"
            >
              Indicar agora
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

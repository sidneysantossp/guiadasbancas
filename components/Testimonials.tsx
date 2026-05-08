"use client";

import { useState, useEffect, useMemo } from "react";

type Testimonial = {
  id: string;
  name: string;
  location: string;
  avatar: string;
  text: string;
  rating: number;
  timeAgo: string;
};

// Depoimentos de consumidores sobre a experiência de compra nas bancas
const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Ana Paula Costa",
    location: "Centro",
    avatar: "/images/testimonials/ana-paula-costa.png",
    text: "Eu sinceramente não imaginava que dava pra comprar figurinha direto pelo WhatsApp da banca. Sempre achei que tinha que sair rodando. Falei com o jornaleiro, ele já me disse o que tinha e deixou separado. Resolvi tudo em minutos. Muito mais prático e seguro.",
    rating: 5,
    timeAgo: "5 dias atrás",
  },
  {
    id: "2",
    name: "Carlos Eduardo",
    location: "Zona Norte",
    avatar: "/images/testimonials/carlos-eduardo.png",
    text: "Achei que isso era só mais um site, mas quando vi que dava pra falar direto com a banca mudou tudo. Eu já pergunto antes, sei se tem e só vou lá pra buscar. Economiza tempo demais. Não volto mais pro jeito antigo.",
    rating: 4,
    timeAgo: "2 semanas atrás",
  },
  {
    id: "3",
    name: "Fernanda Lima",
    location: "Zona Oeste",
    avatar: "/images/testimonials/fernanda-lima.png",
    text: "Meu filho coleciona e antes era um caos, a gente ia em várias bancas sem saber se tinha. Agora eu vejo, falo direto e já vou certo. É uma evolução muito grande na forma de comprar, facilita demais.",
    rating: 5,
    timeAgo: "4 dias atrás",
  },
  {
    id: "4",
    name: "Rodrigo Martins",
    location: "Vila Mariana",
    avatar: "/images/testimonials/rodrigo-martins.png",
    text: "Eu sempre comprava tudo online ou ficava rodando atrás de banca. Quando vi que dava pra falar direto com o jornaleiro pelo WhatsApp, mudou completamente. Perguntei, ele confirmou o que tinha e já fui buscar. Simples, rápido e sem erro. Não imaginava que isso já existia.",
    rating: 5,
    timeAgo: "3 dias atrás",
  },
  {
    id: "5",
    name: "Patrícia Souza",
    location: "São Paulo",
    avatar: "/images/testimonials/patricia-souza.png",
    text: "Achei que era só mais um site, mas quando usei de verdade vi o quanto facilita. Você não precisa mais sair sem saber se vai encontrar. Fala direto com a banca, já sabe o que tem e resolve tudo muito mais rápido. É muito mais seguro comprar assim.",
    rating: 5,
    timeAgo: "1 semana atrás",
  }
];

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${i < value ? "text-amber-400" : "text-gray-300"}`}
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.88L18.18 22 12 18.77 5.82 22 7 14.15l-5-4.88 6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-full hover:shadow-md transition-shadow">
      {/* Header com avatar e info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-emerald-100">
          <img src={testimonial.avatar} alt={testimonial.name} className="object-cover w-full h-full" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
          <p className="text-sm text-emerald-600">{testimonial.location}</p>
        </div>
      </div>

      {/* Texto do depoimento */}
      <div className="flex-1 mb-4">
        <p className="text-gray-600 text-[15px] leading-relaxed italic">
          "{testimonial.text}"
        </p>
      </div>

      {/* Footer com rating e tempo */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Avaliação:</span>
          <Stars value={testimonial.rating} />
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-400">{testimonial.timeAgo}</span>
          <p className="text-sm font-medium text-[#ff5c00]">{testimonial.name.split(" ")[0]}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [w, setW] = useState<number>(1200);
  
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const perView = w < 640 ? 1 : w < 1024 ? 2 : 3;
  const isMobile = w < 640;

  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);

  const testimonials = useMemo(() => TESTIMONIALS, []);
  const loopItems = useMemo(() => [...testimonials, ...testimonials], [testimonials]);

  // Auto-play
  useEffect(() => {
    if (isMobile) return;
    const id = setInterval(() => {
      setIndex((i) => i + 1);
      setAnimating(true);
    }, 5000);
    return () => clearInterval(id);
  }, [isMobile]);

  const prev = () => {
    if (index === 0) {
      setAnimating(false);
      setIndex(testimonials.length);
      requestAnimationFrame(() => {
        setAnimating(true);
        setIndex(testimonials.length - 1);
      });
    } else {
      setAnimating(true);
      setIndex((i) => i - 1);
    }
  };

  const next = () => {
    setAnimating(true);
    setIndex((i) => i + 1);
  };

  return (
    <section className="w-full py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full mb-3">
            Depoimentos
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            O que as pessoas estão descobrindo agora
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Compras mais rápidas, diretas e sem sair procurando — direto com a banca
          </p>
        </div>

        {/* Carrossel */}
        {isMobile ? (
          // Mobile: scroll horizontal
          <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
            <div className="flex gap-4 snap-x snap-mandatory pb-4">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="shrink-0 snap-start"
                  style={{ flex: "0 0 calc(85%)" }}
                >
                  <TestimonialCard testimonial={t} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Desktop: carrossel com setas
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex gap-6"
                style={{
                  transform: `translateX(-${(index * (100 / perView))}%)`,
                  transition: animating ? "transform 600ms ease" : "none",
                }}
                onTransitionEnd={() => {
                  if (index >= testimonials.length) {
                    setAnimating(false);
                    setIndex(0);
                    requestAnimationFrame(() => setAnimating(true));
                  }
                }}
              >
                {loopItems.map((t, i) => (
                  <div
                    key={`${t.id}-${i}`}
                    className="shrink-0"
                    style={{ flex: `0 0 calc((100% - ${(perView - 1) * 1.5}rem) / ${perView})` }}
                  >
                    <TestimonialCard testimonial={t} />
                  </div>
                ))}
              </div>
            </div>

            {/* Setas */}
            <button
              type="button"
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-50 hover:shadow-lg transition-all"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Próximo"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-50 hover:shadow-lg transition-all"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}

        {/* Indicadores de página (mobile) */}
        {isMobile && (
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === index % testimonials.length
                    ? "w-6 bg-[#ff5c00]"
                    : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}

        <style jsx>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </section>
  );
}

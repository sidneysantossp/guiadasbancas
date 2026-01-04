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

// Depoimentos reais de consumidores sobre a experiência de compra nas bancas
const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Maria Clara",
    location: "Zona Sul, São Paulo",
    avatar: "/placeholder/user-avatar.svg",
    text: "Não sabia que as bancas de jornal estavam no digital! Achei incrível poder ver os produtos antes de ir até lá. Encomendei uma revista rara e o jornaleiro já separou pra mim.",
    rating: 5,
    timeAgo: "3 dias atrás",
  },
  {
    id: "2",
    name: "Roberto Santos",
    location: "Zona Leste, São Paulo",
    avatar: "/placeholder/user-avatar.svg",
    text: "Finalmente consegui encontrar as HQs que procurava há anos! A facilidade de poder encomendar direto com o jornaleiro e buscar perto de casa é sensacional.",
    rating: 5,
    timeAgo: "1 semana atrás",
  },
  {
    id: "3",
    name: "Ana Paula Costa",
    location: "Centro, São Paulo",
    avatar: "/placeholder/user-avatar.svg",
    text: "Comprei pelo WhatsApp direto com a banca do meu bairro. O jornaleiro super atencioso, separou tudo certinho. Experiência de compra muito melhor que qualquer grande loja!",
    rating: 5,
    timeAgo: "5 dias atrás",
  },
  {
    id: "4",
    name: "Carlos Eduardo",
    location: "Zona Norte, São Paulo",
    avatar: "/placeholder/user-avatar.svg",
    text: "Que descoberta! Moro longe de bancas e achava que tinha que comprar tudo online de fora. Agora encomendo da banca mais próxima e retiro no caminho do trabalho.",
    rating: 4,
    timeAgo: "2 semanas atrás",
  },
  {
    id: "5",
    name: "Fernanda Lima",
    location: "Zona Oeste, São Paulo",
    avatar: "/placeholder/user-avatar.svg",
    text: "Meu filho é fã de figurinhas e sempre tinha que rodar várias bancas. Agora vejo o estoque de cada uma pelo app e já sei onde tem o que ele quer. Praticidade total!",
    rating: 5,
    timeAgo: "4 dias atrás",
  },
  {
    id: "6",
    name: "João Pedro",
    location: "Pinheiros, São Paulo",
    avatar: "/placeholder/user-avatar.svg",
    text: "Colecionador de revistas antigas aqui! A plataforma me conectou com bancas que têm edições raras. Já fiz várias encomendas e todas chegaram perfeitas.",
    rating: 5,
    timeAgo: "1 semana atrás",
  },
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
  const [w, setW] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  
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
            O que dizem os consumidores
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Histórias reais de pessoas que descobriram a facilidade de comprar na banca de jornal pelo digital
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

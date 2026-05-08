"use client";

import Image from "next/image";
import Link from "next/link";
import {
  IconCalendarCheck,
  IconChevronRight,
  IconCircleCheck,
  IconMapPin,
  IconMessages,
  IconPackage,
  IconSearch,
  IconShieldCheck,
  IconStar,
  IconUsers,
} from "@tabler/icons-react";
import BancasPertoDeMimPageClient from "@/components/BancasPertoDeMimPageClient";
import type { PublicCategory } from "@/lib/data/categories";

type WorldCupLaunchLandingProps = {
  initialCategories: PublicCategory[];
};

const heroImage = "/images/landing/figurinhas-copa-2026-full-banner.png";

const counterImage = "/images/landing/jornaleiro-figurinhas-copa-2026.png";
const finalCtaImage = "/images/landing/figurinhas-copa-2026-full-banner.png";

const heroBullets = [
  {
    icon: IconMapPin,
    title: "Bancas reais perto de você",
  },
  {
    icon: IconMessages,
    title: "Contato direto via WhatsApp",
  },
  {
    icon: IconPackage,
    title: "Consulte estoque e encomenda",
  },
];

const proofPoints = [
  {
    value: "+75",
    label: "bancas cadastradas para atendimento local",
  },
  {
    value: "WhatsApp",
    label: "para confirmar antes de sair de casa",
  },
  {
    value: "Perto de você",
    label: "busca com distância e ordenação por região",
  },
];

const painPoints = [
  "Ir até a banca e descobrir que acabou.",
  "Não saber quais bancas realmente atendem colecionadores.",
  "Perder tempo procurando sem conseguir resposta rápida.",
];

const solutionPoints = [
  "Veja bancas próximas e escolha por localização.",
  "Fale direto com o jornaleiro antes de sair.",
  "Reserve, encomende ou tire dúvidas em poucos cliques.",
];

const steps = [
  {
    icon: IconMapPin,
    title: "Busque sua região",
    text: "Use sua localização para ver primeiro as bancas mais próximas de você.",
  },
  {
    icon: IconSearch,
    title: "Veja onde consultar figurinhas",
    text: "Compare endereço, distância e perfil para evitar ir ao lugar errado.",
  },
  {
    icon: IconMessages,
    title: "Fale direto com a banca",
    text: "Confirme disponibilidade, preço, encomenda e retirada antes de sair.",
  },
];

const socialProof = [
  {
    quote: "Consigo falar antes de sair e já vou direto na banca certa.",
    context: "Jornada de compra local",
  },
  {
    quote: "É mais rápido do que ficar procurando no bairro sem saber quem tem.",
    context: "Busca por figurinhas",
  },
  {
    quote: "Quando não tem pronta entrega, já combino a encomenda pelo WhatsApp.",
    context: "Compra sob encomenda",
  },
];

const benefits = [
  {
    icon: IconMapPin,
    title: "Bancas reais próximas",
    text: "Nada de tentativa no escuro. Você começa por pontos físicos cadastrados perto da sua região.",
  },
  {
    icon: IconMessages,
    title: "Contato direto",
    text: "Fale com o jornaleiro para confirmar álbum, envelopes, repetidas, kits, pagamento e retirada.",
  },
  {
    icon: IconPackage,
    title: "Mais chance de encontrar",
    text: "Acompanhe disponibilidade, encomenda e chegada de novos lotes sem rodar a cidade inteira.",
  },
  {
    icon: IconCalendarCheck,
    title: "Economia de tempo",
    text: "Resolva antes de sair: escolha a banca, combine o atendimento e vá direto ao ponto.",
  },
];

const objections = [
  {
    question: "Posso falar direto com a banca?",
    answer:
      "Sim. Você abre o perfil da banca e entra em contato direto para confirmar disponibilidade antes de ir.",
  },
  {
    question: "As bancas realmente têm figurinhas?",
    answer:
      "A disponibilidade muda ao longo do dia. Por isso a página leva você até a banca para confirmar estoque, encomenda ou previsão de chegada com o jornaleiro.",
  },
  {
    question: "Preciso pagar algo para usar?",
    answer:
      "Não. O acesso ao Guia das Bancas é gratuito para encontrar bancas próximas e iniciar o contato.",
  },
  {
    question: "Posso reservar figurinhas?",
    answer:
      "Depende da política de cada banca. Fale direto com o jornaleiro e combine reserva, retirada, entrega ou encomenda.",
  },
];

export default function WorldCupLaunchLanding({ initialCategories }: WorldCupLaunchLandingProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Figurinhas e álbum da Copa 2026 perto de você",
    description:
      "Encontre bancas cadastradas perto de você para comprar, reservar ou encomendar álbum, envelopes e figurinhas da Copa do Mundo 2026.",
    url: "https://www.guiadasbancas.com.br/figurinhas-copa-2026",
    publisher: {
      "@type": "Organization",
      name: "Guia das Bancas",
      url: "https://www.guiadasbancas.com.br",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="bg-[#fbfaf6] text-[#111827]">
        <section className="relative isolate overflow-hidden bg-white text-[#111827]">
          <div className="relative w-full overflow-hidden bg-white md:h-[600px]">
            <Image
              src={heroImage}
              alt="Álbum e figurinhas FIFA World Cup 2026 com chamada para encontrar bancas perto de você"
              fill
              priority
              sizes="100vw"
              className="launch-hero-image object-contain md:object-cover"
            />
            <div className="aspect-[1774/887] w-full md:hidden" />
          </div>

          <div className="border-y border-[#e7e2d8] bg-white">
            <div className="container-max grid gap-5 py-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-4xl">
                <p className="text-sm font-black uppercase text-[#ff5c00]">
                  Figurinhas da Copa 2026
                </p>
                <h1 className="mt-2 text-3xl font-black leading-tight text-[#111827] md:text-5xl">
                  Complete seu álbum da Copa sem perder tempo procurando figurinha.
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-[#4b5563] md:text-lg">
                  Encontre bancas próximas e confirme pelo WhatsApp quais figurinhas,
                  álbuns, envelopes ou kits estão disponíveis antes de sair de casa.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {heroBullets.map(({ icon: Icon, title }) => (
                    <span
                      key={title}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#fff4eb] px-3 py-2 text-sm font-bold text-[#111827]"
                    >
                      <Icon className="h-4 w-4 text-[#ff5c00]" aria-hidden />
                      {title}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="#bancas-da-copa"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#ff5c00] px-6 py-3 text-base font-black text-white transition hover:bg-[#e55200] focus:outline-none focus:ring-2 focus:ring-[#ff5c00]/30"
                >
                  Ver bancas com figurinhas agora
                  <IconChevronRight className="h-5 w-5" aria-hidden />
                </Link>
                <Link
                  href="#bancas-da-copa"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#d8dee8] bg-white px-6 py-3 text-base font-bold text-[#111827] transition hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#ff5c00]/30"
                >
                  Encontrar figurinhas perto de mim
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#e7e2d8] bg-[#fbfaf6] py-6">
          <div className="container-max grid gap-4 text-sm text-[#4b5563] sm:grid-cols-3">
            {proofPoints.map((item) => (
              <div
                key={item.value}
                className="border-l-4 border-[#ff5c00] bg-white px-4 py-3 shadow-sm"
              >
                <strong className="block text-2xl text-[#111827]">{item.value}</strong>
                {item.label}
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container-max">
            <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-sm font-black uppercase text-[#ff5c00]">
                  Evite perder tempo
                </p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-[#111827] md:text-5xl">
                  Cansado de rodar e não encontrar figurinhas?
                </h2>
                <p className="mt-4 text-base leading-7 text-[#4b5563] md:text-lg">
                  O problema não é querer completar o álbum. O problema é sair sem
                  saber onde vale ir, quem responde e quem pode receber encomenda.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-[#ffd7d7] bg-white p-5">
                  <h3 className="text-lg font-black text-[#111827]">
                    O que trava sua compra
                  </h3>
                  <div className="mt-4 space-y-3">
                    {painPoints.map((item) => (
                      <div key={item} className="flex gap-3">
                        <span className="mt-2 h-2 w-2 flex-none rounded-full bg-[#ef4444]" />
                        <p className="text-sm leading-6 text-[#5f6673]">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-[#bfeecf] bg-[#f4fff7] p-5">
                  <h3 className="text-lg font-black text-[#111827]">
                    Como o Guia resolve
                  </h3>
                  <div className="mt-4 space-y-3">
                    {solutionPoints.map((item) => (
                      <div key={item} className="flex gap-3">
                        <IconCircleCheck
                          className="mt-0.5 h-5 w-5 flex-none text-[#16a34a]"
                          aria-hidden
                        />
                        <p className="text-sm leading-6 text-[#374151]">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-14 md:py-20">
          <div className="container-max grid gap-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase text-[#ff5c00]">
                Como funciona
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
                Encontre e compre em minutos.
              </h2>
              <p className="mt-4 text-base leading-7 text-[#5f6673]">
                A jornada não é só ver uma lista. É encontrar, consultar e combinar
                a compra com quem atende no bairro.
              </p>
            </div>

            <div className="grid gap-3">
              {steps.map(({ icon: Icon, title, text }, index) => (
                <div
                  key={title}
                  className="launch-row flex items-start gap-4 rounded-lg border border-[#e7e2d8] bg-[#fbfaf6] p-5 shadow-sm"
                >
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-[#111827] text-white">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase text-[#ff5c00]">
                      Passo {index + 1}
                    </p>
                    <h3 className="mt-1 text-lg font-black text-[#111827]">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#5f6673]">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#111827] py-14 text-white md:py-20">
          <div className="container-max grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase text-[#b7f44a]">
                Quem usa, resolve mais rápido
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
                A compra fica mais simples quando você fala antes de sair.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 md:text-lg">
                O Guia das Bancas foi pensado para reduzir incerteza: encontre a
                banca, confirme disponibilidade e combine o próximo passo direto
                com o jornaleiro.
              </p>

              <div className="mt-8 grid gap-3 md:grid-cols-3 lg:grid-cols-1">
                {socialProof.map((item) => (
                  <div
                    key={item.quote}
                    className="rounded-lg border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-sm leading-6 text-white/90">"{item.quote}"</p>
                    <p className="mt-3 text-xs font-bold uppercase text-[#b7f44a]">
                      {item.context}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[390px] overflow-hidden rounded-lg border border-white/10">
              <Image
                src={counterImage}
                alt="Jornaleiro segurando álbum e pacotes de figurinhas da Copa 2026 em uma banca"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="rounded-lg bg-white p-4 text-[#111827] shadow-xl">
                  <div className="flex items-center gap-3">
                    <IconPackage className="h-6 w-6 text-[#ff5c00]" aria-hidden />
                    <div>
                      <p className="font-black">Confirme antes de ir</p>
                      <p className="text-sm text-[#5f6673]">
                        Estoque, encomenda e retirada são combinados com a banca.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="container-max">
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
              <div>
                <p className="text-sm font-black uppercase text-[#ff5c00]">
                  Por que usar
                </p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-[#111827] md:text-5xl">
                  A forma mais rápida de encontrar figurinhas.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-[#4b5563] md:text-lg">
                O foco não é só buscar uma banca. É reduzir risco, acelerar o
                contato e transformar a intenção de compra em uma conversa real.
              </p>
            </div>

            <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="launch-card rounded-lg border border-[#e7e2d8] bg-white p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#fff1e8] text-[#ff5c00]">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className="mt-5 text-lg font-black text-[#111827]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#5f6673]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="bancas-da-copa"
          className="border-y border-[#e7e2d8] bg-white py-14 md:py-20"
        >
          <div className="container-max">
            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
              <div>
                <p className="text-sm font-black uppercase text-[#ff5c00]">
                  Bancas com figurinhas perto de você
                </p>
                <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
                  Escolha uma banca, fale direto e combine sua compra.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#5f6673]">
                  Algumas bancas podem ter estoque limitado durante o dia. Consulte
                  disponibilidade antes de sair.
                </p>
              </div>
              <div className="rounded-lg border border-[#ffd8bf] bg-[#fff7ed] p-4">
                <div className="flex items-center gap-3 text-[#111827]">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-white text-[#ff5c00] shadow-sm">
                    <IconSearch className="h-6 w-6" aria-hidden />
                  </div>
                  <div>
                    <p className="font-black">Alta procura na sua região</p>
                    <p className="mt-1 text-sm leading-6 text-[#4b5563]">
                      Ative sua localização, ajuste o raio de distância e fale com
                      a banca para confirmar figurinhas, álbum ou encomenda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <BancasPertoDeMimPageClient
            initialCategories={initialCategories}
            title={null}
            headingLevel="h2"
            className="container-max pt-6 pb-0"
            defaultSortBy="distance"
            inlineDistanceFilter
            showCategoryFilters={false}
            showRatingFilter={false}
            campaignVariant="worldCupStickers"
          />
        </section>

        <section className="py-14 md:py-20">
          <div className="container-max grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-black uppercase text-[#ff5c00]">
                Antes de clicar
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
                O que você precisa saber para comprar sem perder viagem.
              </h2>
              <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-[#111827]">
                <span className="inline-flex items-center gap-2 rounded-lg bg-[#eef8ef] px-3 py-2">
                  <IconShieldCheck className="h-4 w-4 text-[#2f8f5b]" aria-hidden />
                  Banca cadastrada
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg bg-[#eef8ef] px-3 py-2">
                  <IconUsers className="h-4 w-4 text-[#2f8f5b]" aria-hidden />
                  Atendimento local
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg bg-[#fff6db] px-3 py-2">
                  <IconStar className="h-4 w-4 text-[#c78b00]" aria-hidden />
                  Consulta antes da visita
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {objections.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-lg border border-[#e7e2d8] bg-white p-5"
                >
                  <summary className="cursor-pointer list-none text-base font-black text-[#111827]">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-[#5f6673]">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-[#ff5c00] py-12 text-white md:py-16">
          <Image
            src={finalCtaImage}
            alt=""
            fill
            sizes="100vw"
            className="absolute inset-0 -z-20 object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-[#ff5c00]/84" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#ff5c00] via-[#ff5c00]/88 to-[#ff5c00]/64" />

          <div className="container-max relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-black leading-tight md:text-4xl">
                Não fique para trás. Comece a completar seu álbum hoje.
              </h2>
              <p className="mt-3 text-base leading-7 text-white/90">
                Encontre bancas próximas, fale direto com o jornaleiro e consiga
                suas figurinhas com mais rapidez.
              </p>
            </div>
            <Link
              href="#bancas-da-copa"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-black text-[#111827] transition hover:bg-[#fff4eb] focus:outline-none focus:ring-2 focus:ring-white/70"
            >
              Encontrar figurinhas perto de mim
            </Link>
          </div>
        </section>

        <style jsx>{`
          @keyframes launchIntro {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes heroImageDrift {
            from {
              transform: scale(1);
            }
            to {
              transform: scale(1.04);
            }
          }

          .launch-intro {
            animation: launchIntro 680ms ease-out both;
          }

          .launch-hero-image {
            animation: heroImageDrift 18s ease-out both;
          }

          .launch-card,
          .launch-row {
            transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
          }

          .launch-card:hover,
          .launch-row:hover {
            transform: translateY(-3px);
            border-color: #ffd3ba;
            box-shadow: 0 18px 40px rgba(17, 24, 39, 0.08);
          }

          @media (prefers-reduced-motion: reduce) {
            .launch-intro,
            .launch-hero-image,
            .launch-card,
            .launch-row {
              animation: none;
              transition: none;
            }
          }
        `}</style>
      </div>
    </>
  );
}

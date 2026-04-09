export const CONSUMER_RESERVATION_PATH = "/para-voce";
export const PRE_VENDA_PATH = "/pre-venda";

export type ConsumerLandingTextSection = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
};

export type ConsumerLandingFeatureCard = {
  title: string;
  description: string;
};

export type ConsumerLandingStep = {
  title: string;
  description: string;
};

export type ConsumerLandingTrustCard = {
  title: string;
  description: string;
};

export type ConsumerReservationLandingDocument = {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primaryCtaText: string;
    secondaryCtaText: string;
    highlights: string[];
  };
  sections: {
    urgency: ConsumerLandingTextSection;
    benefits: ConsumerLandingTextSection;
    flow: ConsumerLandingTextSection;
    trust: ConsumerLandingTextSection;
    locality: ConsumerLandingTextSection;
  };
  benefitCards: ConsumerLandingFeatureCard[];
  steps: ConsumerLandingStep[];
  trustCards: ConsumerLandingTrustCard[];
  finalCta: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCtaText: string;
    secondaryCtaText: string;
  };
};

export const DEFAULT_CONSUMER_RESERVATION_DOCUMENT: ConsumerReservationLandingDocument = {
  hero: {
    badge: "Pré-reserva de álbuns e figurinhas da Copa 2026",
    title: "Garanta seu álbum e suas figurinhas antes que o lote acabe na sua região",
    subtitle:
      "Encontre bancas perto de casa, fale direto com o jornaleiro e faça sua pré-reserva com mais praticidade, preço justo e a segurança de comprar com quem realmente vai separar o seu pedido.",
    primaryCtaText: "Encontrar bancas perto de mim",
    secondaryCtaText: "Ver itens em pré-reserva",
    highlights: [
      "Lotes limitados nas bancas parceiras",
      "Reserva rápida direto no WhatsApp",
      "Compra local com jornaleiro da sua região",
    ],
  },
  sections: {
    urgency: {
      eyebrow: "Escassez real",
      title: "Quem deixa para procurar no último minuto corre o risco de rodar a cidade e voltar sem nada.",
      paragraphs: [
        "Álbum e figurinha da Copa 2026 não funcionam como compra comum. Os lotes são disputados, a demanda sobe rápido e as bancas recebem reposições por janelas. Quem espera para decidir em cima da hora normalmente encontra fila, produto esgotado ou preço pior.",
        "A pré-reserva resolve exatamente isso: você fala antes com a banca, confirma disponibilidade e já deixa seu pedido encaminhado com o jornaleiro. Em vez de sair procurando sem certeza, você garante prioridade em um lote limitado.",
      ],
    },
    benefits: {
      eyebrow: "Por que reservar aqui",
      title: "O Guia das Bancas foi pensado para quem quer comprar sem perder tempo, sem atravessador e sem surpresa.",
      paragraphs: [
        "A proposta é simples: aproximar você da banca certa, perto da sua casa, para reservar álbum ou figurinhas com agilidade e sem depender de marketplace genérico.",
        "Você ganha mais previsibilidade para comprar, conversa direto com o jornaleiro que vai atender seu pedido e combina retirada ou entrega local com muito mais clareza.",
      ],
    },
    flow: {
      eyebrow: "Como funciona",
      title: "Você encontra, chama, confirma e reserva em poucos minutos.",
      paragraphs: [
        "Em vez de preencher formulário complicado ou esperar resposta de loja distante, você busca as bancas disponíveis, escolhe a mais próxima e cai direto no canal do jornaleiro para confirmar o que precisa.",
        "Esse fluxo foi desenhado para acelerar a compra de quem quer garantir o produto enquanto ainda há lote disponível.",
      ],
    },
    trust: {
      eyebrow: "Segurança e confiança",
      title: "Comprar direto com o jornaleiro da sua região é mais seguro do que apostar em anúncio genérico ou vendedor desconhecido.",
      paragraphs: [
        "Você sabe com quem está falando, conhece a localização da banca, consegue validar disponibilidade antes de sair de casa e combina a melhor forma de retirada ou entrega local.",
        "Na prática, isso reduz atrito, reduz risco e traz a confiança de uma compra local com atendimento humano, em vez de uma promessa solta na internet.",
      ],
    },
    locality: {
      eyebrow: "Compra local",
      title: "Quando a banca está perto de você, a reserva fica mais prática e o atendimento é mais rápido.",
      paragraphs: [
        "A ideia central da plataforma é conectar a busca online com a banca da sua região. Você encontra o produto pela internet, mas fecha com um jornaleiro perto de casa, que conhece o bairro e consegue atender com muito mais proximidade.",
        "Isso faz diferença no preço, na velocidade e na conveniência. Em vez de esperar uma solução distante, você resolve com a banca certa, no seu raio de deslocamento.",
      ],
    },
  },
  benefitCards: [
    {
      title: "Preço justo",
      description:
        "Você negocia direto com a banca, sem inflação desnecessária de intermediário e com mais clareza sobre disponibilidade.",
    },
    {
      title: "Praticidade no WhatsApp",
      description:
        "Encontrou a banca certa? Você fala direto com o jornaleiro e já confirma a sua pré-reserva sem burocracia.",
    },
    {
      title: "Perto da sua casa",
      description:
        "A plataforma prioriza bancas da sua região para facilitar retirada, entrega local e recorrência de compra.",
    },
    {
      title: "Reserva antes de acabar",
      description:
        "Como os lotes são limitados, a pré-reserva aumenta a chance de garantir álbum e figurinhas antes do esgotamento.",
    },
  ],
  steps: [
    {
      title: "Encontre a banca ideal",
      description:
        "Veja as bancas mais próximas de você e identifique quem está operando com Copa 2026 e disponibilidade local.",
    },
    {
      title: "Chame o jornaleiro no WhatsApp",
      description:
        "Converse direto com quem vai atender seu pedido, confirme lote, quantidade e condições de retirada ou entrega.",
    },
    {
      title: "Faça sua pré-reserva",
      description:
        "Com tudo validado, sua compra fica encaminhada com muito mais segurança e menos risco de perder o lote.",
    },
  ],
  trustCards: [
    {
      title: "Atendimento local de verdade",
      description:
        "Você não cai em anúncio genérico. Fala com a banca da sua região e compra com alguém que realmente opera o ponto físico.",
    },
    {
      title: "Mais previsibilidade",
      description:
        "Antes de sair de casa, você já sabe se vale a pena ir, se o lote está disponível e como o pedido será separado.",
    },
    {
      title: "Compra humana, não fria",
      description:
        "Quando a busca termina em conversa direta com o jornaleiro, o processo fica mais simples, mais rápido e mais confiável.",
    },
  ],
  finalCta: {
    eyebrow: "Pronto para reservar",
    title: "Reserve suas figurinhas e seu álbum com um jornaleiro perto de você.",
    subtitle:
      "Se o lote é limitado, o melhor momento para agir é antes da corrida aumentar. Encontre agora as bancas da sua região e encaminhe sua pré-reserva com quem realmente vai atender o seu pedido.",
    primaryCtaText: "Encontrar bancas perto de mim",
    secondaryCtaText: "Explorar pré-reservas",
  },
};

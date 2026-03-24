import WorldCupSeoPage from "@/components/seo/WorldCupSeoPage";
import {
  buildAbsoluteSiteUrl,
  buildWorldCupMetadata,
  getWorldCupCityBancas,
} from "@/lib/seo/world-cup-2026";

export const metadata = buildWorldCupMetadata({
  title: "Figurinhas da Copa 2026 em São Paulo: encontre bancas perto de você | Guia das Bancas",
  description:
    "Use o Guia das Bancas para encontrar bancas cadastradas em São Paulo, localizar álbum e figurinhas da Copa 2026 perto de você e reservar o que estiver buscando.",
  path: "/copa-2026",
  keywords: [
    "copa 2026",
    "figurinhas da copa 2026 em são paulo",
    "onde comprar figurinhas da copa em são paulo",
    "banca de jornal copa 2026 são paulo",
    "album da copa 2026 são paulo",
    "bancas perto de mim são paulo",
  ],
});

export const revalidate = 3600;

export default async function Copa2026HubPage() {
  const bancas = await getWorldCupCityBancas("sao-paulo-sp", 6);

  return (
    <WorldCupSeoPage
      title="As figurinhas da Copa 2026 em São Paulo passam pelas bancas certas"
      description="O Guia das Bancas foi desenhado para quem quer encontrar bancas paulistas perto de casa, localizar álbum e figurinhas com mais agilidade e falar direto com quem realmente tem operação local. Neste momento, a campanha da Copa 2026 está concentrada nas bancas cadastradas em São Paulo."
      eyebrow="Especial Copa 2026 em São Paulo"
      breadcrumbs={[
        { name: "Início", href: buildAbsoluteSiteUrl("/") },
        { name: "Copa 2026", href: buildAbsoluteSiteUrl("/copa-2026") },
      ]}
      quickFacts={[
        {
          label: "Cobertura ativa",
          value: "Somente São Paulo",
          detail: "Neste momento, a operação da campanha está focada nas bancas cadastradas em São Paulo. Não abrimos a jornada da Copa 2026 para outros estados.",
        },
        {
          label: "O que você resolve aqui",
          value: "Encontrar + reservar + retirar",
          detail: "A proposta é simples: descobrir a banca mais próxima, localizar o que você procura e reduzir o tempo perdido rodando pela cidade.",
        },
        {
          label: "Melhor caminho",
          value: "Busca local com bancas reais",
          detail: "A plataforma cruza geolocalização, perfil de banca e catálogo para levar o usuário até o ponto de venda mais próximo da sua rotina.",
        },
      ]}
      primaryCta={{ href: "/copa-2026/onde-comprar/sao-paulo-sp", label: "Encontrar bancas em São Paulo" }}
      secondaryCta={{ href: "/bancas-perto-de-mim", label: "Ver bancas perto de mim" }}
      sectionBlocks={[
        {
          title: "Quem procura figurinha em São Paulo não precisa rodar a cidade inteira",
          body: "O objetivo desta página é encurtar o caminho entre a busca e a banca. Em vez de perder tempo procurando por conta própria, o usuário entra aqui para encontrar bancas paulistas próximas, ver perfis reais e seguir para reserva, retirada ou compra local com muito mais precisão.",
          bullets: [
            "Descobrir bancas cadastradas em São Paulo com presença real na plataforma.",
            "Encontrar álbum, figurinhas, pacotes e itens relacionados à jornada da Copa 2026.",
            "Chegar mais rápido à banca certa para reservar ou confirmar disponibilidade.",
          ],
        },
        {
          title: "Por que o Guia das Bancas é o melhor atalho para essa busca",
          body: "A força da plataforma está em concentrar a jornada local. Em vez de depender de busca genérica, redes sociais soltas ou tentativa e erro no bairro, o usuário encontra as bancas mais próximas dele, identifica quais já estão publicadas e segue para uma ação objetiva.",
          bullets: [
            "A vitrine é feita para descoberta de bancas, não para tráfego vazio.",
            "A geolocalização aproxima a busca de São Paulo da banca mais conveniente para o usuário.",
            "A página da banca vira o ponto de contato para reserva, retirada e continuidade da compra.",
          ],
        },
        {
          title: "Escopo desta campanha agora",
          body: "A comunicação da Copa 2026, neste estágio, é exclusiva para São Paulo. Isso significa que toda a proposta desta landing está orientada para bancas cadastradas na capital e no estado, sem prometer cobertura nacional antes da operação estar pronta.",
          bullets: [
            "São Paulo é a prioridade atual da campanha e do tráfego.",
            "A página existe para convencer o usuário a usar a plataforma como canal de descoberta local.",
            "A expansão para outros estados fica fora desta proposta enquanto a operação não estiver aberta.",
          ],
        },
      ]}
      relatedLinks={[
        {
          href: "/copa-2026/onde-comprar/sao-paulo-sp",
          title: "Onde comprar em São Paulo",
          description: "Página principal da campanha para encontrar bancas paulistas com foco na busca local por figurinhas e álbum.",
        },
        {
          href: "/bancas-perto-de-mim",
          title: "Bancas perto de você",
          description: "Entrada direta para quem quer usar a localização e descobrir a banca mais próxima da sua rotina.",
        },
        {
          href: "/categorias/panini?sub=figurinhas",
          title: "Figurinhas e itens Panini",
          description: "Atalho para a navegação transacional de figurinhas, colecionáveis e produtos ligados à Copa 2026.",
        },
        {
          href: "/copa-2026/album-da-copa-2026",
          title: "Álbum da Copa 2026",
          description: "Página de apoio para a intenção focada no álbum e no início da jornada de coleção.",
        },
      ]}
      relatedLinksTitle="Entradas para quem quer encontrar figurinhas"
      bancasTitle="Bancas paulistas em destaque"
      bancas={bancas}
      faqs={[
        {
          question: "Esta página serve para o Brasil inteiro?",
          answer: "Não. Neste momento, a campanha da Copa 2026 está orientada para bancas cadastradas em São Paulo. A proposta desta landing é concentrar a busca e a conversão nessa operação local.",
        },
        {
          question: "O que eu encontro usando o Guia das Bancas nesta página?",
          answer: "Você encontra caminhos para descobrir bancas paulistas próximas, acessar o perfil da banca, localizar álbum e figurinhas e seguir para contato, reserva ou compra local quando a operação estiver publicada.",
        },
        {
          question: "Por que usar a plataforma em vez de procurar de forma genérica?",
          answer: "Porque a proposta aqui é reduzir atrito: em vez de buscar de forma solta, você entra em uma jornada que prioriza bancas reais, proximidade e caminho mais curto até encontrar o que está buscando.",
        },
      ]}
    />
  );
}

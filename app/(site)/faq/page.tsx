import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "FAQ | Guia das Bancas - Perguntas Frequentes",
  description: "Tire suas dúvidas sobre bancas de jornal, HQs, figurinhas e coleções. Respostas para as perguntas mais comuns sobre o Guia das Bancas.",
  keywords: ["faq bancas", "perguntas frequentes", "dúvidas bancas jornal", "guia das bancas ajuda"],
  openGraph: {
    title: "FAQ | Guia das Bancas",
    description: "Perguntas frequentes sobre bancas de jornal e coleções",
    url: "https://www.guiadasbancas.com.br/faq",
    siteName: "Guia das Bancas",
    type: "website",
  },
  alternates: {
    canonical: "https://www.guiadasbancas.com.br/faq",
  },
};

const faqData = [
  {
    question: "O que é o Guia das Bancas?",
    answer: "O Guia das Bancas é a primeira plataforma digital que conecta você às bancas de jornal do Brasil. Ajudamos você a encontrar bancas próximas, ver produtos disponíveis e entrar em contato direto com os jornaleiros."
  },
  {
    question: "Como encontrar uma banca de jornal perto de mim?",
    answer: "Use nossa busca por localização no site. Permita o acesso à sua localização ou digite seu endereço para ver todas as bancas próximas. Você também pode filtrar por produtos específicos como HQs ou figurinhas."
  },
  {
    question: "É grátis usar o Guia das Bancas?",
    answer: "Sim! O Guia das Bancas é totalmente gratuito para usuários. Você pode buscar bancas, ver produtos e entrar em contato sem nenhum custo."
  },
  {
    question: "Como faço para comprar figurinhas na banca?",
    answer: "Encontre uma banca próxima usando nossa busca, verifique se ela tem figurinhas disponíveis e entre em contato pelo WhatsApp ou telefone. Muitas bancas também aceitam encomendas."
  },
  {
    question: "O que são HQs e onde encontrar?",
    answer: "HQs são Histórias em Quadrinhos. Use nosso filtro para encontrar bancas que vendem quadrinhos. Muitas bancas têm edições recentes da Marvel, DC e quadrinhos brasileiros."
  },
  {
    question: "Posso encomendar produtos que não estão na banca?",
    answer: "Sim! Converse diretamente com o jornaleiro. Eles podem encomendar produtos especiais para você, desde edições raras de quadrinhos até pacotes específicos de figurinhas."
  },
  {
    question: "Como jornaleiro posso cadastrar minha banca?",
    answer: "Jornaleiros podem se cadastrar gratuitamente. Crie sua conta, preencha os dados da sua banca e comece a receber pedidos online. É simples e rápido!"
  },
  {
    question: "O Guia das Bancas é confiável?",
    answer: "Sim! Trabalhamos com jornaleiros verificados em todo o Brasil. Todas as bancas são validadas antes de serem listadas em nossa plataforma."
  },
  {
    question: "Como funciona a busca por produtos?",
    answer: "Use nossos filtros para buscar por tipos específicos de produtos como HQs, figurinhas, revistas ou jogos. Você verá apenas bancas que têm esses produtos disponíveis."
  },
  {
    question: "Posso avaliar uma banca?",
    answer: "Sim! Após comprar em uma banca, você pode deixar uma avaliação sobre seu atendimento e produtos. Isso ajuda outros usuários a fazerem melhores escolhas."
  }
];

export default function FAQPage() {
  // Schema.org FAQ para SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#ff5c00] to-orange-500 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Perguntas Frequentes
              </h1>
              <p className="text-lg text-white/90">
                Tire suas dúvidas sobre o Guia das Bancas e descubra como aproveitar ao máximo nossa plataforma
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="container mx-auto px-4 max-w-4xl py-12">
          <div className="space-y-6">
            {faqData.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.question}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center bg-white rounded-2xl shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ainda tem dúvidas?
            </h3>
            <p className="text-gray-600 mb-6">
              Entre em contato conosco. Estamos aqui para ajudar!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contato"
                className="inline-flex items-center gap-2 bg-[#ff5c00] text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors"
              >
                Fale Conosco
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors"
              >
                Buscar Bancas
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

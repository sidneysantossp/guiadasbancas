import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { productName, productDescription } = await req.json();

    if (!productName) {
      return NextResponse.json(
        { error: "Nome do produto é obrigatório" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // Se não tiver chave de API, retorna um texto simulado (ou erro, dependendo da preferência)
    if (!apiKey) {
      console.warn("OPENAI_API_KEY não configurada. Retornando texto simulado.");
      
      const simulacao = `
        <p><strong>${productName}</strong> é a escolha ideal para quem busca qualidade e eficiência.</p>
        <p>Com um design moderno e funcional, este produto se destaca pela sua versatilidade. Seja para uso diário ou ocasiões especiais, ele entrega o desempenho que você espera.</p>
        <p>Principais benefícios:</p>
        <ul>
          <li>Alta durabilidade e resistência</li>
          <li>Praticidade no uso</li>
          <li>Melhor custo-benefício da categoria</li>
        </ul>
        <p>Não perca a oportunidade de adquirir o <em>${productName}</em> e transformar sua experiência. Garanta já o seu!</p>
        <p><small>(Nota: Configure a chave OPENAI_API_KEY no arquivo .env para gerar descrições reais com Inteligência Artificial)</small></p>
      `;

      return NextResponse.json({ 
        success: true, 
        html: simulacao,
        simulated: true
      });
    }

    // Chamada à API da OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // ou gpt-4 se disponível
        messages: [
          {
            role: "system",
            content: "Você é um especialista em copywriting e marketing digital. Sua tarefa é criar descrições de produtos atraentes e persuasivas para um e-commerce. Use formatação HTML simples (p, ul, li, strong, em) para o texto gerado, sem incluir tags <html> ou <body>."
          },
          {
            role: "user",
            content: `Crie uma descrição completa e vendedora para o produto: "${productName}". \n\nDetalhes adicionais: "${productDescription || ''}". \n\nDestaque os benefícios, crie desejo e incentive a compra.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na API da OpenAI:", errorData);
      throw new Error(`Erro na OpenAI: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content || "";

    return NextResponse.json({
      success: true,
      html: generatedText
    });

  } catch (error: any) {
    console.error("Erro ao gerar descrição com IA:", error);
    return NextResponse.json(
      { error: "Falha ao gerar descrição. Tente novamente mais tarde." },
      { status: 500 }
    );
  }
}

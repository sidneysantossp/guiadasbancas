import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const DEFAULT_GROQ_MODEL = "llama-3.1-8b-instant";

async function loadAiSettings() {
  const settingsMap = new Map<string, string>();

  try {
    const { data, error } = await supabaseAdmin
      .from("settings")
      .select("key, value")
      .in("key", ["openai_api_key", "groq_api_key", "groq_model"]);

    if (!error) {
      for (const item of data || []) {
        settingsMap.set(item.key, item.value);
      }
    }
  } catch (error) {
    console.error("Erro ao buscar configurações de IA:", error);
  }

  const groqApiKey = process.env.GROQ_API_KEY || settingsMap.get("groq_api_key") || "";
  const groqModel = process.env.GROQ_MODEL || settingsMap.get("groq_model") || DEFAULT_GROQ_MODEL;
  const openAiApiKey = process.env.OPENAI_API_KEY || settingsMap.get("openai_api_key") || "";

  return {
    groqApiKey,
    groqModel,
    openAiApiKey,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { productName, productDescription } = await req.json();

    if (!productName) {
      return NextResponse.json(
        { error: "Nome do produto é obrigatório" },
        { status: 400 }
      );
    }

    const { groqApiKey, groqModel, openAiApiKey } = await loadAiSettings();
    const provider = groqApiKey ? "groq" : openAiApiKey ? "openai" : "none";
    const apiKey = provider === "groq" ? groqApiKey : openAiApiKey;
    const apiUrl =
      provider === "groq"
        ? "https://api.groq.com/openai/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";
    const model = provider === "groq" ? groqModel : "gpt-3.5-turbo";

    // Se não tiver chave de API, retorna um texto simulado (ou erro, dependendo da preferência)
    if (!apiKey) {
      console.warn("Nenhuma chave de IA configurada. Retornando texto simulado.");
      
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
      `;

      return NextResponse.json({ 
        success: true, 
        html: simulacao,
        simulated: true
      });
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
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
      console.error(`Erro na API da ${provider}:`, errorData);
      throw new Error(`Erro na ${provider}: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content || "";

    return NextResponse.json({
      success: true,
      html: generatedText,
      provider,
      model
    });

  } catch (error: any) {
    console.error("Erro ao gerar descrição com IA:", error);
    return NextResponse.json(
      { error: "Falha ao gerar descrição. Tente novamente mais tarde." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

// Calculadora de frete dos Correios com fallback para ViaCEP
// Otimizada para revistas (peso máximo 300g)
// Docs: http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx

function parseXmlTag(xml: string, tag: string): string | null {
  const m = xml.match(new RegExp(`<${tag}>(.*?)</${tag}>`, "i"));
  return m ? m[1] : null;
}

async function correiosEstimate(params: {
  serviceCode: string; // 04510 PAC, 04014 SEDEX
  from: string; // CEP orig
  to: string; // CEP dest
  weightKg: string; // e.g. "1"
  lengthCm: string; // e.g. "20"
  heightCm: string; // e.g. "10"
  widthCm: string; // e.g. "15"
  diameterCm?: string; // default 0
}) {
  const {
    serviceCode,
    from,
    to,
    weightKg,
    lengthCm,
    heightCm,
    widthCm,
    diameterCm = "0",
  } = params;

  const search = new URLSearchParams({
    sCepOrigem: from.replace(/\D/g, ""),
    sCepDestino: to.replace(/\D/g, ""),
    nVlPeso: weightKg,
    nCdFormato: "1",
    nVlComprimento: lengthCm,
    nVlAltura: heightCm,
    nVlLargura: widthCm,
    nVlDiametro: diameterCm,
    sCdMaoPropria: "n",
    sCdAvisoRecebimento: "n",
    nCdServico: serviceCode,
    nVlValorDeclarado: "0",
    StrRetorno: "xml",
  });

  const url = `http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?${search.toString()}`;
  
  // Timeout de 8 segundos para evitar travamento
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  
  try {
    const res = await fetch(url, { 
      cache: "no-store",
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GuiaDasBancas/1.0)'
      }
    });
    clearTimeout(timeoutId);
    const xml = await res.text();
  const valor = parseXmlTag(xml, "Valor"); // e.g. 23,50
  const prazo = parseXmlTag(xml, "PrazoEntrega"); // dias úteis
  const erro = parseXmlTag(xml, "Erro");
  const msgErro = parseXmlTag(xml, "MsgErro");

  if (erro && erro !== "0") {
    throw new Error(msgErro || "Erro ao consultar Correios");
  }
    const price = typeof valor === "string" ? Number(valor.replace(/\./g, "").replace(",", ".")) : NaN;
    const days = prazo ? Number(prazo) : NaN;
    return { price, days };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Fallback com preços estimados baseados na distância
async function getFallbackPrices(fromCEP: string, toCEP: string) {
  // Preços base para revistas (300g)
  const basePAC = 8.50;
  const baseSEDEX = 15.90;
  
  // Calcular distância aproximada pelos primeiros dígitos do CEP
  const fromRegion = parseInt(fromCEP.substring(0, 2));
  const toRegion = parseInt(toCEP.substring(0, 2));
  const distance = Math.abs(fromRegion - toRegion);
  
  // Multiplicador baseado na distância
  const multiplier = 1 + (distance * 0.1);
  
  return {
    pac: { price: basePAC * multiplier, days: 5 + Math.floor(distance / 2) },
    sedex: { price: baseSEDEX * multiplier, days: 2 + Math.floor(distance / 3) }
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from") || "01001000";
    const to = searchParams.get("to") || "01001000";
    const weight = searchParams.get("weight") || "0.3"; // 300g para revistas
    const length = searchParams.get("length") || "28"; // tamanho revista
    const height = searchParams.get("height") || "21";
    const width = searchParams.get("width") || "0.5";

    let pac, sedex;
    
    try {
      // Tentar consultar Correios com timeout
      [pac, sedex] = await Promise.all([
        correiosEstimate({ serviceCode: "04510", from, to, weightKg: weight, lengthCm: length, heightCm: height, widthCm: width }),
        correiosEstimate({ serviceCode: "04014", from, to, weightKg: weight, lengthCm: length, heightCm: height, widthCm: width }),
      ]);
    } catch (correiosError) {
      console.warn('Correios API falhou, usando fallback:', correiosError);
      // Usar preços estimados se Correios falhar
      const fallback = await getFallbackPrices(from.replace(/\D/g, ''), to.replace(/\D/g, ''));
      pac = fallback.pac;
      sedex = fallback.sedex;
    }

    return NextResponse.json({
      ok: true,
      services: [
        { code: "SEDEX", price: Math.max(sedex.price, 10.00), days: sedex.days }, // mínimo R$ 10
        { code: "MOTOBOY", price: 0, days: 0, label: "Motoboy Uber Eats - A Consultar" }, // preço a consultar
      ],
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Erro" }, { status: 200 });
  }
}

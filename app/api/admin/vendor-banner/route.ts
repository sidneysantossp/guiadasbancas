import { NextRequest, NextResponse } from "next/server";

// Configuração padrão (funciona sem banco)
const defaultBanner = {
  title: "É jornaleiro?",
  subtitle: "Registre sua banca agora",
  description: "Anuncie seus produtos, receba pedidos pelo WhatsApp e alcance clientes perto de você com o Guia das Bancas.",
  button_text: "Quero me cadastrar",
  button_link: "/jornaleiro/registrar",
  image_url: "",
  active: true
};

// Armazenamento temporário em memória (para desenvolvimento)
let memoryBanner: any = null;

// Função para debug - mostrar estado atual
function debugMemoryState() {
  console.log('🔍 DEBUG - Estado da memória:', {
    hasMemoryBanner: !!memoryBanner,
    memoryBannerData: memoryBanner ? {
      title: memoryBanner.title,
      image_url: memoryBanner.image_url,
      active: memoryBanner.active
    } : null
  });
}

// Tentar conectar com Supabase se disponível
let supabase: any = null;
try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createClient } = require("@supabase/supabase-js");
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
} catch (error) {
  console.log('Supabase não disponível, usando dados padrão');
}

export async function GET() {
  try {
    console.log('📖 GET /api/admin/vendor-banner - CHAMADA RECEBIDA');
    debugMemoryState();
    
    // Se há dados salvos em memória, usar eles
    if (memoryBanner) {
      console.log('📖 ✅ RETORNANDO DADOS DA MEMÓRIA:', JSON.stringify(memoryBanner, null, 2));
      return NextResponse.json({ success: true, data: memoryBanner });
    }

    // Se Supabase disponível, tentar buscar dados
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('vendor_banner')
          .select('*')
          .single();

        if (error) {
          console.log('📖 Erro Supabase (usando padrão):', error.message);
          return NextResponse.json({ success: true, data: defaultBanner });
        }

        console.log('📖 Dados do Supabase:', data);
        return NextResponse.json({ success: true, data: data || defaultBanner });
      } catch (dbError) {
        console.log('📖 Erro de banco (usando padrão):', dbError);
        return NextResponse.json({ success: true, data: defaultBanner });
      }
    }

    // Se Supabase não disponível, retornar padrão
    console.log('📖 Retornando dados padrão');
    return NextResponse.json({ success: true, data: defaultBanner });
  } catch (error) {
    console.error('📖 Erro interno:', error);
    return NextResponse.json({ success: true, data: defaultBanner });
  }
}

export async function PUT(request: NextRequest) {
  console.log('🔄 PUT /api/admin/vendor-banner iniciado');
  
  try {
    const body = await request.json();
    console.log('📝 Dados recebidos COMPLETOS:', JSON.stringify(body, null, 2));
    console.log('🖼️ URL da imagem recebida:', body.image_url);
    console.log('📏 Tamanho da URL recebida:', body.image_url?.length);
    console.log('🔍 Tipo da URL recebida:', typeof body.image_url);
    
    const { title, subtitle, description, button_text, button_link, image_url, active } = body;
    
    console.log('🔍 Após destructuring - image_url:', image_url);

    // Salvar em memória para desenvolvimento
    memoryBanner = {
      ...body,
      id: `temp-${Date.now()}`,
      updated_at: new Date().toISOString()
    };
    
    console.log('💾 Dados salvos na memória:', memoryBanner);
    debugMemoryState();
    
    const responseData = {
      success: true,
      data: memoryBanner,
      message: 'Banner salvo com sucesso! (salvo na memória)'
    };
    
    console.log('📤 Enviando resposta:', JSON.stringify(responseData, null, 2));
    const response = NextResponse.json(responseData);
    
    // Adicionar headers CORS para debug
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    console.log('📤 Response headers:', Object.fromEntries(response.headers.entries()));
    return response;

  } catch (error: any) {
    console.error('❌ Erro interno:', error);
    return NextResponse.json({ 
      success: false, 
      error: `Erro interno: ${error.message}` 
    }, { status: 500 });
  }
}

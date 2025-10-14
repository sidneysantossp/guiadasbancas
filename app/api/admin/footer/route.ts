import { NextRequest, NextResponse } from 'next/server';

type FooterLink = {
  id: string;
  text: string;
  url: string;
  section: 'institucional' | 'para_voce' | 'para_jornaleiro' | 'atalhos';
  order: number;
  active: boolean;
};

type FooterData = {
  title: string;
  description: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  links: FooterLink[];
};

// Cache simples em memória (funciona sem banco)
let footerCache: { data: FooterData | null; timestamp: number } = {
  data: null,
  timestamp: 0
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Dados padrão do footer
const getDefaultFooterData = (): FooterData => ({
  title: 'Guia das Bancas',
  description: 'Conectamos você às melhores bancas da sua região. Descubra produtos, ofertas e o jornaleiro mais próximo.',
  socialLinks: {
    instagram: 'https://instagram.com/guiadasbancas',
    facebook: 'https://facebook.com/guiadasbancas',
    twitter: 'https://twitter.com/guiadasbancas',
    youtube: 'https://youtube.com/@guiadasbancas'
  },
  links: [
    // Institucional
    { id: '1', text: 'Sobre nós', url: '/sobre-nos', section: 'institucional', order: 1, active: true },
    { id: '2', text: 'Como funciona', url: '/como-funciona', section: 'institucional', order: 2, active: true },
    { id: '3', text: 'Blog', url: '/blog', section: 'institucional', order: 3, active: true },
    { id: '4', text: 'Imprensa', url: '/imprensa', section: 'institucional', order: 4, active: true },
    
    // Para você
    { id: '5', text: 'Minha conta', url: '/minha-conta', section: 'para_voce', order: 1, active: true },
    { id: '6', text: 'Pedidos', url: '/minha-conta?tab=pedidos', section: 'para_voce', order: 2, active: true },
    { id: '7', text: 'Favoritos', url: '/minha-conta?tab=favoritos', section: 'para_voce', order: 3, active: true },
    { id: '8', text: 'Suporte', url: '/suporte', section: 'para_voce', order: 4, active: true },
    
    // Para o Jornaleiro
    { id: '9', text: 'Cadastre sua banca', url: '/jornaleiro/cadastro', section: 'para_jornaleiro', order: 1, active: true },
    { id: '10', text: 'Fazer login', url: '/jornaleiro/login', section: 'para_jornaleiro', order: 2, active: true },
    { id: '11', text: 'Central de ajuda', url: '/jornaleiro/ajuda', section: 'para_jornaleiro', order: 3, active: true },
    { id: '12', text: 'Termos para Parceiros', url: '/termos-parceiros', section: 'para_jornaleiro', order: 4, active: true },
    
    // Atalhos
    { id: '13', text: 'Bancas perto de você', url: '/bancas-perto-de-mim', section: 'atalhos', order: 1, active: true },
    { id: '14', text: 'Buscar produtos', url: '/buscar', section: 'atalhos', order: 2, active: true },
    { id: '15', text: 'Ofertas relâmpago', url: '/promocoes', section: 'atalhos', order: 3, active: true },
    { id: '16', text: 'Categorias', url: '/categorias', section: 'atalhos', order: 4, active: true }
  ]
});

// Função para carregar dados (apenas cache/padrão)
function loadFooterData(): FooterData {
  // Se tem dados no cache, usar
  if (footerCache.data) {
    console.log('Carregando dados do cache');
    return footerCache.data;
  }
  
  // Senão, usar dados padrão
  console.log('Carregando dados padrão');
  const defaultData = getDefaultFooterData();
  
  // Salvar no cache
  footerCache.data = defaultData;
  footerCache.timestamp = Date.now();
  
  return defaultData;
}

// Função para salvar dados (apenas cache)
function saveFooterData(footerData: FooterData): void {
  console.log('Salvando dados no cache');
  
  // Salvar no cache
  footerCache.data = footerData;
  footerCache.timestamp = Date.now();
}

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/admin/footer - Iniciando...');
    
    // Carregar dados (cache ou padrão)
    const footerData = loadFooterData();
    
    console.log('GET /api/admin/footer - Sucesso');
    return NextResponse.json(footerData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    });
  } catch (error) {
    console.error('Erro na API GET footer:', error);
    return NextResponse.json(getDefaultFooterData());
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('PUT /api/admin/footer - Iniciando...');
    
    const footerData: FooterData = await request.json();
    console.log('Dados recebidos:', { 
      title: footerData.title, 
      linksCount: footerData.links?.length || 0 
    });

    // Validações básicas
    if (!footerData.title?.trim()) {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 }
      );
    }

    // Salvar no cache
    saveFooterData(footerData);

    console.log('PUT /api/admin/footer - Sucesso');
    return NextResponse.json({ 
      success: true, 
      message: 'Footer atualizado com sucesso',
      data: footerData
    });
  } catch (error) {
    console.error('Erro na API PUT footer:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Redirecionar POST para PUT
  return PUT(request);
}

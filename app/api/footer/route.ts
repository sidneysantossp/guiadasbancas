import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { JOURNALEIRO_MARKETING_PATH } from "@/lib/jornaleiro-marketing";

type FooterLink = {
  id: string;
  text: string;
  url: string;
  section: 'institucional' | 'para_voce' | 'para_jornaleiro' | 'atalhos';
  order: number;
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
  links: {
    institucional: FooterLink[];
    para_voce: FooterLink[];
    para_jornaleiro: FooterLink[];
    atalhos: FooterLink[];
  };
};

// Cache simples em memória para API pública
let publicFooterCache: { data: FooterData | null; timestamp: number } = {
  data: null,
  timestamp: 0
};

const PUBLIC_CACHE_TTL = 10 * 60 * 1000; // 10 minutos

// Dados padrão do footer para fallback
const getDefaultFooterData = (): FooterData => ({
  title: 'Guia das Bancas',
  description: 'Conectamos você às melhores bancas da sua região. Descubra produtos, ofertas e o jornaleiro mais próximo.',
  socialLinks: {
    instagram: 'https://instagram.com/guiadasbancas',
    facebook: 'https://facebook.com/guiadasbancas',
    twitter: 'https://twitter.com/guiadasbancas',
    youtube: 'https://youtube.com/@guiadasbancas'
  },
  links: {
    institucional: [
      { id: '1', text: 'Sobre nós', url: '/sobre-nos', section: 'institucional', order: 1 },
      { id: '2', text: 'Como funciona', url: '/como-funciona', section: 'institucional', order: 2 },
      { id: '3', text: 'Blog', url: '/blog', section: 'institucional', order: 3 },
      { id: '4', text: 'Imprensa', url: '/imprensa', section: 'institucional', order: 4 }
    ],
    para_voce: [
      { id: '5', text: 'Minha conta', url: '/minha-conta/inteligencia', section: 'para_voce', order: 1 },
      { id: '6', text: 'Pedidos', url: '/minha-conta/pedidos', section: 'para_voce', order: 2 },
      { id: '7', text: 'Favoritos', url: '/minha-conta/favoritos', section: 'para_voce', order: 3 },
      { id: '8', text: 'Suporte', url: '/suporte', section: 'para_voce', order: 4 }
    ],
    para_jornaleiro: [
      { id: '9', text: 'Cadastre sua banca', url: JOURNALEIRO_MARKETING_PATH, section: 'para_jornaleiro', order: 1 },
      { id: '10', text: 'Fazer login', url: '/jornaleiro', section: 'para_jornaleiro', order: 2 },
      { id: '11', text: 'Central de ajuda', url: '/jornaleiro/ajuda', section: 'para_jornaleiro', order: 3 },
      { id: '12', text: 'Termos para Parceiros', url: '/termos-parceiros', section: 'para_jornaleiro', order: 4 }
    ],
    atalhos: [
      { id: '13', text: 'Bancas perto de você', url: '/bancas-perto-de-mim', section: 'atalhos', order: 1 },
      { id: '14', text: 'Buscar produtos', url: '/buscar', section: 'atalhos', order: 2 },
      { id: '15', text: 'Ofertas relâmpago', url: '/promocoes', section: 'atalhos', order: 3 },
      { id: '16', text: 'Categorias', url: '/categorias', section: 'atalhos', order: 4 }
    ]
  }
});

// Função simples para carregar dados (apenas padrão)
function loadFooterData(): FooterData {
  return getDefaultFooterData();
}

export async function GET() {
  try {
    // Verificar cache
    const now = Date.now();
    if (publicFooterCache.data && (now - publicFooterCache.timestamp) < PUBLIC_CACHE_TTL) {
      return NextResponse.json(publicFooterCache.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
          'X-Cache': 'HIT'
        }
      });
    }

    // Carregar dados
    const footerData = loadFooterData();

    // Atualizar cache
    publicFooterCache.data = footerData;
    publicFooterCache.timestamp = now;

    return NextResponse.json(footerData, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    logger.error('Erro na API pública footer:', error);
    
    // Retornar dados padrão em caso de erro
    return NextResponse.json(getDefaultFooterData(), {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        'X-Cache': 'ERROR'
      }
    });
  }
}

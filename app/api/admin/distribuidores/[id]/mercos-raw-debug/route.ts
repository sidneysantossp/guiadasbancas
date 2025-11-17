import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

/**
 * Endpoint para visualizar dados BRUTOS da API Mercos
 * Útil para diagnosticar problemas com campos faltando (ex: codigo_mercos)
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin;
    const distribuidorId = params.id;
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '5');
    const searchTerm = url.searchParams.get('search') || '';
    
    // Buscar dados do distribuidor
    const { data: distribuidor, error: distError } = await supabase
      .from('distribuidores')
      .select('*')
      .eq('id', distribuidorId)
      .single();

    if (distError || !distribuidor) {
      return NextResponse.json(
        { success: false, error: 'Distribuidor não encontrado' },
        { status: 404 }
      );
    }

    // Inicializar API Mercos
    const mercosApi = new MercosAPI({
      applicationToken: distribuidor.application_token,
      companyToken: distribuidor.company_token,
      baseUrl: distribuidor.base_url || 'https://app.mercos.com/api/v1',
    });

    // Testar conexão
    console.log('[MERCOS-RAW-DEBUG] Testando conexão...');
    const connectionTest = await mercosApi.testConnection();
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: `Falha ao conectar com API Mercos: ${connectionTest.error}`,
      }, { status: 400 });
    }

    console.log('[MERCOS-RAW-DEBUG] Buscando produtos...');
    const produtos = await mercosApi.getBatchProdutos({ limit });
    
    // Analisar campos disponíveis
    const camposDisponiveis = new Set<string>();
    const produtosComCodigo: any[] = [];
    const produtosSemCodigo: any[] = [];
    
    produtos.forEach(p => {
      Object.keys(p).forEach(k => camposDisponiveis.add(k));
      
      if (p.codigo) {
        produtosComCodigo.push(p);
      } else {
        produtosSemCodigo.push(p);
      }
    });

    // Verificar no banco quais produtos estão sem codigo_mercos
    const { data: produtosDB } = await supabase
      .from('products')
      .select('id, name, mercos_id, codigo_mercos')
      .eq('distribuidor_id', distribuidorId)
      .is('codigo_mercos', null)
      .limit(10);

    // Se houver termo de busca, filtrar produtos
    let produtosFiltrados = produtos;
    if (searchTerm) {
      produtosFiltrados = produtos.filter(p => 
        p.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      distribuidor: {
        id: distribuidor.id,
        name: distribuidor.name,
        base_url: distribuidor.base_url,
      },
      estatisticas: {
        total_retornados: produtos.length,
        com_codigo: produtosComCodigo.length,
        sem_codigo: produtosSemCodigo.length,
        percentual_com_codigo: Math.round((produtosComCodigo.length / produtos.length) * 100),
      },
      campos_disponiveis: Array.from(camposDisponiveis).sort(),
      exemplos: {
        primeiro_produto: produtos[0] || null,
        produto_com_codigo: produtosComCodigo[0] || null,
        produto_sem_codigo: produtosSemCodigo[0] || null,
      },
      produtos_raw: searchTerm ? produtosFiltrados : produtos.slice(0, 3),
      produtos_db_sem_codigo: produtosDB || [],
      dica: searchTerm 
        ? `Mostrando produtos que correspondem a: "${searchTerm}"`
        : 'Use ?search=TJ02 para buscar produtos específicos. Use ?limit=20 para ver mais produtos.',
    });

  } catch (error: any) {
    console.error('[MERCOS-RAW-DEBUG] Erro:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro desconhecido',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

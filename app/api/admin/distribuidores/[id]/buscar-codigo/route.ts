import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

/**
 * GET /api/admin/distribuidores/[id]/buscar-codigo?codigo=1220
 * Busca um produto específico por código na API Mercos
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url);
    const codigo = url.searchParams.get('codigo');
    
    if (!codigo) {
      return NextResponse.json({ error: 'Parâmetro "codigo" é obrigatório' }, { status: 400 });
    }

    const supabase = supabaseAdmin;
    const distribuidorId = params.id;
    
    // Buscar dados do distribuidor
    const { data: distribuidor, error: distError } = await supabase
      .from('distribuidores')
      .select('*')
      .eq('id', distribuidorId)
      .single();

    if (distError || !distribuidor) {
      return NextResponse.json({ error: 'Distribuidor não encontrado' }, { status: 404 });
    }

    // Inicializar API Mercos
    const mercosApi = new MercosAPI({
      applicationToken: distribuidor.application_token,
      companyToken: distribuidor.company_token,
      baseUrl: distribuidor.base_url || 'https://app.mercos.com/api/v1',
    });

    console.log(`[BUSCAR-CODIGO] Buscando código "${codigo}" na Mercos...`);

    // Buscar TODOS os produtos (não limitar)
    let encontrados: any[] = [];
    let todosOsProdutos: any[] = [];
    let offset: number | null = null;
    const limit = 200;
    let totalAtivos = 0;
    let totalInativos = 0;

    while (true) {
      const produtos = await mercosApi.getBatchProdutos({ 
        limit,
        afterId: offset
      });

      if (produtos.length === 0) break;

      todosOsProdutos.push(...produtos);
      
      // Contar ativos e inativos
      for (const produto of produtos) {
        if (produto.ativo && !produto.excluido) {
          totalAtivos++;
        } else {
          totalInativos++;
        }

        // Procurar pelo código
        const produtoCodigo = produto.codigo || '';
        const produtoNome = produto.nome || '';
        const produtoObs = produto.observacoes || '';
        
        if (produtoCodigo.includes(codigo) || 
            produtoNome.includes(codigo) ||
            produtoObs.includes(codigo)) {
          encontrados.push(produto);
        }
      }

      console.log(`[BUSCAR-CODIGO] Buscados ${todosOsProdutos.length} produtos (${totalAtivos} ativos, ${totalInativos} inativos)...`);

      if (produtos.length < limit) break;
      offset = produtos[produtos.length - 1].id;
    }

    console.log(`[BUSCAR-CODIGO] Busca concluída!`);
    console.log(`[BUSCAR-CODIGO] Total: ${todosOsProdutos.length} produtos`);
    console.log(`[BUSCAR-CODIGO] Ativos: ${totalAtivos}`);
    console.log(`[BUSCAR-CODIGO] Inativos: ${totalInativos}`);
    console.log(`[BUSCAR-CODIGO] Encontrados com código "${codigo}": ${encontrados.length}`);

    // Verificar no nosso banco
    const { data: produtosNoBanco } = await supabase
      .from('products')
      .select('id, name, mercos_id, codigo_mercos, active, images')
      .eq('distribuidor_id', distribuidorId)
      .or(`codigo_mercos.ilike.%${codigo}%,name.ilike.%${codigo}%`);

    return NextResponse.json({
      success: true,
      codigo_buscado: codigo,
      distribuidor: {
        id: distribuidor.id,
        nome: distribuidor.nome,
      },
      mercos: {
        total_produtos: todosOsProdutos.length,
        total_ativos: totalAtivos,
        total_inativos: totalInativos,
        encontrados_com_codigo: encontrados.length,
        produtos: encontrados,
      },
      nosso_banco: {
        encontrados: produtosNoBanco?.length || 0,
        produtos: produtosNoBanco || [],
      },
    });
  } catch (error: any) {
    console.error('[BUSCAR-CODIGO] Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

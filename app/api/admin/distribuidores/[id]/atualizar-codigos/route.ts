import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

export const maxDuration = 60; // 1 minuto
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/distribuidores/[id]/atualizar-codigos
 * Atualiza o campo codigo_mercos de todos os produtos do distribuidor
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin;
    const distribuidorId = params.id;
    
    console.log(`[ATUALIZAR-CODIGOS] Iniciando atualização para distribuidor ${distribuidorId}`);
    
    // Buscar dados do distribuidor
    const { data: distribuidor, error: distError } = await supabase
      .from('distribuidores')
      .select('*')
      .eq('id', distribuidorId)
      .single();

    if (distError || !distribuidor) {
      return NextResponse.json({ error: 'Distribuidor não encontrado' }, { status: 404 });
    }

    console.log(`[ATUALIZAR-CODIGOS] Distribuidor: ${distribuidor.nome}`);

    // Inicializar API Mercos
    const mercosApi = new MercosAPI({
      applicationToken: distribuidor.application_token,
      companyToken: distribuidor.company_token,
      baseUrl: distribuidor.base_url || 'https://app.mercos.com/api/v1',
    });

    // Buscar produtos da API Mercos (limitado para evitar timeout)
    console.log('[ATUALIZAR-CODIGOS] Buscando produtos na API Mercos...');
    let todosProdutos: any[] = [];
    let offset: number | null = null;
    const limit = 200;
    const maxProdutos = 2000; // Limite para evitar timeout
    let tentativas = 0;
    const maxTentativas = 10;

    try {
      while (todosProdutos.length < maxProdutos && tentativas < maxTentativas) {
        const produtos = await mercosApi.getBatchProdutos({ 
          limit,
          afterId: offset
        });

        if (produtos.length === 0) break;

        todosProdutos.push(...produtos);
        console.log(`[ATUALIZAR-CODIGOS] Buscados ${todosProdutos.length} produtos...`);

        if (produtos.length < limit) break;
        offset = produtos[produtos.length - 1].id;
        tentativas++;
      }
    } catch (apiError: any) {
      console.error('[ATUALIZAR-CODIGOS] Erro ao buscar da API Mercos:', apiError.message);
      return NextResponse.json({ 
        success: false, 
        error: `Erro ao buscar produtos da API Mercos: ${apiError.message}`,
        parcial: true,
        produtos_buscados: todosProdutos.length,
      }, { status: 500 });
    }

    console.log(`[ATUALIZAR-CODIGOS] Total na API Mercos: ${todosProdutos.length}`);

    // Criar mapa de mercos_id -> codigo
    const codigosPorMercosId = new Map();
    let comCodigo = 0;
    let semCodigo = 0;

    for (const produto of todosProdutos) {
      if (produto.codigo && produto.codigo.trim() !== '') {
        codigosPorMercosId.set(produto.id, produto.codigo);
        comCodigo++;
      } else {
        semCodigo++;
      }
    }

    console.log(`[ATUALIZAR-CODIGOS] Com código na API: ${comCodigo}`);
    console.log(`[ATUALIZAR-CODIGOS] Sem código na API: ${semCodigo}`);

    // Buscar produtos no nosso banco
    const { data: produtosNoBanco } = await supabase
      .from('products')
      .select('id, mercos_id, name, codigo_mercos, active')
      .eq('distribuidor_id', distribuidorId);

    console.log(`[ATUALIZAR-CODIGOS] Produtos no banco: ${produtosNoBanco?.length || 0}`);

    if (!produtosNoBanco || produtosNoBanco.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Nenhum produto encontrado no banco',
      }, { status: 404 });
    }

    // Atualizar produtos em lotes
    let atualizados = 0;
    let semMudanca = 0;
    let naoEncontrados = 0;
    const erros: any[] = [];
    const batchSize = 50;

    for (let i = 0; i < produtosNoBanco.length; i += batchSize) {
      const batch = produtosNoBanco.slice(i, i + batchSize);
      
      for (const produto of batch) {
        const codigoNaMercos = codigosPorMercosId.get(produto.mercos_id);
        
        if (!codigoNaMercos) {
          naoEncontrados++;
          continue;
        }

        if (produto.codigo_mercos === codigoNaMercos) {
          semMudanca++;
          continue;
        }

        // Atualizar o código
        try {
          const { error } = await supabase
            .from('products')
            .update({ 
              codigo_mercos: codigoNaMercos,
              updated_at: new Date().toISOString()
            })
            .eq('id', produto.id);

          if (error) {
            console.error(`[ATUALIZAR-CODIGOS] Erro ao atualizar ${produto.name}:`, error);
            erros.push({ produto: produto.name, erro: error.message });
          } else {
            atualizados++;
          }
        } catch (updateError: any) {
          console.error(`[ATUALIZAR-CODIGOS] Exceção ao atualizar ${produto.name}:`, updateError);
          erros.push({ produto: produto.name, erro: updateError.message });
        }
      }
      
      if ((i + batchSize) % 200 === 0) {
        console.log(`[ATUALIZAR-CODIGOS] Progresso: ${i + batchSize}/${produtosNoBanco.length}`);
      }
    }

    console.log(`[ATUALIZAR-CODIGOS] Concluído! Atualizados: ${atualizados}`);

    // Verificar resultado final
    const { count: totalComCodigo } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .not('codigo_mercos', 'is', null)
      .neq('codigo_mercos', '');

    const { count: totalAtivos } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('active', true);

    const { count: ativosComCodigo } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('active', true)
      .not('codigo_mercos', 'is', null)
      .neq('codigo_mercos', '');

    return NextResponse.json({
      success: true,
      distribuidor: {
        id: distribuidor.id,
        nome: distribuidor.nome,
      },
      api_mercos: {
        total_produtos: todosProdutos.length,
        com_codigo: comCodigo,
        sem_codigo: semCodigo,
      },
      resultado: {
        atualizados,
        sem_mudanca: semMudanca,
        nao_encontrados: naoEncontrados,
        erros: erros.length,
      },
      estatisticas_finais: {
        total_com_codigo: totalComCodigo || 0,
        total_ativos: totalAtivos || 0,
        ativos_com_codigo: ativosComCodigo || 0,
        percentual: (totalAtivos && ativosComCodigo) ? Math.round((ativosComCodigo / totalAtivos) * 100) : 0,
      },
      erros: erros.slice(0, 10), // Máximo 10 erros no response
    });
  } catch (error: any) {
    console.error('[ATUALIZAR-CODIGOS] Erro fatal:', error);
    
    // Garantir que sempre retornamos JSON válido
    const errorMessage = error?.message || 'Erro desconhecido';
    const errorStack = error?.stack || '';
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        tipo_erro: error?.name || 'Unknown',
        detalhes: errorStack.split('\n').slice(0, 3).join('\n'),
        timestamp: new Date().toISOString(),
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

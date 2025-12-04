import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distribuidorId = searchParams.get('id');
    const full = searchParams.get('full') === 'true';

    if (!distribuidorId) {
      return NextResponse.json(
        { success: false, error: 'ID do distribuidor é obrigatório' },
        { status: 400 }
      );
    }

    console.log(`[Sync] Iniciando sincronização para distribuidor ${distribuidorId} (full: ${full})`);

    // Buscar dados do distribuidor
    const { data: distribuidor, error: distError } = await supabaseAdmin
      .from('distribuidores')
      .select('id, nome, mercos_application_token, mercos_company_token, ultima_sincronizacao')
      .eq('id', distribuidorId)
      .single();

    if (distError || !distribuidor) {
      return NextResponse.json({
        success: false,
        error: 'Distribuidor não encontrado',
      });
    }

    // Verificar se tem tokens configurados (sem expor detalhes sensíveis)
    if (!distribuidor.mercos_application_token || !distribuidor.mercos_company_token) {
      return NextResponse.json({
        success: false,
        error: 'Integração não configurada. Entre em contato com o suporte para ativar.',
        needsSetup: true,
      });
    }

    // Preparar parâmetros da requisição
    let url = 'https://app.mercos.com/api/v2/produtos?limite=100&ordenar_por=ultima_alteracao&ordem=desc';
    
    // Se não for full e tiver última sincronização, usar alterado_apos
    if (!full && distribuidor.ultima_sincronizacao) {
      const lastSync = new Date(distribuidor.ultima_sincronizacao);
      url += `&alterado_apos=${lastSync.toISOString()}`;
    }

    console.log(`[Sync] URL: ${url}`);

    // Buscar produtos da API Mercos
    const mercosRes = await fetch(url, {
      headers: {
        'ApplicationToken': distribuidor.mercos_application_token,
        'CompanyToken': distribuidor.mercos_company_token,
        'Content-Type': 'application/json',
      },
    });

    if (!mercosRes.ok) {
      return NextResponse.json({
        success: false,
        error: `Erro na API Mercos: ${mercosRes.status} ${mercosRes.statusText}`,
      });
    }

    const produtos = await mercosRes.json();
    
    if (!Array.isArray(produtos)) {
      return NextResponse.json({
        success: false,
        error: 'Resposta inválida da API Mercos',
      });
    }

    console.log(`[Sync] ${produtos.length} produtos recebidos da Mercos`);

    let produtosAtualizados = 0;
    let produtosNovos = 0;
    let erros = 0;

    // Processar cada produto
    for (const produto of produtos) {
      try {
        // Verificar se produto já existe
        const { data: existente } = await supabaseAdmin
          .from('products')
          .select('id')
          .eq('mercos_id', produto.id)
          .eq('distribuidor_id', distribuidorId)
          .single();

        const productData = {
          name: produto.nome,
          description: produto.descricao || '',
          price: parseFloat(produto.preco_tabela) || 0,
          stock: produto.saldo_estoque || 0,
          active: produto.ativo && !produto.excluido,
          mercos_id: produto.id,
          codigo_mercos: produto.codigo || null,
          distribuidor_id: distribuidorId,
          updated_at: new Date().toISOString(),
        };

        if (existente) {
          // Atualizar produto existente
          await supabaseAdmin
            .from('products')
            .update(productData)
            .eq('id', existente.id);
          produtosAtualizados++;
        } else {
          // Inserir novo produto
          await supabaseAdmin
            .from('products')
            .insert({
              ...productData,
              created_at: new Date().toISOString(),
            });
          produtosNovos++;
        }
      } catch (err) {
        console.error(`[Sync] Erro ao processar produto ${produto.id}:`, err);
        erros++;
      }
    }

    // Atualizar última sincronização
    await supabaseAdmin
      .from('distribuidores')
      .update({ ultima_sincronizacao: new Date().toISOString() })
      .eq('id', distribuidorId);

    // Contar total de produtos ativos
    const { count: totalProdutos } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('active', true);

    console.log(`[Sync] Concluído: ${produtosNovos} novos, ${produtosAtualizados} atualizados, ${erros} erros`);

    return NextResponse.json({
      success: true,
      data: {
        produtos_novos: produtosNovos,
        produtos_atualizados: produtosAtualizados,
        erros: erros,
        total_produtos: totalProdutos || 0,
        sincronizado_em: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[Sync] Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

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

    // Buscar dados do distribuidor incluindo status ativo e base_url
    const { data: distribuidor, error: distError } = await supabaseAdmin
      .from('distribuidores')
      .select('id, nome, ativo, application_token, company_token, base_url, ultima_sincronizacao')
      .eq('id', distribuidorId)
      .single();

    if (distError || !distribuidor) {
      return NextResponse.json({
        success: false,
        error: 'Distribuidor não encontrado',
      });
    }

    // Verificar se o distribuidor está ativo no admin
    if (!distribuidor.ativo) {
      return NextResponse.json({
        success: false,
        error: 'Integração desativada pelo administrador.',
        isDisabled: true,
      });
    }

    // Verificar se tem tokens configurados (sem expor detalhes sensíveis)
    if (!distribuidor.application_token || !distribuidor.company_token) {
      return NextResponse.json({
        success: false,
        error: 'Integração não configurada. Entre em contato com o suporte para ativar.',
        needsSetup: true,
      });
    }

    // Preparar parâmetros da requisição usando base_url configurada
    const baseUrl = distribuidor.base_url || 'https://app.mercos.com/api/v1';
    const limit = 500; // buscar em páginas grandes para aproximar real time
    const allProdutos: any[] = [];

    const lastSyncParam = (!full && distribuidor.ultima_sincronizacao)
      ? `&alterado_apos=${new Date(distribuidor.ultima_sincronizacao).toISOString()}`
      : '';

    for (let page = 1; page <= 50; page++) { // safety cap
      let url = `${baseUrl}/produtos?limit=${limit}&page=${page}&order_by=ultima_alteracao&order_direction=desc${lastSyncParam}`;
      console.log(`[Sync] Fetching page ${page}: ${url}`);

      const mercosRes = await fetch(url, {
        headers: {
          'ApplicationToken': distribuidor.application_token,
          'CompanyToken': distribuidor.company_token,
          'Content-Type': 'application/json',
        },
      });

      if (!mercosRes.ok) {
        return NextResponse.json({
          success: false,
          error: `Erro na API Mercos: ${mercosRes.status} ${mercosRes.statusText}`,
        });
      }

      const contentType = mercosRes.headers.get('content-type') || '';
      let produtosPage: any;
      try {
        if (contentType.includes('application/json')) {
          produtosPage = await mercosRes.json();
        } else {
          const text = await mercosRes.text();
          throw new Error(`Resposta não-JSON da Mercos: ${text.slice(0, 200)}`);
        }
      } catch (parseErr: any) {
        return NextResponse.json({
          success: false,
          error: `Resposta inválida da API Mercos (page ${page}): ${parseErr?.message || parseErr}`,
        }, { status: 502 });
      }

      if (!Array.isArray(produtosPage)) {
        return NextResponse.json({
          success: false,
          error: `Resposta inválida da API Mercos (page ${page})`,
        });
      }

      allProdutos.push(...produtosPage);
      if (produtosPage.length < limit) {
        break; // última página
      }
    }

    console.log(`[Sync] ${allProdutos.length} produtos recebidos da Mercos (full=${full})`);

    let produtosAtualizados = 0;
    let produtosNovos = 0;
    let erros = 0;

    // Processar cada produto
    for (const produto of allProdutos) {
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

    // Se sincronização full, desativar produtos que não vieram na resposta
    if (full) {
      const mercosIdsSet = new Set(allProdutos.map((p: any) => String(p.id)));
      // Buscar todos mercos_id existentes para desativar apenas os que não vieram
      const { data: existingMercosIds } = await supabaseAdmin
        .from('products')
        .select('id, mercos_id')
        .eq('distribuidor_id', distribuidorId)
        .not('mercos_id', 'is', null);

      const toDeactivate = (existingMercosIds || [])
        .filter((p: any) => !mercosIdsSet.has(String(p.mercos_id)))
        .map((p: any) => p.id);

      // Desativar em lotes para evitar limites de IN
      const chunkSize = 500;
      for (let i = 0; i < toDeactivate.length; i += chunkSize) {
        const chunk = toDeactivate.slice(i, i + chunkSize);
        await supabaseAdmin
          .from('products')
          .update({ active: false })
          .in('id', chunk);
      }

      // Se resposta veio vazia, desativar todos deste distribuidor
      if (allProdutos.length === 0) {
        await supabaseAdmin
          .from('products')
          .update({ active: false })
          .eq('distribuidor_id', distribuidorId);
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
      .select('id', { count: 'exact', head: true })
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

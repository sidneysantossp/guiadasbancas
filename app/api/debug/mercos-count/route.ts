import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutos

/**
 * Endpoint de debug para contar todos os produtos na API Mercos
 * Usa paginação correta com alterado_apos + MEUSPEDIDOS_LIMITOU_REGISTROS
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const distribuidorId = searchParams.get('id') || '1511df09-1f4a-4e68-9f8c-05cd06be6269';
  
  try {
    // Buscar tokens do distribuidor
    const { data: distribuidor, error: distError } = await supabaseAdmin
      .from('distribuidores')
      .select('id, nome, application_token, company_token, base_url')
      .eq('id', distribuidorId)
      .single();

    if (distError || !distribuidor) {
      return NextResponse.json({ error: 'Distribuidor não encontrado' }, { status: 404 });
    }

    if (!distribuidor.application_token || !distribuidor.company_token) {
      return NextResponse.json({ error: 'Tokens não configurados' }, { status: 400 });
    }

    const baseUrl = distribuidor.base_url || 'https://app.mercos.com/api/v1';
    const BATCH_SIZE = 200;
    const MAX_PAGES = 200; // Até 40.000 produtos
    
    let alteradoApos = '2000-01-01T00:00:00';
    let hasMore = true;
    let pageCount = 0;
    let totalProdutos = 0;
    let produtosAtivos = 0;
    let produtosInativos = 0;
    let produtosExcluidos = 0;
    const pages: { page: number; count: number; lastDate: string }[] = [];

    console.log(`[DEBUG] Contando produtos da Mercos para ${distribuidor.nome}...`);

    while (hasMore && pageCount < MAX_PAGES) {
      pageCount++;
      
      const queryParams = new URLSearchParams();
      queryParams.append('alterado_apos', alteradoApos);
      queryParams.append('limit', BATCH_SIZE.toString());
      queryParams.append('order_by', 'ultima_alteracao');
      queryParams.append('order_direction', 'asc');
      
      const url = `${baseUrl}/produtos?${queryParams.toString()}`;

      const mercosRes = await fetch(url, {
        headers: {
          'ApplicationToken': distribuidor.application_token,
          'CompanyToken': distribuidor.company_token,
          'Content-Type': 'application/json',
        },
      });

      // Tratamento de throttling
      if (mercosRes.status === 429) {
        const throttleData = await mercosRes.json().catch(() => ({ tempo_ate_permitir_novamente: 5 }));
        const waitTime = (throttleData.tempo_ate_permitir_novamente || 5) * 1000;
        console.log(`[DEBUG] Throttling, aguardando ${waitTime/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        pageCount--;
        continue;
      }

      if (!mercosRes.ok) {
        return NextResponse.json({
          error: `Erro na API Mercos: ${mercosRes.status}`,
          parcial: { totalProdutos, produtosAtivos, produtosInativos, produtosExcluidos, pages }
        });
      }

      const limitouRegistros = mercosRes.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS') === '1';
      
      const raw = await mercosRes.text();
      let parsed: any;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return NextResponse.json({ error: 'Resposta inválida da Mercos', raw: raw.slice(0, 200) });
      }

      const produtos = (parsed && typeof parsed === 'object' && 'data' in parsed && Array.isArray(parsed.data))
        ? parsed.data
        : (Array.isArray(parsed) ? parsed : []);

      if (produtos.length === 0) {
        hasMore = false;
        break;
      }

      // Contar por status
      for (const p of produtos) {
        totalProdutos++;
        if (p.excluido) {
          produtosExcluidos++;
        } else if (!p.ativo) {
          produtosInativos++;
        } else {
          produtosAtivos++;
        }
      }

      // Ordenar e pegar última data
      produtos.sort((a: any, b: any) => {
        const ta = (a.ultima_alteracao || '').toString();
        const tb = (b.ultima_alteracao || '').toString();
        return ta.localeCompare(tb);
      });
      
      const ultimoProduto = produtos[produtos.length - 1];
      const lastDate = ultimoProduto?.ultima_alteracao || '';
      
      pages.push({ page: pageCount, count: produtos.length, lastDate });
      
      console.log(`[DEBUG] Página ${pageCount}: ${produtos.length} produtos (total: ${totalProdutos}, limitou: ${limitouRegistros})`);

      if (limitouRegistros && lastDate) {
        alteradoApos = lastDate;
      } else {
        hasMore = false;
      }
    }

    // Contar produtos no banco local
    const { count: produtosNoBanco } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId);

    const { count: produtosAtivosNoBanco } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('active', true);

    return NextResponse.json({
      distribuidor: distribuidor.nome,
      mercos: {
        total: totalProdutos,
        ativos: produtosAtivos,
        inativos: produtosInativos,
        excluidos: produtosExcluidos,
        paginas_processadas: pageCount,
        atingiu_limite: pageCount >= MAX_PAGES,
      },
      banco_local: {
        total: produtosNoBanco || 0,
        ativos: produtosAtivosNoBanco || 0,
      },
      diferenca: {
        total: totalProdutos - (produtosNoBanco || 0),
        ativos: produtosAtivos - (produtosAtivosNoBanco || 0),
      },
      primeiras_paginas: pages.slice(0, 5),
      ultimas_paginas: pages.slice(-3),
    });
  } catch (error: any) {
    console.error('[DEBUG] Erro:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

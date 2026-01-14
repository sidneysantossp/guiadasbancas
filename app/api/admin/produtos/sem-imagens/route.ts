import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';

// GET /api/admin/produtos/sem-imagens
// Lista produtos que possuem codigo_mercos mas não têm imagens vinculadas
export async function GET(req: NextRequest) {
  try {
    // Auth check
    const bearer = req.headers.get('authorization');
    const hasAdminToken = !!bearer && bearer.trim() === 'Bearer admin-token';
    let isAdmin = hasAdminToken;

    if (!isAdmin) {
      const session = await auth();
      isAdmin = !!(session?.user && (session.user as any).role === 'admin');
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const distribuidorId = searchParams.get('distribuidor_id');
    const limit = parseInt(searchParams.get('limit') || '500', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const exportCsv = searchParams.get('export') === 'csv';

    // Query para produtos com codigo_mercos mas sem imagens
    let query = supabaseAdmin
      .from('products')
      .select('id, name, codigo_mercos, mercos_id, distribuidor_id, active, created_at', { count: 'exact' })
      .not('codigo_mercos', 'is', null)
      .neq('codigo_mercos', '')
      .or('images.is.null,images.eq.[]')
      .order('codigo_mercos', { ascending: true });

    if (distribuidorId) {
      query = query.eq('distribuidor_id', distribuidorId);
    }

    // Para export CSV, buscar todos
    if (!exportCsv) {
      query = query.range(offset, offset + limit - 1);
    }

    const { data: produtos, error, count } = await query;

    if (error) {
      console.error('Erro ao buscar produtos sem imagens:', error);
      return NextResponse.json({ error: 'Erro ao buscar produtos', details: error.message }, { status: 500 });
    }

    // Se for export CSV, retornar como arquivo
    if (exportCsv && produtos) {
      const csvHeader = 'codigo_mercos,nome,mercos_id,ativo\n';
      const csvRows = produtos.map(p => 
        `"${p.codigo_mercos || ''}","${(p.name || '').replace(/"/g, '""')}","${p.mercos_id || ''}","${p.active ? 'Sim' : 'Não'}"`
      ).join('\n');
      const csv = csvHeader + csvRows;

      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="produtos-sem-imagens-${new Date().toISOString().slice(0,10)}.csv"`,
        },
      });
    }

    // Buscar nome do distribuidor se filtrado
    let distribuidorNome = null;
    if (distribuidorId) {
      const { data: dist } = await supabaseAdmin
        .from('distribuidores')
        .select('nome')
        .eq('id', distribuidorId)
        .single();
      distribuidorNome = dist?.nome;
    }

    // Estatísticas adicionais
    const { count: totalComCodigo } = await supabaseAdmin
      .from('products')
      .select('id', { count: 'exact', head: true })
      .not('codigo_mercos', 'is', null)
      .neq('codigo_mercos', '')
      .eq(distribuidorId ? 'distribuidor_id' : 'id', distribuidorId || supabaseAdmin.rpc('uuid_generate_v4'));

    // Total de produtos com imagens
    let queryComImagem = supabaseAdmin
      .from('products')
      .select('id', { count: 'exact', head: true })
      .not('codigo_mercos', 'is', null)
      .neq('codigo_mercos', '')
      .not('images', 'is', null)
      .neq('images', '[]');

    if (distribuidorId) {
      queryComImagem = queryComImagem.eq('distribuidor_id', distribuidorId);
    }

    const { count: totalComImagem } = await queryComImagem;

    return NextResponse.json({
      success: true,
      data: produtos,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      },
      stats: {
        totalSemImagem: count || 0,
        totalComImagem: totalComImagem || 0,
        totalComCodigo: (count || 0) + (totalComImagem || 0),
        percentualSemImagem: ((count || 0) / ((count || 0) + (totalComImagem || 0)) * 100).toFixed(1) + '%'
      },
      filtro: {
        distribuidor_id: distribuidorId,
        distribuidor_nome: distribuidorNome
      }
    });

  } catch (error: any) {
    console.error('Erro ao buscar produtos sem imagens:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    );
  }
}

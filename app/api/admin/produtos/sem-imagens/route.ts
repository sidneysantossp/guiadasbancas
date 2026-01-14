import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';

// Helper para verificar se produto tem imagens
function hasImages(images: any): boolean {
  if (!images) return false;
  if (Array.isArray(images) && images.length === 0) return false;
  if (typeof images === 'string' && (images === '[]' || images === '')) return false;
  if (Array.isArray(images) && images.length > 0) return true;
  return false;
}

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
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const exportCsv = searchParams.get('export') === 'csv';

    // Query para produtos com codigo_mercos (buscar todos para filtrar em JS)
    let query = supabaseAdmin
      .from('products')
      .select('id, name, codigo_mercos, mercos_id, distribuidor_id, active, created_at, images')
      .not('codigo_mercos', 'is', null)
      .neq('codigo_mercos', '')
      .order('codigo_mercos', { ascending: true });

    if (distribuidorId) {
      query = query.eq('distribuidor_id', distribuidorId);
    }

    // Buscar até 10000 produtos para filtrar
    query = query.limit(10000);

    const { data: allProdutos, error } = await query;

    if (error) {
      console.error('Erro ao buscar produtos:', error);
      return NextResponse.json({ error: 'Erro ao buscar produtos', details: error.message }, { status: 500 });
    }

    // Filtrar produtos SEM imagens em JavaScript
    const produtosSemImagem = (allProdutos || []).filter(p => !hasImages(p.images));
    const produtosComImagem = (allProdutos || []).filter(p => hasImages(p.images));

    // Aplicar paginação nos resultados filtrados
    const paginatedProducts = exportCsv 
      ? produtosSemImagem 
      : produtosSemImagem.slice(offset, offset + limit);

    // Remover campo images do retorno (não precisa)
    const cleanProducts = paginatedProducts.map(({ images, ...rest }) => rest);

    // Se for export CSV, retornar como arquivo
    if (exportCsv) {
      const csvHeader = 'codigo_mercos,nome,mercos_id,ativo\n';
      const csvRows = produtosSemImagem.map(p => 
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

    const totalSemImagem = produtosSemImagem.length;
    const totalComImagem = produtosComImagem.length;
    const totalComCodigo = totalSemImagem + totalComImagem;

    return NextResponse.json({
      success: true,
      data: cleanProducts,
      pagination: {
        total: totalSemImagem,
        limit,
        offset,
        hasMore: totalSemImagem > offset + limit
      },
      stats: {
        totalSemImagem,
        totalComImagem,
        totalComCodigo,
        percentualSemImagem: totalComCodigo > 0 
          ? (totalSemImagem / totalComCodigo * 100).toFixed(1) + '%' 
          : '0%'
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

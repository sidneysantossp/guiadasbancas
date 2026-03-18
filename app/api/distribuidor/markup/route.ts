import { NextRequest, NextResponse } from 'next/server';
import {
  deleteDistribuidorMarkup,
  getDistribuidorMarkupOverview,
  saveDistribuidorMarkup,
} from '@/lib/modules/distribuidor/markup';
import { requireDistribuidorAccess } from '@/lib/security/distribuidor-auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// GET - Buscar configurações de markup do distribuidor
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distribuidorId = searchParams.get('id');
    const authError = await requireDistribuidorAccess(request, distribuidorId);
    if (authError) return authError;

    try {
      const data = await getDistribuidorMarkupOverview(String(distribuidorId || ''));
      return NextResponse.json({
        success: true,
        data: {
          global: data.global,
          categorias: data.categorias,
          produtos: data.produtos,
          categorias_disponiveis: data.categoriasDisponiveis,
          total_produtos: data.totalProdutos,
        },
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    } catch (error: any) {
      if (error?.code === 'PGRST116') {
        console.error('[Markup] Erro ao buscar distribuidor:', error);
        return NextResponse.json(
          { success: false, error: 'Distribuidor não encontrado' },
          { status: 404 }
        );
      }
      throw error;
    }
  } catch (error: any) {
    console.error('[Markup] Erro geral:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Salvar configurações de markup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { distribuidor_id, tipo, ...dados } = body;
    const authError = await requireDistribuidorAccess(request, distribuidor_id);
    if (authError) return authError;

    if (tipo !== 'global' && tipo !== 'categoria' && tipo !== 'produto') {
      return NextResponse.json(
        { success: false, error: 'Tipo de markup inválido' },
        { status: 400 }
      );
    }

    console.log('[Markup] Salvando markup:', { distribuidor_id, tipo, dados });
    await saveDistribuidorMarkup({
      distribuidorId: String(distribuidor_id || ''),
      tipo,
      dados,
    });

    return NextResponse.json({ success: true }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('[Markup] Erro ao salvar:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remover markup específico (categoria ou produto)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const id = searchParams.get('id');
    const distribuidorId = searchParams.get('distribuidor_id');

    if (!tipo || !id) {
      return NextResponse.json(
        { success: false, error: 'Tipo e ID são obrigatórios' },
        { status: 400 }
      );
    }

    const authError = await requireDistribuidorAccess(request, distribuidorId);
    if (authError) return authError;
    await deleteDistribuidorMarkup({
      distribuidorId,
      tipo: tipo as 'categoria' | 'produto',
      id,
    });

    return NextResponse.json({ success: true }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('[Markup] Erro ao deletar:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

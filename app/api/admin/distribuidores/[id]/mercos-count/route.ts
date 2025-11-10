import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

// dar uma janela ampla para completar a contagem
export const maxDuration = 300;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin;

    // Buscar dados do distribuidor
    const { data: distribuidor, error: distError } = await supabase
      .from('distribuidores')
      .select('*')
      .eq('id', params.id)
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

    const start = Date.now();
    const MAX_TIME_MS = 260_000; // 4m20s ~ deixa margem para encerramento

    let total = 0;
    let batches = 0;
    let completed = true;

    // Conta por streaming (mais confiável quando não há header com total)
    for await (const lote of mercosApi.getAllProdutosGenerator({ batchSize: 200 })) {
      total += lote.length;
      batches += 1;
      if ((Date.now() - start) > MAX_TIME_MS) {
        completed = false;
        break;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        mercos_total_produtos: total,
        batches,
        completed,
        elapsed_ms: Date.now() - start,
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Tentar buscar uma banca e ver quais campos retornam
    const { data: bancas, error } = await supabase
      .from('bancas')
      .select('id, name, is_cotista, cotista_id, cotista_codigo, cotista_razao_social, cotista_cnpj_cpf, user_id')
      .limit(5);

    if (error) {
      logger.error('Erro ao buscar bancas no debug de cotista:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: 'Erro ao consultar tabela bancas'
      });
    }

    // Verificar se os campos existem
    const camposExistentes = bancas && bancas.length > 0 ? Object.keys(bancas[0]) : [];
    const camposCotista = ['is_cotista', 'cotista_id', 'cotista_codigo', 'cotista_razao_social', 'cotista_cnpj_cpf'];
    const camposFaltando = camposCotista.filter(campo => !camposExistentes.includes(campo));

    const response = {
      success: true,
      totalBancas: bancas?.length || 0,
      camposExistentes: camposExistentes,
      camposCotista: camposCotista,
      camposFaltando: camposFaltando,
      bancasComCotista: bancas?.filter(b => b && b.is_cotista === true).length || 0,
      amostras: bancas?.map(b => b ? ({
        id: b.id || null,
        name: b.name || null,
        is_cotista: b.is_cotista || null,
        cotista_razao_social: b.cotista_razao_social || null
      }) : null).filter(Boolean) || []
    };
    
    return NextResponse.json(response);

  } catch (error) {
    logger.error('Erro geral no debug de cotista:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

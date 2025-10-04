import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/admin/schema/products
// Lista colunas existentes na tabela 'products' e retorna uma amostra de 1 linha
export async function GET(req: NextRequest) {
  try {
    const supabase = supabaseAdmin;

    // Tentar consultar o information_schema
    const { data: columns, error: colsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'products')
      .order('column_name');

    // Amostra de 1 registro para ver chaves existentes
    const { data: sample } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    return NextResponse.json({
      success: true,
      errors: { columns: colsError?.message || null },
      columns: columns || [],
      sample: sample?.[0] || null,
      has_fields: {
        distribuidor_id: !!(columns || []).find((c: any) => c.column_name === 'distribuidor_id'),
        mercos_id: !!(columns || []).find((c: any) => c.column_name === 'mercos_id'),
        origem: !!(columns || []).find((c: any) => c.column_name === 'origem'),
        stock_qty: !!(columns || []).find((c: any) => c.column_name === 'stock_qty'),
        images: !!(columns || []).find((c: any) => c.column_name === 'images'),
        banca_id_nullable_hint: undefined,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

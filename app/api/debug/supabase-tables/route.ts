import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    // 1. Verificar quais tabelas existem
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    // 2. Testar cada tabela principal
    const tablesToCheck = ['bancas', 'categories', 'products', 'orders', 'branding', 'user_profiles'];
    const tableStatus: Record<string, any> = {};

    for (const tableName of tablesToCheck) {
      try {
        const { data, error, count } = await supabaseAdmin
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        tableStatus[tableName] = {
          exists: !error,
          count: count || 0,
          error: error?.message || null
        };
      } catch (e) {
        tableStatus[tableName] = {
          exists: false,
          count: 0,
          error: e instanceof Error ? e.message : 'Unknown error'
        };
      }
    }

    // 3. Verificar estrutura de uma tabela específica (bancas)
    let bancasStructure = null;
    try {
      const { data: columns } = await supabaseAdmin
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_schema', 'public')
        .eq('table_name', 'bancas')
        .order('ordinal_position');
      
      bancasStructure = columns;
    } catch (e) {
      bancasStructure = { error: e instanceof Error ? e.message : 'Unknown error' };
    }

    return NextResponse.json({
      success: true,
      allTables: tables,
      tablesError,
      tableStatus,
      bancasStructure,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Endpoint de diagnóstico para verificar se a tabela order_history existe e funciona
 * Acesse: /api/debug/order-history-check
 */
export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    checks: {}
  };

  try {
    // 1. Verificar se a tabela existe
    results.checks.tableExists = {
      status: 'checking',
      message: 'Verificando se tabela order_history existe...'
    };

    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('order_history')
      .select('*')
      .limit(1);

    if (tablesError) {
      if (tablesError.code === '42P01') {
        results.checks.tableExists = {
          status: 'error',
          message: '❌ Tabela order_history NÃO existe!',
          error: tablesError.message,
          solution: 'Execute o SQL: /database/VERIFICAR_E_CRIAR_ORDER_HISTORY.sql'
        };
      } else {
        results.checks.tableExists = {
          status: 'error',
          message: 'Erro ao verificar tabela',
          error: tablesError.message
        };
      }
    } else {
      results.checks.tableExists = {
        status: 'success',
        message: '✅ Tabela order_history existe!'
      };
    }

    // 2. Contar entradas
    if (results.checks.tableExists.status === 'success') {
      const { count, error: countError } = await supabaseAdmin
        .from('order_history')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        results.checks.count = {
          status: 'error',
          message: 'Erro ao contar entradas',
          error: countError.message
        };
      } else {
        results.checks.count = {
          status: 'success',
          message: `✅ Total de entradas: ${count || 0}`,
          total: count || 0
        };
      }

      // 3. Buscar últimas 5 entradas
      const { data: recentEntries, error: entriesError } = await supabaseAdmin
        .from('order_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (entriesError) {
        results.checks.recentEntries = {
          status: 'error',
          message: 'Erro ao buscar entradas recentes',
          error: entriesError.message
        };
      } else {
        results.checks.recentEntries = {
          status: 'success',
          message: `✅ ${recentEntries?.length || 0} entradas recentes encontradas`,
          data: recentEntries
        };
      }
    }

    // 4. Resumo final
    const allSuccess = Object.values(results.checks).every(
      (check: any) => check.status === 'success'
    );

    results.summary = {
      status: allSuccess ? 'success' : 'error',
      message: allSuccess 
        ? '✅ Tudo funcionando corretamente!' 
        : '❌ Há problemas que precisam ser resolvidos'
    };

    return NextResponse.json(results, { 
      status: allSuccess ? 200 : 500 
    });

  } catch (error) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      summary: {
        status: 'error',
        message: '❌ Erro inesperado ao verificar sistema'
      },
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      results
    }, { status: 500 });
  }
}

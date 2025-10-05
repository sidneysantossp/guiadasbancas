import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET - Buscar histórico de um pedido
export async function GET(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const orderId = context.params.id;
    console.log('[API Order History GET] Buscando histórico para pedido:', orderId);

    const { data, error } = await supabaseAdmin
      .from('order_history')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    console.log('[API Order History GET] Supabase response:', { data, error });

    if (error) {
      console.error('[API Order History GET] Erro do Supabase:', error);
      return NextResponse.json(
        { 
          error: 'Erro ao buscar histórico do pedido',
          details: error.message,
          hint: error.hint
        },
        { status: 500 }
      );
    }

    console.log('[API Order History GET] Retornando', data?.length || 0, 'entradas');
    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('[API Order History GET] Erro inesperado:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Adicionar entrada no histórico
export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const orderId = context.params.id;
    const body = await req.json();

    console.log('[API Order History POST] Criando entrada para pedido:', orderId);
    console.log('[API Order History POST] Body:', body);

    const {
      action,
      old_value,
      new_value,
      user_id,
      user_name,
      user_role,
      details
    } = body;

    // Validações básicas
    if (!action || !new_value || !user_name || !user_role) {
      console.error('[API Order History POST] Campos obrigatórios faltando');
      return NextResponse.json(
        { error: 'Campos obrigatórios: action, new_value, user_name, user_role' },
        { status: 400 }
      );
    }

    const insertData = {
      order_id: orderId,
      action,
      old_value,
      new_value,
      user_id,
      user_name,
      user_role,
      details
    };

    console.log('[API Order History POST] Inserindo dados:', insertData);

    const { data, error } = await supabaseAdmin
      .from('order_history')
      .insert(insertData)
      .select()
      .single();

    console.log('[API Order History POST] Supabase response:', { data, error });

    if (error) {
      console.error('[API Order History POST] Erro do Supabase:', error);
      return NextResponse.json(
        { 
          error: 'Erro ao registrar histórico',
          details: error.message,
          hint: error.hint
        },
        { status: 500 }
      );
    }

    console.log('[API Order History POST] Entrada criada com sucesso:', data?.id);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('[API Order History POST] Erro inesperado:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

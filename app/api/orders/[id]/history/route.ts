import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET - Buscar histórico de um pedido
export async function GET(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const orderId = context.params.id;

    const { data, error } = await supabaseAdmin
      .from('order_history')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API Order History] Erro ao buscar:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar histórico do pedido' },
        { status: 500 }
      );
    }

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
      return NextResponse.json(
        { error: 'Campos obrigatórios: action, new_value, user_name, user_role' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('order_history')
      .insert({
        order_id: orderId,
        action,
        old_value,
        new_value,
        user_id,
        user_name,
        user_role,
        details
      })
      .select()
      .single();

    if (error) {
      console.error('[API Order History] Erro ao criar:', error);
      return NextResponse.json(
        { error: 'Erro ao registrar histórico' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('[API Order History POST] Erro inesperado:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

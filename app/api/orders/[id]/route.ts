import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

type OrderItem = {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type Order = {
  id: string;
  order_number?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  banca_id: string;
  banca_name?: string;
  banca_address?: string;
  banca_whatsapp?: string;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: string;
  payment_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  estimated_delivery?: string;
  discount?: number;
  coupon_code?: string;
  coupon_discount?: number;
  tax?: number;
  addons_total?: number;
};

// Mock data removido - agora busca do Supabase
const ORDERS_MOCK: Order[] = [
  {
    id: "ORD-001",
    customer_name: "João Silva",
    customer_phone: "(11) 99999-1234",
    customer_email: "joao@email.com",
    customer_address: "Rua das Flores, 123 - Centro",
    banca_id: "banca1",
    banca_name: "Banca do João",
    items: [
      {
        id: "item1",
        product_id: "prod1",
        product_name: "Revista Veja",
        product_image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
        quantity: 2,
        unit_price: 12.50,
        total_price: 25.00
      },
      {
        id: "item2",
        product_id: "prod2",
        product_name: "Jornal Folha",
        quantity: 1,
        unit_price: 3.50,
        total_price: 3.50
      }
    ],
    subtotal: 28.50,
    shipping_fee: 5.00,
    total: 33.50,
    status: "novo",
    payment_method: "pix",
    notes: "Entregar após 14h",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    estimated_delivery: "2024-01-15T16:00:00Z"
  },
  {
    id: "ORD-002",
    customer_name: "Maria Santos",
    customer_phone: "(11) 88888-5678",
    customer_email: "maria@email.com",
    customer_address: "Av. Paulista, 456 - Bela Vista",
    banca_id: "banca1",
    banca_name: "Banca do João",
    items: [
      {
        id: "item3",
        product_id: "prod3",
        product_name: "Revista Época",
        product_image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
        quantity: 1,
        unit_price: 15.90,
        total_price: 15.90
      }
    ],
    subtotal: 15.90,
    shipping_fee: 8.00,
    total: 23.90,
    status: "confirmado",
    payment_method: "cartao",
    created_at: "2024-01-15T09:15:00Z",
    updated_at: "2024-01-15T09:45:00Z",
    estimated_delivery: "2024-01-15T15:30:00Z"
  },
  {
    id: "ORD-003",
    customer_name: "Pedro Costa",
    customer_phone: "(11) 77777-9012",
    customer_address: "Rua Augusta, 789 - Consolação",
    banca_id: "banca1",
    banca_name: "Banca do João",
    items: [
      {
        id: "item4",
        product_id: "prod4",
        product_name: "Jornal Estado",
        quantity: 1,
        unit_price: 4.00,
        total_price: 4.00
      },
      {
        id: "item5",
        product_id: "prod5",
        product_name: "Revista IstoÉ",
        product_image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
        quantity: 1,
        unit_price: 13.90,
        total_price: 13.90
      }
    ],
    subtotal: 17.90,
    shipping_fee: 6.00,
    total: 23.90,
    status: "em_preparo",
    payment_method: "dinheiro",
    notes: "Troco para R$ 50,00",
    created_at: "2024-01-14T16:20:00Z",
    updated_at: "2024-01-15T08:30:00Z",
    estimated_delivery: "2024-01-15T14:00:00Z"
  }
];

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    console.log('[API/ORDERS/[ID]/GET] Buscando pedido:', id);
    
    // Buscar pedido do Supabase com JOIN da banca
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        bancas:banca_id (
          id,
          name,
          address,
          whatsapp
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('[API/ORDERS/[ID]/GET] Erro Supabase:', error);
      return NextResponse.json(
        { ok: false, error: "Pedido não encontrado" }, 
        { status: 404 }
      );
    }
    
    if (!order) {
      return NextResponse.json(
        { ok: false, error: "Pedido não encontrado" }, 
        { status: 404 }
      );
    }
    
    // Formatar resposta
    const formattedOrder: Order = {
      id: order.id,
      order_number: order.order_number,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_email: order.customer_email,
      customer_address: order.customer_address,
      banca_id: order.banca_id,
      banca_name: order.bancas?.name || '',
      banca_address: order.bancas?.address || '',
      banca_whatsapp: order.bancas?.whatsapp || '',
      items: order.items || [],
      subtotal: Number(order.subtotal),
      shipping_fee: Number(order.shipping_fee),
      total: Number(order.total),
      status: order.status,
      payment_method: order.payment_method,
      notes: order.notes,
      created_at: order.created_at,
      updated_at: order.updated_at,
      estimated_delivery: order.estimated_delivery,
      discount: order.discount ? Number(order.discount) : 0,
      coupon_code: order.coupon_code || null,
      coupon_discount: order.coupon_discount ? Number(order.coupon_discount) : 0,
      tax: order.tax ? Number(order.tax) : 0,
      addons_total: order.addons_total ? Number(order.addons_total) : 0
    };
    
    console.log('[API/ORDERS/[ID]/GET] Pedido encontrado:', formattedOrder.order_number);
    
    return NextResponse.json({ ok: true, data: formattedOrder });
  } catch (e: any) {
    console.error('[API/ORDERS/[ID]/GET] Erro:', e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Erro ao buscar pedido" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    console.log('[API/ORDERS/[ID]/DELETE] Excluindo pedido:', id);
    
    // Verificar se o pedido existe
    const { data: existingOrder, error: checkError } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('id', id)
      .single();
    
    if (checkError || !existingOrder) {
      console.error('[API/ORDERS/[ID]/DELETE] Pedido não encontrado');
      return NextResponse.json(
        { ok: false, error: "Pedido não encontrado" }, 
        { status: 404 }
      );
    }
    
    // Excluir histórico do pedido primeiro (se existir)
    await supabaseAdmin
      .from('order_history')
      .delete()
      .eq('order_id', id);
    
    // Excluir o pedido
    const { error: deleteError } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error('[API/ORDERS/[ID]/DELETE] Erro ao excluir:', deleteError);
      return NextResponse.json(
        { ok: false, error: "Erro ao excluir pedido" }, 
        { status: 500 }
      );
    }
    
    console.log('[API/ORDERS/[ID]/DELETE] Pedido excluído com sucesso');
    
    return NextResponse.json({ 
      ok: true, 
      message: "Pedido excluído com sucesso" 
    });
  } catch (e: any) {
    console.error('[API/ORDERS/[ID]/DELETE] Erro:', e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Erro ao excluir pedido" }, 
      { status: 500 }
    );
  }
}

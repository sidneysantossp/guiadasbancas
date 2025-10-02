import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export type AdminCategory = {
  id: string;
  name: string;
  image: string;
  link: string; // internal route like /categoria/slug
  active: boolean;
  order: number;
};

function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return Boolean(authHeader && authHeader === "Bearer admin-token");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("all") === "true";
    
    let query = supabaseAdmin
      .from('categories')
      .select('*')
      .order('order', { ascending: true });
    
    if (!includeInactive) {
      query = query.eq('active', true);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json({ success: false, error: "Erro ao buscar categorias" }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data: data || [] });
  } catch (e) {
    console.error('Exception fetching categories:', e);
    return NextResponse.json({ success: false, error: "Erro ao buscar categorias" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }
    
    const body = await request.json();
    const inputData = body?.data as Partial<AdminCategory>;
    
    // Get current max order
    const { data: existing } = await supabaseAdmin
      .from('categories')
      .select('order')
      .order('order', { ascending: false })
      .limit(1);
    
    const maxOrder = existing && existing.length > 0 ? existing[0].order : 0;
    
    const newItem = {
      name: (inputData.name || "").toString(),
      image: (inputData.image || "").toString(),
      link: (inputData.link || "").toString().trim(),
      active: Boolean(inputData.active ?? true),
      order: maxOrder + 1,
    };
    
    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert([newItem])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating category:', error);
      return NextResponse.json({ success: false, error: "Erro ao criar categoria" }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error('Exception creating category:', e);
    return NextResponse.json({ success: false, error: "Erro ao criar categoria" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }
    
    const body = await request.json();
    const { type, data: inputData } = body || {};

    if (type === "bulk") {
      // Bulk update for reordering
      const list = (Array.isArray(inputData) ? inputData : []) as AdminCategory[];
      
      // Update each category
      const updates = list.map(cat => 
        supabaseAdmin
          .from('categories')
          .update({ 
            name: cat.name,
            image: cat.image,
            link: cat.link,
            active: cat.active,
            order: cat.order,
            updated_at: new Date().toISOString()
          })
          .eq('id', cat.id)
      );
      
      await Promise.all(updates);
      return NextResponse.json({ success: true, data: list });
    }

    // Single update
    const categoryId = inputData?.id;
    if (!categoryId) {
      return NextResponse.json({ success: false, error: "ID é obrigatório" }, { status: 400 });
    }
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    if (inputData.name !== undefined) updateData.name = inputData.name;
    if (inputData.image !== undefined) updateData.image = inputData.image;
    if (inputData.link !== undefined) updateData.link = inputData.link;
    if (inputData.active !== undefined) updateData.active = inputData.active;
    if (inputData.order !== undefined) updateData.order = inputData.order;
    
    const { data, error } = await supabaseAdmin
      .from('categories')
      .update(updateData)
      .eq('id', categoryId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating category:', error);
      return NextResponse.json({ success: false, error: "Erro ao atualizar categoria" }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error('Exception updating category:', e);
    return NextResponse.json({ success: false, error: "Erro ao atualizar categoria" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ success: false, error: "ID é obrigatório" }, { status: 400 });
    }
    
    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting category:', error);
      return NextResponse.json({ success: false, error: "Erro ao excluir categoria" }, { status: 500 });
    }
    
    // Get remaining categories to return
    const { data: remaining } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('order', { ascending: true });
    
    return NextResponse.json({ success: true, data: remaining || [] });
  } catch (e) {
    console.error('Exception deleting category:', e);
    return NextResponse.json({ success: false, error: "Erro ao excluir categoria" }, { status: 500 });
  }
}

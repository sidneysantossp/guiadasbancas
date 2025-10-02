import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export type PublicCategory = {
  id: string;
  name: string;
  image: string;
  link: string;
  order: number;
};

export async function GET(_request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, image, link, order')
      .eq('active', true)
      .order('order', { ascending: true });

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

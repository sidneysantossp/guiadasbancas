import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    console.log('Testing direct bancas query...');
    
    // Query direta sem transformações
    const { data: bancas, error: bancasError } = await supabaseAdmin
      .from('bancas')
      .select('*')
      .order('name');

    console.log('Bancas query result:', { bancas, bancasError });

    // Query de contagem
    const { count, error: countError } = await supabaseAdmin
      .from('bancas')
      .select('*', { count: 'exact', head: true });

    console.log('Bancas count result:', { count, countError });

    // Query de produtos
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('*')
      .limit(5);

    console.log('Products query result:', { products, productsError });

    return NextResponse.json({
      success: true,
      bancas: {
        data: bancas,
        error: bancasError,
        count: count
      },
      products: {
        data: products,
        error: productsError
      },
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
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

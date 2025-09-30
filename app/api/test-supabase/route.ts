import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

// Run this route on the Edge runtime to use the Web Fetch API (often bypasses local Node/undici issues)
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🔍 Testando conexão com Supabase...');
    
    // Teste 1: Branding (que já funciona)
    const { data: brandingData, error: brandingError } = await supabaseAdmin
      .from('branding')
      .select('*')
      .limit(1);

    // Teste 2: Categorias com cliente admin
    const { data: categoriesAdmin, error: categoriesAdminError } = await supabaseAdmin
      .from('categories')
      .select('*')
      .limit(5);

    // Teste 3: Categorias com cliente público
    const { data: categoriesPublic, error: categoriesPublicError } = await supabase
      .from('categories')
      .select('*')
      .limit(5);

    // Teste 4: Bancas
    const { data: bancasData, error: bancasError } = await supabase
      .from('bancas')
      .select('*')
      .limit(5);

    // Teste 5: Produtos
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);

    return NextResponse.json({
      success: true,
      message: 'Teste de conexão Supabase',
      tests: {
        branding: {
          success: !brandingError,
          error: brandingError?.message,
          count: brandingData?.length || 0,
          data: brandingData
        },
        categories_admin: {
          success: !categoriesAdminError,
          error: categoriesAdminError?.message,
          count: categoriesAdmin?.length || 0,
          data: categoriesAdmin
        },
        categories_public: {
          success: !categoriesPublicError,
          error: categoriesPublicError?.message,
          count: categoriesPublic?.length || 0,
          data: categoriesPublic
        },
        bancas: {
          success: !bancasError,
          error: bancasError?.message,
          count: bancasData?.length || 0,
          data: bancasData
        },
        products: {
          success: !productsError,
          error: productsError?.message,
          count: productsData?.length || 0,
          data: productsData
        }
      }
    });

  } catch (error) {
    console.error('❌ Erro geral:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      details: error 
    }, { status: 500 });
  }
}

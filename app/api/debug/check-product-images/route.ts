import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/debug/check-product-images?codigo=1054835
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const codigo = searchParams.get('codigo');
    
    if (!codigo) {
      return NextResponse.json({ error: 'Parâmetro "codigo" é obrigatório' }, { status: 400 });
    }

    // Buscar produto pelo codigo_mercos
    const { data: produto, error } = await supabaseAdmin
      .from('products')
      .select('id, name, codigo_mercos, images, distribuidor_id, updated_at')
      .ilike('codigo_mercos', codigo)
      .limit(5);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Verificar buckets disponíveis no storage
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets();

    // Verificar arquivos no bucket "images" (pasta distribuidores)
    let storageFiles: any[] = [];
    let storageError = null;
    try {
      const { data: files, error: filesErr } = await supabaseAdmin.storage
        .from('images')
        .list('distribuidores', { limit: 20 });
      storageFiles = files || [];
      storageError = filesErr?.message;
    } catch (e: any) {
      storageError = e.message;
    }

    return NextResponse.json({
      success: true,
      codigo_buscado: codigo,
      produtos_encontrados: produto?.length || 0,
      produtos: produto?.map(p => ({
        id: p.id,
        name: p.name,
        codigo_mercos: p.codigo_mercos,
        distribuidor_id: p.distribuidor_id,
        updated_at: p.updated_at,
        images: p.images,
        images_count: Array.isArray(p.images) ? p.images.length : 0,
        first_image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
      })),
      storage: {
        buckets: buckets?.map(b => ({ name: b.name, public: b.public })) || [],
        buckets_error: bucketsError?.message,
        distribuidores_files: storageFiles.slice(0, 10),
        storage_error: storageError,
      }
    });

  } catch (error: any) {
    console.error('Erro no debug:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

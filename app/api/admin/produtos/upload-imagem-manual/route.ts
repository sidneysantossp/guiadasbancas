import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdminAuth } from '@/lib/security/admin-auth';
import { uploadImage } from '@/lib/image-storage';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']);

/**
 * POST /api/admin/produtos/upload-imagem-manual
 * Upload manual de imagem para um produto específico (por ID)
 * 
 */
export async function POST(req: NextRequest) {
  try {
    const authError = await requireAdminAuth(req);
    if (authError) return authError;

    const supabase = supabaseAdmin;

    const formData = await req.formData();
    const file = formData.get('image') as File;
    const produtoId = formData.get('produto_id') as string;

    if (!file || !produtoId) {
      return NextResponse.json(
        { error: 'Imagem e produto_id são obrigatórios' },
        { status: 400 }
      );
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de imagem não suportado. Envie JPG, PNG, WebP ou GIF.' },
        { status: 415 }
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: 'Imagem muito grande. O máximo permitido é 4 MB.' },
        { status: 413 }
      );
    }

    // Buscar produto
    const { data: produto, error: produtoError } = await supabaseAdmin
      .from('products')
      .select('id, name, images, mercos_id, codigo_mercos')
      .eq('id', produtoId)
      .single();

    if (produtoError || !produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Fazer upload da imagem para o storage configurado
    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || 'jpg';
    const productCode = produto.codigo_mercos || produto.mercos_id || produto.id;
    const safeProductCode = String(productCode).replace(/[^A-Za-z0-9_-]/g, '');
    const fileName = `produto_${safeProductCode}_${timestamp}.${ext}`;
    const filePath = `products/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let uploadResult;
    try {
      uploadResult = await uploadImage({
        path: filePath,
        body: buffer,
        contentType: file.type,
        upsert: false,
      });
    } catch (uploadError) {
      console.error('[UPLOAD-MANUAL] Erro ao fazer upload:', uploadError);
      return NextResponse.json(
        { error: `Erro ao fazer upload: ${uploadError instanceof Error ? uploadError.message : String(uploadError)}` },
        { status: 500 }
      );
    }

    const imageUrl = uploadResult.url;

    // Adicionar URL ao array de imagens do produto
    const currentImages = Array.isArray(produto.images) ? produto.images : [];
    const updatedImages = [...currentImages, imageUrl];

    const { error: updateError } = await supabaseAdmin
      .from('products')
      .update({ images: updatedImages, updated_at: new Date().toISOString() })
      .eq('id', produtoId);

    if (updateError) {
      console.error('[UPLOAD-MANUAL] Erro ao atualizar produto:', updateError);
      return NextResponse.json(
        { error: `Erro ao atualizar produto: ${updateError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Imagem adicionada com sucesso',
      imageUrl,
      images: updatedImages,
    });
  } catch (error: any) {
    console.error('[UPLOAD-MANUAL] Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * POST /api/admin/produtos/upload-imagem-manual
 * Upload manual de imagem para um produto específico (por ID)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const isAdmin = !!(session?.user && (session.user as any).role === 'admin');

    if (!isAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('image') as File;
    const produtoId = formData.get('produto_id') as string;

    if (!file || !produtoId) {
      return NextResponse.json(
        { error: 'Imagem e produto_id são obrigatórios' },
        { status: 400 }
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

    // Fazer upload da imagem para o Supabase Storage
    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `produto_${produto.mercos_id}_${timestamp}.${ext}`;
    const filePath = `products/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('products')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('[UPLOAD-MANUAL] Erro ao fazer upload:', uploadError);
      return NextResponse.json(
        { error: `Erro ao fazer upload: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Obter URL pública
    const { data: urlData } = supabaseAdmin.storage
      .from('products')
      .getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    // Adicionar URL ao array de imagens do produto
    const currentImages = Array.isArray(produto.images) ? produto.images : [];
    const updatedImages = [...currentImages, imageUrl];

    const { error: updateError } = await supabaseAdmin
      .from('products')
      .update({ images: updatedImages })
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

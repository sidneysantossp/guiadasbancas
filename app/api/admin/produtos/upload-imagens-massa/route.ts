import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@/lib/auth';

// POST /api/admin/produtos/upload-imagens-massa
// Upload em massa de imagens com vinculação automática por código Mercos
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    // Verificar autenticação e role admin
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll('images') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Nenhuma imagem enviada' }, { status: 400 });
    }

    const results = {
      success: [] as any[],
      errors: [] as any[],
      total: files.length
    };

    for (const file of files) {
      try {
        // Extrair código Mercos do nome do arquivo
        // Exemplo: AKOTO001.jpg -> AKOTO001
        const fileName = file.name;
        const codigoMercos = fileName.split('.')[0].toUpperCase();

        // Buscar produto com este código
        const { data: produto, error: produtoError } = await supabaseAdmin
          .from('products')
          .select('id, name, images, codigo_mercos')
          .eq('codigo_mercos', codigoMercos)
          .single();

        if (produtoError || !produto) {
          results.errors.push({
            file: fileName,
            codigo: codigoMercos,
            error: 'Produto não encontrado'
          });
          continue;
        }

        // Upload da imagem para Supabase Storage
        const fileExt = fileName.split('.').pop();
        const filePath = `products/${codigoMercos}_${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('product-images')
          .upload(filePath, file, {
            contentType: file.type,
            upsert: false
          });

        if (uploadError) {
          results.errors.push({
            file: fileName,
            codigo: codigoMercos,
            error: `Erro no upload: ${uploadError.message}`
          });
          continue;
        }

        // Gerar URL pública da imagem
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('product-images')
          .getPublicUrl(filePath);

        // Atualizar produto com a imagem
        const currentImages = Array.isArray(produto.images) ? produto.images : [];
        const updatedImages = [publicUrl, ...currentImages];

        const { error: updateError } = await supabaseAdmin
          .from('products')
          .update({ 
            images: updatedImages,
            updated_at: new Date().toISOString()
          })
          .eq('id', produto.id);

        if (updateError) {
          results.errors.push({
            file: fileName,
            codigo: codigoMercos,
            error: `Erro ao atualizar produto: ${updateError.message}`
          });
          continue;
        }

        results.success.push({
          file: fileName,
          codigo: codigoMercos,
          produtoId: produto.id,
          produtoNome: produto.name,
          imageUrl: publicUrl
        });

      } catch (error: any) {
        results.errors.push({
          file: file.name,
          error: error.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processadas ${results.total} imagens. ${results.success.length} sucesso, ${results.errors.length} erros.`,
      data: results
    });

  } catch (error: any) {
    console.error('Erro no upload em massa:', error);
    return NextResponse.json(
      { error: 'Erro ao processar upload', details: error.message },
      { status: 500 }
    );
  }
}

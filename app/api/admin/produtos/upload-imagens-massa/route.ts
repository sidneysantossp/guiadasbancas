import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
export const maxDuration = 300;

// POST /api/admin/produtos/upload-imagens-massa
// Upload em massa de imagens com vinculação automática por código Mercos
export async function POST(req: NextRequest) {
  try {
    // Suporta dois modos de auth: NextAuth (session) ou header Bearer 'admin-token'
    const bearer = req.headers.get('authorization');
    const hasAdminToken = !!bearer && bearer.trim() === 'Bearer admin-token';
    let isAdmin = hasAdminToken;

    if (!isAdmin) {
      const session = await auth();
      isAdmin = !!(session?.user && (session.user as any).role === 'admin');
    }

    if (!isAdmin) {
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
        // Extrair identificadores do nome do arquivo (sem extensão)
        // Exemplos aceitos:
        //   AKOTO001.jpg -> codigo_mercos=AKOTO001
        //   AKOTO001_01.png -> codigo_mercos=AKOTO001
        //   123456.jpg -> mercos_id=123456
        //   123456_extra.jpeg -> mercos_id=123456
        const fileName = file.name;
        const baseName = fileName.replace(/\.[^.]+$/, '');
        const primaryToken = baseName.split(/[\s._-]/)[0];
        const codigoMercos = (primaryToken || baseName).toUpperCase();
        const numericIdMatch = baseName.match(/\b(\d{3,})\b/);
        const possibleMercosId = numericIdMatch ? parseInt(numericIdMatch[1], 10) : null;

        // Buscar produto por codigo_mercos
        let { data: produto, error: produtoError } = await supabaseAdmin
          .from('products')
          .select('id, name, images, codigo_mercos, mercos_id')
          .eq('codigo_mercos', codigoMercos)
          .maybeSingle();

        // Fallback: tentar por mercos_id quando houver número no nome do arquivo
        if ((!produto || produtoError) && possibleMercosId) {
          const byId = await supabaseAdmin
            .from('products')
            .select('id, name, images, codigo_mercos, mercos_id')
            .eq('mercos_id', possibleMercosId)
            .maybeSingle();
          produto = byId.data as any;
          produtoError = byId.error as any;
        }

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
        const filePath = `bancas/${codigoMercos}_${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('images')
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
          .from('images')
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

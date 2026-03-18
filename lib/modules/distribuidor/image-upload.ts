import { supabaseAdmin } from "@/lib/supabase";

export const DISTRIBUIDOR_UPLOAD_MAX_FILE_SIZE = 4 * 1024 * 1024;

type UploadMatchProduct = {
  id: string;
  name: string;
  images?: unknown;
  codigo_mercos?: string | null;
  mercos_id?: number | null;
  distribuidor_id?: string | null;
  active?: boolean | null;
  updated_at?: string | null;
};

type UploadResult = {
  success: Array<{
    file: string;
    codigo: string;
    produtoId: string;
    produtoNome: string;
    imageUrl: string;
  }>;
  errors: Array<{
    file: string;
    codigo?: string;
    error: string;
    sugestao?: string;
    oversizedFiles?: Array<{ name: string; size: number }>;
  }>;
  total: number;
};

function extractImageIdentifiers(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const primaryToken = baseName.split(/[\s._-]/)[0];
  const codigoMercos = (primaryToken || baseName).toUpperCase();
  const numericIdMatch = baseName.match(/\b(\d{3,})\b/);
  const possibleMercosId = numericIdMatch ? parseInt(numericIdMatch[1], 10) : null;
  const directNumericId = /^\d+$/.test(codigoMercos) ? parseInt(codigoMercos, 10) : null;

  return {
    codigoMercos,
    possibleMercosId: possibleMercosId || directNumericId,
  };
}

async function lookupDistribuidorProduct(params: {
  distribuidorId: string;
  codigoMercos: string;
  possibleMercosId: number | null;
}) {
  const initialLookup = await supabaseAdmin
    .from("products")
    .select("id, name, images, codigo_mercos, mercos_id, active, updated_at, distribuidor_id")
    .eq("distribuidor_id", params.distribuidorId)
    .eq("codigo_mercos", params.codigoMercos)
    .order("active", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let produto: UploadMatchProduct | null = (initialLookup.data as UploadMatchProduct | null) || null;
  let produtoError: any = initialLookup.error;

  if ((!produto || produtoError) && params.possibleMercosId) {
    const byMercosId = await supabaseAdmin
      .from("products")
      .select("id, name, images, codigo_mercos, mercos_id, distribuidor_id")
      .eq("distribuidor_id", params.distribuidorId)
      .eq("mercos_id", params.possibleMercosId)
      .maybeSingle();

    produto = byMercosId.data as UploadMatchProduct | null;
    produtoError = byMercosId.error;
  }

  if ((!produto || produtoError) && params.possibleMercosId) {
    const byMercosIdGlobal = await supabaseAdmin
      .from("products")
      .select("id, name, images, codigo_mercos, mercos_id, distribuidor_id")
      .eq("mercos_id", params.possibleMercosId)
      .maybeSingle();

    if (byMercosIdGlobal.data) {
      produto = byMercosIdGlobal.data as UploadMatchProduct;
      produtoError = null;

      if (!byMercosIdGlobal.data.distribuidor_id) {
        await supabaseAdmin
          .from("products")
          .update({ distribuidor_id: params.distribuidorId })
          .eq("id", byMercosIdGlobal.data.id);
      }
    }
  }

  if (!produto || produtoError) {
    const byIlike = await supabaseAdmin
      .from("products")
      .select("id, name, images, codigo_mercos, mercos_id, distribuidor_id")
      .eq("distribuidor_id", params.distribuidorId)
      .ilike("codigo_mercos", params.codigoMercos)
      .order("active", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (byIlike.data) {
      produto = byIlike.data as UploadMatchProduct;
      produtoError = null;
    }
  }

  if (!produto || produtoError) {
    const globalSearch = await supabaseAdmin
      .from("products")
      .select("id, name, images, codigo_mercos, mercos_id, distribuidor_id")
      .eq("codigo_mercos", params.codigoMercos)
      .order("active", { ascending: false })
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (globalSearch.data) {
      produto = globalSearch.data as UploadMatchProduct;
      produtoError = null;

      if (!globalSearch.data.distribuidor_id) {
        await supabaseAdmin
          .from("products")
          .update({ distribuidor_id: params.distribuidorId })
          .eq("id", globalSearch.data.id);
      }
    }
  }

  return { produto, produtoError };
}

async function lookupSimilarProductCodes(distribuidorId: string, codigoMercos: string) {
  const codeFragment = codigoMercos.substring(0, 4);

  const [{ data: similares }, { data: similaresGlobal }] = await Promise.all([
    supabaseAdmin
      .from("products")
      .select("codigo_mercos, name")
      .eq("distribuidor_id", distribuidorId)
      .ilike("codigo_mercos", `%${codeFragment}%`)
      .limit(3),
    supabaseAdmin
      .from("products")
      .select("codigo_mercos, name")
      .ilike("codigo_mercos", `%${codeFragment}%`)
      .limit(3),
  ]);

  return [
    ...new Map(
      [...(similares || []), ...(similaresGlobal || [])].map((product) => [
        product.codigo_mercos,
        product,
      ])
    ).values(),
  ];
}

export function validateDistribuidorUploadFiles(files: File[]) {
  if (!files || files.length === 0) {
    return { ok: false as const, status: 400, body: { error: "Nenhuma imagem enviada" } };
  }

  const oversizedFiles = files.filter((file) => file.size > DISTRIBUIDOR_UPLOAD_MAX_FILE_SIZE);
  if (oversizedFiles.length > 0) {
    const fileNames = oversizedFiles
      .map((file) => `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`)
      .join(", ");

    return {
      ok: false as const,
      status: 413,
      body: {
        error: `Arquivos muito grandes: ${fileNames}. Máximo permitido: 4 MB por arquivo.`,
        oversizedFiles: oversizedFiles.map((file) => ({ name: file.name, size: file.size })),
      },
    };
  }

  return { ok: true as const };
}

export async function processDistribuidorImageUploads(params: {
  distribuidorId: string;
  files: File[];
}) {
  const results: UploadResult = {
    success: [],
    errors: [],
    total: params.files.length,
  };

  for (const file of params.files) {
    try {
      const { codigoMercos, possibleMercosId } = extractImageIdentifiers(file.name);
      const { produto, produtoError } = await lookupDistribuidorProduct({
        distribuidorId: params.distribuidorId,
        codigoMercos,
        possibleMercosId,
      });

      if (produtoError || !produto) {
        const similares = await lookupSimilarProductCodes(params.distribuidorId, codigoMercos);
        results.errors.push({
          file: file.name,
          codigo: codigoMercos,
          error: "Produto não encontrado",
          sugestao:
            similares.length > 0
              ? `Produtos similares: ${similares
                  .slice(0, 5)
                  .map((product) => product.codigo_mercos)
                  .join(", ")}`
              : "Verifique se o código do arquivo corresponde ao código Mercos do produto",
        });
        continue;
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `distribuidores/${params.distribuidorId}/${codigoMercos}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabaseAdmin.storage.from("images").upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

      if (uploadError) {
        results.errors.push({
          file: file.name,
          codigo: codigoMercos,
          error: `Erro no upload: ${uploadError.message}`,
        });
        continue;
      }

      const {
        data: { publicUrl },
      } = supabaseAdmin.storage.from("images").getPublicUrl(filePath);

      const currentImages = Array.isArray(produto.images) ? produto.images : [];
      const updatedImages = [publicUrl, ...currentImages];

      const { error: updateError } = await supabaseAdmin
        .from("products")
        .update({
          images: updatedImages,
          updated_at: new Date().toISOString(),
        })
        .eq("id", produto.id);

      if (updateError) {
        results.errors.push({
          file: file.name,
          codigo: codigoMercos,
          error: `Erro ao atualizar produto: ${updateError.message}`,
        });
        continue;
      }

      results.success.push({
        file: file.name,
        codigo: codigoMercos,
        produtoId: produto.id,
        produtoNome: produto.name,
        imageUrl: publicUrl,
      });
    } catch (error: any) {
      results.errors.push({
        file: file.name,
        error: error.message,
      });
    }
  }

  return {
    success: true,
    message: `Processadas ${results.total} imagens. ${results.success.length} sucesso, ${results.errors.length} erros.`,
    data: results,
  };
}

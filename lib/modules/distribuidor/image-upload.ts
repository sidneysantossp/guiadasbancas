import { supabaseAdmin } from "@/lib/supabase";

export const DISTRIBUIDOR_UPLOAD_MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]);

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

type SimilarProduct = {
  codigo_mercos: string | null;
  name?: string | null;
};

function normalizeCodigo(value: string | null | undefined) {
  return (value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function splitCodigoParts(value: string) {
  const normalized = normalizeCodigo(value);
  const match = normalized.match(/^([A-Z]+)(\d+)$/);
  return {
    normalized,
    alphaPrefix: match?.[1] || normalized,
    numericSuffix: match?.[2] ? parseInt(match[2], 10) : null,
  };
}

function extractImageIdentifiers(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const primaryToken = baseName.split(/[\s._-]/)[0];
  const codigoMercos = normalizeCodigo(primaryToken || baseName);
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
  const target = splitCodigoParts(codigoMercos);
  const searchPrefix = target.alphaPrefix.substring(0, Math.max(4, Math.min(target.alphaPrefix.length, 6)));

  const [{ data: similares }, { data: similaresGlobal }] = await Promise.all([
    supabaseAdmin
      .from("products")
      .select("codigo_mercos, name")
      .eq("distribuidor_id", distribuidorId)
      .ilike("codigo_mercos", `${searchPrefix}%`)
      .limit(50),
    supabaseAdmin
      .from("products")
      .select("codigo_mercos, name")
      .ilike("codigo_mercos", `${searchPrefix}%`)
      .limit(50),
  ]);

  const deduped = [
    ...new Map(
      [...(similares || []), ...(similaresGlobal || [])].map((product) => [
        product.codigo_mercos,
        product,
      ])
    ).values(),
  ];

  const ranked = deduped
    .filter((product) => Boolean(product.codigo_mercos))
    .map((product) => product as SimilarProduct & { codigo_mercos: string })
    .sort((a, b) => {
      const aParts = splitCodigoParts(a.codigo_mercos);
      const bParts = splitCodigoParts(b.codigo_mercos);
      const aSamePrefix = aParts.alphaPrefix === target.alphaPrefix ? 0 : 1;
      const bSamePrefix = bParts.alphaPrefix === target.alphaPrefix ? 0 : 1;
      if (aSamePrefix !== bSamePrefix) return aSamePrefix - bSamePrefix;

      const aDistance =
        target.numericSuffix !== null && aParts.numericSuffix !== null
          ? Math.abs(aParts.numericSuffix - target.numericSuffix)
          : Number.MAX_SAFE_INTEGER;
      const bDistance =
        target.numericSuffix !== null && bParts.numericSuffix !== null
          ? Math.abs(bParts.numericSuffix - target.numericSuffix)
          : Number.MAX_SAFE_INTEGER;
      if (aDistance !== bDistance) return aDistance - bDistance;

      return a.codigo_mercos.localeCompare(b.codigo_mercos);
    });

  return ranked.slice(0, 5);
}

export function validateDistribuidorUploadFiles(files: File[]) {
  if (!files || files.length === 0) {
    return { ok: false as const, status: 400, body: { error: "Nenhuma imagem enviada" } };
  }

  const invalidFiles = files.filter((file) => !ALLOWED_IMAGE_TYPES.has(file.type));
  if (invalidFiles.length > 0) {
    return {
      ok: false as const,
      status: 415,
      body: {
        error: `Tipo de imagem não suportado: ${invalidFiles
          .map((file) => file.name)
          .join(", ")}. Envie JPG, PNG, WebP ou GIF.`,
      },
    };
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
          error: "Produto não encontrado no catálogo sincronizado",
          sugestao:
            similares.length > 0
              ? `Produtos similares: ${similares
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

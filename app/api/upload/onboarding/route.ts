import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/image-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json({ ok: false, error: "Arquivo inválido" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "Arquivo muito grande. Máximo 5MB." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { ok: false, error: "Tipo de arquivo não suportado. Use JPG, PNG, WebP ou GIF." },
        { status: 400 },
      );
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const extension = file.type.split("/")[1] || "bin";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${extension}`;
    const filePath = `bancas/onboarding/${fileName}`;

    let uploadResult;
    try {
      uploadResult = await uploadImage({
        path: filePath,
        body: buffer,
        contentType: file.type,
        upsert: false,
      });
    } catch (error) {
      console.error("[upload/onboarding] Erro no upload:", error);
      const base64 = Buffer.from(buffer).toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;
      return NextResponse.json({ ok: true, url: dataUrl, fallback: true });
    }

    return NextResponse.json({
      ok: true,
      url: uploadResult.url,
      path: uploadResult.path,
      provider: uploadResult.provider,
    });
  } catch (error) {
    console.error("[upload/onboarding] Erro inesperado:", error);
    return NextResponse.json({ ok: false, error: "Erro ao fazer upload" }, { status: 500 });
  }
}

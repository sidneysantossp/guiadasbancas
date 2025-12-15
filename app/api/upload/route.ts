import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Configuração para Vercel - aumentar limite de tempo e tamanho
export const maxDuration = 60; // 60 segundos

const ALLOWED_TOKENS = new Set([
  "Bearer admin-token",
  "Bearer jornaleiro-token",
]);

function verifyUploadAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return Boolean(authHeader && ALLOWED_TOKENS.has(authHeader));
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    console.log('[upload] Authorization header:', authHeader);
    console.log('[upload] Headers:', Object.fromEntries(request.headers.entries()));
    
    if (!verifyUploadAuth(request)) {
      console.error('[upload] Autenticação falhou - header:', authHeader);
      return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
    }
    
    console.log('[upload] Autenticação OK, processando formData...');
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json({ ok: false, error: "Arquivo inválido" }, { status: 400 });
    }

    // Verificar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "Arquivo muito grande. Máximo 5MB." }, { status: 400 });
    }

    // Verificar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ ok: false, error: "Tipo de arquivo não suportado. Use JPG, PNG, WebP, GIF ou PDF." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const extension = file.type.split('/')[1];
    const fileName = `${timestamp}-${random}.${extension}`;
    const filePath = `bancas/${fileName}`;

    console.log('Fazendo upload para Supabase Storage:', filePath);

    // Upload para Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Erro no upload Supabase:', error);
      // Fallback: retornar base64 se o storage falhar
      const base64 = Buffer.from(buffer).toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;
      return NextResponse.json({ ok: true, url: dataUrl, fallback: true });
    }

    // Obter URL pública
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('images')
      .getPublicUrl(filePath);

    console.log('Upload concluído:', publicUrlData.publicUrl);

    return NextResponse.json({ 
      ok: true, 
      url: publicUrlData.publicUrl,
      path: filePath
    });
  } catch (e) {
    console.error('upload error', e);
    return NextResponse.json({ ok: false, error: 'Erro ao fazer upload' }, { status: 500 });
  }
}

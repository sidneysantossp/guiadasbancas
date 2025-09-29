import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = 'nodejs';

function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return Boolean(authHeader && authHeader === "Bearer admin-token");
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
    }

    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json({ ok: false, error: "Arquivo inválido" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const originalName = (file as any).name || `upload-${Date.now()}`;
    const extFromName = path.extname(originalName) || '';

    let ext = extFromName.toLowerCase();
    if (!ext) {
      // tentar detectar de content-type
      const ct = (file as any).type || '';
      if (ct.includes('image/jpeg')) ext = '.jpg';
      else if (ct.includes('image/png')) ext = '.png';
      else if (ct.includes('image/webp')) ext = '.webp';
      else if (ct.includes('image/gif')) ext = '.gif';
      else ext = '';
    }

    const dir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(dir, { recursive: true });
    const fname = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const full = path.join(dir, fname);
    await fs.writeFile(full, buffer);

    const url = `/uploads/${fname}`;
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    console.error('upload error', e);
    return NextResponse.json({ ok: false, error: 'Erro ao fazer upload' }, { status: 500 });
  }
}

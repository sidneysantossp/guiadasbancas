import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const AUDIT_PATH = path.join(process.cwd(), "data", "audit.log.json");

type AuditEntry = {
  id: string;
  at: string; // ISO
  action: string;
  by?: string; // optional user
  meta?: any;
};

async function readAudit(): Promise<AuditEntry[]> {
  try {
    const raw = await fs.readFile(AUDIT_PATH, "utf-8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
async function writeAudit(items: AuditEntry[]) {
  await fs.mkdir(path.dirname(AUDIT_PATH), { recursive: true });
  await fs.writeFile(AUDIT_PATH, JSON.stringify(items, null, 2), "utf-8");
}

export async function GET() {
  const items = await readAudit();
  return NextResponse.json({ ok: true, data: items.slice(-200) });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const entry: AuditEntry = {
      id: `audit-${Date.now()}`,
      at: new Date().toISOString(),
      action: String(body?.action || "unknown"),
      by: body?.by,
      meta: body?.meta,
    };
    const items = await readAudit();
    items.push(entry);
    await writeAudit(items);
    return NextResponse.json({ ok: true, data: entry });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Erro ao registrar auditoria" }, { status: 500 });
  }
}

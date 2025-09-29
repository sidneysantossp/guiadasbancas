import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'coupons.json');

type Coupon = {
  id: string;
  sellerId: string; // jornaleiro/banca responsável
  title: string; // mini título
  code: string; // código em destaque
  discountText: string; // ex: "10% OFF"
  active: boolean;
  highlight: boolean; // se deve aparecer em destaque no banner
  expiresAt?: string; // ISO
  createdAt: string; // ISO
};

async function readCoupons(): Promise<Coupon[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

async function writeCoupons(list: Coupon[]) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(list, null, 2), 'utf-8');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get('sellerId') || undefined;
  const onlyActive = searchParams.get('active') === 'true';
  const coupons = await readCoupons();
  const filtered = coupons.filter((c) => {
    if (sellerId && c.sellerId !== sellerId) return false;
    if (onlyActive && !c.active) return false;
    if (onlyActive && c.expiresAt) {
      try { if (Date.now() > Date.parse(c.expiresAt)) return false; } catch {}
    }
    return true;
  });
  return NextResponse.json({ ok: true, data: filtered });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sellerId, title, code, discountText, active = true, highlight = false, expiresAt } = body || {};

    if (!sellerId || !title || !code || !discountText) {
      return NextResponse.json({ ok: false, error: 'Campos obrigatórios: sellerId, title, code, discountText' }, { status: 400 });
    }

    const coupons = await readCoupons();

    // Se highlight=true, desmarca outros highlights do mesmo sellerId
    if (highlight) {
      for (const c of coupons) {
        if (c.sellerId === sellerId) c.highlight = false;
      }
    }

    const item: Coupon = {
      id: `c_${Date.now()}`,
      sellerId,
      title: String(title),
      code: String(code).toUpperCase().trim(),
      discountText: String(discountText),
      active: Boolean(active),
      highlight: Boolean(highlight),
      expiresAt: expiresAt ? String(expiresAt) : undefined,
      createdAt: new Date().toISOString(),
    };

    coupons.push(item);
    await writeCoupons(coupons);

    return NextResponse.json({ ok: true, data: item });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Erro ao criar cupom' }, { status: 500 });
  }
}

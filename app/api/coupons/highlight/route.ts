import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'coupons.json');

type Coupon = {
  id: string;
  sellerId: string;
  title: string;
  code: string;
  discountText: string;
  active: boolean;
  highlight: boolean;
  expiresAt?: string;
  createdAt: string;
};

async function readCoupons(): Promise<Coupon[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get('sellerId') || undefined;
  const all = await readCoupons();
  const now = Date.now();
  const filtered = all.filter((c) => {
    if (!c.active) return false;
    if (!c.highlight) return false;
    if (sellerId && c.sellerId !== sellerId) return false;
    if (c.expiresAt) {
      try { if (now > Date.parse(c.expiresAt)) return false; } catch {}
    }
    return true;
  });
  // Retorna o mais recente
  const sorted = filtered.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const item = sorted[0] || null;
  return NextResponse.json({ ok: true, data: item });
}

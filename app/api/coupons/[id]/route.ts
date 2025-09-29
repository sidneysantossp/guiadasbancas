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

async function writeCoupons(list: Coupon[]) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(list, null, 2), 'utf-8');
}

export async function PUT(_: Request, ctx: { params: { id: string } }) {
  try {
    const id = ctx.params.id;
    const body = await _.json();
    const coupons = await readCoupons();
    const idx = coupons.findIndex(c => c.id === id);
    if (idx === -1) return NextResponse.json({ ok: false, error: 'Cupom não encontrado' }, { status: 404 });

    // Se highlight=true, desmarcar outros do mesmo seller
    if (body && body.highlight === true) {
      for (const c of coupons) {
        if (c.sellerId === coupons[idx].sellerId) c.highlight = false;
      }
    }

    coupons[idx] = { ...coupons[idx], ...body };
    await writeCoupons(coupons);
    return NextResponse.json({ ok: true, data: coupons[idx] });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Erro ao atualizar cupom' }, { status: 500 });
  }
}

export async function DELETE(_: Request, ctx: { params: { id: string } }) {
  try {
    const id = ctx.params.id;
    const coupons = await readCoupons();
    const idx = coupons.findIndex(c => c.id === id);
    if (idx === -1) return NextResponse.json({ ok: false, error: 'Cupom não encontrado' }, { status: 404 });
    coupons.splice(idx, 1);
    await writeCoupons(coupons);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Erro ao excluir cupom' }, { status: 500 });
  }
}

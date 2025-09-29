import { NextResponse } from 'next/server';
import { addSubscription, listSubscriptions } from '@/lib/pushStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subscription } = body || {};
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ ok: false, error: 'Invalid subscription' }, { status: 400 });
    }
    // idempotent add
    addSubscription(subscription);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  // For debug only
  return NextResponse.json({ count: listSubscriptions().length });
}

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  console.log('[TEST-AUTH] === TESTE DE AUTENTICAÇÃO ===');
  
  const session = await auth();
  
  console.log('[TEST-AUTH] Session exists:', !!session);
  console.log('[TEST-AUTH] User:', session?.user);
  
  return NextResponse.json({
    authenticated: !!session,
    user: session?.user || null,
    timestamp: new Date().toISOString(),
  });
}

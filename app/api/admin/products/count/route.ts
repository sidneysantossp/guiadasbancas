import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/security/admin-auth';
import { buildNoStoreHeaders } from '@/lib/modules/http/no-store';
import { buildAdminProductCounts } from '@/lib/modules/products/service';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const counts = await buildAdminProductCounts();
    
    return NextResponse.json({
      success: true,
      counts
    }, { headers: buildNoStoreHeaders({ isPrivate: true }) });
    
  } catch (error: any) {
    console.error('[COUNT-PRODUCTS] Erro:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) });
  }
}

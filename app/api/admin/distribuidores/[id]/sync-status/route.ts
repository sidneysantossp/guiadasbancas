import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/security/admin-auth';
import { buildNoStoreHeaders } from '@/lib/modules/http/no-store';
import { getAdminDistribuidorSyncStatus } from '@/lib/modules/distribuidor/admin';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const data = await getAdminDistribuidorSyncStatus(params.id);

    return NextResponse.json({
      success: true,
      ...data,
    }, { headers: buildNoStoreHeaders({ isPrivate: true }) });

  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Erro desconhecido',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

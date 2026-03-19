import { NextRequest, NextResponse } from 'next/server';
import { getAdminDistribuidorStatus } from '@/lib/modules/distribuidor/admin';
import { buildNoStoreHeaders } from '@/lib/modules/http/no-store';
import { requireAdminAuth } from '@/lib/security/admin-auth';

/**
 * API para verificar status de sincronização de um distribuidor
 * GET /api/admin/distribuidores/[id]/status
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const data = await getAdminDistribuidorStatus(params.id);
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Distribuidor não encontrado' },
        { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    }, { headers: buildNoStoreHeaders({ isPrivate: true }) });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

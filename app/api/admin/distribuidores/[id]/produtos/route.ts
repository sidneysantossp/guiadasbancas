import { NextRequest, NextResponse } from 'next/server';
import { getAdminDistribuidorProductsPage } from '@/lib/modules/distribuidor/admin';
import { buildNoStoreHeaders } from '@/lib/modules/http/no-store';
import { requireAdminAuth } from '@/lib/security/admin-auth';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const searchParams = request.nextUrl.searchParams;
    const limit = Number.parseInt(searchParams.get('limit') || '50', 10);
    const offset = Number.parseInt(searchParams.get('offset') || '0', 10);
    const result = await getAdminDistribuidorProductsPage({
      distribuidorId: params.id,
      limit: Number.isFinite(limit) && limit > 0 ? limit : 50,
      offset: Number.isFinite(offset) && offset >= 0 ? offset : 0,
    });

    return NextResponse.json({
      success: true,
      ...result,
    }, { headers: buildNoStoreHeaders({ isPrivate: true }) });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

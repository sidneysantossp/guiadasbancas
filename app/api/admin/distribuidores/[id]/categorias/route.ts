import { NextRequest, NextResponse } from 'next/server';
import { getAdminDistribuidorCategories } from '@/lib/modules/distribuidor/admin';
import { buildNoStoreHeaders } from '@/lib/modules/http/no-store';
import { requireAdminAuth } from '@/lib/security/admin-auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;
    const result = await getAdminDistribuidorCategories(params.id);

    const response = NextResponse.json({
      success: true,
      data: result.data,
      total: result.total,
    });
    Object.entries(buildNoStoreHeaders({ isPrivate: true })).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { buildNoStoreHeaders } from '@/lib/modules/http/no-store';
import {
  deleteAdminDistribuidor,
  getAdminDistribuidorDetail,
  updateAdminDistribuidor,
} from '@/lib/modules/distribuidor/admin';
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

    const data = await getAdminDistribuidorDetail(params.id);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const body = await request.json();
    const data = await updateAdminDistribuidor(params.id, body);

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    await deleteAdminDistribuidor(params.id);

    return NextResponse.json({
      success: true,
      message: 'Distribuidor excluído com sucesso',
    }, { headers: buildNoStoreHeaders({ isPrivate: true }) });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

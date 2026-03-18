import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@/lib/auth';
import { getActiveBancaRowForUser } from "@/lib/jornaleiro-banca";
import { resolveBancaPlanEntitlements } from "@/lib/plan-entitlements";
import {
  buildDistributorProductCustomizationInput,
  saveDistributorProductCustomization,
} from "@/lib/modules/products/service";

// PUT /api/jornaleiro/catalogo-distribuidor/:productId
// Atualiza customizações de um produto (mesma lógica do PATCH)
export async function PUT(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  return PATCH(req, { params });
}

// PATCH /api/jornaleiro/catalogo-distribuidor/:productId
// Atualiza customizações de um produto do catálogo distribuidor
export async function PATCH(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    // Obter sessão do NextAuth
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const supabase = supabaseAdmin;
    const userId = session.user.id;

    // Buscar banca do jornaleiro (pela tabela bancas, não user_profiles)
    const banca = await getActiveBancaRowForUser(userId, 'id, user_id');

    if (!banca) {
      return NextResponse.json(
        { success: false, error: 'Banca não encontrada' },
        { status: 404 }
      );
    }

    const entitlements = await resolveBancaPlanEntitlements(banca);
    if (!entitlements.canAccessDistributorCatalog) {
      return NextResponse.json(
        entitlements.overdueFeaturesLocked && entitlements.subscription?.plan
          ? {
              success: false,
              error: `Seu plano ${entitlements.subscription.plan.name} está com cobrança em aberto e o acesso ao catálogo parceiro foi pausado após a carência.`,
              code: 'PLAN_OVERDUE_SUSPENDED',
              plan: entitlements.plan,
              contracted_plan: entitlements.subscription.plan,
              overdue_grace_ends_at: entitlements.overdueGraceEndsAt,
              upgrade_url: '/jornaleiro/meu-plano',
            }
          : entitlements.paidFeaturesLockedUntilPayment && entitlements.requestedPlan
          ? {
              success: false,
              error: `Seu upgrade para ${entitlements.requestedPlan.name} está aguardando o pagamento da primeira cobrança. Assim que confirmar, o catálogo parceiro será liberado.`,
              code: 'PLAN_PENDING_PAYMENT',
              plan: entitlements.plan,
              requested_plan: entitlements.requestedPlan,
              upgrade_url: '/jornaleiro/meu-plano',
            }
          : {
              success: false,
              error: 'Seu plano atual não permite customizar o catálogo de distribuidores.',
              code: 'PLAN_DISTRIBUTOR_CATALOG_LOCKED',
              plan: entitlements.plan,
              recommended_plan_type: 'premium',
              upgrade_url: '/jornaleiro/meu-plano',
            },
        { status: 403 }
      );
    }

    const bancaId = banca.id;
    const body = await req.json();

    // Validar que o produto existe e é de distribuidor
    const { data: produto } = await supabase
      .from('products')
      .select('id, distribuidor_id')
      .eq('id', params.productId)
      .single();

    if (!produto || !produto.distribuidor_id) {
      return NextResponse.json(
        { success: false, error: 'Produto não encontrado ou não é de distribuidor' },
        { status: 404 }
      );
    }

    const customizationInput = buildDistributorProductCustomizationInput(body);
    await saveDistributorProductCustomization({
      bancaId,
      productId: params.productId,
      input: customizationInput,
    });

    return NextResponse.json({
      success: true,
      message: 'Customização atualizada com sucesso',
    });
  } catch (error: any) {
    console.error('[API] Erro ao atualizar customização:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

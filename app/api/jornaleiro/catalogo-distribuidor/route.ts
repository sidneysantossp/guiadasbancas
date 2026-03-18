import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@/lib/auth';
import { getActiveBancaRowForUser } from "@/lib/jornaleiro-banca";
import { loadDistributorPricingContext } from "@/lib/modules/products/service";
import { resolveBancaPlanEntitlements } from "@/lib/plan-entitlements";
import { getNextPlanType } from "@/lib/plan-messaging";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/jornaleiro/catalogo-distribuidor
// Lista todos os produtos de distribuidores com customizações da banca
export async function GET(req: NextRequest) {
  try {
    console.log('[CATALOGO] Iniciando requisição...');
    
    // Obter sessão do NextAuth
    const session = await auth();
    console.log('[CATALOGO] Sessão:', session ? 'Encontrada' : 'Não encontrada');
    console.log('[CATALOGO] User ID:', session?.user?.id);
    
    if (!session?.user?.id) {
      console.error('[CATALOGO] Usuário não autenticado');
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const supabase = supabaseAdmin;
    const userId = session.user.id;
    console.log('[CATALOGO] Buscando banca para userId:', userId);

    // Buscar banca do jornaleiro com informações de cotista
    const banca = await getActiveBancaRowForUser(userId, 'id, user_id, is_cotista, cotista_id');

    if (!banca) {
      console.log('[CATALOGO] Banca não encontrada para userId:', userId, '- Retornando lista vazia');
      return NextResponse.json(
        { success: true, data: [], message: 'Cadastre sua banca para ver o catálogo de produtos dos distribuidores' },
        { status: 200 }
      );
    }

    const bancaId = banca.id;
    const entitlements = await resolveBancaPlanEntitlements(banca);
    const isCotista = entitlements.isLegacyCotistaLinked;
    const hasCatalogAccess = entitlements.canAccessDistributorCatalog;
    console.log('[CATALOGO] Banca encontrada:', bancaId, '- acesso ao catálogo:', hasCatalogAccess);

    if (!hasCatalogAccess) {
      const overdueLockMessage =
        entitlements.overdueFeaturesLocked && entitlements.subscription?.plan
          ? `Seu plano ${entitlements.subscription.plan.name} está com cobrança em aberto. O acesso à rede parceira foi pausado após o período de carência.`
          : null;
      const pendingUpgradeMessage =
        entitlements.paidFeaturesLockedUntilPayment && entitlements.requestedPlan
          ? `Seu upgrade para ${entitlements.requestedPlan.name} foi iniciado, mas a rede de distribuidores só será liberada após o pagamento da primeira cobrança.`
          : 'O catálogo de distribuidores é liberado para bancas parceiras ou planos com acesso à rede de distribuidores.';

      console.log('[CATALOGO] Sem acesso ao catálogo de distribuidores');
      return NextResponse.json({
        success: true,
        data: [],
        products: [],
        total: 0,
        is_cotista: false,
        has_catalog_access: false,
        plan: entitlements.plan,
        requested_plan: entitlements.requestedPlan,
        subscription: entitlements.subscription,
        entitlements: {
          plan_type: entitlements.planType,
          can_access_distributor_catalog: false,
          can_access_partner_directory: entitlements.canAccessPartnerDirectory,
          paid_features_locked_until_payment: entitlements.paidFeaturesLockedUntilPayment,
          overdue_features_locked: entitlements.overdueFeaturesLocked,
          overdue_in_grace_period: entitlements.overdueInGracePeriod,
          overdue_grace_ends_at: entitlements.overdueGraceEndsAt,
        },
        message: overdueLockMessage || pendingUpgradeMessage,
        recommended_plan_type: entitlements.planType === "premium" ? null : "premium",
        upgrade_url: "/jornaleiro/meu-plano",
        next_plan_type: getNextPlanType(entitlements.planType),
      });
    }

    // 1. Buscar LISTA COMPLETA de distribuidores e calcular contagens reais
    let listaDistribuidores: any[] = [];
    
    // Buscar todos os distribuidores
    const { data: dists } = await supabase.from('distribuidores').select('id, nome').order('nome');
    
    if (dists) {
      // Para contornar o limite de 1000 linhas do Supabase, vamos fazer uma query de count para cada distribuidor
      // Como são poucos distribuidores, isso é performático e garante o número exato
      const countPromises = dists.map(async (dist) => {
        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('distribuidor_id', dist.id)
          .eq('active', true);
          
        return {
          nome: dist.nome,
          count: count || 0
        };
      });
      
      const results = await Promise.all(countPromises);
      
      // Filtrar apenas quem tem produtos e ordenar por nome
      listaDistribuidores = results
        .filter(d => d.count > 0)
        .sort((a, b) => a.nome.localeCompare(b.nome));
        
      console.log(`[CATALOGO] Contagem final por distribuidor:`, listaDistribuidores);
    }

    // 2. Buscar produtos de distribuidores com FILTROS no BANCO
    console.log('[CATALOGO] Buscando produtos com filtros no banco...');
    
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').toLowerCase();
    const distribuidorFilter = searchParams.get('distribuidor') || '';

    // Iniciar query
    let query = supabase
      .from('products')
      .select('id, name, description, price, stock_qty, images, mercos_id, codigo_mercos, distribuidor_id, track_stock, pronta_entrega, sob_encomenda, pre_venda, created_at, category_id, active')
      .not('distribuidor_id', 'is', null)
      .eq('active', true)
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (q) {
      query = query.or(`name.ilike.%${q}%,codigo_mercos.ilike.%${q}%`);
    }

    // Se tiver filtro de distribuidor, precisamos pegar o ID dele pelo nome
    if (distribuidorFilter) {
      // Buscar ID do distribuidor pelo nome (poderia ter passado ID do front, mas o front usa nome no value)
      const { data: distData } = await supabase
        .from('distribuidores')
        .select('id')
        .eq('nome', distribuidorFilter)
        .single();
      
      if (distData) {
        query = query.eq('distribuidor_id', distData.id);
      }
    }

    // Limitar resultados para evitar timeout
    // Se tem busca específica, traz mais. Se é listagem geral, traz menos.
    const limit = q ? 200 : 100;
    query = query.limit(limit);

    const { data: produtos, error: prodError } = await query;

    if (prodError) {
      console.error('[CATALOGO] Erro ao buscar produtos:', prodError.message);
      return NextResponse.json(
        { success: false, error: prodError.message },
        { status: 500 }
      );
    }

    console.log(`[CATALOGO] ${produtos?.length || 0} produtos carregados (limit: ${limit})`);
    
    // O resto do código segue igual (mapeamento de markups, etc) mas usando 'produtos' que já foi carregado
    // Remover o loop while antigo
    
    /* CÓDIGO ANTIGO REMOVIDO: Loop while(hasMore) */

    // Buscar nomes de categorias para mapear manualmente
    const categoryIds = Array.from(new Set((produtos || []).map((p: any) => p.category_id).filter(Boolean)));
    let catMap = new Map<string, string>();

    if (categoryIds.length > 0) {
      const [{ data: catRows }, { data: distribuidorCatRows }] = await Promise.all([
        supabase
          .from('categories')
          .select('id, name')
          .in('id', categoryIds as any),
        supabase
          .from('distribuidor_categories')
          .select('id, nome')
          .in('id', categoryIds as any),
      ]);

      catMap = new Map<string, string>([
        ...((catRows || []).map((c: any) => [c.id, c.name]) as Array<[string, string]>),
        ...((distribuidorCatRows || []).map((c: any) => [c.id, c.nome]) as Array<[string, string]>),
      ]);
    }

    const {
      customMap,
      distribuidorMap,
      calculateDistributorPrice,
    } = await loadDistributorPricingContext<{
      id: string;
      product_id: string;
      enabled: boolean | null;
      custom_price: number | null;
      custom_description: string | null;
      custom_status: string | null;
      custom_pronta_entrega: boolean | null;
      custom_sob_encomenda: boolean | null;
      custom_pre_venda: boolean | null;
      custom_stock_enabled: boolean | null;
      custom_stock_qty: number | null;
      custom_featured: boolean | null;
      modificado_em: string | null;
    }>({
      products: (produtos || []) as any[],
      customFields: 'id, product_id, enabled, custom_price, custom_description, custom_status, custom_pronta_entrega, custom_sob_encomenda, custom_pre_venda, custom_stock_enabled, custom_stock_qty, custom_featured, modificado_em',
      customBancaId: bancaId,
    });

    if (distribuidorMap.size > 0) {
      console.log(
        `[CATALOGO] ${distribuidorMap.size} distribuidores mapeados:`,
        Array.from(distribuidorMap.values()).map((distribuidor) => distribuidor.nome)
      );
    }

    // Combinar produtos com customizações
    const produtosComCustom = produtos?.map((produto: any) => {
      const custom = customMap.get(produto.id);
      
      const precoBase = produto.price || 0;
      const precoComMarkup = calculateDistributorPrice(produto);
      
      // Debug para Almanaque
      if (produto.codigo_mercos === 'AALCA029') {
        console.log('[DEBUG CATALOGO] Almanaque:', {
          produto_id: produto.id,
          produto_price: produto.price,
          preco_com_markup: precoComMarkup,
          custom_price: custom?.custom_price,
          custom_exists: !!custom,
          custom_data: custom
        });
      }

      const distData = distribuidorMap.get(produto.distribuidor_id);
      const distribuidor_nome = distData?.nome || null;
      const category_name = catMap.get(produto.category_id) || null;
      const effectivePrice = custom?.custom_price != null
        ? Number(custom.custom_price)
        : precoComMarkup;

      return {
        ...produto,
        // Nomes extraídos
        distribuidor_nome,
        category_name,
        // Dados de customização da banca
        enabled: custom?.enabled ?? true, // Por padrão todos habilitados
        custom_price: custom?.custom_price ?? null,
        custom_description: custom?.custom_description || null,
        custom_status: custom?.custom_status || 'available',
        custom_pronta_entrega: custom?.custom_pronta_entrega ?? produto.pronta_entrega,
        custom_sob_encomenda: custom?.custom_sob_encomenda ?? produto.sob_encomenda,
        custom_pre_venda: custom?.custom_pre_venda ?? produto.pre_venda,
        custom_stock_enabled: custom?.custom_stock_enabled ?? false,
        custom_stock_qty: custom?.custom_stock_qty ?? null,
        custom_featured: custom?.custom_featured ?? false,
        modificado_em: custom?.modificado_em || null,
        customizacao_id: custom?.id || null,
        // Preço base do produto (sem markup)
        preco_base: precoBase,
        // Preço do distribuidor com markup aplicado (sugerido para o jornaleiro)
        distribuidor_price: precoComMarkup,
        // Preço efetivo: customizado pelo jornaleiro > markup do distribuidor > preço base
        effective_price: effectivePrice,
      };
    }) || [];

    console.log(`[CATALOGO] Cotista - ${produtosComCustom.length} produtos de distribuidores encontrados`);

    return NextResponse.json({
      success: true,
      products: produtosComCustom,
      data: produtosComCustom, // backward compatibility
      distribuidores: listaDistribuidores, // Lista de nomes de todos os distribuidores
      total: produtosComCustom.length,
      is_cotista: isCotista,
      has_catalog_access: true,
      plan: entitlements.plan,
      entitlements: {
        plan_type: entitlements.planType,
        can_access_distributor_catalog: true,
        can_access_partner_directory: entitlements.canAccessPartnerDirectory,
      },
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error: any) {
    console.error('[API] Erro geral:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

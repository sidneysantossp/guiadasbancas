import { ensureBancaHasOnboardingPlan } from "@/lib/banca-subscription";
import { getBrazilianDocumentVariants } from "@/lib/documents";
import { normalizePlatformRole } from "@/lib/modules/auth/session";
import { loadAccessibleBancaForJornaleiro } from "@/lib/modules/jornaleiro/access";
import { loadUserProfileById } from "@/lib/modules/auth/user-profiles";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { resolveBancaPlanEntitlements } from "@/lib/plan-entitlements";
import { supabaseAdmin } from "@/lib/supabase";

const BANCA_LIST_SELECT =
  "id, user_id, name, email, address, cep, profile_image, cover_image, active, approved, created_at, updated_at, is_cotista, cotista_codigo";

const DAYS = [
  { key: "seg", label: "Segunda" },
  { key: "ter", label: "Terça" },
  { key: "qua", label: "Quarta" },
  { key: "qui", label: "Quinta" },
  { key: "sex", label: "Sexta" },
  { key: "sab", label: "Sábado" },
  { key: "dom", label: "Domingo" },
] as const;

function parseHours(data: any): Array<{ key: string; label: string; open: boolean; start: string; end: string }> {
  if (Array.isArray(data?.hours) && data.hours.length > 0) {
    return data.hours;
  }

  if (data?.opening_hours && typeof data.opening_hours === "object") {
    return DAYS.map((day) => {
      const value = data.opening_hours?.[day.key];
      if (typeof value === "string" && value.includes("-")) {
        const [start, end] = value.split("-");
        return { key: day.key, label: day.label, open: true, start: start || "08:00", end: end || "18:00" };
      }

      return { key: day.key, label: day.label, open: false, start: "08:00", end: "18:00" };
    });
  }

  return [];
}

function smartParseAddress(fullAddress: string, cep: string) {
  const result = {
    cep: cep || "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    uf: "",
    complement: "",
  };

  if (!fullAddress) return result;

  try {
    const parts = fullAddress.split(" - ").map((part: string) => part.trim());
    const streetPart = parts[0];

    if (streetPart) {
      const streetComponents = streetPart.split(",").map((value: string) => value.trim());

      if (streetComponents.length >= 3) {
        result.street = streetComponents[0];
        result.complement = streetComponents.slice(1, -1).join(", ");
        result.number = streetComponents[streetComponents.length - 1];
      } else if (streetComponents.length === 2) {
        result.street = streetComponents[0];
        result.number = streetComponents[1];
      } else {
        result.street = streetPart;
      }
    }

    if (parts.length > 1) {
      const secondPart = parts[1];
      if (!/^[A-Z]{2}$/.test(secondPart)) {
        result.neighborhood = secondPart;
      }
    }

    const lastPart = parts[parts.length - 1];
    if (/^[A-Z]{2}$/.test(lastPart)) {
      result.uf = lastPart;

      if (parts.length >= 3) {
        const cityCandidate = parts[parts.length - 2];
        if (cityCandidate !== result.neighborhood && cityCandidate !== streetPart) {
          result.city = cityCandidate;
        }
      }
    }

    return result;
  } catch (error) {
    console.error("[JornaleiroBancas] Erro ao interpretar endereço:", error);
    return result;
  }
}

function buildAccessibleBancasResponse(params: {
  owned: any[];
  cpfLinked: any[];
  memberships: any[];
  memberBancas: any[];
  activeBancaId: string | null;
}) {
  const membershipMap = new Map<string, string>(
    (params.memberships || []).map((membership: any) => [
      String(membership.banca_id),
      (membership.access_level as string) || "collaborator",
    ])
  );

  const itemsMap = new Map<string, any>();

  (params.owned || []).forEach((banca: any) => {
    itemsMap.set(banca.id, { ...banca, my_access_level: "admin", my_relation: "owner" });
  });

  (params.cpfLinked || []).forEach((banca: any) => {
    if (itemsMap.has(banca.id)) return;
    itemsMap.set(banca.id, { ...banca, my_access_level: "admin", my_relation: "cpf_linked" });
  });

  (params.memberBancas || []).forEach((banca: any) => {
    if (itemsMap.has(banca.id)) return;
    itemsMap.set(banca.id, {
      ...banca,
      my_access_level: membershipMap.get(banca.id) || "collaborator",
      my_relation: "member",
    });
  });

  const items = Array.from(itemsMap.values());
  const activeItems = items.filter((banca: any) => banca?.active !== false);

  let resolvedActiveBancaId = params.activeBancaId;

  if (resolvedActiveBancaId && !itemsMap.has(resolvedActiveBancaId)) {
    resolvedActiveBancaId = null;
  }

  if (resolvedActiveBancaId && itemsMap.has(resolvedActiveBancaId)) {
    const activeCandidate = itemsMap.get(resolvedActiveBancaId) as any;
    if (activeCandidate?.active === false) {
      resolvedActiveBancaId = null;
    }
  }

  if (!resolvedActiveBancaId && activeItems.length > 0) {
    resolvedActiveBancaId = activeItems[0].id;
  }

  if (!resolvedActiveBancaId && items.length > 0) {
    resolvedActiveBancaId = items[0].id;
  }

  return {
    items,
    activeBancaId: resolvedActiveBancaId,
  };
}

async function loadRequesterProfile(userId: string) {
  const { data, error } = await loadUserProfileById<{
    role?: string | null;
    banca_id?: string | null;
    jornaleiro_access_level?: string | null;
    full_name?: string | null;
    phone?: string | null;
    cpf?: string | null;
    avatar_url?: string | null;
    updated_at?: string | null;
  }>({
    userId,
    select: "role, banca_id, jornaleiro_access_level, full_name, phone, cpf, avatar_url, updated_at",
  });

  if (error) {
    throw new Error(error.message || "Erro ao carregar perfil do jornaleiro");
  }

  const rawRole = (data as any)?.role as string | null | undefined;
  const role = normalizePlatformRole(rawRole);

  return {
    rawRole,
    role,
    bancaId: ((data as any)?.banca_id as string | null | undefined) || null,
    accessLevel:
      (((data as any)?.jornaleiro_access_level as string | null | undefined) || "admin"),
    fullName: ((data as any)?.full_name as string | null | undefined) || "",
    phone: ((data as any)?.phone as string | null | undefined) || "",
    cpf: ((data as any)?.cpf as string | null | undefined) || null,
    avatarUrl: ((data as any)?.avatar_url as string | null | undefined) || "",
    updatedAt: ((data as any)?.updated_at as string | null | undefined) || null,
  };
}

async function loadActiveBancaContext(userId: string) {
  const requester = await loadRequesterProfile(userId);

  if (requester.role !== "jornaleiro") {
    throw new Error("FORBIDDEN_JORNALEIRO");
  }

  const accessible = await listAccessibleJornaleiroBancas(userId);
  const activeBancaId = accessible.active_banca_id as string | null;

  if (!activeBancaId) {
    return {
      requester,
      banca: null,
      memberAccessLevel: null as string | null,
      isOwner: false,
    };
  }

  const { data: banca, error: bancaError } = await supabaseAdmin
    .from("bancas")
    .select("*")
    .eq("id", activeBancaId)
    .maybeSingle();

  if (bancaError) {
    throw new Error(bancaError.message || "Erro ao carregar banca ativa");
  }

  if (!banca) {
    return {
      requester,
      banca: null,
      memberAccessLevel: null as string | null,
      isOwner: false,
    };
  }

  const isOwner = banca.user_id === userId;
  let memberAccessLevel: string | null = null;

  if (!isOwner) {
    const { data: membership, error: membershipError } = await supabaseAdmin
      .from("banca_members")
      .select("access_level")
      .eq("banca_id", banca.id)
      .eq("user_id", userId)
      .maybeSingle();

    if (membershipError) {
      throw new Error(membershipError.message || "Erro ao validar vínculo da banca");
    }

    memberAccessLevel = (membership?.access_level as string | null | undefined) || null;

    if (!memberAccessLevel) {
      throw new Error("UNAUTHORIZED_BANCA_ACCESS");
    }
  }

  if (requester.bancaId !== banca.id) {
    const { error: setActiveError } = await supabaseAdmin
      .from("user_profiles")
      .update({ banca_id: banca.id })
      .eq("id", userId);

    if (setActiveError) {
      console.warn("[JornaleiroBancas] Falha ao sincronizar banca ativa:", setActiveError.message);
    }
  }

  return {
    requester,
    banca,
    memberAccessLevel,
    isOwner,
  };
}

async function loadBancaAccessContext(params: {
  userId: string;
  bancaId: string;
}) {
  const requester = await loadRequesterProfile(params.userId);
  const access = await loadAccessibleBancaForJornaleiro({
    userId: params.userId,
    bancaId: params.bancaId,
    select: "*",
  });

  return {
    requester,
    banca: access.banca,
    isOwner: access.isOwner,
    memberAccessLevel: access.memberAccessLevel,
  };
}

async function formatBancaResponse(params: {
  banca: any;
  requester: Awaited<ReturnType<typeof loadRequesterProfile>>;
}) {
  const addressObj =
    params.banca?.address_obj && typeof params.banca.address_obj === "object"
      ? params.banca.address_obj
      : smartParseAddress(params.banca?.address || "", params.banca?.cep || "");

  const entitlements = await resolveBancaPlanEntitlements({
    id: params.banca.id,
    is_cotista: params.banca.is_cotista,
    cotista_id: params.banca.cotista_id,
  });

  return {
    id: params.banca.id,
    user_id: params.banca.user_id,
    email: params.banca.email,
    name: params.banca.name || "",
    description: params.banca.description || "",
    tpu_url: params.banca.tpu_url || "",
    address: params.banca.address || "",
    addressObj,
    lat: params.banca.lat,
    lng: params.banca.lng,
    location: {
      lat: params.banca.lat,
      lng: params.banca.lng,
    },
    cover: params.banca.cover_image || "",
    avatar: params.banca.profile_image || "",
    cover_image: params.banca.cover_image || "",
    profile_image: params.banca.profile_image || "",
    updated_at: params.banca.updated_at,
    images: {
      cover: params.banca.cover_image || "",
      avatar: params.banca.profile_image || "",
    },
    gallery: [],
    categories: params.banca.categories || [],
    contact: {
      whatsapp: params.banca.whatsapp || "",
    },
    socials: {
      instagram: params.banca.instagram || "",
      facebook: params.banca.facebook || "",
      gmb: "",
    },
    payments: params.banca.payment_methods || [],
    hours: parseHours(params.banca),
    featured: false,
    ctaUrl: "",
    active: params.banca.active !== false,
    approved: params.banca.approved === true,
    createdAt: params.banca.created_at,
    delivery_enabled: params.banca.delivery_enabled || false,
    free_shipping_threshold: params.banca.free_shipping_threshold || 120,
    origin_cep: params.banca.origin_cep || "",
    delivery_fee: params.banca.delivery_fee ?? 0,
    min_order_value: params.banca.min_order_value ?? 0,
    delivery_radius: params.banca.delivery_radius ?? 5,
    preparation_time: params.banca.preparation_time ?? 30,
    payment_methods: params.banca.payment_methods || [],
    whatsapp: params.banca.whatsapp || "",
    is_cotista: params.banca.is_cotista || false,
    cotista_id: params.banca.cotista_id || null,
    cotista_codigo: params.banca.cotista_codigo || null,
    cotista_razao_social: params.banca.cotista_razao_social || null,
    cotista_cnpj_cpf: params.banca.cotista_cnpj_cpf || null,
    plan: entitlements.plan,
    requested_plan: entitlements.requestedPlan,
    subscription: entitlements.subscription,
    entitlements: {
      plan_type: entitlements.planType,
      product_limit: entitlements.productLimit,
      max_images_per_product: entitlements.maxImagesPerProduct,
      can_access_distributor_catalog: entitlements.canAccessDistributorCatalog,
      can_access_partner_directory: entitlements.canAccessPartnerDirectory,
      is_legacy_cotista_linked: entitlements.isLegacyCotistaLinked,
      paid_features_locked_until_payment: entitlements.paidFeaturesLockedUntilPayment,
      overdue_features_locked: entitlements.overdueFeaturesLocked,
      overdue_in_grace_period: entitlements.overdueInGracePeriod,
      overdue_grace_ends_at: entitlements.overdueGraceEndsAt,
    },
    profile: {
      full_name: params.requester.fullName || "",
      phone: params.requester.phone || "",
      cpf: params.requester.cpf || "",
      avatar_url: params.requester.avatarUrl || "",
      updated_at: params.requester.updatedAt || null,
      jornaleiro_access_level: params.requester.accessLevel || null,
    },
  };
}

export async function listAccessibleJornaleiroBancas(userId: string) {
  const requester = await loadRequesterProfile(userId);

  if (requester.role !== "jornaleiro") {
    throw new Error("FORBIDDEN_JORNALEIRO");
  }

  const documentVariants = requester.cpf ? getBrazilianDocumentVariants(requester.cpf) : [];

  const [{ data: owned, error: ownedError }, { data: memberships, error: membershipsError }, cpfBancasResult] =
    await Promise.all([
      supabaseAdmin
        .from("bancas")
        .select(BANCA_LIST_SELECT)
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("banca_members")
        .select("banca_id, access_level")
        .eq("user_id", userId),
      documentVariants.length > 0
        ? supabaseAdmin
            .from("bancas")
            .select(BANCA_LIST_SELECT)
            .in("cotista_cnpj_cpf", documentVariants)
            .order("created_at", { ascending: false })
        : Promise.resolve({ data: [] as any[], error: null }),
    ]);

  if (ownedError || membershipsError || cpfBancasResult.error) {
    throw new Error(
      ownedError?.message ||
      membershipsError?.message ||
      cpfBancasResult.error?.message ||
      "Erro ao listar bancas do jornaleiro"
    );
  }

  const memberBancaIds = Array.from(
    new Set((memberships || []).map((membership: any) => membership.banca_id).filter(Boolean))
  );

  const { data: memberBancas, error: memberBancasError } =
    memberBancaIds.length > 0
      ? await supabaseAdmin
          .from("bancas")
          .select(BANCA_LIST_SELECT)
          .in("id", memberBancaIds)
          .order("created_at", { ascending: false })
      : { data: [] as any[], error: null };

  if (memberBancasError) {
    throw new Error(memberBancasError.message || "Erro ao listar bancas vinculadas");
  }

  const response = buildAccessibleBancasResponse({
    owned: owned || [],
    cpfLinked: cpfBancasResult.data || [],
    memberships: memberships || [],
    memberBancas: memberBancas || [],
    activeBancaId: requester.bancaId,
  });

  if (response.activeBancaId && response.activeBancaId !== requester.bancaId) {
    const { error: updateError } = await supabaseAdmin
      .from("user_profiles")
      .update({ banca_id: response.activeBancaId })
      .eq("id", userId);

    if (updateError) {
      console.warn("[JornaleiroBancas] Falha ao atualizar banca ativa:", updateError.message);
    }
  }

  return {
    success: true,
    items: response.items,
    active_banca_id: response.activeBancaId,
    account_access_level: requester.accessLevel,
    headers: buildNoStoreHeaders(),
  };
}

export async function createJornaleiroBanca(params: {
  userId: string;
  requesterEmail?: string | null;
  input: any;
}) {
  const requester = await loadRequesterProfile(params.userId);

  if (requester.role !== "jornaleiro") {
    throw new Error("FORBIDDEN_JORNALEIRO");
  }

  if (requester.accessLevel === "collaborator") {
    throw new Error("FORBIDDEN_COLLABORATOR_CREATE_BANCA");
  }

  const body = params.input;
  const banca = body?.banca || body;
  const access = body?.access || body?.access_user || null;

  if (!banca?.name || typeof banca.name !== "string" || banca.name.trim().length < 2) {
    throw new Error("INVALID_BANCA_NAME");
  }

  const accessEmail = typeof access?.email === "string" ? access.email.trim().toLowerCase() : "";
  const accessPassword = typeof access?.password === "string" ? access.password : "";
  const accessLevelRaw =
    typeof access?.access_level === "string"
      ? access.access_level
      : typeof access?.level === "string"
      ? access.level
      : "";
  const accessLevel =
    accessLevelRaw === "admin" ? "admin" : accessLevelRaw === "collaborator" ? "collaborator" : "collaborator";

  let createdAccessUser: { id: string; email: string; jornaleiro_access_level: string } | null = null;

  if (accessEmail || accessPassword) {
    if (!accessEmail) throw new Error("INVALID_ACCESS_EMAIL_REQUIRED");
    if (!accessPassword || accessPassword.length < 6) throw new Error("INVALID_ACCESS_PASSWORD");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accessEmail)) throw new Error("INVALID_ACCESS_EMAIL");

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: accessEmail,
      password: accessPassword,
      email_confirm: true,
      user_metadata: {
        role: "jornaleiro",
        jornaleiro_access_level: accessLevel,
        created_by: params.userId,
      },
    });

    if (authError || !authData?.user) {
      throw new Error(authError?.message || "Erro ao criar usuário de acesso");
    }

    createdAccessUser = {
      id: authData.user.id,
      email: authData.user.email || accessEmail,
      jornaleiro_access_level: accessLevel,
    };

    const { error: profileInsertError } = await supabaseAdmin.from("user_profiles").insert({
      id: createdAccessUser.id,
      role: "jornaleiro",
      full_name: access?.full_name || null,
      email_verified: true,
      active: true,
      jornaleiro_access_level: accessLevel,
    } as any);

    if (profileInsertError && profileInsertError.code !== "23505") {
      await supabaseAdmin.auth.admin.deleteUser(createdAccessUser.id);
      throw new Error(profileInsertError.message || "Erro ao criar perfil do usuário de acesso");
    }
  }

  const now = new Date().toISOString();
  const insertData = {
    user_id: params.userId,
    name: banca.name?.trim(),
    description: banca.description || "",
    profile_image: banca.profile_image || banca.logo_url || banca.profileImage || null,
    cover_image: banca.cover_image || banca.cover || banca.coverImage || null,
    phone: banca.phone || null,
    whatsapp: banca.whatsapp || null,
    email: banca.email || params.requesterEmail || null,
    instagram: banca.instagram || null,
    facebook: banca.facebook || null,
    cep: banca.cep || "",
    address: banca.address || "",
    lat: banca.lat ?? banca.location?.lat ?? -23.5505,
    lng: banca.lng ?? banca.location?.lng ?? -46.6333,
    tpu_url: banca.tpu_url || null,
    hours: banca.hours || null,
    opening_hours: banca.opening_hours || banca.hours || null,
    delivery_fee: banca.delivery_fee ?? 0,
    min_order_value: banca.min_order_value ?? 0,
    delivery_radius: banca.delivery_radius ?? 5,
    preparation_time: banca.preparation_time ?? 30,
    payment_methods: banca.payment_methods || ["pix", "dinheiro"],
    is_cotista: banca.is_cotista ?? false,
    cotista_id: banca.cotista_id ?? null,
    cotista_codigo: banca.cotista_codigo ?? null,
    cotista_razao_social: banca.cotista_razao_social ?? null,
    cotista_cnpj_cpf: banca.cotista_cnpj_cpf ?? null,
    active: true,
    approved: true,
    created_at: now,
    updated_at: now,
  };

  const { data: created, error: createError } = await supabaseAdmin
    .from("bancas")
    .insert(insertData)
    .select()
    .single();

  if (createError || !created) {
    if (createdAccessUser?.id) {
      await supabaseAdmin.auth.admin.deleteUser(createdAccessUser.id);
    }
    throw new Error(createError?.message || "Erro ao criar banca");
  }

  const { error: setPrimaryBancaError } = await supabaseAdmin
    .from("user_profiles")
    .update({ banca_id: created.id })
    .eq("id", params.userId);

  if (setPrimaryBancaError) {
    throw new Error(setPrimaryBancaError.message || "Erro ao definir banca ativa");
  }

  if (createdAccessUser?.id) {
    const { error: memberError } = await supabaseAdmin.from("banca_members").insert({
      banca_id: created.id,
      user_id: createdAccessUser.id,
      access_level: createdAccessUser.jornaleiro_access_level,
    } as any);

    if (memberError && memberError.code !== "23505") {
      console.error("[JornaleiroBancas] Erro ao vincular usuário em banca_members:", memberError);
    }

    const { error: setBancaError } = await supabaseAdmin
      .from("user_profiles")
      .update({ banca_id: created.id })
      .eq("id", createdAccessUser.id);

    if (setBancaError) {
      console.error("[JornaleiroBancas] Erro ao definir banca ativa do usuário criado:", setBancaError);
    }
  }

  try {
    await ensureBancaHasOnboardingPlan(created.id);
  } catch (error: any) {
    console.warn("[JornaleiroBancas] Falha ao garantir plano inicial:", error?.message || error);
  }

  return {
    success: true,
    data: created,
    access_user: createdAccessUser,
  };
}

export async function loadActiveJornaleiroBanca(userId: string) {
  const context = await loadActiveBancaContext(userId);

  if (!context.banca) {
    return null;
  }

  return formatBancaResponse({
    banca: context.banca,
    requester: context.requester,
  });
}

export async function createPrimaryJornaleiroBanca(params: {
  userId: string;
  requesterEmail?: string | null;
  input: any;
}) {
  const requester = await loadRequesterProfile(params.userId);

  if (requester.role !== "jornaleiro") {
    throw new Error("FORBIDDEN_JORNALEIRO");
  }

  const body = params.input;
  const banca = body?.banca || body;
  const profile = body?.profile || {};
  const preferredPlanId =
    (body?.preferred_plan_id as string | null | undefined) ||
    (banca?.preferred_plan_id as string | null | undefined) ||
    null;
  const preferredPlanType =
    (body?.preferred_plan_type as string | null | undefined) ||
    (banca?.preferred_plan_type as string | null | undefined) ||
    null;

  let resolvedPlanId = preferredPlanId;
  if (!resolvedPlanId && preferredPlanType) {
    const { data: planByType } = await supabaseAdmin
      .from("plans")
      .select("id, type, price, is_active, sort_order")
      .eq("is_active", true)
      .eq("type", preferredPlanType)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    resolvedPlanId = (planByType as any)?.id || null;
  }

  if (!banca?.name) {
    throw new Error("INVALID_BANCA_NAME");
  }

  const existing = await loadActiveJornaleiroBanca(params.userId);
  if (existing) {
    try {
      await ensureBancaHasOnboardingPlan(existing.id, {
        preferredPlanId: resolvedPlanId || undefined,
      });
    } catch (error: any) {
      console.warn("[JornaleiroBancas] Falha ao garantir plano inicial da banca existente:", error?.message || error);
    }

    return {
      success: true,
      data: existing,
      alreadyExists: true,
    };
  }

  const now = new Date().toISOString();
  const insertData = {
    user_id: params.userId,
    name: banca.name || "",
    description: banca.description || "",
    profile_image: banca.profile_image || banca.profileImage || null,
    cover_image: banca.cover_image || banca.coverImage || null,
    phone: banca.phone || null,
    whatsapp: banca.whatsapp || null,
    email: banca.email || params.requesterEmail || null,
    instagram: banca.instagram || null,
    facebook: banca.facebook || null,
    cep: banca.cep || "",
    address: banca.address || "",
    lat: banca.lat ?? banca.location?.lat ?? null,
    lng: banca.lng ?? banca.location?.lng ?? null,
    tpu_url: banca.tpu_url || null,
    hours: banca.hours || null,
    opening_hours: banca.opening_hours || banca.hours || null,
    delivery_fee: banca.delivery_fee ?? 0,
    min_order_value: banca.min_order_value ?? 0,
    delivery_radius: banca.delivery_radius ?? 5,
    preparation_time: banca.preparation_time ?? 30,
    payment_methods: banca.payment_methods || [],
    is_cotista: banca.is_cotista ?? false,
    cotista_id: banca.cotista_id ?? null,
    cotista_codigo: banca.cotista_codigo ?? null,
    cotista_razao_social: banca.cotista_razao_social ?? null,
    cotista_cnpj_cpf: banca.cotista_cnpj_cpf ?? null,
    active: true,
    approved: false,
    created_at: now,
    updated_at: now,
  };

  const { data: created, error: createError } = await supabaseAdmin
    .from("bancas")
    .insert(insertData)
    .select()
    .single();

  if (createError || !created) {
    throw new Error(createError?.message || "Erro ao criar banca");
  }

  const profileUpdates: Record<string, any> = { banca_id: created.id };
  if (profile?.phone) profileUpdates.phone = profile.phone;
  if (profile?.cpf) profileUpdates.cpf = profile.cpf;
  if (profile?.full_name) profileUpdates.full_name = profile.full_name;

  const { error: profileError } = await supabaseAdmin
    .from("user_profiles")
    .update(profileUpdates)
    .eq("id", params.userId);

  if (profileError) {
    throw new Error(profileError.message || "Erro ao atualizar perfil do jornaleiro");
  }

  try {
    await ensureBancaHasOnboardingPlan(created.id, {
      preferredPlanId: resolvedPlanId || undefined,
    });
  } catch (error: any) {
    console.warn("[JornaleiroBancas] Falha ao garantir plano inicial da nova banca:", error?.message || error);
  }

  return {
    success: true,
    data: created,
  };
}

export async function updateActiveJornaleiroBanca(params: {
  userId: string;
  input: any;
}) {
  const context = await loadActiveBancaContext(params.userId);

  if (!context.banca?.id) {
    throw new Error("BANCA_NOT_FOUND");
  }

  const data = params.input?.data ?? params.input;
  const addressObj = data?.addressObj || {};

  const numberNeighborhood = [addressObj.number, addressObj.neighborhood].filter(Boolean).join(" - ");
  const cityUf = [addressObj.city, addressObj.uf].filter(Boolean).join(" - ");
  const streetWithComplement = addressObj.complement
    ? `${addressObj.street}, ${addressObj.complement}`
    : addressObj.street;

  const fullAddress = [streetWithComplement, numberNeighborhood || undefined, cityUf || undefined]
    .filter(Boolean)
    .join(", ");

  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (data?.name) updateData.name = data.name;
  if (data?.description) updateData.description = data.description;
  if (data?.tpu_url) updateData.tpu_url = data.tpu_url;
  if (fullAddress) updateData.address = fullAddress;
  if (addressObj?.cep) updateData.cep = addressObj.cep;
  if (data?.location?.lat) updateData.lat = data.location.lat;
  if (data?.location?.lng) updateData.lng = data.location.lng;
  if (data?.categories) updateData.categories = data.categories;
  if (data?.payments) updateData.payment_methods = data.payments;
  if (data?.payment_methods !== undefined) updateData.payment_methods = data.payment_methods;
  if (data?.hours) updateData.hours = data.hours;
  if (data?.contact?.whatsapp) updateData.whatsapp = data.contact.whatsapp;
  if (data?.socials?.instagram) updateData.instagram = data.socials.instagram;
  if (data?.socials?.facebook) updateData.facebook = data.socials.facebook;
  if (data?.delivery_enabled !== undefined) updateData.delivery_enabled = data.delivery_enabled;
  if (data?.free_shipping_threshold !== undefined) updateData.free_shipping_threshold = data.free_shipping_threshold;
  if (data?.origin_cep !== undefined) updateData.origin_cep = data.origin_cep || null;
  if (data?.delivery_fee !== undefined) updateData.delivery_fee = data.delivery_fee;
  if (data?.min_order_value !== undefined) updateData.min_order_value = data.min_order_value;
  if (data?.delivery_radius !== undefined) updateData.delivery_radius = data.delivery_radius;
  if (data?.preparation_time !== undefined) updateData.preparation_time = data.preparation_time;
  if (data?.is_cotista !== undefined) updateData.is_cotista = data.is_cotista;
  if (data?.cotista_id) updateData.cotista_id = data.cotista_id;
  if (data?.cotista_codigo) updateData.cotista_codigo = data.cotista_codigo;
  if (data?.cotista_razao_social) updateData.cotista_razao_social = data.cotista_razao_social;
  if (data?.cotista_cnpj_cpf) updateData.cotista_cnpj_cpf = data.cotista_cnpj_cpf;

  if (data?.images?.cover !== undefined && data.images.cover !== null) {
    updateData.cover_image = data.images.cover || null;
  }

  if (data?.images?.avatar !== undefined && data.images.avatar !== null) {
    updateData.profile_image = data.images.avatar || null;
  }

  let updateQuery: any = supabaseAdmin.from("bancas").update(updateData).eq("id", context.banca.id);
  if (context.isOwner) {
    updateQuery = updateQuery.eq("user_id", params.userId);
  }

  const { data: updated, error: updateError } = await updateQuery.select().single();

  if (updateError || !updated) {
    throw new Error(updateError?.message || "Erro ao atualizar banca");
  }

  return {
    success: true,
    data: await formatBancaResponse({
      banca: updated,
      requester: context.requester,
    }),
    headers: buildNoStoreHeaders(),
  };
}

export async function setActiveJornaleiroBanca(params: {
  userId: string;
  bancaId: string;
}) {
  await loadBancaAccessContext(params);

  const { error: profileError } = await supabaseAdmin
    .from("user_profiles")
    .update({ banca_id: params.bancaId })
    .eq("id", params.userId);

  if (profileError) {
    throw new Error(profileError.message || "Erro ao definir banca ativa");
  }

  return {
    success: true,
    banca_id: params.bancaId,
    headers: buildNoStoreHeaders(),
  };
}

export async function updateJornaleiroBancaById(params: {
  userId: string;
  bancaId: string;
  input: any;
}) {
  const context = await loadBancaAccessContext({
    userId: params.userId,
    bancaId: params.bancaId,
  });

  if (!context.isOwner && context.memberAccessLevel !== "admin") {
    throw new Error("FORBIDDEN_BANCA_ADMIN");
  }

  const banca = params.input?.banca;
  const newPassword = params.input?.newPassword;

  if (!banca) {
    throw new Error("INVALID_BANCA_PAYLOAD");
  }

  if (typeof newPassword === "string" && newPassword.trim()) {
    const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(params.userId, {
      password: newPassword.trim(),
    });

    if (passwordError) {
      throw new Error(passwordError.message || "Erro ao atualizar senha");
    }
  }

  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (banca.name) updateData.name = banca.name;
  if (banca.whatsapp) updateData.whatsapp = banca.whatsapp;
  if (banca.cep) updateData.cep = banca.cep;
  if (banca.address) updateData.address = banca.address;
  if (typeof banca.lat === "number") updateData.lat = banca.lat;
  if (typeof banca.lng === "number") updateData.lng = banca.lng;
  if (banca.cover_image !== undefined) updateData.cover_image = banca.cover_image;
  if (banca.profile_image !== undefined) updateData.profile_image = banca.profile_image;
  if (banca.hours) updateData.hours = banca.hours;
  if (banca.payment_methods) updateData.payment_methods = banca.payment_methods;
  if (typeof banca.is_cotista === "boolean") updateData.is_cotista = banca.is_cotista;
  if (banca.cotista_id !== undefined) updateData.cotista_id = banca.cotista_id;
  if (banca.cotista_codigo !== undefined) updateData.cotista_codigo = banca.cotista_codigo;
  if (banca.cotista_razao_social !== undefined) updateData.cotista_razao_social = banca.cotista_razao_social;
  if (banca.cotista_cnpj_cpf !== undefined) updateData.cotista_cnpj_cpf = banca.cotista_cnpj_cpf;

  const { error: updateError } = await supabaseAdmin
    .from("bancas")
    .update(updateData)
    .eq("id", params.bancaId);

  if (updateError) {
    throw new Error(updateError.message || "Erro ao atualizar banca");
  }

  return {
    success: true,
    message: "Banca atualizada com sucesso",
    banca_id: params.bancaId,
    headers: buildNoStoreHeaders(),
  };
}

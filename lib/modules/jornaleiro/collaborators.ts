import { listOwnedBancas, loadJornaleiroActor } from "@/lib/modules/jornaleiro/access";
import { doesPlatformEmailExist } from "@/lib/modules/jornaleiro/email";
import { resolveBancaPlanEntitlements } from "@/lib/plan-entitlements";
import { supabaseAdmin } from "@/lib/supabase";

function parsePermissions(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((permission): permission is string => typeof permission === "string");
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed.filter((permission): permission is string => typeof permission === "string")
        : [];
    } catch {
      return [];
    }
  }

  return [];
}

async function loadCollaboratorManager(userId: string) {
  const { actor, error: actorError } = await loadJornaleiroActor(userId);

  if (actorError) {
    console.error("[JornaleiroCollaborators] Erro ao carregar ator:", actorError);
  }

  if (!actor.isJornaleiro) {
    throw new Error("FORBIDDEN_JORNALEIRO");
  }

  return actor;
}

async function loadOwnedBancaCatalog(userId: string) {
  const { data, error } = await listOwnedBancas<{
    id: string;
    name?: string | null;
    is_cotista?: boolean | null;
    cotista_id?: string | null;
  }>({
    userId,
    select: "id, name, is_cotista, cotista_id",
  });

  if (error) {
    throw new Error(error.message || "Erro ao buscar bancas");
  }

  return data;
}

async function loadCollaboratorEligibleBancas(userId: string) {
  const ownedBancas = await loadOwnedBancaCatalog(userId);

  if (ownedBancas.length === 0) {
    return ownedBancas;
  }

  const eligibleBancas = [];

  for (const banca of ownedBancas) {
    const entitlements = await resolveBancaPlanEntitlements({
      id: banca.id,
      is_cotista: banca.is_cotista === true,
      cotista_id: banca.cotista_id,
    });

    if (entitlements.canManageCollaborators) {
      eligibleBancas.push(banca);
    }
  }

  if (eligibleBancas.length === 0) {
    throw new Error("PREMIUM_REQUIRED_COLLABORATORS");
  }

  return eligibleBancas;
}

async function loadScopedCollaboratorMemberships(params: {
  collaboratorId: string;
  bancaIds: string[];
}) {
  const { data, error } = await supabaseAdmin
    .from("banca_members")
    .select(`
      user_id,
      banca_id,
      access_level,
      permissions,
      bancas:banca_id (id, name)
    `)
    .eq("user_id", params.collaboratorId)
    .in("banca_id", params.bancaIds);

  if (error) {
    throw new Error(error.message || "Erro ao carregar colaborador");
  }

  if (!data || data.length === 0) {
    throw new Error("COLABORADOR_NOT_FOUND");
  }

  return data;
}

export async function listManagedCollaborators(userId: string) {
  await loadCollaboratorManager(userId);
  const ownedBancas = await loadCollaboratorEligibleBancas(userId);
  const bancaIds = ownedBancas.map((banca) => banca.id);

  if (bancaIds.length === 0) {
    return { success: true, colaboradores: [] as any[] };
  }

  const { data: memberships, error: membershipsError } = await supabaseAdmin
    .from("banca_members")
    .select("user_id, banca_id, access_level, permissions")
    .in("banca_id", bancaIds)
    .neq("user_id", userId);

  if (membershipsError) {
    return {
      success: true,
      colaboradores: [],
      message: "Nenhum colaborador cadastrado ainda",
      debug: { error: membershipsError.message, code: membershipsError.code },
    };
  }

  const userIds = [...new Set((memberships || []).map((membership) => membership.user_id).filter(Boolean))];

  if (userIds.length === 0) {
    return { success: true, colaboradores: [] as any[] };
  }

  const { data: users } = await supabaseAdmin
    .from("user_profiles")
    .select("id, full_name, active, email")
    .in("id", userIds);

  const colaboradores = userIds.map((collaboratorId) => {
    const userProfile = users?.find((profile) => profile.id === collaboratorId);
    const userMemberships = (memberships || []).filter((membership) => membership.user_id === collaboratorId);
    const firstMembership = userMemberships[0];

    return {
      id: collaboratorId,
      email: userProfile?.email || "Email não disponível",
      full_name: userProfile?.full_name || null,
      access_level: firstMembership?.access_level || "collaborator",
      active: userProfile?.active ?? true,
      created_at: null,
      bancas: userMemberships.map((membership) => ({
        id: membership.banca_id,
        name: ownedBancas.find((banca) => banca.id === membership.banca_id)?.name || "Sem nome",
      })),
      permissions: parsePermissions(firstMembership?.permissions),
    };
  });

  return {
    success: true,
    colaboradores,
  };
}

export async function createManagedCollaborator(params: {
  userId: string;
  input: any;
}) {
  const actor = await loadCollaboratorManager(params.userId);
  const eligibleBancas = await loadCollaboratorEligibleBancas(params.userId);
  const { full_name, email, whatsapp, password, access_level, banca_ids, permissions } = params.input || {};

  if (access_level === "admin" && actor.accessLevel !== "admin") {
    throw new Error("FORBIDDEN_PROMOTE_ADMIN");
  }

  if (!email || !password) {
    throw new Error("INVALID_EMAIL_PASSWORD_REQUIRED");
  }

  if (!banca_ids || banca_ids.length === 0) {
    throw new Error("INVALID_BANCA_SELECTION");
  }

  const allowedBancaIds = new Set(eligibleBancas.map((banca) => banca.id));
  const requestedBancaIds = Array.isArray(banca_ids)
    ? banca_ids.filter((id: unknown): id is string => typeof id === "string")
    : [];

  if (requestedBancaIds.length !== banca_ids.length || requestedBancaIds.some((id) => !allowedBancaIds.has(id))) {
    throw new Error("FORBIDDEN_BANCA_SCOPE");
  }

  const emailExists = await doesPlatformEmailExist(String(email));
  if (emailExists) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: String(email).toLowerCase(),
    password: String(password),
    email_confirm: true,
    user_metadata: {
      full_name,
      role: "jornaleiro",
    },
  });

  if (createError || !newUser?.user) {
    throw new Error(createError?.message || "Erro ao criar usuário");
  }

  const newUserId = newUser.user.id;

  const { error: profileError } = await supabaseAdmin.from("user_profiles").upsert({
    id: newUserId,
    full_name: full_name || null,
    email: String(email).toLowerCase(),
    whatsapp: whatsapp || null,
    role: "jornaleiro",
    jornaleiro_access_level: access_level || "collaborator",
    banca_id: requestedBancaIds[0],
    active: true,
    email_verified: true,
  });

  if (profileError) {
    console.error("[JornaleiroCollaborators] Erro ao criar perfil:", profileError);
  }

  const membershipErrors: string[] = [];

  for (const bancaId of requestedBancaIds) {
    const { error: membershipError } = await supabaseAdmin
      .from("banca_members")
      .upsert({
        user_id: newUserId,
        banca_id: bancaId,
        access_level: access_level || "collaborator",
        permissions: permissions || [],
      });

    if (membershipError) {
      membershipErrors.push(`${bancaId}: ${membershipError.message}`);
    }
  }

  const { data: verifyMembership } = await supabaseAdmin
    .from("banca_members")
    .select("*")
    .eq("user_id", newUserId);

  return {
    success: true,
    colaborador: {
      id: newUserId,
      email: String(email).toLowerCase(),
      full_name,
      access_level,
    },
    debug: {
      membershipErrors: membershipErrors.length > 0 ? membershipErrors : null,
      membershipsCreated: verifyMembership?.length || 0,
    },
  };
}

export async function getManagedCollaborator(params: {
  userId: string;
  collaboratorId: string;
}) {
  await loadCollaboratorManager(params.userId);
  const ownedBancas = await loadCollaboratorEligibleBancas(params.userId);
  const memberships = await loadScopedCollaboratorMemberships({
    collaboratorId: params.collaboratorId,
    bancaIds: ownedBancas.map((banca) => banca.id),
  });

  const { data: userProfile } = await supabaseAdmin
    .from("user_profiles")
    .select("id, full_name, active")
    .eq("id", params.collaboratorId)
    .single();

  const {
    data: authUserData,
    error: authUserError,
  } = await supabaseAdmin.auth.admin.getUserById(params.collaboratorId);

  if (authUserError) {
    console.error("[JornaleiroCollaborators] Erro ao buscar auth user:", authUserError);
  }

  const bancas = memberships.map((membership: any) => ({
    id: (membership.bancas as any)?.id || membership.banca_id,
    name:
      (membership.bancas as any)?.name ||
      ownedBancas.find((banca) => banca.id === membership.banca_id)?.name ||
      "Sem nome",
    access_level: membership.access_level,
    permissions: parsePermissions(membership.permissions),
  }));

  return {
    success: true,
    colaborador: {
      id: params.collaboratorId,
      email: authUserData?.user?.email || "Email não disponível",
      full_name: userProfile?.full_name || null,
      access_level: memberships[0]?.access_level || "collaborator",
      active: userProfile?.active ?? true,
      created_at: authUserData?.user?.created_at || null,
      bancas,
      permissions: parsePermissions(memberships[0]?.permissions),
    },
  };
}

export async function updateManagedCollaborator(params: {
  userId: string;
  collaboratorId: string;
  input: any;
}) {
  const actor = await loadCollaboratorManager(params.userId);
  const eligibleBancas = await loadCollaboratorEligibleBancas(params.userId);
  const eligibleBancaIds = eligibleBancas.map((banca) => banca.id);
  const { full_name, access_level, banca_ids, permissions } = params.input || {};

  if (access_level === "admin" && actor.accessLevel !== "admin") {
    throw new Error("FORBIDDEN_PROMOTE_ADMIN");
  }

  const existingMemberships = await loadScopedCollaboratorMemberships({
    collaboratorId: params.collaboratorId,
    bancaIds: eligibleBancaIds,
  });

  if (full_name !== undefined) {
    await supabaseAdmin
      .from("user_profiles")
      .update({ full_name, jornaleiro_access_level: access_level })
      .eq("id", params.collaboratorId);
  }

  const targetBancaIds =
    Array.isArray(banca_ids) && banca_ids.length > 0
      ? banca_ids.filter((id: string) => eligibleBancaIds.includes(id))
      : existingMemberships.map((membership: any) => membership.banca_id);

  const existingBancaIds = existingMemberships.map((membership: any) => membership.banca_id);
  const normalizedPermissions = permissions || [];

  for (const bancaId of targetBancaIds) {
    const { error: updateError } = await supabaseAdmin
      .from("banca_members")
      .update({
        access_level: access_level || "collaborator",
        permissions: normalizedPermissions,
      })
      .eq("user_id", params.collaboratorId)
      .eq("banca_id", bancaId);

    if (updateError) {
      console.error("[JornaleiroCollaborators] Erro ao atualizar membership:", updateError);
    }
  }

  for (const bancaId of targetBancaIds.filter((id: string) => !existingBancaIds.includes(id))) {
    const { error: insertError } = await supabaseAdmin.from("banca_members").insert({
      user_id: params.collaboratorId,
      banca_id: bancaId,
      access_level: access_level || "collaborator",
      permissions: normalizedPermissions,
    });

    if (insertError) {
      console.error("[JornaleiroCollaborators] Erro ao criar membership:", insertError);
    }
  }

  const removedBancaIds = existingBancaIds.filter((id: string) => !targetBancaIds.includes(id));
  if (removedBancaIds.length > 0) {
    const { error: removeError } = await supabaseAdmin
      .from("banca_members")
      .delete()
      .eq("user_id", params.collaboratorId)
      .in("banca_id", removedBancaIds);

    if (removeError) {
      console.error("[JornaleiroCollaborators] Erro ao remover membership:", removeError);
    }
  }

  const { data: verifyData } = await supabaseAdmin
    .from("banca_members")
    .select("permissions")
    .eq("user_id", params.collaboratorId)
    .in("banca_id", targetBancaIds);

  return {
    success: true,
    debug: { savedPermissions: verifyData },
  };
}

export async function deleteManagedCollaborator(params: {
  userId: string;
  collaboratorId: string;
}) {
  await loadCollaboratorManager(params.userId);
  const eligibleBancas = await loadCollaboratorEligibleBancas(params.userId);
  const eligibleBancaIds = eligibleBancas.map((banca) => banca.id);
  await loadScopedCollaboratorMemberships({
    collaboratorId: params.collaboratorId,
    bancaIds: eligibleBancaIds,
  });

  const { error: deleteError } = await supabaseAdmin
    .from("banca_members")
    .delete()
    .eq("user_id", params.collaboratorId)
    .in("banca_id", eligibleBancaIds);

  if (deleteError) {
    throw new Error(deleteError.message || "Erro ao remover colaborador");
  }

  const { data: remainingMemberships } = await supabaseAdmin
    .from("banca_members")
    .select("id")
    .eq("user_id", params.collaboratorId);

  if (!remainingMemberships || remainingMemberships.length === 0) {
    await supabaseAdmin
      .from("user_profiles")
      .update({ active: false })
      .eq("id", params.collaboratorId);
  }

  return {
    success: true,
  };
}

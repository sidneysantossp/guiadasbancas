import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CRM_TABLE = "admin_banca_crm_leads";
const BATCH_SIZE = 1000;

const NO_STORE_HEADERS = buildNoStoreHeaders({
  isPrivate: true,
  vary: "Cookie, Authorization",
});

const STAGES = [
  { id: "novo", label: "Base para contato" },
  { id: "contato_inicial", label: "Primeiro contato" },
  { id: "qualificacao", label: "Qualificação" },
  { id: "apresentacao", label: "Apresentação" },
  { id: "negociacao", label: "Negociação" },
  { id: "aguardando_cadastro", label: "Aguardando cadastro" },
  { id: "convertida", label: "Convertida" },
  { id: "perdida", label: "Perdida" },
] as const;

const STAGE_IDS = new Set(STAGES.map((stage) => stage.id));
const STATUS_IDS = new Set(["ativo", "pausado", "convertido", "perdido"]);
const PRIORITY_IDS = new Set(["baixa", "media", "alta"]);

type SourceType = "manual" | "cotista" | "banca";

type CrmRow = {
  id: string;
  source_type: SourceType;
  source_id: string | null;
  cotista_id: string | null;
  banca_id: string | null;
  codigo: string | null;
  banca_name: string;
  responsavel_name: string | null;
  phone: string | null;
  phone_2: string | null;
  document: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  is_cotista: boolean;
  is_registered: boolean;
  stage: string;
  status: string;
  priority: string;
  assigned_to: string | null;
  notes: string | null;
  last_contact_at: string | null;
  next_follow_up_at: string | null;
  lost_reason: string | null;
  created_at: string;
  updated_at: string;
};

function digitsOnly(value: unknown) {
  return String(value || "").replace(/\D/g, "");
}

function cleanText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function cleanDate(value: unknown): string | null {
  const text = cleanText(value);
  if (!text) return null;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function sourceKey(sourceType: SourceType, sourceId?: string | null) {
  return sourceId ? `${sourceType}:${sourceId}` : null;
}

function isMissingCrmTable(error: any) {
  const message = String(error?.message || "");
  return error?.code === "42P01" || message.includes(CRM_TABLE) || message.includes("does not exist");
}

function pickCityFromBanca(banca: any) {
  return banca?.address_obj?.city || banca?.addressobj?.city || null;
}

function pickStateFromBanca(banca: any) {
  return banca?.address_obj?.uf || banca?.addressobj?.uf || null;
}

function pickAddressFromBanca(banca: any) {
  return banca?.address || null;
}

function pickPhoneFromBanca(banca: any, profile?: any) {
  return banca?.whatsapp || banca?.phone || profile?.phone || null;
}

function applyOverlay(base: any, overlay?: Partial<CrmRow> | null) {
  if (!overlay) return base;
  return {
    ...base,
    crm_id: overlay.id,
    codigo: overlay.codigo || base.codigo,
    banca_name: overlay.banca_name || base.banca_name,
    responsavel_name: overlay.responsavel_name || base.responsavel_name,
    phone: overlay.phone || base.phone,
    phone_2: overlay.phone_2 || base.phone_2,
    document: overlay.document || base.document,
    address: overlay.address || base.address,
    city: overlay.city || base.city,
    state: overlay.state || base.state,
    is_cotista: overlay.is_cotista ?? base.is_cotista,
    is_registered: overlay.is_registered ?? base.is_registered,
    stage: overlay.stage || base.stage,
    status: overlay.status || base.status,
    priority: overlay.priority || base.priority,
    assigned_to: overlay.assigned_to ?? base.assigned_to,
    notes: overlay.notes ?? base.notes,
    last_contact_at: overlay.last_contact_at ?? base.last_contact_at,
    next_follow_up_at: overlay.next_follow_up_at ?? base.next_follow_up_at,
    lost_reason: overlay.lost_reason ?? base.lost_reason,
    updated_at: overlay.updated_at || base.updated_at,
  };
}

async function fetchAll(buildQuery: () => any) {
  const rows: any[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await buildQuery().range(offset, offset + BATCH_SIZE - 1);
    if (error) throw error;
    const batch = data || [];
    rows.push(...batch);
    if (batch.length < BATCH_SIZE) break;
    offset += batch.length;
  }

  return rows;
}

async function readCrmRows(): Promise<{ rows: CrmRow[]; available: boolean }> {
  const { data, error } = await supabaseAdmin
    .from(CRM_TABLE)
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    if (isMissingCrmTable(error)) {
      return { rows: [], available: false };
    }
    throw error;
  }

  return { rows: (data || []) as CrmRow[], available: true };
}

function buildLeadStats(leads: any[]) {
  return {
    total: leads.length,
    cadastradas: leads.filter((lead) => lead.is_registered).length,
    nao_cadastradas: leads.filter((lead) => !lead.is_registered).length,
    cotistas: leads.filter((lead) => lead.is_cotista).length,
    cotistas_cadastradas: leads.filter((lead) => lead.is_cotista && lead.is_registered).length,
    cotistas_nao_cadastradas: leads.filter((lead) => lead.is_cotista && !lead.is_registered).length,
    nao_cotistas_cadastradas: leads.filter((lead) => !lead.is_cotista && lead.is_registered).length,
    manuais: leads.filter((lead) => lead.source_type === "manual").length,
    followups_vencidos: leads.filter((lead) => {
      if (!lead.next_follow_up_at) return false;
      return new Date(lead.next_follow_up_at).getTime() < Date.now();
    }).length,
  };
}

async function buildLeads() {
  const [crmResult, cotistas, bancas] = await Promise.all([
    readCrmRows(),
    fetchAll(() =>
      supabaseAdmin
        .from("cotistas")
        .select("id,codigo,razao_social,cnpj_cpf,telefone,telefone_2,endereco_principal,cidade,estado,ativo,created_at,updated_at")
        .order("razao_social", { ascending: true })
    ),
    fetchAll(() =>
      supabaseAdmin
        .from("bancas")
        .select("*")
        .order("name", { ascending: true })
    ),
  ]);

  const crmByKey = new Map<string, CrmRow>();
  const manualRows: CrmRow[] = [];
  for (const row of crmResult.rows) {
    const key = sourceKey(row.source_type, row.source_id);
    if (row.source_type === "manual") {
      manualRows.push(row);
    } else if (key) {
      crmByKey.set(key, row);
    }
  }

  const userIds = Array.from(new Set(bancas.map((banca: any) => banca.user_id).filter(Boolean)));
  let profilesById = new Map<string, any>();
  if (userIds.length > 0) {
    const profiles = await fetchAll(() =>
      supabaseAdmin
        .from("user_profiles")
        .select("id,full_name,email,phone,cpf")
        .in("id", userIds)
    );
    profilesById = new Map(profiles.map((profile: any) => [String(profile.id), profile]));
  }

  const cotistaById = new Map(cotistas.map((cotista: any) => [String(cotista.id), cotista]));
  const cotistaByDocument = new Map<string, any>();
  for (const cotista of cotistas) {
    const doc = digitsOnly(cotista.cnpj_cpf);
    if (doc) cotistaByDocument.set(doc, cotista);
  }

  const bancaByCotistaId = new Map<string, any>();
  const matchedBancaIds = new Set<string>();
  for (const banca of bancas) {
    const directCotistaId = banca.cotista_id ? String(banca.cotista_id) : null;
    const documentMatch =
      cotistaByDocument.get(digitsOnly(banca.cotista_cnpj_cpf)) ||
      cotistaByDocument.get(digitsOnly(banca.cnpj)) ||
      cotistaByDocument.get(digitsOnly(banca.cpf));
    const cotistaId = directCotistaId || (documentMatch ? String(documentMatch.id) : null);
    if (!cotistaId || !cotistaById.has(cotistaId)) continue;

    const current = bancaByCotistaId.get(cotistaId);
    if (!current || (banca.active === true && current.active !== true)) {
      bancaByCotistaId.set(cotistaId, banca);
    }
    matchedBancaIds.add(String(banca.id));
  }

  const leads: any[] = [];

  for (const cotista of cotistas) {
    const banca = bancaByCotistaId.get(String(cotista.id));
    const profile = banca?.user_id ? profilesById.get(String(banca.user_id)) : null;
    const key = sourceKey("cotista", cotista.id)!;
    const base = {
      id: key,
      crm_id: null,
      source_type: "cotista" as SourceType,
      source_id: cotista.id,
      cotista_id: cotista.id,
      banca_id: banca?.id || null,
      codigo: cotista.codigo || null,
      banca_name: banca?.name || cotista.razao_social || "Cotista sem nome",
      responsavel_name: profile?.full_name || cotista.razao_social || null,
      phone: pickPhoneFromBanca(banca, profile) || cotista.telefone || null,
      phone_2: cotista.telefone_2 || null,
      document: digitsOnly(cotista.cnpj_cpf) || null,
      address: pickAddressFromBanca(banca) || cotista.endereco_principal || null,
      city: pickCityFromBanca(banca) || cotista.cidade || null,
      state: pickStateFromBanca(banca) || cotista.estado || null,
      is_cotista: true,
      is_registered: Boolean(banca),
      stage: banca ? "convertida" : "novo",
      status: banca ? "convertido" : "ativo",
      priority: "media",
      assigned_to: null,
      notes: null,
      last_contact_at: null,
      next_follow_up_at: null,
      lost_reason: null,
      active: cotista.ativo !== false,
      registered_banca_name: banca?.name || null,
      created_at: cotista.created_at || null,
      updated_at: cotista.updated_at || cotista.created_at || null,
    };
    leads.push(applyOverlay(base, crmByKey.get(key)));
  }

  for (const banca of bancas) {
    if (matchedBancaIds.has(String(banca.id))) continue;
    const profile = banca.user_id ? profilesById.get(String(banca.user_id)) : null;
    const key = sourceKey("banca", banca.id)!;
    const doc = digitsOnly(banca.cotista_cnpj_cpf) || digitsOnly(banca.cnpj) || digitsOnly(banca.cpf) || digitsOnly(profile?.cpf);
    const base = {
      id: key,
      crm_id: null,
      source_type: "banca" as SourceType,
      source_id: banca.id,
      cotista_id: banca.cotista_id || null,
      banca_id: banca.id,
      codigo: banca.cotista_codigo || null,
      banca_name: banca.name || "Banca sem nome",
      responsavel_name: profile?.full_name || banca.owner_name || null,
      phone: pickPhoneFromBanca(banca, profile),
      phone_2: null,
      document: doc || null,
      address: pickAddressFromBanca(banca),
      city: pickCityFromBanca(banca),
      state: pickStateFromBanca(banca),
      is_cotista: banca.is_cotista === true || Boolean(banca.cotista_id),
      is_registered: true,
      stage: "convertida",
      status: "convertido",
      priority: "media",
      assigned_to: null,
      notes: null,
      last_contact_at: null,
      next_follow_up_at: null,
      lost_reason: null,
      active: banca.active !== false,
      registered_banca_name: banca.name || null,
      created_at: banca.created_at || null,
      updated_at: banca.updated_at || banca.created_at || null,
    };
    leads.push(applyOverlay(base, crmByKey.get(key)));
  }

  for (const row of manualRows) {
    leads.push({
      id: row.id,
      crm_id: row.id,
      source_type: "manual",
      source_id: row.source_id,
      cotista_id: row.cotista_id,
      banca_id: row.banca_id,
      codigo: row.codigo,
      banca_name: row.banca_name,
      responsavel_name: row.responsavel_name,
      phone: row.phone,
      phone_2: row.phone_2,
      document: row.document,
      address: row.address,
      city: row.city,
      state: row.state,
      is_cotista: row.is_cotista,
      is_registered: row.is_registered,
      stage: row.stage,
      status: row.status,
      priority: row.priority,
      assigned_to: row.assigned_to,
      notes: row.notes,
      last_contact_at: row.last_contact_at,
      next_follow_up_at: row.next_follow_up_at,
      lost_reason: row.lost_reason,
      active: true,
      registered_banca_name: null,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  }

  return { leads, crmAvailable: crmResult.available };
}

function sanitizeLeadPayload(body: any) {
  const stage = String(body.stage || "novo");
  const status = String(body.status || "ativo");
  const priority = String(body.priority || "media");

  return {
    source_type: (body.source_type || "manual") as SourceType,
    source_id: cleanText(body.source_id),
    cotista_id: cleanText(body.cotista_id),
    banca_id: cleanText(body.banca_id),
    codigo: cleanText(body.codigo),
    banca_name: cleanText(body.banca_name) || cleanText(body.name) || "Banca sem nome",
    responsavel_name: cleanText(body.responsavel_name),
    phone: cleanText(body.phone),
    phone_2: cleanText(body.phone_2),
    document: digitsOnly(body.document || body.cnpj_cpf || body.cpf_cnpj) || null,
    address: cleanText(body.address),
    city: cleanText(body.city),
    state: cleanText(body.state)?.toUpperCase() || null,
    is_cotista: body.is_cotista === true,
    is_registered: body.is_registered === true,
    stage: STAGE_IDS.has(stage as any) ? stage : "novo",
    status: STATUS_IDS.has(status) ? status : "ativo",
    priority: PRIORITY_IDS.has(priority) ? priority : "media",
    assigned_to: cleanText(body.assigned_to),
    notes: cleanText(body.notes),
    last_contact_at: cleanDate(body.last_contact_at),
    next_follow_up_at: cleanDate(body.next_follow_up_at),
    lost_reason: cleanText(body.lost_reason),
  };
}

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const search = cleanText(searchParams.get("search"))?.toLowerCase() || "";
    const stage = cleanText(searchParams.get("stage")) || "";
    const segment = cleanText(searchParams.get("segment")) || "";

    const { leads, crmAvailable } = await buildLeads();
    const filtered = leads.filter((lead) => {
      const haystack = [
        lead.banca_name,
        lead.responsavel_name,
        lead.phone,
        lead.document,
        lead.codigo,
        lead.city,
        lead.state,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !search || haystack.includes(search);
      const matchesStage = !stage || lead.stage === stage;
      const matchesSegment =
        !segment ||
        (segment === "cotistas_cadastradas" && lead.is_cotista && lead.is_registered) ||
        (segment === "cotistas_nao_cadastradas" && lead.is_cotista && !lead.is_registered) ||
        (segment === "nao_cotistas_cadastradas" && !lead.is_cotista && lead.is_registered) ||
        (segment === "nao_cotistas_nao_cadastradas" && !lead.is_cotista && !lead.is_registered);
      return matchesSearch && matchesStage && matchesSegment;
    });

    return NextResponse.json(
      {
        success: true,
        data: filtered,
        stages: STAGES,
        stats: buildLeadStats(leads),
        filtered_stats: buildLeadStats(filtered),
        crm_available: crmAvailable,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error: any) {
    console.error("[GET PROSPECCAO]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao carregar CRM" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const payload = sanitizeLeadPayload(await request.json());
    payload.source_type = "manual";
    payload.source_id = null;

    const { data, error } = await supabaseAdmin
      .from(CRM_TABLE)
      .insert(payload)
      .select()
      .single();

    if (error) {
      const status = isMissingCrmTable(error) ? 424 : 500;
      return NextResponse.json(
        { success: false, error: error.message },
        { status, headers: NO_STORE_HEADERS }
      );
    }

    return NextResponse.json({ success: true, data }, { headers: NO_STORE_HEADERS });
  } catch (error: any) {
    console.error("[POST PROSPECCAO]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao criar lead" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const body = await request.json();
    const payload = sanitizeLeadPayload(body);
    const crmId = cleanText(body.crm_id || body.id);
    const sourceType = (body.source_type || payload.source_type) as SourceType;
    const sourceId = cleanText(body.source_id || payload.source_id);

    if (crmId && sourceType === "manual") {
      const { data, error } = await supabaseAdmin
        .from(CRM_TABLE)
        .update(payload)
        .eq("id", crmId)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data }, { headers: NO_STORE_HEADERS });
    }

    if (!sourceId || !["cotista", "banca"].includes(sourceType)) {
      return NextResponse.json(
        { success: false, error: "Origem do lead inválida." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const { data: existing, error: readError } = await supabaseAdmin
      .from(CRM_TABLE)
      .select("id")
      .eq("source_type", sourceType)
      .eq("source_id", sourceId)
      .maybeSingle();

    if (readError && !isMissingCrmTable(readError)) {
      throw readError;
    }

    if (readError && isMissingCrmTable(readError)) {
      return NextResponse.json(
        { success: false, error: readError.message },
        { status: 424, headers: NO_STORE_HEADERS }
      );
    }

    if (existing?.id) {
      const { data, error } = await supabaseAdmin
        .from(CRM_TABLE)
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ success: true, data }, { headers: NO_STORE_HEADERS });
    }

    const { data, error } = await supabaseAdmin
      .from(CRM_TABLE)
      .insert({
        ...payload,
        source_type: sourceType,
        source_id: sourceId,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { headers: NO_STORE_HEADERS });
  } catch (error: any) {
    console.error("[PATCH PROSPECCAO]", error);
    const status = isMissingCrmTable(error) ? 424 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao atualizar lead" },
      { status, headers: NO_STORE_HEADERS }
    );
  }
}

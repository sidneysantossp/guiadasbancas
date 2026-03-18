import { loadAccessibleBancaForJornaleiro } from "@/lib/modules/jornaleiro/access";
import { supabaseAdmin } from "@/lib/supabase";

export interface JornaleiroWhatsAppConfig {
  jornaleiroId: string;
  whatsappNumber: string;
  bancaName: string;
  isActive: boolean;
}

function buildConfigFromBanca(banca: {
  id: string;
  name?: string | null;
  whatsapp?: string | null;
  active?: boolean | null;
}): JornaleiroWhatsAppConfig {
  const whatsappNumber = (banca.whatsapp || "").trim();

  return {
    jornaleiroId: banca.id,
    whatsappNumber,
    bancaName: banca.name || "",
    isActive: Boolean(whatsappNumber && banca.active !== false),
  };
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

export async function loadJornaleiroWhatsAppByBancaId(
  bancaId: string
): Promise<JornaleiroWhatsAppConfig | null> {
  const { data, error } = await supabaseAdmin
    .from("bancas")
    .select("id, name, whatsapp, active")
    .eq("id", bancaId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Erro ao buscar configuração do WhatsApp");
  }

  if (!data) {
    return null;
  }

  return buildConfigFromBanca(data);
}

export async function loadManagedJornaleiroWhatsApp(params: {
  userId: string;
  bancaId: string;
}) {
  const { banca } = await loadAccessibleBancaForJornaleiro<{
    id: string;
    name?: string | null;
    whatsapp?: string | null;
    active?: boolean | null;
  }>({
    userId: params.userId,
    bancaId: params.bancaId,
    select: "id, user_id, name, whatsapp, active",
  });

  return buildConfigFromBanca(banca);
}

export async function saveManagedJornaleiroWhatsApp(params: {
  userId: string;
  bancaId: string;
  whatsappNumber: string;
  bancaName?: string | null;
}) {
  const access = await loadAccessibleBancaForJornaleiro<{
    id: string;
    name?: string | null;
    whatsapp?: string | null;
    active?: boolean | null;
  }>({
    userId: params.userId,
    bancaId: params.bancaId,
    select: "id, user_id, name, whatsapp, active",
  });

  if (!access.isOwner && access.memberAccessLevel !== "admin") {
    throw new Error("FORBIDDEN_BANCA_ADMIN");
  }

  const cleanNumber = normalizePhone(params.whatsappNumber || "");

  if (!cleanNumber) {
    throw new Error("INVALID_WHATSAPP_REQUIRED");
  }

  if (cleanNumber.length < 10 || cleanNumber.length > 13) {
    throw new Error("INVALID_WHATSAPP_NUMBER");
  }

  const updateData: Record<string, unknown> = {
    whatsapp: cleanNumber,
    updated_at: new Date().toISOString(),
  };

  if (typeof params.bancaName === "string" && params.bancaName.trim()) {
    updateData.name = params.bancaName.trim();
  }

  const { data, error } = await supabaseAdmin
    .from("bancas")
    .update(updateData)
    .eq("id", params.bancaId)
    .select("id, name, whatsapp, active")
    .single();

  if (error) {
    throw new Error(error.message || "Erro ao salvar configuração do WhatsApp");
  }

  return {
    success: true,
    message: "WhatsApp configurado com sucesso",
    data: buildConfigFromBanca(data),
  };
}

export async function removeManagedJornaleiroWhatsApp(params: {
  userId: string;
  bancaId: string;
}) {
  const access = await loadAccessibleBancaForJornaleiro({
    userId: params.userId,
    bancaId: params.bancaId,
    select: "id, user_id",
  });

  if (!access.isOwner && access.memberAccessLevel !== "admin") {
    throw new Error("FORBIDDEN_BANCA_ADMIN");
  }

  const { error } = await supabaseAdmin
    .from("bancas")
    .update({
      whatsapp: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.bancaId);

  if (error) {
    throw new Error(error.message || "Erro ao remover configuração do WhatsApp");
  }

  return {
    success: true,
    message: "Configuração removida com sucesso",
  };
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  IconBuildingStore,
  IconCalendarEvent,
  IconEdit,
  IconGripVertical,
  IconPhone,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";
import { buildWhatsAppUrl, normalizeBrazilianWhatsAppDigits } from "@/lib/whatsapp-url";

type CrmStage = {
  id: string;
  label: string;
};

type CrmLead = {
  id: string;
  crm_id: string | null;
  source_type: "manual" | "cotista" | "banca";
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
  registered_banca_name: string | null;
  updated_at: string | null;
};

type CrmStats = {
  total: number;
  cadastradas: number;
  nao_cadastradas: number;
  cotistas: number;
  cotistas_cadastradas: number;
  cotistas_nao_cadastradas: number;
  nao_cotistas_cadastradas: number;
  manuais: number;
  followups_vencidos: number;
};

type LeadForm = {
  id?: string | null;
  crm_id?: string | null;
  source_type: CrmLead["source_type"];
  source_id?: string | null;
  cotista_id?: string | null;
  banca_id?: string | null;
  codigo?: string | null;
  banca_name: string;
  responsavel_name: string;
  phone: string;
  phone_2: string;
  document: string;
  address: string;
  city: string;
  state: string;
  is_cotista: boolean;
  is_registered: boolean;
  stage: string;
  status: string;
  priority: string;
  assigned_to: string;
  notes: string;
  last_contact_at: string;
  next_follow_up_at: string;
  lost_reason: string;
};

const SEGMENT_OPTIONS = [
  { value: "", label: "Todos segmentos" },
  { value: "cotistas_cadastradas", label: "Cotistas cadastradas" },
  { value: "cotistas_nao_cadastradas", label: "Cotistas não cadastradas" },
  { value: "nao_cotistas_cadastradas", label: "Não cotistas cadastradas" },
  { value: "nao_cotistas_nao_cadastradas", label: "Não cotistas não cadastradas" },
];

const PRIORITY_LABELS: Record<string, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

const STATUS_LABELS: Record<string, string> = {
  ativo: "Ativo",
  pausado: "Pausado",
  convertido: "Convertido",
  perdido: "Perdido",
};

function formatDocument(value?: string | null) {
  const cleaned = String(value || "").replace(/\D/g, "");
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  if (cleaned.length === 14) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
  return value || "—";
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function getWhatsAppHref(phone?: string | null) {
  const normalized = normalizeBrazilianWhatsAppDigits(phone);
  return normalized.length >= 12 ? buildWhatsAppUrl(normalized) : null;
}

function toDateInputValue(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function summaryCard(title: string, value: number, helper: string) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value.toLocaleString("pt-BR")}</div>
      <div className="mt-1 text-sm text-gray-500">{helper}</div>
    </div>
  );
}

function leadToForm(lead?: CrmLead | null): LeadForm {
  if (!lead) {
    return {
      source_type: "manual",
      source_id: null,
      cotista_id: null,
      banca_id: null,
      codigo: null,
      banca_name: "",
      responsavel_name: "",
      phone: "",
      phone_2: "",
      document: "",
      address: "",
      city: "",
      state: "",
      is_cotista: false,
      is_registered: false,
      stage: "novo",
      status: "ativo",
      priority: "media",
      assigned_to: "",
      notes: "",
      last_contact_at: "",
      next_follow_up_at: "",
      lost_reason: "",
    };
  }

  return {
    id: lead.id,
    crm_id: lead.crm_id,
    source_type: lead.source_type,
    source_id: lead.source_id,
    cotista_id: lead.cotista_id,
    banca_id: lead.banca_id,
    codigo: lead.codigo,
    banca_name: lead.banca_name || "",
    responsavel_name: lead.responsavel_name || "",
    phone: lead.phone || "",
    phone_2: lead.phone_2 || "",
    document: lead.document || "",
    address: lead.address || "",
    city: lead.city || "",
    state: lead.state || "",
    is_cotista: lead.is_cotista,
    is_registered: lead.is_registered,
    stage: lead.stage || "novo",
    status: lead.status || "ativo",
    priority: lead.priority || "media",
    assigned_to: lead.assigned_to || "",
    notes: lead.notes || "",
    last_contact_at: toDateInputValue(lead.last_contact_at),
    next_follow_up_at: toDateInputValue(lead.next_follow_up_at),
    lost_reason: lead.lost_reason || "",
  };
}

function segmentMatches(lead: CrmLead, segment: string) {
  if (!segment) return true;
  if (segment === "cotistas_cadastradas") return lead.is_cotista && lead.is_registered;
  if (segment === "cotistas_nao_cadastradas") return lead.is_cotista && !lead.is_registered;
  if (segment === "nao_cotistas_cadastradas") return !lead.is_cotista && lead.is_registered;
  if (segment === "nao_cotistas_nao_cadastradas") return !lead.is_cotista && !lead.is_registered;
  return true;
}

function isFollowUpOverdue(value?: string | null) {
  if (!value) return false;
  return new Date(value).getTime() < Date.now();
}

function LeadPhoneLink({ lead }: { lead: CrmLead }) {
  const primaryPhone = lead.phone || lead.phone_2;
  const whatsappHref = getWhatsAppHref(primaryPhone);

  if (!whatsappHref || !primaryPhone) {
    return <span className="truncate">Telefone não informado</span>;
  }

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className="truncate font-medium text-green-700 underline-offset-2 hover:text-green-800 hover:underline"
      title="Abrir conversa no WhatsApp"
    >
      {primaryPhone}
    </a>
  );
}

export default function AdminProspeccaoPage() {
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [stages, setStages] = useState<CrmStage[]>([]);
  const [stats, setStats] = useState<CrmStats | null>(null);
  const [crmAvailable, setCrmAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<LeadForm>(leadToForm());
  const [formError, setFormError] = useState<string | null>(null);

  const loadLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAdminWithDevFallback("/api/admin/prospeccao");
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Erro ao carregar CRM");
      }
      setLeads(Array.isArray(json.data) ? json.data : []);
      setStages(Array.isArray(json.stages) ? json.stages : []);
      setStats(json.stats || null);
      setCrmAvailable(json.crm_available !== false);
    } catch (err: any) {
      setLeads([]);
      setStats(null);
      setError(err.message || "Erro ao carregar CRM");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const haystack = [
        lead.banca_name,
        lead.responsavel_name,
        lead.phone,
        lead.phone_2,
        lead.document,
        lead.codigo,
        lead.city,
        lead.state,
        lead.notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !normalized || haystack.includes(normalized);
      const matchesSegment = segmentMatches(lead, segment);
      const matchesStage = !stageFilter || lead.stage === stageFilter;
      return matchesSearch && matchesSegment && matchesStage;
    });
  }, [leads, search, segment, stageFilter]);

  const leadsByStage = useMemo(() => {
    const map = new Map<string, CrmLead[]>();
    for (const stage of stages) map.set(stage.id, []);
    for (const lead of filteredLeads) {
      const bucket = map.get(lead.stage) || map.get("novo");
      bucket?.push(lead);
    }
    return map;
  }, [filteredLeads, stages]);

  const openCreate = () => {
    setForm(leadToForm());
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (lead: CrmLead) => {
    setForm(leadToForm(lead));
    setFormError(null);
    setModalOpen(true);
  };

  const persistLead = async (nextForm: LeadForm, method: "POST" | "PATCH") => {
    const payload = {
      ...nextForm,
      id: nextForm.crm_id || nextForm.id,
      crm_id: nextForm.crm_id,
    };
    const response = await fetchAdminWithDevFallback("/api/admin/prospeccao", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.error || "Erro ao salvar lead");
    }
  };

  const submitForm = async () => {
    if (!form.banca_name.trim()) {
      setFormError("Informe o nome da banca ou relacionamento.");
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      await persistLead(form, form.source_type === "manual" && !form.crm_id && !form.id ? "POST" : "PATCH");
      setModalOpen(false);
      await loadLeads();
    } catch (err: any) {
      setFormError(err.message || "Erro ao salvar lead");
    } finally {
      setSaving(false);
    }
  };

  const updateLeadStage = async (lead: CrmLead, stageId: string) => {
    if (lead.stage === stageId) return;
    const previous = leads;
    setLeads((current) =>
      current.map((item) =>
        item.id === lead.id
          ? {
              ...item,
              stage: stageId,
              status: stageId === "convertida" ? "convertido" : stageId === "perdida" ? "perdido" : item.status,
            }
          : item
      )
    );
    try {
      await persistLead(
        {
          ...leadToForm(lead),
          stage: stageId,
          status: stageId === "convertida" ? "convertido" : stageId === "perdida" ? "perdido" : lead.status,
        },
        "PATCH"
      );
      await loadLeads();
    } catch (err: any) {
      setLeads(previous);
      setError(err.message || "Erro ao mover card");
    }
  };

  const onDropStage = (stageId: string) => {
    const lead = leads.find((item) => item.id === draggingId);
    setDraggingId(null);
    if (lead) {
      updateLeadStage(lead, stageId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-semibold text-gray-900">CRM de prospecção de bancas</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Gestão comercial da base de cotistas, bancas cadastradas e leads que ainda precisam entrar na plataforma.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadLeads}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
          >
            <IconRefresh size={18} />
            Atualizar
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-[#ff5c00] px-4 py-3 text-sm font-medium text-white hover:bg-[#e05400]"
          >
            <IconPlus size={18} />
            Novo lead
          </button>
        </div>
      </div>

      {!crmAvailable ? (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
          A base automática está visível, mas a tabela do CRM ainda não existe no banco. Execute a migração
          <span className="font-mono"> 20260505000001_create_admin_banca_crm.sql </span>
          para salvar etapas, notas e novos leads.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {summaryCard("Total no CRM", stats?.total || 0, "Cotistas, bancas e leads manuais")}
        {summaryCard("Cotistas sem cadastro", stats?.cotistas_nao_cadastradas || 0, "Prioridade de conversão")}
        {summaryCard("Cotistas cadastradas", stats?.cotistas_cadastradas || 0, "Já vinculadas à plataforma")}
        {summaryCard("Não cotistas cadastradas", stats?.nao_cotistas_cadastradas || 0, "Bancas já operando")}
        {summaryCard("Follow-ups vencidos", stats?.followups_vencidos || 0, "Ações atrasadas")}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-[1.5fr_260px_240px]">
          <label className="relative block">
            <IconSearch size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por banca, responsável, telefone, documento ou cidade"
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm"
            />
          </label>
          <select
            value={segment}
            onChange={(event) => setSegment(event.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-3 text-sm"
          >
            {SEGMENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={stageFilter}
            onChange={(event) => setStageFilter(event.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-3 text-sm"
          >
            <option value="">Todas as etapas</option>
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-sm text-gray-500">Carregando CRM...</div>
        ) : (
          <div className="overflow-x-auto p-4">
            <div className="flex min-h-[620px] min-w-max gap-4">
              {stages.map((stage) => {
                const items = leadsByStage.get(stage.id) || [];
                return (
                  <section
                    key={stage.id}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => onDropStage(stage.id)}
                    className="flex w-[310px] shrink-0 flex-col rounded-lg border border-gray-200 bg-gray-50"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 px-3 py-3">
                      <div>
                        <h2 className="text-sm font-semibold text-gray-900">{stage.label}</h2>
                        <p className="mt-0.5 text-xs text-gray-500">{items.length.toLocaleString("pt-BR")} card(s)</p>
                      </div>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto p-3">
                      {items.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-gray-300 bg-white px-3 py-8 text-center text-xs text-gray-400">
                          Arraste cards para esta etapa
                        </div>
                      ) : (
                        items.map((lead) => (
                          <article
                            key={lead.id}
                            draggable
                            onDragStart={() => setDraggingId(lead.id)}
                            onDragEnd={() => setDraggingId(null)}
                            className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition hover:border-[#ff5c00]/50 hover:shadow-md"
                          >
                            <div className="mb-2 flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                      lead.is_registered ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {lead.is_registered ? "Cadastrada" : "Não cadastrada"}
                                  </span>
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                      lead.is_cotista ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                                    }`}
                                  >
                                    {lead.is_cotista ? "Cotista" : "Não cotista"}
                                  </span>
                                </div>
                                <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-gray-900">
                                  {lead.banca_name}
                                </h3>
                              </div>
                              <IconGripVertical size={18} className="mt-1 shrink-0 text-gray-300" />
                            </div>

                            <div className="space-y-1.5 text-xs text-gray-600">
                              <div className="flex items-center gap-2">
                                <IconUser size={14} className="shrink-0 text-gray-400" />
                                <span className="truncate">{lead.responsavel_name || "Responsável não informado"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <IconPhone size={14} className="shrink-0 text-gray-400" />
                                <LeadPhoneLink lead={lead} />
                              </div>
                              <div className="flex items-center gap-2">
                                <IconBuildingStore size={14} className="shrink-0 text-gray-400" />
                                <span className="truncate">
                                  {lead.city || "Cidade não informada"}
                                  {lead.state ? `/${lead.state}` : ""}
                                </span>
                              </div>
                              <div className="font-mono text-[11px] text-gray-500">{formatDocument(lead.document)}</div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                              <div className="rounded-lg bg-gray-50 px-2 py-2">
                                <div className="font-semibold uppercase tracking-[0.12em] text-gray-400">Prioridade</div>
                                <div className={lead.priority === "alta" ? "font-semibold text-red-600" : "font-medium text-gray-700"}>
                                  {PRIORITY_LABELS[lead.priority] || "Média"}
                                </div>
                              </div>
                              <div className="rounded-lg bg-gray-50 px-2 py-2">
                                <div className="font-semibold uppercase tracking-[0.12em] text-gray-400">Follow-up</div>
                                <div className={isFollowUpOverdue(lead.next_follow_up_at) ? "font-semibold text-red-600" : "font-medium text-gray-700"}>
                                  {formatDate(lead.next_follow_up_at)}
                                </div>
                              </div>
                            </div>

                            {lead.notes ? (
                              <p className="mt-3 line-clamp-3 rounded-lg bg-yellow-50 px-2 py-2 text-xs leading-5 text-yellow-900">
                                {lead.notes}
                              </p>
                            ) : null}

                            <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
                              <select
                                value={lead.stage}
                                onChange={(event) => updateLeadStage(lead, event.target.value)}
                                className="min-w-0 flex-1 rounded-lg border border-gray-300 px-2 py-2 text-xs"
                              >
                                {stages.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.label}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => openEdit(lead)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:border-[#ff5c00] hover:text-[#ff5c00]"
                                title="Editar card"
                              >
                                <IconEdit size={16} />
                              </button>
                            </div>

                            <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
                              <span>{lead.source_type === "manual" ? "Lead manual" : lead.source_type === "cotista" ? `Cotista ${lead.codigo || ""}` : "Banca cadastrada"}</span>
                              {lead.banca_id ? (
                                <Link href={`/admin/bancas/${lead.banca_id}` as Route} className="font-medium text-[#ff5c00] hover:underline">
                                  Abrir banca
                                </Link>
                              ) : null}
                            </div>
                          </article>
                        ))
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="flex items-start justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {form.source_type === "manual" && !form.id ? "Novo lead de prospecção" : "Editar card do CRM"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {form.source_type === "manual" ? "Cadastro manual" : form.source_type === "cotista" ? "Registro originado de cotista" : "Registro originado de banca cadastrada"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 p-5">
              {formError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>
              ) : null}

              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-700">Banca / relacionamento</label>
                  <input
                    value={form.banca_name}
                    onChange={(event) => setForm({ ...form, banca_name: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Responsável</label>
                  <input
                    value={form.responsavel_name}
                    onChange={(event) => setForm({ ...form, responsavel_name: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Telefone</label>
                  <input
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Telefone 2</label>
                  <input
                    value={form.phone_2}
                    onChange={(event) => setForm({ ...form, phone_2: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">CPF / CNPJ</label>
                  <input
                    value={form.document}
                    onChange={(event) => setForm({ ...form, document: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Código cotista</label>
                  <input
                    value={form.codigo || ""}
                    onChange={(event) => setForm({ ...form, codigo: event.target.value || null })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr_120px]">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Endereço</label>
                  <input
                    value={form.address}
                    onChange={(event) => setForm({ ...form, address: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Cidade</label>
                  <input
                    value={form.city}
                    onChange={(event) => setForm({ ...form, city: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">UF</label>
                  <input
                    value={form.state}
                    onChange={(event) => setForm({ ...form, state: event.target.value.toUpperCase() })}
                    maxLength={2}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase"
                  />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Etapa</label>
                  <select
                    value={form.stage}
                    onChange={(event) => setForm({ ...form, stage: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    {stages.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Status</label>
                  <select
                    value={form.status}
                    onChange={(event) => setForm({ ...form, status: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Prioridade</label>
                  <select
                    value={form.priority}
                    onChange={(event) => setForm({ ...form, priority: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Dono interno</label>
                  <input
                    value={form.assigned_to}
                    onChange={(event) => setForm({ ...form, assigned_to: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Comercial"
                  />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-4">
                <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.is_cotista}
                    onChange={(event) => setForm({ ...form, is_cotista: event.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Cotista
                </label>
                <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.is_registered}
                    onChange={(event) => setForm({ ...form, is_registered: event.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Cadastrada
                </label>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Último contato</label>
                  <input
                    type="date"
                    value={form.last_contact_at}
                    onChange={(event) => setForm({ ...form, last_contact_at: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-700">
                    <IconCalendarEvent size={14} />
                    Próximo follow-up
                  </label>
                  <input
                    type="date"
                    value={form.next_follow_up_at}
                    onChange={(event) => setForm({ ...form, next_follow_up_at: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Notas da prospecção</label>
                <textarea
                  value={form.notes}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Histórico de contato, objeções, interesse, próximos passos..."
                />
              </div>

              {form.stage === "perdida" || form.status === "perdido" ? (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Motivo de perda</label>
                  <input
                    value={form.lost_reason}
                    onChange={(event) => setForm({ ...form, lost_reason: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-2 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-gray-500">
                {form.banca_id ? (
                  <Link href={`/admin/bancas/${form.banca_id}` as Route} className="font-medium text-[#ff5c00] hover:underline">
                    Abrir cadastro da banca
                  </Link>
                ) : (
                  "Lead sem cadastro de banca vinculado"
                )}
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={submitForm}
                  disabled={saving}
                  className="rounded-lg bg-[#ff5c00] px-4 py-2 text-sm font-medium text-white hover:bg-[#e05400] disabled:opacity-60"
                >
                  {saving ? "Salvando..." : "Salvar no CRM"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  IconBook2,
  IconBuildingStore,
  IconChecklist,
  IconCoin,
  IconCompass,
  IconDeviceFloppy,
  IconDownload,
  IconEdit,
  IconHistory,
  IconMapPin,
  IconPlus,
  IconRocket,
  IconTargetArrow,
  IconTrash,
  IconUsersGroup,
} from "@tabler/icons-react";
import { useToast } from "@/components/admin/ToastProvider";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";
import {
  DEFAULT_COMMERCIAL_PLANNING_DOCUMENT,
  type CommercialPlanningDecisionEntry,
  type CommercialPlanningDevelopmentPhase,
  type CommercialPlanningDistributorModel,
  type CommercialPlanningDocument,
  type CommercialPlanningGlossaryEntry,
  type CommercialPlanningHypothesis,
  type CommercialPlanningHypothesisStatus,
  type CommercialPlanningPillar,
  type CommercialPlanningPlanArchitecture,
  type CommercialPlanningPlan,
  type CommercialPlanningTechnicalEpic,
  type CommercialPlanningTechnicalFlowStep,
  type CommercialPlanningValueProposition,
  type CommercialPlanningVersionEntry,
} from "@/lib/commercial-planning";

type Mode = "view" | "edit";

const HYPOTHESIS_STATUS_OPTIONS: Array<{
  value: CommercialPlanningHypothesisStatus;
  label: string;
  className: string;
}> = [
  { value: "to_validate", label: "A validar", className: "bg-gray-100 text-gray-700" },
  { value: "in_progress", label: "Em andamento", className: "bg-amber-50 text-amber-700" },
  { value: "validated", label: "Validada", className: "bg-emerald-50 text-emerald-700" },
  { value: "discarded", label: "Descartada", className: "bg-red-50 text-red-700" },
];

function listToTextarea(items: string[]) {
  return items.join("\n");
}

function textareaToList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDateTime(value: string | null) {
  if (!value) return "Ainda não salvo";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function formatDate(value: string) {
  if (!value) return "Sem data";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(date);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function hypothesisStatusLabel(status: CommercialPlanningHypothesisStatus) {
  return HYPOTHESIS_STATUS_OPTIONS.find((item) => item.value === status)?.label || "A validar";
}

function renderMarkdown(document: CommercialPlanningDocument) {
  const renderList = (items: string[]) => items.map((item) => `- ${item}`).join("\n");

  const renderPlans = document.bancaPlans
    .map(
      (plan) =>
        `### ${plan.name}\nPreço: ${plan.price}\nDestaque: ${plan.highlight}\n${renderList(plan.items)}`
    )
    .join("\n\n");

  const renderDistributorModels = document.distributorModels
    .map(
      (model) =>
        `### ${model.title}\n${model.description}\n${renderList(model.items)}`
    )
    .join("\n\n");

  const renderPillars = document.monetizationPillars
    .map((pillar) => `### ${pillar.title}\n${pillar.description}`)
    .join("\n\n");

  const renderValueProposition = `### Mensagem central\n${document.valueProposition.headline}\n\n### Para jornaleiros\n${document.valueProposition.jornaleiro}\n\n### Para distribuidores\n${document.valueProposition.distribuidor}\n\n### Para o mercado\n${document.valueProposition.mercado}`;

  const renderPlanArchitecture = `### Papel do Free\n${document.planArchitecture.freeRole}\n\n### Papel do Start\n${document.planArchitecture.startRole}\n\n### Papel do Premium\n${document.planArchitecture.premiumRole}\n\n### Regra do catálogo parceiro\n${document.planArchitecture.partnerCatalogRule}\n\n### Gatilhos de upgrade\n${renderList(
    document.planArchitecture.upgradeTriggers
  )}\n\n### Princípios do onboarding\n${renderList(
    document.planArchitecture.onboardingPrinciples
  )}\n\n### Princípios de cobrança\n${renderList(document.planArchitecture.billingPrinciples)}`;

  const renderTechnicalFlow = document.technicalBacklog.recommendedFlow
    .map(
      (step) => `### ${step.title}\nObjetivo: ${step.goal}\n${renderList(step.items)}`
    )
    .join("\n\n");

  const renderTechnicalEpics = document.technicalBacklog.epics
    .map(
      (epic) =>
        `### ${epic.title}\nObjetivo: ${epic.objective}\nRotas impactadas:\n${renderList(
          epic.routes
        )}\nTabelas impactadas:\n${renderList(epic.tables)}\nEntregas:\n${renderList(
          epic.items
        )}\nDependências:\n${renderList(epic.dependencies)}`
    )
    .join("\n\n");

  const renderDevelopmentPhases = document.technicalBacklog.developmentPhases
    .map(
      (phase) =>
        `### ${phase.name}\nResultado esperado: ${phase.outcome}\n${renderList(phase.items)}`
    )
    .join("\n\n");

  const renderGlossary = document.glossary
    .map((entry) => `- **${entry.term}**: ${entry.meaning}`)
    .join("\n");

  const renderHypotheses = document.validationHypotheses
    .map(
      (item) =>
        `- **${item.statement}**\n  - Status: ${hypothesisStatusLabel(item.status)}\n  - Responsável: ${
          item.owner || "Não definido"
        }\n  - Data-alvo: ${item.targetDate || "Não definida"}`
    )
    .join("\n");

  const renderDecisions = document.decisions
    .map(
      (item) =>
        `### ${item.title}\nDecisão: ${item.decision}\nJustificativa: ${item.rationale}\nResponsável: ${
          item.owner || "Não definido"
        }\nData: ${item.decisionDate || "Não definida"}`
    )
    .join("\n\n");

  return `# Planejamento Comercial

## Resumo da tese atual
${document.summary}

## Direção recomendada
${document.positioning}

## O que a plataforma é
${document.platformIs}

## O que a plataforma não deve ser
${document.platformIsNot}

## Proposta de valor
${renderValueProposition}

## Arquitetura dos planos
${renderPlanArchitecture}

## Backlog técnico de produto
### Resumo
${document.technicalBacklog.summary}

### Inconsistências críticas
${renderList(document.technicalBacklog.criticalInconsistencies)}

### Fluxo recomendado
${renderTechnicalFlow}

### Épicos de implementação
${renderTechnicalEpics}

### Ordem de desenvolvimento
${renderDevelopmentPhases}

## Papel de São Paulo
${document.saoPauloRole}

## Pilares de monetização
${renderPillars}

## Planos das bancas
${renderPlans}

## Modelo para distribuidores
${renderDistributorModels}

## Decisões tomadas
${renderDecisions}

## Hipóteses para validar
${renderHypotheses}

## Glossário
${renderGlossary}

## Próximos passos
${renderList(document.nextSteps)}

## Perguntas abertas
${renderList(document.openQuestions)}

## Notas do dia
${document.dailyNotes}
`;
}

function renderPrintableHtml(document: CommercialPlanningDocument) {
  const renderPillars = document.monetizationPillars
    .map(
      (item) =>
        `<div class="card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></div>`
    )
    .join("");

  const renderPlans = document.bancaPlans
    .map(
      (plan) =>
        `<div class="card"><h3>${escapeHtml(plan.name)}</h3><p><strong>${escapeHtml(
          plan.price
        )}</strong> · ${escapeHtml(plan.highlight)}</p><ul>${plan.items
          .map((item) => `<li>${escapeHtml(item)}</li>`)
          .join("")}</ul></div>`
    )
    .join("");

  const renderDistributorModels = document.distributorModels
    .map(
      (item) =>
        `<div class="card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(
          item.description
        )}</p><ul>${item.items.map((subItem) => `<li>${escapeHtml(subItem)}</li>`).join("")}</ul></div>`
    )
    .join("");

  const renderDecisions = document.decisions
    .map(
      (item) =>
        `<div class="card"><h3>${escapeHtml(item.title)}</h3><p><strong>Decisão:</strong> ${escapeHtml(
          item.decision
        )}</p><p><strong>Justificativa:</strong> ${escapeHtml(item.rationale)}</p><p><strong>Responsável:</strong> ${escapeHtml(
          item.owner || "Não definido"
        )}</p><p><strong>Data:</strong> ${escapeHtml(item.decisionDate || "Não definida")}</p></div>`
    )
    .join("");

  const renderHypotheses = document.validationHypotheses
    .map(
      (item) =>
        `<div class="card"><h3>${escapeHtml(item.statement)}</h3><p><strong>Status:</strong> ${escapeHtml(
          hypothesisStatusLabel(item.status)
        )}</p><p><strong>Responsável:</strong> ${escapeHtml(item.owner || "Não definido")}</p><p><strong>Data-alvo:</strong> ${escapeHtml(
          item.targetDate || "Não definida"
        )}</p></div>`
    )
    .join("");

  const renderGlossary = document.glossary
    .map(
      (item) =>
        `<div class="card"><h3>${escapeHtml(item.term)}</h3><p>${escapeHtml(item.meaning)}</p></div>`
    )
    .join("");

  const renderTechnicalFlow = document.technicalBacklog.recommendedFlow
    .map(
      (item) =>
        `<div class="card"><h3>${escapeHtml(item.title)}</h3><p><strong>Objetivo:</strong> ${escapeHtml(
          item.goal
        )}</p><ul>${item.items.map((subItem) => `<li>${escapeHtml(subItem)}</li>`).join("")}</ul></div>`
    )
    .join("");

  const renderTechnicalEpics = document.technicalBacklog.epics
    .map(
      (item) =>
        `<div class="card"><h3>${escapeHtml(item.title)}</h3><p><strong>Objetivo:</strong> ${escapeHtml(
          item.objective
        )}</p><p><strong>Rotas:</strong> ${escapeHtml(item.routes.join(" · ") || "Nenhuma")}</p><p><strong>Tabelas:</strong> ${escapeHtml(
          item.tables.join(" · ") || "Nenhuma"
        )}</p><p><strong>Dependências:</strong> ${escapeHtml(
          item.dependencies.join(" · ") || "Nenhuma"
        )}</p><ul>${item.items.map((subItem) => `<li>${escapeHtml(subItem)}</li>`).join("")}</ul></div>`
    )
    .join("");

  const renderDevelopmentPhases = document.technicalBacklog.developmentPhases
    .map(
      (item) =>
        `<div class="card"><h3>${escapeHtml(item.name)}</h3><p><strong>Resultado:</strong> ${escapeHtml(
          item.outcome
        )}</p><ul>${item.items.map((subItem) => `<li>${escapeHtml(subItem)}</li>`).join("")}</ul></div>`
    )
    .join("");

  const renderList = (items: string[]) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Planejamento Comercial</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111827; margin: 32px; }
    h1 { font-size: 28px; margin-bottom: 8px; }
    h2 { font-size: 18px; margin-top: 28px; margin-bottom: 12px; color: #ff5c00; }
    h3 { font-size: 15px; margin-bottom: 8px; }
    p, li { font-size: 13px; line-height: 1.65; }
    .muted { color: #6b7280; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
    .card { border: 1px solid #e5e7eb; border-radius: 14px; padding: 14px; background: #f9fafb; break-inside: avoid; }
    @media print {
      body { margin: 20px; }
    }
  </style>
</head>
<body>
  <h1>Planejamento Comercial</h1>
  <p class="muted">Documento interno de estratégia e validação do negócio.</p>

  <h2>Resumo da tese atual</h2>
  <p>${escapeHtml(document.summary)}</p>

  <h2>Direção recomendada</h2>
  <p>${escapeHtml(document.positioning)}</p>

  <div class="grid">
    <div class="card">
      <h3>O que a plataforma é</h3>
      <p>${escapeHtml(document.platformIs)}</p>
    </div>
    <div class="card">
      <h3>O que a plataforma não deve ser</h3>
      <p>${escapeHtml(document.platformIsNot)}</p>
    </div>
  </div>

  <h2>Proposta de valor</h2>
  <div class="grid">
    <div class="card">
      <h3>Mensagem central</h3>
      <p>${escapeHtml(document.valueProposition.headline)}</p>
    </div>
    <div class="card">
      <h3>Para jornaleiros</h3>
      <p>${escapeHtml(document.valueProposition.jornaleiro)}</p>
    </div>
    <div class="card">
      <h3>Para distribuidores</h3>
      <p>${escapeHtml(document.valueProposition.distribuidor)}</p>
    </div>
    <div class="card">
      <h3>Para o mercado</h3>
      <p>${escapeHtml(document.valueProposition.mercado)}</p>
    </div>
  </div>

  <h2>Arquitetura dos planos</h2>
  <div class="grid">
    <div class="card">
      <h3>Papel do Free</h3>
      <p>${escapeHtml(document.planArchitecture.freeRole)}</p>
    </div>
    <div class="card">
      <h3>Papel do Start</h3>
      <p>${escapeHtml(document.planArchitecture.startRole)}</p>
    </div>
    <div class="card">
      <h3>Papel do Premium</h3>
      <p>${escapeHtml(document.planArchitecture.premiumRole)}</p>
    </div>
    <div class="card">
      <h3>Regra do catálogo parceiro</h3>
      <p>${escapeHtml(document.planArchitecture.partnerCatalogRule)}</p>
    </div>
  </div>

  <div class="grid" style="margin-top: 12px;">
    <div class="card">
      <h3>Gatilhos de upgrade</h3>
      ${renderList(document.planArchitecture.upgradeTriggers)}
    </div>
    <div class="card">
      <h3>Princípios do onboarding</h3>
      ${renderList(document.planArchitecture.onboardingPrinciples)}
    </div>
  </div>

  <div class="card" style="margin-top: 12px;">
    <h3>Princípios de cobrança</h3>
    ${renderList(document.planArchitecture.billingPrinciples)}
  </div>

  <h2>Backlog técnico de produto</h2>
  <div class="card">
    <h3>Resumo</h3>
    <p>${escapeHtml(document.technicalBacklog.summary)}</p>
  </div>

  <div class="card" style="margin-top: 12px;">
    <h3>Inconsistências críticas</h3>
    ${renderList(document.technicalBacklog.criticalInconsistencies)}
  </div>

  <div class="grid" style="margin-top: 12px;">
    ${renderTechnicalFlow}
  </div>

  <div class="grid" style="margin-top: 12px;">
    ${renderTechnicalEpics}
  </div>

  <div class="grid" style="margin-top: 12px;">
    ${renderDevelopmentPhases}
  </div>

  <h2>Papel de São Paulo</h2>
  <p>${escapeHtml(document.saoPauloRole)}</p>

  <h2>Pilares de monetização</h2>
  <div class="grid-3">${renderPillars}</div>

  <h2>Planos das bancas</h2>
  <div class="grid-3">${renderPlans}</div>

  <h2>Modelo para distribuidores</h2>
  <div class="grid-3">${renderDistributorModels}</div>

  <h2>Decisões tomadas</h2>
  <div class="grid">${renderDecisions}</div>

  <h2>Hipóteses para validar</h2>
  <div class="grid">${renderHypotheses}</div>

  <h2>Glossário</h2>
  <div class="grid">${renderGlossary}</div>

  <h2>Próximos passos</h2>
  ${renderList(document.nextSteps)}

  <h2>Perguntas abertas</h2>
  ${renderList(document.openQuestions)}

  <h2>Notas do dia</h2>
  <p>${escapeHtml(document.dailyNotes)}</p>
</body>
</html>`;
}

const emptyPillar = (): CommercialPlanningPillar => ({ title: "", description: "" });
const emptyPlan = (): CommercialPlanningPlan => ({ name: "", price: "", highlight: "", items: [] });
const emptyDistributorModel = (): CommercialPlanningDistributorModel => ({ title: "", description: "", items: [] });
const emptyTechnicalFlowStep = (): CommercialPlanningTechnicalFlowStep => ({ title: "", goal: "", items: [] });
const emptyTechnicalEpic = (): CommercialPlanningTechnicalEpic => ({
  title: "",
  objective: "",
  routes: [],
  tables: [],
  items: [],
  dependencies: [],
});
const emptyDevelopmentPhase = (): CommercialPlanningDevelopmentPhase => ({
  name: "",
  outcome: "",
  items: [],
});
const emptyGlossaryEntry = (): CommercialPlanningGlossaryEntry => ({ term: "", meaning: "" });
const emptyHypothesis = (): CommercialPlanningHypothesis => ({
  statement: "",
  owner: "",
  targetDate: "",
  status: "to_validate",
});
const emptyDecision = (): CommercialPlanningDecisionEntry => ({
  title: "",
  decision: "",
  rationale: "",
  owner: "",
  decisionDate: "",
});

type ValuePropositionField = keyof CommercialPlanningValueProposition;
type PlanArchitectureField = keyof Omit<
  CommercialPlanningPlanArchitecture,
  "upgradeTriggers" | "onboardingPrinciples" | "billingPrinciples"
>;

export default function CommercialPlanningEditor() {
  const toast = useToast();
  const [mode, setMode] = useState<Mode>("view");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [history, setHistory] = useState<CommercialPlanningVersionEntry[]>([]);
  const [document, setDocument] = useState<CommercialPlanningDocument>(DEFAULT_COMMERCIAL_PLANNING_DOCUMENT);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        const response = await fetchAdminWithDevFallback("/api/admin/planejamento-comercial", {
          cache: "no-store",
        });
        const json = await response.json();
        if (!response.ok || !json?.success) {
          throw new Error(json?.error || "Erro ao carregar documento");
        }
        if (!active) return;
        setDocument(json.data || DEFAULT_COMMERCIAL_PLANNING_DOCUMENT);
        setHistory(Array.isArray(json.history) ? json.history : []);
        setLastSavedAt(json.updatedAt || null);
      } catch (error: any) {
        if (!active) return;
        toast.error(error?.message || "Erro ao carregar planejamento comercial");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [toast]);

  const canSave = useMemo(() => !loading && !saving, [loading, saving]);

  const saveDocument = async () => {
    try {
      setSaving(true);
      const response = await fetchAdminWithDevFallback("/api/admin/planejamento-comercial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document }),
      });
      const json = await response.json();
      if (!response.ok || !json?.success) {
        throw new Error(json?.error || "Erro ao salvar documento");
      }
      setDocument(json.data || document);
      setHistory(Array.isArray(json.history) ? json.history : []);
      setLastSavedAt(json.updatedAt || new Date().toISOString());
      setMode("view");
      toast.success("Planejamento comercial salvo com sucesso");
    } catch (error: any) {
      toast.error(error?.message || "Erro ao salvar planejamento comercial");
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof CommercialPlanningDocument>(key: K, value: CommercialPlanningDocument[K]) => {
    setDocument((prev) => ({ ...prev, [key]: value }));
  };

  const updateValueProposition = (key: ValuePropositionField, value: string) => {
    setDocument((prev) => ({
      ...prev,
      valueProposition: {
        ...prev.valueProposition,
        [key]: value,
      },
    }));
  };

  const updatePlanArchitectureField = (key: PlanArchitectureField, value: string) => {
    setDocument((prev) => ({
      ...prev,
      planArchitecture: {
        ...prev.planArchitecture,
        [key]: value,
      },
    }));
  };

  const updatePillar = (index: number, patch: Partial<CommercialPlanningPillar>) => {
    setDocument((prev) => ({
      ...prev,
      monetizationPillars: prev.monetizationPillars.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));
  };

  const updatePlan = (index: number, patch: Partial<CommercialPlanningPlan>) => {
    setDocument((prev) => ({
      ...prev,
      bancaPlans: prev.bancaPlans.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  };

  const updateDistributorModel = (index: number, patch: Partial<CommercialPlanningDistributorModel>) => {
    setDocument((prev) => ({
      ...prev,
      distributorModels: prev.distributorModels.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));
  };

  const updateTechnicalFlowStep = (index: number, patch: Partial<CommercialPlanningTechnicalFlowStep>) => {
    setDocument((prev) => ({
      ...prev,
      technicalBacklog: {
        ...prev.technicalBacklog,
        recommendedFlow: prev.technicalBacklog.recommendedFlow.map((item, itemIndex) =>
          itemIndex === index ? { ...item, ...patch } : item
        ),
      },
    }));
  };

  const updateTechnicalEpic = (index: number, patch: Partial<CommercialPlanningTechnicalEpic>) => {
    setDocument((prev) => ({
      ...prev,
      technicalBacklog: {
        ...prev.technicalBacklog,
        epics: prev.technicalBacklog.epics.map((item, itemIndex) =>
          itemIndex === index ? { ...item, ...patch } : item
        ),
      },
    }));
  };

  const updateDevelopmentPhase = (index: number, patch: Partial<CommercialPlanningDevelopmentPhase>) => {
    setDocument((prev) => ({
      ...prev,
      technicalBacklog: {
        ...prev.technicalBacklog,
        developmentPhases: prev.technicalBacklog.developmentPhases.map((item, itemIndex) =>
          itemIndex === index ? { ...item, ...patch } : item
        ),
      },
    }));
  };

  const updateGlossaryEntry = (index: number, patch: Partial<CommercialPlanningGlossaryEntry>) => {
    setDocument((prev) => ({
      ...prev,
      glossary: prev.glossary.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  };

  const updateHypothesis = (index: number, patch: Partial<CommercialPlanningHypothesis>) => {
    setDocument((prev) => ({
      ...prev,
      validationHypotheses: prev.validationHypotheses.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));
  };

  const updateDecision = (index: number, patch: Partial<CommercialPlanningDecisionEntry>) => {
    setDocument((prev) => ({
      ...prev,
      decisions: prev.decisions.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  };

  const exportMarkdown = () => {
    const blob = new Blob([renderMarkdown(document)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = documentRef("a");
    link.href = url;
    link.download = "planejamento-comercial.md";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const popup = window.open("", "_blank", "noopener,noreferrer");
    if (!popup) {
      toast.error("Não foi possível abrir a janela de impressão");
      return;
    }
    popup.document.open();
    popup.document.write(renderPrintableHtml(document));
    popup.document.close();
    popup.focus();
    setTimeout(() => popup.print(), 300);
  };

  const loadVersionIntoEditor = (version: CommercialPlanningVersionEntry) => {
    setDocument(version.document);
    setMode("edit");
    toast.success("Versão carregada no editor. Salve o documento para restaurá-la.");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-14 w-72 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
        <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fff3ec] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#ff5c00]">
              <IconBook2 size={14} />
              Documento Vivo
            </div>
            <h1 className="mt-4 flex items-center gap-3 text-3xl font-bold text-gray-900">
              <IconCompass size={30} className="text-[#ff5c00]" />
              Planejamento Comercial
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Documento estratégico interno para registrar tese do negócio, monetização, packaging,
              hipóteses, decisões, glossário e aprendizados operacionais da plataforma.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <div className="rounded-2xl border border-dashed border-[#ffd3bd] bg-[#fff8f4] px-4 py-3 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">Última atualização</p>
              <p className="mt-1">{formatDateTime(lastSavedAt)}</p>
              <p className="mt-1 text-xs text-gray-500">Histórico mantido com as 20 versões mais recentes.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMode("view")}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  mode === "view" ? "bg-gray-900 text-white" : "border border-gray-300 bg-white text-gray-700"
                }`}
              >
                Modo leitura
              </button>
              <button
                type="button"
                onClick={() => setMode("edit")}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  mode === "edit" ? "bg-[#ff5c00] text-white" : "border border-gray-300 bg-white text-gray-700"
                }`}
              >
                <IconEdit size={16} />
                Editar
              </button>
              <button
                type="button"
                onClick={exportMarkdown}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
              >
                <IconDownload size={16} />
                Markdown
              </button>
              <button
                type="button"
                onClick={exportPdf}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
              >
                <IconDownload size={16} />
                PDF
              </button>
              {mode === "edit" && (
                <button
                  type="button"
                  onClick={saveDocument}
                  disabled={!canSave}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <IconDeviceFloppy size={16} />
                  {saving ? "Salvando..." : "Salvar documento"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {mode === "view" ? (
        <>
          <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                  <IconTargetArrow size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Resumo estratégico</h2>
                  <p className="text-sm text-gray-500">Tese central e posicionamento</p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-gray-200 bg-[#fffaf7] p-4">
                <p className="text-sm font-semibold text-gray-900">Resumo da tese atual</p>
                <p className="mt-2 text-sm leading-7 text-gray-700">{document.summary}</p>
              </div>

              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-900">Direção recomendada</p>
                <p className="mt-2 text-sm leading-7 text-gray-700">{document.positioning}</p>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-900">O que a plataforma é</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{document.platformIs}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-900">O que a plataforma não deve ser</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{document.platformIsNot}</p>
                </div>
              </div>
            </article>

            <div className="space-y-4">
              <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                    <IconMapPin size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Papel de São Paulo</h2>
                    <p className="text-sm text-gray-500">Laboratório comercial</p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-600">{document.saoPauloRole}</p>
              </article>

              <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                    <IconHistory size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Histórico de versões</h2>
                    <p className="text-sm text-gray-500">Recuperação rápida de snapshots</p>
                  </div>
                </div>

                {history.length === 0 ? (
                  <p className="mt-4 text-sm text-gray-500">Nenhuma versão anterior registrada ainda.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {history.map((version) => (
                      <div key={version.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                          {formatDateTime(version.savedAt)}
                        </p>
                        <p className="mt-2 text-sm text-gray-700">{version.summary}</p>
                        <button
                          type="button"
                          onClick={() => loadVersionIntoEditor(version)}
                          className="mt-3 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700"
                        >
                          Carregar no editor
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#fff3ec] p-3 text-[#ff5c00]">
                <IconTargetArrow size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Proposta de Valor</h2>
                <p className="text-sm text-gray-500">Mensagem-base para jornaleiros, distribuidores e mercado</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[#ffd8c2] bg-[#fff8f4] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ff5c00]">
                Mensagem central
              </p>
              <p className="mt-2 text-base leading-7 text-gray-800">{document.valueProposition.headline}</p>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-3">
              <article className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Para jornaleiros</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{document.valueProposition.jornaleiro}</p>
              </article>
              <article className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Para distribuidores</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{document.valueProposition.distribuidor}</p>
              </article>
              <article className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Para o mercado</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{document.valueProposition.mercado}</p>
              </article>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
                <IconBuildingStore size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Arquitetura dos Planos</h2>
                <p className="text-sm text-gray-500">Papel de cada plano, upgrade e lógica de onboarding</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-3">
              <article className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Papel do Free</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{document.planArchitecture.freeRole}</p>
              </article>
              <article className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Papel do Start</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{document.planArchitecture.startRole}</p>
              </article>
              <article className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Papel do Premium</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{document.planArchitecture.premiumRole}</p>
              </article>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 bg-[#faf7ff] p-4">
              <h3 className="font-semibold text-gray-900">Regra do catálogo parceiro</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{document.planArchitecture.partnerCatalogRule}</p>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-3">
              <article className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Gatilhos de upgrade</h3>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  {document.planArchitecture.upgradeTriggers.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
              <article className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Princípios do onboarding</h3>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  {document.planArchitecture.onboardingPrinciples.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
              <article className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Princípios de cobrança</h3>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  {document.planArchitecture.billingPrinciples.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-sky-50 p-3 text-sky-700">
                <IconChecklist size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Backlog técnico de produto</h2>
                <p className="text-sm text-gray-500">Fluxo recomendado, inconsistências, épicos e ordem de desenvolvimento</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">Resumo</p>
              <p className="mt-2 text-sm leading-7 text-gray-700">{document.technicalBacklog.summary}</p>
            </div>

            <div className="mt-5 rounded-xl border border-red-100 bg-red-50/60 p-4">
              <h3 className="font-semibold text-gray-900">Inconsistências críticas</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                {document.technicalBacklog.criticalInconsistencies.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              {document.technicalBacklog.recommendedFlow.map((step) => (
                <article key={`${step.title}-${step.goal}`} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{step.goal}</p>
                  <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    {step.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              {document.technicalBacklog.epics.map((epic) => (
                <article key={`${epic.title}-${epic.objective}`} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{epic.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-gray-600">{epic.objective}</p>
                      <ul className="mt-4 space-y-2 text-sm text-gray-600">
                        {epic.items.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#ff5c00]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-xl border border-gray-200 bg-white p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Rotas impactadas</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {epic.routes.map((route) => (
                            <span key={route} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                              {route}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-xl border border-gray-200 bg-white p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Tabelas impactadas</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {epic.tables.map((table) => (
                            <span key={table} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                              {table}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-xl border border-gray-200 bg-white p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Dependências</p>
                        <ul className="mt-2 space-y-2 text-sm text-gray-600">
                          {epic.dependencies.map((dependency) => (
                            <li key={dependency} className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                              <span>{dependency}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {document.technicalBacklog.developmentPhases.map((phase) => (
                <article key={`${phase.name}-${phase.outcome}`} className="rounded-xl border border-gray-200 bg-[#fffaf7] p-4">
                  <h3 className="font-semibold text-gray-900">{phase.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{phase.outcome}</p>
                  <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#ff5c00]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                <IconCoin size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Pilares de monetização</h2>
                <p className="text-sm text-gray-500">Modelo recomendado para o negócio</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {document.monetizationPillars.map((pillar) => (
                <article key={`${pillar.title}-${pillar.description}`} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-900">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{pillar.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#fff3ec] p-3 text-[#ff5c00]">
                <IconBuildingStore size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Planos sugeridos para bancas</h2>
                <p className="text-sm text-gray-500">Estrutura inicial de packaging e preço</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-3">
              {document.bancaPlans.map((plan) => (
                <article key={`${plan.name}-${plan.price}`} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                      <p className="mt-1 text-sm font-medium text-[#ff5c00]">{plan.highlight}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                      {plan.price}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#ff5c00]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-50 p-3 text-purple-700">
                <IconUsersGroup size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Modelo para distribuidores</h2>
                <p className="text-sm text-gray-500">Como estruturar a frente B2B da rede</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {document.distributorModels.map((plan) => (
                <article key={`${plan.title}-${plan.description}`} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-900">{plan.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{plan.description}</p>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-green-50 p-3 text-green-700">
                  <IconChecklist size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Hipóteses para validar</h2>
                  <p className="text-sm text-gray-500">Com dono, status e data-alvo</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {document.validationHypotheses.map((item) => {
                  const statusClass =
                    HYPOTHESIS_STATUS_OPTIONS.find((option) => option.value === item.status)?.className ||
                    "bg-gray-100 text-gray-700";

                  return (
                    <div key={`${item.statement}-${item.owner}-${item.targetDate}`} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-sm font-medium text-gray-900">{item.statement}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        <span className={`rounded-full px-2.5 py-1 font-medium ${statusClass}`}>
                          {hypothesisStatusLabel(item.status)}
                        </span>
                        <span className="rounded-full bg-white px-2.5 py-1 text-gray-600">
                          Responsável: {item.owner || "Não definido"}
                        </span>
                        <span className="rounded-full bg-white px-2.5 py-1 text-gray-600">
                          Data-alvo: {item.targetDate ? formatDate(item.targetDate) : "Não definida"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                  <IconRocket size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Decisões tomadas</h2>
                  <p className="text-sm text-gray-500">Registro das decisões do negócio</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {document.decisions.map((decision) => (
                  <div key={`${decision.title}-${decision.decision}`} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <h3 className="font-semibold text-gray-900">{decision.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{decision.decision}</p>
                    {decision.rationale && (
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        <span className="font-medium text-gray-900">Justificativa:</span> {decision.rationale}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-white px-2.5 py-1 text-gray-600">
                        Responsável: {decision.owner || "Não definido"}
                      </span>
                      <span className="rounded-full bg-white px-2.5 py-1 text-gray-600">
                        Data: {decision.decisionDate ? formatDate(decision.decisionDate) : "Não definida"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                  <IconBook2 size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Glossário do negócio</h2>
                  <p className="text-sm text-gray-500">Termos-chave para alinhar decisões futuras</p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {document.glossary.map((entry) => (
                  <div key={`${entry.term}-${entry.meaning}`} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <h3 className="font-semibold text-gray-900">{entry.term}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{entry.meaning}</p>
                  </div>
                ))}
              </div>
            </article>

            <div className="space-y-4">
              <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Próximos passos</h2>
                <ol className="mt-5 space-y-3">
                  {document.nextSteps.map((step, index) => (
                    <li key={step} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#ff5c00] text-xs font-semibold text-white">
                        {index + 1}
                      </span>
                      <span className="text-sm leading-6 text-gray-600">{step}</span>
                    </li>
                  ))}
                </ol>
              </article>

              <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Perguntas abertas</h2>
                <ul className="mt-4 space-y-3">
                  {document.openQuestions.map((question) => (
                    <li key={question} className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm leading-6 text-gray-600">
                      {question}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Notas do dia</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-600">{document.dailyNotes}</p>
          </section>
        </>
      ) : (
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Resumo estratégico</h2>
            <div className="mt-4 grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Resumo da tese atual</label>
                <textarea
                  value={document.summary}
                  onChange={(event) => updateField("summary", event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Direção recomendada</label>
                <textarea
                  value={document.positioning}
                  onChange={(event) => updateField("positioning", event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                />
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">O que a plataforma é</label>
                  <textarea
                    value={document.platformIs}
                    onChange={(event) => updateField("platformIs", event.target.value)}
                    rows={5}
                    className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">O que a plataforma não deve ser</label>
                  <textarea
                    value={document.platformIsNot}
                    onChange={(event) => updateField("platformIsNot", event.target.value)}
                    rows={5}
                    className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Papel de São Paulo</label>
                <textarea
                  value={document.saoPauloRole}
                  onChange={(event) => updateField("saoPauloRole", event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Proposta de Valor</h2>
            <div className="mt-4 grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mensagem central</label>
                <textarea
                  value={document.valueProposition.headline}
                  onChange={(event) => updateValueProposition("headline", event.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                />
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Para jornaleiros</label>
                  <textarea
                    value={document.valueProposition.jornaleiro}
                    onChange={(event) => updateValueProposition("jornaleiro", event.target.value)}
                    rows={5}
                    className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Para distribuidores</label>
                  <textarea
                    value={document.valueProposition.distribuidor}
                    onChange={(event) => updateValueProposition("distribuidor", event.target.value)}
                    rows={5}
                    className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Para o mercado</label>
                  <textarea
                    value={document.valueProposition.mercado}
                    onChange={(event) => updateValueProposition("mercado", event.target.value)}
                    rows={5}
                    className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Arquitetura dos Planos</h2>
            <div className="mt-4 grid gap-4">
              <div className="grid gap-4 lg:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Papel do Free</label>
                  <textarea
                    value={document.planArchitecture.freeRole}
                    onChange={(event) => updatePlanArchitectureField("freeRole", event.target.value)}
                    rows={5}
                    className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Papel do Start</label>
                  <textarea
                    value={document.planArchitecture.startRole}
                    onChange={(event) => updatePlanArchitectureField("startRole", event.target.value)}
                    rows={5}
                    className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Papel do Premium</label>
                  <textarea
                    value={document.planArchitecture.premiumRole}
                    onChange={(event) => updatePlanArchitectureField("premiumRole", event.target.value)}
                    rows={5}
                    className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Regra do catálogo parceiro</label>
                <textarea
                  value={document.planArchitecture.partnerCatalogRule}
                  onChange={(event) => updatePlanArchitectureField("partnerCatalogRule", event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gatilhos de upgrade</label>
                  <p className="mt-1 text-sm text-gray-500">Um por linha</p>
                  <textarea
                    value={listToTextarea(document.planArchitecture.upgradeTriggers)}
                    onChange={(event) =>
                      setDocument((prev) => ({
                        ...prev,
                        planArchitecture: {
                          ...prev.planArchitecture,
                          upgradeTriggers: textareaToList(event.target.value),
                        },
                      }))
                    }
                    rows={7}
                    className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Princípios do onboarding</label>
                  <p className="mt-1 text-sm text-gray-500">Um por linha</p>
                  <textarea
                    value={listToTextarea(document.planArchitecture.onboardingPrinciples)}
                    onChange={(event) =>
                      setDocument((prev) => ({
                        ...prev,
                        planArchitecture: {
                          ...prev.planArchitecture,
                          onboardingPrinciples: textareaToList(event.target.value),
                        },
                      }))
                    }
                    rows={7}
                    className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Princípios de cobrança</label>
                  <p className="mt-1 text-sm text-gray-500">Um por linha</p>
                  <textarea
                    value={listToTextarea(document.planArchitecture.billingPrinciples)}
                    onChange={(event) =>
                      setDocument((prev) => ({
                        ...prev,
                        planArchitecture: {
                          ...prev.planArchitecture,
                          billingPrinciples: textareaToList(event.target.value),
                        },
                      }))
                    }
                    rows={7}
                    className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Backlog técnico de produto</h2>
                <p className="mt-1 text-sm text-gray-500">Fluxo, épicos, tabelas, rotas e ordem de implementação</p>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Resumo técnico</label>
                <textarea
                  value={document.technicalBacklog.summary}
                  onChange={(event) =>
                    setDocument((prev) => ({
                      ...prev,
                      technicalBacklog: {
                        ...prev.technicalBacklog,
                        summary: event.target.value,
                      },
                    }))
                  }
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Inconsistências críticas</label>
                <p className="mt-1 text-sm text-gray-500">Uma por linha</p>
                <textarea
                  value={listToTextarea(document.technicalBacklog.criticalInconsistencies)}
                  onChange={(event) =>
                    setDocument((prev) => ({
                      ...prev,
                      technicalBacklog: {
                        ...prev.technicalBacklog,
                        criticalInconsistencies: textareaToList(event.target.value),
                      },
                    }))
                  }
                  rows={8}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                />
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-gray-900">Fluxo recomendado</h3>
                <button
                  type="button"
                  onClick={() =>
                    setDocument((prev) => ({
                      ...prev,
                      technicalBacklog: {
                        ...prev.technicalBacklog,
                        recommendedFlow: [...prev.technicalBacklog.recommendedFlow, emptyTechnicalFlowStep()],
                      },
                    }))
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
                >
                  <IconPlus size={16} />
                  Adicionar etapa
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {document.technicalBacklog.recommendedFlow.map((step, index) => (
                  <div key={`flow-step-${index}`} className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
                      <input
                        value={step.title}
                        onChange={(event) => updateTechnicalFlowStep(index, { title: event.target.value })}
                        placeholder="Título da etapa"
                        className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                      />
                      <input
                        value={step.goal}
                        onChange={(event) => updateTechnicalFlowStep(index, { goal: event.target.value })}
                        placeholder="Objetivo"
                        className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setDocument((prev) => ({
                            ...prev,
                            technicalBacklog: {
                              ...prev.technicalBacklog,
                              recommendedFlow: prev.technicalBacklog.recommendedFlow.filter(
                                (_, itemIndex) => itemIndex !== index
                              ),
                            },
                          }))
                        }
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 text-sm font-medium text-red-600"
                      >
                        <IconTrash size={16} />
                        Remover
                      </button>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Itens da etapa, um por linha</label>
                      <textarea
                        value={listToTextarea(step.items)}
                        onChange={(event) => updateTechnicalFlowStep(index, { items: textareaToList(event.target.value) })}
                        rows={4}
                        className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-gray-900">Épicos de implementação</h3>
                <button
                  type="button"
                  onClick={() =>
                    setDocument((prev) => ({
                      ...prev,
                      technicalBacklog: {
                        ...prev.technicalBacklog,
                        epics: [...prev.technicalBacklog.epics, emptyTechnicalEpic()],
                      },
                    }))
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
                >
                  <IconPlus size={16} />
                  Adicionar épico
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {document.technicalBacklog.epics.map((epic, index) => (
                  <div key={`epic-${index}`} className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                      <div className="grid gap-4">
                        <input
                          value={epic.title}
                          onChange={(event) => updateTechnicalEpic(index, { title: event.target.value })}
                          placeholder="Título do épico"
                          className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                        />
                        <textarea
                          value={epic.objective}
                          onChange={(event) => updateTechnicalEpic(index, { objective: event.target.value })}
                          rows={3}
                          placeholder="Objetivo"
                          className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setDocument((prev) => ({
                            ...prev,
                            technicalBacklog: {
                              ...prev.technicalBacklog,
                              epics: prev.technicalBacklog.epics.filter((_, itemIndex) => itemIndex !== index),
                            },
                          }))
                        }
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 text-sm font-medium text-red-600"
                      >
                        <IconTrash size={16} />
                        Remover
                      </button>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Rotas impactadas</label>
                        <p className="mt-1 text-sm text-gray-500">Uma por linha</p>
                        <textarea
                          value={listToTextarea(epic.routes)}
                          onChange={(event) => updateTechnicalEpic(index, { routes: textareaToList(event.target.value) })}
                          rows={5}
                          className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tabelas impactadas</label>
                        <p className="mt-1 text-sm text-gray-500">Uma por linha</p>
                        <textarea
                          value={listToTextarea(epic.tables)}
                          onChange={(event) => updateTechnicalEpic(index, { tables: textareaToList(event.target.value) })}
                          rows={5}
                          className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Entregas do épico</label>
                        <p className="mt-1 text-sm text-gray-500">Uma por linha</p>
                        <textarea
                          value={listToTextarea(epic.items)}
                          onChange={(event) => updateTechnicalEpic(index, { items: textareaToList(event.target.value) })}
                          rows={6}
                          className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Dependências</label>
                        <p className="mt-1 text-sm text-gray-500">Uma por linha</p>
                        <textarea
                          value={listToTextarea(epic.dependencies)}
                          onChange={(event) =>
                            updateTechnicalEpic(index, { dependencies: textareaToList(event.target.value) })
                          }
                          rows={6}
                          className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-gray-900">Ordem de desenvolvimento</h3>
                <button
                  type="button"
                  onClick={() =>
                    setDocument((prev) => ({
                      ...prev,
                      technicalBacklog: {
                        ...prev.technicalBacklog,
                        developmentPhases: [...prev.technicalBacklog.developmentPhases, emptyDevelopmentPhase()],
                      },
                    }))
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
                >
                  <IconPlus size={16} />
                  Adicionar fase
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {document.technicalBacklog.developmentPhases.map((phase, index) => (
                  <div key={`phase-${index}`} className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
                      <input
                        value={phase.name}
                        onChange={(event) => updateDevelopmentPhase(index, { name: event.target.value })}
                        placeholder="Nome da fase"
                        className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                      />
                      <input
                        value={phase.outcome}
                        onChange={(event) => updateDevelopmentPhase(index, { outcome: event.target.value })}
                        placeholder="Resultado esperado"
                        className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setDocument((prev) => ({
                            ...prev,
                            technicalBacklog: {
                              ...prev.technicalBacklog,
                              developmentPhases: prev.technicalBacklog.developmentPhases.filter(
                                (_, itemIndex) => itemIndex !== index
                              ),
                            },
                          }))
                        }
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 text-sm font-medium text-red-600"
                      >
                        <IconTrash size={16} />
                        Remover
                      </button>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Entregas da fase, uma por linha</label>
                      <textarea
                        value={listToTextarea(phase.items)}
                        onChange={(event) =>
                          updateDevelopmentPhase(index, { items: textareaToList(event.target.value) })
                        }
                        rows={5}
                        className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Pilares de monetização</h2>
              <button
                type="button"
                onClick={() =>
                  setDocument((prev) => ({
                    ...prev,
                    monetizationPillars: [...prev.monetizationPillars, emptyPillar()],
                  }))
                }
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
              >
                <IconPlus size={16} />
                Adicionar pilar
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {document.monetizationPillars.map((pillar, index) => (
                <div key={`pillar-${index}`} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                    <div className="grid gap-4">
                      <input
                        value={pillar.title}
                        onChange={(event) => updatePillar(index, { title: event.target.value })}
                        placeholder="Título"
                        className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                      />
                      <textarea
                        value={pillar.description}
                        onChange={(event) => updatePillar(index, { description: event.target.value })}
                        rows={3}
                        placeholder="Descrição"
                        className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setDocument((prev) => ({
                          ...prev,
                          monetizationPillars: prev.monetizationPillars.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 text-sm font-medium text-red-600"
                    >
                      <IconTrash size={16} />
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Planos de bancas</h2>
              <button
                type="button"
                onClick={() =>
                  setDocument((prev) => ({
                    ...prev,
                    bancaPlans: [...prev.bancaPlans, emptyPlan()],
                  }))
                }
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
              >
                <IconPlus size={16} />
                Adicionar plano
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {document.bancaPlans.map((plan, index) => (
                <div key={`plan-${index}`} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
                    <input
                      value={plan.name}
                      onChange={(event) => updatePlan(index, { name: event.target.value })}
                      placeholder="Nome do plano"
                      className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                    />
                    <input
                      value={plan.price}
                      onChange={(event) => updatePlan(index, { price: event.target.value })}
                      placeholder="Preço"
                      className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                    />
                    <input
                      value={plan.highlight}
                      onChange={(event) => updatePlan(index, { highlight: event.target.value })}
                      placeholder="Destaque"
                      className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDocument((prev) => ({
                          ...prev,
                          bancaPlans: prev.bancaPlans.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 text-sm font-medium text-red-600"
                    >
                      <IconTrash size={16} />
                      Remover
                    </button>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Itens do plano, um por linha</label>
                    <textarea
                      value={listToTextarea(plan.items)}
                      onChange={(event) => updatePlan(index, { items: textareaToList(event.target.value) })}
                      rows={5}
                      className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Modelo para distribuidores</h2>
              <button
                type="button"
                onClick={() =>
                  setDocument((prev) => ({
                    ...prev,
                    distributorModels: [...prev.distributorModels, emptyDistributorModel()],
                  }))
                }
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
              >
                <IconPlus size={16} />
                Adicionar modelo
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {document.distributorModels.map((plan, index) => (
                <div key={`distributor-model-${index}`} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                    <div className="grid gap-4">
                      <input
                        value={plan.title}
                        onChange={(event) => updateDistributorModel(index, { title: event.target.value })}
                        placeholder="Título"
                        className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                      />
                      <textarea
                        value={plan.description}
                        onChange={(event) => updateDistributorModel(index, { description: event.target.value })}
                        rows={3}
                        placeholder="Descrição"
                        className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setDocument((prev) => ({
                          ...prev,
                          distributorModels: prev.distributorModels.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 text-sm font-medium text-red-600"
                    >
                      <IconTrash size={16} />
                      Remover
                    </button>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Itens do modelo, um por linha</label>
                    <textarea
                      value={listToTextarea(plan.items)}
                      onChange={(event) =>
                        updateDistributorModel(index, { items: textareaToList(event.target.value) })
                      }
                      rows={5}
                      className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Decisões tomadas</h2>
              <button
                type="button"
                onClick={() =>
                  setDocument((prev) => ({
                    ...prev,
                    decisions: [...prev.decisions, emptyDecision()],
                  }))
                }
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
              >
                <IconPlus size={16} />
                Adicionar decisão
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {document.decisions.map((decision, index) => (
                <div key={`decision-${index}`} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="grid gap-4 lg:grid-cols-[1fr_200px_180px_auto]">
                    <input
                      value={decision.title}
                      onChange={(event) => updateDecision(index, { title: event.target.value })}
                      placeholder="Título"
                      className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                    />
                    <input
                      value={decision.owner}
                      onChange={(event) => updateDecision(index, { owner: event.target.value })}
                      placeholder="Responsável"
                      className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                    />
                    <input
                      type="date"
                      value={decision.decisionDate}
                      onChange={(event) => updateDecision(index, { decisionDate: event.target.value })}
                      className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDocument((prev) => ({
                          ...prev,
                          decisions: prev.decisions.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 text-sm font-medium text-red-600"
                    >
                      <IconTrash size={16} />
                      Remover
                    </button>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <textarea
                      value={decision.decision}
                      onChange={(event) => updateDecision(index, { decision: event.target.value })}
                      rows={4}
                      placeholder="Decisão tomada"
                      className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                    />
                    <textarea
                      value={decision.rationale}
                      onChange={(event) => updateDecision(index, { rationale: event.target.value })}
                      rows={4}
                      placeholder="Justificativa / contexto"
                      className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Hipóteses para validar</h2>
              <button
                type="button"
                onClick={() =>
                  setDocument((prev) => ({
                    ...prev,
                    validationHypotheses: [...prev.validationHypotheses, emptyHypothesis()],
                  }))
                }
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
              >
                <IconPlus size={16} />
                Adicionar hipótese
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {document.validationHypotheses.map((hypothesis, index) => (
                <div key={`hypothesis-${index}`} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="grid gap-4 lg:grid-cols-[1fr_200px_180px_180px_auto]">
                    <textarea
                      value={hypothesis.statement}
                      onChange={(event) => updateHypothesis(index, { statement: event.target.value })}
                      rows={3}
                      placeholder="Hipótese"
                      className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                    />
                    <input
                      value={hypothesis.owner}
                      onChange={(event) => updateHypothesis(index, { owner: event.target.value })}
                      placeholder="Responsável"
                      className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                    />
                    <input
                      type="date"
                      value={hypothesis.targetDate}
                      onChange={(event) => updateHypothesis(index, { targetDate: event.target.value })}
                      className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                    />
                    <select
                      value={hypothesis.status}
                      onChange={(event) =>
                        updateHypothesis(index, { status: event.target.value as CommercialPlanningHypothesisStatus })
                      }
                      className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                    >
                      {HYPOTHESIS_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() =>
                        setDocument((prev) => ({
                          ...prev,
                          validationHypotheses: prev.validationHypotheses.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 text-sm font-medium text-red-600"
                    >
                      <IconTrash size={16} />
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Glossário do negócio</h2>
              <button
                type="button"
                onClick={() =>
                  setDocument((prev) => ({
                    ...prev,
                    glossary: [...prev.glossary, emptyGlossaryEntry()],
                  }))
                }
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
              >
                <IconPlus size={16} />
                Adicionar termo
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {document.glossary.map((entry, index) => (
                <div key={`glossary-${index}`} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                    <div className="grid gap-4">
                      <input
                        value={entry.term}
                        onChange={(event) => updateGlossaryEntry(index, { term: event.target.value })}
                        placeholder="Termo"
                        className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                      />
                      <textarea
                        value={entry.meaning}
                        onChange={(event) => updateGlossaryEntry(index, { meaning: event.target.value })}
                        rows={3}
                        placeholder="Significado"
                        className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setDocument((prev) => ({
                          ...prev,
                          glossary: prev.glossary.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 text-sm font-medium text-red-600"
                    >
                      <IconTrash size={16} />
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Próximos passos</h2>
              <p className="mt-1 text-sm text-gray-500">Um por linha</p>
              <textarea
                value={listToTextarea(document.nextSteps)}
                onChange={(event) => updateField("nextSteps", textareaToList(event.target.value))}
                rows={9}
                className="mt-4 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
              />
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Perguntas abertas</h2>
              <p className="mt-1 text-sm text-gray-500">Uma por linha</p>
              <textarea
                value={listToTextarea(document.openQuestions)}
                onChange={(event) => updateField("openQuestions", textareaToList(event.target.value))}
                rows={9}
                className="mt-4 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
              />
            </article>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Notas do dia</h2>
            <p className="mt-1 text-sm text-gray-500">Espaço livre para aprendizados, objeções, testes e decisões</p>
            <textarea
              value={document.dailyNotes}
              onChange={(event) => updateField("dailyNotes", event.target.value)}
              rows={12}
              className="mt-4 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
            />
          </section>
        </div>
      )}
    </div>
  );
}

function documentRef<K extends keyof HTMLElementTagNameMap>(tag: K) {
  return window.document.createElement(tag);
}

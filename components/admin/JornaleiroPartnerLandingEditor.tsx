"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/admin/ToastProvider";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";
import {
  DEFAULT_JORNALEIRO_PARTNER_LANDING_DOCUMENT,
  type JournaleiroPartnerLandingDocument,
  type JournaleiroPartnerPlanCard,
  type JournaleiroPartnerTextSection,
} from "@/lib/jornaleiro-partner-landing";

function listToTextarea(items: string[]) {
  return items.join("\n");
}

function textareaToList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function SectionEditor({
  title,
  section,
  onChange,
}: {
  title: string;
  section: JournaleiroPartnerTextSection;
  onChange: (next: JournaleiroPartnerTextSection) => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 text-lg font-semibold text-gray-900">{title}</div>
      <div className="grid gap-4">
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-gray-700">Eyebrow</span>
          <input
            value={section.eyebrow}
            onChange={(event) => onChange({ ...section, eyebrow: event.target.value })}
            className="rounded-xl border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-gray-700">Título</span>
          <textarea
            value={section.title}
            onChange={(event) => onChange({ ...section, title: event.target.value })}
            className="min-h-[90px] rounded-xl border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-gray-700">Parágrafos</span>
          <textarea
            value={listToTextarea(section.paragraphs)}
            onChange={(event) =>
              onChange({ ...section, paragraphs: textareaToList(event.target.value) })
            }
            className="min-h-[180px] rounded-xl border border-gray-300 px-3 py-2"
          />
          <span className="text-xs text-gray-500">Um parágrafo por linha.</span>
        </label>
      </div>
    </div>
  );
}

function PlanEditor({
  plan,
  onChange,
}: {
  plan: JournaleiroPartnerPlanCard;
  onChange: (next: JournaleiroPartnerPlanCard) => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-gray-700">Nome</span>
          <input
            value={plan.name}
            onChange={(event) => onChange({ ...plan, name: event.target.value })}
            className="rounded-xl border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-gray-700">Preço</span>
          <input
            value={plan.price}
            onChange={(event) => onChange({ ...plan, price: event.target.value })}
            className="rounded-xl border border-gray-300 px-3 py-2"
          />
        </label>
      </div>
      <div className="mt-4 grid gap-4">
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-gray-700">Subtítulo</span>
          <input
            value={plan.subtitle}
            onChange={(event) => onChange({ ...plan, subtitle: event.target.value })}
            className="rounded-xl border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-gray-700">Badge promocional</span>
          <input
            value={plan.badge || ""}
            onChange={(event) => onChange({ ...plan, badge: event.target.value })}
            className="rounded-xl border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-gray-700">Classe de gradiente</span>
          <input
            value={plan.accent}
            onChange={(event) => onChange({ ...plan, accent: event.target.value })}
            className="rounded-xl border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-gray-700">Features</span>
          <textarea
            value={listToTextarea(plan.features)}
            onChange={(event) => onChange({ ...plan, features: textareaToList(event.target.value) })}
            className="min-h-[160px] rounded-xl border border-gray-300 px-3 py-2"
          />
        </label>
      </div>
    </div>
  );
}

export default function JornaleiroPartnerLandingEditor() {
  const toast = useToast();
  const [document, setDocument] = useState<JournaleiroPartnerLandingDocument>(
    DEFAULT_JORNALEIRO_PARTNER_LANDING_DOCUMENT
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchAdminWithDevFallback("/api/admin/jornaleiro-partner-landing");
        const json = await response.json();
        if (json?.success && json?.data) {
          setDocument(json.data);
          setUpdatedAt(json.updatedAt || null);
        }
      } catch (error) {
        toast.error("Não foi possível carregar a landing do jornaleiro.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [toast]);

  const save = async () => {
    try {
      setSaving(true);
      const response = await fetchAdminWithDevFallback("/api/admin/jornaleiro-partner-landing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document }),
      });
      const json = await response.json();
      if (!response.ok || !json?.success) {
        throw new Error(json?.error || "Erro ao salvar");
      }
      setDocument(json.data);
      setUpdatedAt(json.updatedAt || null);
      toast.success("Landing do jornaleiro salva com sucesso.");
    } catch (error: any) {
      toast.error(error?.message || "Erro ao salvar landing do jornaleiro.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[#ff5c00]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff5c00]">
              Site e growth
            </div>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900">Landing Jornaleiro</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
              Ajuste a narrativa comercial da página pública do jornaleiro e também os blocos menores
              usados na home, login e cadastro.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600">
              Última atualização: {updatedAt ? new Date(updatedAt).toLocaleString("pt-BR") : "ainda não salva"}
            </div>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-2xl bg-[#ff5c00] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e65300] disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Salvar landing"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 text-lg font-semibold text-gray-900">Hero</div>
          <div className="grid gap-4">
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-700">Badge</span>
              <input
                value={document.hero.badge}
                onChange={(event) =>
                  setDocument((prev) => ({ ...prev, hero: { ...prev.hero, badge: event.target.value } }))
                }
                className="rounded-xl border border-gray-300 px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-700">Título</span>
              <textarea
                value={document.hero.title}
                onChange={(event) =>
                  setDocument((prev) => ({ ...prev, hero: { ...prev.hero, title: event.target.value } }))
                }
                className="min-h-[100px] rounded-xl border border-gray-300 px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-700">Subtítulo</span>
              <textarea
                value={document.hero.subtitle}
                onChange={(event) =>
                  setDocument((prev) => ({ ...prev, hero: { ...prev.hero, subtitle: event.target.value } }))
                }
                className="min-h-[160px] rounded-xl border border-gray-300 px-3 py-2"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-gray-700">CTA principal</span>
                <input
                  value={document.hero.ctaText}
                  onChange={(event) =>
                    setDocument((prev) => ({ ...prev, hero: { ...prev.hero, ctaText: event.target.value } }))
                  }
                  className="rounded-xl border border-gray-300 px-3 py-2"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-gray-700">Texto de apoio</span>
                <input
                  value={document.hero.supportText}
                  onChange={(event) =>
                    setDocument((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, supportText: event.target.value },
                    }))
                  }
                  className="rounded-xl border border-gray-300 px-3 py-2"
                />
              </label>
            </div>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-700">Highlights</span>
              <textarea
                value={listToTextarea(document.hero.highlights)}
                onChange={(event) =>
                  setDocument((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, highlights: textareaToList(event.target.value) },
                  }))
                }
                className="min-h-[120px] rounded-xl border border-gray-300 px-3 py-2"
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 text-lg font-semibold text-gray-900">Blocos do funil</div>
          <div className="grid gap-4">
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-700">Home - Eyebrow</span>
              <input
                value={document.promoStrip.eyebrow}
                onChange={(event) =>
                  setDocument((prev) => ({
                    ...prev,
                    promoStrip: { ...prev.promoStrip, eyebrow: event.target.value },
                  }))
                }
                className="rounded-xl border border-gray-300 px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-700">Home - Título</span>
              <textarea
                value={document.promoStrip.title}
                onChange={(event) =>
                  setDocument((prev) => ({
                    ...prev,
                    promoStrip: { ...prev.promoStrip, title: event.target.value },
                  }))
                }
                className="min-h-[90px] rounded-xl border border-gray-300 px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-700">Home - Descrição</span>
              <textarea
                value={document.promoStrip.description}
                onChange={(event) =>
                  setDocument((prev) => ({
                    ...prev,
                    promoStrip: { ...prev.promoStrip, description: event.target.value },
                  }))
                }
                className="min-h-[110px] rounded-xl border border-gray-300 px-3 py-2"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-gray-700">CTA 1</span>
                <input
                  value={document.promoStrip.primaryCtaText}
                  onChange={(event) =>
                    setDocument((prev) => ({
                      ...prev,
                      promoStrip: { ...prev.promoStrip, primaryCtaText: event.target.value },
                    }))
                  }
                  className="rounded-xl border border-gray-300 px-3 py-2"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-gray-700">CTA 2</span>
                <input
                  value={document.promoStrip.secondaryCtaText}
                  onChange={(event) =>
                    setDocument((prev) => ({
                      ...prev,
                      promoStrip: { ...prev.promoStrip, secondaryCtaText: event.target.value },
                    }))
                  }
                  className="rounded-xl border border-gray-300 px-3 py-2"
                />
              </label>
            </div>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-700">Bullets da home</span>
              <textarea
                value={listToTextarea(document.promoStrip.bullets)}
                onChange={(event) =>
                  setDocument((prev) => ({
                    ...prev,
                    promoStrip: { ...prev.promoStrip, bullets: textareaToList(event.target.value) },
                  }))
                }
                className="min-h-[110px] rounded-xl border border-gray-300 px-3 py-2"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 text-lg font-semibold text-gray-900">Apoio no login</div>
          <div className="grid gap-4">
            {(["title", "description", "ctaText", "helper"] as const).map((field) => (
              <label key={field} className="grid gap-1 text-sm">
                <span className="font-medium capitalize text-gray-700">{field}</span>
                {field === "description" ? (
                  <textarea
                    value={document.loginAssist[field]}
                    onChange={(event) =>
                      setDocument((prev) => ({
                        ...prev,
                        loginAssist: { ...prev.loginAssist, [field]: event.target.value },
                      }))
                    }
                    className="min-h-[110px] rounded-xl border border-gray-300 px-3 py-2"
                  />
                ) : (
                  <input
                    value={document.loginAssist[field]}
                    onChange={(event) =>
                      setDocument((prev) => ({
                        ...prev,
                        loginAssist: { ...prev.loginAssist, [field]: event.target.value },
                      }))
                    }
                    className="rounded-xl border border-gray-300 px-3 py-2"
                  />
                )}
              </label>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 text-lg font-semibold text-gray-900">Apoio no cadastro</div>
          <div className="grid gap-4">
            {(["title", "description", "ctaText", "helper"] as const).map((field) => (
              <label key={field} className="grid gap-1 text-sm">
                <span className="font-medium capitalize text-gray-700">{field}</span>
                {field === "description" ? (
                  <textarea
                    value={document.signupAssist[field]}
                    onChange={(event) =>
                      setDocument((prev) => ({
                        ...prev,
                        signupAssist: { ...prev.signupAssist, [field]: event.target.value },
                      }))
                    }
                    className="min-h-[110px] rounded-xl border border-gray-300 px-3 py-2"
                  />
                ) : (
                  <input
                    value={document.signupAssist[field]}
                    onChange={(event) =>
                      setDocument((prev) => ({
                        ...prev,
                        signupAssist: { ...prev.signupAssist, [field]: event.target.value },
                      }))
                    }
                    className="rounded-xl border border-gray-300 px-3 py-2"
                  />
                )}
              </label>
            ))}
          </div>
        </div>
      </div>

      <SectionEditor
        title="Dor real"
        section={document.sections.pain}
        onChange={(next) =>
          setDocument((prev) => ({ ...prev, sections: { ...prev.sections, pain: next } }))
        }
      />
      <SectionEditor
        title="A virada"
        section={document.sections.transformation}
        onChange={(next) =>
          setDocument((prev) => ({
            ...prev,
            sections: { ...prev.sections, transformation: next },
          }))
        }
      />
      <SectionEditor
        title="Simplicidade"
        section={document.sections.simplicity}
        onChange={(next) =>
          setDocument((prev) => ({
            ...prev,
            sections: { ...prev.sections, simplicity: next },
          }))
        }
      />
      <SectionEditor
        title="Foco em venda"
        section={document.sections.sales}
        onChange={(next) =>
          setDocument((prev) => ({ ...prev, sections: { ...prev.sections, sales: next } }))
        }
      />
      <SectionEditor
        title="Distribuidores"
        section={document.sections.distributors}
        onChange={(next) =>
          setDocument((prev) => ({
            ...prev,
            sections: { ...prev.sections, distributors: next },
          }))
        }
      />
      <SectionEditor
        title="Diferencial"
        section={document.sections.differentiation}
        onChange={(next) =>
          setDocument((prev) => ({
            ...prev,
            sections: { ...prev.sections, differentiation: next },
          }))
        }
      />
      <SectionEditor
        title="Cobertura"
        section={document.sections.coverage}
        onChange={(next) =>
          setDocument((prev) => ({ ...prev, sections: { ...prev.sections, coverage: next } }))
        }
      />
      <SectionEditor
        title="Preço"
        section={document.sections.pricing}
        onChange={(next) =>
          setDocument((prev) => ({ ...prev, sections: { ...prev.sections, pricing: next } }))
        }
      />
      <SectionEditor
        title="Risco zero"
        section={document.sections.risk}
        onChange={(next) =>
          setDocument((prev) => ({ ...prev, sections: { ...prev.sections, risk: next } }))
        }
      />
      <SectionEditor
        title="Visão de futuro"
        section={document.sections.future}
        onChange={(next) =>
          setDocument((prev) => ({ ...prev, sections: { ...prev.sections, future: next } }))
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 text-lg font-semibold text-gray-900">Caixa de impacto</div>
          <div className="grid gap-4">
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-700">Título</span>
              <textarea
                value={document.transformationHighlight.title}
                onChange={(event) =>
                  setDocument((prev) => ({
                    ...prev,
                    transformationHighlight: {
                      ...prev.transformationHighlight,
                      title: event.target.value,
                    },
                  }))
                }
                className="min-h-[110px] rounded-xl border border-gray-300 px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-700">Descrição</span>
              <textarea
                value={document.transformationHighlight.description}
                onChange={(event) =>
                  setDocument((prev) => ({
                    ...prev,
                    transformationHighlight: {
                      ...prev.transformationHighlight,
                      description: event.target.value,
                    },
                  }))
                }
                className="min-h-[140px] rounded-xl border border-gray-300 px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-gray-700">CTA</span>
              <input
                value={document.transformationHighlight.ctaText}
                onChange={(event) =>
                  setDocument((prev) => ({
                    ...prev,
                    transformationHighlight: {
                      ...prev.transformationHighlight,
                      ctaText: event.target.value,
                    },
                  }))
                }
                className="rounded-xl border border-gray-300 px-3 py-2"
              />
            </label>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 text-lg font-semibold text-gray-900">CTA final</div>
          <div className="grid gap-4">
            {(["eyebrow", "title", "subtitle", "ctaText", "supportText"] as const).map((field) => (
              <label key={field} className="grid gap-1 text-sm">
                <span className="font-medium text-gray-700">{field}</span>
                {field === "title" || field === "subtitle" ? (
                  <textarea
                    value={document.finalCta[field]}
                    onChange={(event) =>
                      setDocument((prev) => ({
                        ...prev,
                        finalCta: { ...prev.finalCta, [field]: event.target.value },
                      }))
                    }
                    className="min-h-[100px] rounded-xl border border-gray-300 px-3 py-2"
                  />
                ) : (
                  <input
                    value={document.finalCta[field]}
                    onChange={(event) =>
                      setDocument((prev) => ({
                        ...prev,
                        finalCta: { ...prev.finalCta, [field]: event.target.value },
                      }))
                    }
                    className="rounded-xl border border-gray-300 px-3 py-2"
                  />
                )}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 text-lg font-semibold text-gray-900">Cards de simplicidade</div>
        <div className="grid gap-4 xl:grid-cols-3">
          {document.simplicityCards.map((card, index) => (
            <div key={index} className="grid gap-3 rounded-2xl border border-gray-200 p-4">
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-gray-700">Título</span>
                <input
                  value={card.title}
                  onChange={(event) =>
                    setDocument((prev) => {
                      const next = [...prev.simplicityCards];
                      next[index] = { ...next[index], title: event.target.value };
                      return { ...prev, simplicityCards: next };
                    })
                  }
                  className="rounded-xl border border-gray-300 px-3 py-2"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-gray-700">Descrição</span>
                <textarea
                  value={card.description}
                  onChange={(event) =>
                    setDocument((prev) => {
                      const next = [...prev.simplicityCards];
                      next[index] = { ...next[index], description: event.target.value };
                      return { ...prev, simplicityCards: next };
                    })
                  }
                  className="min-h-[140px] rounded-xl border border-gray-300 px-3 py-2"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 text-lg font-semibold text-gray-900">Comparativo sem/com Guia</div>
        <div className="grid gap-4">
          {document.comparisonRows.map((row, index) => (
            <div key={index} className="grid gap-4 rounded-2xl border border-gray-200 p-4 md:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-gray-700">Sem o Guia</span>
                <input
                  value={row.withoutGuide}
                  onChange={(event) =>
                    setDocument((prev) => {
                      const next = [...prev.comparisonRows];
                      next[index] = { ...next[index], withoutGuide: event.target.value };
                      return { ...prev, comparisonRows: next };
                    })
                  }
                  className="rounded-xl border border-gray-300 px-3 py-2"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-gray-700">Com o Guia</span>
                <input
                  value={row.withGuide}
                  onChange={(event) =>
                    setDocument((prev) => {
                      const next = [...prev.comparisonRows];
                      next[index] = { ...next[index], withGuide: event.target.value };
                      return { ...prev, comparisonRows: next };
                    })
                  }
                  className="rounded-xl border border-gray-300 px-3 py-2"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-lg font-semibold text-gray-900">Planos</div>
        <div className="grid gap-4 xl:grid-cols-3">
          {document.plans.map((plan, index) => (
            <PlanEditor
              key={plan.name + index}
              plan={plan}
              onChange={(next) =>
                setDocument((prev) => {
                  const plans = [...prev.plans];
                  plans[index] = next;
                  return { ...prev, plans };
                })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

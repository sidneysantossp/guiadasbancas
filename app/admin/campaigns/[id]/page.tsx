"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/admin/ToastProvider";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";
import { buildPublicProductPath } from "@/lib/product-url";

type CampaignDetail = {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  status: "pending" | "approved" | "rejected" | "active" | "expired" | "cancelled";
  plan_type: string;
  admin_message?: string | null;
  rejection_reason?: string | null;
  impressions: number;
  clicks: number;
  created_at: string;
  products: {
    id: string;
    name: string;
    description: string;
    price: number;
    price_original?: number | null;
    discount_percent?: number | null;
    images: string[];
    bancas?: {
      id: string;
      name: string;
      cover_image?: string | null;
    } | null;
  };
};

const statusLabels = {
  pending: { label: "Aguardando", tone: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Aprovada", tone: "bg-blue-100 text-blue-800" },
  rejected: { label: "Rejeitada", tone: "bg-red-100 text-red-800" },
  active: { label: "Ativa", tone: "bg-emerald-100 text-emerald-800" },
  expired: { label: "Expirada", tone: "bg-gray-100 text-gray-800" },
  cancelled: { label: "Cancelada", tone: "bg-gray-100 text-gray-800" },
};

function SummaryCard({
  title,
  value,
  helper,
}: {
  title: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{title}</div>
      <div className="mt-2 text-lg font-semibold text-gray-900">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{helper}</div>
    </div>
  );
}

export default function AdminCampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const campaignId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    void loadCampaign();
  }, [campaignId]);

  const loadCampaign = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminWithDevFallback(`/api/admin/campaigns/${campaignId}`);
      const json = await res.json();

      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Erro ao carregar campanha");
      }

      setCampaign(json.data);
      setAdminMessage(json.data.admin_message || "");
      setRejectionReason(json.data.rejection_reason || "");
    } catch (error: any) {
      toast.error(error?.message || "Erro ao carregar campanha");
      router.push("/admin/campaigns");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: "approved" | "rejected" | "cancelled") => {
    if (!campaign) return;

    if (status === "rejected" && !rejectionReason.trim()) {
      toast.error("Informe o motivo da rejeição");
      return;
    }

    try {
      setSaving(true);
      const res = await fetchAdminWithDevFallback(`/api/admin/campaigns/${campaign.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          admin_message: adminMessage,
          rejection_reason: status === "rejected" ? rejectionReason : undefined,
        }),
      });
      const json = await res.json();

      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Erro ao atualizar campanha");
      }

      toast.success("Campanha atualizada com sucesso");
      await loadCampaign();
    } catch (error: any) {
      toast.error(error?.message || "Erro ao atualizar campanha");
    } finally {
      setSaving(false);
    }
  };

  const removeCampaign = async () => {
    if (!campaign || !window.confirm("Excluir esta campanha?")) return;

    try {
      setSaving(true);
      const res = await fetchAdminWithDevFallback(`/api/admin/campaigns/${campaign.id}/delete`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Erro ao excluir campanha");
      }
      toast.success("Campanha excluída com sucesso");
      router.push("/admin/campaigns");
    } catch (error: any) {
      toast.error(error?.message || "Erro ao excluir campanha");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !campaign) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ff5c00] border-t-transparent" />
          <p className="mt-2 text-sm text-gray-600">Carregando campanha...</p>
        </div>
      </div>
    );
  }

  const status = statusLabels[campaign.status];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link href={"/admin/campaigns" as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
            Voltar para campanhas
          </Link>
          <h1 className="mt-2 text-3xl font-semibold text-gray-950">{campaign.title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Controle a aprovação, a mensagem administrativa e o contexto comercial da mídia.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.tone}`}>{status.label}</span>
          <button
            onClick={removeCampaign}
            disabled={saving}
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
          >
            Excluir
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Plano" value={campaign.plan_type || "—"} helper="Origem comercial da campanha." />
        <SummaryCard title="Duração" value={`${campaign.duration_days} dias`} helper="Janela de exibição contratada." />
        <SummaryCard title="Impressões" value={String(campaign.impressions || 0)} helper="Alcance acumulado." />
        <SummaryCard title="Cliques" value={String(campaign.clicks || 0)} helper="Engajamento registrado." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Produto vinculado</h2>
            <div className="mt-5 flex flex-col gap-4 md:flex-row">
              <div className="h-40 w-32 overflow-hidden rounded-xl bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={campaign.products.images?.[0] || "/placeholder-product.jpg"}
                  alt={campaign.products.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xl font-semibold text-gray-900">{campaign.products.name}</div>
                <p className="mt-2 text-sm text-gray-600">{campaign.products.description}</p>
                {campaign.products.bancas && (
                  <div className="mt-3 text-sm text-gray-500">
                    Banca vinculada:{" "}
                    <Link
                      href={`/admin/bancas/${campaign.products.bancas.id}` as Route}
                      className="font-medium text-[#ff5c00] hover:underline"
                    >
                      {campaign.products.bancas.name}
                    </Link>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="text-lg font-bold text-gray-900">
                    R$ {Number(campaign.products.price || 0).toFixed(2)}
                  </span>
                  {campaign.products.price_original ? (
                    <span className="text-sm text-gray-500 line-through">
                      R$ {Number(campaign.products.price_original).toFixed(2)}
                    </span>
                  ) : null}
                  <Link
                    href={`/admin/products/${campaign.products.id}` as Route}
                    className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Ver produto
                  </Link>
                  <button
                    onClick={() =>
                      window.open(
                        buildPublicProductPath(
                          campaign.products.name,
                          campaign.products.bancas?.name,
                          campaign.products.id
                        ),
                        "_blank"
                      )
                    }
                    className="rounded-md border border-[#ff5c00]/20 bg-[#fff4ec] px-3 py-1.5 text-sm text-[#ff5c00] hover:bg-[#ffe8d9]"
                  >
                    Abrir no site
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Decisão administrativa</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Mensagem para o jornaleiro</label>
                <textarea
                  value={adminMessage}
                  onChange={(event) => setAdminMessage(event.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Explique a aprovação, recomendação de mídia ou observações."
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Motivo da rejeição</label>
                <textarea
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Preencha apenas quando a campanha for rejeitada."
                />
              </div>
              <div className="flex flex-wrap gap-3">
                {campaign.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus("approved")}
                      disabled={saving}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      Aprovar e ativar
                    </button>
                    <button
                      onClick={() => updateStatus("rejected")}
                      disabled={saving}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      Rejeitar
                    </button>
                  </>
                )}
                {(campaign.status === "active" || campaign.status === "approved") && (
                  <button
                    onClick={() => updateStatus("cancelled")}
                    disabled={saving}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                  >
                    Cancelar campanha
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Contexto</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Criada em</dt>
                <dd className="font-medium text-gray-900">
                  {new Date(campaign.created_at).toLocaleString("pt-BR")}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Inicio</dt>
                <dd className="font-medium text-gray-900">
                  {new Date(campaign.start_date).toLocaleDateString("pt-BR")}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Fim</dt>
                <dd className="font-medium text-gray-900">
                  {new Date(campaign.end_date).toLocaleDateString("pt-BR")}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Status atual</dt>
                <dd className="font-medium text-gray-900">{status.label}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useParams } from "next/navigation";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type RelationshipDetail = {
  id: string;
  codigo: string;
  razao_social: string;
  cnpj_cpf: string;
  telefone?: string | null;
  telefone_2?: string | null;
  endereco_principal?: string | null;
  cidade?: string | null;
  estado?: string | null;
  ativo: boolean;
  metrics: {
    linked_bancas: number;
    active_bancas: number;
    approved_bancas: number;
    paid_plans: number;
    orders_30d: number;
    revenue_30d: number;
  };
  linked_bancas: Array<{
    id: string;
    user_id: string | null;
    name: string | null;
    address: string | null;
    whatsapp: string | null;
    active: boolean;
    approved: boolean;
    created_at: string | null;
    plan_name: string | null;
    plan_type: string | null;
    subscription_status: string | null;
  }>;
};

function formatCurrency(value?: number | null) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function formatDocument(value: string) {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  if (cleaned.length === 14) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
  return value;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function SummaryCard({
  title,
  value,
  helper,
}: {
  title: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{helper}</div>
    </div>
  );
}

export default function AdminCotistaDetailPage() {
  const params = useParams();
  const relationshipId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RelationshipDetail | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetchAdminWithDevFallback(`/api/admin/cotistas/${relationshipId}`);
        const json = await response.json();
        if (json.success) {
          setData(json.data);
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("Erro ao carregar relacionamento comercial:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (relationshipId) load();
  }, [relationshipId]);

  if (loading) {
    return <div className="py-16 text-center text-sm text-gray-500">Carregando relacionamento comercial...</div>;
  }

  if (!data) {
    return <div className="py-16 text-center text-sm text-gray-500">Relacionamento comercial não encontrado.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <Link href="/admin/cotistas" className="text-sm font-medium text-[#ff5c00] hover:underline">
            Voltar para relacionamentos comerciais
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-gray-900">{data.razao_social}</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Leitura operacional da rede comercial legada, mostrando como esse vínculo ainda impacta bancas, planos e pedidos do ecossistema.
          </p>
        </div>

        <span
          className={`inline-flex self-start rounded-full px-3 py-1.5 text-sm font-medium ${
            data.ativo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
          }`}
        >
          {data.ativo ? "Relacionamento ativo" : "Relacionamento inativo"}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <SummaryCard title="Bancas vinculadas" value={data.metrics.linked_bancas} helper="Vínculos detectados por ID, código ou documento" />
        <SummaryCard title="Bancas ativas" value={data.metrics.active_bancas} helper="Operações ativas ligadas a esta rede" />
        <SummaryCard title="Bancas aprovadas" value={data.metrics.approved_bancas} helper="Operações já liberadas no marketplace" />
        <SummaryCard title="Planos pagos" value={data.metrics.paid_plans} helper="Start ou Premium dentro da rede" />
        <SummaryCard title="Pedidos 30d" value={data.metrics.orders_30d} helper="Volume recente associado às bancas vinculadas" />
        <SummaryCard title="Receita 30d" value={formatCurrency(data.metrics.revenue_30d)} helper="Movimentação recente da rede" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Dados do relacionamento</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div><span className="font-medium text-gray-900">Código:</span> {data.codigo}</div>
            <div><span className="font-medium text-gray-900">Documento:</span> {formatDocument(data.cnpj_cpf)}</div>
            <div><span className="font-medium text-gray-900">Telefone:</span> {data.telefone || "—"}</div>
            <div><span className="font-medium text-gray-900">Telefone 2:</span> {data.telefone_2 || "—"}</div>
            <div><span className="font-medium text-gray-900">Endereço:</span> {data.endereco_principal || "—"}</div>
            <div><span className="font-medium text-gray-900">Localização:</span> {data.cidade && data.estado ? `${data.cidade}/${data.estado}` : data.cidade || data.estado || "—"}</div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Bancas vinculadas</h2>
            <span className="text-sm text-gray-500">{data.linked_bancas.length} item(ns)</span>
          </div>

          <div className="mt-4 space-y-3">
            {data.linked_bancas.length > 0 ? (
              data.linked_bancas.map((banca) => (
                <div key={banca.id} className="rounded-xl border border-gray-200 px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-gray-900">{banca.name || "Banca sem nome"}</div>
                      <div className="text-xs text-gray-500">
                        {banca.address || "Sem endereço"} · {formatDate(banca.created_at)}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {banca.plan_name || "Sem plano"} · {banca.subscription_status || "sem assinatura"}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          banca.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {banca.active ? "Ativa" : "Pausada"}
                      </span>
                      <Link href={`/admin/bancas/${banca.id}` as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
                        Abrir banca
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
                Nenhuma banca vinculada foi encontrada para este relacionamento.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

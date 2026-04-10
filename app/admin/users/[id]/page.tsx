"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type UserDetail = {
  profile: {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    role: string | null;
    active: boolean;
    blocked: boolean;
    blocked_reason: string | null;
    blocked_at: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
  banca: {
    id: string;
    user_id: string | null;
    name: string | null;
    address: string | null;
    whatsapp: string | null;
    active: boolean;
    approved: boolean;
    featured: boolean;
  } | null;
  subscription: {
    id: string;
    status: string | null;
    current_period_start: string | null;
    current_period_end: string | null;
    contracted_price: number | null;
    plan: {
      id: string;
      name: string | null;
      type: string | null;
      price: number | null;
      billing_cycle: string | null;
    } | null;
  } | null;
  metrics: {
    total_orders: number;
    total_spent: number;
    open_orders: number;
  };
  recent_orders: Array<{
    id: string;
    banca_id: string | null;
    customer_name: string | null;
    total: number | null;
    status: string | null;
    payment_method: string | null;
    created_at: string | null;
  }>;
};

function formatCurrency(value?: number | null) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
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

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState<"unlink" | "delete" | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetchAdminWithDevFallback(`/api/admin/users/${userId}`);
      const json = await response.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (error) {
      console.error("Erro ao carregar detalhe do usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) load();
  }, [userId]);

  if (loading) {
    return <div className="py-16 text-center text-sm text-gray-500">Carregando usuário...</div>;
  }

  if (!data) {
    return <div className="py-16 text-center text-sm text-gray-500">Usuário não encontrado.</div>;
  }

  const normalizedRole = (data.profile.role || "cliente").toLowerCase();
  const isJornaleiro = ["jornaleiro", "seller"].includes(normalizedRole);
  const canManageJornaleiroAccount = isJornaleiro;

  const handleUnlinkBanca = async () => {
    if (!data?.banca || !canManageJornaleiroAccount) return;

    const confirmation = window.prompt(
      `Você está prestes a remover o vínculo entre a conta "${data.profile.full_name || data.profile.email || data.profile.id}" e a banca "${data.banca.name || "Sem nome"}".\n\nDigite DESVINCULAR para confirmar.`
    );

    if ((confirmation || "").trim().toUpperCase() !== "DESVINCULAR") {
      return;
    }

    setPendingAction("unlink");

    try {
      const response = await fetchAdminWithDevFallback(`/api/admin/jornaleiros/${data.profile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unlink_banca" }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Erro ao desvincular banca");
      }

      window.alert(json.message || "Vínculo com a banca removido com sucesso.");
      await load();
    } catch (error: any) {
      console.error("Erro ao desvincular banca da conta:", error);
      window.alert(error?.message || "Não foi possível remover o vínculo com a banca.");
    } finally {
      setPendingAction(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (!canManageJornaleiroAccount) return;

    const confirmation = window.prompt(
      `Você está prestes a excluir permanentemente a conta "${data.profile.full_name || data.profile.email || data.profile.id}".\n\nIsso remove o login do jornaleiro e desfaz o vínculo com banca e equipe.\n\nDigite EXCLUIR CONTA para confirmar.`
    );

    if ((confirmation || "").trim().toUpperCase() !== "EXCLUIR CONTA") {
      return;
    }

    setPendingAction("delete");

    try {
      const response = await fetchAdminWithDevFallback(`/api/admin/jornaleiros/${data.profile.id}`, {
        method: "DELETE",
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Erro ao excluir conta");
      }

      window.alert(json.message || "Conta excluída com sucesso.");
      router.push("/admin/users");
      router.refresh();
    } catch (error: any) {
      console.error("Erro ao excluir conta do jornaleiro:", error);
      window.alert(error?.message || "Não foi possível excluir a conta.");
      setPendingAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <Link href={"/admin/users" as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
            Voltar para usuários
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-gray-900">{data.profile.full_name || "Usuário sem nome"}</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Conta base do ecossistema, com vínculo de banca, histórico de pedidos e leitura comercial.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isJornaleiro ? (
            <Link
              href={`/admin/jornaleiros/${data.profile.id}` as Route}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
            >
              Ver operação do jornaleiro
            </Link>
          ) : null}
          {data.banca?.id ? (
            <Link
              href={`/admin/bancas/${data.banca.id}` as Route}
              className="rounded-xl bg-[#ff5c00] px-4 py-2 text-sm font-medium text-white hover:bg-[#e65300]"
            >
              Abrir banca vinculada
            </Link>
          ) : null}
          {canManageJornaleiroAccount && data.banca ? (
            <button
              type="button"
              onClick={handleUnlinkBanca}
              disabled={pendingAction !== null}
              className="rounded-xl border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 hover:border-amber-500 hover:text-amber-800 disabled:opacity-60"
            >
              {pendingAction === "unlink" ? "Desvinculando..." : "Desvincular banca"}
            </button>
          ) : null}
          {canManageJornaleiroAccount ? (
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={pendingAction !== null}
              className="rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:border-red-500 hover:text-red-800 disabled:opacity-60"
            >
              {pendingAction === "delete" ? "Excluindo..." : "Excluir conta"}
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SummaryCard title="Perfil" value={isJornaleiro ? "Jornaleiro" : "Cliente"} helper={data.profile.email || "Sem e-mail"} />
        <SummaryCard title="Pedidos" value={data.metrics.total_orders} helper={`${data.metrics.open_orders} em aberto`} />
        <SummaryCard title="Movimentado" value={formatCurrency(data.metrics.total_spent)} helper="Volume total conhecido" />
        <SummaryCard title="Cadastro" value={formatDate(data.profile.created_at)} helper={data.profile.blocked ? "Conta bloqueada" : "Conta liberada"} />
        <SummaryCard title="Banca" value={data.banca?.name || "Sem vínculo"} helper={data.subscription?.plan?.name || "Sem assinatura"} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Conta</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div><span className="font-medium text-gray-900">E-mail:</span> {data.profile.email || "—"}</div>
            <div><span className="font-medium text-gray-900">Telefone:</span> {data.profile.phone || "—"}</div>
            <div><span className="font-medium text-gray-900">Status:</span> {data.profile.blocked ? "Bloqueado" : "Ativo"}</div>
            <div><span className="font-medium text-gray-900">Atualização:</span> {formatDate(data.profile.updated_at)}</div>
            {data.profile.blocked_reason ? (
              <div><span className="font-medium text-gray-900">Motivo do bloqueio:</span> {data.profile.blocked_reason}</div>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Vínculo operacional</h2>
          {data.banca ? (
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <div><span className="font-medium text-gray-900">Banca:</span> {data.banca.name}</div>
              <div><span className="font-medium text-gray-900">Endereço:</span> {data.banca.address || "—"}</div>
              <div><span className="font-medium text-gray-900">WhatsApp:</span> {data.banca.whatsapp || "—"}</div>
              <div><span className="font-medium text-gray-900">Status da banca:</span> {data.banca.approved ? "Aprovada" : "Pendente"}</div>
              <div><span className="font-medium text-gray-900">Assinatura:</span> {data.subscription?.plan?.name || "Sem assinatura paga"}</div>
            </div>
          ) : (
            <div className="mt-4 text-sm text-gray-500">Esta conta segue o fluxo padrão do cliente final, sem vínculo operacional com banca.</div>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Pedidos recentes</h2>
          <Link href={"/admin/orders" as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
            Ver operação de pedidos
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {data.recent_orders.length > 0 ? (
            data.recent_orders.map((order) => (
              <div key={order.id} className="rounded-xl border border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-gray-900">Pedido #{order.id}</div>
                    <div className="text-xs text-gray-500">{formatDate(order.created_at)} · {order.status || "sem status"}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{formatCurrency(order.total)}</div>
                    <div className="text-xs text-gray-500">{order.payment_method || "—"}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <Link href={`/admin/orders/${order.id}` as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
                    Abrir pedido
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
              Nenhum pedido recente vinculado a esta conta.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

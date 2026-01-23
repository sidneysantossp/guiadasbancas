"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

type BancaListItem = {
  id: string;
  user_id?: string;
  name?: string | null;
  email?: string | null;
  address?: string | null;
  cep?: string | null;
  profile_image?: string | null;
  cover_image?: string | null;
  active?: boolean | null;
  approved?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  my_access_level?: "admin" | "collaborator" | string | null;
  my_relation?: "owner" | "member" | string | null;
  is_cotista?: boolean | null;
  cotista_codigo?: string | null;
};

export default function JornaleiroBancasPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [items, setItems] = useState<BancaListItem[]>([]);
  const [activeBancaId, setActiveBancaId] = useState<string | null>(null);
  const [accountAccessLevel, setAccountAccessLevel] = useState<"admin" | "collaborator">("admin");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canManageBancas = accountAccessLevel !== "collaborator";

  const tabs = useMemo(
    () => [
      { label: "Ver todas", href: "/jornaleiro/bancas" as Route, active: true },
      { label: "Cadastrar", href: "/jornaleiro/bancas/nova" as Route, active: false },
    ],
    []
  );

  const load = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/jornaleiro/bancas", { cache: "no-store", credentials: "include" });
      const text = await res.text();
      const json = JSON.parse(text);
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || `HTTP ${res.status}`);
      }
      setItems(json.items || []);
      setActiveBancaId(json.active_banca_id || null);
      setAccountAccessLevel((json.account_access_level as any) === "collaborator" ? "collaborator" : "admin");
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar bancas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setActive = async (bancaId: string, redirectToEdit?: boolean) => {
    try {
      setBusyId(bancaId);
      setError(null);
      const res = await fetch("/api/jornaleiro/bancas/active", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ banca_id: bancaId }),
      });
      const text = await res.text();
      const json = JSON.parse(text);
      if (!res.ok || !json?.success) throw new Error(json?.error || `HTTP ${res.status}`);

      setActiveBancaId(bancaId);
      const activeItem = items.find((it) => it.id === bancaId);
      if (activeItem && user?.id) {
        sessionStorage.setItem(`gb:banca:${user.id}`, JSON.stringify(activeItem));
      }
      window.dispatchEvent(new Event("banca-updated"));

      if (redirectToEdit) {
        router.push("/jornaleiro/banca-v2" as Route);
      }
    } catch (e: any) {
      setError(e?.message || "Erro ao selecionar banca");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Minhas Bancas</h1>
          <p className="text-sm text-gray-600">Gerencie e cadastre novas bancas vinculadas ao seu CPF/CNPJ.</p>
        </div>
        {canManageBancas && (
          <Link
            href={("/jornaleiro/bancas/nova" as Route)}
            className="rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            + Nova banca
          </Link>
        )}
      </div>

      <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
        {(canManageBancas ? tabs : tabs.filter((t) => t.href !== ("/jornaleiro/bancas/nova" as Route))).map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`px-3 py-2 text-sm rounded-md ${
              t.active ? "bg-[#fff7f2] text-[#ff5c00] font-semibold" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">Carregando...</div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
          Nenhuma banca encontrada para esta conta.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((b) => {
            const isSelected = activeBancaId === b.id;
            const address = b.address || "";
            return (
              <div key={b.id} className={`rounded-xl border bg-white p-4 ${isSelected ? "border-[#ff5c00]" : "border-gray-200"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-base font-semibold truncate">{b.name || "Banca"}</div>
                      {isSelected && (
                        <span className="rounded-full bg-[#ff5c00]/10 text-[#ff5c00] text-[11px] font-semibold px-2 py-0.5">
                          Banca ativa no painel
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-gray-600 line-clamp-2">{address}</div>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-gray-600">
                      {!b.approved && !b.active && (
                        <span className="rounded-full border border-yellow-300 bg-yellow-50 text-yellow-700 px-2 py-0.5">
                          Em aprovação
                        </span>
                      )}
                      {b.active && (
                        <span className="rounded-full border border-green-300 bg-green-50 text-green-700 px-2 py-0.5">
                          Banca Ativa
                        </span>
                      )}
                      {b.is_cotista && b.cotista_codigo && (
                        <span className="rounded-full border border-blue-300 bg-blue-50 text-blue-700 px-2 py-0.5">
                          Cota: {b.cotista_codigo}
                        </span>
                      )}
                    </div>
                  </div>
                  {!isSelected && (
                    <button
                      type="button"
                      onClick={() => setActive(b.id)}
                      disabled={busyId === b.id}
                      className="shrink-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                    >
                      {busyId === b.id ? "Aguarde..." : "Usar no painel"}
                    </button>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/bancas/${b.id}` as Route}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
                    title="Ver perfil público da banca"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver Banca
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      await setActive(b.id);
                      router.push(`/jornaleiro/bancas/${b.id}/editar` as Route);
                    }}
                    disabled={busyId === b.id}
                    className="flex-1 rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-3 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50"
                  >
                    {busyId === b.id ? "Aguarde..." : "Editar"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

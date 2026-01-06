"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState, useMemo } from "react";
import { IconPlus, IconEdit, IconTrash, IconCheck, IconX } from "@tabler/icons-react";

type Colaborador = {
  id: string;
  email: string;
  full_name: string | null;
  access_level: "admin" | "collaborator";
  active: boolean;
  created_at: string;
  bancas: { id: string; name: string }[];
  permissions: string[];
};

export default function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const tabs = useMemo(
    () => [
      { label: "Ver todos", href: "/jornaleiro/colaboradores" as Route, active: true },
      { label: "Cadastrar", href: "/jornaleiro/colaboradores/novo" as Route, active: false },
    ],
    []
  );

  const load = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/jornaleiro/colaboradores", { cache: "no-store", credentials: "include" });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || `HTTP ${res.status}`);
      }
      setColaboradores(json.colaboradores || []);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar colaboradores");
    } finally {
      setLoading(false);
    }
  };

  // Carregar colaboradores ao montar e quando houver mudanças
  useEffect(() => {
    load();
    
    // Recarregar quando a janela receber foco (usuário voltou da página de cadastro)
    const handleFocus = () => {
      console.log("[Colaboradores] Janela recebeu foco, recarregando...");
      load();
    };
    
    // Listener para evento customizado de atualização de colaboradores
    const handleColaboradoresUpdate = (event: Event) => {
      console.log("[Colaboradores] Evento de atualização recebido, recarregando...");
      load();
    };
    
    // Listener para storage event (sincronização entre abas)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'gb:colaboradores:updated') {
        console.log("[Colaboradores] Storage event recebido, recarregando...");
        load();
      }
    };
    
    // Listener para visibilitychange (usuário voltou para a aba)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Verificar se houve atualização enquanto a aba estava inativa
        const lastUpdate = localStorage.getItem('gb:colaboradores:updated');
        const lastChecked = sessionStorage.getItem('gb:colaboradores:lastChecked');
        
        if (lastUpdate && lastUpdate !== lastChecked) {
          console.log("[Colaboradores] Detectada atualização pendente, recarregando...");
          sessionStorage.setItem('gb:colaboradores:lastChecked', lastUpdate);
          load();
        }
      }
    };
    
    window.addEventListener("focus", handleFocus);
    window.addEventListener("colaboradores:updated", handleColaboradoresUpdate);
    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("colaboradores:updated", handleColaboradoresUpdate);
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este colaborador?")) return;
    
    try {
      setDeletingId(id);
      const res = await fetch(`/api/jornaleiro/colaboradores/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Erro ao remover colaborador");
      }
      setColaboradores((prev) => prev.filter((c) => c.id !== id));
      
      // Disparar evento para sincronizar entre abas
      localStorage.setItem('gb:colaboradores:updated', Date.now().toString());
    } catch (e: any) {
      alert(e?.message || "Erro ao remover colaborador");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Colaboradores</h1>
          <p className="text-sm text-gray-600">
            Gerencie os colaboradores que têm acesso às suas bancas.
          </p>
        </div>
        <Link
          href={"/jornaleiro/colaboradores/novo" as Route}
          className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          <IconPlus size={18} />
          Novo Colaborador
        </Link>
      </div>

      <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
        {tabs.map((t) => (
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

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5c00]"></div>
        </div>
      ) : colaboradores.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <div className="text-gray-400 mb-2">
            <IconPlus size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Nenhum colaborador cadastrado</h3>
          <p className="text-sm text-gray-600 mt-1">
            Adicione colaboradores para que possam gerenciar suas bancas.
          </p>
          <Link
            href={"/jornaleiro/colaboradores/novo" as Route}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            <IconPlus size={18} />
            Cadastrar Colaborador
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Colaborador
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nível de Acesso
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bancas
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {colaboradores.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">{c.full_name || "Sem nome"}</div>
                      <div className="text-sm text-gray-500">{c.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        c.access_level === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {c.access_level === "admin" ? "Administrador" : "Colaborador"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.bancas.length === 0 ? (
                        <span className="text-sm text-gray-400">Nenhuma</span>
                      ) : (
                        c.bancas.slice(0, 3).map((b) => (
                          <span
                            key={b.id}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700"
                          >
                            {b.name}
                          </span>
                        ))
                      )}
                      {c.bancas.length > 3 && (
                        <span className="text-xs text-gray-500">+{c.bancas.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {c.active ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                        <IconCheck size={16} /> Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400 text-sm">
                        <IconX size={16} /> Inativo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/jornaleiro/colaboradores/${c.id}` as Route}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"
                        title="Editar"
                      >
                        <IconEdit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={deletingId === c.id}
                        className="p-1.5 rounded-md hover:bg-red-50 text-red-600 disabled:opacity-50"
                        title="Remover"
                      >
                        <IconTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

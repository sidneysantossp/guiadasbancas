"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { IconAlertCircle, IconArrowLeft } from "@tabler/icons-react";
import { useAuth } from "@/lib/auth/AuthContext";

type Banca = {
  id: string;
  name: string;
};

const MODULES = [
  { key: "dashboard", label: "Dashboard", description: "Visualizar estatísticas gerais" },
  { key: "bancas", label: "Minhas Bancas", description: "Gerenciar bancas" },
  { key: "colaboradores", label: "Colaboradores", description: "Gerenciar colaboradores" },
  { key: "notificacoes", label: "Notificações", description: "Ver notificações" },
  { key: "pedidos", label: "Pedidos", description: "Gerenciar pedidos da banca" },
  { key: "produtos", label: "Produtos", description: "Gerenciar catálogo de produtos" },
  { key: "catalogo", label: "Catálogo Distribuidor", description: "Acessar catálogo de distribuidores" },
  { key: "campanhas", label: "Campanhas", description: "Criar e gerenciar campanhas" },
  { key: "distribuidores", label: "Distribuidores", description: "Gerenciar distribuidores" },
  { key: "cupons", label: "Cupons", description: "Criar e gerenciar cupons" },
  { key: "relatorios", label: "Relatórios", description: "Visualizar relatórios e analytics" },
  { key: "academy", label: "Academy", description: "Acessar conteúdos educacionais" },
  { key: "configuracoes", label: "Configurações", description: "Alterar configurações da banca" },
];

export default function EditarColaboradorPage() {
  const router = useRouter();
  const params = useParams();
  const { profile } = useAuth();
  const colaboradorId = params.id as string;

  const [bancas, setBancas] = useState<Banca[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  
  // Verificar se o usuário logado é admin
  const isCurrentUserAdmin = (profile as any)?.jornaleiro_access_level === "admin";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState<"admin" | "collaborator">("collaborator");
  const [selectedBancas, setSelectedBancas] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar bancas disponíveis
        const bancasRes = await fetch("/api/jornaleiro/bancas", { credentials: "include" });
        const bancasJson = await bancasRes.json();
        if (bancasJson?.success && bancasJson?.items) {
          setBancas(bancasJson.items.map((b: any) => ({ id: b.id, name: b.name || "Sem nome" })));
        }

        // Carregar dados do colaborador
        const colabRes = await fetch(`/api/jornaleiro/colaboradores/${colaboradorId}`, { credentials: "include" });
        const colabJson = await colabRes.json();
        
        if (!colabRes.ok || !colabJson?.success) {
          if (colabRes.status === 404) {
            setNotFound(true);
          } else {
            throw new Error(colabJson?.error || "Erro ao carregar colaborador");
          }
          return;
        }

        const colab = colabJson.colaborador;
        setFullName(colab.full_name || "");
        setEmail(colab.email || "");
        setAccessLevel(colab.access_level || "collaborator");
        setSelectedBancas(colab.bancas?.map((b: any) => b.id) || []);
        
        // Pegar permissões da PRIMEIRA banca selecionada (cada banca agora tem suas próprias permissões)
        const firstBanca = colab.bancas?.[0];
        const bancaPermissions = firstBanca?.permissions || colab.permissions || [];
        console.log("[EditColaborador] Permissões da banca:", firstBanca?.name, bancaPermissions);
        setPermissions(bancaPermissions);
      } catch (e: any) {
        console.error("Erro ao carregar dados:", e);
        setError(e?.message || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [colaboradorId]);

  const toggleBanca = (bancaId: string) => {
    setSelectedBancas((prev) =>
      prev.includes(bancaId) ? prev.filter((id) => id !== bancaId) : [...prev, bancaId]
    );
  };

  const togglePermission = (key: string) => {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Informe o nome completo do colaborador.");
      return;
    }
    if (selectedBancas.length === 0) {
      setError("Selecione pelo menos uma banca.");
      return;
    }

    try {
      setSaving(true);
      
      const payload = {
        full_name: fullName.trim(),
        access_level: accessLevel,
        banca_ids: selectedBancas,
        permissions: accessLevel === "admin" ? MODULES.map((m) => m.key) : permissions,
      };
      
      console.log("[EditColaborador] Enviando payload:", payload);
      
      const res = await fetch(`/api/jornaleiro/colaboradores/${colaboradorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      console.log("[EditColaborador] Resposta da API:", json);
      
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Erro ao atualizar colaborador");
      }

      setSuccessMessage("✅ Dados do colaborador atualizados com sucesso!");
      
      // Disparar evento customizado para atualizar a lista em tempo real
      window.dispatchEvent(new CustomEvent('colaboradores:updated', { detail: { action: 'updated', id: colaboradorId } }));
      
      // Atualizar localStorage para sincronizar entre abas
      localStorage.setItem('gb:colaboradores:updated', Date.now().toString());
      
      // Disparar evento para atualizar permissões do colaborador (se ele estiver logado em outra aba)
      localStorage.setItem('gb:permissions:updated', Date.now().toString());
      
      setTimeout(() => {
        router.push("/jornaleiro/colaboradores");
      }, 1500);
    } catch (e: any) {
      setError(e?.message || "Erro ao atualizar colaborador");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5c00]"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <IconAlertCircle size={20} />
          Colaborador não encontrado.
        </div>
        <Link
          href={"/jornaleiro/colaboradores" as Route}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <IconArrowLeft size={18} />
          Voltar para lista
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link
          href={"/jornaleiro/colaboradores" as Route}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"
        >
          <IconArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold">Editar Colaborador</h1>
          <p className="text-sm text-gray-600">{email}</p>
        </div>
      </div>

      {successMessage && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 font-medium">
          {successMessage}
        </div>
      )}

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
            <div className="text-sm font-semibold">Dados do Colaborador</div>
            <div>
              <label className="text-sm font-medium">Nome completo <span className="text-red-500">*</span></label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="Ex: João Silva" required />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input value={email} disabled className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500" />
              <p className="mt-1 text-xs text-gray-500">O email não pode ser alterado.</p>
            </div>
            <div>
              <label className="text-sm font-medium">Nível de acesso</label>
              <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value as any)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                <option value="admin" disabled={!isCurrentUserAdmin}>Administrador (acesso total)</option>
                <option value="collaborator">Colaborador (acesso restrito)</option>
              </select>
              {!isCurrentUserAdmin && (
                <p className="mt-1 text-xs text-amber-600">
                  ⚠️ Apenas jornaleiros com perfil Administrador podem promover outros para administrador.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
            <div className="text-sm font-semibold">Bancas com Acesso <span className="text-red-500">*</span></div>
            <p className="text-xs text-gray-500">Selecione as bancas que este colaborador poderá gerenciar.</p>
            {bancas.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma banca encontrada.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {bancas.map((b) => (
                  <label key={b.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" checked={selectedBancas.includes(b.id)} onChange={() => toggleBanca(b.id)} className="rounded border-gray-300 text-[#ff5c00] focus:ring-[#ff5c00]" />
                    <span className="text-sm">{b.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {accessLevel === "collaborator" && (
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Permissões</div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setPermissions(MODULES.map((m) => m.key))} className="text-xs text-[#ff5c00] hover:underline">Marcar todos</button>
                  <button type="button" onClick={() => setPermissions([])} className="text-xs text-gray-500 hover:underline">Desmarcar todos</button>
                </div>
              </div>
              <p className="text-xs text-gray-500">Selecione os módulos que o colaborador terá acesso.</p>
              <div className="space-y-2">
                {MODULES.map((m) => (
                  <label key={m.key} className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" checked={permissions.includes(m.key)} onChange={() => togglePermission(m.key)} className="mt-0.5 rounded border-gray-300 text-[#ff5c00] focus:ring-[#ff5c00]" />
                    <div>
                      <div className="text-sm font-medium">{m.label}</div>
                      <div className="text-xs text-gray-500">{m.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button type="submit" disabled={saving} className="w-full rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50">
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>

          <Link href={"/jornaleiro/colaboradores" as Route} className="block w-full text-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

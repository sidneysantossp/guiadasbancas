"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IconAlertCircle, IconCheck, IconEye, IconEyeOff } from "@tabler/icons-react";

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

export default function NovoColaboradorPage() {
  const router = useRouter();
  const [bancas, setBancas] = useState<Banca[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [accessLevel, setAccessLevel] = useState<"admin" | "collaborator">("collaborator");
  const [selectedBancas, setSelectedBancas] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>(MODULES.map((m) => m.key));

  // Estado para verificação de email
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);

  // Estado para mostrar/esconder senha
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // Máscara de telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhatsapp(formatPhone(e.target.value));
  };

  // Debounce para verificação de email
  const checkEmail = useCallback(async (emailToCheck: string) => {
    const trimmed = emailToCheck.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailExists(false);
      setEmailChecked(false);
      return;
    }

    setEmailChecking(true);
    try {
      const res = await fetch(`/api/jornaleiro/colaboradores/check-email?email=${encodeURIComponent(trimmed)}`, {
        credentials: "include",
      });
      const json = await res.json();
      setEmailExists(json?.exists || false);
      setEmailChecked(true);
    } catch (e) {
      console.error("Erro ao verificar email:", e);
      setEmailChecked(false);
    } finally {
      setEmailChecking(false);
    }
  }, []);

  // Verificar email quando mudar (com debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (email.trim()) {
        checkEmail(email);
      } else {
        setEmailExists(false);
        setEmailChecked(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [email, checkEmail]);

  const tabs = useMemo(
    () => [
      { label: "Ver todos", href: "/jornaleiro/colaboradores" as Route, active: false },
      { label: "Cadastrar", href: "/jornaleiro/colaboradores/novo" as Route, active: true },
    ],
    []
  );

  useEffect(() => {
    const loadBancas = async () => {
      try {
        const res = await fetch("/api/jornaleiro/bancas", { credentials: "include" });
        const json = await res.json();
        if (json?.success && json?.items) {
          setBancas(json.items.map((b: any) => ({ id: b.id, name: b.name || "Sem nome" })));
        }
      } catch (e) {
        console.error("Erro ao carregar bancas:", e);
      } finally {
        setLoading(false);
      }
    };
    loadBancas();
  }, []);

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
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Informe um email válido.");
      return;
    }
    if (emailExists) {
      setError("Este email já está cadastrado na plataforma.");
      return;
    }
    if (!password || password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("A confirmação de senha não confere.");
      return;
    }
    if (selectedBancas.length === 0) {
      setError("Selecione pelo menos uma banca.");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/jornaleiro/colaboradores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          whatsapp: whatsapp.trim() || null,
          password,
          access_level: accessLevel,
          banca_ids: selectedBancas,
          permissions: accessLevel === "admin" ? MODULES.map((m) => m.key) : permissions,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Erro ao cadastrar colaborador");
      }

      setSuccessMessage("✅ Colaborador cadastrado com sucesso!");
      setTimeout(() => {
        router.push("/jornaleiro/colaboradores");
      }, 2000);
    } catch (e: any) {
      setError(e?.message || "Erro ao cadastrar colaborador");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Cadastrar Colaborador</h1>
        <p className="text-sm text-gray-600">Adicione um novo colaborador para gerenciar suas bancas.</p>
      </div>

      <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
        {tabs.map((t) => (
          <Link key={t.href} href={t.href} className={`px-3 py-2 text-sm rounded-md ${t.active ? "bg-[#fff7f2] text-[#ff5c00] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
            {t.label}
          </Link>
        ))}
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
              <label className="text-sm font-medium">Email <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-1 w-full rounded-md border px-3 py-2 text-sm pr-10 ${
                    emailExists ? "border-red-300 bg-red-50" : emailChecked && !emailExists ? "border-green-300" : "border-gray-300"
                  }`}
                  placeholder="colaborador@exemplo.com"
                  required
                />
                {emailChecking && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                  </div>
                )}
                {!emailChecking && emailChecked && emailExists && (
                  <IconAlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 h-5 w-5 text-red-500" />
                )}
                {!emailChecking && emailChecked && !emailExists && (
                  <IconCheck className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 h-5 w-5 text-green-500" />
                )}
              </div>
              {emailExists ? (
                <p className="mt-1 text-xs text-red-600 font-medium">Este email já está cadastrado na plataforma.</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">Este será o email de login do colaborador.</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">WhatsApp</label>
              <input
                value={whatsapp}
                onChange={handleWhatsappChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="(11) 99999-9999"
                maxLength={16}
              />
              <p className="mt-1 text-xs text-gray-500">Número para contato e notificações (opcional).</p>
            </div>
            <div>
              <label className="text-sm font-medium">Senha <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm pr-10"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Confirmar senha <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-gray-600"
                >
                  {showPasswordConfirm ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Nível de acesso</label>
              <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value as any)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                <option value="admin">Administrador (acesso total)</option>
                <option value="collaborator">Colaborador (acesso restrito)</option>
              </select>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
            <div className="text-sm font-semibold">Bancas com Acesso <span className="text-red-500">*</span></div>
            <p className="text-xs text-gray-500">Selecione as bancas que este colaborador poderá gerenciar.</p>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#ff5c00]"></div>
              </div>
            ) : bancas.length === 0 ? (
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
            {saving ? "Salvando..." : "Cadastrar Colaborador"}
          </button>

          <Link href={"/jornaleiro/colaboradores" as Route} className="block w-full text-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">
            Voltar
          </Link>
        </div>
      </form>
    </div>
  );
}

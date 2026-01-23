"use client";

import Link from "next/link";
import type { Route } from "next";
import { useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import FileUploadDragDrop from "@/components/common/FileUploadDragDrop";
import { formatCep, isValidCep, resolveCepToLocation } from "@/lib/location";
import { useAuth } from "@/lib/auth/AuthContext";

type Day = { key: string; label: string; open: boolean; start: string; end: string };

const DEFAULT_HOURS: Day[] = [
  { key: "mon", label: "Segunda", open: true, start: "08:00", end: "18:00" },
  { key: "tue", label: "Terça", open: true, start: "08:00", end: "18:00" },
  { key: "wed", label: "Quarta", open: true, start: "08:00", end: "18:00" },
  { key: "thu", label: "Quinta", open: true, start: "08:00", end: "18:00" },
  { key: "fri", label: "Sexta", open: true, start: "08:00", end: "18:00" },
  { key: "sat", label: "Sábado", open: true, start: "08:00", end: "13:00" },
  { key: "sun", label: "Domingo", open: false, start: "09:00", end: "12:00" },
];

export default function JornaleiroNovaBancaPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [hours, setHours] = useState<Day[]>(DEFAULT_HOURS);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const numberInputRef = useRef<HTMLInputElement>(null);
  
  // Campos de acesso (opcional - para criar usuário que gerenciará a banca)
  const [accessEmail, setAccessEmail] = useState("");
  const [accessPassword, setAccessPassword] = useState("");
  const [accessPasswordConfirm, setAccessPasswordConfirm] = useState("");
  const [accessFullName, setAccessFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // Lista de estados brasileiros
  const ESTADOS_BR = [
    { sigla: "AC", nome: "Acre" },
    { sigla: "AL", nome: "Alagoas" },
    { sigla: "AP", nome: "Amapá" },
    { sigla: "AM", nome: "Amazonas" },
    { sigla: "BA", nome: "Bahia" },
    { sigla: "CE", nome: "Ceará" },
    { sigla: "DF", nome: "Distrito Federal" },
    { sigla: "ES", nome: "Espírito Santo" },
    { sigla: "GO", nome: "Goiás" },
    { sigla: "MA", nome: "Maranhão" },
    { sigla: "MT", nome: "Mato Grosso" },
    { sigla: "MS", nome: "Mato Grosso do Sul" },
    { sigla: "MG", nome: "Minas Gerais" },
    { sigla: "PA", nome: "Pará" },
    { sigla: "PB", nome: "Paraíba" },
    { sigla: "PR", nome: "Paraná" },
    { sigla: "PE", nome: "Pernambuco" },
    { sigla: "PI", nome: "Piauí" },
    { sigla: "RJ", nome: "Rio de Janeiro" },
    { sigla: "RN", nome: "Rio Grande do Norte" },
    { sigla: "RS", nome: "Rio Grande do Sul" },
    { sigla: "RO", nome: "Rondônia" },
    { sigla: "RR", nome: "Roraima" },
    { sigla: "SC", nome: "Santa Catarina" },
    { sigla: "SP", nome: "São Paulo" },
    { sigla: "SE", nome: "Sergipe" },
    { sigla: "TO", nome: "Tocantins" },
  ];

  const isCollaborator = (profile as any)?.jornaleiro_access_level === "collaborator";

  const tabs = useMemo(
    () => [
      { label: "Ver todas", href: "/jornaleiro/bancas" as Route, active: false },
      { label: "Cadastrar", href: "/jornaleiro/bancas/nova" as Route, active: true },
    ],
    []
  );

  const toggleDay = (key: string) => setHours((prev) => prev.map((d) => (d.key === key ? { ...d, open: !d.open } : d)));
  const setStart = (key: string, v: string) => setHours((prev) => prev.map((d) => (d.key === key ? { ...d, start: v } : d)));
  const setEnd = (key: string, v: string) => setHours((prev) => prev.map((d) => (d.key === key ? { ...d, end: v } : d)));

  const resolveCep = async (cepValue?: string) => {
    try {
      setError(null);
      const c = formatCep(cepValue || cep);
      if (!isValidCep(c)) {
        return;
      }
      setLoadingCep(true);
      const loc = await resolveCepToLocation(c);
      setCity(loc.city || city);
      setUf((loc.state || uf || "").toUpperCase());
      if (loc.street) setStreet(loc.street);
      if (loc.neighborhood) setNeighborhood(loc.neighborhood);
      setLat(loc.lat);
      setLng(loc.lng);
      // Focar no campo número após buscar CEP
      setTimeout(() => {
        numberInputRef.current?.focus();
      }, 100);
    } catch (e: any) {
      setError(e?.message || "Não foi possível obter dados do CEP.");
    } finally {
      setLoadingCep(false);
    }
  };

  // Busca automática de CEP quando tiver 8 dígitos
  useEffect(() => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      resolveCep(cleanCep);
    }
  }, [cep]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isCollaborator) {
      setError("Apenas administradores podem cadastrar novas bancas.");
      return;
    }

    if (!name.trim()) {
      setError("Informe o nome da banca.");
      return;
    }

    if (!whatsapp.trim()) {
      setError("Informe o WhatsApp da banca. Este será o número pelo qual os clientes entrarão em contato.");
      return;
    }

    const cepFormatted = formatCep(cep);
    if (!isValidCep(cepFormatted)) {
      setError("Informe um CEP válido.");
      return;
    }

    if (!street.trim() || !city.trim() || !uf.trim()) {
      setError("Informe endereço completo (rua, cidade e UF).");
      return;
    }

    // Validar campos de acesso (se preenchidos)
    if (accessEmail.trim() || accessPassword.trim()) {
      if (!accessEmail.trim()) {
        setError("Informe o email do usuário que gerenciará a banca.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accessEmail.trim())) {
        setError("Informe um email válido.");
        return;
      }
      if (!accessPassword.trim()) {
        setError("Informe a senha do usuário.");
        return;
      }
      if (accessPassword.length < 6) {
        setError("A senha deve ter no mínimo 6 caracteres.");
        return;
      }
      if (accessPassword !== accessPasswordConfirm) {
        setError("As senhas não conferem.");
        return;
      }
    }

    for (const d of hours) {
      if (d.open) {
        if (!d.start || !d.end) {
          setError(`Defina início e fim para ${d.label}.`);
          return;
        }
        if (d.start >= d.end) {
          setError(`O horário de ${d.label} está inválido (início deve ser antes do fim).`);
          return;
        }
      }
    }

    const addressParts = [
      number.trim() 
        ? `${street.trim()}, ${number.trim()}${complement.trim() ? " - " + complement.trim() : ""}`
        : `${street.trim()}${complement.trim() ? " - " + complement.trim() : ""}`,
      neighborhood.trim() ? neighborhood.trim() : null,
      `${city.trim()} - ${uf.trim().toUpperCase()}`,
    ].filter(Boolean);

    const address = addressParts.join(", ");

    try {
      setSaving(true);
      const res = await fetch("/api/jornaleiro/bancas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          banca: {
            name: name.trim(),
            whatsapp: whatsapp.trim(),
            cep: cepFormatted,
            address,
            lat: lat ?? -23.5505,
            lng: lng ?? -46.6333,
            cover_image: coverImage || null,
            profile_image: profileImage || null,
            hours,
            payment_methods: ["pix", "dinheiro"],
          },
          access: accessEmail.trim() ? {
            email: accessEmail.trim(),
            password: accessPassword,
            full_name: accessFullName.trim() || null,
            access_level: "admin",
          } : null,
        }),
      });

      const text = await res.text();
      const json = JSON.parse(text);
      if (!res.ok || !json?.success) throw new Error(json?.error || `HTTP ${res.status}`);

      // A banca recém-criada vira a ativa; redirecionar para edição completa
      window.dispatchEvent(new Event("banca-updated"));
      router.push("/jornaleiro/banca-v2" as Route);
    } catch (e: any) {
      setError(e?.message || "Falha ao cadastrar banca.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Cadastrar nova banca</h1>
        <p className="text-sm text-gray-600">
          Use este formulário para cadastrar outra banca no seu CPF/CNPJ. Após salvar, você poderá completar os dados na
          tela de edição.
        </p>
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

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4 rounded-lg border border-gray-200 bg-white p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Nome da banca</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ex: Banca Germânia"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">WhatsApp da banca <span className="text-red-500">*</span></label>
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="(11) 99999-9999"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Este será o número pelo qual os clientes entrarão em contato com sua banca.</p>
            </div>
          </div>

          {/* Seção de Acesso (Opcional) */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-3">
            <div>
              <div className="text-sm font-semibold text-blue-900">Acesso à Banca (Opcional)</div>
              <div className="text-xs text-blue-700 mt-1">
                Preencha estes campos se deseja criar um usuário para que outra pessoa gerencie esta banca.
                Se deixar em branco, você mesmo será o responsável.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Nome completo do responsável</label>
                <input
                  value={accessFullName}
                  onChange={(e) => setAccessFullName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Ex: João da Silva"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Email de acesso</label>
                <input
                  type="email"
                  value={accessEmail}
                  onChange={(e) => setAccessEmail(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-sm font-medium text-gray-700">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={accessPassword}
                    onChange={(e) => setAccessPassword(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="md:col-span-1">
                <label className="text-sm font-medium text-gray-700">Confirmar senha</label>
                <div className="relative">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    value={accessPasswordConfirm}
                    onChange={(e) => setAccessPasswordConfirm(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm"
                    placeholder="Digite a senha novamente"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswordConfirm ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Endereço</div>
                <div className="text-xs text-gray-500">Preencha CEP e número; ajusta os demais campos se necessário.</div>
              </div>
              <button
                type="button"
                onClick={() => resolveCep()}
                disabled={loadingCep}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                {loadingCep ? "Buscando..." : "Buscar CEP"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">CEP</label>
                <input
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="00000-000"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Número (opcional)</label>
                <input
                  ref={numberInputRef}
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Ex: 123 ou Em frente ao banco"
                />
              </div>
              <div className="md:col-span-4">
                <label className="text-sm font-medium">Rua</label>
                <input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div className="md:col-span-4">
                <label className="text-sm font-medium">Complemento (opcional)</label>
                <input
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Bairro</label>
                <input
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-sm font-medium">Cidade</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-sm font-medium">UF</label>
                <select
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
                >
                  <option value="">Selecione</option>
                  {ESTADOS_BR.map((estado) => (
                    <option key={estado.sigla} value={estado.sigla}>
                      {estado.sigla}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 space-y-3">
            <div className="text-sm font-semibold">Horários de funcionamento</div>
            <div className="rounded-xl border border-gray-200">
              <div className="divide-y divide-gray-100">
                {hours.map((d) => (
                  <div key={d.key} className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 p-2">
                    <label className="sm:col-span-3 text-sm text-gray-700">{d.label}</label>
                    <label className="sm:col-span-2 inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={d.open} onChange={() => toggleDay(d.key)} /> Aberto
                    </label>
                    <div className="sm:col-span-3">
                      <input
                        type="time"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:text-gray-400"
                        value={d.start}
                        onChange={(e) => setStart(d.key, e.target.value)}
                        disabled={!d.open}
                      />
                    </div>
                    <span className="sm:col-span-1 text-center text-sm text-gray-500">até</span>
                    <div className="sm:col-span-3">
                      <input
                        type="time"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:text-gray-400"
                        value={d.end}
                        onChange={(e) => setEnd(d.key, e.target.value)}
                        disabled={!d.open}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
            <div className="text-sm font-semibold">Imagens (opcional)</div>
            <FileUploadDragDrop
              label="Imagem de capa"
              value={coverImage}
              onChange={setCoverImage}
              accept="image/*"
              role="jornaleiro"
            />
            <FileUploadDragDrop
              label="Logo / Foto de perfil"
              value={profileImage}
              onChange={setProfileImage}
              accept="image/*"
              role="jornaleiro"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Cadastrar banca"}
          </button>

          <Link
            href={("/jornaleiro/bancas" as Route)}
            className="block w-full text-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
          >
            Voltar
          </Link>
        </div>
      </form>
    </div>
  );
}

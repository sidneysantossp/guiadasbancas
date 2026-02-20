"use client";

import Link from "next/link";
import type { Route } from "next";
import { useMemo, useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import FileUploadDragDrop from "@/components/common/FileUploadDragDrop";
import { formatCep, isValidCep, resolveCepToLocation } from "@/lib/location";
import { useAuth } from "@/lib/auth/AuthContext";
import CotistaSearch from "@/components/CotistaSearch";

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

export default function JornaleiroEditarBancaPage() {
  const router = useRouter();
  const params = useParams();
  const bancaId = params.id as string;
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
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
  
  // Cotista / TPU
  const [isCotista, setIsCotista] = useState(false);
  const [cotistaDirty, setCotistaDirty] = useState(false);
  const [selectedCotista, setSelectedCotista] = useState<{
    id: string;
    codigo: string;
    razao_social: string;
    cnpj_cpf: string;
    telefone?: string;
    cidade?: string;
    estado?: string;
  } | null>(null);

  // Campos para alterar senha (opcional)
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);

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
      { label: "Editar", href: "#" as Route, active: true },
    ],
    []
  );

  // Carregar dados da banca existente
  useEffect(() => {
    const loadBanca = async () => {
      try {
        const res = await fetch(`/api/jornaleiro/banca?ts=${Date.now()}`, {
          cache: "no-store",
          credentials: "include",
        });
        
        if (!res.ok) throw new Error("Erro ao carregar banca");
        
        const json = await res.json();
        const banca = json.data;
        
        if (!banca) throw new Error("Banca não encontrada");
        
        // Preencher formulário com dados da banca
        setName(banca.name || "");
        setWhatsapp(banca.contact?.whatsapp || banca.whatsapp || "");
        setCep(banca.addressObj?.cep || banca.cep || "");
        setStreet(banca.addressObj?.street || "");
        setNumber(banca.addressObj?.number || "");
        setComplement(banca.addressObj?.complement || "");
        setNeighborhood(banca.addressObj?.neighborhood || "");
        setCity(banca.addressObj?.city || "");
        setUf(banca.addressObj?.uf || "");
        setCoverImage(banca.cover_image || "");
        setProfileImage(banca.profile_image || "");
        setLat(banca.location?.lat || null);
        setLng(banca.location?.lng || null);
        
        // Carregar horários se existirem
        if (banca.hours && Array.isArray(banca.hours) && banca.hours.length > 0) {
          setHours(banca.hours);
        }

        // Carregar dados de cotista
        setIsCotista(banca.is_cotista || false);
        if (banca.cotista_id) {
          setSelectedCotista({
            id: banca.cotista_id,
            codigo: banca.cotista_codigo || '',
            razao_social: banca.cotista_razao_social || '',
            cnpj_cpf: banca.cotista_cnpj_cpf || '',
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar banca:", error);
        setError("Erro ao carregar dados da banca");
        setLoading(false);
      }
    };

    if (bancaId) {
      loadBanca();
    }
  }, [bancaId]);

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

    // Validar alteração de senha (se preenchida)
    if (newPassword.trim()) {
      if (newPassword.length < 6) {
        setError("A nova senha deve ter no mínimo 6 caracteres.");
        return;
      }
      if (newPassword !== newPasswordConfirm) {
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
      const res = await fetch(`/api/jornaleiro/bancas/${bancaId}`, {
        method: "PUT",
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
            is_cotista: isCotista,
            cotista_id: selectedCotista?.id || null,
            cotista_codigo: selectedCotista?.codigo || null,
            cotista_razao_social: selectedCotista?.razao_social || null,
            cotista_cnpj_cpf: selectedCotista?.cnpj_cpf || null,
          },
          newPassword: newPassword.trim() || null,
        }),
      });

      const text = await res.text();
      const json = JSON.parse(text);
      if (!res.ok || !json?.success) throw new Error(json?.error || `HTTP ${res.status}`);

      // Banca atualizada; redirecionar para lista
      window.dispatchEvent(new Event("banca-updated"));
      router.push("/jornaleiro/bancas" as Route);
    } catch (e: any) {
      setError(e?.message || "Falha ao atualizar banca.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5c00] mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Carregando dados da banca...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Editar banca</h1>
        <p className="text-sm text-gray-600">
          Atualize as informações da sua banca.
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

          {/* Seção de Alteração de Senha */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-3">
            <div>
              <div className="text-sm font-semibold text-blue-900">Alterar Senha (Opcional)</div>
              <div className="text-xs text-blue-700 mt-1">
                <p>Deixe em branco se não quiser alterar a senha de acesso.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-1">
                <label className="text-sm font-medium text-gray-700">Nova senha</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
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
                <label className="text-sm font-medium text-gray-700">Confirmar nova senha</label>
                <div className="relative">
                  <input
                    type={showNewPasswordConfirm ? "text" : "password"}
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm"
                    placeholder="Digite a senha novamente"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPasswordConfirm(!showNewPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPasswordConfirm ? (
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

          {/* Seção Cotista / TPU */}
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 space-y-3">
            <div>
              <div className="text-sm font-semibold text-orange-900">Cota Ativa (TPU)</div>
              <div className="text-xs text-orange-700 mt-1">Vincule sua banca a uma cota ativa para que os produtos do distribuidor apareçam no seu perfil.</div>
            </div>

            <div className="flex gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!isCotista}
                  onChange={() => { setIsCotista(false); setSelectedCotista(null); setCotistaDirty(true); }}
                  className="h-4 w-4 text-[#ff5c00] focus:ring-[#ff5c00]"
                />
                <span className="text-sm text-gray-700">Não sou cotista</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={isCotista}
                  onChange={() => setIsCotista(true)}
                  className="h-4 w-4 text-[#ff5c00] focus:ring-[#ff5c00]"
                />
                <span className="text-sm text-gray-700">Sou Banca PRIME</span>
              </label>
            </div>

            {isCotista && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Cota Ativa</label>
                  <CotistaSearch
                    mode="public"
                    onSelect={(cotista) => {
                      setSelectedCotista(cotista);
                      setCotistaDirty(true);
                    }}
                    onInputChange={(value) => {
                      if (value.trim()) setCotistaDirty(true);
                      else setCotistaDirty(false);
                    }}
                    selectedCnpjCpf={selectedCotista?.cnpj_cpf}
                  />
                </div>

                {selectedCotista && (
                  <div className="bg-white rounded-lg border border-orange-300 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">✓ Cotista Selecionado</h3>
                      <span className="text-xs font-semibold text-[#ff5c00] bg-orange-100 px-2 py-1 rounded">#{selectedCotista.codigo}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Razão Social:</span>
                        <p className="font-medium text-gray-900">{selectedCotista.razao_social}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">CNPJ/CPF:</span>
                        <p className="font-medium text-gray-900 font-mono">{selectedCotista.cnpj_cpf}</p>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded p-2 mt-1">
                      <p className="text-xs text-green-800">✅ Sua banca terá acesso ao catálogo de produtos dos distribuidores cadastrados.</p>
                    </div>
                  </div>
                )}

                {isCotista && !selectedCotista && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <p className="text-xs text-yellow-800">⚠️ Digite seu CPF, CNPJ ou número da cota para vincular sua banca.</p>
                  </div>
                )}
              </div>
            )}
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
            {saving ? "Salvando..." : "Salvar alterações"}
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

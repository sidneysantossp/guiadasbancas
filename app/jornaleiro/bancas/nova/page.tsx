"use client";

import Link from "next/link";
import type { Route } from "next";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import FileUploadDragDrop from "@/components/common/FileUploadDragDrop";
import { formatCep, isValidCep, resolveCepToLocation } from "@/lib/location";

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

  const resolveCep = async () => {
    try {
      setError(null);
      const c = formatCep(cep);
      if (!isValidCep(c)) {
        setError("Informe um CEP válido.");
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
    } catch (e: any) {
      setError(e?.message || "Não foi possível obter dados do CEP.");
    } finally {
      setLoadingCep(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Informe o nome da banca.");
      return;
    }

    const cepFormatted = formatCep(cep);
    if (!isValidCep(cepFormatted)) {
      setError("Informe um CEP válido.");
      return;
    }

    if (!number.trim() || !street.trim() || !city.trim() || !uf.trim()) {
      setError("Informe endereço completo (rua, número, cidade e UF).");
      return;
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
      `${street.trim()}, ${number.trim()}${complement.trim() ? " - " + complement.trim() : ""}`,
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
            whatsapp: whatsapp || null,
            cep: cepFormatted,
            address,
            lat: lat ?? -23.5505,
            lng: lng ?? -46.6333,
            cover_image: coverImage || null,
            profile_image: profileImage || null,
            hours,
            payment_methods: ["pix", "dinheiro"],
          },
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
              <label className="text-sm font-medium">WhatsApp da banca (opcional)</label>
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="(11) 99999-9999"
              />
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
                onClick={resolveCep}
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
                <label className="text-sm font-medium">Número</label>
                <input
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
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
                <input
                  value={uf}
                  onChange={(e) => setUf(e.target.value.toUpperCase())}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  maxLength={2}
                  required
                />
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

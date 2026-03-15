"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut as nextAuthSignOut, useSession } from "next-auth/react";
import MinhaContaSidebar from "@/components/minha-conta/MinhaContaSidebar";

type AccountAddress = {
  id: string;
  label: string;
  recipient_name: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  uf: string;
  cep: string;
  phone: string;
  instructions: string;
  is_default: boolean;
};

type AccountProfile = {
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  created_at: string | null;
};

function EditAddressPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const editingId = searchParams?.get("id") || null;

  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [addresses, setAddresses] = useState<AccountAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const [label, setLabel] = useState("Casa");
  const [recipientName, setRecipientName] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [cep, setCep] = useState("");
  const [complement, setComplement] = useState("");
  const [phone, setPhone] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const editingAddress = useMemo(
    () => addresses.find((address) => address.id === editingId) || null,
    [addresses, editingId],
  );

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace("/entrar/cliente");
    }
  }, [router, status]);

  useEffect(() => {
    if (status !== "authenticated") return;

    let active = true;
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [profileResponse, addressesResponse] = await Promise.all([
          fetch("/api/minha-conta/profile", {
            credentials: "include",
            cache: "no-store",
          }),
          fetch("/api/minha-conta/addresses", {
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        const [profileJson, addressesJson] = await Promise.all([
          profileResponse.json().catch(() => null),
          addressesResponse.json().catch(() => null),
        ]);

        if (!active) return;

        if (profileResponse.ok && profileJson?.success) {
          setProfile(profileJson.data?.profile || null);
        }

        if (addressesResponse.ok && addressesJson?.success) {
          setAddresses(addressesJson.data || []);
        } else {
          setAddresses([]);
        }
      } catch (fetchError: any) {
        if (active) setError(fetchError?.message || "Nao foi possivel carregar os enderecos");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [status]);

  useEffect(() => {
    if (editingAddress) {
      setLabel(editingAddress.label || "Casa");
      setRecipientName(editingAddress.recipient_name || "");
      setStreet(editingAddress.street || "");
      setNumber(editingAddress.number || "");
      setNeighborhood(editingAddress.neighborhood || "");
      setCity(editingAddress.city || "");
      setUf(editingAddress.uf || "");
      setCep(editingAddress.cep || "");
      setComplement(editingAddress.complement || "");
      setPhone(editingAddress.phone || "");
      setInstructions(editingAddress.instructions || "");
      setIsDefault(Boolean(editingAddress.is_default));
      setCepError(null);
      setError(null);
      return;
    }

    setLabel("Casa");
    setRecipientName(profile?.full_name || session?.user?.name || "");
    setStreet("");
    setNumber("");
    setNeighborhood("");
    setCity("");
    setUf("");
    setCep("");
    setComplement("");
    setPhone(profile?.phone || "");
    setInstructions("");
    setIsDefault(addresses.length === 0);
    setCepError(null);
    setError(null);
  }, [addresses.length, editingAddress, profile?.full_name, profile?.phone, session?.user?.name]);

  useEffect(() => {
    const digits = (cep || "").replace(/\D+/g, "");
    setCepError(null);
    if (digits.length !== 8) return;

    let cancelled = false;
    const run = async () => {
      try {
        setCepLoading(true);
        const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const data = await response.json();

        if (cancelled) return;
        if (!data || data.erro) {
          setCepError("CEP nao encontrado");
          return;
        }

        setStreet(data.logradouro || "");
        setNeighborhood(data.bairro || "");
        setCity(data.localidade || "");
        setUf((data.uf || "").toUpperCase());
      } catch {
        if (!cancelled) setCepError("Falha ao consultar CEP");
      } finally {
        if (!cancelled) setCepLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [cep]);

  async function logout() {
    await nextAuthSignOut({ callbackUrl: "/" });
  }

  async function refreshAddresses() {
    const response = await fetch("/api/minha-conta/addresses", {
      credentials: "include",
      cache: "no-store",
    });
    const json = await response.json().catch(() => null);
    if (response.ok && json?.success) {
      setAddresses(json.data || []);
    }
  }

  function maskCEP(value: string) {
    const digits = (value || "").replace(/\D+/g, "").slice(0, 8);
    return digits.replace(/(\d{5})(\d{0,3})/, (match, first, second) => (second ? `${first}-${second}` : first));
  }

  function formatJoined(dateStr: string | null) {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const formatted = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
      return `Entrou em ${formatted.replace(/\./g, "")}`;
    } catch {
      return "";
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    setSaving(true);
    try {
      const payload = {
        id: editingId || undefined,
        label,
        recipient_name: recipientName,
        street,
        number,
        neighborhood,
        city,
        uf,
        cep,
        complement,
        phone,
        instructions,
        is_default: isDefault,
      };

      const response = await fetch("/api/minha-conta/addresses", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.success) {
        throw new Error(json?.error || "Nao foi possivel salvar o endereco");
      }

      setAddresses(json.addresses || []);
      router.replace("/minha-conta/enderecos");
    } catch (submitError: any) {
      setError(submitError?.message || "Nao foi possivel salvar o endereco");
    } finally {
      setSaving(false);
    }
  }

  async function setPrimaryAddress(addressId: string) {
    try {
      const selected = addresses.find((address) => address.id === addressId);
      if (!selected) return;

      const response = await fetch("/api/minha-conta/addresses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...selected,
          id: addressId,
          is_default: true,
        }),
      });

      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.success) {
        throw new Error(json?.error || "Nao foi possivel atualizar o endereco principal");
      }

      setAddresses(json.addresses || []);
      if (!editingId) await refreshAddresses();
    } catch (updateError: any) {
      setError(updateError?.message || "Nao foi possivel atualizar o endereco principal");
    }
  }

  async function deleteAddress(addressId: string) {
    try {
      setDeletingId(addressId);
      const response = await fetch(`/api/minha-conta/addresses?id=${encodeURIComponent(addressId)}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await response.json().catch(() => null);

      if (!response.ok || !json?.success) {
        throw new Error(json?.error || "Nao foi possivel remover o endereco");
      }

      setAddresses(json.addresses || []);
      if (editingId === addressId) {
        router.replace("/minha-conta/enderecos");
      }
    } catch (deleteError: any) {
      setError(deleteError?.message || "Nao foi possivel remover o endereco");
    } finally {
      setDeletingId(null);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="container-max py-8">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-48 rounded bg-gray-200" />
          <div className="h-96 rounded-xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  return (
    <section className="container-max py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <MinhaContaSidebar
          currentKey="enderecos"
          userName={profile?.full_name || session?.user?.name || "Usuario"}
          userEmail={profile?.email || session?.user?.email || ""}
          userMeta={profile?.phone || profile?.created_at ? [profile?.phone, formatJoined(profile?.created_at || null)].filter(Boolean).join(" · ") : null}
          avatarUrl={profile?.avatar_url || ((session?.user as any)?.avatar_url as string | null) || ""}
          onLogout={logout}
        />

        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff5c00]">Relacionamento</p>
            <h1 className="mt-1 text-xl font-semibold text-gray-900">Central de enderecos</h1>
            <p className="mt-2 text-sm text-gray-600">
              Organize seus pontos de entrega, defina o endereco principal e deixe o checkout pronto para compras recorrentes.
            </p>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Enderecos salvos</h2>
                  <p className="mt-1 text-sm text-gray-500">Escolha o principal ou abra um endereco existente para edicao.</p>
                </div>
                <button
                  type="button"
                  onClick={() => router.replace("/minha-conta/enderecos")}
                  className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-gray-50"
                >
                  Novo endereco
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {addresses.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
                    Voce ainda nao cadastrou enderecos.
                  </div>
                ) : (
                  addresses.map((address) => (
                    <div key={address.id} className="rounded-xl border border-gray-200 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold text-gray-900">{address.label || "Endereco"}</div>
                            {address.is_default ? (
                              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                                Principal
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            {address.street}
                            {address.number ? `, ${address.number}` : ""}
                          </div>
                          <div className="text-sm text-gray-500">
                            {address.neighborhood} · {address.city} - {address.uf} {address.cep ? `(CEP: ${address.cep})` : ""}
                          </div>
                          {address.complement ? <div className="mt-1 text-sm text-gray-500">Comp.: {address.complement}</div> : null}
                          {address.instructions ? <div className="mt-1 text-sm text-gray-500">Entrega: {address.instructions}</div> : null}
                        </div>

                        <div className="flex flex-col items-end gap-2 text-sm">
                          {!address.is_default ? (
                            <button type="button" className="font-medium text-[#ff5c00] hover:underline" onClick={() => setPrimaryAddress(address.id)}>
                              Tornar principal
                            </button>
                          ) : null}
                          <button type="button" className="font-medium text-gray-700 hover:underline" onClick={() => router.replace(`/minha-conta/enderecos?id=${address.id}`)}>
                            Editar
                          </button>
                          <button
                            type="button"
                            className="font-medium text-red-600 hover:underline disabled:opacity-50"
                            disabled={deletingId === address.id}
                            onClick={() => deleteAddress(address.id)}
                          >
                            {deletingId === address.id ? "Removendo..." : "Remover"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">{editingId ? "Editar endereco" : "Adicionar endereco"}</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Preencha o endereco que deve ser usado no checkout e em futuras entregas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.replace("/minha-conta")}
                  className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-gray-50"
                >
                  Voltar
                </button>
              </div>

              <form className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2" onSubmit={onSubmit}>
                <div>
                  <label className="text-sm text-gray-700">Tipo do endereco</label>
                  <select className="input mt-1" value={label} onChange={(event) => setLabel(event.target.value)}>
                    <option value="Casa">Casa</option>
                    <option value="Trabalho">Trabalho</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-700">Responsavel</label>
                  <input className="input mt-1" value={recipientName} onChange={(event) => setRecipientName(event.target.value)} placeholder="Quem recebe no local" />
                </div>

                <div className="sm:col-span-2 flex gap-3">
                  <div className="w-40">
                    <label className="text-sm text-gray-700">CEP</label>
                    <div className="relative">
                      <input className="input mt-1 pr-10" value={cep} onChange={(event) => setCep(maskCEP(event.target.value))} placeholder="00000-000" inputMode="numeric" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[12px] text-gray-500">
                        {cepLoading ? "..." : ""}
                      </span>
                    </div>
                    {cepError ? <div className="mt-1 text-[12px] text-rose-600">{cepError}</div> : null}
                  </div>

                  <div className="flex-1">
                    <label className="text-sm text-gray-700">Endereco</label>
                    <input className="input mt-1" value={street} onChange={(event) => setStreet(event.target.value)} placeholder="Rua, avenida, travessa" />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-700">Numero</label>
                  <input className="input mt-1" value={number} onChange={(event) => setNumber(event.target.value)} placeholder="Numero" />
                </div>

                <div>
                  <label className="text-sm text-gray-700">Bairro</label>
                  <input className="input mt-1" value={neighborhood} onChange={(event) => setNeighborhood(event.target.value)} placeholder="Bairro" />
                </div>

                <div>
                  <label className="text-sm text-gray-700">Cidade</label>
                  <input className="input mt-1" value={city} onChange={(event) => setCity(event.target.value)} placeholder="Cidade" />
                </div>

                <div>
                  <label className="text-sm text-gray-700">UF</label>
                  <select className="input mt-1" value={uf} onChange={(event) => setUf(event.target.value)}>
                    <option value="">Selecione</option>
                    <option value="AC">AC</option>
                    <option value="AL">AL</option>
                    <option value="AP">AP</option>
                    <option value="AM">AM</option>
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="DF">DF</option>
                    <option value="ES">ES</option>
                    <option value="GO">GO</option>
                    <option value="MA">MA</option>
                    <option value="MT">MT</option>
                    <option value="MS">MS</option>
                    <option value="MG">MG</option>
                    <option value="PA">PA</option>
                    <option value="PB">PB</option>
                    <option value="PR">PR</option>
                    <option value="PE">PE</option>
                    <option value="PI">PI</option>
                    <option value="RJ">RJ</option>
                    <option value="RN">RN</option>
                    <option value="RS">RS</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="SC">SC</option>
                    <option value="SP">SP</option>
                    <option value="SE">SE</option>
                    <option value="TO">TO</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-700">Complemento</label>
                  <input className="input mt-1" value={complement} onChange={(event) => setComplement(event.target.value)} placeholder="Apartamento, bloco, ponto de referencia" />
                </div>

                <div>
                  <label className="text-sm text-gray-700">Telefone para entrega</label>
                  <input className="input mt-1" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(11) 99999-9999" />
                </div>

                <div>
                  <label className="text-sm text-gray-700">Instrucao para entrega</label>
                  <input className="input mt-1" value={instructions} onChange={(event) => setInstructions(event.target.value)} placeholder="Ex.: portaria, bloco, referencia" />
                </div>

                <label className="sm:col-span-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-700">
                  <input type="checkbox" checked={isDefault} onChange={(event) => setIsDefault(event.target.checked)} />
                  Definir este endereco como principal
                </label>

                <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={() => router.replace("/minha-conta/enderecos")} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50">
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving} className="rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50">
                    {saving ? "Salvando..." : editingId ? "Atualizar endereco" : "Salvar endereco"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function MinhaContaEnderecosPageClient() {
  return (
    <Suspense
      fallback={
        <div className="container-max py-8">
          <div className="animate-pulse">
            <div className="mb-4 h-8 w-48 rounded bg-gray-200" />
            <div className="h-96 rounded-xl bg-gray-200" />
          </div>
        </div>
      }
    >
      <EditAddressPageContent />
    </Suspense>
  );
}

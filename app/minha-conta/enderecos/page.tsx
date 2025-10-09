"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function EditAddressPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params?.get("id") || null; // se houver id, edita; senao, cria
  const [user, setUser] = useState<{name:string; email:string}|null>(null);
  const [userCreatedAt, setUserCreatedAt] = useState<string | null>(null);
  const [profileAvatar, setProfileAvatar] = useState<string>("");
  const [profilePhone, setProfilePhone] = useState<string>("");

  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [cep, setCep] = useState("");
  const [complement, setComplement] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  // Carregar usuário e endereço existente (edição)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("gb:user");
      if (raw) setUser(JSON.parse(raw));
      const created = localStorage.getItem("gb:userCreatedAt");
      if (created) setUserCreatedAt(created);
      const pr = localStorage.getItem("gb:userProfile");
      if (pr) {
        const p = JSON.parse(pr);
        if (p.avatar) setProfileAvatar(p.avatar);
        if (p.phone) setProfilePhone(p.phone);
      }
    } catch {}
    try {
      const raw = localStorage.getItem("gb:addresses");
      const list = raw ? JSON.parse(raw) : [];
      if (id && Array.isArray(list)) {
        const found = list.find((a: any) => String(a.id) === String(id));
        if (found) {
          setStreet(found.street || "");
          setNumber(found.number || "");
          setNeighborhood(found.neighborhood || "");
          setCity(found.city || "");
          setUf(found.uf || "");
          setCep(found.cep || "");
          setComplement(found.complement || "");
        }
      }
    } catch {}
  }, [id]);

  // Auto-completar pelo CEP (ViaCEP)
  useEffect(() => {
    const digits = (cep || "").replace(/\D+/g, "");
    setCepError(null);
    if (digits.length !== 8) return;
    let aborted = false;
    async function run() {
      try {
        setCepLoading(true);
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const data = await res.json();
        if (aborted) return;
        if (!data || data.erro) {
          setCepError("CEP não encontrado");
          return;
        }
        setStreet(data.logradouro || "");
        setNeighborhood(data.bairro || "");
        setCity(data.localidade || "");
        setUf((data.uf || "").toUpperCase());
      } catch (e) {
        if (!aborted) setCepError("Falha ao consultar CEP");
      } finally {
        if (!aborted) setCepLoading(false);
      }
    }
    run();
    return () => { aborted = true; };
  }, [cep]);

  function maskCEP(v: string) {
    const d = (v || "").replace(/\D+/g, "").slice(0, 8);
    return d.replace(/(\d{5})(\d{0,3})/, (m, a, b) => (b ? `${a}-${b}` : a));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!street.trim()) { setError("Informe a rua"); return; }
    if (!neighborhood.trim()) { setError("Informe o bairro"); return; }
    if (!city.trim()) { setError("Informe a cidade"); return; }
    if (!uf.trim()) { setError("Informe a UF"); return; }

    setSaving(true);
    try {
      const raw = localStorage.getItem("gb:addresses");
      const list = raw ? JSON.parse(raw) : [];
      let next = Array.isArray(list) ? list : [];
      if (id) {
        next = next.map((a: any) => String(a.id) === String(id) ? {
          ...a,
          street, number, neighborhood, city, uf, cep, complement
        } : a);
      } else {
        const newItem = {
          id: Date.now().toString(),
          street, number, neighborhood, city, uf, cep, complement
        };
        next = [...next, newItem];
      }
      localStorage.setItem("gb:addresses", JSON.stringify(next));
      // Voltar para Minha Conta > Perfil
      try { localStorage.setItem("gb:dashboardActiveMenu", "perfil"); } catch {}
      router.push("/minha-conta" as any);
    } catch (err) {
      setError("Não foi possível salvar o endereço");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="container-max py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full ring-1 ring-black/5 bg-gray-100 overflow-hidden relative">
              {profileAvatar ? (
                <Image src={profileAvatar} alt="Avatar" fill sizes="48px" className="object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-orange-700 text-sm font-bold bg-orange-100">
                  {getInitials(user?.name || user?.email || '')}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{user?.name || 'Usuário'}</div>
              {profilePhone && <div className="text-[12px] text-gray-600 truncate">{profilePhone}</div>}
              {userCreatedAt && (
                <div className="text-[11px] text-gray-500">{formatJoined(userCreatedAt)}</div>
              )}
            </div>
          </div>

          <nav className="mt-4 space-y-1 text-sm">
            {[
              { key: "perfil", label: "Meu Perfil", href: "/minha-conta" },
              { key: "pedidos", label: "Pedidos", href: "/minha-conta" },
              { key: "cupons", label: "Cupons", href: "/minha-conta" },
              { key: "favoritos", label: "Meus Favoritos", href: "/minha-conta" },
              { key: "pontos", label: "Pontos de Fidelidade", href: "/minha-conta" },
              { key: "indicacao", label: "Código de Indicação", href: "/minha-conta" },
              { key: "inbox", label: "Caixa de Entrada", href: "/minha-conta" },
            ].map((m) => (
              <button
                key={m.key}
                onClick={() => { try { localStorage.setItem('gb:dashboardActiveMenu', m.key); } catch {}; router.push(m.href as any); }}
                className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-left transition hover:bg-gray-50 text-gray-700`}
              >
                <span className={`grid place-items-center h-5 w-5 text-gray-600`}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
                </span>
                <span className="font-medium">{m.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <div className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-semibold">{id ? "Editar Endereço" : "Adicionar Endereço"}</h1>
            <button onClick={()=>router.back()} className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-gray-50">Voltar</button>
          </div>

          <form className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={onSubmit}>
            <div className="sm:col-span-2 flex gap-3">
              <div className="w-40">
                <label className="text-sm text-gray-700">CEP</label>
                <div className="relative">
                  <input className="input mt-1 pr-10" value={cep} onChange={(e)=>setCep(maskCEP(e.target.value))} placeholder="00000-000" inputMode="numeric" />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[12px] text-gray-500">
                    {cepLoading ? "..." : ""}
                  </span>
                </div>
                {cepError && <div className="mt-1 text-[12px] text-rose-600">{cepError}</div>}
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-700">Endereço</label>
                <input className="input mt-1" value={street} onChange={(e)=>setStreet(e.target.value)} placeholder="Endereço" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-700">Número</label>
              <input className="input mt-1" value={number} onChange={(e)=>setNumber(e.target.value)} placeholder="Número" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Bairro</label>
              <input className="input mt-1" value={neighborhood} onChange={(e)=>setNeighborhood(e.target.value)} placeholder="Bairro" />
            </div>
            <div className="col-span-1 sm:col-span-2 flex gap-3">
              <div className="flex-1">
                <label className="text-sm text-gray-700">Cidade</label>
                <input className="input mt-1" value={city} onChange={(e)=>setCity(e.target.value)} placeholder="Cidade" />
              </div>
              <div className="w-28">
                <label className="text-sm text-gray-700">UF</label>
                <select className="input mt-1" value={uf} onChange={(e)=>setUf(e.target.value)}>
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
            </div>
            
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-700">Complemento</label>
              <input className="input mt-1" value={complement} onChange={(e)=>setComplement(e.target.value)} placeholder="Apartamento, bloco, ponto de referência" />
            </div>

            {error && <div className="sm:col-span-2 text-[12px] text-rose-600">{error}</div>}

            <div className="sm:col-span-2 flex items-center justify-end gap-2 mt-2">
              <button type="button" onClick={()=>router.back()} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50">Cancelar</button>
              <button type="submit" disabled={saving} className="rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50">
                {saving ? "Salvando..." : (id ? "Atualizar Endereço" : "Salvar Endereço")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function EditAddressPage() {
  return (
    <Suspense fallback={
      <div className="container-max py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    }>
      <EditAddressPageContent />
    </Suspense>
  );
}

function formatJoined(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const s = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    return `Entrou em ${s.replace(/\./g, '')}`;
  } catch {
    return '';
  }
}

function getInitials(nameOrEmail: string) {
  const str = (nameOrEmail || '').trim();
  if (!str) return 'U';
  const parts = str.includes(' ') ? str.split(' ') : [str.replace(/@.+$/,'')];
  const first = (parts[0] || '').charAt(0).toUpperCase();
  const last = (parts[parts.length - 1] || '').charAt(0).toUpperCase();
  return (first + (last || '')).slice(0,2) || 'U';
}

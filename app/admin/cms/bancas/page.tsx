"use client";

import { useEffect, useMemo, useState } from "react";
import { useCategories } from "@/lib/useCategories";
import { fetchViaCEP } from "@/lib/viacep";
import { maskCEP, maskPhoneBR } from "@/lib/masks";
import Link from "next/link";

export type AdminBanca = {
  id: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  cover: string;
  avatar?: string;
  description?: string;
  categories?: string[];
  active: boolean;
  order: number;
  createdAt?: string;
  // structured fields (optional)
  images?: { cover?: string; avatar?: string };
  addressObj?: { cep?: string; street?: string; number?: string; complement?: string; neighborhood?: string; city?: string; uf?: string };
  location?: { lat?: number; lng?: number };
  contact?: { whatsapp?: string };
  socials?: { facebook?: string; instagram?: string; gmb?: string };
  hours?: Array<{ key: string; label: string; open: boolean; start: string; end: string }>;
  rating?: number;
  tags?: string[];
  payments?: string[];
  featured?: boolean;
  ctaUrl?: string;
  gallery?: string[];
};

const toUF = (b: AdminBanca): string => {
  const uf = (b as any)?.addressObj?.uf || (b.address?.match(/\b([A-Z]{2})\b$/)?.[1]) || "SP";
  return String(uf).toLowerCase();
};

export default function AdminBancasPage() {
  const [items, setItems] = useState<AdminBanca[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<AdminBanca | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showPendingOnly, setShowPendingOnly] = useState<boolean>(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState<boolean>(false);
  const [featuredFirst, setFeaturedFirst] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/bancas?all=true', { headers: { 'Authorization': 'Bearer admin-token' } });
      const j = await res.json();
      if (j?.success) setItems(j.data);
    } finally { setLoading(false); }
  };


  const logAudit = async (action: string, meta?: any) => {
    try {
      await fetch('/api/admin/audit', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ action, meta }) });
    } catch {}
  };

  useEffect(() => { fetchAll(); }, []);

  const onCreate = () => { setEditing(null); setShowForm(true); };
  const onEdit = (b: AdminBanca) => { setEditing(b); setShowForm(true); };

  const onDelete = async (id: string) => {
    if (!confirm('Excluir esta banca?')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/bancas?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers: { 'Authorization': 'Bearer admin-token' } });
      const j = await res.json();
      if (j?.success) { setItems(j.data); logAudit('delete_banca', { id }); }
    } finally { setSaving(false); }
  };

  const onToggleActive = async (id: string) => {
    setSaving(true);
    try {
      const updated = items.map((b)=> b.id===id? { ...b, active: !b.active } : b);
      const res = await fetch('/api/admin/bancas', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer admin-token' }, body: JSON.stringify({ type: 'bulk', data: updated }) });
      const j = await res.json();
      if (j?.success) {
        setItems(updated);
        const now = updated.find(b=>b.id===id);
        setToast(now?.active ? 'Banca ativada' : 'Banca desativada');
        logAudit(now?.active ? 'activate_banca' : 'deactivate_banca', { id });
      }
    } finally { setSaving(false); }
  };

  const approveBanca = async (id: string) => {
    setSaving(true);
    try {
      const updated = items.map((b)=> b.id===id? { ...b, active: true } : b);
      const res = await fetch('/api/admin/bancas', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer admin-token' }, body: JSON.stringify({ type: 'bulk', data: updated }) });
      const j = await res.json();
      if (j?.success) setItems(updated);
    } finally { setSaving(false); }
  };

  const move = async (id: string, dir: 'up'|'down') => {
    const idx = items.findIndex(b => b.id === id);
    if (idx < 0) return;
    if (dir==='up' && idx===0) return;
    if (dir==='down' && idx===items.length-1) return;
    const copy = [...items];
    const target = dir==='up' ? idx-1 : idx+1;
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    copy.forEach((b,i)=> b.order = i+1);
    setSaving(true);
    try {
      const res = await fetch('/api/admin/bancas', { method: 'PUT', headers: { 'Content-Type':'application/json', 'Authorization':'Bearer admin-token' }, body: JSON.stringify({ type: 'bulk', data: copy }) });
      const j = await res.json();
      if (j?.success) { setItems(copy); logAudit('reorder_bancas_arrow', { id, dir }); }
    } finally { setSaving(false); }
  };

  const commitReorderByIds = async (orderedIds: string[]) => {
    const map = new Map(orderedIds.map((id, idx)=>[id, idx+1] as const));
    const next = items.map(b => ({ ...b, order: map.get(b.id) ?? b.order }));
    setSaving(true);
    try {
      const res = await fetch('/api/admin/bancas', { method: 'PUT', headers: { 'Content-Type':'application/json', 'Authorization':'Bearer admin-token' }, body: JSON.stringify({ type: 'bulk', data: next }) });
      const j = await res.json();
      if (j?.success) { setItems(next); setToast('Ordem atualizada'); logAudit('reorder_bancas_dnd', { orderedIds }); }
    } finally { setSaving(false); }
  };

  const onSubmit = async (data: Omit<AdminBanca,'id'|'order'> & { id?: string }) => {
    setSaving(true);
    try {
      if (data.id) {
        const updated = items.map((b)=> b.id===data.id ? { ...b, ...data } as AdminBanca : b);
        const res = await fetch('/api/admin/bancas', { method: 'PUT', headers: { 'Content-Type':'application/json', 'Authorization':'Bearer admin-token' }, body: JSON.stringify({ data: updated.find(b=>b.id===data.id) }) });
        const j = await res.json();
        if (j?.success) {
          setItems(updated);
          console.log('Banca atualizada com sucesso!');
          // Recarregar dados para garantir sincronização
          setTimeout(() => {
            fetchAll();
          }, 1000);
        } else {
          console.error('Erro ao atualizar banca:', j?.error);
        }
      } else {
        const res = await fetch('/api/admin/bancas', { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization':'Bearer admin-token' }, body: JSON.stringify({ data }) });
        const j = await res.json();
        if (j?.success) {
          setItems((list)=> [...list, j.data]);
          console.log('Banca criada com sucesso!');
        } else {
          console.error('Erro ao criar banca:', j?.error);
        }
      }
      setShowForm(false);
      setEditing(null);
    } catch (error) {
      console.error('Erro de conexão:', error);
    } finally { 
      setSaving(false); 
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Bancas</h1>
          <p className="text-gray-600">Crie, edite, reordene e ative/desative bancas exibidas no site.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={showPendingOnly} onChange={(e)=>setShowPendingOnly(e.target.checked)} className="rounded border-gray-300" />
            Somente pendentes
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={showFeaturedOnly} onChange={(e)=>setShowFeaturedOnly(e.target.checked)} className="rounded border-gray-300" />
            Somente destaque
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={featuredFirst} onChange={(e)=>setFeaturedFirst(e.target.checked)} className="rounded border-gray-300" />
            Destaques primeiro
          </label>
          <button onClick={onCreate} className="inline-flex items-center gap-2 rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            Nova Banca
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold">Bancas</h2>
        </div>
        {loading ? (
          <div className="p-6 text-sm text-gray-600">Carregando...</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {(() => {
              let list = [...items];
              if (showPendingOnly) list = list.filter(b=>!b.active);
              if (showFeaturedOnly) list = list.filter(b=>b.featured);
              if (featuredFirst) list = list.slice().sort((a,b)=> Number(b.featured||false) - Number(a.featured||false));
              return list;
            })().map((b, idx, arr)=> (
              <div
                key={b.id}
                className="p-6 flex items-start gap-4"
                draggable={showFeaturedOnly && b.featured}
                onDragStart={() => { if (showFeaturedOnly && b.featured) setDragIndex(idx); }}
                onDragOver={(e) => { if (showFeaturedOnly && b.featured) { e.preventDefault(); }} }
                onDrop={() => {
                  if (!showFeaturedOnly || dragIndex == null) return;
                  const src = dragIndex;
                  const dst = idx;
                  if (src === dst) return;
                  const featuredIds = arr.map(x=>x.id);
                  const reordered = [...featuredIds];
                  const [moved] = reordered.splice(src,1);
                  reordered.splice(dst,0,moved);
                  commitReorderByIds(reordered);
                  setDragIndex(null);
                }}
              >
                <div className="relative h-16 w-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.cover} alt={b.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        <span>{b.name}</span>
                        {!b.active && (
                          <span className="inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200 px-2 py-[2px] text-[11px]">Pendente</span>
                        )}
                        {b.featured && (
                          <span className="inline-flex items-center rounded-full bg-orange-50 text-[#ff5c00] border border-orange-200 px-2 py-[2px] text-[11px]">Destaque</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-700">
                        {(() => {
                          const phone = maskPhoneBR(b.contact?.whatsapp || '');
                          if (!phone) return null;
                          const wa = (b.contact?.whatsapp || '').replace(/\D/g,'');
                          return (
                            <a href={`https://wa.me/${wa}`} target="_blank" className="inline-flex items-center gap-1 text-[#16a34a] hover:underline" rel="noreferrer">
                              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M20 3.5A10.5 10.5 0 1 0 3.5 20l.3.2 2.3-.6a1 1 0 0 1 .8.2A10.5 10.5 0 1 0 20 3.5ZM7.7 18.2l-.2-.1-1.4.4.4-1.4-.1-.2a8.5 8.5 0 1 1 3.5 3.5ZM8.5 7.5c.2-.5.5-.5.8-.5h.7c.2 0 .5 0 .7.5.2.5.8 1.8.9 1.9.1.2.1.3 0 .5-.1.2-.2.4-.4.6-.2.2-.4.4-.2.7.2.2.7 1.1 1.6 1.8 1.1.7 1.2.6 1.4.4.2-.2.6-.7.8-.9.2-.2.4-.2.6-.1.2.1 1.6.8 1.9 1 .2.1.4.2.5.3.1.2.1 1.1-.2 1.7-.3.6-1.5 1.4-2.1 1.5-.5.1-1 .1-1.7-.1-.4-.1-1-.3-1.8-.7-1.6-.7-2.7-2.4-2.8-2.5-.1-.1-.7-.9-.7-1.8 0-1 .5-1.5.7-1.7.2-.2.4-.3.6-.3.2 0 .3 0 .4.1Z"/></svg>
                              {phone}
                            </a>
                          );
                        })()}
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">Cadastro: {(() => { const d = b.createdAt ? new Date(b.createdAt) : undefined; return d? d.toLocaleDateString() : '-'; })()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!b.active && (
                        <button onClick={()=>approveBanca(b.id)} className="px-2 py-1 text-xs rounded-md border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100" title="Aprovar e ativar">
                          Aprovar
                        </button>
                      )}
                      <Link href={`/banca/${toUF(b)}/${b.id}`} target="_blank" className="p-1 text-[#ff5c00] hover:text-[#e24e00]" title="Ver perfil">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </Link>
                      <button onClick={()=>move(b.id,'up')} disabled={idx===0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30" title="Mover para cima">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
                      </button>
                      <button onClick={()=>move(b.id,'down')} disabled={idx===items.length-1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30" title="Mover para baixo">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                      </button>
                      <button onClick={()=>onToggleActive(b.id)} className={`p-1 ${b.active? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'}`} title={b.active? 'Desativar' : 'Ativar'}>
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg>
                      </button>
                      <button onClick={()=>onEdit(b)} className="p-1 text-blue-600 hover:text-blue-800" title="Editar">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button onClick={()=>onDelete(b.id)} className="p-1 text-red-600 hover:text-red-800" title="Excluir">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {items.length===0 && (
              <div className="p-12 text-center text-gray-500">Nenhuma banca cadastrada</div>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <BancaForm
          item={editing}
          onCancel={()=>{ setShowForm(false); setEditing(null); }}
          onSubmit={onSubmit}
          saving={saving}
        />
      )}
    </div>
  );
}

function BancaForm({ item, onSubmit, onCancel, saving }: { item: AdminBanca | null; onSubmit: (data: Omit<AdminBanca,'id'|'order'> & { id?: string }) => void; onCancel: () => void; saving: boolean; }) {
  const [name, setName] = useState(item?.name || "");
  // Legacy flat
  const [address, setAddress] = useState(item?.address || "");
  const [lat, setLat] = useState<string>(typeof item?.lat === 'number' ? String(item!.lat) : (item?.location?.lat!=null? String(item.location.lat) : ""));
  const [lng, setLng] = useState<string>(typeof item?.lng === 'number' ? String(item!.lng) : (item?.location?.lng!=null? String(item.location.lng) : ""));
  const [cover, setCover] = useState(item?.cover || "");
  const [avatar, setAvatar] = useState(item?.avatar || "");
  const [description, setDescription] = useState(item?.description || "");
  const [active, setActive] = useState<boolean>(item?.active ?? true);
  const [dragOverCover, setDragOverCover] = useState(false);
  const [dragOverAvatar, setDragOverAvatar] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { items: catItems } = useCategories();
  const [cats, setCats] = useState<string[]>(item?.categories || []);

  // Structured fields mirroring jornaleiro/registrar
  const [cep, setCep] = useState(item?.addressObj?.cep || "");
  const [street, setStreet] = useState(item?.addressObj?.street || "");
  const [number, setNumber] = useState(item?.addressObj?.number || "");
  const [complement, setComplement] = useState(item?.addressObj?.complement || "");
  const [neighborhood, setNeighborhood] = useState(item?.addressObj?.neighborhood || "");
  const [city, setCity] = useState(item?.addressObj?.city || "");
  const [uf, setUf] = useState(item?.addressObj?.uf || "");
  const [whatsapp, setWhatsapp] = useState(item?.contact?.whatsapp || "");
  const [facebook, setFacebook] = useState(item?.socials?.facebook || "");
  const [instagram, setInstagram] = useState(item?.socials?.instagram || "");
  const [gmb, setGmb] = useState(item?.socials?.gmb || "");
  type Day = { key: string; label: string; open: boolean; start: string; end: string };
  const defaultHours: Day[] = [
    { key: 'mon', label: 'Segunda', open: true, start: '08:00', end: '18:00' },
    { key: 'tue', label: 'Terça', open: true, start: '08:00', end: '18:00' },
    { key: 'wed', label: 'Quarta', open: true, start: '08:00', end: '18:00' },
    { key: 'thu', label: 'Quinta', open: true, start: '08:00', end: '18:00' },
    { key: 'fri', label: 'Sexta', open: true, start: '08:00', end: '18:00' },
    { key: 'sat', label: 'Sábado', open: true, start: '08:00', end: '13:00' },
    { key: 'sun', label: 'Domingo', open: false, start: '09:00', end: '12:00' },
  ];
  const [hours, setHours] = useState<Day[]>(item?.hours || defaultHours);
  // Extra controls
  const [rating, setRating] = useState<string>(item?.rating != null ? String(item.rating) : "");
  const [tagsStr, setTagsStr] = useState<string>(Array.isArray(item?.tags) ? item!.tags!.join(', ') : "");
  const [payments, setPayments] = useState<string[]>(Array.isArray(item?.payments) ? item!.payments! : []);
  const [featured, setFeatured] = useState<boolean>(Boolean(item?.featured));
  const [ctaUrl, setCtaUrl] = useState<string>(item?.ctaUrl || "");
  const [gallery, setGallery] = useState<string[]>(Array.isArray(item?.gallery) ? item!.gallery! : []);
  const [step, setStep] = useState<number>(1);
  const maxStep = 6;
  const nextStep = () => setStep((s)=> Math.min(maxStep, s+1));
  const prevStep = () => setStep((s)=> Math.max(1, s-1));
  const [geoLoading, setGeoLoading] = useState<boolean>(false);

  const geocode = async () => {
    try {
      setError(null);
      const cepOnly = (cep || '').replace(/\D/g, '');
      // Garantir pelo menos cidade/UF ou CEP para busca razoável
      if (!city && !uf && cepOnly.length !== 8) {
        setError('Preencha CEP (8 dígitos) ou Cidade/UF para geocodificar.');
        return;
      }
      setGeoLoading(true);
      const H = { 'Accept': 'application/json' } as const; // cabeçalho permitido no cliente
      const emailQ = '&email=admin@guiadasbancas.com'; // ajuda o Nominatim a identificar o cliente

      // Se CEP for válido e campos de endereço estiverem vazios, tentar preencher via ViaCEP
      try {
        if (cepOnly.length === 8 && (!street || !city || !uf)) {
          const data = await fetchViaCEP(cepOnly);
          if (data) {
            if (!street) setStreet(data.logradouro || '');
            if (!neighborhood) setNeighborhood(data.bairro || '');
            if (!city) setCity(data.localidade || '');
            if (!uf) setUf(data.uf || '');
          }
        }
      } catch {}

      const tryParsers: Array<() => Promise<boolean>> = [];

      // 1) Tentar por CEP diretamente
      if (cepOnly.length === 8) {
        tryParsers.push(async () => {
          const urlCep = `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=br&postalcode=${cepOnly}&limit=1${emailQ}`;
          const resCep = await fetch(urlCep, { headers: H });
          if (!resCep.ok) return false;
          const dataCep = await resCep.json();
          if (Array.isArray(dataCep) && dataCep.length > 0 && dataCep[0]?.lat && dataCep[0]?.lon) {
            setLat(String(dataCep[0].lat));
            setLng(String(dataCep[0].lon));
            return true;
          }
          return false;
        });
      }

      // 2) Tentar estruturado com rua + numero + cidade + uf
      if (street && number && city && uf) {
        tryParsers.push(async () => {
          const streetStr = encodeURIComponent(`${street} ${number}`);
          const cityStr = encodeURIComponent(city);
          const stateStr = encodeURIComponent(uf);
          const urlStruct = `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=br&street=${streetStr}&city=${cityStr}&state=${stateStr}&limit=1${emailQ}`;
          const resStruct = await fetch(urlStruct, { headers: H });
          if (!resStruct.ok) return false;
          const dataStruct = await resStruct.json();
          if (Array.isArray(dataStruct) && dataStruct.length > 0 && dataStruct[0]?.lat && dataStruct[0]?.lon) {
            setLat(String(dataStruct[0].lat));
            setLng(String(dataStruct[0].lon));
            return true;
          }
          return false;
        });
      }

      // 3) Fallback cidade + UF (centroide da cidade)
      if (city && uf) {
        tryParsers.push(async () => {
          const q = encodeURIComponent(`${city}, ${uf}, Brasil`);
          const urlCity = `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=br&q=${q}&limit=1${emailQ}`;
          const resCity = await fetch(urlCity, { headers: H });
          if (!resCity.ok) return false;
          const dataCity = await resCity.json();
          if (Array.isArray(dataCity) && dataCity.length > 0 && dataCity[0]?.lat && dataCity[0]?.lon) {
            setLat(String(dataCity[0].lat));
            setLng(String(dataCity[0].lon));
            return true;
          }
          return false;
        });
      }

      // 4) Fallback genérico (q livre)
      tryParsers.push(async () => {
        const qParts = [street, number, neighborhood, city, uf, cepOnly, 'Brasil'].filter(Boolean);
        const q = encodeURIComponent(qParts.join(', '));
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=br&q=${q}&limit=1${emailQ}`;
        const res = await fetch(url, { headers: H });
        if (!res.ok) return false;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && data[0]?.lat && data[0]?.lon) {
          setLat(String(data[0].lat));
          setLng(String(data[0].lon));
          return true;
        }
        return false;
      });

      let ok = false;
      for (const fn of tryParsers) {
        try {
          // eslint-disable-next-line no-await-in-loop
          if (await fn()) { ok = true; break; }
        } catch (e) {
          // continua para próxima tentativa
          console.warn('geocode attempt failed:', e);
        }
      }

      if (!ok) setError('Não foi possível geocodificar. Tente ajustar CEP/cidade/UF ou rua/número.');
    } catch {
      setError('Falha ao consultar geocodificação.');
    } finally { setGeoLoading(false); }
  };

  // Validação por etapa e avanço (escopo local do formulário)
  const validateCurrentStep = (): string | null => {
    if (step === 1) {
      if (!name.trim()) return 'Informe o nome da banca.';
      return null;
    }
    if (step === 2) {
      const cepOnly = (cep || '').replace(/\D/g, '');
      if (!cepOnly || cepOnly.length !== 8) return 'Informe um CEP válido (8 dígitos).';
      if (!street.trim()) return 'Informe a rua.';
      if (!number.trim()) return 'Informe o número.';
      if (!city.trim()) return 'Informe a cidade.';
      if (!uf.trim()) return 'Informe a UF.';
      return null;
    }
    if (step === 3) {
      if (!cover.trim()) return 'Informe a imagem de capa.';
      return null;
    }
    return null;
  };

  const handleNext = () => {
    setError(null);
    const err = validateCurrentStep();
    if (err) { setError(err); return; }
    nextStep();
  };

  // submit do form não salva (evita fechamento acidental com Enter)
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < maxStep) {
      handleNext();
    }
  };

  const handleSave = () => {
    setError(null);
    const latNum = lat ? Number(lat) : undefined;
    const lngNum = lng ? Number(lng) : undefined;
    onSubmit({
      id: item?.id,
      name,
      // legacy for compatibility
      address,
      lat: latNum,
      lng: lngNum,
      cover,
      avatar,
      // structured
      images: { cover, avatar },
      addressObj: { cep, street, number, complement, neighborhood, city, uf },
      location: { lat: latNum, lng: lngNum },
      contact: { whatsapp },
      socials: { facebook, instagram, gmb },
      hours,
      rating: rating ? Number(rating) : undefined,
      tags: tagsStr.split(',').map(s=>s.trim()).filter(Boolean),
      payments,
      featured,
      ctaUrl: ctaUrl || undefined,
      gallery,
      description,
      categories: cats,
      active,
      createdAt: item?.createdAt || new Date().toISOString(),
    });
  };

  const doUpload = async (file: File, setUrl: (u:string)=>void) => {
    try {
      setUploading(true);
      setError(null);
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', headers: { 'Authorization': 'Bearer admin-token' }, body: form });
      const j = await res.json();
      if (!res.ok || !j?.ok) { setError(j?.error || 'Falha no upload'); return; }
      setUrl(j.url);
    } catch {
      setError('Erro ao enviar arquivo');
    } finally { setUploading(false); }
  };

  const toggleCat = (key: string) => {
    setCats(prev => prev.includes(key) ? prev.filter(x=>x!==key) : [...prev, key]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCancel} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <form onSubmit={submit} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{item? 'Editar' : 'Nova'} Banca</h3>
              <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6"/></svg>
              </button>
            </div>

            {/* Stepper */}
            <div>
              <div className="h-1 w-full rounded-full bg-gray-200">
                <div className="h-1 bg-[#ff5c00] rounded-full transition-all" style={{ width: `${(step-1)/(maxStep-1)*100}%` }} />
              </div>
              <div className="mt-2 grid grid-cols-6 text-center text-[11px] text-gray-700">
                <div className={`${step>=1? 'text-[#ff5c00]' : ''}`}>Básico</div>
                <div className={`${step>=2? 'text-[#ff5c00]' : ''}`}>Endereço</div>
                <div className={`${step>=3? 'text-[#ff5c00]' : ''}`}>Mídia</div>
                <div className={`${step>=4? 'text-[#ff5c00]' : ''}`}>Detalhes</div>
                <div className={`${step>=5? 'text-[#ff5c00]' : ''}`}>Redes & Horários</div>
                <div className={`${step>=6? 'text-[#ff5c00]' : ''}`}>Resumo</div>
              </div>
            </div>

            {step===1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ativa</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={active} onChange={(e)=>setActive(e.target.checked)} className="rounded border-gray-300" /><span className="text-sm">Visível no site</span></label>
              </div>
            </div>
            )}

            {/* Endereço (estruturado) */}
            {step===2 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                <div className="flex gap-2">
                  <input value={cep} onChange={(e)=>setCep(maskCEP(e.target.value))} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="00000-000" />
                  <button type="button" className="rounded-md border border-gray-300 px-2 text-sm" onClick={async()=>{ const only = (cep||'').replace(/\D/g,''); if (only.length===8){ const data = await fetchViaCEP(only); if (data){ setStreet(data.logradouro||''); setNeighborhood(data.bairro||''); setCity(data.localidade||''); setUf(data.uf||''); } } }}>Buscar</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                <input value={number} onChange={(e)=>setNumber(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                <input value={complement} onChange={(e)=>setComplement(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                <input value={street} onChange={(e)=>setStreet(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                <input value={neighborhood} onChange={(e)=>setNeighborhood(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input value={city} onChange={(e)=>setCity(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UF</label>
                <input value={uf} onChange={(e)=>setUf(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="SP" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input value={lat} onChange={(e)=>setLat(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="-23.56" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input value={lng} onChange={(e)=>setLng(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="-46.65" />
              </div>
              <div className="md:col-span-2">
                <button type="button" onClick={geocode} disabled={geoLoading} className="mt-1 inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-gray-50 disabled:opacity-60">
                  {geoLoading ? (
                    <>
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 animate-spin" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" className="opacity-25"/><path d="M21 12a9 9 0 0 1-9 9" className="opacity-75"/></svg>
                      Geocodificando...
                    </>
                  ) : (
                    <>Geocodificar pelo CEP/Endereço</>
                  )}
                </button>
              </div>
            </div>
            )}

            {/* Upload Cover */}
            {step===3 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capa (URL)</label>
              <input type="text" value={cover} onChange={(e)=>setCover(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="/uploads/arquivo.jpg ou URL completa" required />
              <div
                className={`mt-2 border-2 border-dashed rounded-lg p-4 text-center text-sm ${dragOverCover? 'border-[#ff5c00] bg-[#fff6ef]' : 'border-gray-300 bg-gray-50'}`}
                onDragOver={(e)=>{ e.preventDefault(); setDragOverCover(true); }}
                onDragLeave={()=>setDragOverCover(false)}
                onDrop={(e)=>{ e.preventDefault(); setDragOverCover(false); const f = e.dataTransfer.files?.[0]; if (f) doUpload(f, setCover); }}
              >
                {uploading ? 'Enviando...' : (
                  <>
                    <div>Arraste e solte uma imagem aqui, ou clique para selecionar.</div>
                    <input type="file" accept="image/*" className="hidden" id="banca-cover" onChange={(e)=>{ const f=e.target.files?.[0]; if (f) doUpload(f, setCover); }} />
                    <label htmlFor="banca-cover" className="mt-2 inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-gray-50 cursor-pointer">Selecionar arquivo</label>
                  </>
                )}
              </div>
              {cover && (
                <div className="mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover} alt="Capa" className="h-28 w-full max-w-md rounded-lg object-cover ring-1 ring-black/10" />
                </div>
              )}
            </div>
            )}

            {/* Upload Avatar */}
            {step===3 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagem de Perfil (URL)</label>
              <input type="text" value={avatar} onChange={(e)=>setAvatar(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="/uploads/arquivo.jpg ou URL completa" />
              <div
                className={`mt-2 border-2 border-dashed rounded-lg p-4 text-center text-sm ${dragOverAvatar? 'border-[#ff5c00] bg-[#fff6ef]' : 'border-gray-300 bg-gray-50'}`}
                onDragOver={(e)=>{ e.preventDefault(); setDragOverAvatar(true); }}
                onDragLeave={()=>setDragOverAvatar(false)}
                onDrop={(e)=>{ e.preventDefault(); setDragOverAvatar(false); const f = e.dataTransfer.files?.[0]; if (f) doUpload(f, setAvatar); }}
              >
                {uploading ? 'Enviando...' : (
                  <>
                    <div>Arraste e solte uma imagem aqui, ou clique para selecionar.</div>
                    <input type="file" accept="image/*" className="hidden" id="banca-avatar" onChange={(e)=>{ const f=e.target.files?.[0]; if (f) doUpload(f, setAvatar); }} />
                    <label htmlFor="banca-avatar" className="mt-2 inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-gray-50 cursor-pointer">Selecionar arquivo</label>
                  </>
                )}
              </div>
              {avatar && (
                <div className="mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatar} alt="Imagem de Perfil" className="h-20 w-20 rounded-full object-cover ring-1 ring-black/10" />
                </div>
              )}
            </div>
            )}

            {/* Categorias (vincula com admin) */}
            {step===4 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categorias</label>
              <div className="flex flex-wrap gap-2">
                {catItems.map((c)=> (
                  <label key={c.key} className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" checked={cats.includes(c.name)} onChange={()=>toggleCat(c.name)} />
                    <span>{c.name}</span>
                  </label>
                ))}
              </div>
            </div>
            )}

            {/* Rating e Destaque */}
            {step===4 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0–5)</label>
                <input type="number" min={0} max={5} step={0.1} value={rating} onChange={(e)=>setRating(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="4.7" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (separe por vírgula)</label>
                <input value={tagsStr} onChange={(e)=>setTagsStr(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="Clássica, 24h, Quadrinhos" />
              </div>
              <div className="md:col-span-3">
                <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input type="checkbox" checked={featured} onChange={(e)=>setFeatured(e.target.checked)} className="rounded border-gray-300" />
                  Destaque na home
                </label>
              </div>
            </div>
            )}

            {/* Pagamentos */}
            {step===4 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Formas de pagamento</label>
              <div className="flex flex-wrap gap-2 text-sm">
                {['pix','credito','debito','dinheiro'].map(p => (
                  <label key={p} className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-2.5 py-1">
                    <input type="checkbox" checked={payments.includes(p)} onChange={()=> setPayments(prev=> prev.includes(p)? prev.filter(x=>x!==p) : [...prev, p])} className="rounded border-gray-300" />
                    <span className="capitalize">{p}</span>
                  </label>
                ))}
              </div>
            </div>
            )}

            {/* CTA */}
            {step===4 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA URL</label>
              <input value={ctaUrl} onChange={(e)=>setCtaUrl(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="https://linktr.ee/sua-banca" />
            </div>
            )}

            {/* Redes & Horários */}
            {step===5 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input
                    value={whatsapp}
                    onChange={(e)=>setWhatsapp(maskPhoneBR(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="(11) 91234-5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  <input
                    value={facebook}
                    onChange={(e)=>setFacebook(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="https://facebook.com/sua-pagina"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <input
                    value={instagram}
                    onChange={(e)=>setInstagram(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="https://instagram.com/seu-perfil"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Google Business (GMB)</label>
                  <input
                    value={gmb}
                    onChange={(e)=>setGmb(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="https://g.page/r/xxxxxxxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horários de funcionamento</label>
                <div className="space-y-2">
                  {hours.map((h, idx)=> (
                    <div key={h.key} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                      <div className="text-sm text-gray-700 sm:col-span-1">{h.label}</div>
                      <label className="inline-flex items-center gap-2 text-sm sm:col-span-1">
                        <input
                          type="checkbox"
                          checked={h.open}
                          onChange={(e)=>{
                            const v = e.target.checked;
                            setHours(prev => prev.map((x,i)=> i===idx ? { ...x, open: v } : x));
                          }}
                          className="rounded border-gray-300"
                        />
                        Aberto
                      </label>
                      <div className="sm:col-span-1">
                        <input
                          type="time"
                          value={h.start}
                          disabled={!h.open}
                          onChange={(e)=> setHours(prev => prev.map((x,i)=> i===idx ? { ...x, start: e.target.value } : x))}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <input
                          type="time"
                          value={h.end}
                          disabled={!h.open}
                          onChange={(e)=> setHours(prev => prev.map((x,i)=> i===idx ? { ...x, end: e.target.value } : x))}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            )}

            {/* Resumo */}
            {step===6 && (
            <div className="space-y-3">
              <div className="text-sm text-gray-700">Revise as informações antes de salvar.</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="font-semibold">Básico</div>
                  <div><span className="text-gray-500">Nome:</span> {name || '-'}</div>
                  <div><span className="text-gray-500">Ativa:</span> {active ? 'Sim' : 'Não'}</div>
                </div>
                <div>
                  <div className="font-semibold">Endereço</div>
                  <div>{street || '-'}, {number || '-'}</div>
                  <div>{neighborhood || '-'} - {city || '-'} / {uf || '-'}</div>
                  <div>CEP: {cep || '-'}</div>
                  <div>Lat/Lng: {lat || '-'} , {lng || '-'}</div>
                </div>
                <div>
                  <div className="font-semibold">Mídia</div>
                  <div><span className="text-gray-500">Capa:</span> {cover ? 'ok' : '-'}</div>
                  <div><span className="text-gray-500">Avatar:</span> {avatar ? 'ok' : '-'}</div>
                  <div><span className="text-gray-500">Galeria:</span> {gallery.length} imagens</div>
                </div>
                <div>
                  <div className="font-semibold">Detalhes</div>
                  <div><span className="text-gray-500">Categorias:</span> {(cats||[]).join(', ') || '-'}</div>
                  <div><span className="text-gray-500">Rating:</span> {rating || '-'}</div>
                  <div><span className="text-gray-500">Tags:</span> {tagsStr || '-'}</div>
                  <div><span className="text-gray-500">Pagamentos:</span> {(payments||[]).join(', ') || '-'}</div>
                  <div><span className="text-gray-500">Destaque:</span> {featured ? 'Sim' : 'Não'}</div>
                  <div><span className="text-gray-500">CTA:</span> {ctaUrl || '-'}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="font-semibold">Redes & Horários</div>
                  <div><span className="text-gray-500">WhatsApp:</span> {whatsapp || '-'}</div>
                  <div><span className="text-gray-500">Facebook/Instagram/GMB:</span> {[facebook, instagram, gmb].filter(Boolean).length ? 'ok' : '-'}</div>
                  <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-600">
                    {hours.map(h => (
                      <div key={h.key}>{h.label}: {h.open ? `${h.start} - ${h.end}` : 'Fechado'}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Footer actions */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t">
              <div>
                {step>1 && (
                  <button type="button" onClick={prevStep} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Voltar</button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
                {step<maxStep ? (
                  <button type="button" onClick={handleNext} className="px-4 py-2 text-sm font-medium text-white bg-[#ff5c00] rounded-md hover:opacity-90">Próximo</button>
                ) : (
                  <button type="button" onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-[#ff5c00] rounded-md hover:opacity-90">{saving? 'Salvando...' : 'Salvar'}</button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

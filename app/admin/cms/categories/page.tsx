"use client";

import { useEffect, useMemo, useState } from "react";

type AdminCategory = {
  id: string;
  name: string;
  image: string;
  link: string;
  active: boolean;
  visible: boolean;
  order: number;
  jornaleiro_status?: 'all' | 'specific' | 'inactive';
  jornaleiro_bancas?: string[];
};

type AdminBancaOption = {
  id: string;
  name: string;
};

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{type:'success'|'error'; text:string}|null>(null);
  const [bancas, setBancas] = useState<AdminBancaOption[]>([]);

  const statusLabels: Record<'all'|'specific'|'inactive', string> = {
    all: 'Ativa para jornaleiros',
    specific: 'Ativa para jornaleiros específicos',
    inactive: 'Inativa para jornaleiros',
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      // Adicionar timestamp para evitar cache
      const timestamp = new Date().getTime();
      const res = await fetch(`/api/admin/categories/visibility?_t=${timestamp}`, { 
        headers: { 
          'Authorization': 'Bearer admin-token',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store'
      });
      const j = await res.json();
      console.log('[fetchAll] Categorias carregadas:', j.data?.length);
      console.log('[fetchAll] Dados completos:', j.data?.map((c: AdminCategory) => ({ 
        name: c.name, 
        visible: c.visible,
        active: c.active 
      })));
      if (j?.success) {
        console.log('[fetchAll] Atualizando estado com:', j.data);
        setItems(j.data);
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    console.log('[useEffect items] Estado atualizado:', items.map(c => ({ name: c.name, visible: c.visible })));
  }, [items]);

  useEffect(() => {
    const fetchBancas = async () => {
      try {
        const res = await fetch('/api/admin/bancas?all=true', {
          headers: { 'Authorization': 'Bearer admin-token', 'Cache-Control': 'no-cache' },
          cache: 'no-store'
        });
        const j = await res.json();
        if (j?.success && Array.isArray(j.data)) {
          setBancas(j.data.map((b: any) => ({ id: b.id, name: b.name || 'Sem nome' })));
        }
      } catch (err) {
        console.error('Erro ao carregar bancas:', err);
      }
    };
    fetchBancas();
  }, []);

  const onCreate = () => { setEditing(null); setShowForm(true); };
  const onEdit = (c: AdminCategory) => { setEditing(c); setShowForm(true); };

  const onDelete = async (id: string) => {
    if (!confirm('Excluir esta categoria?')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/categories?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers: { 'Authorization': 'Bearer admin-token' } });
      const j = await res.json();
      if (j?.success) { setItems(j.data); }
      else setMessage({ type: 'error', text: j?.error || 'Erro ao excluir' });
    } finally { setSaving(false); }
  };

  const onToggleActive = async (id: string) => {
    setSaving(true);
    try {
      const updated = items.map((c)=> c.id===id? { ...c, active: !c.active } : c);
      const res = await fetch('/api/admin/categories', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer admin-token' }, body: JSON.stringify({ type: 'bulk', data: updated }) });
      const j = await res.json();
      if (j?.success) setItems(updated);
    } finally { setSaving(false); }
  };

  const onToggleVisible = async (id: string) => {
    setSaving(true);
    try {
      const item = items.find(c => c.id === id);
      if (!item) {
        console.error('Item não encontrado:', id);
        setSaving(false);
        return;
      }
      
      const newVisible = !item.visible;
      console.log('Alterando visibilidade:', { id, currentVisible: item.visible, newVisible });
      
      const res = await fetch('/api/admin/categories/visibility', { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer admin-token' }, 
        body: JSON.stringify({ id, visible: newVisible }) 
      });
      
      const j = await res.json();
      console.log('Resposta da API:', j);
      
      if (j?.success && j?.data) {
        // Atualizar com os dados retornados da API
        setItems(prev => prev.map(c => c.id === id ? { ...c, visible: j.data.visible } : c));
        setMessage({ type: 'success', text: `Categoria ${j.data.visible ? 'exibida' : 'ocultada'} no frontend` });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: j?.error || 'Erro ao alterar visibilidade' });
      }
    } catch (error) {
      console.error('Erro ao alternar visibilidade:', error);
      setMessage({ type: 'error', text: 'Erro ao alternar visibilidade' });
    } finally { 
      setSaving(false); 
    }
  };

  const move = async (id: string, dir: 'up'|'down') => {
    const idx = items.findIndex(c => c.id === id);
    if (idx < 0) return;
    if (dir==='up' && idx===0) return;
    if (dir==='down' && idx===items.length-1) return;
    const copy = [...items];
    const target = dir==='up' ? idx-1 : idx+1;
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    copy.forEach((c,i)=> c.order = i+1);
    setSaving(true);
    try {
      const res = await fetch('/api/admin/categories', { method: 'PUT', headers: { 'Content-Type':'application/json', 'Authorization':'Bearer admin-token' }, body: JSON.stringify({ type: 'bulk', data: copy }) });
      const j = await res.json();
      if (j?.success) setItems(copy);
    } finally { setSaving(false); }
  };

  const onSubmit = async (data: Omit<AdminCategory,'id'|'order'> & { id?: string }) => {
    setSaving(true);
    try {
      if (data.id) {
        const updated = items.map((c)=> c.id===data.id ? { ...c, ...data } as AdminCategory : c);
        const res = await fetch('/api/admin/categories', { method: 'PUT', headers: { 'Content-Type':'application/json', 'Authorization':'Bearer admin-token' }, body: JSON.stringify({ data: updated.find(c=>c.id===data.id) }) });
        const j = await res.json();
        if (j?.success) setItems(updated);
      } else {
        const res = await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization':'Bearer admin-token' }, body: JSON.stringify({ data }) });
        const j = await res.json();
        if (j?.success) setItems((list)=> [...list, j.data]);
      }
      setShowForm(false);
      setEditing(null);
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Categorias</h1>
          <p className="text-gray-600">Crie, edite, reordene e ative/desative categorias exibidas no site.</p>
          <p className="text-sm text-gray-500 mt-1">
            💡 <strong>Visibilidade:</strong> Use o ícone de olho para controlar quais categorias aparecem na página /categorias
          </p>
        </div>
        <button onClick={onCreate} className="inline-flex items-center gap-2 rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          Nova Categoria
        </button>
      </div>

      {message && (
        <div className={`rounded-md px-4 py-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold">Categorias</h2>
        </div>
        {loading ? (
          <div className="p-6 text-sm text-gray-600">Carregando...</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {items.map((c, idx)=> (
              <div key={c.id} className="p-6 flex items-start gap-4">
                <div className="relative h-16 w-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{c.name}</div>
                      <div className="text-xs text-gray-600 mt-0.5">Link: {c.link || <span className='text-red-600'>(vazio)</span>}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <span 
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${c.active? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                          title={c.active? 'Categoria ativa no sistema' : 'Categoria inativa'}
                        >
                          {c.active? 'Ativa' : 'Inativa'}
                        </span>
                        <span 
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${c.visible? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}
                          title={c.visible? 'Aparece na página /categorias' : 'Oculta da página /categorias'}
                        >
                          {c.visible? '👁️ Visível' : '🚫 Oculta'}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            (c.jornaleiro_status ?? 'all') === 'inactive'
                              ? 'bg-red-100 text-red-700'
                              : (c.jornaleiro_status ?? 'all') === 'specific'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {statusLabels[(c.jornaleiro_status ?? 'all') as 'all'|'specific'|'inactive']}
                        </span>
                        <span className="text-xs text-gray-500">Ordem: {c.order}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={()=>move(c.id,'up')} disabled={idx===0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30" title="Mover para cima">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
                      </button>
                      <button onClick={()=>move(c.id,'down')} disabled={idx===items.length-1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30" title="Mover para baixo">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                      </button>
                      <button onClick={()=>onToggleActive(c.id)} className={`p-1 ${c.active? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'}`} title={c.active? 'Desativar' : 'Ativar'}>
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg>
                      </button>
                      <button onClick={()=>onToggleVisible(c.id)} className={`p-1 ${c.visible? 'text-blue-600 hover:text-blue-800' : 'text-red-600 hover:text-red-800'}`} title={c.visible? 'Ocultar no frontend' : 'Exibir no frontend'}>
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">{c.visible ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></> : <><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.73 2.1-3.64 3.95-5.22"/><path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-.74 1.73-2.1 3.64-3.95 5.22"/><path d="M1 1l22 22"/></>}</svg>
                      </button>
                      <button onClick={()=>onEdit(c)} className="p-1 text-blue-600 hover:text-blue-800" title="Editar">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button onClick={()=>onDelete(c.id)} className="p-1 text-red-600 hover:text-red-800" title="Excluir">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {items.length===0 && (
              <div className="p-12 text-center text-gray-500">Nenhuma categoria cadastrada</div>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <CategoryForm 
          item={editing}
          onCancel={()=>{ setShowForm(false); setEditing(null); }}
          onSubmit={onSubmit}
          saving={saving}
          bancas={bancas}
        />
      )}
    </div>
  );
}

function CategoryForm({ item, onSubmit, onCancel, saving, bancas }: { item: AdminCategory | null; onSubmit: (data: Omit<AdminCategory,'id'|'order'> & { id?: string; jornaleiroStatus: 'all'|'specific'|'inactive'; jornaleiroBancas: string[] }) => void; onCancel: () => void; saving: boolean; bancas: AdminBancaOption[]; }) {
  const [name, setName] = useState(item?.name || "");
  const [image, setImage] = useState(item?.image || "");
  const [link, setLink] = useState(item?.link || "");
  const [active, setActive] = useState<boolean>(item?.active ?? true);
  const [visible, setVisible] = useState<boolean>(item?.visible ?? true);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jornaleiroStatus, setJornaleiroStatus] = useState<'all'|'specific'|'inactive'>(item?.jornaleiro_status ?? 'all');
  const [selectedBancas, setSelectedBancas] = useState<string[]>(item?.jornaleiro_bancas ?? []);

  useEffect(() => {
    if (jornaleiroStatus !== 'specific' && selectedBancas.length > 0) {
      setSelectedBancas([]);
    }
  }, [jornaleiroStatus]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // validação simples: link interno
    const normalizedLink = link.trim().startsWith('/') ? link.trim() : ('/' + link.trim().replace(/^\/+/,'' ) );
    onSubmit({
      id: item?.id,
      name,
      image,
      link: normalizedLink,
      active,
      visible,
      jornaleiroStatus,
      jornaleiroBancas: jornaleiroStatus === 'specific' ? selectedBancas : []
    });
  };

  const onFileDrop = async (f: File) => {
    try {
      setUploading(true);
      setError(null);
      const form = new FormData();
      form.append('file', f);
      const res = await fetch('/api/upload', { method: 'POST', headers: { 'Authorization': 'Bearer admin-token' }, body: form });
      const j = await res.json();
      if (!res.ok || !j?.ok) {
        setError(j?.error || 'Falha no upload');
        return;
      }
      setImage(j.url);
    } catch (e) {
      setError('Erro ao enviar arquivo');
    } finally {
      setUploading(false);
      setDragOver(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCancel} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <form onSubmit={submit} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{item? 'Editar' : 'Nova'} Categoria</h3>
              <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6"/></svg>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagem (URL)</label>
              <input type="text" value={image} onChange={(e)=>setImage(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="/uploads/arquivo.png ou URL completa" required />
              <p className="mt-1 text-xs text-gray-500">Você pode usar caminho relativo gerado pelo upload (ex.: /uploads/arquivo.png) ou uma URL completa.</p>
            </div>
            {/* Dropzone */}
            <div
              className={`mt-2 border-2 border-dashed rounded-lg p-4 text-center text-sm ${dragOver? 'border-[#ff5c00] bg-[#fff6ef]' : 'border-gray-300 bg-gray-50'}`}
              onDragOver={(e)=>{ e.preventDefault(); setDragOver(true); }}
              onDragLeave={()=>setDragOver(false)}
              onDrop={(e)=>{ e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files?.[0]; if (file) onFileDrop(file); }}
            >
              {uploading ? (
                <div className="text-gray-700">Enviando imagem...</div>
              ) : (
                <>
                  <div>Arraste e solte uma imagem aqui, ou clique para selecionar.</div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="cat-image-input"
                    onChange={(e)=>{ const f = e.target.files?.[0]; if (f) onFileDrop(f); }}
                  />
                  <label htmlFor="cat-image-input" className="mt-2 inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-gray-50 cursor-pointer">Selecionar arquivo</label>
                </>
              )}
            </div>
              {image && (
                <div className="mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="Preview" className="h-24 w-24 rounded-lg object-cover ring-1 ring-black/10" />
                </div>
              )}
              {error && <div className="mt-2 text-xs text-red-600">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
              <input value={link} onChange={(e)=>setLink(e.target.value)} placeholder="/categorias/slug" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" required />
              <p className="mt-1 text-xs text-gray-500">Sempre iniciar com "/". Ex: /categorias/revistas</p>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Configurações de Exibição</div>
              <label className="flex items-start gap-3">
                <input type="checkbox" className="rounded border-gray-300 mt-0.5" checked={active} onChange={(e)=>setActive(e.target.checked)} />
                <div>
                  <span className="text-sm font-medium text-gray-900 block">Categoria ativa</span>
                  <span className="text-xs text-gray-500">Categoria habilitada no sistema</span>
                </div>
              </label>
              <label className="flex items-start gap-3">
                <input type="checkbox" className="rounded border-gray-300 mt-0.5" checked={visible} onChange={(e)=>setVisible(e.target.checked)} />
                <div>
                  <span className="text-sm font-medium text-gray-900 block">👁️ Visível na página /categorias</span>
                  <span className="text-xs text-gray-500">Se desmarcado, a categoria não aparecerá na listagem pública</span>
                </div>
              </label>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 block">Disponibilidade para Jornaleiros</label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={jornaleiroStatus}
                  onChange={(e)=>setJornaleiroStatus(e.target.value as 'all'|'specific'|'inactive')}
                >
                  <option value="all">Ativa para todos os jornaleiros</option>
                  <option value="specific">Ativa apenas para jornaleiros específicos</option>
                  <option value="inactive">Inativa para jornaleiros</option>
                </select>
                {jornaleiroStatus === 'specific' && (
                  <div className="rounded-md border border-gray-200 bg-white p-3 max-h-40 overflow-y-auto space-y-2">
                    {bancas.length === 0 && (
                      <p className="text-xs text-gray-500">Nenhuma banca cadastrada.</p>
                    )}
                    {bancas.map((banca) => (
                      <label key={banca.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedBancas.includes(banca.id)}
                          onChange={(e)=>{
                            setSelectedBancas((prev)=> {
                              if (e.target.checked) {
                                return Array.from(new Set([...prev, banca.id]));
                              }
                              return prev.filter((id)=>id !== banca.id);
                            });
                          }}
                        />
                        <span>{banca.name}</span>
                      </label>
                    ))}
                    <p className="text-xs text-gray-500">Selecione as bancas que poderão associar esta categoria.</p>
                  </div>
                )}
                {jornaleiroStatus === 'inactive' && (
                  <p className="text-xs text-red-600">Jornaleiros não poderão utilizar esta categoria enquanto estiver inativa.</p>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500">Categorias invisíveis não aparecem no site, mas permanecem no sistema.</p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
              <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-[#ff5c00] rounded-md hover:opacity-90">{saving? 'Salvando...' : 'Salvar'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

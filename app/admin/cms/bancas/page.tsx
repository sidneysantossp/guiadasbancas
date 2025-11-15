"use client";

import { useEffect, useMemo, useState } from "react";
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
  addressObj?: { cep?: string; street?: string; number?: string; complement?: string; neighborhood?: string; city?: string; uf?: string };
  contact?: { whatsapp?: string };
  socials?: { facebook?: string; instagram?: string; gmb?: string };
  hours?: Array<{ key: string; label: string; open: boolean; start: string; end: string }>;
  rating?: number;
  tags?: string[];
  payments?: string[];
  featured?: boolean;
  ctaUrl?: string;
  gallery?: string[];
  images?: { cover?: string; avatar?: string };
  location?: { lat?: number; lng?: number };
};

export default function BancasPage() {
  const [items, setItems] = useState<AdminBanca[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [featuredFirst, setFeaturedFirst] = useState(false);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/bancas?all=true', {
        headers: { 'Authorization': 'Bearer admin-token' }
      });
      const json = await res.json();
      if (json?.success) {
        setItems(json.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar bancas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const onCreate = () => {
    window.location.href = '/admin/cms/bancas/new';
  };

  const onEdit = (banca: AdminBanca) => {
    window.location.href = `/admin/cms/bancas/${banca.id}`;
  };

  const toggleBancaStatus = async (banca: AdminBanca) => {
    try {
      const newStatus = !banca.active;
      const res = await fetch('/api/admin/bancas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify({
          data: {
            id: banca.id,
            name: banca.name,
            active: newStatus
          }
        })
      });

      if (res.ok) {
        // Atualizar o estado local
        setItems(items.map(item => 
          item.id === banca.id ? { ...item, active: newStatus } : item
        ));
        console.log(`Banca ${banca.name} ${newStatus ? 'ativada' : 'desativada'} com sucesso`);
      } else {
        console.error('Erro ao alterar status da banca');
      }
    } catch (error) {
      console.error('Erro ao alterar status da banca:', error);
    }
  };

  const deleteBanca = async (banca: AdminBanca) => {
    try {
      const res = await fetch(`/api/admin/bancas?id=${banca.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      });

      const result = await res.json();

      if (res.ok) {
        // Remover do estado local
        setItems(items.filter(item => item.id !== banca.id));
        alert(`Banca "${banca.name}" excluída com sucesso!`);
      } else {
        alert(`Erro ao excluir banca: ${result.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao excluir banca:', error);
      alert('Erro ao excluir banca. Tente novamente.');
    }
  };

  const filteredItems = useMemo(() => {
    let filtered = items;
    if (showPendingOnly) {
      filtered = filtered.filter(item => !item.active);
    }
    if (showFeaturedOnly) {
      filtered = filtered.filter(item => item.featured);
    }
    if (featuredFirst) {
      filtered = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return filtered;
  }, [items, showPendingOnly, showFeaturedOnly, featuredFirst]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Bancas</h1>
          <p className="text-gray-600">Crie, edite, reordene e ative/desative bancas exibidas no site.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={showPendingOnly}
              onChange={(e) => setShowPendingOnly(e.target.checked)}
              className="rounded border-gray-300"
            />
            Somente pendentes
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={showFeaturedOnly}
              onChange={(e) => setShowFeaturedOnly(e.target.checked)}
              className="rounded border-gray-300"
            />
            Somente destaque
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={featuredFirst}
              onChange={(e) => setFeaturedFirst(e.target.checked)}
              className="rounded border-gray-300"
            />
            Destaques primeiro
          </label>
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Nova Banca
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold">Bancas</h2>
        </div>
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5c00]"></div>
            <p className="mt-2 text-gray-600">Carregando bancas...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden">
                    {item.cover ? (
                      <img src={item.cover} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gray-200"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        item.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.active ? 'Ativa' : 'Inativa'}
                      </span>
                      {item.featured && (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                          Destaque
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Toggle de ativação */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={() => toggleBancaStatus(item)}
                      className="sr-only"
                    />
                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      item.active ? 'bg-green-600' : 'bg-gray-300'
                    }`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        item.active ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </div>
                    <span className="text-sm text-gray-600">
                      {item.active ? 'Ativa' : 'Inativa'}
                    </span>
                  </label>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Editar
                    </button>
                    <Link
                      href={`/banca/${item.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 rounded-md bg-gray-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
                    >
                      Ver
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja excluir a banca "${item.name}"?\n\nEsta ação não pode ser desfeita.`)) {
                          deleteBanca(item);
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                      title="Excluir banca"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="p-12 text-center text-gray-500">Nenhuma banca cadastrada</div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}

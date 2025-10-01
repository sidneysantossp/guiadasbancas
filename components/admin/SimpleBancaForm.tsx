"use client";

import { useState } from "react";
import { useCategories } from "@/lib/useCategories";
import { maskCEP, maskPhoneBR } from "@/lib/masks";

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
};

interface SimpleBancaFormProps {
  item: AdminBanca | null;
  onSubmit: (data: Omit<AdminBanca,'id'|'order'> & { id?: string }) => void;
  onCancel: () => void;
  saving: boolean;
}

export default function SimpleBancaForm({ item, onSubmit, onCancel, saving }: SimpleBancaFormProps) {
  const [name, setName] = useState(item?.name || "");
  const [address, setAddress] = useState(item?.address || "");
  const [cep, setCep] = useState(item?.addressObj?.cep || "");
  const [cover, setCover] = useState(item?.cover || "");
  const [whatsapp, setWhatsapp] = useState(item?.contact?.whatsapp || "");
  const [active, setActive] = useState(item?.active !== false);
  const [cats, setCats] = useState<string[]>(item?.categories || []);
  const [description, setDescription] = useState(item?.description || "");
  const { items: categories } = useCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      id: item?.id,
      name,
      address,
      cover,
      description,
      addressObj: { cep },
      contact: { whatsapp },
      categories: cats,
      active,
      createdAt: item?.createdAt || new Date().toISOString(),
    });
  };

  const toggleCategory = (categoryId: string) => {
    setCats(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCancel} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-semibold">
                {item ? 'Editar' : 'Nova'} Banca
              </h3>
              <button 
                type="button" 
                onClick={onCancel} 
                className="text-gray-400 hover:text-gray-600"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M6 18L18 6"/>
                </svg>
              </button>
            </div>

            {/* Informações Básicas */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Informações Básicas</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Banca *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(maskCEP(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                    placeholder="00000-000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="Rua, número, bairro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(maskPhoneBR(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL da Imagem de Capa
                </label>
                <input
                  type="url"
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="Descrição da banca..."
                />
              </div>
            </div>

            {/* Categorias */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Categorias</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={cats.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Status</h4>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm">Banca ativa (visível no site)</span>
              </label>
            </div>

            {/* Botões */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-[#ff5c00] rounded-md hover:opacity-90 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCategories } from "@/lib/useCategories";
import FileUploadDragDrop from "@/components/common/FileUploadDragDrop";
import { maskCEP, maskPhoneBR } from "@/lib/masks";

export default function NewBancaPage() {
  const router = useRouter();
  const { items: categories } = useCategories();
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [cep, setCep] = useState("");
  const [cover, setCover] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tpuUrl, setTpuUrl] = useState<string>("");

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const data = {
        name,
        address,
        cover,
        description,
        tpu_url: tpuUrl || undefined,
        addressObj: { cep },
        contact: { whatsapp },
        categories: selectedCategories,
        active,
      };

      const res = await fetch('/api/admin/bancas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify({ data })
      });

      const json = await res.json();
      
      if (json?.success) {
        alert('Banca criada com sucesso!');
        router.push('/admin/cms/bancas');
      } else {
        setError(json?.error || 'Erro ao criar banca');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Nova Banca</h1>
        <p className="text-sm text-gray-600">Cadastre uma nova banca no sistema.</p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-4 rounded-lg border border-gray-200 bg-white p-4">
          <div>
            <label className="text-sm font-medium">Nome da Banca</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Endereço</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Rua, número, bairro, cidade"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">CEP</label>
              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(maskCEP(e.target.value))}
                placeholder="00000-000"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium">WhatsApp</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(maskPhoneBR(e.target.value))}
                placeholder="(11) 99999-9999"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">URL da Imagem de Capa</label>
            <input
              type="url"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
            />
            {cover && (
              <div className="mt-2">
                <img src={cover} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Descrição da banca..."
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div>
            <FileUploadDragDrop
              label="Termo de Permissão de Uso (TPU) - PDF"
              value={tpuUrl}
              onChange={setTpuUrl}
              accept="application/pdf"
              role="admin"
              className="h-24 w-full"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="text-sm font-medium mb-3">Status</h3>
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

          {/* Categorias */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="text-sm font-medium mb-3">Categorias</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categories.map((category: any) => (
                <label key={category.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ações */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="space-y-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-md bg-[#ff5c00] px-3 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/cms/bancas')}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

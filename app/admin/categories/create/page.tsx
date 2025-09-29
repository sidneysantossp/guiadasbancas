"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/admin/ToastProvider";
import ImageUploader from "@/components/admin/ImageUploader";

interface CategoryForm {
  name: string;
  image: string;
  link: string;
  active: boolean;
}

export default function CreateCategoryPage() {
  const router = useRouter();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CategoryForm>({
    name: "",
    image: "",
    link: "",
    active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      toast.error("Nome da categoria é obrigatório");
      return;
    }

    try {
      setSaving(true);
      
      // Gerar slug automaticamente se link não foi preenchido
      const slug = form.link || form.name.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const categoryData = {
        ...form,
        link: `/categorias/${slug}`,
        name: form.name.trim()
      };

      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify({ data: categoryData })
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Categoria criada com sucesso!");
        router.push("/admin/categories");
      } else {
        toast.error(result.error || "Erro ao criar categoria");
      }
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      toast.error("Erro ao criar categoria");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (files: File[], previews: string[]) => {
    if (previews.length > 0) {
      setForm(prev => ({ ...prev, image: previews[0] }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Categoria</h1>
          <p className="text-gray-600 mt-1">Crie uma nova categoria para organizar os produtos</p>
        </div>
        <Link
          href="/admin/categories"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Voltar
        </Link>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Categoria *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff5c00] focus:border-[#ff5c00]"
              placeholder="Ex: Revistas, Jornais, Papelaria..."
              required
            />
          </div>

          {/* Imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem da Categoria
            </label>
            <ImageUploader
              multiple={false}
              max={1}
              value={form.image ? [form.image] : []}
              onChange={handleImageUpload}
            />
            <p className="text-xs text-gray-500 mt-1">
              Recomendado: 300x300px, formato PNG ou JPG, máximo 2MB
            </p>
          </div>

          {/* Link/Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug da URL (opcional)
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                /categorias/
              </span>
              <input
                type="text"
                value={form.link.replace('/categorias/', '')}
                onChange={(e) => setForm(prev => ({ 
                  ...prev, 
                  link: e.target.value ? `/categorias/${e.target.value}` : ''
                }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-[#ff5c00] focus:border-[#ff5c00]"
                placeholder="sera-gerado-automaticamente"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Se não preenchido, será gerado automaticamente baseado no nome
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm(prev => ({ ...prev, active: e.target.checked }))}
                className="h-4 w-4 text-[#ff5c00] focus:ring-[#ff5c00] border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Categoria ativa</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Categorias inativas não aparecem no site público
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-[#ff5c00] text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </>
              ) : (
                "Criar Categoria"
              )}
            </button>
            <Link
              href="/admin/categories"
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

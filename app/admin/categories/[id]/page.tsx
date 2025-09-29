"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/admin/ToastProvider";
import ImageUploader from "@/components/admin/ImageUploader";

interface CategoryForm {
  id: string;
  name: string;
  image: string;
  link: string;
  active: boolean;
  order: number;
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<CategoryForm>({
    id: "",
    name: "",
    image: "",
    link: "",
    active: true,
    order: 0
  });

  const categoryId = params.id as string;

  useEffect(() => {
    loadCategory();
  }, [categoryId]);

  const loadCategory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/categories?all=true', {
        headers: { 'Authorization': 'Bearer admin-token' }
      });
      const result = await response.json();
      
      if (result.success) {
        const category = result.data.find((c: any) => c.id === categoryId);
        if (category) {
          setForm(category);
        } else {
          toast.error("Categoria não encontrada");
          router.push("/admin/categories");
        }
      } else {
        toast.error("Erro ao carregar categoria");
      }
    } catch (error) {
      console.error("Erro ao carregar categoria:", error);
      toast.error("Erro ao carregar categoria");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      toast.error("Nome da categoria é obrigatório");
      return;
    }

    try {
      setSaving(true);
      
      const categoryData = {
        ...form,
        name: form.name.trim()
      };

      const response = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify({ data: categoryData })
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Categoria atualizada com sucesso!");
        router.push("/admin/categories");
      } else {
        toast.error(result.error || "Erro ao atualizar categoria");
      }
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      toast.error("Erro ao atualizar categoria");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      setDeleting(true);
      
      const response = await fetch(`/api/admin/categories?id=${categoryId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer admin-token' }
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Categoria excluída com sucesso!");
        router.push("/admin/categories");
      } else {
        toast.error(result.error || "Erro ao excluir categoria");
      }
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      toast.error("Erro ao excluir categoria");
    } finally {
      setDeleting(false);
    }
  };

  const handleImageUpload = (files: File[], previews: string[]) => {
    if (previews.length > 0) {
      setForm(prev => ({ ...prev, image: previews[0] }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#ff5c00] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando categoria...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Categoria</h1>
          <p className="text-gray-600 mt-1">Edite as informações da categoria</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 disabled:opacity-50"
          >
            {deleting ? "Excluindo..." : "Excluir"}
          </button>
          <Link
            href="/admin/categories"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Voltar
          </Link>
        </div>
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
              URL da Categoria
            </label>
            <input
              type="text"
              value={form.link}
              onChange={(e) => setForm(prev => ({ ...prev, link: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff5c00] focus:border-[#ff5c00]"
              placeholder="/categorias/nome-da-categoria"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL completa da categoria no site
            </p>
          </div>

          {/* Ordem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordem de Exibição
            </label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff5c00] focus:border-[#ff5c00]"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ordem de exibição no site (menor número aparece primeiro)
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
                "Salvar Alterações"
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

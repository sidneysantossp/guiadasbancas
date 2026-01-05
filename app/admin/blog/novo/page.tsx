"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BlogPost, AUTHOR } from "@/app/(site)/blog/posts";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const countWords = (text: string): number => {
  if (!text || text.trim() === '') return 0;
  return text.replace(/\s+/g, ' ').trim().split(' ').filter(word => word.length > 0).length;
};

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    slug: "",
    title: "",
    metaTitle: "",
    metaDescription: "",
    excerpt: "",
    content: "",
    coverImage: "",
    coverImageAlt: "",
    category: "",
    tags: [],
    focusKeyword: "",
    secondaryKeywords: [],
    publishedAt: new Date().toISOString(),
    readTime: 5,
    wordCount: 0
  });
  const handleInputChange = (field: keyof BlogPost, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate campos quando necessário
    if (field === "title") {
      const title = value as string;
      const slug = generateSlug(title);
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
    
    if (field === "content") {
      const wordCount = countWords(value as string);
      const readTime = Math.ceil(wordCount / 200); // 200 palavras por minuto
      
      setFormData(prev => ({
        ...prev,
        wordCount,
        readTime
      }));
    }
  };

  const handleSave = async (publish: boolean = false) => {
    setSaving(true);
    
    // Gerar slug se não existir
    const slug = formData.slug || generateSlug(formData.title || "");
    
    // Criar objeto completo do post
    const newPost: BlogPost = {
      slug,
      title: formData.title || "",
      metaTitle: formData.metaTitle || formData.title || "",
      metaDescription: formData.metaDescription || "",
      excerpt: formData.excerpt || "",
      content: formData.content || "",
      coverImage: formData.coverImage || "",
      coverImageAlt: formData.coverImageAlt || "",
      author: AUTHOR,
      category: formData.category || "",
      tags: formData.tags || [],
      focusKeyword: formData.focusKeyword || "",
      secondaryKeywords: formData.secondaryKeywords || [],
      publishedAt: formData.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTime: formData.readTime || 5,
      wordCount: formData.wordCount || 0
    };

    // Simulação de salvamento (em produção, salvaria no banco)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Criando novo post:", newPost);
    
    setSaving(false);
    
    if (publish) {
      alert("Post publicado com sucesso! (Implementação de backend necessária)");
      router.push("/admin/blog");
    } else {
      alert("Post salvo como rascunho! (Implementação de backend necessária)");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Novo Post</h1>
            <p className="text-gray-600">Crie um novo artigo para o blog</p>
          </div>
          <Link
            href="/admin/blog"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Voltar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título (H1) *
                </label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                  placeholder="Título otimizado para SEO"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title (50-60 caracteres)
                </label>
                <input
                  type="text"
                  value={formData.metaTitle || ""}
                  onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                  placeholder="Title tag para SEO"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {(formData.metaTitle?.length || 0)}/60 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description (150-160 caracteres)
                </label>
                <textarea
                  value={formData.metaDescription || ""}
                  onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                  rows={3}
                  placeholder="Meta description para SEO"
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {(formData.metaDescription?.length || 0)}/160 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt || ""}
                  onChange={(e) => handleInputChange("excerpt", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                  rows={3}
                  placeholder="Resumo do post"
                />
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Conteúdo</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conteúdo do Post (Markdown) *
              </label>
              <MarkdownEditor
                value={formData.content || ""}
                onChange={(value) => handleInputChange("content", value)}
                placeholder="Digite o conteúdo do seu artigo aqui usando Markdown..."
                height={500}
              />
              <div className="mt-2 flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {formData.content?.replace(/\s+/g, ' ').trim().split(' ').filter(word => word.length > 0).length || 0} palavras
                </p>
                <p className="text-xs text-gray-400">
                  Editor Markdown com preview em tempo real
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* SEO */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Palavra-chave Principal
                </label>
                <input
                  type="text"
                  value={formData.focusKeyword || ""}
                  onChange={(e) => handleInputChange("focusKeyword", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                  placeholder="Palavra-chave principal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Palavras-chave Secundárias (separadas por vírgula)
                </label>
                <textarea
                  value={formData.secondaryKeywords?.join(", ") || ""}
                  onChange={(e) => handleInputChange("secondaryKeywords", e.target.value.split(", ").filter(Boolean) as string[])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                  rows={3}
                  placeholder="Palavras-chave LSI"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria *
                </label>
                <select
                  value={formData.category || ""}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="Dicas">Dicas</option>
                  <option value="Notícias">Notícias</option>
                  <option value="Guia">Guia</option>
                  <option value="Cultura">Cultura</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.tags?.join(", ") || ""}
                  onChange={(e) => handleInputChange("tags", e.target.value.split(", ").filter(Boolean) as string[])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                  placeholder="Tags do post"
                />
              </div>
            </div>
          </div>

          {/* Mídia */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mídia</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL da Imagem de Capa *
                </label>
                <input
                  type="text"
                  value={formData.coverImage || ""}
                  onChange={(e) => handleInputChange("coverImage", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                  placeholder="URL da imagem"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text da Imagem *
                </label>
                <input
                  type="text"
                  value={formData.coverImageAlt || ""}
                  onChange={(e) => handleInputChange("coverImageAlt", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                  placeholder="Texto alternativo para SEO"
                  required
                />
              </div>

              {formData.coverImage && (
                <div className="relative h-32 rounded-lg overflow-hidden">
                  <Image
                    src={formData.coverImage}
                    alt={formData.coverImageAlt || ""}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Publicação */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Publicação</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Publicação
                </label>
                <input
                  type="date"
                  value={formData.publishedAt?.split("T")[0] || ""}
                  onChange={(e) => handleInputChange("publishedAt", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tempo de Leitura (minutos)
                </label>
                <input
                  type="number"
                  value={formData.readTime || ""}
                  onChange={(e) => handleInputChange("readTime", parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                  placeholder="Minutos"
                />
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-3">
              <button
                onClick={() => handleSave(true)}
                disabled={saving || !formData.title || !formData.content || !formData.coverImage}
                className="w-full bg-[#ff5c00] text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {saving ? "Publicando..." : "Publicar Post"}
              </button>
              
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Salvar Rascunho"}
              </button>
            </div>
            
            <div className="mt-4">
              <Link
                href="/admin/blog"
                className="block w-full text-center text-gray-600 text-sm hover:text-gray-800"
              >
                Cancelar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts, BlogPost } from "@/app/(site)/blog/posts";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<BlogPost>>({});

  useEffect(() => {
    const loadPost = () => {
      const allPosts = getAllPosts();
      const foundPost = allPosts.find(p => p.slug === params.slug);
      
      if (!foundPost) {
        router.push("/admin/blog");
        return;
      }
      
      setPost(foundPost);
      setFormData(foundPost);
      setLoading(false);
    };
    
    loadPost();
  }, [params.slug, router]);

  const handleSave = async () => {
    if (!post) return;
    
    setSaving(true);
    
    // Simulação de salvamento (em produção, salvaria no banco)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Aqui você implementaria a lógica real de salvamento
    console.log("Salvando post:", formData);
    
    setSaving(false);
    alert("Post salvo com sucesso! (Implementação de backend necessária)");
  };

  const handleInputChange = (field: keyof BlogPost, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5c00]"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Post</h1>
            <p className="text-gray-600">Edite o artigo do blog</p>
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
                  Título (H1)
                </label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                  placeholder="Título otimizado para SEO"
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
                Conteúdo do Post (Markdown)
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
                  Categoria
                </label>
                <select
                  value={formData.category || ""}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
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
                  URL da Imagem de Capa
                </label>
                <input
                  type="text"
                  value={formData.coverImage || ""}
                  onChange={(e) => handleInputChange("coverImage", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                  placeholder="URL da imagem"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text da Imagem
                </label>
                <input
                  type="text"
                  value={formData.coverImageAlt || ""}
                  onChange={(e) => handleInputChange("coverImageAlt", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
                  placeholder="Texto alternativo para SEO"
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
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[#ff5c00] text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar Post"}
            </button>
            
            <div className="mt-4 space-y-2">
              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                className="block w-full text-center bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Visualizar Post
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

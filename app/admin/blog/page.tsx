"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts, BlogPost } from "@/app/blog/posts";

interface BlogStats {
  totalPosts: number;
  totalWords: number;
  avgWordsPerPost: number;
  publishedThisMonth: number;
  categories: string[];
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const loadData = () => {
      const allPosts = getAllPosts();
      setPosts(allPosts);
      
      // Calcular estatísticas
      const totalWords = allPosts.reduce((sum, post) => sum + post.wordCount, 0);
      const avgWords = Math.round(totalWords / allPosts.length);
      
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const publishedThisMonth = allPosts.filter(
        post => new Date(post.publishedAt) >= thisMonth
      ).length;
      
      const categories = [...new Set(allPosts.map(post => post.category))];
      
      setStats({
        totalPosts: allPosts.length,
        totalWords,
        avgWordsPerPost: avgWords,
        publishedThisMonth,
        categories
      });
      
      setLoading(false);
    };
    
    loadData();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5c00]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Blog</h1>
        <p className="text-gray-600">Administre todos os artigos do blog Guia das Bancas</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Total de Posts</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalPosts}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Total de Palavras</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalWords.toLocaleString('pt-BR')}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Média por Post</div>
            <div className="text-2xl font-bold text-gray-900">{stats.avgWordsPerPost}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Publicados este mês</div>
            <div className="text-2xl font-bold text-gray-900">{stats.publishedThisMonth}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Categorias</div>
            <div className="text-2xl font-bold text-gray-900">{stats.categories.length}</div>
          </div>
        </div>
      )}

      {/* Actions and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <input
              type="text"
              placeholder="Buscar posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5c00] focus:border-transparent"
            >
              <option value="">Todas categorias</option>
              {stats?.categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <Link
            href="/admin/blog/novo"
            className="bg-[#ff5c00] text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Novo Post
          </Link>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Palavras
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Publicação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.slug} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0">
                        <Image
                          src={post.coverImage}
                          alt={post.coverImageAlt}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {post.focusKeyword}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {post.wordCount.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Publicado
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/blog/${post.slug}/editar`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </Link>
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Ver
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum post encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}

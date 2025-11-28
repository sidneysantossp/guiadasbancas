"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconSearch,
  IconTags,
  IconBox,
  IconCheck,
  IconX,
  IconEye,
  IconEyeOff,
  IconPhoto,
  IconChartBar,
} from "@tabler/icons-react";

type Category = {
  id: string;
  name: string;
  image?: string;
  link?: string;
  order: number;
  active: boolean;
  visible?: boolean;
  product_count: number;
  active_product_count: number;
  inactive_product_count: number;
};

type Stats = {
  total_categories: number;
  categories_with_products: number;
  total_products: number;
  active_products: number;
};

export default function DistribuidorCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "with_products" | "empty">("all");
  const [distribuidor, setDistribuidor] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem("gb:distribuidor");
    if (raw) {
      setDistribuidor(JSON.parse(raw));
    }
  }, []);

  const fetchCategories = async () => {
    if (!distribuidor?.id) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/distribuidor/categories?id=${distribuidor.id}`);
      const json = await res.json();

      if (json.success) {
        setCategories(json.data || []);
        setStats(json.stats || null);
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (distribuidor?.id) {
      fetchCategories();
    }
  }, [distribuidor]);

  // Filtrar categorias
  const filteredCategories = categories.filter((cat) => {
    // Filtro de busca
    if (search && !cat.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    // Filtro por tipo
    if (filterType === "with_products" && cat.product_count === 0) {
      return false;
    }
    if (filterType === "empty" && cat.product_count > 0) {
      return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600">
            Visualize as categorias e a distribuição dos seus produtos
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <IconTags className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total_categories}</p>
                <p className="text-sm text-gray-600">Total de Categorias</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <IconChartBar className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.categories_with_products}</p>
                <p className="text-sm text-gray-600">Com Produtos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <IconBox className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total_products}</p>
                <p className="text-sm text-gray-600">Total de Produtos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <IconCheck className="text-emerald-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.active_products}</p>
                <p className="text-sm text-gray-600">Produtos Ativos</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar categoria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter Type */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterType("with_products")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === "with_products"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Com Produtos
            </button>
            <button
              onClick={() => setFilterType("empty")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === "empty"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Vazias
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Image */}
            <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <IconPhoto className="text-gray-400" size={48} />
                </div>
              )}
              
              {/* Status badges */}
              <div className="absolute top-2 right-2 flex gap-1">
                {category.active ? (
                  <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                    Ativa
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    Inativa
                  </span>
                )}
                {category.visible === false && (
                  <span className="px-2 py-0.5 bg-gray-500 text-white text-xs rounded-full flex items-center gap-1">
                    <IconEyeOff size={12} /> Oculta
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                {category.name}
              </h3>

              {/* Product counts */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total de produtos:</span>
                  <span className="font-medium text-gray-900">{category.product_count}</span>
                </div>

                {category.product_count > 0 && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <IconCheck size={14} className="text-green-500" /> Ativos:
                      </span>
                      <span className="font-medium text-green-600">{category.active_product_count}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <IconX size={14} className="text-red-500" /> Inativos:
                      </span>
                      <span className="font-medium text-red-600">{category.inactive_product_count}</span>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{
                            width: `${(category.active_product_count / category.product_count) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        {Math.round((category.active_product_count / category.product_count) * 100)}% ativos
                      </p>
                    </div>
                  </>
                )}

                {category.product_count === 0 && (
                  <p className="text-sm text-gray-400 italic">Nenhum produto nesta categoria</p>
                )}
              </div>

              {/* Actions */}
              {category.product_count > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Link
                    href={`/distribuidor/produtos?categoria=${category.id}`}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                  >
                    <IconEye size={18} />
                    Ver Produtos
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredCategories.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <IconTags className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma categoria encontrada
          </h3>
          <p className="text-gray-600">
            {search
              ? "Tente buscar por outro termo"
              : filterType === "with_products"
              ? "Nenhuma categoria possui produtos"
              : filterType === "empty"
              ? "Todas as categorias possuem produtos"
              : "Não há categorias cadastradas"}
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
        <p>
          Exibindo <strong>{filteredCategories.length}</strong> de{" "}
          <strong>{categories.length}</strong> categorias
          {filterType === "with_products" && " com produtos"}
          {filterType === "empty" && " vazias"}
        </p>
      </div>
    </div>
  );
}

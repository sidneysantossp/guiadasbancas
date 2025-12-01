"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconSearch,
  IconBuildingStore,
  IconPackage,
  IconCurrencyReal,
  IconClock,
  IconCheck,
  IconX,
  IconBrandWhatsapp,
  IconEye,
  IconRefresh,
  IconFilter,
  IconMapPin,
} from "@tabler/icons-react";

type Banca = {
  id: string;
  name: string;
  address: string;
  whatsapp?: string;
  cover_image?: string;
  avatar?: string;
  active: boolean;
  created_at: string;
  lat?: number;
  lng?: number;
  is_cotista: boolean;
  tem_produtos_distribuidor: boolean;
  produtos_distribuidor: number;
  produtos_ativos: number;
  total_pedidos: number;
  pedidos_pendentes: number;
  valor_total: number;
  ultimo_pedido_status?: string;
  ultimo_pedido_data?: string;
};

type Stats = {
  total_bancas: number;
  bancas_com_produtos: number;
  total_pedidos: number;
  valor_total: number;
};

export default function DistribuidorBancasPage() {
  const [distribuidor, setDistribuidor] = useState<any>(null);
  const [bancas, setBancas] = useState<Banca[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("gb:distribuidor");
    if (raw) {
      setDistribuidor(JSON.parse(raw));
    }
  }, []);

  const fetchBancas = async () => {
    if (!distribuidor?.id) return;

    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("id", distribuidor.id);
      if (search) params.set("q", search);

      const res = await fetch(`/api/distribuidor/bancas?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        let items = json.items || [];
        
        // Filtrar no frontend
        if (statusFilter === "com_produtos") {
          items = items.filter((b: Banca) => b.tem_produtos_distribuidor);
        } else if (statusFilter === "sem_produtos") {
          items = items.filter((b: Banca) => !b.tem_produtos_distribuidor);
        }
        
        setBancas(items);
        setStats(json.stats || null);
      }
    } catch (error) {
      console.error("Erro ao buscar bancas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (distribuidor?.id) {
      fetchBancas();
    }
  }, [distribuidor, statusFilter, search]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const formatPrice = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; bg: string; icon: any }> = {
      novo: { label: 'Novo', color: 'text-amber-700', bg: 'bg-amber-100', icon: IconClock },
      confirmado: { label: 'Confirmado', color: 'text-blue-700', bg: 'bg-blue-100', icon: IconCheck },
      em_preparo: { label: 'Em Preparo', color: 'text-orange-700', bg: 'bg-orange-100', icon: IconPackage },
      saiu_para_entrega: { label: 'Em Entrega', color: 'text-purple-700', bg: 'bg-purple-100', icon: IconPackage },
      entregue: { label: 'Entregue', color: 'text-green-700', bg: 'bg-green-100', icon: IconCheck },
      cancelado: { label: 'Cancelado', color: 'text-red-700', bg: 'bg-red-100', icon: IconX },
    };
    return configs[status] || { label: status, color: 'text-gray-700', bg: 'bg-gray-100', icon: IconClock };
  };

  const openWhatsApp = (whatsapp: string | undefined, bancaName: string) => {
    if (!whatsapp) {
      alert('WhatsApp não disponível');
      return;
    }
    const phone = whatsapp.replace(/\D/g, '');
    const message = `Olá! Somos da ${distribuidor?.nome || 'distribuidora'}. Gostaríamos de conversar sobre parceria.`;
    window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading && !bancas.length) {
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
          <h1 className="text-2xl font-bold text-gray-900">Bancas</h1>
          <p className="text-gray-600">
            Todas as bancas ativas cadastradas no sistema
          </p>
        </div>
        <button
          onClick={fetchBancas}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
        >
          <IconRefresh size={18} />
          Atualizar
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <IconBuildingStore className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.total_bancas}</p>
                <p className="text-xs text-gray-600">Total de Bancas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <IconCheck className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.bancas_com_produtos}</p>
                <p className="text-xs text-gray-600">Com Seus Produtos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <IconPackage className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.total_pedidos}</p>
                <p className="text-xs text-gray-600">Total de Pedidos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <IconCurrencyReal className="text-emerald-600" size={20} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{formatPrice(stats.valor_total)}</p>
                <p className="text-xs text-gray-600">Valor Total</p>
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
              placeholder="Buscar por nome ou endereço..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter("")}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                !statusFilter ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setStatusFilter("com_produtos")}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                statusFilter === "com_produtos" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Com Seus Produtos
            </button>
            <button
              onClick={() => setStatusFilter("sem_produtos")}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                statusFilter === "sem_produtos" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Sem Seus Produtos
            </button>
          </div>
        </div>
      </div>

      {/* Bancas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bancas.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm border p-12 text-center">
            <IconBuildingStore className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma banca encontrada
            </h3>
            <p className="text-gray-600">
              {search || statusFilter
                ? "Tente ajustar os filtros"
                : "Nenhuma banca ativa cadastrada no sistema"}
            </p>
          </div>
        ) : (
          bancas.map((banca) => (
            <div
              key={banca.id}
              className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200">
                {banca.cover_image ? (
                  <Image
                    src={banca.cover_image}
                    alt={banca.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <IconBuildingStore className="text-gray-400" size={48} />
                  </div>
                )}
                
                {/* Status badge */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {banca.tem_produtos_distribuidor && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Seus Produtos
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <div className="absolute -bottom-8 left-4">
                  <div className="w-16 h-16 rounded-full border-4 border-white bg-white overflow-hidden">
                    {banca.avatar ? (
                      <Image
                        src={banca.avatar}
                        alt={banca.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <IconBuildingStore size={32} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 pt-10">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">{banca.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <IconMapPin size={14} />
                  <span className="line-clamp-1">{banca.address}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-gray-900">{banca.produtos_ativos}</p>
                    <p className="text-xs text-gray-600">Produtos</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-gray-900">{banca.total_pedidos}</p>
                    <p className="text-xs text-gray-600">Pedidos</p>
                  </div>
                </div>

                {/* Último pedido */}
                {banca.ultimo_pedido_status && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getStatusConfig(banca.ultimo_pedido_status).bg
                      } ${getStatusConfig(banca.ultimo_pedido_status).color}`}>
                        {getStatusConfig(banca.ultimo_pedido_status).label}
                      </span>
                      <span className="text-gray-500">
                        {banca.ultimo_pedido_data && formatDate(banca.ultimo_pedido_data)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Valor total */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Total em pedidos:</p>
                  <p className="text-xl font-bold text-gray-900">{formatPrice(banca.valor_total)}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {banca.whatsapp && (
                    <button
                      onClick={() => openWhatsApp(banca.whatsapp, banca.name)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
                    >
                      <IconBrandWhatsapp size={16} />
                      WhatsApp
                    </button>
                  )}
                  <Link
                    href={`/distribuidor/pedidos?banca_id=${banca.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                  >
                    <IconEye size={16} />
                    Ver Pedidos
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
        <p>
          Exibindo <strong>{bancas.length}</strong> banca{bancas.length !== 1 ? 's' : ''}
          {statusFilter && ` (${statusFilter.replace('_', ' ')})`}
        </p>
      </div>
    </div>
  );
}

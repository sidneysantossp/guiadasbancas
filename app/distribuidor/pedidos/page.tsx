"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  IconSearch,
  IconPackage,
  IconClock,
  IconCheck,
  IconTruck,
  IconBox,
  IconCurrencyReal,
  IconEye,
  IconChevronLeft,
  IconChevronRight,
  IconRefresh,
  IconBrandWhatsapp,
  IconFilter,
} from "@tabler/icons-react";

type OrderItem = {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  banca_id: string;
  banca_name: string;
  banca_whatsapp?: string;
  items: OrderItem[];
  items_distribuidor: OrderItem[];
  total_itens_distribuidor: number;
  subtotal_distribuidor: number;
  total_itens_pedido: number;
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: string;
  payment_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

type Stats = {
  total_pedidos: number;
  pedidos_novos: number;
  pedidos_confirmados: number;
  pedidos_em_preparo: number;
  pedidos_entregues: number;
  valor_total: number;
};

export default function DistribuidorPedidosPage() {
  const [distribuidor, setDistribuidor] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("gb:distribuidor");
    if (raw) {
      setDistribuidor(JSON.parse(raw));
    }
  }, []);

  const fetchOrders = async () => {
    if (!distribuidor?.id) return;

    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("id", distribuidor.id);
      if (statusFilter) params.set("status", statusFilter);
      if (search) params.set("q", search);
      params.set("page", page.toString());
      params.set("limit", "20");

      const res = await fetch(`/api/distribuidor/pedidos?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setOrders(json.items || []);
        setPagination({ total: json.total || 0, pages: json.pages || 0 });
        setStats(json.stats || null);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (distribuidor?.id) {
      fetchOrders();
    }
  }, [distribuidor, statusFilter, search, page]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
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
      em_preparo: { label: 'Em Preparo', color: 'text-orange-700', bg: 'bg-orange-100', icon: IconBox },
      saiu_para_entrega: { label: 'Em Entrega', color: 'text-purple-700', bg: 'bg-purple-100', icon: IconTruck },
      entregue: { label: 'Entregue', color: 'text-green-700', bg: 'bg-green-100', icon: IconCheck },
      cancelado: { label: 'Cancelado', color: 'text-red-700', bg: 'bg-red-100', icon: IconClock },
    };
    return configs[status] || { label: status, color: 'text-gray-700', bg: 'bg-gray-100', icon: IconClock };
  };

  const openWhatsApp = (order: Order) => {
    const phone = (order.banca_whatsapp || '').replace(/\D/g, '');
    if (!phone) {
      alert('WhatsApp da banca não disponível');
      return;
    }
    const message = `Olá! Sobre o pedido #${order.id.slice(0, 8)} com ${order.total_itens_distribuidor} produto(s) nosso(s).`;
    window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading && !orders.length) {
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
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-600">
            Acompanhe os pedidos que contêm seus produtos
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
        >
          <IconRefresh size={18} />
          Atualizar
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <IconPackage className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.total_pedidos}</p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <IconClock className="text-amber-600" size={20} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.pedidos_novos}</p>
                <p className="text-xs text-gray-600">Novos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <IconCheck className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.pedidos_confirmados}</p>
                <p className="text-xs text-gray-600">Confirmados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <IconBox className="text-orange-600" size={20} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.pedidos_em_preparo}</p>
                <p className="text-xs text-gray-600">Em Preparo</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <IconTruck className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.pedidos_entregues}</p>
                <p className="text-xs text-gray-600">Entregues</p>
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
              placeholder="Buscar por ID, cliente, banca ou produto..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { setStatusFilter(""); setPage(1); }}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                !statusFilter ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => { setStatusFilter("novo"); setPage(1); }}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                statusFilter === "novo" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Novos
            </button>
            <button
              onClick={() => { setStatusFilter("confirmado"); setPage(1); }}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                statusFilter === "confirmado" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Confirmados
            </button>
            <button
              onClick={() => { setStatusFilter("em_preparo"); setPage(1); }}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                statusFilter === "em_preparo" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Em Preparo
            </button>
            <button
              onClick={() => { setStatusFilter("entregue"); setPage(1); }}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                statusFilter === "entregue" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Entregues
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <IconPackage className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-600">
              {search || statusFilter
                ? "Tente ajustar os filtros"
                : "Quando houver pedidos com seus produtos, eles aparecerão aqui"}
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="p-4 border-b bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusConfig.bg} ${statusConfig.color}`}>
                      <StatusIcon size={14} />
                      {statusConfig.label}
                    </span>
                    <span className="text-sm text-gray-500">
                      #{order.id.slice(0, 8)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <IconEye size={16} />
                      {selectedOrder?.id === order.id ? 'Ocultar' : 'Detalhes'}
                    </button>
                    {order.banca_whatsapp && (
                      <button
                        onClick={() => openWhatsApp(order)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <IconBrandWhatsapp size={16} />
                        WhatsApp
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Banca Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{order.banca_name}</h3>
                      <p className="text-sm text-gray-600">{order.customer_name}</p>
                      {order.customer_phone && (
                        <p className="text-sm text-gray-500">{order.customer_phone}</p>
                      )}
                    </div>

                    {/* Products Summary */}
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>{order.total_itens_distribuidor}</strong> produto(s) seu(s) de{" "}
                        <strong>{order.total_itens_pedido}</strong> no pedido
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {order.items_distribuidor.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                          >
                            {item.quantity}x {item.product_name.slice(0, 20)}...
                          </span>
                        ))}
                        {order.items_distribuidor.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">
                            +{order.items_distribuidor.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Value */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(order.subtotal_distribuidor)}
                      </p>
                      <p className="text-xs text-gray-500">Seus produtos</p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedOrder?.id === order.id && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium text-gray-900 mb-3">Seus produtos neste pedido:</h4>
                      <div className="space-y-2">
                        {order.items_distribuidor.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                          >
                            {item.product_image ? (
                              <Image
                                src={item.product_image}
                                alt={item.product_name}
                                width={40}
                                height={40}
                                className="rounded object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                <IconBox size={20} className="text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.product_name}</p>
                              <p className="text-sm text-gray-500">
                                {item.quantity}x {formatPrice(item.unit_price)}
                              </p>
                            </div>
                            <p className="font-medium text-gray-900">
                              {formatPrice(item.total_price)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <strong>Observações:</strong> {order.notes}
                          </p>
                        </div>
                      )}

                      {order.customer_address && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Endereço:</strong> {order.customer_address}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-600">
            Mostrando {orders.length} de {pagination.total} pedidos
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconChevronLeft size={18} />
            </button>
            <span className="text-sm text-gray-700">
              Página {page} de {pagination.pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page >= pagination.pages}
              className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProdutos: 0,
    totalPedidosHoje: 0,
    totalPedidos: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = localStorage.getItem("gb:admin");
        setAdmin(raw ? JSON.parse(raw) : null);

        const [ordersRes, productsRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/products'),
        ]);
        const ordersJson = await ordersRes.json();
        const productsJson = await productsRes.json();
        const orders = Array.isArray(ordersJson?.items) ? ordersJson.items : [];
        const products = Array.isArray(productsJson?.items) ? productsJson.items : [];

        const today = new Date().toDateString();
        const pedidosHoje = orders.filter((o: any) => (o.createdAt || '').toString().toLowerCase().includes('hoje') || (o.createdAt || '').toString().toLowerCase().includes('agora') || new Date().toDateString() === today).length;

        setStats({
          totalProdutos: products.length,
          totalPedidosHoje: pedidosHoje,
          totalPedidos: orders.length,
        });
        setRecentOrders(orders.slice(0, 5));
        setLowStock(products.filter((p: any)=> (p.track_stock && typeof p.stock_qty === 'number' && p.stock_qty <= 5)).slice(0, 5));
      } catch {
        // noop
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600">Bem-vindo ao painel de controle do Guia das Bancas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg grid place-items-center text-blue-600 text-lg">📦</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Produtos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProdutos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-100 rounded-lg grid place-items-center text-orange-600 text-lg">📋</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pedidos Hoje</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPedidosHoje}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg grid place-items-center text-green-600 text-lg">✅</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pedidos Totais</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPedidos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-lg grid place-items-center text-purple-600 text-lg">📈</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Conversão (mock)</p>
              <p className="text-2xl font-bold text-gray-900">2.8%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <Link
              href="/admin/cms/home"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">🏠</span>
              <div>
                <div className="font-medium text-gray-900">Gerenciar Home Page</div>
                <div className="text-sm text-gray-600">Configure o slider principal e seções</div>
              </div>
            </Link>
            
            <Link href="/admin/bancas" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <span className="text-2xl mr-3">🏪</span>
              <div>
                <div className="font-medium text-gray-900">Gerenciar Bancas</div>
                <div className="text-sm text-gray-600">Listar e editar bancas</div>
              </div>
            </Link>

            <div className="flex items-center p-3 rounded-lg border border-gray-200 bg-gray-50 opacity-60">
              <span className="text-2xl mr-3">👤</span>
              <div>
                <div className="font-medium text-gray-900">Gerenciar Usuários</div>
                <div className="text-sm text-gray-600">Em desenvolvimento</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Avisos de estoque baixo</h3>
          {loading ? (
            <div className="text-sm text-gray-500">Carregando...</div>
          ) : lowStock.length === 0 ? (
            <div className="text-sm text-gray-500">Nenhum produto com estoque baixo.</div>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p)=> (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <div className="truncate mr-2">{p.name}</div>
                  <StatusBadge label={`Estoque: ${p.stock_qty}`} tone={p.stock_qty<=2? 'red':'amber'} />
                </div>
              ))}
              <div className="text-right">
                <Link href="/admin/products" className="text-[#ff5c00] text-sm font-medium">Ver produtos</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Informações do Admin & Pedidos Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Admin</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#ff5c00] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="ml-4">
                <div className="font-medium text-gray-900">{admin?.name || 'Administrador'}</div>
                <div className="text-sm text-gray-600">{admin?.email || 'admin@guiadasbancas.com'}</div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <div className="flex justify-between py-1">
                  <span>Último acesso:</span>
                  <span>Agora</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Permissões:</span>
                  <span className="text-green-600 font-medium">Admin Total</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pedidos Recentes</h3>
          {loading ? (
            <div className="text-sm text-gray-500">Carregando...</div>
          ) : recentOrders.length === 0 ? (
            <div className="text-sm text-gray-500">Sem pedidos recentes.</div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o)=> (
                <div key={o.id} className="flex items-center text-sm">
                  <div className="font-medium mr-3">#{o.id}</div>
                  <div className="truncate mr-2">{o.customer}</div>
                  <div className="ml-auto text-gray-500">R$ {Number(o.total||0).toFixed(2)}</div>
                </div>
              ))}
              <div className="text-right">
                <Link href="/admin/orders" className="text-[#ff5c00] text-sm font-medium">Ver todos</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
        <div className="space-y-3">
        </div>
      </div>
    </div>
  );
}

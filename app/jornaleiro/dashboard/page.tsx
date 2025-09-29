"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import OrdersMetrics from "@/components/admin/OrdersMetrics";

export default function JornaleiroDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [metrics, setMetrics] = useState({
    pedidosHoje: 0,
    faturamentoHoje: 0,
    pedidosPendentes: 0,
    produtosAtivos: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    try {
      const auth = localStorage.getItem("gb:sellerAuth");
      if (auth !== "1") { router.replace("/jornaleiro" as any); return; }
      const raw = localStorage.getItem("gb:seller");
      setData(raw ? JSON.parse(raw) : null);
    } catch {}
  }, [router]);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoadingMetrics(true);
        const [ordersRes, productsRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/products"),
        ]);
        const ordersJson = await ordersRes.json();
        const productsJson = await productsRes.json();
        const orders = Array.isArray(ordersJson?.items) ? ordersJson.items : [];
        const products = Array.isArray(productsJson?.items) ? productsJson.items : [];

        const faturamentoHoje = orders.reduce((acc: number, o: any) => acc + Number(o.total || 0), 0);
        const pedidosPendentes = orders.filter((o: any) => ["novo","confirmado","em_preparo"].includes(o.status)).length;
        const produtosAtivos = products.filter((p: any) => p.active).length;

        setMetrics({
          pedidosHoje: orders.length,
          faturamentoHoje,
          pedidosPendentes,
          produtosAtivos,
        });
        setRecentOrders(orders.slice(0, 5));
      } catch {
        // manter métricas em zero em caso de erro
      } finally {
        setLoadingMetrics(false);
      }
    };
    loadMetrics();
  }, []);

  const logout = () => {
    try { localStorage.removeItem("gb:sellerAuth"); } catch {}
    router.replace("/jornaleiro" as any);
  };

  const seller = data?.seller || data;
  const bank = data?.banks?.[0];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Pedidos hoje</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">
            {loadingMetrics ? "--" : metrics.pedidosHoje}
          </div>
          <div className="mt-1 text-xs text-gray-400">Total de pedidos recebidos nas últimas horas</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Faturamento hoje</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">
            {loadingMetrics ? "--" : `R$ ${metrics.faturamentoHoje.toFixed(2)}`}
          </div>
          <div className="mt-1 text-xs text-gray-400">Somatório dos pedidos do dia</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Pedidos pendentes</div>
          <div className={`mt-1 text-3xl font-semibold ${metrics.pedidosPendentes > 0 ? "text-orange-600" : "text-gray-900"}`}>
            {loadingMetrics ? "--" : metrics.pedidosPendentes}
          </div>
          <div className="mt-1 text-xs text-gray-400">Novos, confirmados e em preparo</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Produtos ativos</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">
            {loadingMetrics ? "--" : metrics.produtosAtivos}
          </div>
          <div className="mt-1 text-xs text-gray-400">Itens visíveis na vitrine</div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Dashboard do Jornaleiro</h1>
            <p className="mt-1 text-sm text-gray-600">Visão geral da sua banca e pedidos.</p>
          </div>
          <button onClick={logout} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">Sair</button>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-semibold">Seus dados</div>
            <div className="mt-1 text-sm">
              <div><span className="text-gray-500">Nome:</span> {seller?.name || '-'}</div>
              <div><span className="text-gray-500">Email:</span> {seller?.email || '-'}</div>
              <div><span className="text-gray-500">WhatsApp:</span> {seller?.phone || '-'}</div>
              <div><span className="text-gray-500">CPF:</span> {seller?.cpf || '-'}</div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-semibold">Sua banca</div>
            {!bank ? (
              <div className="mt-2 text-sm">Nenhuma banca cadastrada.</div>
            ) : (
              <div className="mt-2 text-sm">
                <div><span className="text-gray-500">Nome:</span> {bank?.name}</div>
                <div><span className="text-gray-500">WhatsApp:</span> {bank?.whatsapp || '-'}</div>
                <div><span className="text-gray-500">Endereço:</span> {bank?.address?.street}, {bank?.address?.number} - {bank?.address?.neighborhood}, {bank?.address?.city}/{bank?.address?.uf} - CEP {bank?.address?.cep}</div>
              </div>
            )}
            <div className="mt-3">
              <button className="rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-3 py-2 text-xs font-semibold text-white hover:opacity-95">Cadastrar nova banca</button>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-semibold">Atalhos</div>
            <div className="mt-2 flex flex-col gap-2 text-sm">
              <Link href={"/" as any} className="underline text-[#ff5c00]">Ver vitrine</Link>
              <Link href={"/jornaleiro/registrar" as any} className="underline text-[#ff5c00]">Editar cadastro</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Detalhadas */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Métricas de Vendas</h2>
            <p className="text-sm text-gray-600">Acompanhe o desempenho detalhado dos seus pedidos.</p>
          </div>
          <Link href={"/jornaleiro/pedidos" as Route} className="text-[#ff5c00] text-sm font-medium">Gerenciar pedidos</Link>
        </div>
        <OrdersMetrics />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Pedidos recentes</h2>
            <p className="text-sm text-gray-600">Acompanhe os últimos pedidos recebidos.</p>
          </div>
          <Link href={"/jornaleiro/pedidos" as Route} className="text-[#ff5c00] text-sm font-medium">Ver todos</Link>
        </div>
        {loadingMetrics ? (
          <div className="text-sm text-gray-500">Carregando pedidos...</div>
        ) : recentOrders.length === 0 ? (
          <div className="text-sm text-gray-500">Nenhum pedido encontrado.</div>
        ) : (
          <div className="space-y-3 text-sm">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center rounded-lg border border-gray-100 px-3 py-2">
                <div className="text-gray-900 font-medium mr-3">#{order.id}</div>
                <div className="truncate text-gray-600">{order.customer_name || order.customer}</div>
                <div className="ml-auto flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === 'novo' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'confirmado' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'em_preparo' ? 'bg-orange-100 text-orange-700' :
                    order.status === 'entregue' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-gray-500">R$ {Number(order.total || 0).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";

export default function AdminDemoPage() {
  const stats = [
    { label: "Vendas", value: "R$ 32.450", delta: "+12%" },
    { label: "Pedidos", value: "1.204", delta: "+5%" },
    { label: "Clientes", value: "8.142", delta: "+3%" },
    { label: "Conversão", value: "2,7%", delta: "+0,4pp" },
  ];

  const orders = [
    { id: "#98123", customer: "Ana Souza", total: "R$ 129,90", status: "Pago", date: "04/11/2025" },
    { id: "#98107", customer: "Carlos Lima", total: "R$ 49,90", status: "Pendente", date: "03/11/2025" },
    { id: "#98088", customer: "Marcos Paulo", total: "R$ 89,90", status: "Enviado", date: "03/11/2025" },
    { id: "#98077", customer: "Bianca Reis", total: "R$ 199,80", status: "Pago", date: "02/11/2025" },
  ];

  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-white p-4">
            <div className="text-sm text-gray-500">{s.label}</div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-2xl font-semibold">{s.value}</div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">{s.delta}</span>
            </div>
            <div className="mt-3 h-1 w-full rounded-full bg-orange-100">
              <div className="h-1 rounded-full bg-[#ff5c00]" style={{ width: "72%" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Chart + resumo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Receita (últimos 30 dias)</div>
              <div className="text-lg font-semibold">R$ 53.420</div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5-5 5 5"/></svg>
                +8%
              </span>
            </div>
          </div>
          <div className="mt-4">
            {/* Simple SVG line chart mock */}
            <div className="h-48 w-full">
              <svg viewBox="0 0 100 40" className="w-full h-full">
                <defs>
                  <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ff5c00" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ff5c00" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="url(#area)"
                  stroke="#ff5c00"
                  strokeWidth="1"
                  points="0,30 10,28 20,26 30,27 40,18 50,15 60,17 70,12 80,14 90,10 100,12 100,40 0,40"
                />
                <polyline
                  fill="none"
                  stroke="#ff5c00"
                  strokeWidth="1.5"
                  points="0,30 10,28 20,26 30,27 40,18 50,15 60,17 70,12 80,14 90,10 100,12"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Resumo</div>
          <div className="mt-3 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Ticket médio</span>
              <span className="font-medium">R$ 44,40</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Produtos</span>
              <span className="font-medium">326 ativos</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Taxa de reembolso</span>
              <span className="font-medium">0,6%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Últimos pedidos */}
      <div className="rounded-xl border bg-white">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Últimos pedidos</div>
            <div className="text-lg font-semibold">Hoje</div>
          </div>
          <button className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50">Ver todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-600">ID</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Cliente</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Valor</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Data</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={o.id} className={i % 2 === 1 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="px-4 py-2 font-medium">{o.id}</td>
                  <td className="px-4 py-2">{o.customer}</td>
                  <td className="px-4 py-2">{o.total}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${o.status === 'Pago' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : o.status === 'Pendente' ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-blue-700 bg-blue-50 border-blue-200'}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-2 text-gray-600">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

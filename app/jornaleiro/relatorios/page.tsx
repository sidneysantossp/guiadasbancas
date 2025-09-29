"use client";

import SalesReports from "@/components/admin/SalesReports";

export default function RelatoriosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Relatórios</h1>
        <p className="text-sm text-gray-600">
          Acompanhe o desempenho da sua banca com relatórios detalhados de vendas.
        </p>
      </div>

      <SalesReports />
    </div>
  );
}

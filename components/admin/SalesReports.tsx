"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/admin/ToastProvider";

type ReportType = "daily" | "weekly" | "monthly" | "custom";
type ReportFormat = "pdf" | "excel" | "csv";

type SalesData = {
  date: string;
  orders: number;
  revenue: number;
  avg_ticket: number;
  top_products: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
};

export default function SalesReports() {
  const [reportType, setReportType] = useState<ReportType>("daily");
  const [reportFormat, setReportFormat] = useState<ReportFormat>("pdf");
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const toast = useToast();

  useEffect(() => {
    loadSalesData();
  }, [reportType, dateRange]);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      
      // Simular dados de vendas
      const mockData: SalesData[] = [
        {
          date: "2024-01-15",
          orders: 12,
          revenue: 450.50,
          avg_ticket: 37.54,
          top_products: [
            { name: "Revista Veja", quantity: 8, revenue: 100.00 },
            { name: "Jornal Folha", quantity: 15, revenue: 52.50 },
            { name: "Revista Época", quantity: 5, revenue: 79.50 }
          ]
        },
        {
          date: "2024-01-14",
          orders: 8,
          revenue: 320.00,
          avg_ticket: 40.00,
          top_products: [
            { name: "Revista IstoÉ", quantity: 6, revenue: 83.40 },
            { name: "Jornal Estado", quantity: 12, revenue: 48.00 },
            { name: "Revista Veja", quantity: 4, revenue: 50.00 }
          ]
        },
        {
          date: "2024-01-13",
          orders: 15,
          revenue: 580.75,
          avg_ticket: 38.72,
          top_products: [
            { name: "Revista Veja", quantity: 10, revenue: 125.00 },
            { name: "Revista Época", quantity: 8, revenue: 127.20 },
            { name: "Jornal Folha", quantity: 20, revenue: 70.00 }
          ]
        }
      ];
      
      setSalesData(mockData);
    } catch (error) {
      console.error("Erro ao carregar dados de vendas:", error);
      toast.error("Erro ao carregar relatório");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      
      // Simular geração de relatório
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reportData = {
        type: reportType,
        format: reportFormat,
        dateRange,
        data: salesData,
        generated_at: new Date().toISOString(),
        total_orders: salesData.reduce((sum, day) => sum + day.orders, 0),
        total_revenue: salesData.reduce((sum, day) => sum + day.revenue, 0),
        avg_ticket: salesData.reduce((sum, day) => sum + day.avg_ticket, 0) / salesData.length
      };

      // Simular download do arquivo
      if (reportFormat === "csv") {
        downloadCSV(reportData);
      } else if (reportFormat === "excel") {
        downloadExcel(reportData);
      } else {
        downloadPDF(reportData);
      }
      
      toast.success(`Relatório ${reportFormat.toUpperCase()} gerado com sucesso!`);
    } catch (error) {
      toast.error("Erro ao gerar relatório");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = (data: any) => {
    const csvContent = [
      "Data,Pedidos,Receita,Ticket Médio",
      ...data.data.map((day: SalesData) => 
        `${day.date},${day.orders},${day.revenue.toFixed(2)},${day.avg_ticket.toFixed(2)}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio-vendas-${data.type}-${Date.now()}.csv`;
    link.click();
  };

  const downloadExcel = (data: any) => {
    // Simular download Excel
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio-vendas-${data.type}-${Date.now()}.xlsx`;
    link.click();
  };

  const downloadPDF = (data: any) => {
    // Simular download PDF
    const content = `
RELATÓRIO DE VENDAS - ${data.type.toUpperCase()}
Período: ${data.dateRange.start} até ${data.dateRange.end}
Gerado em: ${new Date(data.generated_at).toLocaleString('pt-BR')}

RESUMO:
- Total de Pedidos: ${data.total_orders}
- Receita Total: R$ ${data.total_revenue.toFixed(2)}
- Ticket Médio: R$ ${data.avg_ticket.toFixed(2)}

DETALHAMENTO POR DIA:
${data.data.map((day: SalesData) => `
${day.date}: ${day.orders} pedidos - R$ ${day.revenue.toFixed(2)} (Ticket: R$ ${day.avg_ticket.toFixed(2)})
`).join('')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio-vendas-${data.type}-${Date.now()}.pdf`;
    link.click();
  };

  const updateDateRange = (type: ReportType) => {
    const today = new Date();
    let start = new Date();
    
    switch (type) {
      case "daily":
        start = new Date(today);
        break;
      case "weekly":
        start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "monthly":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      default:
        return;
    }
    
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    });
  };

  const handleReportTypeChange = (type: ReportType) => {
    setReportType(type);
    if (type !== "custom") {
      updateDateRange(type);
    }
  };

  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Relatórios de Vendas</h2>
        <p className="text-sm text-gray-600">
          Gere relatórios detalhados das suas vendas e exporte em diferentes formatos.
        </p>
      </div>

      {/* Configurações do Relatório */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <h3 className="font-medium mb-4">Configurações do Relatório</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Período</label>
            <select
              value={reportType}
              onChange={(e) => handleReportTypeChange(e.target.value as ReportType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="daily">Hoje</option>
              <option value="weekly">Últimos 7 dias</option>
              <option value="monthly">Este mês</option>
              <option value="custom">Período personalizado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Formato</label>
            <select
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value as ReportFormat)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel (.xlsx)</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Gerando..." : "Gerar Relatório"}
            </button>
          </div>
        </div>

        {reportType === "custom" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Data Inicial</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data Final</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-600 font-medium">Total de Pedidos</div>
          <div className="text-2xl font-bold text-blue-700">{totalOrders}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-600 font-medium">Receita Total</div>
          <div className="text-2xl font-bold text-green-700">R$ {totalRevenue.toFixed(2)}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm text-purple-600 font-medium">Ticket Médio</div>
          <div className="text-2xl font-bold text-purple-700">R$ {avgTicket.toFixed(2)}</div>
        </div>
      </div>

      {/* Dados Detalhados */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando dados...</p>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50">
            <h3 className="font-medium">Vendas por Dia</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pedidos</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receita</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket Médio</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto Mais Vendido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {salesData.map((day, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      {new Date(day.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{day.orders}</td>
                    <td className="px-4 py-3 text-sm">R$ {day.revenue.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">R$ {day.avg_ticket.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">
                      {day.top_products[0]?.name} ({day.top_products[0]?.quantity}x)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Produtos Mais Vendidos */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-medium mb-4">Produtos Mais Vendidos (Período)</h3>
        <div className="space-y-3">
          {salesData.flatMap(day => day.top_products)
            .reduce((acc: any[], product) => {
              const existing = acc.find(p => p.name === product.name);
              if (existing) {
                existing.quantity += product.quantity;
                existing.revenue += product.revenue;
              } else {
                acc.push({ ...product });
              }
              return acc;
            }, [])
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5)
            .map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-600">{product.quantity} unidades vendidas</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">R$ {product.revenue.toFixed(2)}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

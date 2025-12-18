"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FiltersBar from "@/components/admin/FiltersBar";
import DataTable, { type Column } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/ToastProvider";

const STATUS_FLOW = ["novo","confirmado","em_preparo","saiu_para_entrega","parcialmente_retirado","entregue"] as const;

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
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: string;
  payment_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  estimated_delivery?: string;
};

const STATUS_OPTIONS = [
  { value: 'novo', label: 'Pedido Recebido' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'em_preparo', label: 'Em preparo' },
  { value: 'saiu_para_entrega', label: 'Saiu para entrega' },
  { value: 'parcialmente_retirado', label: 'Parcialmente retirado' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'cancelado', label: 'Cancelado' },
];

export default function JornaleiroPedidosPage() {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [q, setQ] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const toast = useToast();

  // Referência para controlar detecção de novos pedidos
  const prevTotalRef = useRef<number | null>(null);

  // Função para tocar beep quando chegar novo pedido
  const playBeep = () => {
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 800; // Frequência do beep
      oscillator.type = 'sine';
      
      const now = ctx.currentTime;
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      
      oscillator.start(now);
      oscillator.stop(now + 0.5);
    } catch (error) {
      console.warn('Não foi possível reproduzir som de notificação:', error);
    }
  };

  const fetchRows = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedStatuses.length > 0) params.set("status", selectedStatuses.join(','));
      if (q) params.set("q", q);
      if (paymentMethod) params.set("payment_method", paymentMethod);
      params.set("page", page.toString());
      params.set("limit", "20"); // Aumentado para reduzir paginação
      params.set("sort", "created_at");
      params.set("order", "desc");
      
      const res = await fetch(`/api/orders?${params.toString()}`, {
        next: { revalidate: 15 } // Cache de 15 segundos
      });
      const json = await res.json();
      setRows(Array.isArray(json?.items) ? json.items : []);
      setPagination({
        page: json.page || 1,
        total: json.total || 0,
        pages: json.pages || 0
      });
      
      // Salvar total atual para detecção de novos pedidos
      if (prevTotalRef.current === null) {
        prevTotalRef.current = json.total || 0;
      }
    } catch (e: any) {
      toast.error(e?.message || "Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatuses, q, paymentMethod]);

  // Polling para detectar novos pedidos
  useEffect(() => {
    const checkForNewOrders = async () => {
      try {
        const res = await fetch('/api/orders?limit=1&sort=created_at&order=desc', {
          cache: 'no-store'
        });
        const json = await res.json();
        const currentTotal = json.total || 0;
        
        // Se detectar aumento no total de pedidos, tocar beep e atualizar lista
        if (prevTotalRef.current !== null && currentTotal > prevTotalRef.current) {
          playBeep();
          toast.success(`Novo pedido recebido! Total: ${currentTotal}`);
          fetchRows(1); // Recarregar lista
        }
        
        prevTotalRef.current = currentTotal;
      } catch (error) {
        console.warn('Erro ao verificar novos pedidos:', error);
      }
    };
    
    // Verificar a cada 10 segundos
    const interval = setInterval(checkForNewOrders, 10000);
    
    return () => clearInterval(interval);
  }, [toast]);

  const filtered = useMemo(() => rows, [rows]);

  const advanceStatus = async (id: string) => {
    try {
      const order = rows.find((o) => o.id === id);
      if (!order) return;
      const idx = STATUS_FLOW.indexOf(order.status as typeof STATUS_FLOW[number]);
      const next = idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : order.status;
      if (next === order.status) {
        toast.info("Pedido já está no último status");
        return;
      }
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
      if (!res.ok) {
        toast.error("Falha ao atualizar status");
        return;
      }
      toast.success("Status do pedido atualizado");
      fetchRows(pagination.page);
    } catch (e: any) {
      toast.error(e?.message || "Erro ao atualizar status");
    }
  };

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

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      'pix': 'PIX',
      'cartao': 'Cartão',
      'dinheiro': 'Dinheiro',
      'credito': 'Crédito',
      'debito': 'Débito'
    };
    return labels[method] || method;
  };

  const statusTone = (s: string): "amber" | "blue" | "orange" | "emerald" | "red" | "gray" => {
    switch (s) {
      case "novo":
        return "amber";
      case "confirmado":
        return "blue";
      case "em_preparo":
        return "orange";
      case "saiu_para_entrega":
        return "blue";
      case "entregue":
        return "emerald";
      case "cancelado":
        return "red";
      default:
        return "gray";
    }
  };

  const statusLabel = (s: string) => {
    if (!s) return s;
    if (s === 'novo') return 'Pedido Recebido';
    return s.replace(/_/g, ' ');
  };

  // NOTA: Coluna de ID foi removida - não aparece mais na tabela
  const columns: Column<Order>[] = [
    { 
      key: "customer_name", 
      header: "Cliente", 
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-medium">{row.customer_name}</div>
          <div className="hidden sm:block text-xs text-gray-500">{row.customer_phone}</div>
          {/* Data visível no mobile abaixo do nome */}
          <div className="sm:hidden text-xs text-gray-500">{formatDate(row.created_at)}</div>
        </div>
      )
    },
    {
      key: "items",
      header: "Produtos",
      hiddenOnMobile: true,
      render: (row) => (
        <div className="space-y-1">
          {row.items.slice(0, 2).map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {item.product_image ? (
                <Image
                  src={item.product_image}
                  alt={item.product_name}
                  width={20}
                  height={20}
                  className="rounded object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">
                  {item.quantity}x {item.product_name}
                </div>
              </div>
            </div>
          ))}
          {row.items.length > 2 && (
            <div className="text-xs text-gray-500 font-medium">
              +{row.items.length - 2} produto{row.items.length - 2 > 1 ? 's' : ''}
            </div>
          )}
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      hiddenOnMobile: true,
      render: (row) => <StatusBadge label={statusLabel(row.status)} tone={statusTone(row.status)} />,
    },
    {
      key: "payment_method",
      header: "Pagamento",
      hiddenOnMobile: true,
      render: (row) => (
        <span className="text-sm">{getPaymentMethodLabel(row.payment_method)}</span>
      )
    },
    {
      key: "total",
      header: "Total",
      sortable: true,
      sortAccessor: (row) => row.total,
      render: (row) => (
        <div className="text-right">
          <div className="font-semibold">R$ {Number(row.total || 0).toFixed(2)}</div>
          {row.shipping_fee > 0 && (
            <div className="hidden sm:block text-xs text-gray-500">+ R$ {row.shipping_fee.toFixed(2)} frete</div>
          )}
        </div>
      ),
    },
    {
      key: "created_at",
      header: "Criado",
      hiddenOnMobile: true,
      sortable: true,
      render: (row) => (
        <div className="text-sm">
          <div>{formatDate(row.created_at)}</div>
          {row.estimated_delivery && (
            <div className="hidden sm:block text-xs text-gray-500">
              Entrega: {formatDate(row.estimated_delivery)}
            </div>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Pedidos</h1>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Gerencie os pedidos recebidos pela sua banca.</p>
          <div className="text-sm text-gray-500">
            Total: {pagination.total} pedidos
          </div>
        </div>
      </div>

      <FiltersBar
        onReset={() => {
          setQ("");
          setSelectedStatuses([]);
          setPaymentMethod("");
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por #id, cliente ou telefone"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
<div className="relative">
          <button
            type="button"
            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-left bg-white flex items-center justify-between"
          >
            <span className={selectedStatuses.length === 0 ? 'text-gray-500' : ''}>
              {selectedStatuses.length === 0 
                ? 'Todos status' 
                : selectedStatuses.length === 1
                  ? STATUS_OPTIONS.find(o => o.value === selectedStatuses[0])?.label
                  : `${selectedStatuses.length} selecionados`}
            </span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {statusDropdownOpen && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              <div className="p-2 border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setSelectedStatuses([])}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Limpar seleção
                </button>
              </div>
              {STATUS_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(option.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStatuses([...selectedStatuses, option.value]);
                      } else {
                        setSelectedStatuses(selectedStatuses.filter(s => s !== option.value));
                      }
                    }}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
              <div className="p-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setStatusDropdownOpen(false)}
                  className="w-full px-3 py-1.5 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                >
                  Aplicar
                </button>
              </div>
            </div>
          )}
        </div>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Todos pagamentos</option>
          <option value="pix">PIX</option>
          <option value="cartao">Cartão</option>
          <option value="dinheiro">Dinheiro</option>
          <option value="credito">Crédito</option>
          <option value="debito">Débito</option>
        </select>
      </FiltersBar>

      {loading && <div className="p-4 text-sm text-gray-500">Carregando...</div>}

      <DataTable
        columns={columns}
        data={filtered}
        getId={(row) => row.id}
        renderActions={(row) => (
          <div className="flex items-center gap-1">
            <Link
              href={`/jornaleiro/pedidos/${row.id}`}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
              title="Ver detalhes"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Link>
            <button
              onClick={() => advanceStatus(row.id)}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              disabled={row.status === 'entregue' || row.status === 'cancelado'}
              title="Avançar status"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button
              onClick={() => {
                if (!row.customer_phone) {
                  alert('Este pedido não tem telefone cadastrado.');
                  return;
                }
                const message = `Olá ${row.customer_name}! Sobre seu pedido #${row.id}`;
                const phone = (row.customer_phone || '').replace(/\D/g, '').replace(/^55/, '');
                const url = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
                window.open(url, '_blank');
              }}
              className={`p-2 rounded-md transition-colors ${row.customer_phone ? 'text-green-600 hover:text-green-800 hover:bg-green-50' : 'text-gray-400 cursor-not-allowed'}`}
              title={row.customer_phone ? "Enviar WhatsApp" : "Sem telefone cadastrado"}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
              </svg>
            </button>
            {(row.status === 'confirmado' || row.status === 'entregue') && (
              <button
                onClick={() => {
                  // Abrir página dedicada do comprovante
                  const receiptUrl = `/jornaleiro/pedidos/${row.id}/comprovante`;
                  window.open(receiptUrl, '_blank');
                }}
                className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-md transition-colors"
                title="Gerar comprovante"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            )}
          </div>
        )}
      />
      
      {/* Paginação */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Mostrando {rows.length} de {pagination.total} pedidos
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchRows(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-sm">
              Página {pagination.page} de {pagination.pages}
            </span>
            <button
              onClick={() => fetchRows(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

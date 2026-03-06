"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import StatusBadge from "@/components/admin/StatusBadge";
import OrderHistory from "@/components/admin/OrderHistory";
import OrderReceipt from "@/components/admin/OrderReceipt";
import { useToast } from "@/components/admin/ToastProvider";
import { logStatusChange, logNote, logDeliveryUpdate } from "@/lib/orderHistory";

const STATUS_FLOW = ["novo","confirmado","em_preparo","saiu_para_entrega","parcialmente_retirado","entregue"] as const;

// Função para formatar data ISO para formato local (corrige fuso horário)
const formatDeliveryDate = (isoDate: string): string => {
  if (!isoDate || isoDate.trim() === "") return "";
  
  const date = new Date(isoDate);
  
  // Verificar se a data é válida
  if (isNaN(date.getTime())) return "";
  
  // Formato: DD/MM/YYYY, HH:mm:ss
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// Função para gerar mensagem do WhatsApp com formatação correta
const buildWhatsAppMessage = (order: Order) => {
  const phone = (order.customer_phone || '').replace(/\D/g, '').replace(/^55/, '');
  if (!phone) return '#';
  
  const lines = [
    `Olá, ${order.customer_name}!`,
    `Aqui é a ${order.banca_name}.`,
    ``,
    `Sobre o seu pedido #${order.order_number || order.id}:`,
    `Ele já está pronto para retirada!`,
    ``,
    `Que horário você consegue passar aqui?`
  ];
  
  const message = lines.join('%0A');
  return `https://wa.me/55${phone}?text=${message}`;
};

type ItemStatus = 'entregue' | 'a_entregar' | 'em_falta' | 'sob_encomenda';

const ITEM_STATUS_OPTIONS = [
  { value: 'a_entregar', label: 'A Entregar' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'em_falta', label: 'Em Falta' },
  { value: 'sob_encomenda', label: 'Sob Encomenda' },
];

type OrderItem = {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  item_status?: ItemStatus;
};

type Order = {
  id: string;
  order_number?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  banca_id: string;
  banca_name: string;
  banca_whatsapp?: string;
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
  discount?: number;
  coupon_code?: string;
  coupon_discount?: number;
  tax?: number;
  addons_total?: number;
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [historyKey, setHistoryKey] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [itemStatuses, setItemStatuses] = useState<Record<string, ItemStatus>>({});
  const toast = useToast();

  const fetchOrder = async () => {
    try {
      setLoading(true);
      console.log('Buscando pedido:', params.id);
      const res = await fetch(`/api/orders/${params.id}`);
      console.log('Response status:', res.status);
      const json = await res.json();
      console.log('Response data:', json);
      
      if (!json.ok) {
        toast.error(json.error || "Erro ao carregar pedido");
        setLoading(false);
        return;
      }
      
      setOrder(json.data);
      setNotes(json.data.notes || "");
      setEstimatedDelivery(json.data.estimated_delivery || "");
      console.log('[OrderDetails] banca_whatsapp:', json.data.banca_whatsapp || '(não informado)');
      
      // Inicializar status dos itens
      const initialStatuses: Record<string, ItemStatus> = {};
      json.data.items?.forEach((item: OrderItem) => {
        initialStatuses[item.id] = item.item_status || 'a_entregar';
      });
      setItemStatuses(initialStatuses);
    } catch (e: any) {
      console.error('Erro na API:', e);
      toast.error(e?.message || "Erro ao carregar pedido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const updateStatus = async (newStatus: string) => {
    if (!order) return;
    
    const oldStatus = order.status;
    const oldNotes = order.notes || "";
    const oldDelivery = order.estimated_delivery || "";
    
    try {
      setUpdating(true);
      // Preparar itens com status atualizado
      const itemsWithStatus = order.items.map(item => ({
        ...item,
        item_status: itemStatuses[item.id] || 'a_entregar'
      }));
      
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: order.id, 
          status: newStatus,
          notes,
          estimated_delivery: estimatedDelivery || undefined,
          items: itemsWithStatus
        }),
      });
      
      if (!res.ok) {
        toast.error("Falha ao atualizar pedido");
        return;
      }
      
      toast.success("Pedido atualizado com sucesso");
      
      // Comparar datas formatadas para detectar mudança real
      const oldFormatted = formatDeliveryDate(oldDelivery);
      const newFormatted = formatDeliveryDate(estimatedDelivery);
      
      // Executar operações em paralelo (não bloquear a UI)
      const backgroundTasks: Promise<any>[] = [];
      
      // Registrar mudanças no histórico
      if (oldStatus !== newStatus) {
        backgroundTasks.push(
          logStatusChange(order.id, oldStatus, newStatus, order.banca_name, 'vendor', getStatusChangeMessage(oldStatus, newStatus))
        );
        
        // Enviar WhatsApp para cliente (em background)
        if (order.customer_phone) {
          backgroundTasks.push(
            fetch('/api/whatsapp/status-update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: order.id,
                orderNumber: order.order_number,
                customerPhone: order.customer_phone,
                newStatus,
                estimatedDelivery: estimatedDelivery || order.estimated_delivery,
                itemsWithStatus: itemsWithStatus.map(item => ({
                  name: item.product_name,
                  quantity: item.quantity,
                  status: item.item_status
                })),
                bancaWhatsapp: order.banca_whatsapp
              })
            }).then(r => r.json()).then(result => {
              if (result.success) toast.success(`📱 Cliente notificado`);
            }).catch(() => {})
          );
        }
        
        // Enviar WhatsApp para jornaleiro (em background)
        backgroundTasks.push(
          fetch('/api/whatsapp/jornaleiro-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: order.id, bancaId: order.banca_id, action: 'status_change',
              oldStatus, newStatus, customerName: order.customer_name
            })
          }).catch(() => {})
        );
      }
      
      if (oldNotes !== notes && notes) {
        backgroundTasks.push(logNote(order.id, notes, order.banca_name, 'vendor'));
      }
      
      if (newFormatted && oldFormatted !== newFormatted) {
        backgroundTasks.push(
          logDeliveryUpdate(order.id, oldFormatted || "Não definida", newFormatted, order.banca_name, 'vendor', 'Previsão de entrega atualizada')
        );
      }
      
      // Executar todas as tarefas em paralelo
      Promise.all(backgroundTasks).then(() => {
        // Atualizar histórico após tarefas completarem
        setTimeout(() => setHistoryKey(prev => prev + 1), 500);
      });
      
      // Recarregar pedido imediatamente (não esperar tarefas de background)
      fetchOrder();
    } catch (e: any) {
      toast.error(e?.message || "Erro ao atualizar pedido");
    } finally {
      setUpdating(false);
    }
  };

  const deleteOrder = async () => {
    if (!order) return;
    
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o pedido #${order.order_number || order.id.substring(0, 8)}?\n\nEsta ação não pode ser desfeita.`
    );
    
    if (!confirmed) return;
    
    try {
      setUpdating(true);
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "DELETE",
      });
      
      const json = await res.json();
      
      if (!json.ok) {
        toast.error(json.error || "Falha ao excluir pedido");
        return;
      }
      
      toast.success("Pedido excluído com sucesso");
      
      // Redirecionar para lista de pedidos após 1 segundo
      setTimeout(() => {
        router.push('/jornaleiro/pedidos');
      }, 1000);
    } catch (e: any) {
      toast.error(e?.message || "Erro ao excluir pedido");
    } finally {
      setUpdating(false);
    }
  };
  
  const getStatusChangeMessage = (oldStatus: string, newStatus: string): string => {
    const messages: Record<string, string> = {
      'novo->confirmado': 'Pedido confirmado pelo jornaleiro',
      'confirmado->em_preparo': 'Iniciado preparo dos produtos',
      'em_preparo->saiu_para_entrega': 'Pedido saiu para entrega',
      'saiu_para_entrega->entregue': 'Pedido entregue ao cliente'
    };
    return messages[`${oldStatus}->${newStatus}`] || `Status alterado de "${oldStatus}" para "${newStatus}"`;
  };

  const advanceStatus = () => {
    if (!order) return;
    const idx = STATUS_FLOW.indexOf(order.status as typeof STATUS_FLOW[number]);
    const next = idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : order.status;
    if (next === order.status) {
      toast.info("Pedido já está no último status");
      return;
    }
    updateStatus(next);
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
      case "novo": return "amber";
      case "confirmado": return "blue";
      case "em_preparo": return "orange";
      case "saiu_para_entrega": return "blue";
      case "entregue": return "emerald";
      case "cancelado": return "red";
      default: return "gray";
    }
  };

  const statusLabel = (s: string) => {
    if (!s) return s;
    if (s === 'novo') return 'Pedido Recebido';
    return s.replace(/_/g, ' ');
  };

  const openWhatsApp = () => {
    if (!order) return;
    if (!order.customer_phone) {
      alert('Este pedido não tem telefone cadastrado. Peça ao cliente para informar o telefone.');
      return;
    }
    const message = `Olá ${order.customer_name}! Seu pedido #${order.order_number || order.id.substring(0, 8)} foi atualizado para: ${order.status}`;
    // Garantir que o número tenha o código do país 55
    const phone = (order.customer_phone || '').replace(/\D/g, '').replace(/^55/, '');
    const url = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <h1 className="text-xl font-semibold text-gray-900">Pedido não encontrado</h1>
          <p className="text-gray-600 mt-2">O pedido solicitado não existe ou foi removido.</p>
          <Link 
            href="/jornaleiro/pedidos"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Voltar aos pedidos
          </Link>
        </div>
      </div>
    );
  }

  const orderDisplayNumber = order.order_number || order.id.substring(0, 8);
  const canPrintReceipt = order.status === 'entregue';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
              <Link 
                href="/jornaleiro/pedidos"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
              >
                ← Voltar
              </Link>
              {/* Desktop: mostra título com número do pedido */}
              <h1 className="hidden break-words text-xl font-semibold sm:block">Pedido #{orderDisplayNumber}</h1>
              {/* Mobile: mostra título sem ID */}
              <h1 className="text-xl font-semibold sm:hidden">Pedido</h1>
            </div>
            <div className="sm:hidden">
              <StatusBadge label={statusLabel(order.status)} tone={statusTone(order.status)} />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Criado em {formatDate(order.created_at)}
          </p>
          {/* Mobile: número do pedido abaixo da data */}
          <p className="break-all text-sm text-gray-500 sm:hidden">#{orderDisplayNumber}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:w-auto xl:flex-col xl:items-end">
          {/* Desktop: badge ao lado direito (ações) */}
          <div className="hidden sm:block">
            <StatusBadge label={statusLabel(order.status)} tone={statusTone(order.status)} />
          </div>
          <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-end">
            <button
              onClick={openWhatsApp}
              className="flex h-11 items-center justify-center rounded-md bg-green-600 text-white transition-colors hover:bg-green-700"
              title="Enviar WhatsApp"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
              </svg>
            </button>
            <button
              className={`flex h-11 items-center justify-center rounded-md transition-colors ${
                canPrintReceipt
                  ? 'bg-orange-600 text-white hover:bg-orange-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title={order.status === 'entregue' ? "Imprimir comprovante" : "Disponível apenas para pedidos concluídos"}
              onClick={() => {
                if (canPrintReceipt) {
                  const receiptUrl = `/jornaleiro/pedidos/${order.id}/comprovante`;
                  window.open(receiptUrl, '_blank');
                }
              }}
              disabled={!canPrintReceipt}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>
            <button
              className="flex h-11 items-center justify-center rounded-md bg-red-600 text-white transition-colors hover:bg-red-700"
              title="Excluir pedido"
              onClick={deleteOrder}
              disabled={updating}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-6">
        {/* Informações do Cliente */}
        <div className="space-y-4 sm:space-y-6">
          <div className="rounded-lg border bg-white p-4 sm:p-5">
            <h2 className="font-semibold mb-3">Informações do Cliente</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="min-w-0">
                <span className="text-sm text-gray-600">Nome:</span>
                <div className="font-medium break-words">{order.customer_name}</div>
              </div>
              <div className="min-w-0">
                <span className="text-sm text-gray-600">Telefone:</span>
                <div className="font-medium break-words">{order.customer_phone}</div>
              </div>
              {order.customer_email && (
                <div className="min-w-0">
                  <span className="text-sm text-gray-600">Email:</span>
                  <div className="font-medium break-all">{order.customer_email}</div>
                </div>
              )}
              {order.customer_address && (
                <div className="min-w-0 sm:col-span-2">
                  <span className="text-sm text-gray-600">Endereço:</span>
                  <div className="font-medium break-words">{order.customer_address}</div>
                </div>
              )}
            </div>
          </div>

          {/* Produtos */}
          <div className="rounded-lg border bg-white p-4 sm:p-5">
            <h2 className="font-semibold mb-3">Produtos ({order.items.length})</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="rounded-lg border p-3 sm:p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      {item.product_image ? (
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          width={72}
                          height={72}
                          className="h-[72px] w-[72px] rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded bg-gray-200">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium break-words">{item.product_name}</div>
                        <div className="mt-1 text-sm text-gray-600">
                          Quantidade: {item.quantity} × R$ {item.unit_price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[190px] sm:items-end">
                      <select
                        value={itemStatuses[item.id] || 'a_entregar'}
                        onChange={(e) => setItemStatuses(prev => ({
                          ...prev,
                          [item.id]: e.target.value as ItemStatus
                        }))}
                        className="w-full rounded border bg-white px-3 py-2 text-sm sm:w-[190px]"
                      >
                        {ITEM_STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <div className="rounded-md bg-gray-50 px-3 py-2 text-left sm:text-right">
                        <div className="text-[11px] uppercase tracking-wide text-gray-500">Total do item</div>
                        <div className="font-semibold">R$ {item.total_price.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Histórico do Pedido */}
          <div className="rounded-lg border bg-white p-4 sm:p-5">
            <OrderHistory key={historyKey} orderId={order.id} />
          </div>

          {/* Comprovante do Pedido */}
          {showReceipt && (
            <div className="rounded-lg border bg-white p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-semibold">Comprovante do Pedido</h2>
                <button
                  onClick={() => setShowReceipt(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <OrderReceipt 
                order={order}
                bancaInfo={{
                  name: order.banca_name,
                  address: order.customer_address || "Rua Augusta, 1024 - Consolação\nCentro - 01305-100 - São Paulo/SP",
                  phone: "(11) 98765-4321",
                  cnpj: "11.111.111/0001-11"
                }}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Resumo do Pedido */}
          <div className="rounded-lg border bg-white p-4 sm:p-5">
            <h2 className="font-semibold mb-3">Resumo</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Preço dos Itens</span>
                <span className="font-medium">R$ {order.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Preço dos Adicionais</span>
                <span className="font-medium">R$ {(order.addons_total || 0).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Desconto</span>
                <span className="text-emerald-700">(-) R$ {(order.discount || 0).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Desconto do Cupom</span>
                <span className="text-emerald-700">(-) R$ {(order.coupon_discount || 0).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Taxa de Entrega</span>
                <span className="font-medium">R$ {order.shipping_fee.toFixed(2)}</span>
              </div>
              
              <div className="h-px bg-gray-200 my-2" />
              
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span className="font-extrabold">R$ {order.total.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Informações adicionais */}
            <div className="mt-4 pt-4 border-t space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">Pagamento:</div>
                <div className="font-medium">{getPaymentMethodLabel(order.payment_method)}</div>
              </div>
              
              {order.coupon_code && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Cupom de Desconto:</div>
                  <div className="font-medium text-emerald-600">{order.coupon_code}</div>
                </div>
              )}
            </div>
          </div>

          {/* Instruções de Pagamento - Só mostra se status for "novo" */}
          {order.status === 'novo' && (
            <div className="rounded-lg border-2 border-blue-400 bg-blue-50 p-4 sm:p-5">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">💬</span>
                Fale com o seu Cliente
              </h2>
              <a
                href={buildWhatsAppMessage(order)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { if (!order.customer_phone) { e.preventDefault(); alert('Este pedido não tem telefone cadastrado. Peça ao cliente para informar o telefone.'); } }}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-lg transition ${order.customer_phone ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Abrir WhatsApp do Cliente
              </a>
            </div>
          )}

          {/* Observações */}
          <div className="rounded-lg border bg-white p-4 sm:p-5">
            <h2 className="font-semibold mb-3">Observações</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione observações sobre o pedido..."
              className="w-full px-3 py-2 border rounded text-sm resize-none"
              rows={3}
            />
            <button
              onClick={() => updateStatus(order.status)}
              disabled={updating}
              className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Salvar Observações
            </button>
          </div>

          {/* Ações */}
          <div className="rounded-lg border bg-white p-4 sm:p-5">
            <h2 className="font-semibold mb-3">Ações</h2>
            {order.status === 'novo' && (
              <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-gray-700">
                <strong>⚠️ Importante:</strong> Jornaleiro, ao mudar o status do pedido abaixo, o cliente será notificado.
              </div>
            )}
            <div className="space-y-3">
              <button
                onClick={advanceStatus}
                disabled={updating || order.status === 'entregue' || order.status === 'cancelado'}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Atualizando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Avançar Status
                  </>
                )}
              </button>
              
              <select
                value={order.status}
                onChange={(e) => updateStatus(e.target.value)}
                disabled={updating}
                className="w-full px-3 py-2 border rounded text-sm"
              >
                <option value="novo">Novo</option>
                <option value="confirmado">Confirmado</option>
                <option value="em_preparo">Em preparo</option>
                <option value="saiu_para_entrega">Saiu para entrega</option>
                <option value="parcialmente_retirado">Parcialmente retirado</option>
                <option value="entregue">Entregue</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Previsão de Entrega */}
          <div className="bg-white border rounded-lg p-4">
            <h2 className="font-semibold mb-3">Previsão de Entrega</h2>
            <input
              type="datetime-local"
              value={estimatedDelivery ? estimatedDelivery.slice(0, 16) : ""}
              onChange={(e) => setEstimatedDelivery(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm"
            />
            <button
              onClick={() => updateStatus(order.status)}
              disabled={updating}
              className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Atualizar Previsão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

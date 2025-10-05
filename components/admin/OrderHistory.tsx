"use client";

import { useState, useEffect } from "react";

type HistoryEntry = {
  id: string;
  order_id: string;
  action: "status_change" | "note_added" | "delivery_updated" | "created";
  old_value?: string;
  new_value: string;
  user_name: string;
  timestamp: string;
  details?: string;
};

type OrderHistoryProps = {
  orderId: string;
};

export default function OrderHistory({ orderId }: OrderHistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/orders/${orderId}/history`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar histórico');
      }
      
      const json = await response.json();
      const { data } = json;
      
      // Transformar dados do Supabase para o formato do componente
      const formattedHistory: HistoryEntry[] = (data || []).map((item: any) => ({
        id: item.id,
        order_id: item.order_id,
        action: item.action,
        old_value: item.old_value,
        new_value: item.new_value,
        user_name: item.user_name,
        timestamp: item.created_at,
        details: item.details
      }));
      
      setHistory(formattedHistory);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (action: HistoryEntry["action"]) => {
    switch (action) {
      case "created":
        return "🆕";
      case "status_change":
        return "🔄";
      case "note_added":
        return "📝";
      case "delivery_updated":
        return "🚚";
      default:
        return "📋";
    }
  };

  const getActionLabel = (action: HistoryEntry["action"]) => {
    switch (action) {
      case "created":
        return "Pedido criado";
      case "status_change":
        return "Status alterado";
      case "note_added":
        return "Observação adicionada";
      case "delivery_updated":
        return "Previsão de entrega atualizada";
      default:
        return "Ação";
    }
  };

  const getActionDescription = (entry: HistoryEntry) => {
    switch (entry.action) {
      case "status_change":
        return `De "${entry.old_value}" para "${entry.new_value}"`;
      case "note_added":
        return entry.new_value;
      case "delivery_updated":
        const oldDate = entry.old_value ? new Date(entry.old_value).toLocaleString('pt-BR') : "";
        const newDate = new Date(entry.new_value).toLocaleString('pt-BR');
        return `${oldDate ? `De ${oldDate} ` : ""}Para ${newDate}`;
      case "created":
        return entry.details || "Pedido criado no sistema";
      default:
        return entry.new_value;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "novo":
        return "bg-yellow-100 text-yellow-800";
      case "confirmado":
        return "bg-blue-100 text-blue-800";
      case "em_preparo":
        return "bg-orange-100 text-orange-800";
      case "saiu_para_entrega":
        return "bg-purple-100 text-purple-800";
      case "entregue":
        return "bg-green-100 text-green-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Histórico do Pedido</h3>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            Erro ao carregar histórico: {error}
          </p>
          <button
            onClick={loadHistory}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">
        Histórico do Pedido 
        <span className="ml-2 text-xs text-gray-500">({history.length} {history.length === 1 ? 'entrada' : 'entradas'})</span>
      </h3>
      
      {history.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-600">
            Nenhuma atividade registrada ainda.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            As mudanças de status e observações aparecerão aqui.
          </p>
          <button
            onClick={loadHistory}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            🔄 Recarregar histórico
          </button>
        </div>
      ) : (
        <div className="flow-root">
          <ul className="-mb-8">
            {history.map((entry, index) => (
            <li key={entry.id}>
              <div className="relative pb-8">
                {index !== history.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                      <span className="text-sm">{getActionIcon(entry.action)}</span>
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {getActionLabel(entry.action)}
                        </p>
                        {entry.action === "status_change" && (
                          <div className="flex items-center gap-1">
                            {entry.old_value && (
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(entry.old_value)}`}>
                                {entry.old_value}
                              </span>
                            )}
                            <span className="text-gray-400">→</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(entry.new_value)}`}>
                              {entry.new_value}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {getActionDescription(entry)}
                      </p>
                      {entry.details && entry.action !== "created" && (
                        <p className="text-xs text-gray-500 mt-1">
                          {entry.details}
                        </p>
                      )}
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <div>{formatTimestamp(entry.timestamp)}</div>
                      <div className="text-xs">{entry.user_name}</div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            ))}
        </ul>
      </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/admin/ToastProvider";

type WhatsAppTemplate = {
  id: string;
  name: string;
  trigger: "new_order" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled" | "manual";
  message: string;
  active: boolean;
  variables: string[];
};

const DEFAULT_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: "new_order",
    name: "Novo Pedido",
    trigger: "new_order",
    message: "Olá {customer_name}! 👋\n\nRecebemos seu pedido #{order_id} no valor de R$ {total}.\n\nItens:\n{items_list}\n\nEm breve entraremos em contato para confirmar. Obrigado pela preferência! 🙏",
    active: true,
    variables: ["customer_name", "order_id", "total", "items_list"]
  },
  {
    id: "confirmed",
    name: "Pedido Confirmado",
    trigger: "confirmed",
    message: "✅ Pedido #{order_id} confirmado!\n\nOlá {customer_name}, seu pedido foi confirmado e está sendo preparado.\n\nPrevisão de entrega: {estimated_delivery}\n\nAcompanhe o status pelo nosso sistema!",
    active: true,
    variables: ["customer_name", "order_id", "estimated_delivery"]
  },
  {
    id: "preparing",
    name: "Em Preparo",
    trigger: "preparing",
    message: "🔄 Seu pedido #{order_id} está sendo preparado!\n\n{customer_name}, estamos organizando seus itens com muito cuidado.\n\nEm breve estará pronto para entrega! 📦",
    active: true,
    variables: ["customer_name", "order_id"]
  },
  {
    id: "shipped",
    name: "Saiu para Entrega",
    trigger: "shipped",
    message: "🚚 Pedido #{order_id} saiu para entrega!\n\n{customer_name}, seu pedido está a caminho!\n\nEndereço: {delivery_address}\n\nEm breve chegará até você! 🎉",
    active: true,
    variables: ["customer_name", "order_id", "delivery_address"]
  },
  {
    id: "delivered",
    name: "Entregue",
    trigger: "delivered",
    message: "✅ Pedido #{order_id} entregue com sucesso!\n\n{customer_name}, esperamos que tenha gostado dos produtos!\n\nSua avaliação é muito importante para nós. Obrigado pela confiança! ⭐",
    active: true,
    variables: ["customer_name", "order_id"]
  },
  {
    id: "cancelled",
    name: "Cancelado",
    trigger: "cancelled",
    message: "❌ Pedido #{order_id} foi cancelado\n\n{customer_name}, infelizmente precisamos cancelar seu pedido.\n\nMotivo: {cancellation_reason}\n\nSe houver reembolso, será processado em até 5 dias úteis.",
    active: false,
    variables: ["customer_name", "order_id", "cancellation_reason"]
  }
];

export default function WhatsAppTemplates() {
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(DEFAULT_TEMPLATES);
  const [editingTemplate, setEditingTemplate] = useState<WhatsAppTemplate | null>(null);
  const [previewData, setPreviewData] = useState({
    customer_name: "João Silva",
    order_id: "ORD-001",
    total: "33,50",
    items_list: "• 2x Revista Veja\n• 1x Jornal Folha",
    estimated_delivery: "15/01/2024 às 16:00",
    delivery_address: "Rua das Flores, 123 - Centro",
    cancellation_reason: "Produto em falta"
  });
  const toast = useToast();

  const saveTemplate = (template: WhatsAppTemplate) => {
    setTemplates(prev => 
      prev.map(t => t.id === template.id ? template : t)
    );
    setEditingTemplate(null);
    toast.success("Template salvo com sucesso!");
  };

  const toggleTemplate = (id: string) => {
    setTemplates(prev =>
      prev.map(t => t.id === id ? { ...t, active: !t.active } : t)
    );
  };

  const previewMessage = (template: WhatsAppTemplate) => {
    let message = template.message;
    
    // Substituir variáveis pelos dados de preview
    template.variables.forEach(variable => {
      const value = previewData[variable as keyof typeof previewData] || `{${variable}}`;
      message = message.replace(new RegExp(`{${variable}}`, 'g'), value);
    });
    
    return message;
  };

  const sendTestMessage = (template: WhatsAppTemplate) => {
    const message = previewMessage(template);
    const phone = "5511999999999"; // Número de teste
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const TemplateEditor = ({ template }: { template: WhatsAppTemplate }) => {
    const [editedTemplate, setEditedTemplate] = useState(template);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Editar Template: {template.name}</h3>
            <button
              onClick={() => setEditingTemplate(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome do Template</label>
              <input
                type="text"
                value={editedTemplate.name}
                onChange={(e) => setEditedTemplate(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mensagem</label>
              <textarea
                value={editedTemplate.message}
                onChange={(e) => setEditedTemplate(prev => ({ ...prev, message: e.target.value }))}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                placeholder="Digite sua mensagem aqui..."
              />
              <div className="mt-2 text-xs text-gray-600">
                <strong>Variáveis disponíveis:</strong> {template.variables.map(v => `{${v}}`).join(", ")}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editedTemplate.active}
                  onChange={(e) => setEditedTemplate(prev => ({ ...prev, active: e.target.checked }))}
                />
                <span className="text-sm">Template ativo</span>
              </label>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Preview da Mensagem</h4>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="whitespace-pre-wrap text-sm">
                  {previewMessage(editedTemplate)}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => saveTemplate(editedTemplate)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Salvar Template
              </button>
              <button
                onClick={() => sendTestMessage(editedTemplate)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Testar no WhatsApp
              </button>
              <button
                onClick={() => setEditingTemplate(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Templates WhatsApp</h2>
        <p className="text-sm text-gray-600">
          Configure mensagens automáticas para diferentes status de pedidos.
        </p>
      </div>

      {/* Dados de Preview */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <h3 className="font-medium mb-3">Dados para Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1">Nome do Cliente</label>
            <input
              type="text"
              value={previewData.customer_name}
              onChange={(e) => setPreviewData(prev => ({ ...prev, customer_name: e.target.value }))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">ID do Pedido</label>
            <input
              type="text"
              value={previewData.order_id}
              onChange={(e) => setPreviewData(prev => ({ ...prev, order_id: e.target.value }))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Total</label>
            <input
              type="text"
              value={previewData.total}
              onChange={(e) => setPreviewData(prev => ({ ...prev, total: e.target.value }))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Previsão de Entrega</label>
            <input
              type="text"
              value={previewData.estimated_delivery}
              onChange={(e) => setPreviewData(prev => ({ ...prev, estimated_delivery: e.target.value }))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Lista de Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {templates.map((template) => (
          <div key={template.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{template.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  template.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {template.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleTemplate(template.id)}
                  className={`text-sm px-2 py-1 rounded ${
                    template.active ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  {template.active ? 'Desativar' : 'Ativar'}
                </button>
                <button
                  onClick={() => setEditingTemplate(template)}
                  className="text-blue-600 hover:bg-blue-50 text-sm px-2 py-1 rounded"
                >
                  Editar
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded p-3 mb-3">
              <div className="text-xs text-gray-600 mb-1">Preview:</div>
              <div className="text-sm whitespace-pre-wrap">
                {previewMessage(template).substring(0, 150)}
                {previewMessage(template).length > 150 && "..."}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Trigger: {template.trigger}</span>
              <button
                onClick={() => sendTestMessage(template)}
                className="text-green-600 hover:text-green-800"
              >
                Testar WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {editingTemplate && <TemplateEditor template={editingTemplate} />}
    </div>
  );
}

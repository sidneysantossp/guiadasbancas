"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import WhatsAppTemplates from "@/components/admin/WhatsAppTemplates";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ToastProvider";

type ConfigTab = "whatsapp" | "notifications" | "general" | "delivery" | "payment";

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<ConfigTab>("whatsapp");

  const { user } = useAuth();
  const { show: showToast } = useToast();
  const [banca, setBanca] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [deliveryConfig, setDeliveryConfig] = useState({
    delivery_fee: 0,
    min_order_value: 0,
    delivery_radius: 5,
    preparation_time: 30,
  });
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadBancaConfig();
    }
  }, [user]);

  const loadBancaConfig = async () => {
    try {
      const { data } = await supabase
        .from('bancas')
        .select('*')
        .eq('user_id', user!.id)
        .single();
      
      if (data) {
        setBanca(data);
        setDeliveryConfig({
          delivery_fee: data.delivery_fee || 0,
          min_order_value: data.min_order_value || 0,
          delivery_radius: data.delivery_radius || 5,
          preparation_time: data.preparation_time || 30,
        });
        setPaymentMethods(data.payment_methods || []);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const saveDeliveryConfig = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('bancas')
        .update(deliveryConfig)
        .eq('user_id', user!.id);

      if (error) throw error;
      showToast('Configurações de entrega salvas!');
    } catch (error) {
      showToast('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const savePaymentMethods = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('bancas')
        .update({ payment_methods: paymentMethods })
        .eq('user_id', user!.id);

      if (error) throw error;
      showToast('Formas de pagamento salvas!');
    } catch (error) {
      showToast('Erro ao salvar formas de pagamento');
    } finally {
      setLoading(false);
    }
  };

  const togglePaymentMethod = (method: string) => {
    if (paymentMethods.includes(method)) {
      setPaymentMethods(paymentMethods.filter(m => m !== method));
    } else {
      setPaymentMethods([...paymentMethods, method]);
    }
  };

  const tabs = [
    { id: "general" as ConfigTab, label: "Geral", icon: "⚙️" },
    { id: "delivery" as ConfigTab, label: "Entrega", icon: "🚚" },
    { id: "payment" as ConfigTab, label: "Pagamento", icon: "💳" },
    { id: "notifications" as ConfigTab, label: "Notificações", icon: "🔔" },
    { id: "whatsapp" as ConfigTab, label: "WhatsApp", icon: "📱" },
  ];

  const NotificationsSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Configurações de Notificações</h3>
        <p className="text-sm text-gray-600">
          Configure como e quando você deseja receber notificações.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div className="font-medium">Notificações do Browser</div>
            <div className="text-sm text-gray-600">
              Receba alertas no navegador para novos pedidos
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div className="font-medium">Som de Notificação</div>
            <div className="text-sm text-gray-600">
              Reproduzir som quando receber novos pedidos
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div className="font-medium">Email de Resumo Diário</div>
            <div className="text-sm text-gray-600">
              Receba um resumo dos pedidos do dia por email
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">Horário de Funcionamento</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Abertura</label>
            <input
              type="time"
              defaultValue="08:00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fechamento</label>
            <input
              type="time"
              defaultValue="18:00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Notificações serão silenciadas fora do horário de funcionamento
        </p>
      </div>
    </div>
  );

  const DeliverySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Configurações de Entrega</h3>
        <p className="text-sm text-gray-600">
          Configure as opções de entrega da sua banca.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Taxa de Entrega (R$)</label>
          <input
            type="number"
            step="0.01"
            value={deliveryConfig.delivery_fee}
            onChange={(e) => setDeliveryConfig({ ...deliveryConfig, delivery_fee: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Valor cobrado por entrega. Use 0 para frete grátis.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Valor Mínimo do Pedido (R$)</label>
          <input
            type="number"
            step="0.01"
            value={deliveryConfig.min_order_value}
            onChange={(e) => setDeliveryConfig({ ...deliveryConfig, min_order_value: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Valor mínimo para aceitar pedidos. Use 0 para sem mínimo.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Raio de Entrega (km)</label>
          <input
            type="number"
            step="0.5"
            value={deliveryConfig.delivery_radius}
            onChange={(e) => setDeliveryConfig({ ...deliveryConfig, delivery_radius: parseFloat(e.target.value) || 5 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Distância máxima para entregas a partir da sua banca.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tempo de Preparo (minutos)</label>
          <input
            type="number"
            step="5"
            value={deliveryConfig.preparation_time}
            onChange={(e) => setDeliveryConfig({ ...deliveryConfig, preparation_time: parseInt(e.target.value) || 30 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Tempo estimado para preparar os pedidos.
          </p>
        </div>

        <button
          onClick={saveDeliveryConfig}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-95 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar Configurações de Entrega'}
        </button>
      </div>
    </div>
  );

  const PaymentSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Formas de Pagamento</h3>
        <p className="text-sm text-gray-600">
          Selecione as formas de pagamento que sua banca aceita.
        </p>
      </div>

      <div className="space-y-3">
        {[
          { id: 'pix', label: 'PIX', icon: '💱' },
          { id: 'dinheiro', label: 'Dinheiro', icon: '💵' },
          { id: 'debito', label: 'Cartão de Débito', icon: '💳' },
          { id: 'credito', label: 'Cartão de Crédito', icon: '💳' },
          { id: 'vale', label: 'Vale Alimentação/Refeição', icon: '🍽️' },
        ].map((method) => (
          <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{method.icon}</span>
              <div>
                <div className="font-medium">{method.label}</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={paymentMethods.includes(method.id)}
                onChange={() => togglePaymentMethod(method.id)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-2">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-800">
            <strong>Dica:</strong> Oferecer mais formas de pagamento aumenta suas chances de venda!
          </div>
        </div>
      </div>

      <button
        onClick={savePaymentMethods}
        disabled={loading || paymentMethods.length === 0}
        className="w-full bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-95 disabled:opacity-50"
      >
        {loading ? 'Salvando...' : 'Salvar Formas de Pagamento'}
      </button>

      {paymentMethods.length === 0 && (
        <p className="text-sm text-red-600 text-center">
          Selecione pelo menos uma forma de pagamento
        </p>
      )}
    </div>
  );

  const GeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Configurações Gerais</h3>
        <p className="text-sm text-gray-600">
          Configurações básicas da sua conta e banca.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome da Banca</label>
          <input
            type="text"
            defaultValue="Banca São Jorge"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">WhatsApp da Banca</label>
          <input
            type="tel"
            defaultValue="11987654321"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="11999999999"
          />
          <p className="text-xs text-gray-500 mt-1">
            Digite apenas números (DDD + número). Este WhatsApp receberá notificações de novos pedidos.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descrição da Banca</label>
          <textarea
            rows={3}
            defaultValue="Banca de jornal e revistas localizada no centro da cidade. Atendemos com qualidade há mais de 20 anos."
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Taxa de Entrega (R$)</label>
          <input
            type="number"
            step="0.01"
            defaultValue="5.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Raio de Entrega (km)</label>
          <input
            type="number"
            step="0.1"
            defaultValue="5.0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="active" defaultChecked />
          <label htmlFor="active" className="text-sm">
            Banca ativa (visível para clientes)
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="delivery" defaultChecked />
          <label htmlFor="delivery" className="text-sm">
            Aceitar pedidos para entrega
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="pickup" defaultChecked />
          <label htmlFor="pickup" className="text-sm">
            Aceitar pedidos para retirada
          </label>
        </div>
      </div>

      <div className="pt-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Salvar Configurações
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Configurações</h1>
        <p className="text-sm text-gray-600">
          Gerencie as configurações da sua banca e preferências do sistema.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white border rounded-lg p-6">
        {activeTab === "whatsapp" && (
          <div className="space-y-6">
            {/* Link para configurações avançadas */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">
                    Configurações Avançadas do WhatsApp
                  </h4>
                  <p className="text-sm text-blue-700">
                    Configure a conexão com Evolution API, teste mensagens e monitore o status da integração.
                  </p>
                </div>
                <Link
                  href="/jornaleiro/configuracoes/whatsapp"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Configurar
                </Link>
              </div>
            </div>
            
            <WhatsAppTemplates />
          </div>
        )}
        {activeTab === "delivery" && <DeliverySettings />}
        {activeTab === "payment" && <PaymentSettings />}
        {activeTab === "notifications" && <NotificationsSettings />}
        {activeTab === "general" && <GeneralSettings />}
      </div>
    </div>
  );
}

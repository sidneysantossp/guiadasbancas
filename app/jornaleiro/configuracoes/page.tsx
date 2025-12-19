"use client";

import { useState, useEffect, memo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import WhatsAppTemplates from "@/components/admin/WhatsAppTemplates";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/components/ToastProvider";

type ConfigTab = "whatsapp" | "notifications" | "general" | "delivery" | "payment";

type GeneralConfigType = {
  name: string;
  whatsapp: string;
  description: string;
  delivery_enabled?: boolean;
  free_shipping_threshold?: number;
  origin_cep?: string;
};

type DeliveryConfigType = {
  delivery_fee: number;
  min_order_value: number;
  delivery_radius: number;
};

// Funções de máscara
const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1)$2-$3');
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1)$2-$3');
};

const formatCurrency = (value: string | number) => {
  // Se o valor já é um número decimal, usa direto
  if (typeof value === 'number') {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  // Se é string, remove tudo exceto números e divide por 100
  const numbers = value.toString().replace(/\D/g, '');
  const amount = parseFloat(numbers) / 100;
  return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const parseCurrency = (value: string): number => {
  const numbers = value.replace(/\D/g, '');
  return parseFloat(numbers) / 100;
};

// Componente separado para evitar recriação
const GeneralSettingsForm = memo(({ 
  generalConfig, 
  setGeneralConfig, 
  deliveryConfig, 
  setDeliveryConfig,
  loading,
  onSave
}: {
  generalConfig: GeneralConfigType;
  setGeneralConfig: React.Dispatch<React.SetStateAction<GeneralConfigType>>;
  deliveryConfig: DeliveryConfigType;
  setDeliveryConfig: React.Dispatch<React.SetStateAction<DeliveryConfigType>>;
  loading: boolean;
  onSave: () => void;
}) => (
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
          value={generalConfig.name}
          onChange={(e) => setGeneralConfig({ ...generalConfig, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
          placeholder="Nome da sua banca"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">WhatsApp da Banca</label>
        <input
          type="tel"
          value={formatPhone(generalConfig.whatsapp || '')}
          onChange={(e) => {
            const numbers = e.target.value.replace(/\D/g, '');
            setGeneralConfig({ ...generalConfig, whatsapp: numbers });
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
          placeholder="(11)99999-9999"
          maxLength={15}
        />
        <p className="text-xs text-gray-500 mt-1">
          Digite apenas números (DDD + número). Este WhatsApp receberá notificações de novos pedidos.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descrição da Banca</label>
        <textarea
          rows={3}
          value={generalConfig.description}
          onChange={(e) => setGeneralConfig({ ...generalConfig, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
          placeholder="Descreva sua banca..."
        />
      </div>

      {/* Checkbox de ativação removido - agora controlado apenas pelos administradores */}
    </div>

    <div className="pt-4">
      <button 
        onClick={onSave}
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-95 disabled:opacity-50 text-sm sm:text-base"
      >
        {loading ? 'Salvando...' : 'Salvar Configurações'}
      </button>
    </div>
  </div>
));

GeneralSettingsForm.displayName = 'GeneralSettingsForm';

export default function ConfiguracoesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [banca, setBanca] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ConfigTab>("general");
  const [deliveryConfig, setDeliveryConfig] = useState<DeliveryConfigType>({
    delivery_fee: 0,
    min_order_value: 0,
    delivery_radius: 5,
  });
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [generalConfig, setGeneralConfig] = useState<GeneralConfigType>({
    name: '',
    whatsapp: '',
    description: '',
    delivery_enabled: false,
    free_shipping_threshold: 120,
    origin_cep: '',
  });

  useEffect(() => {
    if (user) {
      loadBancaConfig();
    }
  }, [user]);

  const loadBancaConfig = async () => {
    try {
      console.log('Carregando configurações para user:', user?.id);

      const res = await fetch(`/api/jornaleiro/banca?ts=${Date.now()}`, {
        cache: "no-store",
        credentials: "include",
      });
      const text = await res.text();
      const json = JSON.parse(text);

      if (!res.ok || !json?.success || !json?.data) {
        console.error('Erro ao carregar:', json?.error || text);
        toast.error('Erro ao carregar configurações da banca');
        return;
      }

      const data = json.data;
      if (data) {
        setBanca(data);
        setDeliveryConfig({
          delivery_fee: data.delivery_fee || 0,
          min_order_value: data.min_order_value || 0,
          delivery_radius: data.delivery_radius || 5,
        });
        setPaymentMethods(data.payment_methods || data.payments || []);
        setGeneralConfig({
          name: data.name || '',
          whatsapp: data.contact?.whatsapp || data.whatsapp || '',
          description: data.description || '',
          delivery_enabled: data.delivery_enabled || false,
          free_shipping_threshold: data.free_shipping_threshold || 120,
          origin_cep: data.origin_cep || '',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações');
    }
  };

  const updateBanca = async (updates: any) => {
    const res = await fetch("/api/jornaleiro/banca", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updates),
    });
    const text = await res.text();
    const json = JSON.parse(text);
    if (!res.ok || !json?.success) {
      throw new Error(json?.error || `HTTP ${res.status}`);
    }
    return json.data;
  };

  const saveDeliveryConfig = async () => {
    try {
      setLoading(true);
      await updateBanca({
        delivery_fee: deliveryConfig.delivery_fee,
        min_order_value: deliveryConfig.min_order_value,
        delivery_radius: deliveryConfig.delivery_radius,
      });
      toast.success('Configurações de entrega salvas!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const savePaymentMethods = async () => {
    try {
      setLoading(true);
      await updateBanca({ payment_methods: paymentMethods });
      toast.success('Formas de pagamento salvas!');
    } catch (error) {
      toast.error('Erro ao salvar formas de pagamento');
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

  const saveGeneralConfig = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        toast.error('Usuário não identificado. Faça login novamente.');
        return;
      }

      console.log('Salvando configurações:', {
        user_id: user.id,
        generalConfig,
        deliveryConfig
      });

      toast.success('Configurações gerais salvas com sucesso!');
      await updateBanca({
        name: generalConfig.name,
        contact: { whatsapp: generalConfig.whatsapp },
        description: generalConfig.description,
        delivery_enabled: generalConfig.delivery_enabled || false,
        free_shipping_threshold: generalConfig.free_shipping_threshold ?? 120,
        origin_cep: generalConfig.origin_cep || '',
      });
      await loadBancaConfig(); // Recarrega os dados
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      toast.error(`Erro ao salvar: ${error?.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "general" as ConfigTab, label: "Geral", icon: "fa-regular fa-circle-dot" },
    { id: "delivery" as ConfigTab, label: "Entrega", icon: "fa-regular fa-paper-plane" },
    { id: "payment" as ConfigTab, label: "Pagamento", icon: "fa-regular fa-credit-card" },
    { id: "notifications" as ConfigTab, label: "Notificações", icon: "fa-regular fa-bell" },
    // { id: "whatsapp" as ConfigTab, label: "WhatsApp", icon: "fa-brands fa-whatsapp" }, // Oculto temporariamente
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

      {/* Toggle principal para habilitar/desabilitar entrega */}
      <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={generalConfig.delivery_enabled || false}
            onChange={(e) => setGeneralConfig({ ...generalConfig, delivery_enabled: e.target.checked })}
            className="mt-1 rounded"
          />
          <div className="flex-1">
            <div className="font-semibold text-sm">Habilitar Entrega</div>
            <div className="text-xs text-gray-600 mt-1">
              Quando habilitado, os clientes poderão escolher entre retirada na banca ou entrega no endereço.
              Se desabilitado, apenas a opção "Retirar na banca" estará disponível no checkout.
            </div>
          </div>
        </label>
      </div>

      {generalConfig.delivery_enabled && (
      <div className="space-y-4 border-l-4 border-[#ff5c00] pl-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex gap-2">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-800">
              <strong>Dica:</strong> Configure o frete grátis para incentivar compras maiores!
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">CEP de Origem</label>
            <input
              type="text"
              value={generalConfig.origin_cep || ''}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 8);
                const formatted = val.length > 5 ? `${val.slice(0, 5)}-${val.slice(5)}` : val;
                setGeneralConfig({ ...generalConfig, origin_cep: formatted });
              }}
              placeholder="00000-000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              CEP da sua banca para cálculo de frete
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Valor para Frete Grátis</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
              <input
                type="text"
                value={generalConfig.free_shipping_threshold ? String(generalConfig.free_shipping_threshold.toFixed(2)).replace('.', ',') : ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  const num = val ? parseInt(val, 10) / 100 : 0;
                  setGeneralConfig({ ...generalConfig, free_shipping_threshold: num });
                }}
                placeholder="120,00"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Compras acima deste valor têm frete grátis
            </p>
          </div>
        </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Taxa de Entrega (R$)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
            <input
              type="text"
              value={formatCurrency(deliveryConfig.delivery_fee)}
              onChange={(e) => {
                const value = parseCurrency(e.target.value);
                setDeliveryConfig({ ...deliveryConfig, delivery_fee: value });
              }}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              placeholder="0,00"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Valor cobrado por entrega. Use 0 para frete grátis.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Valor Mínimo do Pedido (R$)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
            <input
              type="text"
              value={formatCurrency(deliveryConfig.min_order_value)}
              onChange={(e) => {
                const value = parseCurrency(e.target.value);
                setDeliveryConfig({ ...deliveryConfig, min_order_value: value });
              }}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              placeholder="0,00"
            />
          </div>
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


        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
          <div className="text-sm text-emerald-800">
            <strong>✓ Entrega habilitada!</strong> Seus clientes poderão:
            <ul className="mt-1 ml-4 list-disc text-xs space-y-1">
              <li>Ver barra de progresso para frete grátis</li>
              <li>Escolher entrega ou retirada no checkout</li>
              <li>Calcular frete por CEP</li>
            </ul>
          </div>
        </div>

        <button
          onClick={saveGeneralConfig}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-95 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar Configurações de Entrega'}
        </button>
      </div>
      </div>
      )}

      {!generalConfig.delivery_enabled && (
        <div className="rounded-lg bg-gray-100 border border-gray-200 p-4">
          <div className="text-sm text-gray-600">
            <strong>Entrega desabilitada.</strong> Seus clientes só poderão retirar produtos na banca.
          </div>
        </div>
      )}
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
          { id: 'pix', label: 'PIX', icon: 'fa-brands fa-pix' },
          { id: 'dinheiro', label: 'Dinheiro', icon: 'fa-regular fa-money-bill-1' },
          { id: 'debito', label: 'Cartão de Débito', icon: 'fa-regular fa-credit-card' },
          { id: 'credito', label: 'Cartão de Crédito', icon: 'fa-regular fa-credit-card' },
          { id: 'vale', label: 'Vale Alimentação/Refeição', icon: 'fa-regular fa-id-card' },
        ].map((method) => (
          <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <i className={`${method.icon} text-2xl text-gray-600`}></i>
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

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-xl font-semibold">Configurações</h1>
        <p className="text-sm text-gray-600">
          Gerencie as configurações da sua banca e preferências do sistema.
        </p>
      </div>

      {/* Mobile: Cards clicáveis */}
      <div className="sm:hidden grid grid-cols-2 gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              activeTab === tab.id
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <i className={`${tab.icon} text-xl`}></i>
              <div>
                <div className="font-medium text-sm">{tab.label}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {tab.id === "general" && "Dados básicos"}
                  {tab.id === "delivery" && "Frete e entrega"}
                  {tab.id === "payment" && "Formas de pagamento"}
                  {tab.id === "notifications" && "Alertas e horários"}
                  {tab.id === "whatsapp" && "Templates e API"}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Desktop: Tabs tradicionais */}
      <div className="hidden sm:block border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white border rounded-lg p-4 sm:p-6">
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
        {activeTab === "general" && (
          <GeneralSettingsForm
            generalConfig={generalConfig}
            setGeneralConfig={setGeneralConfig}
            deliveryConfig={deliveryConfig}
            setDeliveryConfig={setDeliveryConfig}
            loading={loading}
            onSave={saveGeneralConfig}
          />
        )}
      </div>
    </div>
  );
}

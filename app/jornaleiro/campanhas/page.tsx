"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/admin/ToastProvider";

interface Campaign {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'expired' | 'cancelled';
  admin_message?: string;
  rejection_reason?: string;
  impressions: number;
  clicks: number;
  created_at: string;
  products: {
    id: string;
    name: string;
    description: string;
    price: number;
    price_original?: number;
    discount_percent?: number;
    images: string[];
    rating_avg?: number;
    reviews_count: number;
    pronta_entrega: boolean;
    sob_encomenda: boolean;
    pre_venda: boolean;
  };
}

const statusLabels = {
  pending: { label: 'Aguardando Aprovação', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  approved: { label: 'Aprovado', color: 'bg-blue-100 text-blue-800', icon: '✅' },
  rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-800', icon: '❌' },
  active: { label: 'Publicado', color: 'bg-green-100 text-green-800', icon: '🔥' },
  expired: { label: 'Expirado', color: 'bg-gray-100 text-gray-800', icon: '⏰' },
  cancelled: { label: 'Cancelado', color: 'bg-gray-100 text-gray-800', icon: '🚫' }
};

export default function JornaleiroCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Campaign[]>([]);
  const toast = useToast();

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/jornaleiro/campaigns');
      const json = await res.json();
      
      if (json.success) {
        setCampaigns(json.data);
        
        // Verificar campanhas que expiram em 2 dias
        const expiringSoon = json.data.filter((campaign: Campaign) => {
          if (campaign.status !== 'active') return false;
          const daysRemaining = getDaysRemaining(campaign.end_date);
          return daysRemaining <= 2 && daysRemaining > 0;
        });
        setNotifications(expiringSoon);
      }
    } catch (error) {
      toast.error('Erro ao carregar campanhas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPerformanceColor = (impressions: number) => {
    if (impressions >= 1000) return 'text-green-600';
    if (impressions >= 500) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const activeCampaigns = useMemo(() => campaigns.filter((campaign) => campaign.status === "active").length, [campaigns]);
  const pendingCampaigns = useMemo(() => campaigns.filter((campaign) => campaign.status === "pending").length, [campaigns]);
  const totalImpressions = useMemo(() => campaigns.reduce((sum, campaign) => sum + Number(campaign.impressions || 0), 0), [campaigns]);
  const totalClicks = useMemo(() => campaigns.reduce((sum, campaign) => sum + Number(campaign.clicks || 0), 0), [campaigns]);
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff5c00]">
            Abastecimento e crescimento
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Campanhas e visibilidade</h1>
          <p className="mt-1 max-w-3xl text-gray-600">
            Use campanhas para empurrar produto com mais margem, acelerar giro e manter a banca visível dentro da
            plataforma. O foco aqui é crescimento com intenção, não anúncio por impulso.
          </p>
        </div>
        <Link
          href="/jornaleiro/campanhas/create"
          className="bg-[#ff5c00] text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-95"
        >
          Nova Campanha
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Campanhas ativas</div>
          <div className="mt-3 text-2xl font-semibold text-gray-900">{activeCampaigns}</div>
          <p className="mt-1 text-sm text-gray-500">Produtos hoje recebendo destaque dentro da plataforma.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Aguardando aprovação</div>
          <div className="mt-3 text-2xl font-semibold text-gray-900">{pendingCampaigns}</div>
          <p className="mt-1 text-sm text-gray-500">Campanhas ainda em análise antes de publicar.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Impressões</div>
          <div className="mt-3 text-2xl font-semibold text-gray-900">{totalImpressions.toLocaleString("pt-BR")}</div>
          <p className="mt-1 text-sm text-gray-500">Volume total de exposição gerado pelas campanhas.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">CTR agregado</div>
          <div className="mt-3 text-2xl font-semibold text-gray-900">{ctr.toFixed(1)}%</div>
          <p className="mt-1 text-sm text-gray-500">Clique sobre visualização nas campanhas carregadas.</p>
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-amber-600 text-xl">⚠️</div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-amber-800 mb-2">
                Campanhas expirando em breve
              </h3>
              <div className="space-y-2">
                {notifications.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between bg-white p-3 rounded border">
                    <div>
                      <span className="text-sm font-medium">{campaign.products.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        Expira em {getDaysRemaining(campaign.end_date)} dias
                      </span>
                    </div>
                    <button className="bg-amber-500 text-white px-3 py-1 rounded text-xs hover:bg-amber-600">
                      Renovar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {(pendingCampaigns > 0 || activeCampaigns === 0) && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          <div className="font-semibold">Próxima ação recomendada em crescimento</div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-blue-800">
            {pendingCampaigns > 0 ? <span>{pendingCampaigns} campanha(s) aguardando aprovação</span> : null}
            {activeCampaigns === 0 ? <span>Nenhuma campanha ativa neste momento</span> : null}
            <span>Priorize produtos com estoque, margem e boa imagem antes de anunciar.</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Carregando campanhas...</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-400 text-4xl mb-4">📢</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma campanha criada</h3>
          <p className="text-gray-600 mb-4">Crie sua primeira campanha publicitária para destacar seus produtos</p>
          <Link
            href="/jornaleiro/campanhas/create"
            className="inline-block bg-[#ff5c00] text-white px-6 py-2 rounded-md text-sm font-medium hover:opacity-95"
          >
            Criar Primeira Campanha
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex gap-6">
                {/* Imagem do produto */}
                <div className="flex-shrink-0">
                  <img
                    src={campaign.products.images[0] || '/placeholder-product.jpg'}
                    alt={campaign.products.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>

                {/* Informações principais */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        {campaign.products.name}
                        <Link
                          href={`/jornaleiro/produtos/${campaign.products.id}`}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                          title="Editar produto"
                        >
                          👁️
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-600">{campaign.products.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusLabels[campaign.status].color}`}>
                        {statusLabels[campaign.status].icon} {statusLabels[campaign.status].label}
                      </span>
                    </div>
                  </div>

                  {/* Preços e badges */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        R$ {campaign.products.price.toFixed(2)}
                      </span>
                      {campaign.products.price_original && (
                        <span className="text-sm text-gray-500 line-through">
                          R$ {campaign.products.price_original.toFixed(2)}
                        </span>
                      )}
                      {campaign.products.discount_percent && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                          -{campaign.products.discount_percent}%
                        </span>
                      )}
                    </div>

                    {/* Badges de disponibilidade */}
                    <div className="flex gap-1">
                      {campaign.products.pronta_entrega && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          ✅ Pronta Entrega
                        </span>
                      )}
                      {campaign.products.sob_encomenda && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          📋 Sob Encomenda
                        </span>
                      )}
                      {campaign.products.pre_venda && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          🔮 Pré-Venda
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Informações da campanha */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Duração:</span>
                      <div className="font-medium">{campaign.duration_days} dias</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Início:</span>
                      <div className="font-medium">{formatDate(campaign.start_date)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Fim:</span>
                      <div className="font-medium">{formatDate(campaign.end_date)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Visualizações:</span>
                      <div className={`font-medium ${getPerformanceColor(campaign.impressions)}`}>
                        {campaign.impressions.toLocaleString()}
                      </div>
                    </div>
                    {campaign.status === 'active' && (
                      <div>
                        <span className="text-gray-500">Restam:</span>
                        <div className="font-medium text-orange-600">
                          {getDaysRemaining(campaign.end_date)} dias
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mensagens do admin */}
                  {campaign.admin_message && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-blue-800">💬 Mensagem do admin:</span>
                      <p className="text-sm text-blue-700 mt-1">{campaign.admin_message}</p>
                    </div>
                  )}

                  {campaign.rejection_reason && (
                    <div className="bg-red-50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-red-800">❌ Motivo da rejeição:</span>
                      <p className="text-sm text-red-700 mt-1">{campaign.rejection_reason}</p>
                    </div>
                  )}

                  {/* Barra de progresso para campanhas ativas */}
                  {campaign.status === 'active' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Progresso da campanha</span>
                        <span>{Math.round(((campaign.duration_days - getDaysRemaining(campaign.end_date)) / campaign.duration_days) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ 
                            width: `${Math.min(100, ((campaign.duration_days - getDaysRemaining(campaign.end_date)) / campaign.duration_days) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">📢 Regras de operação das campanhas</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div className="space-y-2">
            <p>• <strong>Gratuito:</strong> Crie campanhas sem custo inicial</p>
            <p>• <strong>Aprovação:</strong> Todas as campanhas passam por análise</p>
            <p>• <strong>Destaque:</strong> Produtos aparecem nas áreas de visibilidade da plataforma</p>
          </div>
          <div className="space-y-2">
            <p>• <strong>Duração:</strong> Escolha entre 7, 15 ou 30 dias</p>
            <p>• <strong>Métricas:</strong> Use visualizações e cliques para decidir renovação</p>
            <p>• <strong>Renovação:</strong> Renove só o que realmente está puxando demanda</p>
          </div>
        </div>
      </div>
    </div>
  );
}

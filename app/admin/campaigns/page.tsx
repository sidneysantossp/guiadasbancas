"use client";

import { useEffect, useState } from "react";
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
  plan_type: string;
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
    bancas: {
      id: string;
      name: string;
      cover_image?: string;
    };
  };
}

const statusLabels = {
  pending: { label: 'Aguardando', color: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Aprovado', color: 'bg-blue-100 text-blue-800' },
  rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-800' },
  active: { label: 'Ativo', color: 'bg-green-100 text-green-800' },
  expired: { label: 'Expirado', color: 'bg-gray-100 text-gray-800' },
  cancelled: { label: 'Cancelado', color: 'bg-gray-100 text-gray-800' }
};

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'approve' | 'reject'>('approve');
  const [adminMessage, setAdminMessage] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const toast = useToast();

  const handleDelete = async (campaignId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer admin-token' }
      });

      if (res.ok) {
        toast.success('Campanha excluída com sucesso');
        fetchCampaigns();
      } else {
        toast.error('Erro ao excluir campanha');
      }
    } catch (error) {
      toast.error('Erro ao excluir campanha');
    }
  };

  const handleArchive = async (campaignId: string) => {
    try {
      const res = await fetch(`/api/admin/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify({
          status: 'cancelled',
          admin_message: 'Campanha arquivada pelo administrador'
        })
      });

      if (res.ok) {
        toast.success('Campanha arquivada com sucesso');
        fetchCampaigns();
      } else {
        toast.error('Erro ao arquivar campanha');
      }
    } catch (error) {
      toast.error('Erro ao arquivar campanha');
    }
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus) params.set('status', selectedStatus);
      
      const res = await fetch(`/api/admin/campaigns?${params.toString()}`, {
        headers: { 'Authorization': 'Bearer admin-token' }
      });
      const json = await res.json();
      
      if (json.success) {
        setCampaigns(json.data);
      }
    } catch (error) {
      toast.error('Erro ao carregar campanhas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [selectedStatus]);

  const handleAction = (campaign: Campaign, action: 'approve' | 'reject') => {
    setSelectedCampaign(campaign);
    setModalAction(action);
    setAdminMessage('');
    setRejectionReason('');
    setShowModal(true);
  };

  const submitAction = async () => {
    if (!selectedCampaign) return;

    try {
      const body = {
        status: modalAction === 'approve' ? 'approved' : 'rejected',
        admin_message: adminMessage,
        rejection_reason: modalAction === 'reject' ? rejectionReason : undefined
      };

      const res = await fetch(`/api/admin/campaigns/${selectedCampaign.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        toast.success(`Campanha ${modalAction === 'approve' ? 'aprovada' : 'rejeitada'} com sucesso`);
        setShowModal(false);
        fetchCampaigns();
      } else {
        toast.error('Erro ao processar ação');
      }
    } catch (error) {
      toast.error('Erro ao processar ação');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campanhas Publicitárias</h1>
          <p className="text-gray-600">Gerencie as campanhas dos jornaleiros</p>
        </div>
        <Link
          href="/admin/campaigns/create"
          className="bg-[#ff5c00] text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-95"
        >
          Nova Campanha
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex gap-4 items-center">
          <label className="text-sm font-medium">Filtrar por status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Todos</option>
            <option value="pending">Aguardando Aprovação</option>
            <option value="approved">Aprovados</option>
            <option value="rejected">Rejeitados</option>
            <option value="active">Ativos</option>
            <option value="expired">Expirados</option>
          </select>
        </div>
      </div>

      {/* Lista de campanhas */}
      {loading ? (
        <div className="text-center py-8">Carregando campanhas...</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Nenhuma campanha encontrada</div>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex gap-6">
                {/* Imagem do produto */}
                <div className="flex-shrink-0">
                  <img
                    src={campaign.products.images[0] || '/placeholder-product.jpg'}
                    alt={campaign.products.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>

                {/* Informações principais */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {campaign.products.name}
                      </h3>
                      <p className="text-sm text-gray-600">{campaign.products.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">Banca:</span>
                        <span className="text-sm font-medium">{campaign.products.bancas.name}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusLabels[campaign.status].color}`}>
                        {statusLabels[campaign.status].label}
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                      <span className="text-gray-500">Impressões:</span>
                      <div className="font-medium">{campaign.impressions}</div>
                    </div>
                  </div>

                  {/* Dias restantes para campanhas ativas */}
                  {campaign.status === 'active' && (
                    <div className="text-sm">
                      <span className="text-gray-500">Dias restantes:</span>
                      <span className="font-medium ml-1">
                        {getDaysRemaining(campaign.end_date)} dias
                      </span>
                    </div>
                  )}

                  {/* Mensagens */}
                  {campaign.admin_message && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-blue-800">Mensagem do admin:</span>
                      <p className="text-sm text-blue-700 mt-1">{campaign.admin_message}</p>
                    </div>
                  )}

                  {campaign.rejection_reason && (
                    <div className="bg-red-50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-red-800">Motivo da rejeição:</span>
                      <p className="text-sm text-red-700 mt-1">{campaign.rejection_reason}</p>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex gap-2 pt-2 border-t border-gray-200">
                    {campaign.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAction(campaign, 'approve')}
                          className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-md text-xs hover:bg-green-600"
                          title="Aprovar campanha"
                        >
                          ✅ Aprovar
                        </button>
                        <button
                          onClick={() => handleAction(campaign, 'reject')}
                          className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-md text-xs hover:bg-red-600"
                          title="Rejeitar campanha"
                        >
                          ❌ Rejeitar
                        </button>
                      </>
                    )}
                    
                    {/* Ações gerais sempre disponíveis */}
                    <button
                      onClick={() => window.open(`/produto/${campaign.products.id}`, '_blank')}
                      className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded-md text-xs hover:bg-blue-600"
                      title="Ver produto"
                    >
                      👁️ Ver
                    </button>
                    
                    <button
                      onClick={() => {/* TODO: Implementar edição */}}
                      className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1.5 rounded-md text-xs hover:bg-yellow-600"
                      title="Editar campanha"
                    >
                      ✏️ Editar
                    </button>
                    
                    {(campaign.status === 'expired' || campaign.status === 'rejected') && (
                      <button
                        onClick={() => handleArchive(campaign.id)}
                        className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1.5 rounded-md text-xs hover:bg-gray-600"
                        title="Arquivar campanha"
                      >
                        📁 Arquivar
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-md text-xs hover:bg-red-700"
                      title="Excluir campanha"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de ação */}
      {showModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {modalAction === 'approve' ? 'Aprovar Campanha' : 'Rejeitar Campanha'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Mensagem para o jornaleiro:
                </label>
                <textarea
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Mensagem opcional..."
                />
              </div>

              {modalAction === 'reject' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Motivo da rejeição: *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    rows={3}
                    placeholder="Explique o motivo da rejeição..."
                    required
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={submitAction}
                disabled={modalAction === 'reject' && !rejectionReason.trim()}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

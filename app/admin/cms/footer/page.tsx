"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ToastProvider";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type FooterLink = {
  id: string;
  text: string;
  url: string;
  section: 'institucional' | 'para_voce' | 'para_jornaleiro' | 'atalhos';
  order: number;
  active: boolean;
};

type FooterData = {
  title: string;
  description: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  links: FooterLink[];
};

const SECTION_LABELS = {
  institucional: 'Institucional',
  para_voce: 'Para você',
  para_jornaleiro: 'Para o Jornaleiro',
  atalhos: 'Atalhos'
};

function SummaryCard({
  title,
  value,
  helper,
}: {
  title: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{helper}</div>
    </div>
  );
}

export default function FooterManagement() {
  const [footerData, setFooterData] = useState<FooterData>({
    title: 'Guia das Bancas',
    description: 'Conectamos você às melhores bancas da sua região. Descubra produtos, ofertas e o jornaleiro mais próximo.',
    socialLinks: {},
    links: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'links' | 'social'>('general');
  const [editingLink, setEditingLink] = useState<FooterLink | null>(null);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const { show } = useToast();

  // Carregar dados do footer
  useEffect(() => {
    loadFooterData();
  }, []);

  const loadFooterData = async () => {
    try {
      setLoading(true);
      const response = await fetchAdminWithDevFallback('/api/admin/footer');
      if (response.ok) {
        const data = await response.json();
        setFooterData(data);
      }
    } catch (error) {
      console.error('Erro ao carregar footer:', error);
      show(<span className="text-red-600">Erro ao carregar dados do footer</span>);
    } finally {
      setLoading(false);
    }
  };

  const saveFooterData = async () => {
    try {
      setSaving(true);
      const response = await fetchAdminWithDevFallback('/api/admin/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(footerData)
      });

      if (response.ok) {
        show(<span className="text-green-600">Footer atualizado com sucesso!</span>);
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch (error) {
      console.error('Erro ao salvar footer:', error);
      show(<span className="text-red-600">Erro ao salvar footer</span>);
    } finally {
      setSaving(false);
    }
  };

  const handleLinkSubmit = (link: FooterLink) => {
    if (editingLink) {
      // Editar link existente
      setFooterData(prev => ({
        ...prev,
        links: prev.links.map(l => l.id === link.id ? link : l)
      }));
    } else {
      // Adicionar novo link
      const newLink = {
        ...link,
        id: Date.now().toString(),
        order: footerData.links.filter(l => l.section === link.section).length + 1
      };
      setFooterData(prev => ({
        ...prev,
        links: [...prev.links, newLink]
      }));
    }
    setEditingLink(null);
    setShowLinkForm(false);
  };

  const deleteLink = (linkId: string) => {
    if (confirm('Tem certeza que deseja excluir este link?')) {
      setFooterData(prev => ({
        ...prev,
        links: prev.links.filter(l => l.id !== linkId)
      }));
    }
  };

  const LinkForm = ({ link, onSubmit, onCancel }: {
    link?: FooterLink;
    onSubmit: (link: FooterLink) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState<FooterLink>(
      link || {
        id: '',
        text: '',
        url: '',
        section: 'institucional',
        order: 1,
        active: true
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.text.trim() || !formData.url.trim()) {
        show(<span className="text-red-600">Preencha todos os campos obrigatórios</span>);
        return;
      }
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-4">
            {link ? 'Editar Link' : 'Adicionar Link'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Texto do Link *</label>
              <input
                type="text"
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Ex: Sobre nós"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">URL *</label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Ex: /sobre-nos"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Seção</label>
              <select
                value={formData.section}
                onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value as any }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {Object.entries(SECTION_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="active" className="text-sm">Link ativo</label>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 bg-[#ff5c00] text-white py-2 px-4 rounded-md hover:bg-[#ff7a33]"
              >
                {link ? 'Salvar' : 'Adicionar'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const activeLinks = footerData.links.filter((link) => link.active).length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestão do Footer</h1>
        <p className="text-gray-600">Configure o conteúdo do rodapé do site</p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Links" value={footerData.links.length} helper="Inventário total do rodapé." />
        <SummaryCard title="Ativos" value={activeLinks} helper="Links atualmente expostos ao usuário." />
        <SummaryCard title="Seções" value={Object.keys(SECTION_LABELS).length} helper="Blocos editoriais suportados." />
        <SummaryCard title="Marca" value={footerData.title} helper="Assinatura institucional no footer." />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { key: 'general', label: 'Informações Gerais', icon: '📝' },
            { key: 'links', label: 'Links do Menu', icon: '🔗' },
            { key: 'social', label: 'Redes Sociais', icon: '📱' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-[#ff5c00] text-[#ff5c00]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Informações Gerais</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input
                  type="text"
                  value={footerData.title}
                  onChange={(e) => setFooterData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  value={footerData.description}
                  onChange={(e) => setFooterData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'social' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Redes Sociais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'instagram', label: 'Instagram', icon: '📷' },
                { key: 'facebook', label: 'Facebook', icon: '👥' },
                { key: 'twitter', label: 'Twitter/X', icon: '🐦' },
                { key: 'youtube', label: 'YouTube', icon: '📺' }
              ].map(social => (
                <div key={social.key}>
                  <label className="block text-sm font-medium mb-1">
                    {social.icon} {social.label}
                  </label>
                  <input
                    type="url"
                    value={footerData.socialLinks[social.key as keyof typeof footerData.socialLinks] || ''}
                    onChange={(e) => setFooterData(prev => ({
                      ...prev,
                      socialLinks: {
                        ...prev.socialLinks,
                        [social.key]: e.target.value
                      }
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder={`https://${social.key}.com/...`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'links' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Links do Menu</h2>
              <button
                onClick={() => setShowLinkForm(true)}
                className="bg-[#ff5c00] text-white px-4 py-2 rounded-md hover:bg-[#ff7a33]"
              >
                + Adicionar Link
              </button>
            </div>

            {Object.entries(SECTION_LABELS).map(([sectionKey, sectionLabel]) => {
              const sectionLinks = footerData.links.filter(link => link.section === sectionKey);
              
              return (
                <div key={sectionKey} className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">{sectionLabel}</h3>
                  
                  {sectionLinks.length === 0 ? (
                    <p className="text-gray-500 text-sm">Nenhum link nesta seção</p>
                  ) : (
                    <div className="space-y-2">
                      {sectionLinks.map(link => (
                        <div key={link.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${link.active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                              <span className="font-medium">{link.text}</span>
                            </div>
                            <span className="text-sm text-gray-600">{link.url}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingLink(link);
                                setShowLinkForm(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => deleteLink(link.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Botão Salvar */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={saveFooterData}
          disabled={saving}
          className="bg-[#ff5c00] text-white px-6 py-2 rounded-md hover:bg-[#ff7a33] disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      {/* Modal do formulário de link */}
      {showLinkForm && (
        <LinkForm
          link={editingLink || undefined}
          onSubmit={handleLinkSubmit}
          onCancel={() => {
            setShowLinkForm(false);
            setEditingLink(null);
          }}
        />
      )}
    </div>
  );
}

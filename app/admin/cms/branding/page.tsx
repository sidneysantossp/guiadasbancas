"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/admin/ToastProvider";
import ImageUploader from "@/components/admin/ImageUploader";

interface BrandingConfig {
  logoUrl: string;
  logoAlt: string;
  siteName: string;
  primaryColor: string;
  secondaryColor: string;
  favicon: string;
  socialInstagram: string;
  socialFacebook: string;
  socialYoutube: string;
  socialLinkedin: string;
}

export default function BrandingPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<BrandingConfig>({
    logoUrl: "",
    logoAlt: "Guia das Bancas",
    siteName: "Guia das Bancas",
    primaryColor: "#ff5c00",
    secondaryColor: "#ff7a33",
    favicon: "/favicon.svg",
    socialInstagram: "",
    socialFacebook: "",
    socialYoutube: "",
    socialLinkedin: ""
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/branding');
      const result = await response.json();
      
      if (result.success) {
        setConfig(prev => ({
          ...prev,
          ...result.data,
          socialInstagram: result.data?.socialInstagram ?? "",
          socialFacebook: result.data?.socialFacebook ?? "",
          socialYoutube: result.data?.socialYoutube ?? "",
          socialLinkedin: result.data?.socialLinkedin ?? "",
        }));
      } else {
        toast.error("Erro ao carregar configurações");
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      toast.error("Erro ao carregar configurações");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const response = await fetch('/api/admin/branding', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify({ data: config })
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Configurações salvas com sucesso!");
        // Recarregar a página para aplicar as mudanças
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(result.error || "Erro ao salvar configurações");
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (files: File[], previews: string[]) => {
    try {
      if (!files || files.length === 0) return;
      const fd = new FormData();
      fd.append('file', files[0]);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer admin-token',
        },
        body: fd,
      });
      const json = await res.json();
      if (res.ok && json.ok && json.url) {
        setConfig(prev => ({ ...prev, logoUrl: json.url }));
        toast.success('Logo enviada com sucesso');
      } else {
        setConfig(prev => ({ ...prev, logoUrl: previews[0] || prev.logoUrl }));
        toast.error(json.error || 'Falha ao enviar logo');
      }
    } catch (e) {
      setConfig(prev => ({ ...prev, logoUrl: previews[0] || prev.logoUrl }));
      toast.error('Erro ao enviar logo');
    }
  };

  const handleFaviconUpload = async (files: File[], previews: string[]) => {
    try {
      if (!files || files.length === 0) return;
      const fd = new FormData();
      fd.append('file', files[0]);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer admin-token',
        },
        body: fd,
      });
      const json = await res.json();
      if (res.ok && json.ok && json.url) {
        setConfig(prev => ({ ...prev, favicon: json.url }));
        toast.success('Favicon enviada com sucesso');
      } else {
        setConfig(prev => ({ ...prev, favicon: previews[0] || prev.favicon }));
        toast.error(json.error || 'Falha ao enviar favicon');
      }
    } catch (e) {
      setConfig(prev => ({ ...prev, favicon: previews[0] || prev.favicon }));
      toast.error('Erro ao enviar favicon');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#ff5c00] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Identidade Visual</h1>
        <p className="text-gray-600 mt-1">Configure a logo, cores e identidade visual do site</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        
        {/* Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo do Site
          </label>
          <ImageUploader
            multiple={false}
            max={1}
            value={config.logoUrl ? [config.logoUrl] : []}
            onChange={handleLogoUpload}
          />
          <p className="text-xs text-gray-500 mt-1">
            Recomendado: 200x60px, formato PNG ou SVG, fundo transparente
          </p>
          
          {/* Preview da Logo */}
          {config.logoUrl && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Preview:</p>
              <img 
                src={config.logoUrl} 
                alt={config.logoAlt}
                className="h-8 max-w-[200px] object-contain"
              />
            </div>
          )}
        </div>

        {/* Alt Text da Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Texto Alternativo da Logo
          </label>
          <input
            type="text"
            value={config.logoAlt}
            onChange={(e) => setConfig(prev => ({ ...prev, logoAlt: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff5c00] focus:border-[#ff5c00]"
            placeholder="Guia das Bancas"
          />
          <p className="text-xs text-gray-500 mt-1">
            Texto que aparece quando a imagem não carrega (importante para acessibilidade)
          </p>
        </div>

        {/* Nome do Site */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Site
          </label>
          <input
            type="text"
            value={config.siteName}
            onChange={(e) => setConfig(prev => ({ ...prev, siteName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff5c00] focus:border-[#ff5c00]"
            placeholder="Guia das Bancas"
          />
          <p className="text-xs text-gray-500 mt-1">
            Nome que aparece no título das páginas e metadados
          </p>
        </div>

        {/* Cores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor Primária
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.primaryColor}
                onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff5c00] focus:border-[#ff5c00]"
                placeholder="#ff5c00"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Cor principal do site (botões, links, destaques)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor Secundária
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={config.secondaryColor}
                onChange={(e) => setConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.secondaryColor}
                onChange={(e) => setConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff5c00] focus:border-[#ff5c00]"
                placeholder="#ff7a33"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Cor secundária (gradientes, hovers, variações)
            </p>
          </div>
        </div>

        {/* Favicon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Favicon
          </label>
          <ImageUploader
            multiple={false}
            max={1}
            value={config.favicon ? [config.favicon] : []}
            onChange={handleFaviconUpload}
          />
          <p className="text-xs text-gray-500 mt-1">
            Ícone que aparece na aba do navegador. Recomendado: 32x32px, formato ICO ou PNG
          </p>
        </div>

        {/* Redes Sociais */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Redes sociais (links oficiais)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
              <input
                type="url"
                value={config.socialInstagram}
                onChange={(e) => setConfig((prev) => ({ ...prev, socialInstagram: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff5c00] focus:border-[#ff5c00]"
                placeholder="https://instagram.com/guiadasbancas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
              <input
                type="url"
                value={config.socialFacebook}
                onChange={(e) => setConfig((prev) => ({ ...prev, socialFacebook: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff5c00] focus:border-[#ff5c00]"
                placeholder="https://facebook.com/guiadasbancas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
              <input
                type="url"
                value={config.socialYoutube}
                onChange={(e) => setConfig((prev) => ({ ...prev, socialYoutube: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff5c00] focus:border-[#ff5c00]"
                placeholder="https://youtube.com/@guiadasbancas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
              <input
                type="url"
                value={config.socialLinkedin}
                onChange={(e) => setConfig((prev) => ({ ...prev, socialLinkedin: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff5c00] focus:border-[#ff5c00]"
                placeholder="https://linkedin.com/company/guiadasbancas"
              />
            </div>
          </div>
        </div>

        {/* Preview das Cores */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Preview das Cores</h3>
          <div className="flex gap-4">
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-lg shadow-sm border border-gray-200"
                style={{ backgroundColor: config.primaryColor }}
              ></div>
              <p className="text-xs text-gray-600 mt-1">Primária</p>
            </div>
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-lg shadow-sm border border-gray-200"
                style={{ backgroundColor: config.secondaryColor }}
              ></div>
              <p className="text-xs text-gray-600 mt-1">Secundária</p>
            </div>
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-lg shadow-sm border border-gray-200"
                style={{ 
                  background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`
                }}
              ></div>
              <p className="text-xs text-gray-600 mt-1">Gradiente</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-[#ff5c00] text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Salvando...
              </>
            ) : (
              "Salvar Configurações"
            )}
          </button>
          <button
            onClick={loadConfig}
            disabled={saving}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Restaurar
          </button>
        </div>
      </div>
    </div>
  );
}

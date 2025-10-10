"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type VendorBanner = {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  button_text: string;
  button_link: string;
  image_url: string;
  active: boolean;
};

export default function VendorBannerAdminPage() {
  const [mounted, setMounted] = useState(false);
  const [banner, setBanner] = useState<VendorBanner>({
    title: "É jornaleiro?",
    subtitle: "Registre sua banca agora",
    description: "Anuncie seus produtos, receba pedidos pelo WhatsApp e alcance clientes perto de você com o Guia das Bancas.",
    button_text: "Quero me cadastrar",
    button_link: "/jornaleiro/registrar",
    image_url: "https://images.unsplash.com/photo-1521334726092-b509a19597d6?q=80&w=1600&auto=format&fit=crop",
    active: true
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    loadBanner();
  }, []);

  const loadBanner = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/vendor-banner', {
        headers: { 'Authorization': 'Bearer admin-token' }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setBanner(result.data);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar banner:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveBanner = async () => {
    console.log('🚀 Iniciando saveBanner...');
    
    try {
      setSaving(true);
      console.log('📝 Dados do banner:', JSON.stringify(banner, null, 2));
      console.log('🖼️ URL da imagem específica:', banner.image_url);
      console.log('📏 Tamanho da URL:', banner.image_url?.length);
      console.log('🔍 Tipo da URL:', typeof banner.image_url);
      
      // Timeout de 5 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏰ TIMEOUT! Cancelando requisição...');
        controller.abort();
      }, 5000);
      
      console.log('📡 Fazendo requisição com timeout de 5s...');
      const response = await fetch('/api/admin/vendor-banner', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify(banner),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('📨 Response recebida - Status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('📊 Result:', result);
      
      if (result.success === true) {
        console.log('🎉 SUCESSO!');
        setMessage({ type: 'success', text: result.message || 'Banner salvo com sucesso!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Erro ao salvar' });
      }
    } catch (error: any) {
      console.error('💥 ERRO:', error);
      
      if (error.name === 'AbortError') {
        setMessage({ type: 'error', text: 'Timeout: Operação cancelada (5s)' });
      } else {
        setMessage({ type: 'error', text: `Erro: ${error.message}` });
      }
    } finally {
      console.log('🏁 setSaving(false)');
      setSaving(false);
    }
  };

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer admin-token' },
        body: formData
      });
      
      const result = await response.json();
      if (result.ok && result.url) {
        setBanner(prev => ({ ...prev, image_url: result.url }));
        setMessage({ type: 'success', text: 'Imagem enviada com sucesso!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Erro ao enviar imagem' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao enviar imagem' });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      uploadImage(file);
    }
  };

  // Não renderizar até estar montado (evita hidratação)
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5c00]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Banner do Jornaleiro</h1>
        <p className="text-gray-600">Configure o banner promocional que aparece na parte inferior da home</p>
      </div>

      {/* Mensagem */}
      {message && (
        <div className={`rounded-md p-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Preview */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Preview</h2>
        <div className="w-full max-w-4xl mx-auto">
          <div className="relative w-full overflow-hidden rounded-2xl shadow-lg">
            <div className="relative h-96 sm:h-64 md:h-72 w-full">
              {(() => {
                // Verificar se é uma URL válida de imagem
                const isValidImageUrl = mounted && banner.image_url && 
                  (banner.image_url.startsWith('https://') || banner.image_url.startsWith('http://')) &&
                  banner.image_url.length > 15 &&
                  (banner.image_url.includes('.jpg') || banner.image_url.includes('.jpeg') || 
                   banner.image_url.includes('.png') || banner.image_url.includes('.webp') ||
                   banner.image_url.includes('unsplash.com') || banner.image_url.includes('picsum.photos'));
                
                if (isValidImageUrl) {
                  return (
                    <div className="relative w-full h-full">
                      <Image
                        src={banner.image_url}
                        alt={banner.title}
                        fill
                        className="object-cover object-[100%_0%] sm:object-[100%_30%]"
                        unoptimized={true}
                        onLoad={() => console.log('✅ Imagem carregada:', banner.image_url)}
                        onError={() => console.log('❌ Erro ao carregar imagem:', banner.image_url)}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="text-center px-4">
                        <span className="text-gray-500 block mb-2">
                          {banner.image_url && banner.image_url.length > 0 
                            ? `Digitando... (${banner.image_url?.length || 0} chars)`
                            : 'Cole uma URL de imagem para preview'
                          }
                        </span>
                        {banner.image_url && banner.image_url.length > 10 && (
                          <span className="text-xs text-gray-400 break-all">
                            {banner.image_url.substring(0, 50)}...
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }
              })()}
              <div className="absolute inset-0 bg-gradient-to-b from-black/45 to-black/25 px-3 sm:px-5 md:px-8 text-white flex flex-col items-start justify-end md:justify-center gap-2 sm:gap-3 pb-6 sm:pb-6 md:pb-8">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
                  {banner.title}
                </h3>
                <div className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight">
                  {banner.subtitle}
                </div>
                <p className="text-sm sm:text-base max-w-2xl opacity-90">
                  {banner.description}
                </p>
                {banner.active && (
                  <div className="inline-flex items-center justify-center rounded-md bg-white text-[#ff5c00] text-sm font-semibold px-4 py-2 shadow">
                    {banner.button_text}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Configurações</h2>
        
        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={banner.active}
              onChange={(e) => setBanner(prev => ({ ...prev, active: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">
              Banner ativo
            </label>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título Principal
            </label>
            <input
              type="text"
              value={banner.title}
              onChange={(e) => setBanner(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="É jornaleiro?"
            />
          </div>

          {/* Subtítulo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtítulo
            </label>
            <input
              type="text"
              value={banner.subtitle}
              onChange={(e) => setBanner(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Registre sua banca agora"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={banner.description}
              onChange={(e) => setBanner(prev => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              rows={3}
              placeholder="Anuncie seus produtos, receba pedidos pelo WhatsApp..."
            />
          </div>

          {/* Botão */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto do Botão
              </label>
              <input
                type="text"
                value={banner.button_text}
                onChange={(e) => setBanner(prev => ({ ...prev, button_text: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Quero me cadastrar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link do Botão
              </label>
              <input
                type="text"
                value={banner.button_link}
                onChange={(e) => setBanner(prev => ({ ...prev, button_link: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="/jornaleiro/registrar"
              />
            </div>
          </div>

          {/* Upload de Imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagem de Fundo
            </label>
            <input
              type="text"
              value={banner.image_url}
              onChange={(e) => setBanner(prev => ({ ...prev, image_url: e.target.value }))}
              className={`w-full rounded-md border px-3 py-2 text-sm mb-2 transition-colors ${
                banner.image_url && banner.image_url.startsWith('http') && banner.image_url.length > 15
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-300'
              }`}
              placeholder="Cole aqui: https://images.unsplash.com/photo-..."
            />
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-500">
                💡 Cole uma URL de imagem (jpg, png, webp)
              </span>
              {mounted && (
                <span className={`${
                  banner.image_url && banner.image_url.startsWith('http') && banner.image_url.length > 15
                    ? 'text-green-600' 
                    : 'text-gray-400'
                }`}>
                  {banner.image_url?.length || 0} chars
                </span>
              )}
            </div>
            
            {/* URLs de exemplo */}
            <div className="mb-2">
              <p className="text-xs text-gray-500 mb-1">🎯 URLs de exemplo (clique para usar):</p>
              <div className="flex flex-wrap gap-1">
                {[
                  'https://images.unsplash.com/photo-1521334726092-b509a19597d6?q=80&w=1600',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600',
                  'https://picsum.photos/800/400'
                ].map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setBanner(prev => ({ ...prev, image_url: url }))}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Exemplo {index + 1}
                  </button>
                ))}
              </div>
            </div>
            
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                dragOver ? 'border-[#ff5c00] bg-orange-50' : 'border-gray-300 bg-gray-50'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {uploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#ff5c00]"></div>
                  <span className="text-sm text-gray-600">Enviando...</span>
                </div>
              ) : (
                <>
                  <div className="text-sm text-gray-600 mb-2">
                    Arraste e solte uma imagem aqui, ou clique para selecionar
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    id="banner-image"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadImage(file);
                    }}
                  />
                  <label
                    htmlFor="banner-image"
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-gray-50 cursor-pointer"
                  >
                    Selecionar arquivo
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="pt-4 flex items-center gap-3">
            <button
              onClick={saveBanner}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              {saving ? 'Salvando...' : 'Salvar Banner'}
            </button>
            
            {saving && (
              <button
                onClick={() => {
                  setSaving(false);
                  setMessage({ type: 'error', text: 'Operação cancelada pelo usuário' });
                }}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

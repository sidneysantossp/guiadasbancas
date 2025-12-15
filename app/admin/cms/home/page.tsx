"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type HeroSlide = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  gradientFrom: string;
  gradientTo: string;
  cta1Text: string;
  cta1Link: string;
  cta1Style: "primary" | "outline";
  cta2Text: string;
  cta2Link: string;
  cta2Style: "primary" | "outline";
  active: boolean;
  order: number;
};

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    title: "Sua banca favorita\nagora delivery",
    description: "Jornais, revistas, papelaria, snacks e muito mais direto da sua banca de confiança.",
    imageUrl: "https://images.unsplash.com/photo-1521334726092-b509a19597d6?q=80&w=1600&auto=format&fit=crop",
    imageAlt: "Banca de jornal com revistas e jornais ao fundo",
    gradientFrom: "#ff7a33",
    gradientTo: "#e64a00",
    cta1Text: "Peça agora",
    cta1Link: "/bancas-perto-de-mim",
    cta1Style: "primary",
    cta2Text: "Sou jornaleiro",
    cta2Link: "/jornaleiro",
    cta2Style: "outline",
    active: true,
    order: 1
  },
  {
    id: "slide-2",
    title: "Revistas, jornais\ne colecionáveis",
    description: "Encontre os lançamentos e clássicos nas bancas mais próximas de você.",
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
    imageAlt: "Pilha de revistas coloridas",
    gradientFrom: "#ffa366",
    gradientTo: "#ff5c00",
    cta1Text: "Ver departamentos",
    cta1Link: "/departamentos",
    cta1Style: "primary",
    cta2Text: "Bancas próximas",
    cta2Link: "/bancas-perto-de-mim",
    cta2Style: "outline",
    active: true,
    order: 2
  },
  {
    id: "slide-3",
    title: "Tudo de conveniência\nem poucos cliques",
    description: "Bebidas, snacks, pilhas, papelaria e recargas com entrega rápida.",
    imageUrl: "https://images.unsplash.com/photo-1601050690597-9b614fb3a3e7?q=80&w=1600&auto=format&fit=crop",
    imageAlt: "Loja de conveniência com prateleiras e bebidas",
    gradientFrom: "#ffd6c2",
    gradientTo: "#ff5c00",
    cta1Text: "Explorar agora",
    cta1Link: "/bancas-perto-de-mim",
    cta1Style: "primary",
    cta2Text: "Como funciona",
    cta2Link: "/minha-conta",
    cta2Style: "outline",
    active: true,
    order: 3
  }
];

export default function AdminHomePageCMS() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Configurações globais do slider
  const [sliderConfig, setSliderConfig] = useState({
    autoPlayTime: 6000,
    transitionSpeed: 600,
    showArrows: true,
    showDots: true,
    heightDesktop: 520,
    heightMobile: 360
  });

  useEffect(() => {
    loadSlides();
    loadSliderConfig();
  }, []);

  const loadSlides = async () => {
    try {
      // Cache-busting para forçar reload
      const timestamp = Date.now();
      console.log('[CMS Home] loadSlides chamado - timestamp:', timestamp);
      const response = await fetch(`/api/admin/hero-slides?admin=true&_t=${timestamp}`, {
        headers: {
          'Authorization': 'Bearer admin-token'
        },
        cache: 'no-store'
      });
      
      console.log('[CMS Home] loadSlides response status:', response.status);
      if (response.ok) {
        const result = await response.json();
        console.log('[CMS Home] loadSlides result:', result);
        if (result.success) {
          console.log('[CMS Home] Atualizando slides com:', result.data);
          setSlides(result.data || DEFAULT_SLIDES);
        } else {
          console.warn('[CMS Home] loadSlides sem sucesso, usando DEFAULT_SLIDES');
          setSlides(DEFAULT_SLIDES);
        }
      } else {
        console.error('[CMS Home] loadSlides response não ok:', response.status);
        setSlides(DEFAULT_SLIDES);
      }
    } catch (error) {
      console.error('[CMS Home] loadSlides exception:', error);
      setSlides(DEFAULT_SLIDES);
    }
  };

  const loadSliderConfig = async () => {
    try {
      const response = await fetch('/api/admin/hero-slides?type=config', {
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSliderConfig(result.data);
        }
      }
    } catch {}
  };

  const saveSlides = async (newSlides: HeroSlide[]) => {
    setSaving(true);
    console.log('[CMS Home] Salvando slides:', newSlides);
    try {
      const response = await fetch('/api/admin/hero-slides', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify({
          type: 'bulk',
          data: newSlides
        })
      });

      console.log('[CMS Home] Response status:', response.status);
      const result = await response.json();
      console.log('[CMS Home] Response result:', result);
      
      if (result.success) {
        setSlides(newSlides);
        setMessage({ type: 'success', text: 'Slides salvos com sucesso!' });
        setTimeout(() => setMessage(null), 3000);
        // Recarregar slides do servidor para garantir sincronização
        await loadSlides();
      } else {
        console.error('[CMS Home] Erro ao salvar:', result.error);
        setMessage({ type: 'error', text: result.error || 'Erro ao salvar slides' });
      }
    } catch (error) {
      console.error('[CMS Home] Exception ao salvar:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar slides' });
    } finally {
      setSaving(false);
    }
  };

  const saveSliderConfig = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/hero-slides', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify({
          type: 'config',
          data: sliderConfig
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Erro ao salvar configurações' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao salvar configurações' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSlide = async (slide: HeroSlide) => {
    console.log('[CMS Home] handleSaveSlide chamado com:', slide);
    console.log('[CMS Home] editingSlide:', editingSlide);
    const newSlides = editingSlide 
      ? slides.map(s => s.id === slide.id ? slide : s)
      : [...slides, { ...slide, id: `slide-${Date.now()}`, order: slides.length + 1 }];
    
    console.log('[CMS Home] newSlides gerado:', newSlides);
    await saveSlides(newSlides);
    console.log('[CMS Home] Salvamento concluído, fechando modal');
    setEditingSlide(null);
    setShowForm(false);
  };

  const handleDeleteSlide = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este slide?')) {
      const newSlides = slides.filter(s => s.id !== id);
      saveSlides(newSlides);
    }
  };

  const handleToggleActive = (id: string) => {
    const newSlides = slides.map(s => 
      s.id === id ? { ...s, active: !s.active } : s
    );
    saveSlides(newSlides);
  };

  const moveSlide = (id: string, direction: 'up' | 'down') => {
    const currentIndex = slides.findIndex(s => s.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === slides.length - 1)
    ) return;

    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    [newSlides[currentIndex], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[currentIndex]];
    
    // Atualizar ordem
    newSlides.forEach((slide, index) => {
      slide.order = index + 1;
    });

    saveSlides(newSlides);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão da Home Page</h1>
          <p className="text-gray-600">Configure o slider principal e outras seções da página inicial</p>
        </div>
        <button
          onClick={() => {
            setEditingSlide(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Novo Slide
        </button>
      </div>

      {/* Mensagem */}
      {message && (
        <div className={`rounded-md p-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Configurações Globais */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Configurações do Slider</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auto-play (segundos)
            </label>
            <input
              type="number"
              min="3"
              max="10"
              value={sliderConfig.autoPlayTime / 1000}
              onChange={(e) => setSliderConfig(prev => ({ 
                ...prev, 
                autoPlayTime: parseInt(e.target.value) * 1000 
              }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Velocidade transição (ms)
            </label>
            <input
              type="number"
              min="300"
              max="1000"
              step="100"
              value={sliderConfig.transitionSpeed}
              onChange={(e) => setSliderConfig(prev => ({ 
                ...prev, 
                transitionSpeed: parseInt(e.target.value) 
              }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Altura Desktop (px)
            </label>
            <input
              type="number"
              min="400"
              max="800"
              step="20"
              value={sliderConfig.heightDesktop}
              onChange={(e) => setSliderConfig(prev => ({ 
                ...prev, 
                heightDesktop: parseInt(e.target.value) 
              }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Altura Mobile (px)
            </label>
            <input
              type="number"
              min="300"
              max="500"
              step="20"
              value={sliderConfig.heightMobile}
              onChange={(e) => setSliderConfig(prev => ({ 
                ...prev, 
                heightMobile: parseInt(e.target.value) 
              }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sliderConfig.showArrows}
                onChange={(e) => setSliderConfig(prev => ({ 
                  ...prev, 
                  showArrows: e.target.checked 
                }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Mostrar setas</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sliderConfig.showDots}
                onChange={(e) => setSliderConfig(prev => ({ 
                  ...prev, 
                  showDots: e.target.checked 
                }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Mostrar dots</span>
            </label>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={saveSliderConfig}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            Salvar Configurações
          </button>
        </div>
      </div>

      {/* Lista de Slides */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold">Slides do Hero</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {slides.map((slide, index) => (
            <div key={slide.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-32 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.imageAlt}
                    fill
                    className="object-cover"
                  />
                  <div 
                    className="absolute inset-0 opacity-70 mix-blend-multiply"
                    style={{
                      background: `linear-gradient(to right, ${slide.gradientFrom}, ${slide.gradientTo})`
                    }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {slide.title.replace(/\\n/g, ' ')}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {slide.description}
                      </p>
                      {/* CTA visibility preview */}
                      {(() => {
                        const showCta1 = Boolean(slide?.cta1Text?.trim() && slide?.cta1Link?.trim());
                        const showCta2 = Boolean(slide?.cta2Text?.trim() && slide?.cta2Link?.trim());
                        return (
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {showCta1 ? (
                              <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-medium">
                                Botão 1: {slide.cta1Text}
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-gray-50 text-gray-500 border border-gray-200 px-2.5 py-0.5 text-xs">Botão 1 oculto</span>
                            )}
                            {showCta2 ? (
                              <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-medium">
                                Botão 2: {slide.cta2Text}
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-gray-50 text-gray-500 border border-gray-200 px-2.5 py-0.5 text-xs">Botão 2 oculto</span>
                            )}
                          </div>
                        );
                      })()}
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          slide.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {slide.active ? 'Ativo' : 'Inativo'}
                        </span>
                        <span className="text-xs text-gray-500">Ordem: {slide.order}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveSlide(slide.id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        title="Mover para cima"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 15l-6-6-6 6"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => moveSlide(slide.id, 'down')}
                        disabled={index === slides.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        title="Mover para baixo"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleToggleActive(slide.id)}
                        className={`p-1 ${slide.active ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'}`}
                        title={slide.active ? 'Desativar' : 'Ativar'}
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M8 12l2 2 4-4"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setEditingSlide(slide);
                          setShowForm(true);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Excluir"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {slides.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <svg viewBox="0 0 24 24" className="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
              <p>Nenhum slide cadastrado</p>
              <p className="text-sm">Clique em "Novo Slide" para começar</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Edição */}
      {showForm && (
        <SlideForm
          slide={editingSlide}
          onSave={handleSaveSlide}
          onCancel={() => {
            setShowForm(false);
            setEditingSlide(null);
          }}
        />
      )}
    </div>
  );
}

// Componente do formulário de slide
function SlideForm({ 
  slide, 
  onSave, 
  onCancel 
}: { 
  slide: HeroSlide | null; 
  onSave: (slide: HeroSlide) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState<HeroSlide>(
    slide || {
      id: '',
      title: '',
      description: '',
      imageUrl: '',
      imageAlt: '',
      gradientFrom: '#ff7a33',
      gradientTo: '#e64a00',
      cta1Text: '',
      cta1Link: '',
      cta1Style: 'primary',
      cta2Text: '',
      cta2Link: '',
      cta2Style: 'outline',
      active: true,
      order: 1
    }
  );

  // Estados locais para exibir/ocultar CTAs no formulário
  const [showCta1, setShowCta1] = useState<boolean>(Boolean((slide?.cta1Text || formData.cta1Text || '').trim() && (slide?.cta1Link || formData.cta1Link || '').trim()));
  const [showCta2, setShowCta2] = useState<boolean>(Boolean((slide?.cta2Text || formData.cta2Text || '').trim() && (slide?.cta2Link || formData.cta2Link || '').trim()));
  const [imgUploading, setImgUploading] = useState<boolean>(false);
  const [dragOverMain, setDragOverMain] = useState<boolean>(false);

  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const doUpload = async (file: File) => {
    try {
      setUploadError(null);
      
      // Validar tamanho do arquivo (máximo 4MB para Vercel)
      const maxSize = 4 * 1024 * 1024; // 4MB
      if (file.size > maxSize) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        setUploadError(`Arquivo muito grande (${sizeMB}MB). Máximo permitido: 4MB. Reduza o tamanho da imagem.`);
        return;
      }
      
      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Tipo de arquivo não suportado. Use JPG, PNG, WebP ou GIF.');
        return;
      }
      
      setImgUploading(true);
      console.log('[SlideForm] Iniciando upload de arquivo:', file.name, file.type, file.size);
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { 
        method: 'POST', 
        headers: { 'Authorization': 'Bearer admin-token' }, 
        body: form 
      });
      console.log('[SlideForm] Upload response status:', res.status);
      
      if (res.status === 403) {
        setUploadError('Erro de permissão. Tente reduzir o tamanho da imagem para menos de 4MB.');
        return;
      }
      
      const j = await res.json();
      console.log('[SlideForm] Upload response body:', j);
      if (!res.ok || !j?.ok) {
        setUploadError(j?.error || 'Erro ao fazer upload da imagem.');
        console.error('[SlideForm] Upload falhou:', j?.error || res.statusText);
        return;
      }
      console.log('[SlideForm] Upload sucesso, URL:', j.url);
      setFormData(prev => ({ ...prev, imageUrl: j.url }));
    } catch (error) {
      console.error('[SlideForm] Upload exception:', error);
      setUploadError('Erro inesperado ao fazer upload. Tente novamente.');
    } finally { setImgUploading(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: HeroSlide = { ...formData } as HeroSlide;
    // se toggle estiver desligado, limpar campos para desativar o botão no front
    if (!showCta1) {
      payload.cta1Text = '' as any;
      payload.cta1Link = '' as any;
    }
    if (!showCta2) {
      payload.cta2Text = '' as any;
      payload.cta2Link = '' as any;
    }
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCancel} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {slide ? 'Editar Slide' : 'Novo Slide'}
              </h3>
              <button
                type="button"
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M6 18L18 6"/>
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <textarea
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Use \n para quebra de linha"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  rows={2}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Opcional"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL da Imagem
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
                />
                <div
                  className={`mt-2 border-2 border-dashed rounded-lg p-4 text-center text-sm ${dragOverMain? 'border-[#ff5c00] bg-[#fff6ef]' : 'border-gray-300 bg-gray-50'}`}
                  onDragOver={(e)=>{ e.preventDefault(); setDragOverMain(true); }}
                  onDragLeave={()=>setDragOverMain(false)}
                  onDrop={(e)=>{ e.preventDefault(); setDragOverMain(false); const f=e.dataTransfer.files?.[0]; if (f) doUpload(f); }}
                >
                  {imgUploading ? 'Enviando...' : (
                    <>
                      <div>Arraste e solte uma imagem aqui, ou clique para selecionar.</div>
                      <div className="text-xs text-gray-500 mt-1">Máximo 4MB • JPG, PNG, WebP ou GIF</div>
                      <input type="file" accept="image/*" id="hero-image-file" className="hidden" onChange={(e)=>{ const f=e.target.files?.[0]; if (f) doUpload(f); }} />
                      <label htmlFor="hero-image-file" className="mt-2 inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-gray-50 cursor-pointer">Selecionar arquivo</label>
                    </>
                  )}
                </div>
                {uploadError && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    ⚠️ {uploadError}
                  </div>
                )}
                {formData.imageUrl && (
                  <div className="mt-2 relative h-28 w-full max-w-xl overflow-hidden rounded-lg ring-1 ring-black/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.imageUrl} alt={formData.imageAlt || 'Slide'} className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt da Imagem
                </label>
                <input
                  type="text"
                  value={formData.imageAlt}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageAlt: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Opcional (melhorar acessibilidade/SEO)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gradiente - Cor Inicial
                </label>
                <input
                  type="color"
                  value={formData.gradientFrom}
                  onChange={(e) => setFormData(prev => ({ ...prev, gradientFrom: e.target.value }))}
                  className="w-full h-10 rounded-md border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gradiente - Cor Final
                </label>
                <input
                  type="color"
                  value={formData.gradientTo}
                  onChange={(e) => setFormData(prev => ({ ...prev, gradientTo: e.target.value }))}
                  className="w-full h-10 rounded-md border border-gray-300"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-1">
                  <input type="checkbox" className="rounded border-gray-300" checked={showCta1} onChange={(e)=>setShowCta1(e.target.checked)} />
                  <span className="text-sm font-medium text-gray-700">Exibir Botão 1</span>
                </label>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Botão 1 - Texto
                </label>
                <input
                  type="text"
                  value={formData.cta1Text}
                  onChange={(e) => setFormData(prev => ({ ...prev, cta1Text: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Deixe vazio para desativar o Botão 1"
                  disabled={!showCta1}
                />
                <p className="mt-1 text-xs text-gray-500">Deixe em branco para desativar o Botão 1.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Botão 1 - Link
                </label>
                <input
                  type="text"
                  value={formData.cta1Link}
                  onChange={(e) => setFormData(prev => ({ ...prev, cta1Link: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="/caminho ou deixe vazio para desativar"
                  disabled={!showCta1}
                />
                <p className="mt-1 text-xs text-gray-500">Se o link ficar vazio, o Botão 1 será ocultado.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Botão 1 - Estilo
                </label>
                <select
                  value={formData.cta1Style}
                  onChange={(e) => setFormData(prev => ({ ...prev, cta1Style: e.target.value as 'primary' | 'outline' }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  disabled={!showCta1}
                >
                  <option value="primary">Primário</option>
                  <option value="outline">Outline</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 mb-1">
                  <input type="checkbox" className="rounded border-gray-300" checked={showCta2} onChange={(e)=>setShowCta2(e.target.checked)} />
                  <span className="text-sm font-medium text-gray-700">Exibir Botão 2</span>
                </label>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Botão 2 - Texto
                </label>
                <input
                  type="text"
                  value={formData.cta2Text}
                  onChange={(e) => setFormData(prev => ({ ...prev, cta2Text: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Deixe vazio para desativar o Botão 2"
                  disabled={!showCta2}
                />
                <p className="mt-1 text-xs text-gray-500">Deixe em branco para desativar o Botão 2.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Botão 2 - Link
                </label>
                <input
                  type="text"
                  value={formData.cta2Link}
                  onChange={(e) => setFormData(prev => ({ ...prev, cta2Link: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="/caminho ou deixe vazio para desativar"
                  disabled={!showCta2}
                />
                <p className="mt-1 text-xs text-gray-500">Se o link ficar vazio, o Botão 2 será ocultado.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Botão 2 - Estilo
                </label>
                <select
                  value={formData.cta2Style}
                  onChange={(e) => setFormData(prev => ({ ...prev, cta2Style: e.target.value as 'primary' | 'outline' }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  disabled={!showCta2}
                >
                  <option value="primary">Primário</option>
                  <option value="outline">Outline</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Slide ativo</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-[#ff5c00] rounded-md hover:opacity-90"
              >
                {slide ? 'Atualizar' : 'Criar'} Slide
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

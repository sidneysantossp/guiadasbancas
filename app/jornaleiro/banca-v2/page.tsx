'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import ImageUploader from '@/components/admin/ImageUploader';
import FileUploadDragDrop from '@/components/common/FileUploadDragDrop';
import { IconUser, IconBuildingStore, IconClock, IconBrandWhatsapp, IconBuilding } from '@tabler/icons-react';
import CotistaSearch from '@/components/CotistaSearch';

// Constantes auxiliares
const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
];
const DAYS = [
  { key: 'sun', label: 'Domingo' },
  { key: 'mon', label: 'Segunda' },
  { key: 'tue', label: 'Terça' },
  { key: 'wed', label: 'Quarta' },
  { key: 'thu', label: 'Quinta' },
  { key: 'fri', label: 'Sexta' },
  { key: 'sat', label: 'Sábado' },
] as const;
const PAYMENT_OPTIONS = [
  { value: 'pix', label: 'Pix' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'credito', label: 'Cartão de crédito' },
  { value: 'debito', label: 'Cartão de débito' },
  { value: 'online', label: 'Pagamento online' },
] as const;

// Schema de validação (aninhado, compatível com a API)
const bancaSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  tpu_url: z.string().optional(),
  contact: z.object({
    whatsapp: z.string().optional(),
  }).default({}),
  socials: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    gmb: z.string().optional(),
  }).default({}),
  addressObj: z.object({
    cep: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    uf: z.string().optional(),
    complement: z.string().optional(),
  }).default({}),
  payments: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  hours: z.array(z.object({
    key: z.string(),
    label: z.string(),
    open: z.boolean(),
    start: z.string(),
    end: z.string(),
  })).default([]),
  featured: z.boolean().default(false),
  ctaUrl: z.string().optional(),
  delivery_enabled: z.boolean().default(false),
  free_shipping_threshold: z.number().default(120),
  origin_cep: z.string().optional(),
  location: z.object({
    lat: z.number().optional(),
    lng: z.number().optional(),
  }).default({}),
  profile: z.object({
    full_name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    cpf: z.string().optional(),
    avatar_url: z.string().optional(),
  }).default({}),
});

type BancaFormData = z.infer<typeof bancaSchema>;

export default function BancaV2Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formKey, setFormKey] = useState<number>(() => Date.now());
  const nameRef = useRef<HTMLInputElement | null>(null);
  const sellerNameRef = useRef<HTMLInputElement | null>(null);
  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [avatarImages, setAvatarImages] = useState<string[]>([]);
  const [imagesChanged, setImagesChanged] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'jornaleiro' | 'banca' | 'func' | 'social'>('jornaleiro');
  const [isCotista, setIsCotista] = useState(false);
  const [selectedCotista, setSelectedCotista] = useState<any>(null);

  const withCacheBust = (url?: string, seed?: number | string) => {
    if (!url) return '';
    const s = typeof seed !== 'undefined' ? seed : Date.now();
    return url.includes('?') ? `${url}&v=${s}` : `${url}?v=${s}`;
  };

  const stripHtml = (html?: string) => {
    if (!html) return '';
    if (typeof window === 'undefined') return String(html).replace(/<[^>]*>/g, ' ');
    const div = document.createElement('div');
    div.innerHTML = String(html);
    return (div.textContent || div.innerText || '').trim();
  };

  // React Query - buscar dados da banca
  const { data: bancaData, isLoading, error } = useQuery({
    queryKey: ['banca', session?.user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/jornaleiro/banca?ts=${Date.now()}` , {
        cache: 'no-store',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Erro ao carregar banca');
      const json = await res.json();
      return json.data;
    },
    enabled: status === 'authenticated',
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });

  // React Query - categorias
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories', { cache: 'no-store' });
      const json = await res.json();
      if (!json?.success) return [] as Array<{ id: string; name: string }>;
      return (json.data as any[]).map((c) => ({ id: c.id as string, name: c.name as string }));
    },
    staleTime: 0,
    enabled: status === 'authenticated',
  });

  // React Query - perfil do jornaleiro (usa token do Supabase)
  const { data: profileResp } = useQuery({
    queryKey: ['jornaleiroProfile', authToken],
    queryFn: async () => {
      const res = await fetch('/api/jornaleiro/profile', {
        cache: 'no-store',
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
      if (!res.ok) throw new Error('Erro ao carregar perfil');
      return res.json();
    },
    staleTime: 0,
    enabled: !!authToken && status === 'authenticated',
  });

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<BancaFormData>({
    resolver: zodResolver(bancaSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      tpu_url: '',
      contact: { whatsapp: '' },
      socials: { instagram: '', facebook: '', gmb: '' },
      addressObj: { cep: '', street: '', number: '', neighborhood: '', city: '', uf: '', complement: '' },
      payments: [],
      categories: [],
      hours: DAYS.map((d) => ({ key: d.key, label: d.label, open: false, start: '08:00', end: '18:00' })),
      featured: false,
      ctaUrl: '',
      delivery_enabled: false,
      free_shipping_threshold: 120,
      origin_cep: '',
      location: {},
      profile: { full_name: '', phone: '', email: '', cpf: '', avatar_url: '' },
    } as any,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthToken(data.session?.access_token ?? null);
    }).catch(() => setAuthToken(null));
  }, []);

  // 🔥 CRITICAL: Reset form quando dados da API mudarem (antes da pintura)
  useLayoutEffect(() => {
    if (bancaData) {
      const adr = bancaData.addressObj || {};
      const prof = (profileResp && profileResp.profile) ? profileResp.profile : {};
      const formData = {
        name: bancaData.name || '',
        description: stripHtml(bancaData.description) || '',
        tpu_url: bancaData.tpu_url || '',
        contact: {
          whatsapp: bancaData.contact?.whatsapp || bancaData.whatsapp || '',
        },
        socials: {
          instagram: bancaData.socials?.instagram || bancaData.instagram || '',
          facebook: bancaData.socials?.facebook || bancaData.facebook || '',
          gmb: bancaData.socials?.gmb || '',
        },
        addressObj: {
          cep: adr.cep || bancaData.cep || '',
          street: adr.street || (bancaData.address?.split(',')[0] || ''),
          number: adr.number || '',
          neighborhood: adr.neighborhood || '',
          city: adr.city || (bancaData.address?.split(',')[1]?.trim() || ''),
          uf: adr.uf || '',
          complement: adr.complement || '',
        },
        payments: Array.isArray(bancaData.payments) ? bancaData.payments : (Array.isArray(bancaData.payment_methods) ? bancaData.payment_methods : []),
        categories: Array.isArray(bancaData.categories) ? bancaData.categories : [],
        hours: Array.isArray(bancaData.hours) && bancaData.hours.length > 0
          ? bancaData.hours
          : DAYS.map((d) => ({ key: d.key, label: d.label, open: false, start: '08:00', end: '18:00' })),
        featured: bancaData.featured === true,
        ctaUrl: bancaData.ctaUrl || '',
        delivery_enabled: bancaData.delivery_enabled || false,
        free_shipping_threshold: typeof bancaData.free_shipping_threshold === 'number' ? bancaData.free_shipping_threshold : 120,
        origin_cep: bancaData.origin_cep || '',
        location: {
          lat: typeof bancaData.lat === 'number' ? bancaData.lat : undefined,
          lng: typeof bancaData.lng === 'number' ? bancaData.lng : undefined,
        },
        profile: {
          full_name: prof.full_name || (session?.user?.name || ''),
          phone: prof.phone || '',
          email: session?.user?.email || '',
          cpf: prof.cpf || '',
          avatar_url: prof.avatar_url || '',
        },
      } as any;
      
      console.log('🔄 [V2] Resetando form com novos dados:', formData);
      reset(formData, { keepDirty: false, keepDirtyValues: false, keepValues: false });
      // Imagens
      try {
        const seed = bancaData.updated_at || Date.now();
        const cover = bancaData.cover_image || bancaData.cover || '';
        const avatar = bancaData.profile_image || bancaData.avatar || '';
        setCoverImages(cover ? [withCacheBust(cover, seed)] : []);
        setAvatarImages(avatar ? [withCacheBust(avatar, seed)] : []);
        setImagesChanged(false);
      } catch {}
      
      // Cotista
      try {
        const isCotistaValue = bancaData.is_cotista === true;
        setIsCotista(isCotistaValue);
        if (isCotistaValue && bancaData.cotista_id) {
          setSelectedCotista({
            id: bancaData.cotista_id,
            codigo: bancaData.cotista_codigo || '',
            razao_social: bancaData.cotista_razao_social || '',
            cnpj_cpf: bancaData.cotista_cnpj_cpf || '',
          });
        } else {
          setSelectedCotista(null);
        }
      } catch {}
      // Forçar injeção de valores no DOM após o reset para contornar restauração do browser
      queueMicrotask(() => {
        try {
          setValue('name', formData.name, { shouldDirty: false, shouldTouch: false });
          setValue('tpu_url', formData.tpu_url || '', { shouldDirty: false, shouldTouch: false });
          if (nameRef.current) {
            nameRef.current.value = formData.name;
          }
          setValue('profile.full_name', formData.profile?.full_name || '', { shouldDirty: false, shouldTouch: false });
          if (sellerNameRef.current) {
            sellerNameRef.current.value = formData.profile?.full_name || '';
          }
        } catch {}
      });
      // Reforço adicional por alguns ciclos curtos para derrotar extensões de autofill
      let attempts = 0;
      const maxAttempts = 10;
      const timer = setInterval(() => {
        attempts++;
        const el = nameRef.current;
        if (el && el.value !== formData.name) {
          el.value = formData.name;
          el.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const el2 = sellerNameRef.current;
        if (el2 && el2.value !== (formData.profile?.full_name || '')) {
          el2.value = formData.profile?.full_name || '';
          el2.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (attempts >= maxAttempts || ((el && el.value === formData.name) && (el2 && el2.value === (formData.profile?.full_name || '')))) {
          clearInterval(timer);
        }
      }, 50);
      
      setFormKey(Date.now());
    }
  }, [bancaData, profileResp, reset, session?.user?.email, session?.user?.name]);

  // 🔔 Realtime: ouvir alterações na tabela bancas para este user_id e sincronizar automaticamente
  useEffect(() => {
    if (!session?.user?.id) return;
    const channel = supabase
      .channel(`banca-realtime-${session.user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bancas',
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          console.log('📡 [V2] Realtime mudança detectada na banca:', payload.eventType);
          // Invalidar query para buscar dados mais recentes
          queryClient.invalidateQueries({ queryKey: ['banca'] });
        }
      )
      .subscribe((status) => {
        console.log('📡 [V2] Canal realtime status:', status);
      });

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch {}
    };
  }, [session?.user?.id, queryClient]);

  // Mutation para salvar
  const saveMutation = useMutation({
    mutationFn: async (data: BancaFormData) => {
      // Upload de imagens (se necessário)
      const uploadImages = async (sources: string[]) => {
        const uploaded: string[] = [];
        for (const src of sources || []) {
          if (!src) continue;
          const isHttpUrl = src.startsWith('http://') || src.startsWith('https://');
          const isDataUrl = src.startsWith('data:');
          if (!isDataUrl) {
            if (isHttpUrl || src.startsWith('/uploads/')) {
              uploaded.push(src);
              continue;
            }
          }
          if (isDataUrl) {
            const blob = await (await fetch(src)).blob();
            const formData = new FormData();
            formData.append('file', blob, `img-${Date.now()}.png`);
            const res = await fetch('/api/upload', {
              method: 'POST',
              headers: { Authorization: `Bearer jornaleiro-token` },
              body: formData,
            });
            const json = await res.json();
            if (!res.ok || !json?.ok || !json.url) {
              if (json?.url) {
                uploaded.push(json.url as string);
              } else {
                throw new Error('Falha no upload de imagem');
              }
            } else {
              uploaded.push(json.url as string);
            }
            continue;
          }
          // fallback
          uploaded.push(src);
        }
        return uploaded;
      };

      const uploadedCover = await uploadImages(coverImages);
      const uploadedAvatar = await uploadImages(avatarImages);

      const res = await fetch('/api/jornaleiro/banca', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            name: data.name,
            description: stripHtml(data.description) || '',
            tpu_url: data.tpu_url || '',
            contact: data.contact,
            socials: data.socials,
            addressObj: data.addressObj,
            payments: data.payments,
            categories: data.categories,
            hours: data.hours,
            featured: data.featured,
            ctaUrl: data.ctaUrl,
            delivery_enabled: data.delivery_enabled,
            free_shipping_threshold: data.free_shipping_threshold,
            origin_cep: data.origin_cep,
            location: data.location,
            images: {
              cover: uploadedCover?.[0] ?? null,
              avatar: uploadedAvatar?.[0] ?? null,
            },
            // Cotista info
            is_cotista: isCotista,
            cotista_id: selectedCotista?.id || null,
            cotista_codigo: selectedCotista?.codigo || null,
            cotista_razao_social: selectedCotista?.razao_social || null,
            cotista_cnpj_cpf: selectedCotista?.cnpj_cpf || null,
          }
        }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao salvar');
      }
      
      if (authToken) {
        try {
          await fetch('/api/jornaleiro/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              profile: {
                full_name: data.profile?.full_name || undefined,
                phone: data.profile?.phone || undefined,
                cpf: data.profile?.cpf || undefined,
                avatar_url: undefined,
              },
            }),
          });
        } catch {}
      }

      return res.json();
    },
    onSuccess: (response) => {
      console.log('✅ [V2] Salvamento concluído:', response.data);
      
      // Invalidar query para forçar reload - o useEffect vai resetar o form automaticamente
      queryClient.invalidateQueries({ queryKey: ['banca'] });
      
      // Reset imediato com os dados retornados do servidor (mapeados para o formulário)
      const r = response.data || {};
      const adr = r.addressObj || {};
      const mapped: BancaFormData = {
        name: r.name || '',
        description: stripHtml(r.description) || '',
        tpu_url: r.tpu_url || '',
        contact: { whatsapp: r.whatsapp || '' },
        socials: {
          instagram: r.instagram || '',
          facebook: r.facebook || '',
          gmb: r.socials?.gmb || '',
        },
        addressObj: {
          cep: adr.cep || r.cep || '',
          street: adr.street || (r.address?.split(',')[0] || ''),
          number: adr.number || '',
          neighborhood: adr.neighborhood || '',
          city: adr.city || (r.address?.split(',')[1]?.trim() || ''),
          uf: adr.uf || '',
          complement: adr.complement || '',
        },
        payments: Array.isArray(r.payment_methods) ? r.payment_methods : (Array.isArray(r.payments) ? r.payments : []),
        categories: Array.isArray(r.categories) ? r.categories : [],
        hours: Array.isArray(r.hours) ? r.hours : DAYS.map((d) => ({ key: d.key, label: d.label, open: false, start: '08:00', end: '18:00' })),
        featured: r.featured === true,
        ctaUrl: r.ctaUrl || '',
        delivery_enabled: r.delivery_enabled || false,
        free_shipping_threshold: typeof r.free_shipping_threshold === 'number' ? r.free_shipping_threshold : 120,
        origin_cep: r.origin_cep || '',
        location: { lat: r.lat, lng: r.lng },
      } as any;
      reset({
        ...mapped,
        profile: {
          full_name: (watch('profile') as any)?.full_name || '',
          phone: (watch('profile') as any)?.phone || '',
          email: session?.user?.email || '',
          cpf: (watch('profile') as any)?.cpf || '',
          avatar_url: (watch('profile') as any)?.avatar_url || '',
        },
      } as any);
      setFormKey(Date.now());
      try {
        const seed = r.updated_at || Date.now();
        const cover = r.cover_image || r.cover || '';
        const avatar = r.profile_image || r.avatar || '';
        setCoverImages(cover ? [withCacheBust(cover, seed)] : []);
        setAvatarImages(avatar ? [withCacheBust(avatar, seed)] : []);
        setImagesChanged(false);
      } catch {}
      
      // Disparar evento para atualizar header
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('gb:banca:updated', {
          detail: {
            id: response.data.id,
            user_id: session?.user?.id,
            name: response.data.name,
            email: response.data.email,
          }
        }));
      }
      
      toast.success('✅ Dados salvos com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`❌ ${error.message}`);
    },
  });

  const onSubmit = (data: BancaFormData) => {
    saveMutation.mutate(data);
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">Erro ao carregar dados da banca</p>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['banca'] })}
          className="mt-2 text-sm text-red-700 underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Informações da Banca</h1>
          <p className="text-sm text-gray-600">Gerencie os dados do jornaleiro, da banca, horários e redes sociais.</p>
        </div>
        {(isDirty || imagesChanged) && (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
            ⚠️ Alterações não salvas
          </span>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 overflow-hidden relative z-30">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center max-w-full min-w-0 overflow-hidden items-stretch">
          <button
            type="button"
            onClick={() => setActiveTab('jornaleiro')}
            className={`min-w-0 flex flex-col items-center gap-2 p-3 rounded-md transition-colors ${activeTab === 'jornaleiro' ? 'text-[#ff5c00]' : 'text-gray-600 hover:text-[#ff5c00]'}`}
          >
            <span className={`shrink-0 h-10 w-10 rounded-full grid place-items-center border ${activeTab === 'jornaleiro' ? 'bg-[#ff5c00] text-white border-orange-200 ring-4 ring-orange-100' : 'bg-white text-gray-600 border-gray-300'}`}>
              <IconUser size={18} />
            </span>
            <span className={`text-sm truncate max-w-[9rem] ${activeTab === 'jornaleiro' ? 'font-semibold' : ''}`}>Jornaleiro</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('banca')}
            className={`min-w-0 flex flex-col items-center gap-2 p-3 rounded-md transition-colors ${activeTab === 'banca' ? 'text-[#ff5c00]' : 'text-gray-600 hover:text-[#ff5c00]'}`}
          >
            <span className={`shrink-0 h-10 w-10 rounded-full grid place-items-center border ${activeTab === 'banca' ? 'bg-[#ff5c00] text-white border-orange-200 ring-4 ring-orange-100' : 'bg-white text-gray-600 border-gray-300'}`}>
              <IconBuilding size={18} />
            </span>
            <span className={`text-sm truncate max-w-[9rem] ${activeTab === 'banca' ? 'font-semibold' : ''}`}>Banca</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('func')}
            className={`min-w-0 flex flex-col items-center gap-2 p-3 rounded-md transition-colors ${activeTab === 'func' ? 'text-[#ff5c00]' : 'text-gray-600 hover:text-[#ff5c00]'}`}
          >
            <span className={`shrink-0 h-10 w-10 rounded-full grid place-items-center border ${activeTab === 'func' ? 'bg-[#ff5c00] text-white border-orange-200 ring-4 ring-orange-100' : 'bg-white text-gray-600 border-gray-300'}`}>
              <IconClock size={18} />
            </span>
            <span className={`text-sm truncate max-w-[9rem] ${activeTab === 'func' ? 'font-semibold' : ''}`}>Funcionamento</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`min-w-0 flex flex-col items-center gap-2 p-3 rounded-md transition-colors ${activeTab === 'social' ? 'text-[#ff5c00]' : 'text-gray-600 hover:text-[#ff5c00]'}`}
          >
            <span className={`shrink-0 h-10 w-10 rounded-full grid place-items-center border ${activeTab === 'social' ? 'bg-[#ff5c00] text-white border-orange-200 ring-4 ring-orange-100' : 'bg-white text-gray-600 border-gray-300'}`}>
              <IconLink size={18} />
            </span>
            <span className={`text-sm truncate max-w-[9rem] ${activeTab === 'social' ? 'font-semibold' : ''}`}>Social Midia</span>
          </button>
        </div>
      </div>

      {/* Panel: Jornaleiro */}
      <div className={activeTab === 'jornaleiro' ? 'block' : 'hidden'}>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Dados do Jornaleiro</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Nome completo</label>
            <Controller
              name="profile.full_name"
              control={control}
              defaultValue={profileResp?.profile?.full_name || session?.user?.name || ''}
              render={({ field }) => (
                <input
                  key={`seller-fullname-${profileResp?.profile?.updated_at || formKey}`}
                  {...field}
                  ref={(el) => { field.ref(el); sellerNameRef.current = el; }}
                  autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Seu nome completo"
                />
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">WhatsApp (pessoal)</label>
            <input
              {...register('profile.phone')}
              key={`seller-phone-${profileResp?.profile?.updated_at || formKey}`}
              autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="(11) 99999-9999"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              value={session?.user?.email || ''}
              readOnly
              key={`seller-email-${formKey}`}
              autoComplete="off"
              className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF</label>
            <input
              {...register('profile.cpf')}
              key={`seller-cpf-${formKey}`}
              autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
              placeholder="000.000.000-00"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Cotista Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 mt-6">
        <h2 className="mb-4 text-lg font-semibold">Informações de Cotista</h2>
        <p className="text-sm text-gray-600 mb-4">
          Cotistas têm acesso automático aos produtos dos distribuidores cadastrados. Caso não seja cotista, será necessário cadastrar produtos manualmente.
        </p>
        
        <div className="space-y-4">
          {/* Radio Button */}
          <div className="flex items-start gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!isCotista}
                onChange={() => {
                  setIsCotista(false);
                  setSelectedCotista(null);
                }}
                className="h-4 w-4 text-[#ff5c00] focus:ring-[#ff5c00]"
              />
              <span className="text-sm text-gray-700">Não sou cotista</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={isCotista}
                onChange={() => setIsCotista(true)}
                className="h-4 w-4 text-[#ff5c00] focus:ring-[#ff5c00]"
              />
              <span className="text-sm text-gray-700">Sou cotista</span>
            </label>
          </div>

          {/* Cotista Search */}
          {isCotista && (
            <div className="space-y-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar Cotista
                </label>
                <CotistaSearch
                  onSelect={(cotista) => setSelectedCotista(cotista)}
                  selectedCnpjCpf={selectedCotista?.cnpj_cpf}
                />
              </div>

              {/* Selected Cotista Info */}
              {selectedCotista && (
                <div className="bg-white rounded-lg border border-orange-300 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">✓ Cotista Selecionado</h3>
                    <span className="text-xs font-semibold text-[#ff5c00] bg-orange-100 px-2 py-1 rounded">
                      #{selectedCotista.codigo}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Razão Social:</span>
                      <p className="font-medium text-gray-900">{selectedCotista.razao_social}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">CNPJ/CPF:</span>
                      <p className="font-medium text-gray-900 font-mono">
                        {selectedCotista.cnpj_cpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')}
                      </p>
                    </div>
                    {selectedCotista.telefone && (
                      <div>
                        <span className="text-gray-600">Telefone:</span>
                        <p className="font-medium text-gray-900">{selectedCotista.telefone}</p>
                      </div>
                    )}
                    {(selectedCotista.cidade || selectedCotista.estado) && (
                      <div>
                        <span className="text-gray-600">Localização:</span>
                        <p className="font-medium text-gray-900">
                          {selectedCotista.cidade && selectedCotista.estado
                            ? `${selectedCotista.cidade}/${selectedCotista.estado}`
                            : selectedCotista.cidade || selectedCotista.estado}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded p-3 mt-3">
                    <p className="text-xs text-green-800">
                      ✅ Como cotista, você terá acesso automático ao catálogo de produtos dos distribuidores cadastrados na plataforma.
                    </p>
                  </div>
                </div>
              )}

              {/* Warning if no cotista selected */}
              {isCotista && !selectedCotista && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-xs text-yellow-800">
                    ⚠️ Selecione um cotista acima para vincular sua banca e ter acesso aos produtos dos distribuidores.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Non-cotista warning */}
          {!isCotista && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-xs text-blue-800">
                ℹ️ Como não-cotista, você precisará cadastrar seus produtos manualmente através do painel de produtos.
              </p>
            </div>
          )}
        </div>
      </div>

      </div>

      <form key={formKey} onSubmit={handleSubmit(onSubmit as any)} className="space-y-6 max-w-full overflow-x-hidden" autoComplete="off">
        {/* Nome da Banca */}
        <div className={`${activeTab === 'banca' ? 'block' : 'hidden'} rounded-xl border border-gray-200 bg-white p-6`}>
          <h2 className="mb-4 text-lg font-semibold">Informações Básicas</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome da Banca *
              </label>
              <Controller
                name="name"
                control={control}
                defaultValue={bancaData?.name || ''}
                render={({ field }) => (
                  <input
                    key={`name-${bancaData?.updated_at || bancaData?.name || formKey}`}
                    {...field}
                    ref={(el) => { field.ref(el); nameRef.current = el; }}
                    autoComplete="off"
                    data-lpignore="true"
                    data-1p-ignore
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Digite o nome da sua banca"
                  />
                )}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                {...register('description')}
                rows={4}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="Conte um pouco sobre sua banca..."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Link de CTA</label>
                <input
                  {...register('ctaUrl')}
                  key={`ctaUrl-${bancaData?.updated_at || formKey}`}
                  autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="https://..."
                />
              </div>
              <label className="mt-6 inline-flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" {...register('featured')} className="rounded" />
                Destaque na página
              </label>
            </div>
          </div>
        </div>

        {/* Imagens */}
        <div className={`${activeTab === 'banca' ? 'block' : 'hidden'} rounded-xl border border-gray-200 bg-white p-6`}>
          <h2 className="mb-4 text-lg font-semibold">Imagens</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Imagem de Perfil</label>
              <ImageUploader
                multiple={false}
                max={1}
                value={avatarImages}
                onChange={(_, previews) => {
                  setAvatarImages(previews);
                  setImagesChanged(true);
                }}
                previewShape="circle"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Capa</label>
              <ImageUploader
                multiple={false}
                max={1}
                value={coverImages}
                onChange={(_, previews) => {
                  setCoverImages(previews);
                  setImagesChanged(true);
                }}
              />
            </div>
          </div>
          <div className="mt-6">
            <FileUploadDragDrop
              label="Termo de Permissão de Uso (TPU) - PDF"
              value={watch('tpu_url') as any}
              onChange={(url) => setValue('tpu_url', url, { shouldDirty: true })}
              accept="application/pdf"
              role="jornaleiro"
              className="h-24 w-full"
            />
          </div>
        </div>

        {/* Contato */}
        <div className={`${activeTab === 'social' ? 'block' : 'hidden'} rounded-xl border border-gray-200 bg-white p-6`}>
          <h2 className="mb-4 text-lg font-semibold">Contato e Redes Sociais</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
              <input
                {...register('contact.whatsapp')}
                key={`whatsapp-${bancaData?.updated_at || formKey}`}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Instagram
              </label>
              <input
                {...register('socials.instagram')}
                key={`instagram-${bancaData?.updated_at || formKey}`}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Facebook
              </label>
              <input
                {...register('socials.facebook')}
                key={`facebook-${bancaData?.updated_at || formKey}`}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="https://facebook.com/..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Google Maps / GMB</label>
              <input
                {...register('socials.gmb')}
                key={`gmb-${bancaData?.updated_at || formKey}`}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className={`${activeTab === 'banca' ? 'block' : 'hidden'} rounded-xl border border-gray-200 bg-white p-6`}>
          <h2 className="mb-4 text-lg font-semibold">Endereço</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">CEP</label>
              <input
                {...register('addressObj.cep')}
                key={`cep-${bancaData?.updated_at || formKey}`}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="00000-000"
                maxLength={9}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cidade</label>
              <input
                {...register('addressObj.city')}
                key={`city-${bancaData?.updated_at || formKey}`}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Logradouro</label>
              <input
                {...register('addressObj.street')}
                key={`street-${bancaData?.updated_at || formKey}`}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Número</label>
              <input
                {...register('addressObj.number')}
                key={`number-${bancaData?.updated_at || formKey}`}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bairro</label>
              <input
                {...register('addressObj.neighborhood')}
                key={`neighborhood-${bancaData?.updated_at || formKey}`}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Complemento</label>
              <input
                {...register('addressObj.complement')}
                key={`complement-${bancaData?.updated_at || formKey}`}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">UF</label>
              <select
                {...register('addressObj.uf')}
                key={`uf-${bancaData?.updated_at || formKey}`}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Selecione</option>
                {ESTADOS.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Horários */}
        <div className={`${activeTab === 'func' ? 'block' : 'hidden'} rounded-xl border border-gray-200 bg-white p-6`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Horários de funcionamento</h2>
            <span className="text-xs text-gray-500">Informe horário de abertura e fechamento para cada dia</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-3">
            {(watch('hours') || []).map((day, idx) => (
              <div key={`${day.key}-${formKey}`} className="rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>{day.label}</span>
                  <label className="inline-flex items-center gap-1 text-xs text-gray-600">
                    <input
                      key={`open-${day.key}-${formKey}`}
                      type="checkbox"
                      checked={!!day.open}
                      onChange={(e) => {
                        const next = [...(watch('hours') || [])];
                        next[idx] = { ...next[idx], open: e.target.checked };
                        setValue('hours', next, { shouldDirty: true });
                      }}
                      className="rounded"
                    />
                    Aberto
                  </label>
                </div>
                {day.open ? (
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-gray-500">Abre</label>
                      <input
                        key={`start-${day.key}-${formKey}`}
                        type="time"
                        value={day.start}
                        onChange={(e) => {
                          const next = [...(watch('hours') || [])];
                          next[idx] = { ...next[idx], start: e.target.value };
                          setValue('hours', next, { shouldDirty: true });
                        }}
                        className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500">Fecha</label>
                      <input
                        key={`end-${day.key}-${formKey}`}
                        type="time"
                        value={day.end}
                        onChange={(e) => {
                          const next = [...(watch('hours') || [])];
                          next[idx] = { ...next[idx], end: e.target.value };
                          setValue('hours', next, { shouldDirty: true });
                        }}
                        className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-gray-500">Fechado neste dia</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pagamentos e Categorias */}
        <div className={`${activeTab === 'banca' ? 'grid' : 'hidden'} gap-4 lg:grid-cols-2`}>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Pagamentos aceitos</h2>
            <div className="grid gap-2 sm:grid-cols-2 mt-2">
              {PAYMENT_OPTIONS.map((option) => {
                const selected = new Set(watch('payments') || []);
                const checked = selected.has(option.value);
                return (
                  <label key={option.value} className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm">
                    <input
                      key={`pay-${option.value}-${formKey}`}
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const next = new Set(watch('payments') || []);
                        if (next.has(option.value)) next.delete(option.value); else next.add(option.value);
                        setValue('payments', Array.from(next), { shouldDirty: true });
                      }}
                      className="rounded"
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Categorias atendidas</h2>
            <label className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm">
              <input
                key={`cat-all-${formKey}`}
                type="checkbox"
                checked={Boolean((categoriesData || []).length > 0 && (categoriesData || []).every((c:any) => (watch('categories') || []).includes(c.id)))}
                onChange={() => {
                  const allIds = (categoriesData || []).map((c:any) => c.id);
                  const current = new Set(watch('categories') || []);
                  const allSelected = allIds.length > 0 && allIds.every((id:string) => current.has(id));
                  setValue('categories', allSelected ? [] : allIds, { shouldDirty: true });
                }}
                className="rounded"
              />
              Selecionar todas
            </label>
            <div className="grid gap-2 sm:grid-cols-2 mt-2">
              {(categoriesData || []).map((option: any) => {
                const checked = (watch('categories') || []).includes(option.id);
                return (
                  <label key={option.id} className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm">
                    <input
                      key={`cat-${option.id}-${formKey}`}
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const next = new Set(watch('categories') || []);
                        if (next.has(option.id)) next.delete(option.id); else next.add(option.id);
                        setValue('categories', Array.from(next), { shouldDirty: true });
                      }}
                      className="rounded"
                    />
                    {option.name}
                  </label>
                );
              })}
              {(!categoriesData || categoriesData.length === 0) && (
                <p className="text-sm text-gray-500">Nenhuma categoria cadastrada ainda.</p>
              )}
            </div>
          </div>
        </div>

        {/* Entrega e frete */}
        <div className={`${activeTab === 'banca' ? 'block' : 'hidden'} rounded-xl border border-gray-200 bg-white p-6`}>
          <h2 className="mb-4 text-lg font-semibold">Entrega</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input key={`delivery-${formKey}`} type="checkbox" {...register('delivery_enabled')} className="rounded" />
              Entrega ativada
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700">Frete grátis a partir de (R$)</label>
              <input key={`free-threshold-${formKey}`} type="number" step="1" min="0" {...register('free_shipping_threshold', { valueAsNumber: true })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CEP de origem</label>
              <input key={`origin-cep-${formKey}`} {...register('origin_cep')} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="00000-000" />
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
          <button
            type="button"
            onClick={() => reset()}
            disabled={(!isDirty && !imagesChanged) || saveMutation.isPending}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Descartar alterações
          </button>

          <button
            type="submit"
            disabled={(!isDirty && !imagesChanged) || saveMutation.isPending}
            className="rounded-md bg-purple-600 px-6 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {saveMutation.isPending ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}

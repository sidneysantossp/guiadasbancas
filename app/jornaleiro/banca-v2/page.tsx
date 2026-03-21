'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import ImageUploader from '@/components/admin/ImageUploader';
import FileUploadDragDrop from '@/components/common/FileUploadDragDrop';
import JornaleiroPageHeading from '@/components/jornaleiro/JornaleiroPageHeading';
import { IconUser, IconClock, IconBuilding, IconLink } from '@tabler/icons-react';
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

type SelectedCotistaInfo = {
  id: string;
  codigo: string;
  razao_social: string;
  cnpj_cpf: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
};

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
  // featured/ctaUrl removidos do gerenciamento do jornaleiro
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
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab') as 'jornaleiro' | 'banca' | 'func' | 'social' | null;
  const queryClient = useQueryClient();
  const [formKey, setFormKey] = useState<number>(() => Date.now());
  const nameRef = useRef<HTMLInputElement | null>(null);
  const sellerNameRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const cpfRef = useRef<HTMLInputElement | null>(null);
  const numberRef = useRef<HTMLInputElement | null>(null);
  const complementRef = useRef<HTMLInputElement | null>(null);
  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [avatarImages, setAvatarImages] = useState<string[]>([]);
  const [imagesChanged, setImagesChanged] = useState(false);
  const [activeTab, setActiveTab] = useState<'jornaleiro' | 'banca' | 'func' | 'social'>('jornaleiro');

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  const [isCotista, setIsCotista] = useState(false);
  const [selectedCotista, setSelectedCotista] = useState<SelectedCotistaInfo | null>(null);
  const [cotistaDirty, setCotistaDirty] = useState(false);
  const [addressFieldsEnabled, setAddressFieldsEnabled] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

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

  const { data: bancaData, isLoading, error, refetch: refetchBanca } = useQuery({
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
    refetchOnWindowFocus: false, 
    refetchOnMount: false,
  });

  useEffect(() => {
    const handleBancaUpdated = () => {
      refetchBanca();
    };

    window.addEventListener('banca-updated', handleBancaUpdated);
    return () => window.removeEventListener('banca-updated', handleBancaUpdated);
  }, [refetchBanca]);

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

  const { data: profileResp } = useQuery({
    queryKey: ['jornaleiroProfile'],
    queryFn: async () => {
      const res = await fetch('/api/jornaleiro/profile', {
        cache: 'no-store',
        credentials: 'include',
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao carregar perfil: ${res.status} - ${errorText}`);
      }

      return res.json();
    },
    staleTime: 0,
    enabled: status === 'authenticated',
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
      delivery_enabled: false,
      free_shipping_threshold: 120,
      origin_cep: '',
      location: {},
      profile: { full_name: '', phone: '', email: '', cpf: '', avatar_url: '' },
    } as any,
  });

  useEffect(() => {
    if (bancaData?.profile || profileResp?.profile) {
      const phoneValue = profileResp?.profile?.phone || bancaData?.profile?.phone || '';
      const cpfValue = profileResp?.profile?.cpf || bancaData?.profile?.cpf || '';

      if (phoneRef.current && phoneValue) {
        phoneRef.current.value = phoneValue;
        setValue('profile.phone', phoneValue, { shouldDirty: false, shouldTouch: false });
      }

      if (cpfRef.current && cpfValue) {
        cpfRef.current.value = cpfValue;
        setValue('profile.cpf', cpfValue, { shouldDirty: false, shouldTouch: false });
      }

      setTimeout(() => {
        if (phoneRef.current && phoneValue && phoneRef.current.value !== phoneValue) {
          phoneRef.current.value = phoneValue;
          phoneRef.current.dispatchEvent(new Event('input', { bubbles: true }));
        }

        if (cpfRef.current && cpfValue && cpfRef.current.value !== cpfValue) {
          cpfRef.current.value = cpfValue;
          cpfRef.current.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, 200);
    }

    if (bancaData?.addressObj?.cep || bancaData?.cep) {
      setAddressFieldsEnabled(true);
    }
  }, [bancaData?.profile, profileResp?.profile, bancaData?.addressObj, bancaData?.cep, setValue]);

  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    if (bancaData && !initialLoaded && !justSaved) {
      const adr = bancaData.addressObj || {};
      const prof = (profileResp?.profile) ?? (bancaData?.profile) ?? {};

      reset({
        name: bancaData.name || '',
        description: stripHtml(bancaData.description) || '',
        tpu_url: bancaData.tpu_url || '',
        contact: { whatsapp: bancaData.contact?.whatsapp || bancaData.whatsapp || '' },
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
        hours: Array.isArray(bancaData.hours) ? bancaData.hours : DAYS.map((d) => ({ key: d.key, label: d.label, open: false, start: '08:00', end: '18:00' })),
        delivery_enabled: bancaData.delivery_enabled || false,
        free_shipping_threshold: typeof bancaData.free_shipping_threshold === 'number' ? bancaData.free_shipping_threshold : 120,
        origin_cep: bancaData.origin_cep || '',
        location: { lat: bancaData.lat, lng: bancaData.lng },
        profile: {
          full_name: prof.full_name || '',
          phone: prof.phone || '',
          email: session?.user?.email || '',
          cpf: prof.cpf || '',
          avatar_url: prof.avatar_url || '',
        },
      });

      try {
        const isCotistaValue = bancaData.is_cotista === true;
        setIsCotista(isCotistaValue);
        if (isCotistaValue && bancaData.cotista_razao_social) {
          setSelectedCotista({
            id: bancaData.cotista_id || null,
            codigo: bancaData.cotista_codigo || '',
            razao_social: bancaData.cotista_razao_social || '',
            cnpj_cpf: bancaData.cotista_cnpj_cpf || '',
          });
        } else {
          setSelectedCotista(null);
      }
      setCotistaDirty(false);
      } catch {}

      try {
        const seed = bancaData.updated_at || Date.now();
        const cover = bancaData.cover_image || bancaData.cover || '';
        const avatar = bancaData.profile_image || bancaData.avatar || '';
        setCoverImages(cover ? [withCacheBust(cover, seed)] : []);
        setAvatarImages(avatar ? [withCacheBust(avatar, seed)] : []);
        setImagesChanged(false);
      } catch {}

      setInitialLoaded(true);
    }
  }, [bancaData, profileResp, initialLoaded, justSaved, reset, session?.user?.email]);

  // Função para comprimir imagem antes do upload (evita erro 413 na Vercel)
  const compressImage = async (dataUrl: string, maxSizeMB: number = 2): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        // Redimensionar se muito grande (max 1920px)
        const maxDimension = 1920;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Comprimir com qualidade reduzida
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              // Fallback: converter dataUrl para blob original
              fetch(dataUrl).then(r => r.blob()).then(resolve);
            }
          },
          'image/jpeg',
          0.8 // Qualidade 80%
        );
      };
      img.onerror = () => {
        // Fallback: converter dataUrl para blob original
        fetch(dataUrl).then(r => r.blob()).then(resolve);
      };
      img.src = dataUrl;
    });
  };

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
            // Comprimir imagem antes do upload para evitar erro 413
            const compressedBlob = await compressImage(src, 2);
            
            // Verificar tamanho após compressão
            if (compressedBlob.size > 4 * 1024 * 1024) {
              throw new Error('Imagem muito grande. O tamanho máximo é 4MB. Tente uma imagem menor.');
            }
            
            const formData = new FormData();
            formData.append('file', compressedBlob, `img-${Date.now()}.jpg`);
            const res = await fetch('/api/upload', {
              method: 'POST',
              headers: { Authorization: `Bearer jornaleiro-token` },
              body: formData,
            });
            
            // Verificar erro 413 especificamente
            if (res.status === 413) {
              throw new Error('Imagem muito grande para o servidor. Tente uma imagem menor (máximo 4MB).');
            }
            
            const json = await res.json();
            if (!res.ok || !json?.ok || !json.url) {
              if (json?.url) {
                uploaded.push(json.url as string);
              } else {
                throw new Error(json?.error || 'Falha no upload de imagem');
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

      const profileRes = await fetch('/api/jornaleiro/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          profile: {
            full_name: data.profile?.full_name || '',
            phone: data.profile?.phone || '',
            cpf: data.profile?.cpf || '',
            avatar_url: data.profile?.avatar_url || '',
          }
        }),
      });
      
      if (!profileRes.ok) {
        const profileError = await profileRes.json();
        throw new Error(profileError.error || 'Erro ao salvar perfil');
      }

      const res = await fetch('/api/jornaleiro/banca', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          data: {
            name: data.name,
            description: stripHtml(data.description) || '',
            tpu_url: data.tpu_url || '',
            contact: data.contact,
            socials: data.socials,
            addressObj: {
              ...data.addressObj,
              complement: complementRef.current?.value || data.addressObj?.complement
            },
            payments: data.payments,
            categories: data.categories,
            hours: data.hours,
            // featured/ctaUrl removidos
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
        throw new Error(error.error || 'Erro ao salvar banca');
      }

      const bancaResponse = await res.json();

      return {
        ...bancaResponse,
        savedProfile: {
          full_name: data.profile?.full_name || '',
          phone: data.profile?.phone || '',
          cpf: data.profile?.cpf || '',
          avatar_url: data.profile?.avatar_url || '',
          email: session?.user?.email || '',
        }
      };
    },
    onSuccess: () => {
      setJustSaved(true);
      setSaveMessage('Informações atualizadas com sucesso!');

      setTimeout(() => {
        setJustSaved(false);
        setSaveMessage('');
      }, 2000);
    },
    onError: () => {},
  });

  const onSubmit = (data: BancaFormData) => {
    saveMutation.mutate(data);
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-600">Carregando painel...</p>
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
      <JornaleiroPageHeading
        title="Perfil e publicação"
        actions={
          (isDirty || imagesChanged) ? (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
              ⚠️ Alterações não salvas
            </span>
          ) : null
        }
      />

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
              ref={phoneRef}
              key={`seller-phone-${bancaData?.profile?.updated_at || profileResp?.profile?.updated_at || formKey}`}
              defaultValue=""
              onChange={(e) => {
                setValue('profile.phone', e.target.value, { shouldDirty: true });
              }}
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
              ref={cpfRef}
              key={`seller-cpf-${bancaData?.profile?.updated_at || profileResp?.profile?.updated_at || formKey}`}
              defaultValue=""
              onChange={(e) => {
                // Aplicar máscara de CPF: 000.000.000-00
                let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
                if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos
                
                // Aplica a máscara
                if (value.length > 9) {
                  value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
                } else if (value.length > 6) {
                  value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
                } else if (value.length > 3) {
                  value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
                }
                
                e.target.value = value;
                setValue('profile.cpf', value, { shouldDirty: true });
              }}
              autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
              placeholder="000.000.000-00"
              maxLength={14}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Cotista Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 mt-6">
        <h2 className="mb-4 text-lg font-semibold">Informações do Plano</h2>
        <p className="text-sm text-gray-600 mb-4">
          Banca PRIME é um Plano exclusivo que oferecemos para Bancas Parceiras as quais disponibilizamos acesso ao Catálogo e Estoque direto de fornecedores Premium como a PANINI. Caso não seja parceiro PRIME, solicite o seu cadastro.
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
                  setCotistaDirty(true);
                }}
                className="h-4 w-4 text-[#ff5c00] focus:ring-[#ff5c00]"
              />
              <span className="text-sm text-gray-700">Não sou Banca PRIME</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={isCotista}
                onChange={() => setIsCotista(true)}
                className="h-4 w-4 text-[#ff5c00] focus:ring-[#ff5c00]"
              />
              <span className="text-sm text-gray-700">Sou Banca PRIME</span>
            </label>
          </div>

          {/* Cotista Search */}
          {isCotista && (
            <div className="space-y-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar Cota Ativa
                </label>
                <CotistaSearch
                  mode="public"
                  onSelect={(cotista) => {
                    setSelectedCotista(cotista);
                    // Forçar form como dirty para habilitar botão salvar
                    setValue('name', watch('name'), { shouldDirty: true });
                    setCotistaDirty(true);
                  }}
                  onInputChange={(value) => {
                    // Marcar form como dirty quando usuário digita CPF/CNPJ
                    if (value.trim()) {
                      setValue('name', watch('name'), { shouldDirty: true });
                      setCotistaDirty(true);
                    } else {
                      setCotistaDirty(false);
                    }
                  }}
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
                      ✅ Esse vinculo identifica sua operacao na rede. O acesso ao catalogo de distribuidores depende do plano ativo da banca.
                    </p>
                  </div>
                </div>
              )}

              {/* Warning if no cotista selected */}
              {isCotista && !selectedCotista && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-xs text-yellow-800">
                    ⚠️ Selecione a rede vinculada da sua banca para manter o cadastro comercial consistente. O catalogo parceiro continua sendo liberado pelo plano.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Non-cotista warning */}
          {!isCotista && (
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-xs text-blue-800">
                  ℹ️ Caso não faça parte do programa de parceria, você precisará cadastrar seus produtos manualmente através do painel de produtos.
                </p>
              </div>
              <a
                href="https://wa.me/5511994683425?text=Olá!%20Gostaria%20de%20saber%20como%20faço%20para%20participar%20do%20programa%20de%20parceria%20Banca%20PRIME%20do%20Guia%20das%20Bancas."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Solicitar cadastro no programa PRIME
              </a>
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

            {/* Google Maps / GMB - OCULTO PARA JORNALEIROS */}
            {false && (
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
            )}
          </div>
        </div>

        {/* Endereço */}
        <div className={`${activeTab === 'banca' ? 'block' : 'hidden'} rounded-xl border border-gray-200 bg-white p-6`}>
          <h2 className="mb-4 text-lg font-semibold">Endereço</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">CEP</label>
              <Controller
                name="addressObj.cep"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    key={`cep-${bancaData?.updated_at || formKey}`}
                    autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="00000-000"
                    maxLength={9}
                    onChange={async (e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length > 8) value = value.slice(0, 8);
                      if (value.length > 5) {
                        value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
                      }
                      
                      // Atualizar o campo do React Hook Form
                      field.onChange(value);
                      
                      // Buscar endereço quando CEP estiver completo
                      const cepNumeros = value.replace(/\D/g, '');
                      if (cepNumeros.length === 8) {
                        try {
                          const response = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
                          const data = await response.json();
                          
                          if (!data.erro) {
                            setValue('addressObj.street', data.logradouro, { shouldDirty: true });
                            setValue('addressObj.neighborhood', data.bairro, { shouldDirty: true });
                            setValue('addressObj.city', data.localidade, { shouldDirty: true });
                            setValue('addressObj.uf', data.uf, { shouldDirty: true });
                            
                            // Habilitar campos de endereço
                            setAddressFieldsEnabled(true);
                            
                            // Focar no campo de número
                            setTimeout(() => {
                              numberRef.current?.focus();
                            }, 100);
                            
                            // Mensagem de sucesso
                            // toast.success('✅ Endereço encontrado com sucesso!'); // REMOVIDO
                          } else {
                            console.error('❌ CEP não encontrado');
                            // toast.error('❌ CEP não encontrado. Verifique o número digitado.'); // REMOVIDO
                          }
                        } catch (error) {
                          console.error('Erro ao buscar CEP:', error);
                          // toast.error('❌ Erro ao buscar CEP. Verifique sua conexão com a internet.'); // REMOVIDO
                        }
                      }
                    }}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cidade</label>
              <input
                {...register('addressObj.city')}
                key={`city-${bancaData?.updated_at || formKey}`}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                  addressFieldsEnabled 
                    ? 'border-gray-300 bg-white text-gray-900' 
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
                readOnly={!addressFieldsEnabled}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Logradouro</label>
              <input
                {...register('addressObj.street')}
                key={`street-${bancaData?.updated_at || formKey}`}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                  addressFieldsEnabled 
                    ? 'border-gray-300 bg-white text-gray-900' 
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
                readOnly={!addressFieldsEnabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Número</label>
              <input
                {...register('addressObj.number', {
                  setValueAs: (v) => {
                    // Guardar ref manualmente
                    return v;
                  }
                })}
                ref={(e) => {
                  register('addressObj.number').ref(e);
                  numberRef.current = e;
                }}
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
                className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                  addressFieldsEnabled 
                    ? 'border-gray-300 bg-white text-gray-900' 
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
                readOnly={!addressFieldsEnabled}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Complemento</label>
              <input
                {...register('addressObj.complement')}
                ref={(e) => {
                  register('addressObj.complement').ref(e);
                  complementRef.current = e;
                }}
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
                className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                  addressFieldsEnabled 
                    ? 'border-gray-300 bg-white text-gray-900' 
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
                disabled={!addressFieldsEnabled}
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

        {/* Pagamentos e Categorias - REMOVIDO PARA JORNALEIROS (controlado pelos admins) */}

        {/* Entrega e frete - OCULTO TEMPORARIAMENTE */}
        {false && (
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
        )}

        {/* Botões */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => { reset(); setCotistaDirty(false); }}
              disabled={(!isDirty && !imagesChanged) || saveMutation.isPending}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Descartar alterações
            </button>

            <button
              type="submit"
              disabled={(!isDirty && !imagesChanged && !cotistaDirty) || saveMutation.isPending}
              className="rounded-md bg-purple-600 px-6 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {saveMutation.isPending ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
          {saveMessage && (
            <p className="mt-3 text-sm text-green-700">{saveMessage}</p>
          )}
        </div>
      </form>
    </div>
  );
}

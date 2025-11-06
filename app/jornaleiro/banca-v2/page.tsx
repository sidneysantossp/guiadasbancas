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

// Schema de validação
const bancaSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  cep: z.string().optional(),
  city: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
});

type BancaFormData = z.infer<typeof bancaSchema>;

export default function BancaV2Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formKey, setFormKey] = useState<number>(() => Date.now());
  const nameRef = useRef<HTMLInputElement | null>(null);

  // React Query - buscar dados
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
    staleTime: 0, // Sempre buscar dados frescos
    refetchOnWindowFocus: true, // Revalidar ao voltar para a aba
    refetchOnMount: 'always',
  });

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm<BancaFormData>({
    resolver: zodResolver(bancaSchema),
  });

  // 🔥 CRITICAL: Reset form quando dados da API mudarem (antes da pintura)
  useLayoutEffect(() => {
    if (bancaData) {
      const formData = {
        name: bancaData.name || '',
        description: bancaData.description || '',
        whatsapp: bancaData.phone || '',
        instagram: bancaData.instagram || '',
        facebook: bancaData.facebook || '',
        cep: bancaData.cep || '',
        city: bancaData.address?.split(',')[1]?.trim() || '',
        street: bancaData.address?.split(',')[0] || '',
        number: '',
      };
      
      console.log('🔄 [V2] Resetando form com novos dados:', formData);
      reset(formData, { keepDirty: false, keepDirtyValues: false, keepValues: false });
      // Forçar injeção de valores no DOM após o reset para contornar restauração do browser
      queueMicrotask(() => {
        try {
          setValue('name', formData.name, { shouldDirty: false, shouldTouch: false });
          if (nameRef.current) {
            nameRef.current.value = formData.name;
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
        if (attempts >= maxAttempts || (el && el.value === formData.name)) {
          clearInterval(timer);
        }
      }, 50);
      
      setFormKey(Date.now());
    }
  }, [bancaData, reset]);

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
      const res = await fetch('/api/jornaleiro/banca', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          phone: data.whatsapp,
          instagram: data.instagram,
          facebook: data.facebook,
          cep: data.cep,
          address: `${data.street}, ${data.city}`,
        }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao salvar');
      }
      
      return res.json();
    },
    onSuccess: (response) => {
      console.log('✅ [V2] Salvamento concluído:', response.data);
      
      // Invalidar query para forçar reload - o useEffect vai resetar o form automaticamente
      queryClient.invalidateQueries({ queryKey: ['banca'] });
      
      // Reset imediato com os dados retornados do servidor (mapeados para o formulário)
      const r = response.data || {};
      const mapped: BancaFormData = {
        name: r.name || '',
        description: r.description || '',
        whatsapp: r.whatsapp || '',
        instagram: r.instagram || '',
        facebook: r.facebook || '',
        cep: r.cep || '',
        city: (r.address?.split(',')[1]?.trim()) || '',
        street: (r.address?.split(',')[0]) || '',
        number: '',
      };
      reset(mapped);
      setFormKey(Date.now());
      
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Minha Banca (V2)</h1>
          <p className="text-sm text-gray-600">
            Gerenciamento moderno com React Query + React Hook Form
          </p>
        </div>
        
        {isDirty && (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
            ⚠️ Alterações não salvas
          </span>
        )}
      </div>

      <form key={formKey} onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
        {/* Nome da Banca */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
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
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="Conte um pouco sobre sua banca..."
              />
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Contato e Redes Sociais</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                WhatsApp
              </label>
              <input
                {...register('whatsapp')}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Instagram
              </label>
              <input
                {...register('instagram')}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Facebook
              </label>
              <input
                {...register('facebook')}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Endereço</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">CEP</label>
              <input
                {...register('cep')}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="00000-000"
                maxLength={9}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cidade</label>
              <input
                {...register('city')}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Logradouro</label>
              <input
                {...register('street')}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
          <button
            type="button"
            onClick={() => reset()}
            disabled={!isDirty || saveMutation.isPending}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Descartar alterações
          </button>

          <button
            type="submit"
            disabled={!isDirty || saveMutation.isPending}
            className="rounded-md bg-purple-600 px-6 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {saveMutation.isPending ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </form>

      {/* Debug Info */}
      <details className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <summary className="cursor-pointer text-sm font-medium">
          🔍 Debug Info
        </summary>
        <pre className="mt-2 text-xs">
          {JSON.stringify({
            isDirty,
            isPending: saveMutation.isPending,
            bancaName: bancaData?.name,
            rhfWatchName: (typeof window !== 'undefined') ? (document.querySelector('input[name="name"]') as HTMLInputElement | null)?.value : undefined,
            domNameValue: nameRef.current?.value,
            errors: Object.keys(errors),
          }, null, 2)}
        </pre>
      </details>
    </div>
  );
}

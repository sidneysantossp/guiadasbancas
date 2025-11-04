"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { useToast } from "@/components/admin/ToastProvider";
import { useSession } from "next-auth/react";

const DAYS = [
  { key: "sun", label: "Domingo" },
  { key: "mon", label: "Segunda" },
  { key: "tue", label: "Terça" },
  { key: "wed", label: "Quarta" },
  { key: "thu", label: "Quinta" },
  { key: "fri", label: "Sexta" },
  { key: "sat", label: "Sábado" },
] as const;

const PAYMENT_OPTIONS = [
  { value: "pix", label: "Pix" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "credito", label: "Cartão de crédito" },
  { value: "debito", label: "Cartão de débito" },
  { value: "online", label: "Pagamento online" },
];

const ESTADOS = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' },
] as const;

interface BancaForm {
  id?: string;
  name: string;
  description: string;
  cover?: string;
  avatar?: string;
  gallery: string[];
  featured: boolean;
  ctaUrl?: string;
  contact: { whatsapp?: string };
  socials: { instagram?: string; facebook?: string; gmb?: string };
  addressObj: { cep?: string; street?: string; number?: string; neighborhood?: string; city?: string; uf?: string; complement?: string };
  location: { lat?: string | number; lng?: string | number };
  payments: string[];
  categories: string[];
  hours: Array<{ key: string; label: string; open: boolean; start: string; end: string }>;
}

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export default function MinhaBancaPage() {
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [form, setForm] = useState<BancaForm | null>(null);
  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [avatarImages, setAvatarImages] = useState<string[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [categoriesOptions, setCategoriesOptions] = useState<{ id: string; name: string }[]>([]);
  const { status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") {
      if (status === "unauthenticated") {
        setLoading(false);
        setError("Sessão expirada. Faça login novamente.");
      }
      return;
    }
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/jornaleiro/banca", { cache: "no-store", credentials: "include" });
        if (res.status === 404) {
          setNotFound(true);
          setForm(null);
          return;
        }
        if (!res.ok) throw new Error("Não foi possível carregar os dados da banca.");
        const json = await res.json();
        const banca = json?.data || {};
        const mapped: BancaForm = {
          id: banca.id,
          name: banca.name || "",
          description: banca.description || "",
          cover: banca.cover || banca.images?.cover,
          avatar: banca.avatar || banca.images?.avatar,
          gallery: Array.isArray(banca.gallery) ? banca.gallery : [],
          featured: Boolean(banca.featured),
          ctaUrl: banca.ctaUrl || "",
          contact: banca.contact || {},
          socials: banca.socials || {},
          addressObj: banca.addressObj || {},
          location: {
            lat: banca.location?.lat != null ? String(banca.location.lat) : banca.lat != null ? String(banca.lat) : "",
            lng: banca.location?.lng != null ? String(banca.location.lng) : banca.lng != null ? String(banca.lng) : "",
          },
          payments: Array.isArray(banca.payments) ? banca.payments : [],
          categories: Array.isArray(banca.categories) ? banca.categories : [],
          hours: Array.isArray(banca.hours) && banca.hours.length > 0 
            ? banca.hours 
            : DAYS.map((d) => ({ key: d.key, label: d.label, open: false, start: "08:00", end: "18:00" })),
        };
        setForm(mapped);
        setCoverImages(mapped.cover ? [mapped.cover] : []);
        setAvatarImages(mapped.avatar ? [mapped.avatar] : []);
        setGalleryImages(mapped.gallery);
      } catch (e: any) {
        setError(e?.message || "Erro ao carregar banca");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [status]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        const json = await res.json();
        if (json?.success) {
          setCategoriesOptions((json.data as any[])?.map((c) => ({ id: c.id, name: c.name })) || []);
        }
      } catch {}
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (!form) return;
    setCoverImages(form.cover ? [form.cover] : []);
    setAvatarImages(form.avatar ? [form.avatar] : []);
    setGalleryImages(Array.isArray(form.gallery) ? form.gallery : []);
  }, [form?.cover, form?.avatar, form?.gallery]);

  const updateField = <K extends keyof BancaForm>(key: K, value: BancaForm[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updateAddress = (key: keyof BancaForm["addressObj"], value: string) => {
    setForm((prev) =>
      prev ? { ...prev, addressObj: { ...prev.addressObj, [key]: value } } : prev
    );
  };

  const updateSocial = (key: keyof BancaForm["socials"], value: string) => {
    setForm((prev) =>
      prev ? { ...prev, socials: { ...prev.socials, [key]: value } } : prev
    );
  };

  const updateContact = (key: keyof BancaForm["contact"], value: string) => {
    setForm((prev) =>
      prev ? { ...prev, contact: { ...prev.contact, [key]: value } } : prev
    );
  };

  const updateLocation = (key: keyof BancaForm["location"], value: string) => {
    setForm((prev) =>
      prev ? { ...prev, location: { ...prev.location, [key]: value } } : prev
    );
  };

  const fetchCEP = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCEPResponse = await response.json();

      if (data.erro) {
        toast.error('CEP não encontrado');
        return;
      }

      setForm((prev) =>
        prev ? {
          ...prev,
          addressObj: {
            ...prev.addressObj,
            cep: cleanCep,
            street: data.logradouro || prev.addressObj.street,
            neighborhood: data.bairro || prev.addressObj.neighborhood,
            city: data.localidade || prev.addressObj.city,
            uf: data.uf || prev.addressObj.uf,
          }
        } : prev
      );
      
      toast.success('Endereço encontrado!');
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast.error('Erro ao buscar CEP');
    } finally {
      setLoadingCep(false);
    }
  };

  const handleCepChange = (value: string) => {
    const cleanCep = value.replace(/\D/g, '');
    updateAddress("cep", cleanCep);
    
    if (cleanCep.length === 8) {
      fetchCEP(cleanCep);
    }
  };

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{0,3})/, '$1-$2');
  };

  const updateHours = (dayKey: string, patch: Partial<{ open: boolean; start: string; end: string }>) => {
    setForm((prev) => {
      if (!prev) return prev;
      const hours = prev.hours.map((h) =>
        h.key === dayKey ? { ...h, ...patch, open: patch.open ?? h.open } : h
      );
      return { ...prev, hours };
    });
  };

  const togglePayment = (value: string) => {
    setForm((prev) => {
      if (!prev) return prev;
      const exists = prev.payments.includes(value);
      return {
        ...prev,
        payments: exists ? prev.payments.filter((p) => p !== value) : [...prev.payments, value],
      };
    });
  };

  const toggleCategory = (value: string) => {
    setForm((prev) => {
      if (!prev) return prev;
      const exists = prev.categories.includes(value);
      return {
        ...prev,
        categories: exists ? prev.categories.filter((c) => c !== value) : [...prev.categories, value],
      };
    });
  };

  const allCategoriesSelected = useMemo(() => {
    if (!form) return false;
    if (categoriesOptions.length === 0) return false;
    return categoriesOptions.every((option) => form.categories.includes(option.id));
  }, [form, categoriesOptions]);

  const toggleAllCategories = () => {
    setForm((prev) => {
      if (!prev) return prev;
      const nextCategories = allCategoriesSelected ? [] : categoriesOptions.map((option) => option.id);
      return { ...prev, categories: nextCategories };
    });
  };

  const uploadImages = async (sources: string[]) => {
    const uploaded: string[] = [];
    for (const src of sources) {
      // Se já é uma URL válida (http/https), não precisa fazer upload
      if (!src.startsWith("data:") && (src.startsWith("http://") || src.startsWith("https://"))) {
        console.log('Imagem já é URL válida, mantendo:', src);
        uploaded.push(src);
        continue;
      }
      
      // Se é data URL (base64), fazer upload
      if (src.startsWith("data:")) {
        console.log('Fazendo upload de imagem base64...');
        const blob = await (await fetch(src)).blob();
        const formData = new FormData();
        formData.append("file", blob, `img-${Date.now()}.png`);
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { Authorization: `Bearer admin-token` },
          body: formData,
        });
        const json = await res.json();
        console.log('Resposta do upload:', json);
        if (!res.ok || !json?.ok || !json.url) {
          throw new Error("Falha no upload de imagem");
        }
        uploaded.push(json.url as string);
      } else {
        // Qualquer outra coisa, manter
        uploaded.push(src);
      }
    }
    return uploaded;
  };

  const handleSave = async () => {
    if (!form) return;
    try {
      setSaving(true);
      
      console.log('Imagens antes do upload:', {
        coverImages,
        avatarImages,
        galleryImages
      });
      
      const uploadedCover = await uploadImages(coverImages || []);
      const uploadedAvatar = await uploadImages(avatarImages || []);
      const uploadedGallery = await uploadImages(galleryImages || []);
      
      const coverUrl = uploadedCover[0] || form.cover;
      const avatarUrl = uploadedAvatar[0] || form.avatar;
      const galleryUrls = uploadedGallery.length > 0 ? uploadedGallery : form.gallery;
      
      console.log('URLs após upload:', {
        coverUrl,
        avatarUrl,
        galleryUrls
      });
      const payload: Partial<BancaForm> & { images?: { cover?: string; avatar?: string } } = {
        name: form.name || '',
        description: form.description || '',
        featured: form.featured || false,
        ctaUrl: form.ctaUrl || '',
        contact: form.contact || {},
        socials: form.socials || {},
        addressObj: form.addressObj || {},
        location: {
          lat: form.location?.lat ? Number(form.location.lat) : undefined,
          lng: form.location?.lng ? Number(form.location.lng) : undefined,
        },
        payments: Array.isArray(form.payments) ? form.payments : [],
        categories: Array.isArray(form.categories) ? form.categories : [],
        hours: Array.isArray(form.hours) ? form.hours : [],
        gallery: Array.isArray(galleryUrls) ? galleryUrls : [],
        images: {
          cover: coverUrl || undefined,
          avatar: avatarUrl || undefined,
        },
      };

      console.log('Enviando dados para API:', payload);
      
      const res = await fetch("/api/jornaleiro/banca", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ data: payload }),
      });
      
      const json = await res.json();
      console.log('Resposta da API:', json);
      
      if (!res.ok) {
        throw new Error(json.error || "Falha ao salvar banca");
      }

      if (json.data) {
        console.log('Dados retornados pelo servidor:', json.data);
        
        // Atualizar form com os dados retornados
        setForm((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            ...json.data,
            cover: json.data.cover_image || json.data.cover || coverUrl,
            avatar: json.data.cover_image || json.data.avatar || avatarUrl,
            gallery: json.data.gallery || galleryUrls,
            addressObj: prev.addressObj, // Manter addressObj do frontend
            contact: prev.contact,
            socials: prev.socials,
          };
        });

        // Atualizar as imagens no estado
        if (coverUrl) setCoverImages([coverUrl]);
        if (avatarUrl) setAvatarImages([avatarUrl]);
        if (galleryUrls.length > 0) setGalleryImages(galleryUrls);
      }
      
      toast.success("Dados da banca atualizados com sucesso!");
      router.refresh();
    } catch (e: any) {
      console.error('Erro ao salvar banca:', e);
      toast.error(e?.message || "Erro ao salvar banca");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">Carregando dados da banca...</div>;
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>;
  }

  if (notFound) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-orange-100 grid place-items-center text-orange-600">!</div>
        <h2 className="text-lg font-semibold mb-1">Nenhuma banca encontrada</h2>
        <p className="text-sm text-gray-600">Você ainda não possui uma banca vinculada à sua conta.</p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => router.push('/jornaleiro/registrar')}
            className="inline-flex items-center rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Cadastrar minha banca
          </button>
          <button
            onClick={() => router.push('/jornaleiro/dashboard')}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!form) {
    return <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">Preparando formulário...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Minha Banca</h1>
        <p className="text-sm text-gray-600">Atualize as informações exibidas para os clientes na sua página pública.</p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-sm font-medium">Nome da Banca</label>
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Nome da banca"
              />
            </div>
            <RichTextEditor
              label="Descrição"
              value={form.description}
              onChange={(html) => updateField("description", html)}
              placeholder="Conte um pouco sobre sua banca..."
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <div>
            <label className="text-sm font-medium">Imagem de Perfil (aparece redonda no perfil)</label>
            <ImageUploader
              multiple={false}
              max={1}
              value={avatarImages}
              onChange={(_, previews) => setAvatarImages(previews)}
              previewShape="circle"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Capa</label>
            <ImageUploader
              multiple={false}
              max={1}
              value={coverImages}
              onChange={(_, previews) => setCoverImages(previews)}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold">Contato e redes</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">WhatsApp</label>
              <input
                value={form.contact.whatsapp || ""}
                onChange={(e) => updateContact("whatsapp", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="(11) 91234-5678"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Instagram</label>
              <input
                value={form.socials.instagram || ""}
                onChange={(e) => updateSocial("instagram", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="https://instagram.com/suabanca"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Facebook</label>
              <input
                value={form.socials.facebook || ""}
                onChange={(e) => updateSocial("facebook", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="https://facebook.com/suabanca"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Google Maps / GMB</label>
              <input
                value={form.socials.gmb || ""}
                onChange={(e) => updateSocial("gmb", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold">Endereço</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">CEP</label>
              <div className="relative">
                <input
                  value={form.addressObj.cep || ""}
                  onChange={(e) => handleCepChange(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm pr-10"
                  placeholder="00000-000"
                  inputMode="numeric"
                  pattern="\\d*"
                  maxLength={8}
                  autoComplete="postal-code"
                />
                {loadingCep && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5">
                    <svg className="animate-spin h-4 w-4 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Digite o CEP (somente números) para buscar o endereço automaticamente
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Cidade</label>
              <input value={form.addressObj.city || ""} onChange={(e) => updateAddress("city", e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">Logradouro</label>
              <input value={form.addressObj.street || ""} onChange={(e) => updateAddress("street", e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">Número</label>
              <input value={form.addressObj.number || ""} onChange={(e) => updateAddress("number", e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">Bairro</label>
              <input value={form.addressObj.neighborhood || ""} onChange={(e) => updateAddress("neighborhood", e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">Complemento</label>
              <input value={form.addressObj.complement || ""} onChange={(e) => updateAddress("complement", e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">UF</label>
              <select
                value={form.addressObj.uf || ""}
                onChange={(e) => updateAddress("uf", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">{form.addressObj.cep ? 'Selecione' : 'Selecione o estado'}</option>
                {ESTADOS.map((e) => (
                  <option key={e.sigla} value={e.sigla}>
                    {e.sigla} - {e.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Campos de Latitude/Longitude ocultados conforme solicitação */}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Horários de funcionamento</h2>
          <span className="text-xs text-gray-500">Informe horário de abertura e fechamento para cada dia</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {form.hours.map((day) => (
            <div key={day.key} className="rounded-lg border border-gray-200 p-3">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>{day.label}</span>
                <label className="inline-flex items-center gap-1 text-xs text-gray-600">
                  <input type="checkbox" checked={day.open} onChange={(e) => updateHours(day.key, { open: e.target.checked })} className="rounded" />
                  Aberto
                </label>
              </div>
              {day.open ? (
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-gray-500">Abre</label>
                    <input type="time" value={day.start} onChange={(e) => updateHours(day.key, { start: e.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1" />
                  </div>
                  <div>
                    <label className="block text-gray-500">Fecha</label>
                    <input type="time" value={day.end} onChange={(e) => updateHours(day.key, { end: e.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1" />
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-xs text-gray-500">Fechado neste dia</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold">Pagamentos aceitos</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {PAYMENT_OPTIONS.map((option) => (
              <label key={option.value} className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.payments.includes(option.value)}
                  onChange={() => togglePayment(option.value)}
                  className="rounded"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold">Categorias atendidas</h2>
          <label className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={allCategoriesSelected}
              onChange={toggleAllCategories}
              className="rounded"
            />
            Selecionar todas
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {categoriesOptions.map((option) => (
              <label key={option.id} className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.categories.includes(option.id)}
                  onChange={() => toggleCategory(option.id)}
                  className="rounded"
                />
                {option.name}
              </label>
            ))}
            {categoriesOptions.length === 0 && (
              <p className="text-sm text-gray-500">Nenhuma categoria cadastrada ainda.</p>
            )}
          </div>
        </div>
      </section>

      {/* Galeria de imagens removida conforme solicitação */}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-75"
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </div>
  );
}

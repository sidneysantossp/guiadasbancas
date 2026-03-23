"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useCategories } from "@/lib/useCategories";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";
import { maskCEP, maskPhoneBR } from "@/lib/masks";
import { fetchViaCEP } from "@/lib/viacep";
import ImageUploadDragDrop from "@/components/admin/ImageUploadDragDrop";
import FileUploadDragDrop from "@/components/common/FileUploadDragDrop";
import CotistaSearch from "@/components/CotistaSearch";

export default function EditBancaPage() {
  const router = useRouter();
  const params = useParams();
  const bancaId = params.id as string;
  const { items: categories } = useCategories();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [cover, setCover] = useState("");
  const [avatar, setAvatar] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);

  // Track changes in cover and avatar
  const handleCoverChange = (url: string) => {
    console.log('handleCoverChange called with URL:', url);
    setCover(url);
    setHasChanges(true);
    console.log('hasChanges set to true');
  };

  const handleAvatarChange = (url: string) => {
    console.log('handleAvatarChange called with URL:', url);
    setAvatar(url);
    setHasChanges(true);
    console.log('hasChanges set to true');
  };
  const [tpuUrl, setTpuUrl] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [gmb, setGmb] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loadingCep, setLoadingCep] = useState(false);
    // Dono da banca (jornaleiro) e reset de senha (admin)
  const [ownerEmail, setOwnerEmail] = useState<string>("");
  const [resetPwd, setResetPwd] = useState<string>("");
  const [resetPwd2, setResetPwd2] = useState<string>("");
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const [resetErr, setResetErr] = useState<string | null>(null);
  // Estados para exclusão
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>("");

  // Estados para cotista
  const [isCotista, setIsCotista] = useState<boolean>(false);
  const [selectedCotista, setSelectedCotista] = useState<{
    id: string;
    codigo: string;
    razao_social: string;
    cnpj_cpf: string;
  } | null>(null);

  // Estados brasileiros
  const estados = [
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
    { sigla: 'TO', nome: 'Tocantins' }
  ];

  // Tabs configuration
  // Horários
  const [hours, setHours] = useState([
    { key: 'monday', label: 'Segunda', open: true, start: '08:00', end: '18:00' },
    { key: 'tuesday', label: 'Terça', open: true, start: '08:00', end: '18:00' },
    { key: 'wednesday', label: 'Quarta', open: true, start: '08:00', end: '18:00' },
    { key: 'thursday', label: 'Quinta', open: true, start: '08:00', end: '18:00' },
    { key: 'friday', label: 'Sexta', open: true, start: '08:00', end: '18:00' },
    { key: 'saturday', label: 'Sábado', open: true, start: '08:00', end: '13:00' },
    { key: 'sunday', label: 'Domingo', open: false, start: '08:00', end: '18:00' },
  ]);

  // Load banca data
  useEffect(() => {
    const loadBanca = async () => {
      try {
        setLoading(true);
        const res = await fetchAdminWithDevFallback(`/api/admin/bancas?id=${bancaId}`, {
          cache: 'no-store',
        });
        const json = await res.json();

        if (!res.ok || !json?.success) {
          setError(
            json?.error ||
              (res.status === 401 ? 'Sessão sem permissão de administrador.' : `Erro HTTP ${res.status}`)
          );
          return;
        }

        if (json.data) {
          const banca = json.data;
          setSuccess(null);
          setName(banca.name || "");
          setAddress(banca.address || "");
          setCep(banca.addressObj?.cep || banca.cep || "");
          setStreet(banca.addressObj?.street || "");
          setNumber(banca.addressObj?.number || "");
          setComplement(banca.addressObj?.complement || "");
          setNeighborhood(banca.addressObj?.neighborhood || "");
          setCity(banca.addressObj?.city || "");
          setUf(banca.addressObj?.uf || "");
          setLat(banca.lat?.toString() || banca.location?.lat?.toString() || "");
          setLng(banca.lng?.toString() || banca.location?.lng?.toString() || "");
          setCover(banca.cover || banca.cover_image || "");
          setAvatar(banca.avatar || banca.images?.avatar || "");
          setGallery(Array.isArray(banca.gallery) ? banca.gallery : []);
          setWhatsapp(banca.contact?.whatsapp || "");
          setFacebook(banca.socials?.facebook || "");
          setInstagram(banca.socials?.instagram || "");
          setGmb(banca.socials?.gmb || "");
          setDescription(banca.description || "");
          setActive(banca.active !== false);
          setFeatured(banca.featured || false);
          setSelectedCategories(banca.categories || []);
          if (banca.hours) setHours(banca.hours);
          if (banca.tpu_url) setTpuUrl(banca.tpu_url);
          // Email do jornaleiro (proprietário) quando disponível
          if (banca.ownerEmail) setOwnerEmail(String(banca.ownerEmail));
          // Dados do cotista
          setIsCotista(banca.is_cotista || false);
          if (banca.cotista_id) {
            setSelectedCotista({
              id: banca.cotista_id,
              codigo: banca.cotista_codigo || '',
              razao_social: banca.cotista_razao_social || '',
              cnpj_cpf: banca.cotista_cnpj_cpf || '',
            });
          }
        } else {
          setError("Banca não encontrada");
        }
      } catch (err) {
        setError("Erro ao carregar banca. Verifique a sessão de admin e a API.");
      } finally {
        setLoading(false);
      }
    };

    if (bancaId) {
      loadBanca();
    }
  }, [bancaId]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCepChange = async (value: string) => {
    const maskedCep = maskCEP(value);
    setCep(maskedCep);

    if (maskedCep.length === 9) {
      setLoadingCep(true);
      try {
        const data = await fetchViaCEP(maskedCep);
        if (data) {
          setStreet(data.logradouro || "");
          setNeighborhood(data.bairro || "");
          setCity(data.localidade || "");
          setUf(data.uf || "");
          setAddress(`${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`);
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      } finally {
        setLoadingCep(false);
      }
    } else {
      // Limpar campos quando CEP for inválido
      if (maskedCep.length < 9) {
        setStreet("");
        setNeighborhood("");
        setCity("");
        setUf("");
      }
    }
  };

  // Resetar senha do jornaleiro (admin-only)
  const onResetPassword = async () => {
    setResetErr(null);
    setResetMsg(null);
    const email = ownerEmail.trim();
    if (!email) {
      setResetErr('Informe o e-mail do jornaleiro.');
      return;
    }
    if (resetPwd.length < 6) {
      setResetErr('A nova senha deve ter ao menos 6 caracteres.');
      return;
    }
    if (resetPwd !== resetPwd2) {
      setResetErr('As senhas não coincidem.');
      return;
    }
    setResetLoading(true);
    try {
      const res = await fetchAdminWithDevFallback('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password: resetPwd })
      });
      const j = await res.json().catch(()=>({}));
      if (!res.ok || j?.error) {
        setResetErr(j?.error || 'Falha ao resetar senha. Verifique se a função SQL reset está instalada e a variável ALLOW_LOCAL_RESET=true.');
        return;
      }
      setResetMsg('Senha atualizada com sucesso. Avise o jornaleiro.');
      setResetPwd('');
      setResetPwd2('');
    } catch (e) {
      setResetErr('Erro de conexão ao resetar senha.');
    } finally {
      setResetLoading(false);
    }
  };

  // Verificar se CEP está preenchido corretamente
  const isCepValid = cep.length === 9;


  const updateHour = (index: number, field: string, value: any) => {
    setHours(prev => prev.map((hour, i) =>
      i === index ? { ...hour, [field]: value } : hour
    ));
  };

  // Função para excluir banca
  const handleDeleteBanca = async () => {
    if (deleteConfirmText !== name) {
      alert('O nome digitado não confere com o nome da banca. Digite exatamente: ' + name);
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetchAdminWithDevFallback(`/api/admin/bancas?id=${bancaId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao excluir banca');
      }

      alert('Banca excluída com sucesso!');
      router.push('/admin/cms/bancas'); // Redirecionar para listagem
    } catch (error: any) {
      console.error('Erro ao excluir banca:', error);
      alert('Erro ao excluir banca: ' + error.message);
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const data = {
        id: bancaId,
        name,
        address,
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
        cover,
        avatar,
        tpu_url: tpuUrl || undefined,
        description,
        addressObj: { cep, street, number, complement, neighborhood, city, uf },
        contact: { whatsapp },
        socials: { facebook, instagram, gmb },
        categories: selectedCategories,
        hours,
        featured,
        active,
        gallery,
        is_cotista: isCotista,
        cotista_id: selectedCotista?.id || null,
        cotista_codigo: selectedCotista?.codigo || null,
        cotista_razao_social: selectedCotista?.razao_social || null,
        cotista_cnpj_cpf: selectedCotista?.cnpj_cpf || null,
      };

      const res = await fetchAdminWithDevFallback('/api/admin/bancas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'},
        body: JSON.stringify({ data })
      });

      const json = await res.json();

      if (res.ok && json?.success) {
        setSuccess('Dados atualizados com sucesso.');
        setHasChanges(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setSuccess(null), 5000);
      } else {
        setError(json?.error || 'Erro ao atualizar banca');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4 rounded-lg border border-gray-200 bg-white p-4">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

    return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editar Banca</h1>
        <p className="text-gray-500 mt-1">Gerencie os dados, endereço, horários e configurações da banca.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-3 border border-red-100">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">{error}</div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-start gap-3 border border-green-100">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">{success}</div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-8">
          {/* INFORMAÇÕES BÁSICAS */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Informações Básicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Banca <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Responsável</label>
                <input
                  type="text"
                  value={ownerEmail}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição Curta</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* ACESSO AO SISTEMA */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Acesso ao Sistema</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-mail de Acesso (Login)</label>
                <input
                  type="email"
                  value={ownerEmail}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-2">
                  E-mail utilizado pelo jornaleiro para acessar o painel.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Redefinir Senha</h3>
                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="Nova Senha"
                    value={resetPwd}
                    onChange={(e) => setResetPwd(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="password"
                    placeholder="Confirmar Nova Senha"
                    value={resetPwd2}
                    onChange={(e) => setResetPwd2(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />

                  {resetErr && <p className="text-red-600 text-xs font-medium">{resetErr}</p>}
                  {resetMsg && <p className="text-green-600 text-xs font-medium">{resetMsg}</p>}

                  <button
                    type="button"
                    onClick={onResetPassword}
                    disabled={!resetPwd || resetPwd !== resetPwd2 || resetLoading}
                    className="w-full px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 disabled:opacity-50 transition-colors"
                  >
                    {resetLoading ? 'Salvando...' : 'Alterar Senha'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* DADOS DE CONTATO E REDES */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Contato e Redes Sociais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(maskPhoneBR(e.target.value))}
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">@</span>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value.replace('@', ''))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">@</span>
                  <input
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value.replace('@', ''))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ENDEREÇO */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Localização</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').substring(0, 9))}
                    onBlur={(e) => {
                      if (e.target.value.length === 9) handleCepChange(e.target.value);
                    }}
                    placeholder="00000-000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  {loadingCep && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Logradouro / Rua</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                <input
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Complemento / Referência</label>
                <input
                  type="text"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado (UF)</label>
                <input
                  type="text"
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                  maxLength={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 uppercase"
                />
              </div>
            </div>
          </div>

          {/* COTISTA / TPU */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Vínculo de Cotista (TPU)</h2>
                <p className="text-sm text-gray-500">Vincule esta banca a um cotista para uso do PDV.</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isCotista}
                    onChange={(e) => setIsCotista(e.target.checked)}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${isCotista ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isCotista ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">É Banca Cotista</span>
              </label>
            </div>

            {isCotista && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                <CotistaSearch
                  onSelect={(c) => setSelectedCotista(c ? { id: c.id, codigo: c.codigo, razao_social: c.razao_social, cnpj_cpf: c.cnpj_cpf } : null)}
                  initialValue={selectedCotista?.codigo}
                  disabled={false}
                />

                {selectedCotista && (
                  <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">Cotista Selecionado</h4>
                      <button
                        type="button"
                        onClick={() => setSelectedCotista(null)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors"
                      >
                        Remover
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 block text-xs mb-1">Código TPU</span>
                        <span className="font-medium font-mono text-primary bg-primary/5 px-2 py-0.5 rounded">
                          {selectedCotista.codigo}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs mb-1">CNPJ/CPF</span>
                        <span className="font-medium">{selectedCotista.cnpj_cpf}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500 block text-xs mb-1">Razão Social / Nome</span>
                        <span className="font-medium">{selectedCotista.razao_social}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* HORÁRIOS */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Horários de Funcionamento</h2>
                <p className="text-sm text-gray-500">Defina os horários em que a banca está aberta.</p>
              </div>
            </div>

            <div className="space-y-4">
              {hours.map((day, index) => (
                <div key={day.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4 w-48">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={day.open}
                          onChange={(e) => {
                            const newHours = [...hours];
                            newHours[index].open = e.target.checked;
                            setHours(newHours);
                          }}
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${day.open ? 'bg-primary' : 'bg-gray-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${day.open ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                    </label>
                    <span className="font-medium text-gray-700 w-24">{day.label}</span>
                  </div>

                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="time"
                      value={day.start}
                      disabled={!day.open}
                      onChange={(e) => {
                        const newHours = [...hours];
                        newHours[index].start = e.target.value;
                        setHours(newHours);
                      }}
                      className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-400"
                    />
                    <span className="text-gray-500">às</span>
                    <input
                      type="time"
                      value={day.end}
                      disabled={!day.open}
                      onChange={(e) => {
                        const newHours = [...hours];
                        newHours[index].end = e.target.value;
                        setHours(newHours);
                      }}
                      className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>

                  {!day.start && (
                    <span className="text-sm text-gray-500 italic ml-4">Fechado</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* IMAGENS */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Imagens da Banca</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto Principal (Avatar)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                  <ImageUploadDragDrop
                    label="Arraste a imagem ou clique para selecionar"
                    onUpload={async (url) => handleAvatarChange(url)}
                    currentImage={avatar}
                    onRemove={() => handleAvatarChange('')}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Recomendado: Imagem quadrada (ex: 500x500px), formato JPG, PNG ou WebP. Máx 2MB.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de Capa (Banner)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                  <ImageUploadDragDrop
                    label="Arraste a imagem de capa ou clique"
                    onUpload={async (url) => handleCoverChange(url)}
                    currentImage={cover}
                    onRemove={() => handleCoverChange('')}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Recomendado: Imagem retangular horizontal (ex: 1200x400px).
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Galeria de Fotos (até 5)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                  <FileUploadDragDrop
                    label="Arraste até 5 fotos para a galeria"
                    onUploadAction={async (urls) => setGallery(prev => [...prev, ...urls].slice(0, 5))}
                    currentFiles={gallery}
                    onRemoveAction={(url) => setGallery(prev => prev.filter(u => u !== url))}
                    maxFiles={5}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CATEGORIAS */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Categorias</h2>
            <p className="text-sm text-gray-500 mb-4">Selecione as categorias em que esta banca se enquadra.</p>
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <label key={category.key} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category.key]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(id => id !== category.key));
                        }
                      }}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span className="text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* CONFIGURAÇÕES DE ADMIN */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Configurações e Permissões</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex items-center justify-between cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1 pr-4">
                  <span className="block text-sm font-medium text-gray-900">Banca Ativa</span>
                  <span className="block text-xs text-gray-500 mt-1">Se ativa, a banca ficará visível no portal.</span>
                </div>
                <div className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${active ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${active ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1 pr-4">
                  <span className="block text-sm font-medium text-gray-900">Em Destaque</span>
                  <span className="block text-xs text-gray-500 mt-1">Bancas em destaque aparecem no topo das listagens.</span>
                </div>
                <div className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${featured ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${featured ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </label>
            </div>
          </div>

          {/* ZONA DE PERIGO (EXCLUSÃO) */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Zona de Perigo</h2>
            <p className="text-sm text-red-600 mb-6">Ações irreversíveis para esta banca.</p>

            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors font-medium text-sm"
              >
                Excluir Banca
              </button>
            ) : (
              <div className="bg-white border border-red-200 p-4 rounded-lg">
                <p className="text-sm text-gray-700 font-medium mb-4">
                  Tem certeza? Para confirmar, digite <strong className="text-red-600">EXCLUIR</strong> no campo abaixo:
                </p>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    placeholder="Digite EXCLUIR"
                  />
                  <button
                    type="button"
                    onClick={handleDeleteBanca}
                    disabled={deleteConfirmText !== 'EXCLUIR' || deleteLoading}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {deleteLoading ? 'Excluindo...' : 'Confirmar Exclusão'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText('');
                    }}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm border border-gray-200"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* BOTÕES FLUTUANTES (SAVE) */}
          <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 flex justify-end gap-4 px-6 md:px-12">
            {success && (
              <div className="mr-auto inline-flex items-center rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                {success}
              </div>
            )}
            <Link
              href="/admin/cms/bancas"
              className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center shadow-md disabled:opacity-50"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

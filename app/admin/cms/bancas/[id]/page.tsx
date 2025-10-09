"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCategories } from "@/lib/useCategories";
import { maskCEP, maskPhoneBR } from "@/lib/masks";
import { fetchViaCEP } from "@/lib/viacep";
import ImageUploadDragDrop from "@/components/admin/ImageUploadDragDrop";

export default function EditBancaPage() {
  const router = useRouter();
  const params = useParams();
  const bancaId = params.id as string;
  const { items: categories } = useCategories();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
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
  const [whatsapp, setWhatsapp] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [gmb, setGmb] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loadingCep, setLoadingCep] = useState(false);
  const [activeTab, setActiveTab] = useState('basico');
  // Dono da banca (jornaleiro) e reset de senha (admin)
  const [ownerEmail, setOwnerEmail] = useState<string>("");
  const [resetPwd, setResetPwd] = useState<string>("");
  const [resetPwd2, setResetPwd2] = useState<string>("");
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const [resetErr, setResetErr] = useState<string | null>(null);
  
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
  const tabs = [
    { id: 'basico', label: 'Básico', icon: '📝' },
    { id: 'endereco', label: 'Endereço', icon: '📍' },
    { id: 'contato', label: 'Contato', icon: '📱' },
    { id: 'imagens', label: 'Imagens', icon: '🖼️' },
    { id: 'horarios', label: 'Horários', icon: '⏰' },
    { id: 'configuracoes', label: 'Configurações', icon: '⚙️' },
  ];
  
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
        const res = await fetch(`/api/admin/bancas?id=${bancaId}`, {
          headers: { 'Authorization': 'Bearer admin-token' }
        });
        const json = await res.json();
        
        if (json?.success && json.data) {
          const banca = json.data;
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
          setWhatsapp(banca.contact?.whatsapp || "");
          setFacebook(banca.socials?.facebook || "");
          setInstagram(banca.socials?.instagram || "");
          setGmb(banca.socials?.gmb || "");
          setDescription(banca.description || "");
          setActive(banca.active !== false);
          setFeatured(banca.featured || false);
          setSelectedCategories(banca.categories || []);
          if (banca.hours) setHours(banca.hours);
          // Email do jornaleiro (proprietário) quando disponível
          if (banca.ownerEmail) setOwnerEmail(String(banca.ownerEmail));
        } else {
          setError("Banca não encontrada");
        }
      } catch (err) {
        setError("Erro ao carregar banca");
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
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer admin-token' },
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

  // Navegação entre abas
  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const canGoNext = currentTabIndex < tabs.length - 1;

  const goToNextTab = () => {
    if (canGoNext) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  // Botão reutilizável de "Próximo" para navegar entre abas
  const TabNextButton = () => (
    canGoNext ? (
      <div className="pt-4 border-t border-gray-200 text-right">
        <button
          type="button"
          onClick={goToNextTab}
          className="px-4 py-2 text-sm font-medium text-white bg-[#ff5c00] rounded-md hover:opacity-90"
        >
          Próximo →
        </button>
      </div>
    ) : null
  );

  const updateHour = (index: number, field: string, value: any) => {
    setHours(prev => prev.map((hour, i) => 
      i === index ? { ...hour, [field]: value } : hour
    ));
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
        description,
        addressObj: { cep, street, number, complement, neighborhood, city, uf },
        contact: { whatsapp },
        socials: { facebook, instagram, gmb },
        categories: selectedCategories,
        hours,
        featured,
        active,
      };

      const res = await fetch('/api/admin/bancas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify({ data })
      });

      const json = await res.json();
      
      if (json?.success) {
        setSuccess('Banca atualizada com sucesso!');
        setTimeout(() => {
          router.push('/admin/cms/bancas');
        }, 1500);
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
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Editar Banca</h1>
        <p className="text-sm text-gray-600">Atualize as informações da banca.</p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-red-800 font-medium">{error}</div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="rounded-md bg-green-50 border border-green-200 p-4">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-green-800 font-medium">{success}</div>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Coluna Principal com Tabs */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tab Navigation */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                      ${activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Aba Básico */}
              {activeTab === 'basico' && (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Nome da Banca</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Descrição</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        placeholder="Descrição da banca..."
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  <TabNextButton />
                </>
              )}

              {/* Aba Endereço */}
              {activeTab === 'endereco' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="md:col-span-1">
                      <label className="text-sm font-medium">CEP</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cep}
                          onChange={(e) => handleCepChange(e.target.value)}
                          placeholder="00000-000"
                          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                        />
                        {loadingCep && (
                          <div className="absolute right-2 top-3">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-4">
                      <label className="text-sm font-medium">Endereço</label>
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        disabled={!isCepValid}
                        className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500 ${
                          !isCepValid ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300'
                        }`}
                        placeholder={!isCepValid ? "Preencha o CEP primeiro" : "Rua, avenida, etc."}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="text-sm font-medium">Número</label>
                      <input
                        type="text"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        disabled={!isCepValid}
                        className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500 ${
                          !isCepValid ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300'
                        }`}
                        placeholder={!isCepValid ? "CEP" : "123"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Complemento</label>
                      <input
                        type="text"
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                        disabled={!isCepValid}
                        placeholder={!isCepValid ? "Preencha o CEP primeiro" : "Apto, sala, etc."}
                        className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500 ${
                          !isCepValid ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Bairro</label>
                      <input
                        type="text"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        disabled={!isCepValid}
                        className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500 ${
                          !isCepValid ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300'
                        }`}
                        placeholder={!isCepValid ? "Preencha o CEP primeiro" : "Nome do bairro"}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Cidade</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={!isCepValid}
                        className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500 ${
                          !isCepValid ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300'
                        }`}
                        placeholder={!isCepValid ? "Preencha o CEP primeiro" : "Nome da cidade"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Estado (UF)</label>
                      <select
                        value={uf}
                        onChange={(e) => setUf(e.target.value)}
                        disabled={!isCepValid}
                        className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500 ${
                          !isCepValid ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300'
                        }`}
                      >
                        <option value="">
                          {!isCepValid ? "Preencha o CEP primeiro" : "Selecione o estado"}
                        </option>
                        {estados.map((estado) => (
                          <option key={estado.sigla} value={estado.sigla}>
                            {estado.sigla} - {estado.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Latitude</label>
                      <input
                        type="text"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        disabled={!isCepValid}
                        placeholder={!isCepValid ? "Preencha o CEP primeiro" : "-23.5505"}
                        className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500 ${
                          !isCepValid ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Longitude</label>
                      <input
                        type="text"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        disabled={!isCepValid}
                        placeholder={!isCepValid ? "Preencha o CEP primeiro" : "-46.6333"}
                        className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500 ${
                          !isCepValid ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Endereço Completo</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      disabled={!isCepValid}
                      placeholder={!isCepValid ? "Preencha o CEP primeiro para gerar o endereço completo" : "Endereço completo para exibição"}
                      className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500 ${
                        !isCepValid ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  {!isCepValid && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">
                            <strong>Dica:</strong> Preencha o CEP primeiro para habilitar os demais campos e buscar automaticamente as informações do endereço.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <TabNextButton />
                </div>
              )}

              {/* Aba Contato */}
              {activeTab === 'contato' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">WhatsApp</label>
                      <input
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(maskPhoneBR(e.target.value))}
                        placeholder="(11) 99999-9999"
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Facebook</label>
                      <input
                        type="url"
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                        placeholder="https://facebook.com/..."
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Instagram</label>
                      <input
                        type="url"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="https://instagram.com/..."
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Google Meu Negócio</label>
                      <input
                        type="url"
                        value={gmb}
                        onChange={(e) => setGmb(e.target.value)}
                        placeholder="https://maps.google.com/..."
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  <TabNextButton />
                </div>
              )}

              {/* Aba Imagens */}
              {activeTab === 'imagens' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageUploadDragDrop
                    label="Imagem de Capa"
                    value={cover}
                    onChange={setCover}
                    placeholder="https://exemplo.com/capa.jpg"
                    className="h-40 w-full"
                  />
                  <ImageUploadDragDrop
                    label="Imagem de Perfil/Avatar"
                    value={avatar}
                    onChange={setAvatar}
                    placeholder="https://exemplo.com/avatar.jpg"
                    className="h-40 w-40 mx-auto"
                  />
                  <TabNextButton />
                </div>
              )}

              {/* Aba Horários */}
              {activeTab === 'horarios' && (
                <div className="space-y-3">
                  {hours.map((hour, index) => (
                    <div key={hour.key} className="flex items-center gap-4">
                      <div className="w-20">
                        <span className="text-sm font-medium">{hour.label}</span>
                      </div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={hour.open}
                          onChange={(e) => updateHour(index, 'open', e.target.checked)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm">Aberto</span>
                      </label>
                      {hour.open && (
                        <>
                          <input
                            type="time"
                            value={hour.start}
                            onChange={(e) => updateHour(index, 'start', e.target.value)}
                            className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-orange-500 focus:ring-orange-500"
                          />
                          <span className="text-sm">às</span>
                          <input
                            type="time"
                            value={hour.end}
                            onChange={(e) => updateHour(index, 'end', e.target.value)}
                            className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-orange-500 focus:ring-orange-500"
                          />
                        </>
                      )}
                    </div>
                  ))}
                  <TabNextButton />
                </div>
              )}

              {/* Aba Configurações */}
              {activeTab === 'configuracoes' && (
                <div className="space-y-6">
                  {/* Status */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Status da Banca</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={(e) => setActive(e.target.checked)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm">Banca ativa (visível no site)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={featured}
                          onChange={(e) => setFeatured(e.target.checked)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm">Banca em destaque</span>
                      </label>
                    </div>
                  </div>

                  {/* Categorias */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Categorias</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                      {categories.map((category: any) => (
                        <label key={category.id} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => toggleCategory(category.id)}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <span>{category.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Resetar Senha do Jornaleiro (visível dentro da aba Configurações) */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium mb-2">Resetar senha do jornaleiro</h4>
                    <p className="text-xs text-gray-500 mb-3">Use esta ação se o jornaleiro esqueceu a senha. Será aplicada imediatamente.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="block">
                        <span className="text-gray-700 text-sm">E-mail do jornaleiro</span>
                        <input
                          type="email"
                          value={ownerEmail}
                          onChange={(e)=>setOwnerEmail(e.target.value)}
                          placeholder="email@banca.com"
                          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                      </label>
                      <label className="block">
                        <span className="text-gray-700 text-sm">Nova senha</span>
                        <input
                          type="password"
                          value={resetPwd}
                          onChange={(e)=>setResetPwd(e.target.value)}
                          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                      </label>
                      <label className="block">
                        <span className="text-gray-700 text-sm">Confirmar senha</span>
                        <input
                          type="password"
                          value={resetPwd2}
                          onChange={(e)=>setResetPwd2(e.target.value)}
                          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                      </label>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={onResetPassword}
                          disabled={resetLoading}
                          className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                          {resetLoading ? 'Aplicando...' : 'Aplicar nova senha'}
                        </button>
                      </div>
                    </div>
                    {resetErr && (
                      <div className="mt-2 rounded-md bg-red-50 border border-red-200 p-2 text-xs text-red-700">{resetErr}</div>
                    )}
                    {resetMsg && (
                      <div className="mt-2 rounded-md bg-green-50 border border-green-200 p-2 text-xs text-green-700">{resetMsg}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Ações */}
        <div className="space-y-4">
          {/* Resumo */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="text-sm font-medium mb-3">Resumo</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={active ? 'text-green-600' : 'text-red-600'}>
                  {active ? 'Ativa' : 'Inativa'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Destaque:</span>
                <span className={featured ? 'text-yellow-600' : 'text-gray-400'}>
                  {featured ? 'Sim' : 'Não'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Categorias:</span>
                <span>{selectedCategories.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Aba atual:</span>
                <span className="capitalize">{tabs.find(t => t.id === activeTab)?.label}</span>
              </div>
            </div>
          </div>

          {/* Navegação rápida */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="text-sm font-medium mb-3">Navegação rápida</h3>
            <div className="grid grid-cols-2 gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors
                    ${activeTab === tab.id
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ações */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="space-y-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-md bg-[#ff5c00] px-3 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/cms/bancas')}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>

          {/* Resetar Senha do Jornaleiro */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="text-sm font-medium mb-2">Resetar senha do jornaleiro</h3>
            <p className="text-xs text-gray-500 mb-3">Use esta ação se o jornaleiro esqueceu a senha. Será aplicada imediatamente.</p>
            <div className="space-y-2 text-sm">
              <label className="block">
                <span className="text-gray-700">E-mail do jornaleiro</span>
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e)=>setOwnerEmail(e.target.value)}
                  placeholder="email@banca.com"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Nova senha</span>
                <input
                  type="password"
                  value={resetPwd}
                  onChange={(e)=>setResetPwd(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Confirmar senha</span>
                <input
                  type="password"
                  value={resetPwd2}
                  onChange={(e)=>setResetPwd2(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              {resetErr && (
                <div className="rounded-md bg-red-50 border border-red-200 p-2 text-xs text-red-700">{resetErr}</div>
              )}
              {resetMsg && (
                <div className="rounded-md bg-green-50 border border-green-200 p-2 text-xs text-green-700">{resetMsg}</div>
              )}
              <button
                type="button"
                onClick={onResetPassword}
                disabled={resetLoading}
                className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {resetLoading ? 'Aplicando...' : 'Aplicar nova senha'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

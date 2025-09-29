"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchViaCEP, ViaCEP } from "@/lib/viacep";
import { maskCEP, maskCPF, maskPhoneBR } from "@/lib/masks";

export default function JornaleiroRegisterPage() {
  const router = useRouter();

  // Steps
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [lastCepFetched, setLastCepFetched] = useState<string>("");
  const cepInputRef = useRef<HTMLInputElement | null>(null);
  const numberInputRef = useRef<HTMLInputElement | null>(null);
  const [socialsSkipped, setSocialsSkipped] = useState<boolean>(false);

  // Step 1: Seller
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const cpfInputRef = useRef<HTMLInputElement | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  // Força da senha (0 a 4)
  const passwordScore = (s: string) => {
    let score = 0;
    if (!s) return 0;
    if (s.length >= 8) score++;
    if (/[a-z]/.test(s)) score++;
    if (/[A-Z]/.test(s)) score++;
    if (/[0-9]/.test(s)) score++;
    if (/[^A-Za-z0-9]/.test(s)) score++;
    if (s.length >= 12) score++;
    // normaliza em 0..4
    return Math.min(4, Math.max(0, Math.floor(score / 1.5)));
  };

  // Geocodificar lat/lng a partir do endereço/CEP (Nominatim)
  const geocodeAddress = async () => {
    try {
      setError(null);
      const cepOnly = (cep || "").replace(/\D/g, "");
      const parts = [street, number, neighborhood, city, uf, cepOnly, "Brasil"].filter(Boolean);
      if (parts.length === 0) return;
      const q = encodeURIComponent(parts.join(", "));
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${q}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        if (first?.lat && first?.lon) {
          setLat2(String(first.lat));
          setLng2(String(first.lon));
          return;
        }
      }
      setError('Não foi possível geocodificar o endereço. Verifique os campos.');
    } catch {
      setError('Falha ao consultar geocodificação.');
    }
  };
  const scoreToMeta = (n: number) => {
    const meta = [
      { label: 'Muito fraca', color: 'bg-rose-500', width: 'w-1/5' },
      { label: 'Fraca', color: 'bg-orange-500', width: 'w-2/5' },
      { label: 'Média', color: 'bg-amber-500', width: 'w-3/5' },
      { label: 'Forte', color: 'bg-emerald-500', width: 'w-4/5' },
      { label: 'Muito forte', color: 'bg-green-600', width: 'w-full' },
    ];
    return meta[Math.max(0, Math.min(4, n))];
  };

  // Step 2: Bank
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankCoverUrl, setBankCoverUrl] = useState("");
  const [bankProfileUrl, setBankProfileUrl] = useState("");
  const [servicePhone, setServicePhone] = useState("");
  const [lat2, setLat2] = useState<string>("");
  const [lng2, setLng2] = useState<string>("");
  const [bankCoverPreview, setBankCoverPreview] = useState<string>("");
  const [bankProfilePreview, setBankProfilePreview] = useState<string>("");

  // Socials
  const [gmbHas, setGmbHas] = useState<"yes" | "no">("no");
  const [gmbUrl, setGmbUrl] = useState("");
  const [facebookHas, setFacebookHas] = useState<"yes" | "no">("no");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramHas, setInstagramHas] = useState<"yes" | "no">("no");
  const [instagramUrl, setInstagramUrl] = useState("");

  // Step 3: Hours
  type Day = { key: string; label: string; open: boolean; start: string; end: string };
  const defaultHours: Day[] = [
    { key: 'mon', label: 'Segunda', open: true, start: '08:00', end: '18:00' },
    { key: 'tue', label: 'Terça', open: true, start: '08:00', end: '18:00' },
    { key: 'wed', label: 'Quarta', open: true, start: '08:00', end: '18:00' },
    { key: 'thu', label: 'Quinta', open: true, start: '08:00', end: '18:00' },
    { key: 'fri', label: 'Sexta', open: true, start: '08:00', end: '18:00' },
    { key: 'sat', label: 'Sábado', open: true, start: '08:00', end: '13:00' },
    { key: 'sun', label: 'Domingo', open: false, start: '09:00', end: '12:00' },
  ];
  const [hours, setHours] = useState<Day[]>(defaultHours);
  // Lista acumulada de bancas no wizard
  type Bank = { name: string; whatsapp: string; images: { cover: string; profile: string }; address: { cep: string; street: string; number: string; complement: string; neighborhood: string; city: string; uf: string }; socials: { gmb: string; facebook: string; instagram: string }; hours: Day[]; meta?: { socialsSkipped?: boolean; socialsLinks?: { facebook?: string; instagram?: string }; location?: { lat?: number; lng?: number } } };
  const [banks, setBanks] = useState<Bank[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    // if already logged in, go dashboard
    try {
      const auth = localStorage.getItem("gb:sellerAuth");
      if (auth === "1") router.replace("/jornaleiro/dashboard" as any);
    } catch {}
  }, [router]);

  // CEP preenchido (8 dígitos)
  const cepReady = ((cep || "").replace(/\D/g, "").length === 8);
  const cepOnly = (cep || "").replace(/\D/g, "");
  const cepValid = cepOnly.length === 8 && lastCepFetched === cepOnly && !cepError;

  // Validação CPF utilitária (mesma regra do validateStep1)
  const isValidCPF = (v: string) => {
    const only = (v || '').replace(/\D/g, '');
    if (only.length !== 11 || /^([0-9])\1+$/.test(only)) return false;
    const dv = (nums: string, factor: number) => {
      let sum = 0; for (let i=0;i<factor-1;i++) sum += parseInt(nums[i]) * (factor - i);
      const r = (sum * 10) % 11; return r === 10 ? 0 : r;
    };
    const d1 = dv(only, 10); if (d1 !== parseInt(only[9])) return false;
    const d2 = dv(only, 11); if (d2 !== parseInt(only[10])) return false;
    return true;
  };
  const cpfOnly = (cpf || '').replace(/\D/g, '');
  const cpfValid = isValidCPF(cpf);
  const phoneOnly = (phone || '').replace(/\D/g, '');
  const phoneValid = phoneOnly.length === 11; // celular BR (DDD + 9 dígitos)
  const emailValid = !!email && /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);

  // Restaurar lastCepFetched para evitar refetch após refresh
  useEffect(() => {
    try {
      const last = localStorage.getItem('gb:lastCepFetched');
      if (last) setLastCepFetched(last);
    } catch {}
  }, []);

  // Restaurar progresso do wizard
  useEffect(() => {
    try {
      const raw = localStorage.getItem('gb:sellerWizard');
      if (!raw) return;
      const w = JSON.parse(raw);
      if (w.step) setStep(w.step);
      if (w.name) setName(w.name);
      if (w.cpf) setCpf(w.cpf);
      if (w.phone) setPhone(w.phone);
      if (w.email) setEmail(w.email);
      if (w.password) setPassword(w.password);
      if (w.cep) setCep(w.cep);
      if (w.street) setStreet(w.street);
      if (w.number) setNumber(w.number);
      if (w.complement) setComplement(w.complement);
      if (w.neighborhood) setNeighborhood(w.neighborhood);
      if (w.city) setCity(w.city);
      if (w.uf) setUf(w.uf);
      if (w.bankName) setBankName(w.bankName);
      if (w.bankCoverUrl) { setBankCoverUrl(w.bankCoverUrl); setBankCoverPreview(w.bankCoverUrl); }
      if (w.bankProfileUrl) { setBankProfileUrl(w.bankProfileUrl); setBankProfilePreview(w.bankProfileUrl); }
      if (w.servicePhone) setServicePhone(w.servicePhone);
      if (w.gmbHas) setGmbHas(w.gmbHas);
      if (w.gmbUrl) setGmbUrl(w.gmbUrl);
      if (w.facebookHas) setFacebookHas(w.facebookHas);
      if (w.facebookUrl) setFacebookUrl(w.facebookUrl);
      if (w.instagramHas) setInstagramHas(w.instagramHas);
      if (w.instagramUrl) setInstagramUrl(w.instagramUrl);
      if (Array.isArray(w.hours)) setHours(w.hours);
    } catch {}
  }, []);

  // Salvar progresso do wizard
  useEffect(() => {
    const payload = { step, name, cpf, phone, email, password, cep, street, number, complement, neighborhood, city, uf, bankName, bankCoverUrl: bankCoverPreview || bankCoverUrl, bankProfileUrl: bankProfilePreview || bankProfileUrl, servicePhone, gmbHas, gmbUrl, facebookHas, facebookUrl, instagramHas, instagramUrl, hours, banks };
    try { localStorage.setItem('gb:sellerWizard', JSON.stringify(payload)); } catch {}
  }, [step, name, cpf, phone, email, password, cep, street, number, complement, neighborhood, city, uf, bankName, bankCoverUrl, bankProfileUrl, bankCoverPreview, bankProfilePreview, servicePhone, gmbHas, gmbUrl, facebookHas, facebookUrl, instagramHas, instagramUrl, hours, banks]);

  // Auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  // Confirmar saída se houver rascunho
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      try {
        const raw = localStorage.getItem('gb:sellerWizard');
        if (raw) {
          e.preventDefault();
          e.returnValue = '';
        }
      } catch {}
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const fetchAndFillCep = async (onlyCep: string) => {
    if (!onlyCep || onlyCep.length !== 8) return;
    if (onlyCep === lastCepFetched) return;
    setLoadingCep(true);
    setCepError(null);
    const data: ViaCEP | null = await fetchViaCEP(onlyCep);
    setLoadingCep(false);
    if (data) {
      setStreet(data.logradouro || "");
      setNeighborhood(data.bairro || "");
      setCity(data.localidade || "");
      setUf(data.uf || "");
      setLastCepFetched(onlyCep);
      try { localStorage.setItem('gb:lastCepFetched', onlyCep); } catch {}
      // Focar no campo Número para agilizar o preenchimento
      setTimeout(() => numberInputRef.current?.focus(), 0);
    } else {
      setCepError('CEP não encontrado. Verifique e tente novamente.');
      // Selecionar o CEP para facilitar correção
      setTimeout(() => {
        if (cepInputRef.current) {
          cepInputRef.current.focus();
          cepInputRef.current.select();
        }
      }, 0);
    }
  };

  const onCepBlur = async () => {
    const only = (cep || "").replace(/\D/g, "");
    if (only.length !== 8) { setCepError('CEP incompleto.'); return; }
    await fetchAndFillCep(only);
  };

  // Buscar CEP automaticamente quando atingir 8 dígitos (sem debounce)
  useEffect(() => {
    const only = (cep || "").replace(/\D/g, "");
    if (only.length !== 8) return;
    if (only === lastCepFetched) return;
    fetchAndFillCep(only);
  }, [cep, lastCepFetched]);

  // Lista de estados (sigla + nome)
  const STATES: { uf: string; name: string }[] = [
    { uf: 'AC', name: 'Acre' },
    { uf: 'AL', name: 'Alagoas' },
    { uf: 'AP', name: 'Amapá' },
    { uf: 'AM', name: 'Amazonas' },
    { uf: 'BA', name: 'Bahia' },
    { uf: 'CE', name: 'Ceará' },
    { uf: 'DF', name: 'Distrito Federal' },
    { uf: 'ES', name: 'Espírito Santo' },
    { uf: 'GO', name: 'Goiás' },
    { uf: 'MA', name: 'Maranhão' },
    { uf: 'MT', name: 'Mato Grosso' },
    { uf: 'MS', name: 'Mato Grosso do Sul' },
    { uf: 'MG', name: 'Minas Gerais' },
    { uf: 'PA', name: 'Pará' },
    { uf: 'PB', name: 'Paraíba' },
    { uf: 'PR', name: 'Paraná' },
    { uf: 'PE', name: 'Pernambuco' },
    { uf: 'PI', name: 'Piauí' },
    { uf: 'RJ', name: 'Rio de Janeiro' },
    { uf: 'RN', name: 'Rio Grande do Norte' },
    { uf: 'RS', name: 'Rio Grande do Sul' },
    { uf: 'RO', name: 'Rondônia' },
    { uf: 'RR', name: 'Roraima' },
    { uf: 'SC', name: 'Santa Catarina' },
    { uf: 'SP', name: 'São Paulo' },
    { uf: 'SE', name: 'Sergipe' },
    { uf: 'TO', name: 'Tocantins' },
  ];

  const validateStep1 = () => {
    if (!name || !cpf || !phone || !email || !password) return "Preencha todos os campos obrigatórios.";
    // validação de CPF (dígitos verificadores)
    const only = cpf.replace(/\D/g, "");
    if (only.length !== 11 || /^([0-9])\1+$/.test(only)) return "CPF inválido.";
    const dv = (nums: string, factor: number) => {
      let sum = 0; for (let i=0;i<factor-1;i++) sum += parseInt(nums[i]) * (factor - i);
      const r = (sum * 10) % 11; return r === 10 ? 0 : r;
    };
    const d1 = dv(only, 10); if (d1 !== parseInt(only[9])) return "CPF inválido.";
    const d2 = dv(only, 11); if (d2 !== parseInt(only[10])) return "CPF inválido.";
    if (password.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
    if (confirmPassword && password !== confirmPassword) return "A confirmação de senha não confere.";
    return null;
  };

  const validateStep2 = () => {
    // Sem lista de múltiplas bancas: exigir os campos mínimos do formulário atual
    if (!cep || !number || !bankName) return "Informe CEP, número e nome da banca.";
    return null;
  };

  const validateStep3 = () => {
    // Para cada dia aberto, exigir horários válidos e início < fim
    for (const d of hours) {
      if (d.open) {
        if (!d.start || !d.end) return `Defina início e fim para ${d.label}.`;
        if (d.start >= d.end) return `O horário de ${d.label} está inválido (início deve ser antes do fim).`;
      }
    }
    return null;
  };

  const validateStep4 = () => {
    const handleRe = /^[A-Za-z0-9._-]{2,30}$/;
    // Para handles, exigimos apenas nome de usuário (sem URL)
    if (facebookHas === 'yes') {
      if (!facebookUrl) return 'Informe o nome de usuário do Facebook (sem URL).';
      if (!handleRe.test(facebookUrl.replace(/^@/, ''))) return 'Nome de usuário do Facebook inválido.';
    }
    if (instagramHas === 'yes') {
      if (!instagramUrl) return 'Informe o nome de usuário do Instagram (sem URL).';
      if (!handleRe.test(instagramUrl.replace(/^@/, ''))) return 'Nome de usuário do Instagram inválido.';
    }
    // Google Meu Negócio será conectado via API no painel, não validar aqui
    return null;
  };

  const onNext = async () => {
    setError(null);
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
      setStep(2);
      return;
    }
    if (step === 2) {
      const err = validateStep2();
      if (err) { setError(err); return; }
      setStep(3);
      return;
    }
    if (step === 3) {
      const err = validateStep3();
      if (err) { setError(err); return; }
      setStep(4);
      return;
    }
  };

  const onBack = () => {
    setError(null);
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
    if (step === 4) setStep(3);
    if (step === 5) setStep(4);
  };

  const onFinish = async () => {
    setError(null);
    const err1 = validateStep1();
    if (err1) { setError(err1); setStep(1); return; }
    const err2 = validateStep2();
    if (err2) { setError(err2); setStep(2); return; }
    const err3 = validateStep3();
    if (err3) { setError(err3); setStep(3); return; }
    const err4 = validateStep4();
    if (err4) { setError(err4); setStep(4); return; }
    try {
      const seller = { name, cpf, phone, email };
      // Se houver dados preenchidos no Step 2 e ainda não adicionados, empilha uma banca final
      const inProgressBank: Bank | null = bankName ? {
        name: bankName,
        whatsapp: servicePhone,
        images: { cover: bankCoverPreview || bankCoverUrl, profile: bankProfilePreview || bankProfileUrl },
        address: { cep, street, number, complement, neighborhood, city, uf },
        socials: {
          gmb: '',
          facebook: facebookHas === 'yes' ? facebookUrl.replace(/^@/, '') : '',
          instagram: instagramHas === 'yes' ? instagramUrl.replace(/^@/, '') : '',
        },
        hours,
        meta: {
          socialsSkipped,
          socialsLinks: {
            facebook: (facebookHas === 'yes' && facebookUrl) ? `https://facebook.com/${facebookUrl.replace(/^@/, '')}` : undefined,
            instagram: (instagramHas === 'yes' && instagramUrl) ? `https://instagram.com/${instagramUrl.replace(/^@/, '')}` : undefined,
          },
          location: {
            lat: lat2 ? Number(lat2) : undefined,
            lng: lng2 ? Number(lng2) : undefined,
          }
        },
      } : null;
      const allBanks = inProgressBank ? [...banks, inProgressBank] : banks;
      if (allBanks.length === 0) return setError('Adicione pelo menos uma banca.');
      const payload = { seller, banks: allBanks };
      // Envia para API pública do jornaleiro (cria bancas no admin store como inativas para revisão)
      try {
        const res = await fetch('/api/jornaleiro/bancas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ banks: allBanks }) });
        const j = await res.json();
        if (!res.ok || !j?.ok) {
          throw new Error(j?.error || 'Falha ao enviar cadastro');
        }
      } catch (e) {
        // fallback local para não perder dados
        localStorage.setItem("gb:seller", JSON.stringify(payload));
      }
      localStorage.setItem("gb:sellerAuth", "1");
      try { localStorage.removeItem('gb:sellerWizard'); } catch {}
      setToast('Cadastro concluído com sucesso! Nossa equipe revisará sua banca.');
      setStep(5);
    } catch {
      setError("Não foi possível concluir o cadastro. Tente novamente.");
    }
  };

  const toggleDay = (key: string) => {
    setHours(prev => prev.map(d => d.key === key ? { ...d, open: !d.open } : d));
  };
  const setStart = (key: string, v: string) => {
    setHours(prev => prev.map(d => d.key === key ? { ...d, start: v } : d));
  };
  const setEnd = (key: string, v: string) => {
    setHours(prev => prev.map(d => d.key === key ? { ...d, end: v } : d));
  };

  return (
    <>
    {/* Barra de progresso superior */}
    <div className="container-max pt-6">
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <div className="h-1 w-full rounded-full bg-gray-200" />
          <div
            className="absolute left-0 top-0 h-1 rounded-full bg-[#ff5c00] transition-all duration-500"
            style={{ width: `${((step - 1) / 4) * 100}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          {[
            { n: 1, label: 'Jornaleiro', icon: (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z"/></svg>
            )},
            { n: 2, label: 'Banca', icon: (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l1-5h16l1 5M4 9h16v10H4z"/></svg>
            )},
            { n: 3, label: 'Funcionamento', icon: (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
            )},
            { n: 4, label: 'Social Midia', icon: (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a3 3 0 11-2.83 4H8.83A3 3 0 116 8h12z"/></svg>
            )},
            { n: 5, label: 'Conclusão', icon: (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
            )},
          ].map(({ n, label, icon }) => {
            const isDone = step > n;
            const isActive = step === n;
            return (
              <div key={n} className="flex flex-col items-center gap-1">
                <div className={`relative grid h-8 w-8 place-items-center rounded-full border ${step >= n ? 'bg-[#ff5c00] border-[#ff5c00] text-white' : 'bg-white border-gray-300 text-gray-600'} transition-colors`}>
                  {isActive && (
                    <span className="absolute -inset-1.5 rounded-full border-2 border-[#ff5c00]/40 animate-pulse" />
                  )}
                  <span className="grid place-items-center">
                    {isDone ? (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                    ) : icon}
                  </span>
                </div>
                <div className={`text-[12px] ${step >= n ? 'text-[#ff5c00]' : 'text-gray-600'}`}>{label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    <section className="container-max py-10">
      <div className="max-w-3xl mx-auto rounded-2xl border border-[#ff5c00] bg-white p-6 shadow-lg">
        <div className="flex flex-col items-center gap-2">
          <div className="text-center">
            <h1 className="text-xl font-semibold">Cadastro do Jornaleiro</h1>
            {step === 1 ? (
              <p className="mt-1 text-sm text-gray-600 px-4 md:px-8">Estas são suas informações pessoais para futuros contatos. Os dados da sua banca serão solicitados na próxima etapa.</p>
            ) : step === 2 ? (
              <p className="mt-1 text-sm text-gray-600 px-4 md:px-8">Agora vamos solicitar os dados públicos da sua banca. Essas informações serão exibidas para os clientes na plataforma.</p>
            ) : step === 3 ? (
              <p className="mt-1 text-sm text-gray-600 px-4 md:px-8">Defina os horários de funcionamento da sua banca. Essas informações aparecerão para os clientes.</p>
            ) : step === 4 ? (
              <p className="mt-1 text-sm text-gray-600 px-4 md:px-8">Adicione suas redes sociais para potencializar sua presença digital. É opcional e pode ser feito depois no painel.</p>
            ) : null}
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-md border border-rose-300 bg-rose-50 text-rose-700 text-sm px-3 py-2">{error}</div>
        )}

        {step === 1 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] text-gray-700">Nome completo</label>
              <input className="input mt-1 w-full" value={name} onChange={(e)=>setName(e.target.value)} />
            </div>
            <div>
              <label className="text-[12px] text-gray-700">CPF</label>
              <div className="relative mt-1">
                <input
                  ref={cpfInputRef}
                  className="input w-full pr-10"
                  value={cpf}
                  onChange={(e)=>setCpf(maskCPF(e.target.value))}
                  onKeyDown={(e)=>{ if (e.key === 'Enter' && cpfValid) { e.preventDefault(); phoneInputRef.current?.focus(); } }}
                  placeholder="000.000.000-00"
                />
                {cpfOnly.length === 11 && cpfValid && (
                  <span className="pointer-events-none absolute inset-y-0 right-2 grid place-items-center text-emerald-600">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                  </span>
                )}
              </div>
              {cpfOnly.length === 11 && !cpfValid && (
                <div className="mt-1 text-[11px] text-rose-600">CPF inválido. Verifique os dígitos informados.</div>
              )}
            </div>
            <div>
              <label className="text-[12px] text-gray-700">Whatsapp</label>
              <div className="relative">
                <input ref={phoneInputRef} className="input mt-1 w-full pr-16" value={phone} onChange={(e)=>setPhone(maskPhoneBR(e.target.value))} placeholder="(00) 00000-0000" />
                {phoneValid && (
                  <span className="pointer-events-none absolute inset-y-0 right-2 grid place-items-center text-emerald-600">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                  </span>
                )}
                {!!phone && (
                  <button
                    type="button"
                    aria-label="Limpar WhatsApp"
                    className="absolute inset-y-0 right-8 grid place-items-center text-gray-400 hover:text-gray-600"
                    onClick={() => { setPhone(""); setTimeout(()=>phoneInputRef.current?.focus(), 0); }}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="text-[12px] text-gray-700">Email</label>
              <div className="relative">
                <input ref={emailInputRef} type="email" className="input mt-1 w-full pr-16" value={email} onChange={(e)=>setEmail(e.target.value)} />
                {emailValid && (
                  <span className="pointer-events-none absolute inset-y-0 right-2 grid place-items-center text-emerald-600">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                  </span>
                )}
                {!!email && (
                  <button
                    type="button"
                    aria-label="Limpar Email"
                    className="absolute inset-y-0 right-8 grid place-items-center text-gray-400 hover:text-gray-600"
                    onClick={() => { setEmail(""); setTimeout(()=>emailInputRef.current?.focus(), 0); }}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
                  </button>
                )}
              </div>
            </div>
            <div className="relative">
              <label className="text-[12px] text-gray-700">Senha</label>
              <input type={showPassword ? 'text' : 'password'} className="input mt-1 w-full pr-10" value={password} onChange={(e)=>setPassword(e.target.value)} />
              <button type="button" aria-label="Mostrar senha" onClick={()=>setShowPassword(v=>!v)} className="absolute right-2 top-[34px] text-gray-500 hover:text-black">
                {showPassword ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.73 2.1-3.64 3.95-5.22M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-."></path><path d="M1 1l22 22"></path></svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
              {/* Barra de força da senha */}
              {password && (() => {
                const meta = scoreToMeta(passwordScore(password));
                return (
                  <div className="mt-1">
                    <div className="h-1 w-full rounded-full bg-gray-200 overflow-hidden">
                      <div className={`h-full ${meta.color} ${meta.width} transition-all duration-300`}></div>
                    </div>
                    <div className="mt-1 text-[11px] text-gray-600">Força: {meta.label}</div>
                  </div>
                );
              })()}
            </div>
            {password && (
              <div className="relative">
                <label className="text-[12px] text-gray-700">Confirmar senha</label>
                <input type={showConfirm ? 'text' : 'password'} className="input mt-1 w-full pr-10" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
                <button type="button" aria-label="Mostrar confirmação" onClick={()=>setShowConfirm(v=>!v)} className="absolute right-2 top-[34px] text-gray-500 hover:text-black">
                  {showConfirm ? (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.73 2.1-3.64 3.95-5.22M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-."></path><path d="M1 1l22 22"></path></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
                {/* Barra de força da confirmação */}
                {confirmPassword && (() => {
                  const meta = scoreToMeta(passwordScore(confirmPassword));
                  return (
                    <div className="mt-1">
                      <div className="h-1 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div className={`h-full ${meta.color} ${meta.width} transition-all duration-300`}></div>
                      </div>
                      <div className="mt-1 text-[11px] text-gray-600">Força: {meta.label}</div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-gray-700">CEP</label>
              <div className="relative mt-1 inline-block w-full md:w-1/2">
                <input
                  className="input w-full border-[#ff5c00] bg-orange-50 pr-10 focus:border-[#ff5c00] focus:ring-[#ff5c00]/30"
                  ref={cepInputRef}
                  value={cep}
                  onChange={(e)=>{ setCep(maskCEP(e.target.value)); if (cepError) setCepError(null); }}
                  onBlur={onCepBlur}
                  onKeyDown={(e)=>{ if (e.key === 'Enter') { if (cepReady) { e.preventDefault(); numberInputRef.current?.focus(); } } }}
                  placeholder="00000-000"
                />
                {loadingCep && (
                  <span className="pointer-events-none absolute inset-y-0 right-2 grid place-items-center text-[#ff5c00]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="9" className="opacity-25" />
                      <path d="M21 12a9 9 0 0 1-9 9" className="opacity-75" />
                    </svg>
                  </span>
                )}
                {!loadingCep && cepValid && (
                  <span className="pointer-events-none absolute inset-y-0 right-2 grid place-items-center text-emerald-600">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                  </span>
                )}
                {!loadingCep && !!cep && (
                  <button
                    type="button"
                    aria-label="Limpar CEP"
                    className="absolute inset-y-0 right-8 grid place-items-center text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setCep("");
                      setCepError(null);
                      setStreet(""); setNeighborhood(""); setCity(""); setUf("");
                      setNumber(""); setComplement("");
                      setLastCepFetched("");
                      setTimeout(()=>cepInputRef.current?.focus(), 0);
                    }}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
                  </button>
                )}
              </div>
              <div className="mt-1 text-[11px]">
                {!cepError ? (
                  <span className="text-gray-500">Digite o CEP completo para liberar os campos de endereço.</span>
                ) : (
                  <span className="text-rose-600">{cepError}</span>
                )}
              </div>
            </div>
            <div className="flex items-end justify-end md:col-span-2 -mt-2">
              <button
                type="button"
                className="text-[12px] rounded-md border border-gray-300 bg-white px-3 py-1 hover:bg-gray-50"
                onClick={() => {
                  setCep(""); setCepError(null); setStreet(""); setNeighborhood(""); setCity(""); setUf(""); setNumber(""); setComplement(""); setLastCepFetched(""); setTimeout(()=>cepInputRef.current?.focus(), 0);
                }}
              >Limpar endereço</button>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-3">
                <label className="text-[12px] text-gray-700">Endereço</label>
                <input className="input mt-1 w-full disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100" value={street} onChange={(e)=>setStreet(e.target.value)} disabled={!cepReady} />
              </div>
              <div className="md:col-span-1">
                <label className="text-[12px] text-gray-700">Número</label>
                <input ref={numberInputRef} className="input mt-1 w-full disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100" value={number} onChange={(e)=>setNumber(e.target.value)} placeholder="Nº" disabled={!cepReady} />
              </div>
              <div className="md:col-span-1">
                <label className="text-[12px] text-gray-700">Cidade</label>
                <input className="input mt-1 w-full disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100" value={city} onChange={(e)=>setCity(e.target.value)} disabled={!cepReady} />
              </div>
              <div className="md:col-span-1">
                <label className="text-[12px] text-gray-700">Bairro</label>
                <input className="input mt-1 w-full disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100" value={neighborhood} onChange={(e)=>setNeighborhood(e.target.value)} disabled={!cepReady} />
              </div>
              <div className="md:col-span-1">
                <label className="text-[12px] text-gray-700">UF</label>
                <select className="input mt-1 w-full disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100" value={uf} onChange={(e)=>setUf(e.target.value)} disabled={!cepReady}>
                  <option value="">Selecione</option>
                  {STATES.map(s => (
                    <option key={s.uf} value={s.uf}>{s.uf} - {s.name}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-[12px] text-gray-700">Complemento</label>
                <input className="input mt-1 w-full disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100" value={complement} onChange={(e)=>setComplement(e.target.value)} placeholder="Opcional" disabled={!cepReady} />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-[12px] text-gray-700">Nome da banca</label>
              <input className="input mt-1 w-full" value={bankName} onChange={(e)=>setBankName(e.target.value)} />
            </div>
            
            <div className="md:col-span-2">
              <label className="text-[12px] text-gray-700">WhatsApp de atendimento</label>
              <input className="input mt-1 w-full" placeholder="(00) 00000-0000" value={servicePhone} onChange={(e)=>setServicePhone(maskPhoneBR(e.target.value))} />
            </div>

            {/* Geocodificar lat/lng */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="md:col-span-2">
                <label className="text-[12px] text-gray-700">Latitude</label>
                <input className="input mt-1 w-full" placeholder="-23.56" value={lat2} onChange={(e)=>setLat2(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="text-[12px] text-gray-700">Longitude</label>
                <input className="input mt-1 w-full" placeholder="-46.65" value={lng2} onChange={(e)=>setLng2(e.target.value)} />
              </div>
              <div className="md:col-span-1 flex items-end">
                <button type="button" onClick={geocodeAddress} className="w-full text-[12px] rounded-md border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50">Geocodificar</button>
              </div>
            </div>
            
          </div>
        )}

        {step === 2 && null}

        {step === 3 && (
          <div className="mt-4 space-y-5">
            {/* Horários */}
            <div>
              <div className="text-sm font-semibold">Horários de funcionamento</div>
              <div className="text-[11px] text-gray-500">Esses horários serão exibidos na página da sua banca.</div>
              <div className="rounded-xl border border-gray-200">
                <div className="divide-y divide-gray-100">
                  {hours.map((d) => (
                    <div
                      key={d.key}
                      className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 p-2"
                    >
                      <label className="sm:col-span-3 text-sm text-gray-700">{d.label}</label>
                      <label className="sm:col-span-2 inline-flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={d.open} onChange={()=>toggleDay(d.key)} /> Aberto
                      </label>
                      <div className="sm:col-span-3">
                        <input type="time" className="input w-full disabled:placeholder-gray-400 disabled:text-gray-400" value={d.start} onChange={(e)=>setStart(d.key, e.target.value)} disabled={!d.open} />
                      </div>
                      <span className="sm:col-span-1 text-center text-sm text-gray-500">até</span>
                      <div className="sm:col-span-3">
                        <input type="time" className="input w-full disabled:placeholder-gray-400 disabled:text-gray-400" value={d.end} onChange={(e)=>setEnd(d.key, e.target.value)} disabled={!d.open} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="mt-4 space-y-5">
            {/* Sociais */}
            <div className="rounded-xl border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Perfis sociais</div>
                <span className="text-[11px] text-gray-500">Opcional — você pode adicionar depois no painel</span>
              </div>
              <div className="mt-2 space-y-3">
                <div>
                  <label className="text-[12px] text-gray-700">Google Meu Negócio</label>
                  <div className="mt-1 flex items-center justify-between gap-3 text-sm">
                    <span className="text-[12px] text-gray-500">Conecte sua conta para sincronizar fotos, avaliações e horários.</span>
                    <button type="button" disabled className="cursor-not-allowed rounded-md border border-gray-300 bg-white px-3 py-1 text-[12px] text-gray-500">Conectar (em breve)</button>
                  </div>
                </div>
                <div>
                  <label className="text-[12px] text-gray-700">Facebook</label>
                  <div className="mt-1 flex items-center gap-3 text-sm">
                    <label className="inline-flex items-center gap-1"><input type="radio" name="fb" checked={facebookHas==='yes'} onChange={()=>setFacebookHas('yes')} /> Tem</label>
                    <label className="inline-flex items-center gap-1"><input type="radio" name="fb" checked={facebookHas==='no'} onChange={()=>setFacebookHas('no')} /> Não tem</label>
                  </div>
                  {facebookHas === 'yes' && (
                    <>
                      <input className="input mt-1 w-full" placeholder="Nome de usuário (sem @)" value={facebookUrl} onChange={(e)=>setFacebookUrl(e.target.value.replace(/\s+/g, ''))} />
                      <div className="mt-1 text-[11px] text-gray-500">Digite apenas o nome de usuário. Ex.: minhabanca</div>
                    </>
                  )}
                </div>
                <div>
                  <label className="text-[12px] text-gray-700">Instagram</label>
                  <div className="mt-1 flex items-center gap-3 text-sm">
                    <label className="inline-flex items-center gap-1"><input type="radio" name="ig" checked={instagramHas==='yes'} onChange={()=>setInstagramHas('yes')} /> Tem</label>
                    <label className="inline-flex items-center gap-1"><input type="radio" name="ig" checked={instagramHas==='no'} onChange={()=>setInstagramHas('no')} /> Não tem</label>
                  </div>
                  {instagramHas === 'yes' && (
                    <>
                      <input className="input mt-1 w-full" placeholder="Nome de usuário (sem @)" value={instagramUrl} onChange={(e)=>setInstagramUrl(e.target.value.replace(/\s+/g, ''))} />
                      <div className="mt-1 text-[11px] text-gray-500">Digite apenas o nome de usuário. Ex.: minhabanca</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="mt-6 text-center space-y-3">
            <h2 className="text-lg font-semibold">Tudo pronto! Bem-vindo ao Guia das Bancas</h2>
            <p className="text-sm text-gray-700 max-w-xl mx-auto">Você tomou a decisão certa ao trazer sua banca para o digital. Agora sua presença online vai ajudar novos clientes a encontrarem seus produtos com facilidade.</p>
            {socialsSkipped && (
              <div className="mx-auto max-w-xl rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-left text-[13px] text-amber-800">
                Você pulou a etapa de redes sociais. No painel você poderá adicionar seus perfis e conectar o Google Meu Negócio para sincronizar fotos, avaliações e horários.
              </div>
            )}
            <div className="mt-4 flex items-center justify-center gap-3">
              <a href="/jornaleiro" className="rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-4 py-2 text-sm font-semibold text-white hover:opacity-95">Acessar Painel do Jornaleiro</a>
              <a href="https://chat.whatsapp.com/LiPZtsKqSrUEx222oAUBWM" target="_blank" rel="noopener noreferrer" className="rounded-md bg-gradient-to-r from-[#25D366] to-[#1ebe5d] px-4 py-2 text-sm font-semibold text-white hover:opacity-95">Entrar no grupo do WhatsApp</a>
            </div>
          </div>
        )}

        {step !== 5 && (
        <div className="mt-6 flex items-center justify-end">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button onClick={onBack} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">Voltar</button>
            )}
            {step < 4 ? (
              <button onClick={onNext} className="rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-4 py-2 text-sm font-semibold text-white hover:opacity-95">Avançar</button>
            ) : (
              <>
                <button onClick={() => { setSocialsSkipped(true); onFinish(); }} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">Pular</button>
                <button onClick={() => { setSocialsSkipped(false); onFinish(); }} className="rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-4 py-2 text-sm font-semibold text-white hover:opacity-95">Concluir cadastro</button>
              </>
            )}
          </div>
        </div>
        )}
      </div>
    </section>
    {toast && (
      <div className="fixed right-4 top-4 z-[60] rounded-md border border-gray-200 bg-white shadow px-3 py-2 text-sm text-gray-800">
        {toast}
      </div>
    )}
    </>
  );
}

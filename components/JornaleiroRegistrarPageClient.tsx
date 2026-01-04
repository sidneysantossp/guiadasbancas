"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchViaCEP, ViaCEP } from "@/lib/viacep";
import { maskCEP, maskCPF, maskCPFOrCNPJ, maskPhoneBR } from "@/lib/masks";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabaseAdmin } from "@/lib/supabase";
import FileUploadDragDrop from "@/components/common/FileUploadDragDrop";
import CotistaSearch from "@/components/CotistaSearch";
import logger from "@/lib/logger";

export default function JornaleiroRegistrarPageClient() {
  const router = useRouter();

  // Steps (Cota Ativa movido para step 2, mas oculto por enquanto)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
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
  
  // Estado específico para validação de email no blur
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  
  const cpfInputRef = useRef<HTMLInputElement | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const finishingRef = useRef(false);

  // Verificação de CPF duplicado
  const [checkingCpf, setCheckingCpf] = useState(false);
  const [isBusy, setIsBusy] = useState(false); // Estado genérico de carregamento para botões
  const [cpfExists, setCpfExists] = useState(false);
  const [isCotista, setIsCotista] = useState(false);
  const [existingBancas, setExistingBancas] = useState<Array<{id: string; name: string; address: string}>>([]);

  // Cota Ativa
  const [isCotaAtiva, setIsCotaAtiva] = useState(false);
  const [selectedCotaAtiva, setSelectedCotaAtiva] = useState<{
    id: string;
    codigo: string;
    razao_social: string;
    cnpj_cpf: string;
  } | null>(null);
  
  logger.log('[Wizard] 🔄 Estado atual do componente:', {
    step,
    isCotaAtiva,
    selectedCotaAtiva: selectedCotaAtiva ? 'SELECIONADO' : 'NÃO SELECIONADO'
  });

  // Field-level errors (Step 1)
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    cpf?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const setErrorField = (k: keyof typeof fieldErrors, msg?: string) => setFieldErrors(prev => ({ ...prev, [k]: msg }));

  // Field validators
  const validateName = (v: string) => {
    if (!v.trim()) return 'Informe seu nome completo.';
    if (v.trim().length < 6) return 'Nome muito curto. Use nome e sobrenome.';
    return undefined;
  };
  const validateCpf = (v: string) => {
    const only = (v || '').replace(/\D/g, '');
    if (!only) return 'Informe seu CPF ou CNPJ.';
    if (only.length !== 11 && only.length !== 14) return 'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos.';
    if (only.length === 11) {
      return isValidCPF(v) ? undefined : 'CPF inválido. Verifique os dígitos.';
    }
    if (only.length === 14) {
      return isValidCNPJ(v) ? undefined : 'CNPJ inválido. Verifique os dígitos.';
    }
    return undefined;
  };
  const validatePhone = (v: string) => {
    const only = (v || '').replace(/\D/g, '');
    if (!only) return 'Informe seu WhatsApp.';
    if (only.length !== 11) return 'Número inválido. Use DDD + 9 dígitos.';
    return undefined;
  };
  const validateEmailField = (v: string) => {
    if (!v.trim()) return 'Informe seu email.';
    return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(v) ? undefined : 'Email inválido.';
  };
  const validatePasswordField = (v: string) => {
    if (!v) return 'Crie uma senha.';
    if (v.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
    return undefined;
  };
  const validateConfirmField = (v: string, p: string) => {
    if (!v) return 'Confirme sua senha.';
    if (v !== p) return 'A confirmação não confere com a senha.';
    return undefined;
  };

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
  const [bankTpuUrl, setBankTpuUrl] = useState<string>("");

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
  type Bank = { name: string; whatsapp: string; images: { cover: string; profile: string }; address: { cep: string; street: string; number: string; complement: string; neighborhood: string; city: string; uf: string }; socials: { gmb: string; facebook: string; instagram: string }; hours: Day[]; tpu_url?: string; meta?: { socialsSkipped?: boolean; socialsLinks?: { facebook?: string; instagram?: string }; location?: { lat?: number; lng?: number } } };
  const [banks, setBanks] = useState<Bank[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Se já autenticado como jornaleiro, envia direto ao dashboard
  useEffect(() => {
    try {
      // Evita loops baseados em flags locais; confia apenas na sessão
      // (se houver flags antigas, limpa)
      localStorage.removeItem('gb:sellerAuth');
    } catch {}
  }, []);

  // CEP preenchido (8 dígitos)
  const cepReady = ((cep || "").replace(/\D/g, "").length === 8);
  const cepOnly = (cep || "").replace(/\D/g, "");
  const cepValid = cepOnly.length === 8 && lastCepFetched === cepOnly && !cepError;

  // Validação CPF utilitária
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

  // Validação CNPJ utilitária
  const isValidCNPJ = (v: string) => {
    const only = (v || '').replace(/\D/g, '');
    if (only.length !== 14 || /^([0-9])\1+$/.test(only)) return false;
    
    let size = only.length - 2;
    let numbers = only.substring(0, size);
    const digits = only.substring(size);
    let sum = 0;
    let pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;
    
    size = size + 1;
    numbers = only.substring(0, size);
    sum = 0;
    pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;
    
    return true;
  };

  const cpfOnly = (cpf || '').replace(/\D/g, '');
  const cpfValid = cpfOnly.length === 11 ? isValidCPF(cpf) : cpfOnly.length === 14 ? isValidCNPJ(cpf) : false;
  const phoneOnly = (phone || '').replace(/\D/g, '');
  const phoneValid = phoneOnly.length === 11; // celular BR (DDD + 9 dígitos)
  const emailValid = !!email && /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);

  // Verificação automática de CPF quando completado
  useEffect(() => {
    const checkCpfAutomatically = async () => {
      // Só verificar se CPF/CNPJ estiver completo e válido
      if (!cpfValid || checkingCpf) return;
      if (cpfOnly.length !== 11 && cpfOnly.length !== 14) return;

      setCheckingCpf(true);
      try {
        console.log('[Frontend] Enviando CPF para verificação:', cpf);
        const response = await fetch('/api/jornaleiro/check-cpf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cpf })
        });
        
        console.log('[Frontend] Status da resposta:', response.status);
        
        const data = await response.json();
        
        console.log('[Frontend] Resposta da API check-cpf:', data);
        
        if (!response.ok) {
          console.error('[Frontend] Erro na API:', data.error, data.details);
          return;
        }
        
        if (data.exists && data.bancas && data.bancas.length > 0) {
          console.log('[Frontend] CPF existe com bancas:', data.bancas.length);
          setCpfExists(true);
          setIsCotista(data.isCotista || false);
          setExistingBancas(data.bancas);
        } else {
          console.log('[Frontend] CPF livre ou apenas cotista');
          setCpfExists(false);
          setIsCotista(false);
          setExistingBancas([]);
        }
      } catch (err) {
        console.error('[Frontend] Erro ao verificar CPF:', err);
      } finally {
        setCheckingCpf(false);
      }
    };

    // Debounce de 500ms para evitar múltiplas chamadas
    const timer = setTimeout(checkCpfAutomatically, 500);
    return () => clearTimeout(timer);
  }, [cpf, cpfValid]);

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
      if (w.bankTpuUrl) setBankTpuUrl(w.bankTpuUrl);
      if (w.gmbHas) setGmbHas(w.gmbHas);
      if (w.gmbUrl) setGmbUrl(w.gmbUrl);
      if (w.facebookHas) setFacebookHas(w.facebookHas);
      if (w.facebookUrl) setFacebookUrl(w.facebookUrl);
      if (w.instagramHas) setInstagramHas(w.instagramHas);
      if (w.instagramUrl) setInstagramUrl(w.instagramUrl);
      if (Array.isArray(w.hours)) setHours(w.hours);
      if (w.isCotaAtiva !== undefined) setIsCotaAtiva(w.isCotaAtiva);
      if (w.selectedCotaAtiva) setSelectedCotaAtiva(w.selectedCotaAtiva);
    } catch {}
  }, []);

  // Salvar progresso do wizard
  useEffect(() => {
    const payload = { step, name, cpf, phone, email, password, cep, street, number, complement, neighborhood, city, uf, bankName, bankCoverUrl: bankCoverPreview || bankCoverUrl, bankProfileUrl: bankProfilePreview || bankProfileUrl, bankTpuUrl, servicePhone, gmbHas, gmbUrl, facebookHas, facebookUrl, instagramHas, instagramUrl, hours, banks, isCotaAtiva, selectedCotaAtiva };
    try { localStorage.setItem('gb:sellerWizard', JSON.stringify(payload)); } catch {}
  }, [step, name, cpf, phone, email, password, cep, street, number, complement, neighborhood, city, uf, bankName, bankCoverUrl, bankProfileUrl, bankCoverPreview, bankProfilePreview, servicePhone, gmbHas, gmbUrl, facebookHas, facebookUrl, instagramHas, instagramUrl, hours, banks, isCotaAtiva, selectedCotaAtiva]);

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

  // Prefill service phone on step 3 from step 2 phone
  // Sempre sincroniza se servicePhone estiver vazio ou incompleto
  useEffect(() => {
    if (step === 3 && phone && phone.length >= 10) {
      // Se servicePhone está vazio ou muito curto (incompleto), preenche com phone
      if (!servicePhone || servicePhone.length < 10) {
        logger.log('🔄 Sincronizando WhatsApp:', phone, '->', servicePhone);
        setServicePhone(phone);
      }
    }
  }, [step, phone, servicePhone]);

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
    // Validação flexível para URLs completas ou handles
    if (facebookHas === 'yes') {
      if (!facebookUrl || !facebookUrl.trim()) return 'Informe o link do seu perfil do Facebook.';
    }
    if (instagramHas === 'yes') {
      if (!instagramUrl || !instagramUrl.trim()) return 'Informe o link do seu perfil do Instagram.';
    }
    return null;
  };

  const onNext = async () => {
    setError(null);
    // Step 1: Jornaleiro - apenas nome, CPF e WhatsApp
    if (step === 1) {
      const e1 = validateName(name); setErrorField('name', e1);
      const e2 = validateCpf(cpf); setErrorField('cpf', e2);
      const e3 = validatePhone(phone); setErrorField('phone', e3);
      if (e1 || e2 || e3) { return; }
      
      // Verificar se CPF já está cadastrado (cotista ou banca) - bloqueia
      if (cpfExists) {
        setError(
          'Este CPF/CNPJ já está cadastrado. Faça login e, no painel, vá em "Minhas Bancas" > "Cadastrar" para adicionar outra banca.'
        );
        return;
      }
      
      setStep(2);
      return;
    }
    // Step 2: Email e Senha
    if (step === 2) {
      const e4 = validateEmailField(email); setErrorField('email', e4);
      const e5 = validatePasswordField(password); setErrorField('password', e5);
      const e6 = validateConfirmField(confirmPassword, password); setErrorField('confirmPassword', e6);
      if (e4 || e5 || e6) { return; }

      // Verificar se e-mail já existe
      try {
        setIsBusy(true); 
        // Limpar erro anterior antes de verificar
        setError(null);
        
        const res = await fetch('/api/jornaleiro/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        
        if (data.exists) {
          const msg = data.message || 'Este e-mail já está cadastrado. Faça login para continuar.';
          setError(msg);
          setErrorField('email', msg);
          setIsBusy(false);
          return; // Bloqueia o avanço
        }
      } catch (err) {
        console.error('Erro ao verificar email:', err);
        // Em caso de erro de rede, alertar o usuário mas (opcionalmente) permitir tentar novamente
        setError('Erro ao verificar disponibilidade do e-mail. Tente novamente.');
        setIsBusy(false);
        return;
      } finally {
        setIsBusy(false);
      }

      setStep(3);
      return;
    }
    // Step 3: Banca
    if (step === 3) {
      const err = validateStep2();
      if (err) { setError(err); return; }
      setStep(4);
      return;
    }
    // Step 4: Imagens
    if (step === 4) {
      // Validação das imagens é opcional
      setStep(5);
      return;
    }
    // Step 5: Funcionamento - vai direto para conclusão (step 6)
    if (step === 5) {
      const err = validateStep3();
      if (err) { setError(err); return; }
      setStep(6);
      return;
    }
  };

  const onBack = () => {
    setError(null);
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
    if (step === 4) setStep(3);
    if (step === 5) setStep(4);
    if (step === 6) setStep(5);
  };

  const { signUp, signIn, profile } = useAuth();

  // REMOVIDO: useEffect que redirecionava para dashboard quando profile.role === 'jornaleiro'
  // Isso causava conflito porque o redirecionamento acontecia ANTES do onboarding criar a banca
  // O fluxo correto é: registrar -> onboarding (cria banca) -> dashboard

  const onFinish = async () => {
    if (finishingRef.current) return; // evita duplo clique / dupla submissão (lock síncrono)
    finishingRef.current = true;
    setError(null);
    logger.log('[Wizard] 🚀 Iniciando conclusão do cadastro...');
    logger.log('[Wizard] 🏢 isCotaAtiva atual:', isCotaAtiva);
    logger.log('[Wizard] 👥 selectedCotaAtiva atual:', selectedCotaAtiva);
    const err1 = validateStep1();
    if (err1) { setError(err1); setStep(1); finishingRef.current = false; return; }
    const err2 = validateStep2();
    if (err2) { setError(err2); setStep(2); finishingRef.current = false; return; }
    const err3 = validateStep3();
    if (err3) { setError(err3); setStep(3); finishingRef.current = false; return; }
    const err4 = validateStep4();
    if (err4) { setError(err4); setStep(4); finishingRef.current = false; return; }
    
    try {
      setIsBusy(true);
      setToast('Criando sua conta...');
      
      // 1. Criar usuário no Supabase Auth
      const { error: authError } = await signUp(email, password, {
        full_name: name,
        role: 'jornaleiro',
      });

      if (authError) {
        // Se o usuário clicou duas vezes, a conta já pode ter sido criada na primeira tentativa.
        // Nesse caso, apenas seguir o fluxo normalmente (signIn + onboarding).
        const msg = (authError as any)?.message || '';
        const code = (authError as any)?.code || '';
        const looksLikeAlreadyExists =
          code === 'user_already_exists' ||
          /already\s*registered/i.test(msg) ||
          /já\s*está\s*cadastrado/i.test(msg) ||
          /User\s+already\s+registered/i.test(msg);

        if (!looksLikeAlreadyExists) {
          setError(msg || 'Erro ao criar conta');
          setStep(2);
          setIsBusy(false);
          setToast(null);
          finishingRef.current = false;
          return;
        }
        // Se já existe, tentar autenticar com a senha informada.
        // Se a senha bater, seguimos o fluxo normalmente (usuário comum virando jornaleiro)
        setToast('Conta já existe. Verificando credenciais...');
        const login = await signIn(email, password);
        if (login?.error) {
          // Senha não bateu - usuário comum com senha diferente
          // Redirecionar para login normal ao invés de bloquear
          setError("Você já possui uma conta com este e-mail. Use a mesma senha da sua conta existente ou faça login primeiro na área 'Minha Conta' e depois retorne aqui.");
          setStep(2);
          setIsBusy(false);
          setToast(null);
          finishingRef.current = false;
          return;
        }
        // Login OK! Usuário comum autenticado, pode virar jornaleiro
        logger.info('[Wizard] ✅ Usuário existente autenticado. Convertendo para jornaleiro.');
      }

      setToast('Conta criada! Autenticando...');

      // Tentar autenticar explicitamente (reforço)
      try { await signIn(email, password); } catch {}

      // 2. Preparar dados da banca
      const inProgressBank: Bank | null = bankName ? {
        name: bankName,
        whatsapp: servicePhone,
        images: { cover: bankCoverPreview || bankCoverUrl, profile: bankProfilePreview || bankProfileUrl },
        address: { cep, street, number, complement, neighborhood, city, uf },
        socials: {
          gmb: '',
          facebook: facebookHas === 'yes' ? facebookUrl : '',
          instagram: instagramHas === 'yes' ? instagramUrl : '',
        },
        hours,
        tpu_url: bankTpuUrl || undefined,
        meta: {
          socialsSkipped,
          socialsLinks: {
            facebook: (facebookHas === 'yes' && facebookUrl) ? (facebookUrl.startsWith('http') ? facebookUrl : `https://facebook.com/${facebookUrl.replace(/^@/, '')}`) : undefined,
            instagram: (instagramHas === 'yes' && instagramUrl) ? (instagramUrl.startsWith('http') ? instagramUrl : `https://instagram.com/${instagramUrl.replace(/^@/, '')}`) : undefined,
          },
          location: {
            lat: lat2 ? Number(lat2) : undefined,
            lng: lng2 ? Number(lng2) : undefined,
          }
        },
      } : null;
      
      const allBanks = inProgressBank ? [...banks, inProgressBank] : banks;
      if (allBanks.length === 0) {
        setError('Adicione pelo menos uma banca.');
        setStep(2);
        setIsBusy(false);
        setToast(null);
        finishingRef.current = false;
        return;
      }

      // 3. Criar banca no Supabase (via API)
      const bancaData = {
        name: allBanks[0].name,
        description: '',
        logo_url: allBanks[0].images.profile || null,
        cover_image: allBanks[0].images.cover || null,
        phone: phone,
        whatsapp: allBanks[0].whatsapp,
        email: email,
        instagram: allBanks[0].socials.instagram || null,
        facebook: allBanks[0].socials.facebook || null,
        cep: allBanks[0].address.cep,
        address: `${allBanks[0].address.street}, ${allBanks[0].address.number}${allBanks[0].address.complement ? ' - ' + allBanks[0].address.complement : ''} - ${allBanks[0].address.neighborhood}, ${allBanks[0].address.city} - ${allBanks[0].address.uf}`,
        lat: allBanks[0].meta?.location?.lat || -23.5505,
        lng: allBanks[0].meta?.location?.lng || -46.6333,
        hours: allBanks[0].hours,
        delivery_fee: 0,
        min_order_value: 0,
        delivery_radius: 5,
        preparation_time: 30,
        payment_methods: ['pix', 'dinheiro'],
        tpu_url: allBanks[0].tpu_url || null,
        is_cotista: isCotaAtiva,
        cotista_id: selectedCotaAtiva?.id || null,
        cotista_codigo: selectedCotaAtiva?.codigo || null,
        cotista_razao_social: selectedCotaAtiva?.razao_social || null,
        cotista_cnpj_cpf: selectedCotaAtiva?.cnpj_cpf || null,
      };

      // Salvar backup local (apenas dados da banca)
      logger.log('[Wizard] 💾 Salvando bancaData:', bancaData);
      logger.log('[Wizard] 🏢 is_cotista:', bancaData.is_cotista);
      logger.log('[Wizard] 🏢 cotista_id:', bancaData.cotista_id);
      localStorage.setItem("gb:bancaData", JSON.stringify(bancaData));
      
      // Limpar wizard para evitar popup de confirmação de saída
      localStorage.removeItem('gb:sellerWizard');
      
      setToast('✅ Cadastro concluído! Redirecionando...');
      
      // Aguardar sessão ser estabelecida com polling (máximo 5 tentativas)
      let sessionReady = false;
      for (let attempt = 0; attempt < 5; attempt++) {
        await new Promise(r => setTimeout(r, 500));
        // Verificar se a sessão foi estabelecida
        if (profile?.role === 'jornaleiro') {
          sessionReady = true;
          logger.log('[Wizard] ✅ Sessão estabelecida na tentativa', attempt + 1);
          break;
        }
        logger.log('[Wizard] ⏳ Aguardando sessão... tentativa', attempt + 1);
      }
      
      // Redirecionar para onboarding (usar hard navigation para garantir)
      logger.log('[Wizard] 🔄 Redirecionando para onboarding...');
      window.location.href = '/jornaleiro/onboarding';
      
    } catch (err) {
      logger.error('Erro no cadastro:', err);
      setError("Não foi possível concluir o cadastro. Tente novamente.");
      setIsBusy(false);
      setToast(null);
      finishingRef.current = false;
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
            style={{ width: `${((step - 1) / 5) * 100}%` }}
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
            { n: 3, label: 'Imagens', icon: (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z"/></svg>
            )},
            { n: 4, label: 'Funcionamento', icon: (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
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
            <h1 className="text-xl font-semibold">{step === 2 ? 'Dados de Acesso da Banca' : step === 3 ? 'Informações da Banca' : step === 4 ? 'Imagens da Banca' : step === 6 ? 'Conclusão' : 'Cadastro do Jornaleiro'}</h1>
            {step === 1 ? (
              <p className="mt-1 text-sm text-gray-600 px-4 md:px-8">Informe seu nome completo, CPF ou CNPJ e WhatsApp para começarmos seu cadastro.</p>
            ) : step === 2 ? (
              <p className="mt-1 text-sm text-gray-600 px-4 md:px-8">Agora precisamos do seu email e senha para criar sua conta de acesso.</p>
            ) : step === 3 ? (
              <p className="mt-1 text-sm text-gray-600 px-4 md:px-8">Vamos solicitar os dados públicos da sua banca. Essas informações serão exibidas para os clientes na plataforma.</p>
            ) : step === 4 ? (
              <p className="mt-1 text-sm text-gray-600 px-4 md:px-8">Adicione as imagens da sua banca para criar uma identidade visual atrativa. O banner aparece no topo e a foto de perfil identifica sua banca.</p>
            ) : step === 5 ? (
              <p className="mt-1 text-sm text-gray-600 px-4 md:px-8">Defina os horários de funcionamento da sua banca. Essas informações aparecerão para os clientes.</p>
            ) : step === 6 ? (
              <p className="mt-1 text-sm text-gray-600 px-4 md:px-8">Revise suas informações e finalize o cadastro da sua banca.</p>
            ) : null}
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-md border border-rose-300 bg-rose-50 text-rose-700 text-sm px-3 py-2">{error}</div>
        )}

        {/* Step de Cota Ativa oculto temporariamente - será reativado futuramente */}

        {step === 1 && (
          <div className="mt-4 grid grid-cols-1 gap-3">
            <div>
              <label className="text-[12px] text-gray-700">Nome completo</label>
              <input
                className={`input mt-1 w-full ${fieldErrors.name ? 'border-rose-400' : ''}`}
                value={name}
                required
                aria-invalid={!!fieldErrors.name}
                onChange={(e)=>{ setName(e.target.value); if (fieldErrors.name) setErrorField('name'); }}
                onBlur={()=> setErrorField('name', validateName(name))}
              />
              {fieldErrors.name && <div className="mt-1 text-[11px] text-rose-600">{fieldErrors.name}</div>}
            </div>
            {/* Linha: CPF e WhatsApp lado a lado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] text-gray-700">CPF ou CNPJ</label>
                <div className="relative mt-1">
                  <input
                    ref={cpfInputRef}
                    className={`input w-full pr-10 ${fieldErrors.cpf ? 'border-rose-400' : ''}`}
                    value={cpf}
                    onChange={(e)=>setCpf(maskCPFOrCNPJ(e.target.value))}
                    onKeyDown={(e)=>{ if (e.key === 'Enter' && cpfValid) { e.preventDefault(); phoneInputRef.current?.focus(); } }}
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    required
                    aria-invalid={!!fieldErrors.cpf}
                    onBlur={()=> setErrorField('cpf', validateCpf(cpf))}
                  />
                  {((cpfOnly.length === 11 || cpfOnly.length === 14) && cpfValid) && (
                    <span className="pointer-events-none absolute inset-y-0 right-2 grid place-items-center text-emerald-600">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                    </span>
                  )}
                </div>
                {fieldErrors.cpf ? (
                  <div className="mt-1 text-[11px] text-rose-600">{fieldErrors.cpf}</div>
                ) : ((cpfOnly.length === 11 || cpfOnly.length === 14) && !cpfValid && (
                  <div className="mt-1 text-[11px] text-rose-600">
                    {cpfOnly.length === 11 ? 'CPF inválido. Verifique os dígitos informados.' : 'CNPJ inválido. Verifique os dígitos informados.'}
                  </div>
                ))}
              </div>
              <div>
                <label className="text-[12px] text-gray-700">Whatsapp</label>
                <div className="relative">
                  <input
                    ref={phoneInputRef}
                    className={`input mt-1 w-full pr-16 ${fieldErrors.phone ? 'border-rose-400' : ''}`}
                    value={phone}
                    onChange={(e)=>{ setPhone(maskPhoneBR(e.target.value)); if (fieldErrors.phone) setErrorField('phone'); }}
                    onBlur={()=> setErrorField('phone', validatePhone(phone))}
                    placeholder="(00) 00000-0000"
                    required
                    aria-invalid={!!fieldErrors.phone}
                  />
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
                {fieldErrors.phone && <div className="mt-1 text-[11px] text-rose-600">{fieldErrors.phone}</div>}
              </div>
            </div>

            {/* Exibir informações se CPF já cadastrado (cotista ou banca) */}
	            {cpfExists && existingBancas.length > 0 && (
	              <div className="mt-6 space-y-4">
	                <div className="rounded-xl bg-amber-50 border-2 border-amber-300 p-4">
	                  <div className="flex items-start gap-3">
	                    <span className="text-amber-600 text-3xl shrink-0">⚠️</span>
	                    <div className="flex-1">
	                      <h3 className="text-lg font-bold text-amber-900">CPF/CNPJ já cadastrado!</h3>
	                      <p className="text-sm text-amber-800 mt-2">
	                        Existe banca cadastrada com esse CPF/CNPJ na plataforma. Para cadastrar outra banca, faça login e use "Minhas Bancas" &gt; "Cadastrar".
	                      </p>
	                    </div>
	                  </div>
	                </div>

                <div className="grid grid-cols-1 gap-3">
                  {existingBancas.map((banca) => (
                    <div key={banca.id} className="rounded-lg border-2 border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${isCotista ? 'bg-blue-100' : 'bg-orange-100'}`}>
                          {isCotista ? (
                            <svg viewBox="0 0 24 24" className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 9l1-5h16l1 5M4 9h16v10H4z"/>
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-semibold text-gray-900 truncate">{banca.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{banca.address}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

	                <div className="flex justify-center">
	                  <Link 
	                    href="/jornaleiro" 
	                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
	                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                    </svg>
	                    Fazer login
	                  </Link>
	                </div>
	              </div>
	            )}
          </div>
        )}

        {step === 2 && (
          <div className="mt-4 grid grid-cols-1 gap-3">
            <div>
              <label className="text-[12px] text-gray-700">Email</label>
              <div className="relative">
                <input
                  ref={emailInputRef}
                  type="email"
                  className={`input mt-1 w-full pr-16 ${fieldErrors.email ? 'border-rose-400' : ''}`}
                  value={email}
                  onChange={(e)=>{ 
                    setEmail(e.target.value); 
                    if (fieldErrors.email) setErrorField('email');
                    if (emailExists) setEmailExists(false); 
                  }}
                  onBlur={async () => {
                    const error = validateEmailField(email);
                    setErrorField('email', error);
                    
                    // Se o email for válido sintaticamente e não estiver vazio, verificar na API
                    if (!error && email) {
                      setCheckingEmail(true);
                      try {
                        const res = await fetch('/api/jornaleiro/check-email', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email })
                        });
                        const data = await res.json();
                        if (data.exists) {
                          setEmailExists(true);
                          setErrorField('email', data.message || 'Este e-mail já está cadastrado.');
                        } else {
                          setEmailExists(false);
                        }
                      } catch (err) {
                        console.error('Erro ao verificar email:', err);
                      } finally {
                        setCheckingEmail(false);
                      }
                    }
                  }}
                  required
                  aria-invalid={!!fieldErrors.email}
                />
                {/* Ícone de Loading */}
                {checkingEmail && (
                  <span className="pointer-events-none absolute inset-y-0 right-10 grid place-items-center text-blue-500">
                     <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                       <circle cx="12" cy="12" r="10" opacity="0.25"/>
                       <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"/>
                     </svg>
                  </span>
                )}
                {/* Ícone de Sucesso (apenas se validado na API e ok) */}
                {emailValid && !checkingEmail && !emailExists && !fieldErrors.email && (
                  <span className="pointer-events-none absolute inset-y-0 right-10 grid place-items-center text-emerald-600">
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
              {fieldErrors.email && <div className="mt-1 text-[11px] text-rose-600">{fieldErrors.email}</div>}
            </div>
            <div className="relative">
              <label className="text-[12px] text-gray-700">Senha</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className={`input mt-1 w-full pr-10 ${fieldErrors.password ? 'border-rose-400' : ''}`}
                value={password}
                onChange={(e)=>{ setPassword(e.target.value); if (fieldErrors.password) setErrorField('password'); }}
                onBlur={()=> setErrorField('password', validatePasswordField(password))}
                required
                aria-invalid={!!fieldErrors.password}
              />
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
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className={`input mt-1 w-full pr-10 ${fieldErrors.confirmPassword ? 'border-rose-400' : ''}`}
                  value={confirmPassword}
                  onChange={(e)=>{ setConfirmPassword(e.target.value); if (fieldErrors.confirmPassword) setErrorField('confirmPassword'); }}
                  onBlur={()=> setErrorField('confirmPassword', validateConfirmField(confirmPassword, password))}
                  required
                  aria-invalid={!!fieldErrors.confirmPassword}
                />
                <button type="button" aria-label="Mostrar confirmação" onClick={()=>setShowConfirm(v=>!v)} className="absolute right-2 top-[34px] text-gray-500 hover:text-black">
                  {showConfirm ? (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.73 2.1-3.64 3.95-5.22M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-."></path><path d="M1 1l22 22"></path></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
                {fieldErrors.confirmPassword && <div className="mt-1 text-[11px] text-rose-600">{fieldErrors.confirmPassword}</div>}
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

        {step === 3 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Nome da banca acima do CEP */}
            <div className="md:col-span-2">
              <label className="text-[12px] text-gray-700">Nome da banca</label>
              <input className="input mt-1 w-full" value={bankName} onChange={(e)=>setBankName(e.target.value)} />
            </div>
            {/* Linha dedicada: CEP (esquerda) + Endereço (direita) alinhados */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-3 items-end">
              <div>
                <label className="block text-[12px] text-gray-700">CEP</label>
                <div className="relative mt-1 w-full">
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
              </div>
              <div>
                <label className="text-[12px] text-gray-700">Endereço</label>
                <input className="input mt-1 w-full disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100" value={street} onChange={(e)=>setStreet(e.target.value)} disabled={!cepReady} />
              </div>
            </div>

            {/* Campos complementares de endereço */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
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
              <label className="text-[12px] text-gray-700">WhatsApp de atendimento</label>
              <input className="input mt-1 w-full" placeholder="(00) 00000-0000" value={servicePhone} onChange={(e)=>setServicePhone(maskPhoneBR(e.target.value))} />
            </div>


            {/* Geolocalização oculta nesta etapa (mantida apenas em memória) */}
            
          </div>
        )}

        {step === 3 && null}

        {step === 4 && (
          <div className="mt-4 space-y-6">
            {/* Preview da Banca com imagens */}
            <div className="rounded-xl border border-gray-200 p-6 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4 text-center">Prévia da sua Banca</h3>
              
              {/* Layout da banca como preview */}
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden w-full">
                {/* Banner/Cover */}
                <div className="relative h-48 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                  {bankCoverPreview || bankCoverUrl ? (
                    <img 
                      src={bankCoverPreview || bankCoverUrl} 
                      alt="Banner da banca" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-sm font-medium">Banner da Banca</div>
                  )}
                  
                  {/* Foto de perfil */}
                  <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                    {bankProfilePreview || bankProfileUrl ? (
                      <img 
                        src={bankProfilePreview || bankProfileUrl} 
                        alt="Perfil da banca" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                </div>
                
                {/* Informações da banca */}
                <div className="pt-12 pb-6 px-6">
                  <h4 className="font-bold text-lg">{bankName || 'Nome da Banca'}</h4>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Banca Ativa</span>
                    <span>•</span>
                    <span>📍 {city || 'Cidade'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload das imagens */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">📸 Imagens da Banca</h3>
                
                {/* Banner/Cover */}
                <div className="mb-6">
                  <FileUploadDragDrop
                    label="Banner da Banca (Imagem de Capa)"
                    value={bankCoverUrl}
                    onChange={(url) => {
                      setBankCoverUrl(url);
                      setBankCoverPreview(url);
                    }}
                    accept="image/*"
                    placeholder="https://exemplo.com/banner.jpg"
                    role="jornaleiro"
                    className="h-32 w-full"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Recomendado: 800x200px. Esta imagem aparece no topo da sua banca.
                  </p>
                </div>

                {/* Profile/Avatar */}
                <div>
                  <FileUploadDragDrop
                    label="Foto de Perfil da Banca"
                    value={bankProfileUrl}
                    onChange={(url) => {
                      setBankProfileUrl(url);
                      setBankProfilePreview(url);
                    }}
                    accept="image/*"
                    placeholder="https://exemplo.com/perfil.jpg"
                    role="jornaleiro"
                    className="h-32 w-full"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Recomendado: 200x200px (quadrada). Esta imagem identifica sua banca.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
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

        {step === 6 && (
          <div className="mt-6 text-center space-y-3">
            <h2 className="text-lg font-semibold">Tudo pronto! Bem-vindo ao Guia das Bancas</h2>
            <p className="text-sm text-gray-700 max-w-xl mx-auto">Você tomou a decisão certa ao trazer sua banca para o digital. Agora sua presença online vai ajudar novos clientes a encontrarem seus produtos com facilidade.</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <a href="/jornaleiro" className="rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-4 py-2 text-sm font-semibold text-white hover:opacity-95">Acessar Painel do Jornaleiro</a>
              <a href="https://chat.whatsapp.com/LiPZtsKqSrUEx222oAUBWM" target="_blank" rel="noopener noreferrer" className="rounded-md bg-gradient-to-r from-[#25D366] to-[#1ebe5d] px-4 py-2 text-sm font-semibold text-white hover:opacity-95">Entrar no grupo do WhatsApp</a>
            </div>
          </div>
        )}

        {step !== 6 && (
        <div className="mt-6 flex items-center justify-end">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button onClick={onBack} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">Voltar</button>
            )}
            {step < 5 ? (
              <button 
                onClick={onNext} 
                disabled={checkingCpf || isBusy || checkingEmail || emailExists}
                className="rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {(checkingCpf || isBusy || checkingEmail) && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" opacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"/>
                  </svg>
                )}
                {checkingCpf ? 'Verificando...' : checkingEmail ? 'Validando email...' : isBusy ? 'Aguarde...' : 'Avançar'}
              </button>
            ) : step === 5 ? (
              <button
                onClick={onFinish}
                disabled={isBusy}
                className="rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {isBusy && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" opacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"/>
                  </svg>
                )}
                {isBusy ? 'Concluindo...' : 'Concluir cadastro'}
              </button>
            ) : null}
          </div>
        </div>
        )}
      </div>
    </section>
    <div className="container-max mt-4 mb-10">
      <p className="text-center text-sm">
        <a href="/" className="text-gray-500 hover:text-gray-700 underline">← Voltar para Home</a>
      </p>
    </div>
    {toast && (
      <div className="fixed right-4 top-4 z-[60] rounded-md border border-gray-200 bg-white shadow px-3 py-2 text-sm text-gray-800">
        {toast}
      </div>
    )}
    </>
  );
}

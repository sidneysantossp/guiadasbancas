"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
// import { useAuth } from "../../hooks/useAuth";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useToast } from "@/components/ToastProvider";
import { shippingConfig } from "@/components/shippingConfig";
import FreeShippingProgress from "@/components/FreeShippingProgress";
import { aggregateCartDims } from "@/components/shippingUtil";


export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalCount, addToCart, removeFromCart, clearCart } = useCart();
  // const { isAuthenticated, isLoading } = useAuth();
  const { show } = useToast();
  
  // Todos os hooks devem estar no início
  const subtotal = useMemo(() => items.reduce((sum, it) => sum + (it.price ?? 0) * it.qty, 0), [items]);
  
  // Cupom e frete
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState<string | null>(null);
  // Dados simples do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // Endereço estruturado
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [complement, setComplement] = useState("");
  const [addrLoading, setAddrLoading] = useState(false);
  const [addrError, setAddrError] = useState<string | null>(null);
  const [payment, setPayment] = useState("pix");
  const [paymentChange, setPaymentChange] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [userObj, setUserObj] = useState<{ name: string; email: string } | null>(null);
  const [addressMode, setAddressMode] = useState<"primary" | "new">("primary");
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneDraft, setPhoneDraft] = useState("");
  const [deliveryEnabled, setDeliveryEnabled] = useState<boolean>(false);
  const [loadingBancaConfig, setLoadingBancaConfig] = useState(true);
  type SavedAddress = {
    id: string;
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    uf: string;
    complement?: string;
    isPrimary?: boolean;
  };
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const UF_OPTIONS = [
    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
    "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
    "RS","RO","RR","SC","SP","SE","TO"
  ];
  // CEP e estimativa Correios
  const [destCEP, setDestCEP] = useState("");
  const [cepTouched, setCepTouched] = useState(false);
  // CEP helpers
  const onlyDigits = useCallback((s: string) => s.replace(/\D/g, ""), []);
  const formatCEP = useCallback((digits: string) => {
    const d = onlyDigits(digits).slice(0, 8);
    if (d.length <= 5) return d;
    return `${d.slice(0,5)}-${d.slice(5)}`;
  }, [onlyDigits]);
  const isValidCEP = useMemo(() => onlyDigits(destCEP).length === 8, [destCEP, onlyDigits]);
  // Máscara de telefone: (XX) XXXXX-XXXX
  const formatPhone = useCallback((val: string) => {
    const d = onlyDigits(val).slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  }, [onlyDigits]);
  
  // TODOS OS useEffect ANTES DOS RETURNS CONDICIONAIS
  
  // Auto preenchimento de endereço via ViaCEP quando CEP válido e campos vazios (com cache)
  useEffect(() => {
    const run = async () => {
      if (!isValidCEP) return;
      if (street || neighborhood || city || uf) return;
      try {
        setAddrError(null);
        setAddrLoading(true);
        const cepDigits = onlyDigits(destCEP);
        // cache simples em sessionStorage
        const cacheKey = `viacep:${cepDigits}`;
        let data: any | null = null;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          try { data = JSON.parse(cached); } catch {}
        }
        if (!data) {
          const res = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`);
          data = await res.json();
          try { sessionStorage.setItem(cacheKey, JSON.stringify(data)); } catch {}
        }
        if (data?.erro) {
          setAddrError("CEP não encontrado");
          return;
        }
        if (!street && data.logradouro) setStreet(data.logradouro);
        if (!neighborhood && data.bairro) setNeighborhood(data.bairro);
        if (!city && data.localidade) setCity(data.localidade);
        if (!uf && data.uf) setUf(data.uf);
      } catch (e) {
        setAddrError("Falha ao consultar endereço por CEP");
      } finally {
        setAddrLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidCEP, destCEP]);

  // Persistência do perfil no localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("gb:checkout:profile");
      if (raw) {
        const p = JSON.parse(raw) as Partial<Record<string, string>>;
        if (p.name) setName((v)=> v || p.name!);
        if (p.email) setEmail((v)=> v || p.email!);
        if (p.phone) setPhone((v)=> v || p.phone!);
        if (p.destCEP) setDestCEP((v)=> v || p.destCEP!);
        if (p.street) setStreet((v)=> v || p.street!);
        if (p.houseNumber) setHouseNumber((v)=> v || p.houseNumber!);
        if (p.neighborhood) setNeighborhood((v)=> v || p.neighborhood!);
        if (p.city) setCity((v)=> v || p.city!);
        if (p.uf) setUf((v)=> v || p.uf!);
        if (p.complement) setComplement((v)=> v || p.complement!);
        if ((p as any).coupon) setCoupon((p as any).coupon as string);
        if ((p as any).couponApplied) setCouponApplied((p as any).couponApplied as string);
        if ((p as any).payment) setPayment((p as any).payment as string);
        if ((p as any).paymentChange) setPaymentChange((p as any).paymentChange as string);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      const payload = {
        name, email, phone, destCEP, street, houseNumber, neighborhood, city, uf, complement,
        coupon, couponApplied,
        payment, paymentChange,
      };
      localStorage.setItem("gb:checkout:profile", JSON.stringify(payload));
    } catch {}
  }, [name, email, phone, destCEP, street, houseNumber, neighborhood, city, uf, complement, coupon, couponApplied, payment, paymentChange]);

  // Buscar configuração de entrega da banca
  useEffect(() => {
    const fetchBancaConfig = async () => {
      try {
        setLoadingBancaConfig(true);
        const firstItem = items[0];
        if (firstItem?.banca_id) {
          const res = await fetch(`/api/admin/bancas?id=${firstItem.banca_id}`);
          if (res.ok) {
            const data = await res.json();
            const bancaData = data?.data;
            setDeliveryEnabled(Boolean(bancaData?.delivery_enabled));
          }
        }
      } catch (e) {
        console.error('Erro ao buscar configuração da banca:', e);
      } finally {
        setLoadingBancaConfig(false);
      }
    };
    fetchBancaConfig();
  }, [items]);
  const [shipOpts, setShipOpts] = useState<{ code: string; price: number; days: number }[]>([]);
  const [shipLoading, setShipLoading] = useState(false);
  const [shipError, setShipError] = useState<string | null>(null);
  const [shipping, setShipping] = useState<"retirada" | "SEDEX" | "MOTOBOY">("SEDEX");

  const discount = useMemo(() => {
    if (!couponApplied) return 0;
    if (couponApplied === "DESCONTO10") return subtotal * 0.1;
    return 0;
  }, [couponApplied, subtotal]);

  // Máscara BRL para "Troco para"
  const maskBRL = useCallback((v: string) => {
    const digits = (v || "").replace(/\D+/g, "");
    const cents = digits ? parseInt(digits, 10) : 0;
    const value = cents / 100;
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, []);
  const parseBRL = useCallback((v: string) => {
    const digits = (v || "").replace(/\D+/g, "");
    const cents = digits ? parseInt(digits, 10) : 0;
    return cents / 100;
  }, []);

  const qualifiesByThreshold = subtotal >= shippingConfig.freeShippingThreshold;
  const freeShippingActive = shippingConfig.freeShippingEnabled || qualifiesByThreshold;

  const selectedCarrierPrice = useMemo(() => {
    if (shipping === "retirada") return 0;
    const found = shipOpts.find((s) => s.code === shipping);
    return found?.price ?? 0;
  }, [shipping, shipOpts]);

  const shippingCost = freeShippingActive ? 0 : selectedCarrierPrice;

  const total = Math.max(0, subtotal - discount) + shippingCost;

  useEffect(() => {
    try {
      const raw = localStorage.getItem("gb:user");
      setIsLogged(!!raw);
      setUserObj(raw ? JSON.parse(raw) : null);
    } catch {}
  }, []);

  // Se usuário logado e não há endereço salvo, força modo 'new'.
  const hasPrimaryAddress = useMemo(() => addresses.length > 0, [addresses]);
  useEffect(() => {
    if (isLogged && !hasPrimaryAddress) setAddressMode("new");
  }, [isLogged, hasPrimaryAddress]);

  // Quando modo = primary, garante que o CEP exibido para frete seja o salvo
  useEffect(() => {
    if (addressMode === "primary") {
      // Seleciona endereço primário e aplica aos campos
      const primary = addresses.find(a => a.isPrimary) || addresses[0];
      if (primary) {
        setSelectedAddressId(primary.id);
        setDestCEP(primary.cep);
        setStreet(primary.street);
        setHouseNumber(primary.number);
        setNeighborhood(primary.neighborhood);
        setCity(primary.city);
        setUf(primary.uf);
        setComplement(primary.complement || "");
      } else {
        setSelectedAddressId(null);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressMode]);

  // Carrega endereços salvos
  useEffect(() => {
    try {
      const raw = localStorage.getItem("gb:addresses");
      if (raw) {
        const arr = JSON.parse(raw) as SavedAddress[];
        setAddresses(Array.isArray(arr) ? arr : []);
      }
    } catch {}
  }, []);

  // Persistir endereços quando alterarem
  useEffect(() => {
    try { localStorage.setItem("gb:addresses", JSON.stringify(addresses)); } catch {}
  }, [addresses]);
  
  // Quando um novo endereço é adicionado como principal, garantir que seja selecionado
  useEffect(() => {
    if (addresses.length > 0) {
      const primaryAddr = addresses.find(a => a.isPrimary);
      if (primaryAddr) {
        // Sempre garantir que estamos no modo primary quando há endereços
        if (addressMode !== 'primary') {
          setAddressMode('primary');
        }
        // Selecionar o endereço principal se não estiver selecionado
        if (selectedAddressId !== primaryAddr.id) {
          setSelectedAddressId(primaryAddr.id);
        }
        // Aplicar os dados do endereço principal
        if (addressMode === 'primary') {
          setDestCEP(primaryAddr.cep);
          setStreet(primaryAddr.street);
          setHouseNumber(primaryAddr.number);
          setNeighborhood(primaryAddr.neighborhood);
          setCity(primaryAddr.city);
          setUf(primaryAddr.uf);
          setComplement(primaryAddr.complement || "");
        }
      }
    }
  }, [addresses, addressMode, selectedAddressId]);
  
  // Função para calcular frete
  const calcShipping = useCallback(async () => {
    if (!isValidCEP || !items.length) {
      setShipError("CEP inválido ou carrinho vazio");
      return;
    }
    
    setShipLoading(true);
    setShipError(null);
    
    try {
      // Buscar endereço da banca do primeiro produto
      const firstItem = items[0];
      let bancaCEP = shippingConfig.originCEP; // fallback
      
      if (firstItem.banca_id) {
        try {
          const bancaRes = await fetch(`/api/admin/bancas/${firstItem.banca_id}`);
          if (bancaRes.ok) {
            const bancaData = await bancaRes.json();
            if (bancaData.cep) {
              bancaCEP = bancaData.cep;
            }
          }
        } catch (bancaError) {
          console.warn('Erro ao buscar dados da banca:', bancaError);
        }
      }
      
      // Calcular dimensões para revistas (otimizado)
      const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
      const weight = Math.max(0.1, totalQty * 0.15); // 150g por revista
      const dims = {
        weight: weight.toString(),
        length: "28", // revista padrão
        height: Math.min(21, totalQty * 0.5).toString(), // altura cresce com quantidade
        width: "0.5"
      };
      
      const params = new URLSearchParams({
        from: bancaCEP.replace(/\D/g, ''),
        to: destCEP.replace(/\D/g, ''),
        ...dims
      });
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        const res = await fetch(`/api/shipping?${params.toString()}`, { 
          cache: "no-store", 
          signal: controller.signal 
        });
        clearTimeout(timeoutId);
        
        const data = await res.json();
        
        if (data.ok && data.services) {
          const validServices = data.services.filter((s: any) => 
            s.code && (s.code === 'MOTOBOY' || (s.price && !isNaN(s.price) && s.price > 0))
          );
          
          if (validServices.length > 0) {
            setShipOpts(validServices);
            // Selecionar SEDEX como padrão se disponível, senão o primeiro
            const sedexOption = validServices.find((s: any) => s.code === 'SEDEX');
            if (sedexOption) {
              setShipping('SEDEX');
            } else {
              setShipping(validServices[0].code as any);
            }
          } else {
            throw new Error('Nenhum serviço de entrega disponível');
          }
        } else {
          throw new Error(data.error || 'Erro ao consultar frete');
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
      
    } catch (error: any) {
      console.error('Erro no cálculo de frete:', error);
      setShipError(error.message || 'Erro ao calcular frete. Tente novamente.');
      setShipOpts([]);
    } finally {
      setShipLoading(false);
    }
  }, [isValidCEP, items, destCEP]);

  const saveNewAddressAsPrimary = () => {
    if (!isValidCEP || !street || !neighborhood || !city || !uf || !houseNumber) {
      show("Preencha CEP e número para salvar o endereço");
      return;
    }
    const id = `addr_${Date.now()}`;
    const newAddr: SavedAddress = {
      id,
      cep: destCEP,
      street,
      number: houseNumber,
      neighborhood,
      city,
      uf,
      complement,
      isPrimary: true,
    };
    const updated = [newAddr, ...addresses.map(a => ({ ...a, isPrimary: false }))];
    setAddresses(updated);
    setSelectedAddressId(id);
    setAddressMode("primary"); // Muda para modo primary automaticamente
    show("Endereço salvo como principal e selecionado");
  };

  const onSelectSavedAddress = (addrId: string) => {
    const a = addresses.find(x => x.id === addrId);
    if (!a) return;
    setSelectedAddressId(addrId);
    setDestCEP(a.cep);
    setStreet(a.street);
    setHouseNumber(a.number);
    setNeighborhood(a.neighborhood);
    setCity(a.city);
    setUf(a.uf);
    setComplement(a.complement || "");
  };

  const setPrimaryAddress = (addrId: string) => {
    const exists = addresses.some(a => a.id === addrId);
    if (!exists) return;
    const updated = addresses.map(a => ({ ...a, isPrimary: a.id === addrId }));
    setAddresses(updated);
    onSelectSavedAddress(addrId);
    setAddressMode('primary');
    show('Endereço definido como principal e selecionado');
  };

  const deleteAddress = (addrId: string) => {
    const remaining = addresses.filter(a => a.id !== addrId);
    // Se removeu o principal, promove o primeiro dos restantes a principal
    let adjusted = remaining;
    if (addresses.find(a => a.id === addrId)?.isPrimary && remaining.length > 0) {
      adjusted = remaining.map((a, i) => ({ ...a, isPrimary: i === 0 }));
    }
    setAddresses(adjusted);
    if (adjusted.length === 0) {
      setSelectedAddressId(null);
      setAddressMode('new');
    } else {
      const pri = adjusted.find(a => a.isPrimary) || adjusted[0];
      setSelectedAddressId(pri.id);
      onSelectSavedAddress(pri.id);
    }
    show('Endereço removido');
  };

  const isValidUF = useMemo(() => /^[A-Z]{2}$/.test(uf.trim()), [uf]);
  const isValidHouseNumber = useMemo(() => {
    const v = houseNumber.trim().toUpperCase();
    if (!v) return false;
    if (v === "S/N") return true;
    return /\d+/.test(v);
  }, [houseNumber]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    if (!items.length) {
      show("Seu carrinho está vazio");
      setSubmitting(false);
      return;
    }
    // Validações de endereço
    if (!isValidUF) {
      show("UF inválida. Use 2 letras (ex.: SP)");
      return;
    }
    if (!isValidHouseNumber) {
      show("Número inválido. Informe um número ou 's/n'");
      return;
    }
    // Aviso de troco insuficiente (não bloqueia)
    try {
      if (payment === 'cash') {
        const changeVal = parseBRL(paymentChange || '');
        if (changeVal > 0 && changeVal < total) {
          show('Aviso: o valor de troco é menor que o total do pedido');
        }
      }
    } catch {}

    // Exigir login/registro antes de finalizar
    try {
      const logged = typeof window !== "undefined" && !!localStorage.getItem("gb:user");
      if (!logged) {
        show("Entre ou registre-se para finalizar a compra");
        try { localStorage.setItem("gb:redirectAfterLogin", "/checkout"); } catch {}
        router.push("/minha-conta");
        setSubmitting(false);
        return;
      }
    } catch {}
    // Enviar pedido ao endpoint mock
    try {
      const genTxn = () => `TXN-${Date.now()}`;
      const firstBancaId = items.find(it => (it as any).banca_id)?.banca_id || undefined;
      const payload = {
        customer: { name, email, phone },
        address: { street, houseNumber, neighborhood, city, uf, complement, cep: destCEP },
        items: items.map(it => ({ id: it.id, name: it.name, qty: it.qty, price: it.price, image: it.image, banca_id: (it as any).banca_id })),
        banca_id: firstBancaId,
        pricing: { subtotal, discount, shipping: shippingCost, total },
        shippingMethod: shipping,
        coupon: couponApplied,
        payment,
        paymentChange: payment === 'cash' ? parseBRL(paymentChange || '') : undefined,
        paymentTxnId: payment === 'pix' || payment === 'card' ? genTxn() : undefined,
        createdAt: new Date().toISOString(),
      };
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data?.ok) {
        show(data?.error || 'Falha ao criar pedido');
        setSubmitting(false);
        return;
      }
      const lastOrder = {
        orderId: data.orderId,
        status: 'processing',
        ...payload,
      };
      try {
        localStorage.setItem('gb:lastOrder', JSON.stringify(lastOrder));
        const rawOrders = localStorage.getItem('gb:orders');
        const list = rawOrders ? (JSON.parse(rawOrders) as any[]) : [];
        const updated = [lastOrder, ...list];
        localStorage.setItem('gb:orders', JSON.stringify(updated));
      } catch {}
      show(`Pedido recebido! Nº ${data.orderId}`);
      clearCart();
      router.push('/minha-conta');
    } catch (err: any) {
      show('Erro ao enviar pedido. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container-max py-8 pb-40 md:pb-24">
      <h1 className="text-xl sm:text-2xl font-semibold">Checkout</h1>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <form id="checkout-form" onSubmit={onSubmit} className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-4 space-y-4">
          <div>
            <h2 className="text/base font-semibold">Seus dados</h2>
            {!isLogged ? (
              <>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input className="input" placeholder="Nome completo" value={name} onChange={(e)=>setName(e.target.value)} required />
                  <input className="input" type="email" placeholder="E-mail" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                  <input className="input" placeholder="Telefone (XX) XXXXX-XXXX" value={phone} onChange={(e)=>setPhone(formatPhone(e.target.value))} inputMode="tel" />
                </div>
                {/* CEP para iniciar preenchimento do endereço */}
                <div className="mt-3 flex gap-2 items-start">
                  <input
                    className={`input max-w-xs ${cepTouched && !isValidCEP ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''}`}
                    placeholder="CEP (00000-000)"
                    value={destCEP}
                    onChange={(e)=>{ setDestCEP(formatCEP(e.target.value)); }}
                    onBlur={()=> setCepTouched(true)}
                    inputMode="numeric"
                    aria-invalid={cepTouched && !isValidCEP}
                  />
                  {addrLoading && <div className="text-[12px] text-gray-600 mt-2">Buscando endereço...</div>}
                  {addrError && <div className="text-[12px] text-red-600 mt-2">{addrError}</div>}
                </div>
                {/* Endereço aparece somente após CEP válido e busca */}
                {(isValidCEP && (addrLoading || street || city || uf)) && (
                  <>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-6 gap-3">
                      <input className="input sm:col-span-2" placeholder="Endereço" value={street} readOnly />
                      <input className={`input ${!isValidHouseNumber && houseNumber ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''}`} placeholder="Número" value={houseNumber} onChange={(e)=>setHouseNumber(e.target.value)} required />
                      <input className="input" placeholder="Bairro" value={neighborhood} readOnly />
                      <input className="input" placeholder="Cidade" value={city} readOnly />
                      <select className={`input ${uf && !isValidUF ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''}`} value={uf} onChange={(e)=>setUf(e.target.value)} disabled>
                        <option value="">UF</option>
                        {UF_OPTIONS.map((u)=> (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                    {!isValidHouseNumber && houseNumber && (<div className="mt-1 text-[12px] text-red-600">Número inválido. Informe um número ou "s/n".</div>)}
                    <div className="mt-2 grid grid-cols-1">
                      <input className="input" placeholder="Complemento (opcional)" value={complement} onChange={(e)=>setComplement(e.target.value)} />
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                {/* Resumo do usuário */}
                <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="space-y-1">
                      <div><span className="text-gray-600">Nome:</span> <span className="font-medium">{userObj?.name || name || "-"}</span></div>
                      <div><span className="text-gray-600">E-mail:</span> <span className="font-medium">{userObj?.email || email || "-"}</span></div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Telefone:</span>
                        {!editingPhone ? (
                          <>
                            <span className="font-medium">{phone || "-"}</span>
                            <button type="button" className="text-[12px] underline" onClick={()=>{ setPhoneDraft(phone); setEditingPhone(true); }}>Editar</button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <input className="input h-8" value={phoneDraft} onChange={(e)=> setPhoneDraft(formatPhone(e.target.value))} placeholder="(XX) XXXXX-XXXX" />
                            <button type="button" className="rounded-md bg-[#ff5c00] px-2 py-1 text-white text-[12px]" onClick={()=>{ setPhone(phoneDraft); setEditingPhone(false); show('Telefone atualizado'); }}>Salvar</button>
                            <button type="button" className="rounded-md border px-2 py-1 text-[12px]" onClick={()=>{ setEditingPhone(false); setPhoneDraft(""); }}>Cancelar</button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-[12px] text-gray-600">Dados carregados da sua conta</div>
                  </div>
                </div>

                {/* Seleção de endereço - só aparece se entrega habilitada */}
                {deliveryEnabled && (
                <div className="mt-3 space-y-2">
                  <div className="text-sm font-semibold">Endereço de entrega</div>
                  {addresses.length > 0 && (
                    <div className="space-y-2">
                      {addresses.map((a) => (
                        <label key={a.id} className={`flex items-start gap-2 rounded-md border p-2 cursor-pointer ${addressMode==='primary' && selectedAddressId===a.id ? 'border-[#ff5c00] bg-[#fff7f2]' : 'border-gray-300 bg-white'}`}>
                          <input type="radio" name="addr-saved" className="mt-1" checked={addressMode==='primary' && selectedAddressId===a.id} onChange={()=> { setAddressMode('primary'); onSelectSavedAddress(a.id); }} />
                          <div className="flex-1">
                            <div className="text-sm font-medium flex items-center gap-2">
                              {a.street}{a.number ? `, ${a.number}` : ''}
                              <span className="text-[11px] text-gray-600">{a.neighborhood}, {a.city} - {a.uf} {a.cep ? `(${a.cep})` : ''}</span>
                              {a.isPrimary && <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-[2px] text-[10px] font-semibold">Principal</span>}
                            </div>
                            {a.complement && <div className="text-[12px] text-gray-600">Comp.: {a.complement}</div>}
                          </div>
                          <div className="flex items-center gap-2 self-center">
                            {!a.isPrimary && (
                              <button type="button" className="text-[12px] underline" onClick={(e)=>{ e.preventDefault(); setPrimaryAddress(a.id); }}>Tornar principal</button>
                            )}
                            <button type="button" className="text-[12px] text-red-600 underline" onClick={(e)=>{ e.preventDefault(); deleteAddress(a.id); }}>Remover</button>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                  {/* Botão para adicionar novo endereço quando já existem endereços */}
                  {addresses.length > 0 && addressMode === 'primary' && (
                    <button 
                      type="button"
                      onClick={() => setAddressMode('new')}
                      className="w-full flex items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 p-3 text-sm font-medium text-gray-600 hover:border-[#ff5c00] hover:text-[#ff5c00] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Adicionar outro endereço
                    </button>
                  )}
                  
                  {/* Opção de novo endereço (só aparece se não há endereços ou está no modo new) */}
                  {(addresses.length === 0 || addressMode === 'new') && (
                    <div className={`rounded-md border p-2 ${addressMode==='new' ? 'border-[#ff5c00] bg-[#fff7f2]' : 'border-gray-300 bg-white'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">
                          {addresses.length === 0 ? 'Adicionar endereço de entrega' : 'Novo endereço'}
                        </div>
                        {addresses.length > 0 && (
                          <button 
                            type="button"
                            onClick={() => setAddressMode('primary')}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                      {(addresses.length === 0 || addressMode==='new') && (
                        <div className="mt-2 space-y-2">
                          <div className="flex gap-2 items-start">
                            <input
                              className={`input max-w-xs ${cepTouched && !isValidCEP ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''}`}
                              placeholder="CEP (00000-000)"
                              value={destCEP}
                              onChange={(e)=>{ setDestCEP(formatCEP(e.target.value)); }}
                              onBlur={()=> setCepTouched(true)}
                              inputMode="numeric"
                              aria-invalid={cepTouched && !isValidCEP}
                            />
                            {addrLoading && <div className="text-[12px] text-gray-600 mt-2">Buscando endereço...</div>}
                            {addrError && <div className="text-[12px] text-red-600 mt-2">{addrError}</div>}
                          </div>
                          {(isValidCEP && (addrLoading || street || city || uf)) && (
                            <>
                              <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                                <input className="input sm:col-span-2" placeholder="Endereço" value={street} readOnly />
                                <input className={`input ${!isValidHouseNumber && houseNumber ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''}`} placeholder="Número" value={houseNumber} onChange={(e)=>setHouseNumber(e.target.value)} required />
                                <input className="input" placeholder="Bairro" value={neighborhood} readOnly />
                                <input className="input" placeholder="Cidade" value={city} readOnly />
                                <select className={`input ${uf && !isValidUF ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''}`} value={uf} onChange={(e)=>setUf(e.target.value)} disabled>
                                  <option value="">UF</option>
                                  {UF_OPTIONS.map((u)=> (
                                    <option key={u} value={u}>{u}</option>
                                  ))}
                                </select>
                              </div>
                              {!isValidHouseNumber && houseNumber && (<div className="text-[12px] text-red-600">Número inválido. Informe um número ou "s/n".</div>)}
                              <div className="grid grid-cols-1">
                                <input className="input" placeholder="Complemento (opcional)" value={complement} onChange={(e)=>setComplement(e.target.value)} />
                              </div>
                              <div>
                                <button type="button" className="mt-2 inline-flex items-center rounded-md bg-[#ff5c00] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-95" onClick={saveNewAddressAsPrimary}>Salvar como principal</button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                )}
              </>
            )}
          </div>

          {/* Seção de entrega - só aparece se entrega habilitada */}
          {deliveryEnabled && (
          <div>
            <h2 className="text-base font-semibold">Entrega</h2>
            <div className="mt-2 flex gap-2 items-center">
              <span className="text-sm text-gray-600">CEP: <span className="font-semibold">{destCEP || "--"}</span></span>
              <button
                type="button"
                onClick={calcShipping}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
                disabled={shipLoading || !isValidCEP || !items.length}
              >
                {shipLoading ? "Consultando..." : "Calcular frete"}
              </button>
            </div>
            {shipError && <div className="mt-2 text-[12px] text-red-600">{shipError}</div>}
            {!shipError && cepTouched && !isValidCEP && (
              <div className="mt-2 text-[12px] text-red-600">CEP inválido. Use o formato 00000-000.</div>
            )}
            {/* Barra de progresso da meta de frete grátis */}
            <div className="mt-3">
              <FreeShippingProgress subtotal={subtotal} />
            </div>
            <div className="mt-3">
              {/* Cupom */}
              <div>
                <h2 className="text-base font-semibold">Cupom</h2>
                <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:items-center">
                  <input
                    className="input sm:max-w-xs"
                    placeholder="Insira seu cupom"
                    value={coupon}
                    onChange={(e)=> setCoupon(e.target.value.toUpperCase())}
                  />
                  {couponApplied ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-[2px] text-[12px] font-semibold">Aplicado: {couponApplied}</span>
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                        onClick={()=> { setCouponApplied(null); show('Cupom removido'); }}
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
                      onClick={()=> {
                        const code = coupon.trim().toUpperCase();
                        if (!code) { show('Digite um cupom'); return; }
                        if (code === 'DESCONTO10') { setCouponApplied(code); show('Cupom aplicado: 10% OFF'); }
                        else { show('Cupom inválido'); }
                      }}
                      disabled={!coupon}
                    >
                      Aplicar
                    </button>
                  )}
                </div>
                <div className="mt-1 text-[12px] text-gray-600">Use o cupom DESCONTO10 para 10% OFF nos itens.</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
              <label className={`flex items-center justify-between rounded-md border p-2 cursor-pointer ${shipping==="retirada"?"border-[#ff5c00] bg-[#fff7f2]":"border-gray-300 bg-white"}`}>
                <span className="inline-flex items-center gap-2">
                  <img src="https://cdn-icons-png.flaticon.com/128/6503/6503227.png" alt="Retirar na banca" className="h-5 w-5 object-contain" loading="lazy" />
                  Retirar na banca
                </span>
                <input type="radio" name="ship" className="hidden" checked={shipping==="retirada"} onChange={()=>setShipping("retirada")} />
                <span className="text-gray-700 font-semibold">R$ 0,00</span>
              </label>
              {shipOpts.map((s) => (
                <label key={s.code} className={`flex items-center justify-between rounded-md border p-2 cursor-pointer ${shipping===s.code?"border-[#ff5c00] bg-[#fff7f2]":"border-gray-300 bg-white"}`} title={s.code === 'MOTOBOY' ? 'Entre em contato para consultar preço e prazo' : (s.days ? `Prazo estimado: ${s.days} dia(s) útil(eis)` : undefined)}>
                  <span className="inline-flex items-center gap-2">
                    {s.code === 'MOTOBOY' && (
                      <img src="https://cdn-icons-png.flaticon.com/128/5637/5637230.png" alt="Motoboy" className="h-5 w-5 object-contain" loading="lazy" />
                    )}
                    {s.code === 'SEDEX' && (
                      <img src="https://imagensempng.com.br/wp-content/uploads/2023/08/Logo-Sedex-Correios-Png-1024x1024.png" alt="Sedex" className="h-5 w-5 object-contain" loading="lazy" />
                    )}
                    {s.code === 'MOTOBOY' ? 'Motoboy Uber Eats' : `${s.code} ${s.days ? `(${s.days} dias)` : ''}`}
                    {s.code !== 'MOTOBOY' && (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-gray-400" fill="currentColor" aria-hidden>
                        <title>{s.days ? `Prazo estimado: ${s.days} dia(s) útil(eis)` : "Prazo estimado indisponível"}</title>
                        <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm0 15a1.25 1.25 0 111.25-1.25A1.25 1.25 0 0112 17zm1-4.5h-2V7h2z"/>
                      </svg>
                    )}
                  </span>
                  <input type="radio" name="ship" className="hidden" checked={shipping===s.code} onChange={()=>setShipping(s.code as any)} />
                  <span className="text-gray-700 font-semibold">
                    {s.code === 'MOTOBOY' ? 'A Consultar' : (freeShippingActive ? "Grátis" : `R$ ${s.price.toFixed(2)}`)}
                  </span>
                </label>
              ))}
            </div>
            {freeShippingActive && (
              <div className="mt-2 text-[12px] text-emerald-700">Frete grátis {shippingConfig.freeShippingEnabled ? "(oferta da banca)" : "(atingiu a meta)"}. {qualifiesByThreshold ? `Meta: R$ ${shippingConfig.freeShippingThreshold.toFixed(2)}` : null}</div>
            )}
          </div>
          )}

          <div>
            <h2 className="text-base font-semibold">Pagamento</h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <label className={`flex items-center gap-2 rounded-md border p-2 cursor-pointer ${payment==="pix"?"border-[#ff5c00] bg-[#fff7f2]":"border-gray-300 bg-white"}`}>
                <input type="radio" name="pay" className="hidden" checked={payment==="pix"} onChange={()=>setPayment("pix")} />
                <span className="inline-flex items-center gap-2">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo%E2%80%94pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.svg/2560px-Logo%E2%80%94pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.svg.png"
                    alt="Pix"
                    className="h-4 w-auto"
                    loading="lazy"
                  />
                  <span className="sr-only">Pix</span>
                </span>
              </label>
              <label className={`flex items-center gap-2 rounded-md border p-2 cursor-pointer ${payment==="cash"?"border-[#ff5c00] bg-[#fff7f2]":"border-gray-300 bg-white"}`}>
                <input type="radio" name="pay" className="hidden" checked={payment==="cash"} onChange={()=>setPayment("cash")} />
                <span className="inline-flex items-center gap-2">
                  <img src="https://cdn-icons-png.flaticon.com/128/7630/7630510.png" alt="Pagar na Retirada" className="h-4 w-4 object-contain" loading="lazy" />
                  Pagar na Retirada
                </span>
              </label>
            </div>
            {payment === 'cash' && (
              <div className="mt-3 max-w-xs">
                <label className="text-sm font-medium text-gray-700">Troco para</label>
                <input
                  className="input mt-1"
                  placeholder="R$ 0,00"
                  value={paymentChange}
                  onChange={(e)=> setPaymentChange(maskBRL(e.target.value))}
                  inputMode="numeric"
                />
              </div>
            )}
          </div>

          {/* Revisar pedido */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <h3 className="text-sm font-semibold">Revisar pedido</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
              <div className="text-gray-600">Nome</div>
              <div className="font-medium truncate">{name || "-"}</div>
              <div className="text-gray-600">E-mail</div>
              <div className="font-medium truncate">{email || "-"}</div>
              <div className="text-gray-600">Telefone</div>
              <div className="font-medium truncate">{phone || "-"}</div>
              <div className="text-gray-600">Endereço</div>
              <div className="font-medium break-words">
                {street ? street : "-"}{street && houseNumber ? ", " : ""}{houseNumber}
                {(street || houseNumber) && (neighborhood || city || uf) ? "; " : ""}
                {[neighborhood, city && `${city} - ${uf}`].filter(Boolean).join(", ")}
                {destCEP ? ` (CEP: ${destCEP})` : ""}
                {complement ? ` - Comp.: ${complement}` : ""}
              </div>
              <div className="text-gray-600">Frete</div>
              <div className="font-medium">
                {shipping === "retirada" ? "Retirar na banca" : 
                 shipping === "MOTOBOY" ? "Motoboy Uber Eats" : 
                 `${shipping}`} · {shipping === "MOTOBOY" ? "A Consultar" : 
                 (freeShippingActive ? "Grátis" : `R$ ${selectedCarrierPrice.toFixed(2)}`)}
              </div>
            </div>
            <div className="mt-2 text-[12px] text-gray-600">Confira seus dados antes de finalizar</div>
          </div>

          <div className="pt-2">
            {!isLogged && (
              <div className="mb-2 text-[12px] text-gray-700">
                Para finalizar, faça <Link href="/minha-conta" className="underline">login</Link> ou registre-se.
              </div>
            )}
            <Link href="/" className="inline-block rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-95">Continuar comprando</Link>
          </div>
        </form>

        {/* Resumo */}
        <aside className="rounded-2xl border border-gray-200 bg-white p-4 h-fit">
          <h2 className="text-base font-semibold">Resumo</h2>
          <div className="mt-3 space-y-3 divide-y divide-gray-100">
            {items.map((it) => (
              <div key={it.id} className="pt-3 first:pt-0 flex items-center gap-3">
                <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                  {it.image ? (
                    <Image src={it.image} alt={it.name} fill className="object-cover" />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium line-clamp-1">{it.name}</div>
                  <div className="text-[12px] text-gray-600">Qtd: {it.qty}</div>
                </div>
                <div className="text-sm font-semibold">R$ {((it.price ?? 0) * it.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Itens ({totalCount})</span>
              <span className="font-semibold">R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Desconto</span>
              <span className="font-semibold text-emerald-600">- R$ {discount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Frete</span>
              <span className="font-semibold">R$ {shippingCost.toFixed(2)}</span>
            </div>
            <div className="h-px bg-gray-200 my-1" />
            <div className="flex items-center justify-between text-base">
              <span className="font-semibold">Total</span>
              <span className="font-extrabold">R$ {total.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-4 space-y-2 hidden md:block">
            <Link href="/carrinho" className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-50 text-center">Editar carrinho</Link>
            <button form="checkout-form" type="submit" disabled={submitting} className="block w-full rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60 text-center">{submitting ? "Enviando..." : "Finalizar pedido"}</button>
          </div>
        </aside>
      </div>

      {/* Barra fixa inferior (mobile e tablets) */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] p-3">
        <div className="container-max">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm min-w-0">
              <div className="text-gray-600 leading-tight">Itens ({totalCount})</div>
              <div className="font-extrabold">Total: R$ {total.toFixed(2)}</div>
              {street && (
                <div className="mt-0.5 text-[11px] text-gray-600 truncate max-w-[55vw]">
                  Entrega: {street}{houseNumber ? `, ${houseNumber}` : ''}{(city || uf) ? ` · ${city || ''}${city && uf ? ' - ' : ''}${uf || ''}` : ''}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link href="/carrinho" className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50">Editar carrinho</Link>
              <button form="checkout-form" type="submit" disabled={submitting} className="rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60">
                {submitting ? "Enviando..." : "Finalizar pedido"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

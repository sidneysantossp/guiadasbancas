"use client";

import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/CartContext";
import DepartmentsMegaMenu from "@/components/DepartmentsMegaMenu";
import LocationModal from "@/components/LocationModal";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import AutoGeolocation from "@/components/AutoGeolocation";
import { loadStoredLocation, UserLocation } from "@/lib/location";
import { Hedvig_Letters_Serif } from "next/font/google";
import { shippingConfig } from "@/components/shippingConfig";
import FreeShippingProgress from "@/components/FreeShippingProgress";
import { useEffect as useEffectBranding, useState as useStateBranding } from "react";
import { useAuth } from "@/lib/auth/AuthContext";

const hedvig = Hedvig_Letters_Serif({ subsets: ["latin"] });

// Componente para links de Jornaleiro/Admin
function JornaleiroAdminLinks({ onClose }: { onClose: () => void }) {
  const { profile, loading } = useAuth();
  const router = useRouter();

  // Se ainda está carregando, não mostra nada
  if (loading) return null;
  
  // Se não tem perfil ou é cliente, não mostra nada
  if (!profile || profile.role === 'cliente') return null;

  return (
    <>
      <div className="h-px bg-gray-100 my-1" />
      {profile.role === 'jornaleiro' && (
        <button 
          className="w-full text-left px-3 py-2 text-[#ff5c00] hover:bg-orange-50 font-medium" 
          onClick={() => { 
            router.push('/jornaleiro/dashboard'); 
            onClose(); 
          }}
        >
          📊 Painel do Jornaleiro
        </button>
      )}
      {profile.role === 'admin' && (
        <button 
          className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 font-medium" 
          onClick={() => { 
            router.push('/admin/dashboard'); 
            onClose(); 
          }}
        >
          ⚙️ Painel Admin
        </button>
      )}
    </>
  );
}

interface Category {
  slug: string;
  name: string;
  image?: string;
  color?: string;
  icon?: string;
}

const categories: Category[] = [
  { slug: "gibis", name: "Gibis", color: "#ff5c00", icon: "📚" },
  { slug: "revistas", name: "Revistas", color: "#0066cc", icon: "📖" },
  { slug: "jornais", name: "Jornais", color: "#333333", icon: "📰" },
  { slug: "livros", name: "Livros", color: "#8b5a2b", icon: "📗" },
];

function MiniCartDropdown({ onClose }: { onClose: () => void }) {
  const { items, totalCount, addToCart, removeFromCart } = useCart();
  const recent = useMemo(() => items.slice(-3).reverse(), [items]);
  const subtotal = useMemo(() => items.reduce((s, it) => s + (it.price ?? 0) * it.qty, 0), [items]);
  const qualifiesByThreshold = subtotal >= shippingConfig.freeShippingThreshold;
  const freeShippingActive = shippingConfig.freeShippingEnabled || qualifiesByThreshold;
  return (
    <div className="absolute right-0 z-40 mt-2 w-80 rounded-2xl border border-gray-200 bg-white shadow-xl">
      <div className="p-3">
        <div className="text-sm font-semibold">Seu carrinho</div>
      </div>
      <div className="divide-y divide-gray-100">
        {recent.length === 0 ? (
          <div className="p-3 text-sm text-gray-600">Seu carrinho está vazio.</div>
        ) : (
          recent.map((it) => (
            <div key={it.id} className="p-3 flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                {it.image ? (
                  <Image src={it.image} alt={it.name} fill className="object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium line-clamp-1">{it.name}</div>
                <div className="mt-1 inline-flex items-center rounded-md border border-gray-300 overflow-hidden">
                  <button className="px-2 py-1 text-xs" onClick={() => addToCart({ id: it.id, name: it.name, price: it.price, image: it.image }, -1)}>-</button>
                  <span className="px-2 py-1 text-xs font-semibold">{it.qty}</span>
                  <button className="px-2 py-1 text-xs" onClick={() => addToCart({ id: it.id, name: it.name, price: it.price, image: it.image }, 1)}>+</button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[13px] font-semibold">R$ {(((it.price ?? 0) * it.qty).toFixed(2))}</div>
                <button aria-label="Remover" className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50" onClick={() => removeFromCart(it.id)}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M6 7h12v2H6V7zm2 3h8l-1 9H9L8 10zm3-7h2l1 2h5v2H5V5h5l1-2z"/></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 space-y-2">
        {/* Barra de progresso frete grátis */}
        <FreeShippingProgress subtotal={subtotal} size="sm" showHeader={false} />
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Itens ({totalCount})</span>
          <span className="font-semibold">R$ {subtotal.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link href={("/carrinho" as Route)} onClick={onClose} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-gray-50 text-center">Ver carrinho</Link>
          <Link href={("/checkout" as Route)} onClick={onClose} className="rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-95 text-center">Checkout</Link>
        </div>
      </div>
    </div>
  );
}

function MiniCartSheet({ onClose }: { onClose: () => void }) {
  const { items, totalCount, addToCart, removeFromCart } = useCart();
  const subtotal = useMemo(() => items.reduce((s, it) => s + (it.price ?? 0) * it.qty, 0), [items]);
  const qualifiesByThreshold = subtotal >= shippingConfig.freeShippingThreshold;
  const freeShippingActive = shippingConfig.freeShippingEnabled || qualifiesByThreshold;
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="text-base font-semibold">Seu carrinho</div>
          <button aria-label="Fechar" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6"/></svg>
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {items.length === 0 ? (
            <div className="p-4 text-sm text-gray-600">Seu carrinho está vazio.</div>
          ) : (
            items.map((it) => (
              <div key={it.id} className="p-4 flex items-center gap-3">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  {it.image ? <Image src={it.image} alt={it.name} fill className="object-cover" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold line-clamp-1">{it.name}</div>
                  <div className="mt-1 inline-flex items-center rounded-md border border-gray-300 overflow-hidden">
                    <button className="px-2 py-1 text-sm" onClick={() => addToCart({ id: it.id, name: it.name, price: it.price, image: it.image }, -1)}>-</button>
                    <span className="px-3 py-1 text-sm font-semibold">{it.qty}</span>
                    <button className="px-2 py-1 text-sm" onClick={() => addToCart({ id: it.id, name: it.name, price: it.price, image: it.image }, 1)}>+</button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold">R$ {(((it.price ?? 0) * it.qty).toFixed(2))}</div>
                  <button aria-label="Remover" className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50" onClick={() => removeFromCart(it.id)}>
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M6 7h12v2H6V7zm2 3h8l-1 9H9L8 10zm3-7h2l1 2h5v2H5V5h5l1-2z"/></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 space-y-3 border-t border-gray-100">
          {/* Barra de progresso frete grátis */}
          <FreeShippingProgress subtotal={subtotal} size="sm" showHeader={false} />
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Itens ({totalCount})</span>
            <span className="font-semibold">R$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link href={("/carrinho" as Route)} onClick={onClose} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-gray-50 text-center">Ver carrinho</Link>
            <Link href={("/checkout" as Route)} onClick={onClose} className="rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-95 text-center">Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState<UserLocation | null>(null);
  const [locOpen, setLocOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement | null>(null);
  const isHome = pathname === "/";
  const [searchExpanded, setSearchExpanded] = useState<boolean>(isHome);
  const { totalCount: cartCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartSheetOpen, setCartSheetOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [profileAvatar, setProfileAvatar] = useState<string>("");
  const [profilePhone, setProfilePhone] = useState<string>("");
  const hoverCloseTimer = useRef<number | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const inDashboard = pathname.startsWith("/minha-conta");
  const [catsOpen, setCatsOpen] = useState<boolean>(false);
  const { show } = useToast();
  const [notifEnabled, setNotifEnabled] = useState<boolean>(false);
  const [notifCount, setNotifCount] = useState<number>(0);
  const [notifPulse, setNotifPulse] = useState<boolean>(false);
  const [branding, setBranding] = useState<{logoUrl: string; logoAlt: string; siteName: string} | null>(null);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(q.trim())}`);
    }
  };

  const handleSearchSelect = (result: any) => {
    setQ(result.name);
  };

  const handleSearchSubmit = () => {
    if (q.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(q.trim())}`);
    }
  };

  useEffect(() => {
    const stored = loadStoredLocation();
    if (stored) setLoc(stored);
    // Live update when any part of the app saves a new location
    const onLoc = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as UserLocation;
        if (detail) setLoc(detail);
      } catch {}
    };
    const onLocationUpdate = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as UserLocation;
        if (detail) setLoc(detail);
      } catch {}
    };
    window.addEventListener('gdb:location-updated', onLoc as EventListener);
    window.addEventListener('locationUpdate', onLocationUpdate as EventListener);
    return () => {
      window.removeEventListener('gdb:location-updated', onLoc as EventListener);
      window.removeEventListener('locationUpdate', onLocationUpdate as EventListener);
    };
  }, []);
  
  const handleLocationUpdate = (location: UserLocation | null) => {
    setLoc(location);
  };

  // Fecha o submenu de conta ao clicar fora
  useEffect(() => {
    function onDocDown(e: MouseEvent | TouchEvent) {
      const el = document.getElementById('account-menu');
      if (!el) return;
      if (!el.contains(e.target as Node)) setAccountOpen(false);
    }
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('touchstart', onDocDown);
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('touchstart', onDocDown);
    };
  }, []);

  // Carrega usuário mock do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("gb:user");
      setUser(raw ? JSON.parse(raw) : null);
    } catch {}
    try {
      const pr = localStorage.getItem('gb:userProfile');
      if (pr) {
        const p = JSON.parse(pr);
        if (p?.avatar) setProfileAvatar(String(p.avatar));
        if (p?.phone) setProfilePhone(String(p.phone));
      }
    } catch {}
    const onStorage = (e: StorageEvent) => {
      if (e.key === "gb:user") {
        try { setUser(e.newValue ? JSON.parse(e.newValue) : null); } catch { setUser(null); }
      }
      if (e.key === 'gb:userProfile') {
        try { const p = e.newValue ? JSON.parse(e.newValue) : null; setProfileAvatar(p?.avatar || ""); setProfilePhone(p?.phone || ""); } catch { setProfileAvatar(""); setProfilePhone(""); }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const logout = () => {
    try { localStorage.removeItem("gb:user"); } catch {}
    setUser(null);
    if (pathname.startsWith("/minha-conta")) router.push("/");
  };

  // Fecha dropdown do carrinho ao clicar/tocar fora
  useEffect(() => {
    function onDocDown(e: MouseEvent | TouchEvent) {
      if (!cartRef.current) return;
      if (!cartRef.current.contains(e.target as Node)) setCartOpen(false);
    }
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("touchstart", onDocDown);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("touchstart", onDocDown);
    };
  }, []);

  // Cleanup do timer de hover ao desmontar
  useEffect(() => {
    return () => {
      if (hoverCloseTimer.current) {
        clearTimeout(hoverCloseTimer.current as any);
        hoverCloseTimer.current = null;
      }
    };
  }, []);

  // Ajusta o estado ao trocar de rota (Home = expandido, demais = encolhido)
  useEffect(() => {
    setSearchExpanded(pathname === "/");
  }, [pathname]);

  // Notifications: sync permission and SW messages
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setNotifEnabled(typeof Notification !== 'undefined' && Notification?.permission === 'granted');
    if ('serviceWorker' in navigator) {
      const onMsg = (e: MessageEvent) => {
        if (e?.data?.type === 'PUSH_RECEIVED') {
          setNotifCount((c) => c + 1);
          // Visual pulse on bell
          setNotifPulse(true);
          window.setTimeout(() => setNotifPulse(false), 1200);
          // Haptic vibration on supported devices
          try { (navigator as any).vibrate?.(100); } catch {}
        }
      };
      navigator.serviceWorker.addEventListener('message', onMsg);
      return () => navigator.serviceWorker.removeEventListener('message', onMsg);
    }
  }, []);

  const enableNotifications = async () => {
    try {
      if (typeof window === 'undefined') return;
      if (!('Notification' in window)) {
        show('Notificações não suportadas neste navegador.');
        return;
      }
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        show('Permissão de notificações negada. Você pode ativar nas configurações do navegador.');
        return;
      }
      if (!('serviceWorker' in navigator)) {
        show('Service Worker indisponível.');
        return;
      }
      const reg = await navigator.serviceWorker.register('/sw.js');
      setNotifEnabled(true);
      setNotifCount(0);

      if (!('pushManager' in reg)) {
        show('Push Manager indisponível.');
        return;
      }

      let vapidPublicKey = (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string) || '';
      if (!vapidPublicKey) {
        try {
          const cfgRes = await fetch('/api/push/config');
          const cfg = await cfgRes.json().catch(()=>({}));
          if (cfg?.ok && cfg?.publicKey) {
            vapidPublicKey = cfg.publicKey as string;
          }
        } catch {}
      }
      if (!vapidPublicKey) {
        show('Chave VAPID pública ausente. Defina NEXT_PUBLIC_VAPID_PUBLIC_KEY ou VAPID_PUBLIC_KEY.');
        return;
      }
      const base64ToUint8Array = (base64: string) => {
        const padding = '='.repeat((4 - (base64.length % 4)) % 4);
        const base64Safe = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = atob(base64Safe);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
        return outputArray;
      };
      const applicationServerKey = base64ToUint8Array(vapidPublicKey);

      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey });
      }
      const res = await fetch('/api/push/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subscription: sub })
      });
      if (!res.ok) {
        const j = await res.json().catch(()=>({}));
        show(`Falha ao salvar inscrição: ${j?.error || res.statusText}`);
        return;
      }
      const j = await res.json().catch(()=>({ ok: true }));
      show(j?.ok ? 'Notificações ativadas!' : 'Inscrição concluída (verifique o servidor).');
    } catch (e) {
      show('Não foi possível ativar as notificações. Veja o console para detalhes.');
      console.error('[push] enableNotifications error', e);
    }
  };

// Autofocus na busca ao entrar na Home no mobile e sincronizar título por rota
useEffect(() => {
  // Autofocus somente em mobile e na Home
  if (typeof window !== 'undefined' && window.innerWidth < 768 && pathname === '/') {
    setTimeout(() => inputRef.current?.focus(), 0);
  }
  // Atualiza título para rotas principais (evita dashboard)
  if (!inDashboard) {
    const map: Record<string, string> = {
      '/': 'Início | Guia das Bancas',
      '/bancas-perto-de-mim': 'Bancas perto de mim | Guia das Bancas',
      '/promocoes': 'Promoções | Guia das Bancas',
      '/pre-venda': 'Pré-venda | Guia das Bancas',
      '/minha-conta': 'Minha Conta | Guia das Bancas',
    };
    const key = Object.keys(map).find(k => pathname === k);
    if (key) {
      try { document.title = map[key]; } catch {}
    }
  }
}, [pathname, inDashboard]);

  // Carregar configurações de branding
  useEffect(() => {
    const loadBranding = async () => {
      try {
        const response = await fetch('/api/admin/branding');
        const result = await response.json();
        if (result.success) {
          setBranding(result.data);
        }
      } catch (error) {
        console.error('Erro ao carregar branding:', error);
      }
    };
    loadBranding();
  }, []);

  // UF atual baseada na localização armazenada
  const ufQuery = (loc?.state || 'sp').toLowerCase();

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-white md:border-b md:border-gray-200 md:shadow-sm">
      {/* Top bar: Logo + Localização */}
      <div className="container-max py-2 flex items-center justify-between">
        {/* Logo (hidden no mobile) */}
        <Link href="/" className="hidden md:flex items-center gap-2">
          {branding?.logoUrl ? (
            <Image
              src={branding.logoUrl}
              alt={branding.logoAlt || "Logo"}
              width={isHome ? 180 : 120}
              height={isHome ? 60 : 40}
              className={`${isHome ? 'h-12 max-w-[180px]' : 'h-8 max-w-[120px]'} w-auto object-contain`}
            />
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={`${isHome ? 'h-10 w-10' : 'h-8 w-8'} text-[var(--color-primary)]`}
                aria-hidden
                fill="currentColor"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" ry="2" opacity="0.15" />
                <rect x="6" y="7" width="12" height="2" rx="1" />
                <rect x="6" y="11" width="9" height="2" rx="1" />
                <rect x="6" y="15" width="6" height="2" rx="1" />
              </svg>
              <span className={`${isHome ? 'text-xl' : 'text-lg'} tracking-wide lowercase ${hedvig.className} text-black`}>
                <span className="font-bold text-[#ff5c00]">g</span>uia das bancas
              </span>
            </>
          )}
        </Link>

        {/* Notificações e Localização (direita) */}
        {!inDashboard && (
          <div className="flex items-center gap-3">
            {/* Sino de notificações */}
            <button
              type="button"
              aria-label="Notificações"
              title="Ativar notificações"
              onClick={enableNotifications}
              className="relative inline-flex items-center justify-center h-8 w-8 rounded-full text-[#ff5c00] hover:text-[#ff7a33] focus:outline-none focus:ring-2 focus:ring-[#ff7a33]/30"
            >
              {notifPulse && (
                <span className="absolute inset-0 rounded-full bg-[#ff7a33]/30 animate-ping"></span>
              )}
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a3.001 3.001 0 01-5.714 0M18 8a6 6 0 10-12 0c0 3.866-1.343 5.818-2.016 6.77a1 1 0 00.82 1.73h14.392a1 1 0 00.82-1.73C19.343 13.818 18 11.866 18 8z" />
              </svg>
              {(notifEnabled && notifCount > 0) && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-full bg-rose-600 text-white text-[10px] leading-[16px] text-center px-[3px]">{notifCount}</span>
              )}
            </button>
            
            {/* Badge de geolocalização */}
            <button
              onClick={() => setLocOpen(true)}
              className="flex items-center gap-2 text-sm leading-none hover:text-[var(--color-primary)] rounded-full px-3 py-[2px] max-w-full border border-gray-300 hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-4 w-4 text-[#ff5c00]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 21s-6-4.35-6-9a6 6 0 1 1 12 0c0 4.65-6 9-6 9z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
              <span
                className="font-medium text-[12px] sm:text-[11px] truncate max-w:[55vw] sm:max-w-xs"
                title={
                  loc ? `${loc.neighborhood || loc.street || ''}, ${loc.city || ''}` : undefined
                }
              >
                {loc ? (
                  `${loc.neighborhood || loc.street || loc.city || 'Localização'}, ${loc.city || ''}`
                ) : (
                  "Encontrar uma Banca próximo de mim"
                )}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Busca mobile fixa no topo (aberta e largura total) */}
      {!inDashboard && (
        <div className="md:hidden border-t border-gray-100">
          <div className="container-max py-2">
            <form onSubmit={onSearch}>
              <div className="relative">
                <input
                  ref={inputRef}
                  className="input w-full pr-10"
                  placeholder="Buscar produtos, categorias..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  aria-label="Buscar"
                />
                <button
                  type="submit"
                  aria-label="Buscar"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#ff5c00] hover:opacity-90"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" /></svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main bar: Menu + Search + Actions */}
      <div className="container-max py-3 flex items-center gap-4">
        {/* Menu desktop */}
        <nav className="hidden md:flex items-center gap-4 text-sm">
          <div className="py-2">
            <DepartmentsMegaMenu />
          </div>
          <Link href={{ pathname: "/bancas-perto-de-mim", query: { uf: ufQuery } }} className="hover:text-[var(--color-primary)] py-2">Bancas</Link>
          <Link href={"/promocoes" as any} className="hover:text-[var(--color-primary)] py-2">Promoções</Link>
          <Link href={"/pre-venda" as any} className="hover:text-[var(--color-primary)] py-2">Pré Venda</Link>
        </nav>

        {/* Toggle mobile (esquerda do input) — oculto no mobile, usamos o Bottom Nav */}
        {!inDashboard && (
        <span className="hidden" />
        )}

        {/* Search (desktop). Mobile usa dropdown abaixo do header */}
        {!inDashboard && (
        <div className="hidden md:flex flex-1 justify-end">
          <div className={`relative ml-auto transition-all duration-300 ease-in-out ${searchExpanded ? "w-full max-w-xl" : "w-10"}`}>
            {searchExpanded ? (
              <div className="relative">
                <SearchAutocomplete
                  query={q}
                  onQueryChange={setQ}
                  onSelect={handleSearchSelect}
                  onSubmit={handleSearchSubmit}
                  placeholder="Buscar produtos, categorias..."
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  aria-label="Buscar"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#ff5c00] hover:opacity-90"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" /></svg>
                </button>
              </div>
            ) : (
              <button
                type="button"
                aria-label="Expandir busca"
                onClick={() => {
                  setSearchExpanded(true);
                  requestAnimationFrame(() => inputRef.current?.focus());
                }}
                className="h-10 w-10 rounded-full border border-[#ffd7bd] bg-[#fff7f1] grid place-items-center text-[#ff5c00] hover:bg-[#ffece0]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" /></svg>
              </button>
            )}
          </div>
        </div>
        )}

        {/* Actions */}
        <div className={`flex items-center gap-3 ${inDashboard ? 'ml-auto' : ''}`}>
          {/* Botão de busca (apenas mobile, fora do dashboard) */}
          {!inDashboard && (
            <span className="hidden" />
          )}
          {inDashboard && user ? (
            <div className="hidden md:block relative" id="account-menu" onMouseEnter={()=>setAccountOpen(true)} onMouseLeave={()=>setAccountOpen(false)}>
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-gray-50"
              >
                <span className="relative inline-block h-6 w-6 rounded-full overflow-hidden bg-orange-100 ring-1 ring-black/5">
                  {profileAvatar ? (
                    <img src={profileAvatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-full w-full text-[#ff7a33]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z"/></svg>
                  )}
                </span>
                Olá, <span className="font-semibold truncate max-w-[120px]">{user.name}</span>
              </button>
              {accountOpen && (
                <div className="absolute right-0 z-40 mt-2 w-56 rounded-2xl border border-gray-200 bg-white shadow-xl">
                  <div className="py-1 text-sm">
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={()=>{ try { localStorage.setItem('gb:dashboardActiveMenu','perfil'); } catch {}; router.push('/minha-conta'); setAccountOpen(false); }}>Meu Perfil</button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={()=>{ try { localStorage.setItem('gb:dashboardActiveMenu','favoritos'); } catch {}; router.push('/minha-conta'); setAccountOpen(false); }}>Meus Favoritos</button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={()=>{ try { localStorage.setItem('gb:dashboardActiveMenu','pedidos'); } catch {}; router.push('/minha-conta'); setAccountOpen(false); }}>Minhas compras</button>
                    <div className="h-px bg-gray-100 my-1" />
                    <button className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50" onClick={()=>{ setAccountOpen(false); logout(); }}>Sair</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Carrinho com dropdown (antes do Entrar) */}
              <div
                ref={cartRef}
                className="hidden md:block relative"
                onMouseEnter={() => {
                  if (hoverCloseTimer.current) { clearTimeout(hoverCloseTimer.current as any); hoverCloseTimer.current = null; }
                  setCartOpen(true);
                }}
                onMouseLeave={() => {
                  if (hoverCloseTimer.current) { clearTimeout(hoverCloseTimer.current as any); }
                  hoverCloseTimer.current = window.setTimeout(() => { setCartOpen(false); }, 280);
                }}
              >
                <button type="button" aria-label="Abrir carrinho" onClick={() => { if (typeof window !== "undefined" && window.innerWidth < 768) { setCartSheetOpen(true); } else { setCartOpen((v) => !v); } }} className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-black hover:bg-gray-50">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                    <path d="M7 4h-2l-1 2h2l3.6 7.6-1.35 2.45A1 1 0 0010.1 18h8.4v-2h-7.3l.9-1.6h5.8a1 1 0 00.9-.6L22 7H6.2zM7 20a2 2 0 102-2 2 2 0 00-2 2zm8 0a2 2 0 102-2 2 2 0 00-2 2z"/>
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[#ff5c00] text-white text-[11px] leading-[18px] text-center px-[3px]">{cartCount}</span>
                  )}
                </button>
                {cartOpen && (<MiniCartDropdown onClose={() => setCartOpen(false)} />)}
              </div>

              {/* Sou Jornaleiro (oculto no mobile) */}
              <Link href="/jornaleiro" className="hidden md:inline-flex items-center rounded-lg bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95">Sou Jornaleiro</Link>

              {/* Conta / Entrar */}
              {!user ? (
                <Link
                  href="/minha-conta"
                  className="hidden md:inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z" /></svg>
                  Minha Conta
                </Link>
              ) : (
                <div className="hidden md:inline-flex items-center gap-2 relative" id="account-menu">
                  <button onClick={()=>setAccountOpen(v=>!v)} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-black shadow-sm hover:bg-gray-50">
                    <span className="relative inline-block h-5 w-5 rounded-full overflow-hidden bg-orange-100 ring-1 ring-black/5">
                      {profileAvatar ? (
                        <img src={profileAvatar} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-full w-full text-[#ff7a33]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z"/></svg>
                      )}
                    </span>
                    Olá, <span className="font-semibold truncate max-w-[120px]">{user.name}</span>
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-gray-200 bg-white shadow-xl z-40">
                      <div className="py-1 text-sm">
                        <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={()=>{ try { localStorage.setItem('gb:dashboardActiveMenu','perfil'); } catch {}; router.push('/minha-conta'); setAccountOpen(false); }}>Meu Perfil</button>
                        <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={()=>{ try { localStorage.setItem('gb:dashboardActiveMenu','favoritos'); } catch {}; router.push('/minha-conta'); setAccountOpen(false); }}>Meus Favoritos</button>
                        <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={()=>{ try { localStorage.setItem('gb:dashboardActiveMenu','pedidos'); } catch {}; router.push('/minha-conta'); setAccountOpen(false); }}>Minhas compras</button>
                        {/* Verificar se é jornaleiro ou admin */}
                        <JornaleiroAdminLinks onClose={() => setAccountOpen(false)} />
                        <div className="h-px bg-gray-100 my-1" />
                        <button className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50" onClick={()=>{ setAccountOpen(false); logout(); }}>Sair</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Componente de geolocalização automática */}
      <AutoGeolocation onLocationUpdate={handleLocationUpdate} />
    </header>
    {/* Mobile Search Bar (full width abaixo da navbar) */}
    {!inDashboard && mobileSearchOpen && (
      <div className="md:hidden border-t border-gray-200 bg-white shadow-sm">
        <div className="container-max px-4 py-3">
          <div className="relative">
            <SearchAutocomplete
              query={q}
              onQueryChange={setQ}
              onSelect={(result) => {
                handleSearchSelect(result);
                setMobileSearchOpen(false);
              }}
              onSubmit={() => {
                handleSearchSubmit();
                setMobileSearchOpen(false);
              }}
              placeholder="Buscar produtos, categorias..."
              className="input w-full pr-24"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button type="button" onClick={()=>{ setMobileSearchOpen(false); }} className="text-sm text-gray-600 hover:text-black">Cancelar</button>
              <button type="button" onClick={() => { handleSearchSubmit(); setMobileSearchOpen(false); }} aria-label="Buscar" className="text-[#ff5c00] hover:opacity-90">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Location Modal */}
    <LocationModal
      open={locOpen}
      onClose={() => setLocOpen(false)}
      onSaved={(l) => setLoc(l)}
    />
    {/* Offcanvas Mobile */}
    {mobileOpen && (
      <div className="fixed inset-0 z-50 md:hidden">
        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
        <aside className="absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <span className="text-base font-semibold">Menu</span>
            <button
              aria-label="Fechar menu"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6"/></svg>
            </button>
          </div>
          {/* Bloco do usuário logado (topo do menu) */}
          {user && (
            <div className="px-4 py-3 border-b border-gray-200">
              <button
                className="w-full flex items-center gap-3 text-left"
                onClick={() => { try { localStorage.setItem('gb:dashboardActiveMenu','perfil'); } catch {}; router.push('/minha-conta'); setMobileOpen(false); }}
              >
                <span className="relative inline-block h-10 w-10 rounded-full overflow-hidden bg-orange-100 ring-1 ring-black/5">
                  {profileAvatar ? (
                    <img src={profileAvatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-full w-full text-[#ff7a33]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z"/></svg>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold truncate">{user.name}</div>
                  <div className="mt-0.5 text-[12px] text-[#ff5c00] inline-flex items-center gap-1">
                    Meu Perfil
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden><path d="M9 6l6 6-6 6"/></svg>
                  </div>
                </div>
              </button>
            </div>
          )}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            
            {/* Bancas */}
            <Link href="/bancas-perto-de-mim" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-6-4.35-6-9a6 6 0 1 1 12 0c0 4.65-6 9-6 9z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="2.5"/></svg>
              <span>Bancas</span>
            </Link>
            {/* Promoções */}
            <Link href={"/promocoes" as any} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3 6 6 .9-4.5 4.3 1 6.3-5.5-3-5.5 3 1-6.3L3 8.9 9 8z"/></svg>
              <span>Promoções</span>
            </Link>
            {/* Pré Venda */}
            <Link href={"/pre-venda" as any} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h10M4 17h14"/></svg>
              <span>Pré Venda</span>
            </Link>
            {/* Categorias (colapsável) */}
            <button type="button" onClick={() => setCatsOpen(v=>!v)} className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
              <span className="inline-flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg>
                Categorias
              </span>
              <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform ${catsOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6"/></svg>
            </button>
            {catsOpen && (
              <div className="pt-2">
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((c: Category) => (
                    <Link
                      key={c.slug}
                      href={`/categorias?cat=${c.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2.5 hover:bg-gray-50 shadow-sm"
                    >
                      <div className="h-8 w-8 rounded-xl overflow-hidden bg-gray-100 ring-1 ring-black/5">
                        {c.image ? (
                          <Image src={c.image} alt={c.name} width={32} height={32} className="h-8 w-8 object-cover" />
                        ) : (
                          <div className={`h-8 w-8 ${c.color} rounded-xl grid place-items-center`}>{c.icon}</div>
                        )}
                      </div>
                      <span className="text-sm font-medium">{c.name}</span>
                    </Link>
                  ))}
                </div>
                <Link href="/categorias" onClick={() => setMobileOpen(false)} className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-white hover:opacity-95">Ver todos</Link>
              </div>
            )}
            <div className="h-px bg-gray-200 my-2" />
            {!user && (
              <Link href="/minha-conta" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z" /></svg>
                <span>Minha Conta</span>
              </Link>
            )}
            <Link href="/jornaleiro" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16v4H4zM6 11v7a1 1 0 001 1h10a1 1 0 001-1v-7"/></svg>
              <span>Sou Jornaleiro</span>
            </Link>
          </nav>
        </aside>
      </div>
    )}

    {/* Mini Cart Mobile Sheet */}
    {cartSheetOpen && (
      <MiniCartSheet onClose={() => setCartSheetOpen(false)} />
    )}
    
    {/* Bottom Nav - Mobile only */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-max">
        <div className="grid grid-cols-5">
          {/* Home */}
          <Link href="/" className={`py-2 flex flex-col items-center justify-center text-[11px] ${pathname === '/' ? 'text-[#ff5c00] font-semibold' : 'text-gray-700 hover:text-black'}`}>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M3 10.5L12 4l9 6.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 12v8h5v-5h4v5h5v-8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Home</span>
          </Link>
          {/* Favoritos */}
          <Link href={("/minha-conta" as any)} className={`py-2 flex flex-col items-center justify-center text-[11px] ${(pathname?.startsWith('/minha-conta') || pathname?.startsWith('/favoritos')) ? 'text-[#ff5c00] font-semibold' : 'text-gray-700 hover:text-black'}`}>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M12 21s-6.7-4.4-9.2-7.7A5.6 5.6 0 0112 6.3a5.6 5.6 0 019.2 7C18.7 16.6 12 21 12 21z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Favoritos</span>
          </Link>
          {/* Carrinho (destaque) */}
          <button
            type="button"
            onClick={() => setCartSheetOpen(true)}
            className="py-1 -mt-4 flex flex-col items-center justify-center text-[11px] text-white"
          >
            <span className="relative inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#ff5c00] shadow-md">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
                <path d="M7 4h-2l-1 2h2l3.6 7.6-1.35 2.45A1 1 0 0010.1 18h8.4v-2h-7.3l.9-1.6h5.8a1 1 0 00.9-.6L22 7H6.2zM7 20a2 2 0 102-2 2 2 0 00-2 2zm8 0a2 2 0 102-2 2 2 0 00-2 2z"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-white text-[#ff5c00] text-[11px] leading-[18px] text-center px-[3px] font-semibold">{cartCount}</span>
              )}
            </span>
            <span className="mt-1 mb-1 text-[#ff5c00] font-semibold">Carrinho</span>
          </button>
          {/* Bancas */}
          <Link href={{ pathname: "/bancas-perto-de-mim", query: { uf: ufQuery } }} className={`py-2 flex flex-col items-center justify-center text-[11px] ${(pathname?.startsWith('/banca') || pathname?.startsWith('/bancas')) ? 'text-[#ff5c00] font-semibold' : 'text-gray-700 hover:text-black'}`}>
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M12 21s-6-4.35-6-9a6 6 0 1 1 12 0c0 4.65-6 9-6 9z" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="2.5" />
            </svg>
            <span>Bancas</span>
          </Link>
          {/* Menu */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className={`py-2 flex flex-col items-center justify-center text-[11px] ${mobileOpen ? 'text-[#ff5c00] font-semibold' : 'text-gray-700 hover:text-black'}`}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M3 6h18M3 12h18M3 18h18"/>
            </svg>
            <span>Menu</span>
          </button>
        </div>
        {/* padding de área segura em iOS */}
        <div className="h-[env(safe-area-inset-bottom,0px)]" />
      </div>
    </nav>
    </>
  );
}

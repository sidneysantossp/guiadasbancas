"use client";

import Image from "next/image";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import DepartmentsMegaMenu from "./DepartmentsMegaMenu";
import LocationModal from "./LocationModal";
import SearchAutocomplete from "./SearchAutocomplete";
import AutoGeolocation from "./AutoGeolocation";
import { loadStoredLocation, UserLocation } from "@/lib/location";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { Hedvig_Letters_Serif } from "next/font/google";
import { shippingConfig } from "@/components/shippingConfig";
import FreeShippingProgress from "@/components/FreeShippingProgress";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCategories } from "@/lib/useCategories";
import {
  IconBell,
  IconChevronDown,
  IconMapPin,
  IconBuildingStore,
  IconSearch,
  IconShoppingBag,
  IconUserCircle,
  IconUser,
} from "@tabler/icons-react";

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


function MiniCartDropdown({ onClose }: { onClose: () => void }) {
  const { items, totalCount, addToCart, removeFromCart } = useCart();
  const recent = useMemo(() => items.slice(-3).reverse(), [items]);
  const subtotal = useMemo(() => items.reduce((s, it) => s + (it.price ?? 0) * it.qty, 0), [items]);
  const qualifiesByThreshold = subtotal >= shippingConfig.freeShippingThreshold;
  const freeShippingActive = shippingConfig.freeShippingEnabled || qualifiesByThreshold;
  return (
    <div className="absolute right-0 top-full z-40 w-80 translate-y-6 rounded-2xl border border-gray-200 bg-white shadow-xl">
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
                  <Image src={it.image} alt={it.name} fill sizes="48px" className="object-cover" />
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
                  {it.image ? <Image src={it.image} alt={it.name} fill sizes="64px" className="object-cover" /> : null}
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
  
  // Detectar se estamos na página de uma banca (para ocultar busca global)
  const isOnBancaPage = useMemo(() => {
    return pathname?.startsWith('/banca/');
  }, [pathname]);
  const [locOpen, setLocOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement | null>(null);
  const isHome = pathname === "/";
  const [searchExpanded, setSearchExpanded] = useState<boolean>(false);
  const { totalCount: cartCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartSheetOpen, setCartSheetOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [profileAvatar, setProfileAvatar] = useState<string>("");
  const [profilePhone, setProfilePhone] = useState<string>("");
  const hoverCloseTimer = useRef<number | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const inDashboard = pathname.startsWith("/minha-conta") && user !== null;
  const [catsOpen, setCatsOpen] = useState<boolean>(true);
  const { show } = useToast();
  const [notifEnabled, setNotifEnabled] = useState<boolean>(false);
  const [notifCount, setNotifCount] = useState<number>(0);
  const [notifPulse, setNotifPulse] = useState<boolean>(false);
  const [branding, setBranding] = useState<{logoUrl: string; logoAlt: string; siteName: string; socialInstagram?: string; socialFacebook?: string; socialYoutube?: string; socialLinkedin?: string} | null>(null);
  const { items: categoryItems } = useCategories(); // Pré-carrega categorias na inicialização
  const [activeMegaMenu, setActiveMegaMenu] = useState<'categories' | null>(null);

  const socialLinks = useMemo(() => {
    if (!branding) return [] as { key: string; href: string; label: string }[];
    const entries = [
      { key: "instagram", href: branding.socialInstagram ?? "", label: "Instagram" },
      { key: "facebook", href: branding.socialFacebook ?? "", label: "Facebook" },
      { key: "youtube", href: branding.socialYoutube ?? "", label: "YouTube" },
      { key: "linkedin", href: branding.socialLinkedin ?? "", label: "LinkedIn" },
    ];
    return entries.filter((item) => typeof item.href === "string" && item.href.trim().length > 0);
  }, [branding]);

  // Evitar mismatch de hidratação: só renderizar blocos dinâmicos após montar no cliente
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const renderSocialIcon = (key: string) => {
    switch (key) {
      case "instagram":
        return (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zm5.25-3.75a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25z" />
          </svg>
        );
      case "facebook":
        return (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M13 22V12h3.5l.5-4H13V6.5c0-1 .25-1.5 1.5-1.5H17V2.1c-.77-.1-2.02-.1-3.28-.1C10.95 2 9 3.66 9 6.2V8H6v4h3v10z" />
          </svg>
        );
      case "youtube":
        return (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.14 5 12 5 12 5s-6.14 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.86 18.9 12 18.9 12 18.9s6.14 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.4-4.8zM10 15V9l5 3z" />
          </svg>
        );
      case "linkedin":
        return (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M4.98 3.5a2 2 0 1 1-2 2 2 2 0 0 1 2-2zM3 8h4v12H3zm6 0h3.8v1.7h.05A4.18 4.18 0 0 1 17.5 8c3 0 3.5 2 3.5 4.6V20h-4v-6.2c0-1.5 0-3.4-2-3.4s-2.3 1.6-2.3 3.3V20H9z" />
          </svg>
        );
      default:
        return null;
    }
  };

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

  // Carrega usuário do localStorage e mantém em sincronia
  useEffect(() => {
    const readUserFromStorage = () => {
      try {
        const raw = localStorage.getItem("gb:user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch { setUser(null); }
      try {
        const pr = localStorage.getItem('gb:userProfile');
        if (pr) {
          const p = JSON.parse(pr);
          setProfileAvatar(p?.avatar || "");
          setProfilePhone(p?.phone || "");
        } else {
          setProfileAvatar("");
          setProfilePhone("");
        }
      } catch { setProfileAvatar(""); setProfilePhone(""); }
    };

    // Inicial
    readUserFromStorage();

    // Eventos de atualização
    const onStorage = (e: StorageEvent) => {
      if (e.key === "gb:user" || e.key === 'gb:userProfile') readUserFromStorage();
    };
    const onCustom = () => readUserFromStorage();

    window.addEventListener("storage", onStorage);
    window.addEventListener("gb:user:changed" as any, onCustom as any);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("gb:user:changed" as any, onCustom as any);
    };
  }, []);

  // Refresca usuário quando a rota muda (ex.: após login redireciona)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("gb:user");
      setUser(raw ? JSON.parse(raw) : null);
      const pr = localStorage.getItem('gb:userProfile');
      if (pr) {
        const p = JSON.parse(pr);
        setProfileAvatar(p?.avatar || "");
        setProfilePhone(p?.phone || "");
      }
    } catch {}
  }, [pathname]);

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
  // Sincronizar searchExpanded com isHome (evita hidratação mismatch)
  setSearchExpanded(pathname === '/');
  
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
  const locationLinePrimary = loc ? 'Sua região' : 'Informe sua';
  const locationLineSecondary = loc
    ? (loc.street
        ? `${loc.street}${loc.houseNumber ? `, ${loc.houseNumber}` : ''}`
        : loc.neighborhood || loc.city || (loc.state ? loc.state.toUpperCase() : 'Localização'))
    : 'Localização';
  const locationTooltipParts = loc
    ? [
        loc.street ? `${loc.street}${loc.houseNumber ? `, ${loc.houseNumber}` : ''}` : '',
        loc.neighborhood || '',
        loc.city || '',
        loc.state ? loc.state.toUpperCase() : '',
      ].filter(Boolean)
    : [];
  const locationTooltip = locationTooltipParts.length > 0 ? locationTooltipParts.join(' • ') : undefined;
  const accountGreeting = user?.name ? user.name.split(' ')[0] : null;

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      {/* Mobile: Top Bar with Logo */}
      <div className="md:hidden border-b border-gray-100">
        <div className="flex items-center justify-between pl-1 pr-4 py-3">
          {/* Logo à esquerda */}
          <Link href="/" className="flex items-center -ml-2">
            {branding?.logoUrl ? (
              <Image
                src={branding.logoUrl}
                alt={branding.logoAlt || "Logo"}
                width={180}
                height={54}
                className="h-14 w-auto object-contain"
                priority
              />
            ) : (
              <div className="h-14 w-[180px]" aria-hidden />
            )}
          </Link>

          {/* Atalho conta do usuário */}
          <div className="flex items-center gap-1 pr-1">
            <Link
              href="/jornaleiro"
              className="inline-flex items-center justify-center h-12 w-12 text-[#2f2f2f] hover:text-[#ff5c00]"
              aria-label="Área do jornaleiro"
            >
              <IconBuildingStore size={28} stroke={2} />
            </Link>
            <Link
              href="/minha-conta"
              className="inline-flex items-center justify-center h-12 w-12 text-[#2f2f2f] hover:text-[#ff5c00]"
              aria-label="Minha conta"
            >
              <IconUser size={32} stroke={2} />
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop: main utility bar */}
      <div className="hidden md:block">
        <div className="container-max flex items-center gap-8 py-4">
          <Link href="/" className="flex items-center">
            {branding?.logoUrl ? (
              <Image
                src={branding.logoUrl}
                alt={branding.logoAlt || "Logo"}
                width={156}
                height={48}
                className="h-12 w-auto object-contain"
                priority
              />
            ) : (
              <div className="h-12 w-[156px]" aria-hidden />
            )}
          </Link>

          {!inDashboard && (
            <>
              {/* Ocultar busca na página da banca - haverá busca local lá */}
              {!isOnBancaPage && (
                <form onSubmit={onSearch} className="flex-1 max-w-2xl">
                  <div className="relative">
                    <IconSearch size={20} stroke={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <SearchAutocomplete
                      query={q}
                      onQueryChange={setQ}
                      onSelect={handleSearchSelect}
                      onSubmit={handleSearchSubmit}
                      placeholder="O que você procura hoje?"
                      className="w-full rounded-lg border border-gray-300 bg-white pl-11 pr-4 py-2.5 text-sm focus:border-[#ff5c00] focus:outline-none focus:ring-1 focus:ring-[#ff5c00]"
                    />
                  </div>
                </form>
              )}

              <div className={`flex items-center gap-6 text-sm ${isOnBancaPage ? 'flex-1 justify-end' : ''}`}>
                {mounted && (
                  <button
                    type="button"
                    onClick={() => setLocOpen(true)}
                    className="inline-flex items-center gap-2 text-gray-700 hover:text-[#ff5c00] transition-colors"
                    title={locationTooltip}
                  >
                    <IconMapPin size={20} stroke={1.5} className="text-gray-600" />
                    <span className="text-left leading-tight">
                      <span className="block text-[10px] text-gray-500">{locationLinePrimary}</span>
                      <span className="block text-xs font-medium text-gray-900 max-w-[120px] truncate">{locationLineSecondary}</span>
                    </span>
                    <IconChevronDown size={14} stroke={2} className="text-gray-400" />
                  </button>
                )}

                {user ? (
                  <div
                    id="account-menu"
                    onMouseEnter={() => setAccountOpen(true)}
                    onMouseLeave={() => setAccountOpen(false)}
                    className="relative inline-flex items-center"
                  >
                    <button
                      type="button"
                      onClick={() => setAccountOpen((v) => !v)}
                      className="inline-flex items-center gap-2 text-gray-700 hover:text-[#ff5c00] transition-colors"
                    >
                      <IconUserCircle size={20} stroke={1.5} className="text-gray-600" />
                      <span className="text-left leading-tight">
                        <span className="block text-[10px] text-gray-500">Olá{accountGreeting ? `, ${accountGreeting}` : "!"}</span>
                        <span className="block text-xs font-medium text-gray-900">Minha Conta</span>
                      </span>
                      <IconChevronDown size={14} stroke={2} className="text-gray-400" />
                    </button>
                    {accountOpen && (
                      <div className="absolute right-0 top-full z-40 mt-3 w-56 rounded-2xl border border-gray-200 bg-white shadow-xl">
                        <div className="py-1 text-sm">
                          <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={()=>{ try { localStorage.setItem('gb:dashboardActiveMenu','perfil'); } catch {}; router.push('/minha-conta'); setAccountOpen(false); }}>Meu Perfil</button>
                          <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={()=>{ try { localStorage.setItem('gb:dashboardActiveMenu','favoritos'); } catch {}; router.push('/minha-conta'); setAccountOpen(false); }}>Meus Favoritos</button>
                          <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={()=>{ try { localStorage.setItem('gb:dashboardActiveMenu','pedidos'); } catch {}; router.push('/minha-conta'); setAccountOpen(false); }}>Minhas compras</button>
                          <JornaleiroAdminLinks onClose={() => setAccountOpen(false)} />
                          <div className="h-px bg-gray-100 my-1" />
                          <button className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50" onClick={()=>{ setAccountOpen(false); logout(); }}>Sair</button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => router.push('/minha-conta')}
                    className="inline-flex items-center gap-2 text-gray-700 hover:text-[#ff5c00] transition-colors"
                  >
                    <IconUserCircle size={20} stroke={1.5} className="text-gray-600" />
                    <span className="text-left leading-tight">
                      <span className="block text-[10px] text-gray-500">Olá! Entre na</span>
                      <span className="block text-xs font-medium text-gray-900">Minha Conta</span>
                    </span>
                    <IconChevronDown size={14} stroke={2} className="text-gray-400" />
                  </button>
                )}

                <div
                  ref={cartRef}
                  className="relative inline-flex items-center"
                  onMouseEnter={() => {
                    if (hoverCloseTimer.current) { clearTimeout(hoverCloseTimer.current as any); hoverCloseTimer.current = null; }
                    setCartOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (hoverCloseTimer.current) { clearTimeout(hoverCloseTimer.current as any); }
                    hoverCloseTimer.current = window.setTimeout(() => { setCartOpen(false); }, 280);
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.innerWidth < 768) {
                        setCartSheetOpen(true);
                      } else {
                        setCartOpen((v) => !v);
                      }
                    }}
                    className="inline-flex items-center gap-2 text-gray-700 hover:text-[#ff5c00] transition-colors"
                  >
                    <span className="relative inline-flex">
                      <IconShoppingBag size={20} stroke={1.5} className="text-gray-600" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-full bg-[#ff5c00] text-[10px] font-semibold leading-[16px] text-center text-white">
                          {cartCount}
                        </span>
                      )}
                    </span>
                    <span className="text-left leading-tight">
                      <span className="block text-[10px] text-gray-500">Sua</span>
                      <span className="block text-xs font-medium text-gray-900">Sacola</span>
                    </span>
                    <IconChevronDown size={14} stroke={2} className="text-gray-400" />
                  </button>
                  {cartOpen && <MiniCartDropdown onClose={() => setCartOpen(false)} />}
                </div>

                {false && (
                  <button
                    type="button"
                    aria-label="Notificações"
                    title="Ativar notificações"
                    onClick={enableNotifications}
                    className="relative inline-flex items-center justify-center text-gray-600 hover:text-[#ff5c00] transition-colors"
                  >
                    {notifPulse && (
                      <span className="absolute inset-0 rounded-full bg-[#ff7a33]/20 animate-ping" />
                    )}
                    <IconBell size={22} stroke={1.5} />
                    {notifEnabled && notifCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-full bg-rose-600 text-[10px] font-semibold leading-[16px] text-center text-white">
                        {notifCount}
                      </span>
                    )}
                  </button>
                )}

                <Link
                  href="/jornaleiro"
                  className="inline-flex items-center rounded-md bg-[#ff5c00] text-white px-3 py-2 text-sm font-semibold shadow hover:opacity-95 transition-colors"
                  aria-label="Sou Jornaleiro"
                >
                  Sou Jornaleiro
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Badge de geolocalização - Mobile */}
      {!inDashboard && mounted && (
        <div className="md:hidden border-t border-gray-100 bg-gray-50">
          <div className="px-4 py-2">
            <button
              onClick={() => setLocOpen(true)}
              className="w-full flex items-center justify-between gap-2 text-sm text-gray-700 hover:text-[#ff5c00]"
              title={locationTooltip}
            >
              <div className="flex items-center gap-2">
                <IconMapPin size={18} stroke={1.6} className="text-[#ff5c00]" />
                <span className="font-medium">
                  {loc
                    ? `${locationLineSecondary}${loc.city ? `, ${loc.city}` : ''}`
                    : 'Informe sua localização'}
                </span>
              </div>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Busca mobile - Ocultar na página da banca */}
      {!inDashboard && !isOnBancaPage && (
        <div className="md:hidden border-t border-gray-100">
          <div className="px-4 py-3">
            <form onSubmit={onSearch}>
              <div className="relative">
                <IconSearch size={20} stroke={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={inputRef}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 pl-11 pr-4 py-3.5 text-sm focus:border-[#ff5c00] focus:outline-none focus:ring-1 focus:ring-[#ff5c00] focus:bg-white"
                  placeholder="O que você procura hoje?"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  aria-label="Buscar"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main bar: Horizontal Category Menu */}
      {!inDashboard && (
        <div className="hidden">
          <div className="container-max">
            <nav className="flex items-center gap-1 text-sm overflow-x-auto scrollbar-hide">
              <Link 
                href={"/promocoes" as Route} 
                className="whitespace-nowrap rounded-md px-4 py-1.5 font-medium text-white bg-black hover:bg-black/80 transition-colors"
              >
                {mounted ? (
                  <span className="inline-flex items-center gap-1">
                    November Black
                    <span aria-hidden className="text-base leading-none">🔥</span>
                  </span>
                ) : (
                  'Promoções'
                )}
              </Link>
              <Link 
                href={"/pre-venda" as Route} 
                className="whitespace-nowrap px-4 py-3 font-medium text-gray-700 hover:text-[#ff5c00] transition-colors"
              >
                Pré Venda
              </Link>
              <Link 
                href={"/categorias" as Route} 
                className="whitespace-nowrap px-4 py-3 font-medium text-gray-700 hover:text-[#ff5c00] transition-colors"
              >
                Categorias
              </Link>
              <Link 
                href={"/bancas-perto-de-mim" as Route} 
                className="whitespace-nowrap px-4 py-3 font-medium text-gray-700 hover:text-[#ff5c00] transition-colors"
              >
                Bancas
              </Link>
              <Link 
                href={"/jornaleiro" as Route} 
                className="whitespace-nowrap px-4 py-3 font-medium text-gray-700 hover:text-[#ff5c00] transition-colors"
              >
                Jornaleiro
              </Link>
              <button
                type="button"
                className="ml-auto inline-flex items-center gap-1 px-2 py-3 text-gray-500 hover:text-gray-700"
                aria-label="Ver mais categorias"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Componente de geolocalização automática */}
      <AutoGeolocation onLocationUpdate={handleLocationUpdate} />
    </header>
    {/* Mobile Search Bar (full width abaixo da navbar) - Ocultar na página da banca */}
    {!inDashboard && !isOnBancaPage && mobileSearchOpen && (
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
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff5c00]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-6-4.35-6-9a6 6 0 1 1 12 0c0 4.65-6 9-6 9z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="2.5"/></svg>
              <span>Bancas</span>
            </Link>
            {/* Promoções */}
            <Link href={"/promocoes" as any} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white bg-black hover:bg-black/80">
              {mounted ? (
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden className="text-lg leading-none">🔥</span>
                  <span>November Black</span>
                </span>
              ) : (
                <span>Promoções</span>
              )}
            </Link>
            {/* Pré Venda */}
            <Link href={"/pre-venda" as any} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff5c00]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h10M4 17h14"/></svg>
              <span>Pré Venda</span>
            </Link>
            {/* Categorias (colapsável) */}
            <button type="button" onClick={() => setCatsOpen(v=>!v)} className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
              <span className="inline-flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff5c00]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg>
                <span>Categorias</span>
              </span>
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {catsOpen && (
              <div className="pt-1">
                <div className="grid grid-cols-2 gap-1">
                  {categoryItems.filter((c) => {
                    const n = (c.name || '').trim().toLowerCase();
                    const link = (c.link || '').toLowerCase();
                    const byName = n === 'diversos' || n === 'sem categoria';
                    const byLink = link.includes('/diversos') || link.includes('/sem-categoria');
                    const byId = c.key === 'aaaaaaaa-0000-0000-0000-000000000001' || c.key === 'bbbbbbbb-0000-0000-0000-000000000001';
                    return !(byName || byLink || byId);
                  }).map((c) => (
                    <Link
                      key={c.key}
                      href={c.link as any}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-2xl bg-white p-2 hover:bg-gray-50"
                    >
                      <div className="relative h-7 w-7 rounded-xl overflow-hidden bg-gray-100 ring-1 ring-black/5 flex-shrink-0">
                        {c.image ? (
                          <Image 
                            src={c.image} 
                            alt={c.name} 
                            width={28} 
                            height={28} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class=\"h-7 w-7 rounded-xl grid place-items-center bg-white\"><span class=\"text-[11px] text-[#ff5c00] font-semibold\">${c.name[0]}</span></div>`;
                              }
                            }}
                          />
                        ) : (
                          <div className="h-7 w-7 rounded-xl grid place-items-center bg-white">
                            <span className="text-[11px] text-[#ff5c00] font-semibold">{c.name[0]}</span>
                          </div>
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-[#ff5c00]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z" /></svg>
                <span>Minha Conta</span>
              </Link>
            )}
            <Link href="/jornaleiro" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff5c00]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16v4H4zM6 11v7a1 1 0 001 1h10a1 1 0 001-1v-7"/></svg>
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

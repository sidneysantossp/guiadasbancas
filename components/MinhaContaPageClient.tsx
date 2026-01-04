"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";

function MinhaContaPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [lastOrder, setLastOrder] = useState<any | null>(null);
  const [activeMenu, setActiveMenu] = useState<
    | "perfil"
    | "pedidos"
    | "cupons"
    | "favoritos"
    | "pontos"
    | "indicacao"
    | "inbox"
  >("perfil");
  const [ordersTab, setOrdersTab] = useState<"andamento" | "anteriores" | "assinaturas">("andamento");
  const [orders, setOrders] = useState<any[]>([]);
  const [userCreatedAt, setUserCreatedAt] = useState<string | null>(null);

  // Perfil: estados locais
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileCPF, setProfileCPF] = useState("");
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState<string>("");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [walletAmount] = useState(0);
  const [loyaltyPoints] = useState(0);
  const [avatarDragOver, setAvatarDragOver] = useState(false);
  // Cupons
  const [coupons, setCoupons] = useState<Array<{id:string; code:string; label:string; type:'percent'|'free_shipping'; value:number; min:number; start:string; end:string;}>>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Helper para atualizar estado e URL (?editar=1)
  const setEditMode = (val: boolean) => {
    setEditingProfile(val);
    try {
      const params = new URLSearchParams(searchParams?.toString() || '');
      if (val) params.set('editar', '1'); else params.delete('editar');
      const base = typeof window !== 'undefined' ? window.location.pathname : '/minha-conta';
      const qs = params.toString();
      router.replace((qs ? `${base}?${qs}` : base) as any);
    } catch {}
  };

  useEffect(() => {
    // Verificar se vem do checkout
    const fromCheckout = searchParams?.get('checkout') === 'true';
    
    // Inicializa o modo de edição do perfil a partir da URL (?editar=1)
    try {
      const e = searchParams?.get('editar');
      if (e !== null) {
        setEditingProfile(e === '1' || e === 'true');
      }
    } catch {}

    try {
      const raw = localStorage.getItem("gb:user");
      if (raw) {
        setUser(JSON.parse(raw));
      } else {
        // Não está logado - redirecionar para /entrar
        const redirectParam = searchParams?.get('redirect');
        let entrarUrl = '/entrar';
        if (redirectParam) {
          entrarUrl += `?redirect=${encodeURIComponent(redirectParam)}`;
        } else if (fromCheckout) {
          entrarUrl += '?checkout=true';
        }
        router.replace(entrarUrl);
        return;
      }
      const rawOrder = localStorage.getItem("gb:lastOrder");
      if (rawOrder) setLastOrder(JSON.parse(rawOrder));
      const created = localStorage.getItem("gb:userCreatedAt");
      if (created) setUserCreatedAt(created);
      const rawOrders = localStorage.getItem("gb:orders");
      if (rawOrders) setOrders(Array.isArray(JSON.parse(rawOrders)) ? JSON.parse(rawOrders) : []);
      const wantMenu = localStorage.getItem("gb:dashboardActiveMenu");
      if (wantMenu) {
        setActiveMenu(wantMenu as any);
        localStorage.removeItem("gb:dashboardActiveMenu");
      } else if (fromCheckout) {
        // Se vem do checkout (após compra), ir para pedidos
        setActiveMenu("pedidos");
      }
      // Caso contrário, mantém o padrão "perfil"
      // Carregar perfil
      const profileRaw = localStorage.getItem('gb:userProfile');
      let phoneFromCheckout = '';
      try {
        const chk = localStorage.getItem('gb:checkout:profile');
        if (chk) phoneFromCheckout = (JSON.parse(chk) as any)?.phone || '';
      } catch {}
      if (profileRaw) {
        const p = JSON.parse(profileRaw) as any;
        setProfilePhone(p.phone || phoneFromCheckout || "");
        setProfileCPF(p.cpf || "");
        if (p.avatar) setProfileAvatar(p.avatar as string);
      } else {
        setProfilePhone(phoneFromCheckout || "");
      }
      if (raw) {
        const u = JSON.parse(raw) as any;
        setProfileName(u?.name || "");
        setProfileEmail(u?.email || "");
      }
      // Endereços e wishlist
      try {
        const addrs = JSON.parse(localStorage.getItem('gb:addresses') || '[]');
        if (Array.isArray(addrs)) setAddresses(addrs);
      } catch {}
      try {
        const wl = JSON.parse(localStorage.getItem('gb:wishlist') || '[]');
        if (Array.isArray(wl)) {
          setWishlistItems(wl);
          setWishlistCount(wl.length);
        } else {
          setWishlistItems([]);
          setWishlistCount(0);
        }
      } catch {}

      // Cupons
      try {
        const rawCoupons = localStorage.getItem('gb:coupons');
        if (rawCoupons) {
          const list = JSON.parse(rawCoupons);
          if (Array.isArray(list)) setCoupons(list);
        } else {
          const seed = [
            { id: 'c10', code: 'OFF10', label: '10% OFF', type: 'percent', value: 10, min: 50, start: '2023-02-07', end: '2025-12-01' },
            { id: 'c20', code: 'OFF20', label: '20% OFF', type: 'percent', value: 20, min: 300, start: '2023-02-07', end: '2025-12-01' },
            { id: 'cfd', code: 'FRETEGRATIS', label: 'Frete Grátis', type: 'free_shipping', value: 0, min: 150, start: '2023-02-07', end: '2025-12-01' },
          ];
          setCoupons(seed as any);
          localStorage.setItem('gb:coupons', JSON.stringify(seed));
        }
      } catch {}
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function logout() {
    try { localStorage.removeItem("gb:user"); } catch {}
    try { window.dispatchEvent(new Event('gb:user:changed')); } catch {}
    setUser(null);
  }

  if (user) {
    return (
      <section className="container-max py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full ring-1 ring-black/5 bg-gray-100 overflow-hidden relative">
                {profileAvatar ? (
                  <Image src={profileAvatar} alt="Avatar" fill sizes="48px" className="object-cover" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-orange-700 text-sm font-bold bg-orange-100">
                    {getInitials(user.name || user.email)}
                  </div>
                )}

            {activeMenu === 'favoritos' && (
              <div>
                <h2 className="text-base font-semibold">Meus Favoritos</h2>
                {(!wishlistItems || wishlistItems.length === 0) ? (
                  <div className="mt-3 grid place-items-center text-center text-sm text-gray-600 rounded-2xl border border-gray-200 bg-white p-8">
                    <div className="h-16 w-16 rounded-full bg-gray-100 grid place-items-center">
                      <svg viewBox="0 0 24 24" className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-4.5-9-8.2A5.4 5.4 0 0 1 12 6a5.4 5.4 0 0 1 9 6.8C19 16.5 12 21 12 21Z"/></svg>
                    </div>
                    <div className="mt-2 font-semibold">Você ainda não tem favoritos</div>
                    <div className="text-gray-500">Adicione produtos aos favoritos para vê-los aqui.</div>
                  </div>
                ) : (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {wishlistItems.map((p:any) => (
                      <div key={p.id || p.slug || p.name} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                        <div className="flex items-center gap-3 p-3">
                          <div className="relative h-14 w-14 rounded-md overflow-hidden bg-gray-50 border border-gray-200 shrink-0">
                            {p.image ? <Image src={p.image} alt={p.name || 'Produto'} fill sizes="56px" className="object-cover" /> : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold truncate">{p.name || 'Produto'}</div>
                            {typeof p.price === 'number' && (
                              <div className="text-[12px] text-gray-600">R$ {p.price.toFixed(2)}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 p-3 pt-0">
                          <button
                            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-gray-50"
                            onClick={() => {
                              const next = (wishlistItems || []).filter((i:any) => (i.id||i.slug||i.name) !== (p.id||p.slug||p.name));
                              setWishlistItems(next);
                              setWishlistCount(next.length);
                              try { localStorage.setItem('gb:wishlist', JSON.stringify(next)); } catch {}
                            }}
                          >Remover</button>
                          <button
                            className="rounded-md bg-[#ff5c00] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-95"
                            onClick={() => { try { localStorage.setItem('gb:lastViewedProduct', JSON.stringify(p)); } catch {}; window.location.href = '/'; }}
                          >Ver produto</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{user.name}</div>
                {profilePhone && <div className="text-[12px] text-gray-600 truncate">{profilePhone}</div>}
                {userCreatedAt && (
                  <div className="text-[11px] text-gray-500">{formatJoined(userCreatedAt)}</div>
                )}
              </div>
            </div>

            <nav className="mt-4 space-y-1 text-sm">
              {[
                { key: "perfil", label: "Meu Perfil", icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
                  </svg>
                )},
                { key: "pedidos", label: "Pedidos", icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
                    <path d="M8 8h8M8 12h8M8 16h5" />
                  </svg>
                )},
                { key: "cupons", label: "Cupons", icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 7h16v10H4z" />
                    <path d="M8 7v10M16 7v10" />
                    <path d="M7 12h10" />
                  </svg>
                )},
                { key: "favoritos", label: "Meus Favoritos", icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 21s-6.5-4.2-8.5-7.7A5.2 5.2 0 0 1 12 5.8a5.2 5.2 0 0 1 8.5 7.5C18.5 16.8 12 21 12 21Z" />
                  </svg>
                )},
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => setActiveMenu(m.key as any)}
                  className={`group w-full flex items-center gap-2 rounded-md px-3 py-2 text-left transition ${activeMenu===m.key?"bg-[#fff7f2] text-black":"hover:bg-[#fff7f2] hover:text-black text-gray-700"}`}
                >
                  <span className={`h-4 w-[3px] rounded ${activeMenu===m.key?"bg-[#ff5c00]":"bg-transparent group-hover:bg-[#ffd7bd]"}`} />
                  <span className={`grid place-items-center h-5 w-5 ${activeMenu===m.key?"text-[#ff5c00]":"text-gray-700 group-hover:text-[#ff5c00]"}`}>{m.icon}</span>
                  <span className={`font-medium ${activeMenu===m.key?"text-black":"group-hover:text-black"}`}>{m.label}</span>
                </button>
              ))}
              <div className="pt-2">
                <button onClick={logout} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-semibold hover:bg-gray-50">Sair</button>
              </div>
            </nav>
          </aside>

          {/* Conteúdo principal */}
          <main className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-md">
            {activeMenu === "pedidos" && (
              <div>
                <div className="flex gap-6 text-sm">
                  {(["andamento","anteriores","assinaturas"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setOrdersTab(tab)}
                      className={`relative pb-2 font-semibold ${ordersTab===tab?"text-black":"text-gray-500"}`}
                    >
                      {tab === "andamento" ? "Em andamento" : tab === "anteriores" ? "Anteriores" : "Assinaturas"}
                      {ordersTab===tab && <span className="absolute left-0 -bottom-[1px] h-[3px] w-full rounded bg-[#ff5c00]" />}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  {ordersTab === "andamento" && (
                    (() => {
                      const current = orders.filter(o => (o.status ?? "processing") === "processing");
                      if (!current.length) return <div className="text-sm text-gray-600">Você não possui pedidos em andamento.</div>;
                      return (
                        <div className="grid grid-cols-1 gap-3">
                          {current.map((o) => (
                            <Link key={o.orderId} href={("/minha-conta/pedidos/" + o.orderId) as Route} className="rounded-xl border border-gray-200 p-3 hover:bg-gray-50">
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold">Pedido {o.orderId}</div>
                                <div className="text-[12px] text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-[12px]">
                                <span className={`inline-flex items-center rounded-full px-2 py-[2px] font-semibold ${o.status==='completed'?'bg-emerald-50 text-emerald-700':o.status==='canceled'?'bg-rose-50 text-rose-700':'bg-blue-50 text-blue-700'}`}>
                                  {o.status==='completed'?'Concluído':o.status==='canceled'?'Cancelado':'Pendente'}
                                </span>
                                {o.shippingMethod === 'retirada' && (
                                  <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-[2px]">Retirar no local</span>
                                )}
                              </div>
                              
                              <div className="mt-2 space-y-1">
                                {(o.items || []).slice(0,3).map((it: any, idx: number) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <div className="relative h-6 w-6 rounded-md overflow-hidden bg-gray-50 border border-gray-200">
                                      {it.image ? <Image src={it.image} alt={it.name} fill sizes="24px" className="object-cover" /> : null}
                                    </div>
                                    <div className="text-sm text-gray-800 line-clamp-1">{it.name} <span className="text-gray-500">x{it.qty}</span></div>
                                  </div>
                                ))}
                                {Array.isArray(o.items) && o.items.length > 3 && (
                                  <div className="text-[12px] text-gray-600">+{o.items.length - 3} itens</div>
                                )}
                              </div>
                              <div className="mt-2 flex items-center justify-between text-sm">
                                <span className="text-gray-600">Total</span>
                                <span className="font-extrabold">R$ {o.pricing?.total?.toFixed(2)}</span>
                              </div>
                              <div className="mt-2 text-[12px] text-gray-600">
                                Entrega: {o.address?.street}{o.address?.houseNumber?`, ${o.address.houseNumber}`:""} · {o.address?.city} - {o.address?.uf}
                              </div>
                            </Link>
                          ))}
                        </div>
                      );
                    })()
                  )}

                  {ordersTab === "anteriores" && (
                    (() => {
                      const prev = orders.filter(o => (o.status ?? "processing") !== "processing");
                      if (!prev.length) return <div className="text-sm text-gray-600">Sem pedidos anteriores.</div>;
                      return (
                        <div className="grid grid-cols-1 gap-3">
                          {prev.map((o) => (
                            <Link key={o.orderId} href={("/minha-conta/pedidos/" + o.orderId) as Route} className="rounded-xl border border-gray-200 p-3 hover:bg-gray-50">
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold">Pedido {o.orderId}</div>
                                <div className="text-[12px] text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
                              </div>
                              <div className="mt-2 space-y-1">
                                {(o.items || []).slice(0,3).map((it: any, idx: number) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <div className="relative h-6 w-6 rounded-md overflow-hidden bg-gray-50 border border-gray-200">
                                      {it.image ? <Image src={it.image} alt={it.name} fill sizes="24px" className="object-cover" /> : null}
                                    </div>
                                    <div className="text-sm text-gray-800 line-clamp-1">{it.name} <span className="text-gray-500">x{it.qty}</span></div>
                                  </div>
                                ))}
                                {Array.isArray(o.items) && o.items.length > 3 && (
                                  <div className="text-[12px] text-gray-600">+{o.items.length - 3} itens</div>
                                )}
                              </div>
                              <div className="mt-2 flex items-center justify-between text-sm">
                                <span className="text-gray-600">Total</span>
                                <span className="font-extrabold">R$ {o.pricing?.total?.toFixed(2)}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      );
                    })()
                  )}

                  {ordersTab === "assinaturas" && (
                    <div className="text-sm text-gray-600">Nenhuma assinatura ativa.</div>
                  )}
                </div>
              </div>
            )}

            {activeMenu === "perfil" && (
              <div className="space-y-4">
                {/* Métricas */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-gray-200 bg-white p-3">
                    <div className="text-[12px] text-gray-600">Pedidos</div>
                    <div className="mt-1 text-xl font-extrabold text-orange-600">{orders.length}</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-3">
                    <div className="text-[12px] text-gray-600">Saldo na Carteira</div>
                    <div className="mt-1 text-xl font-extrabold text-orange-600">R$ {walletAmount.toFixed(2)}</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-3">
                    <div className="text-[12px] text-gray-600">Pontos de Fidelidade</div>
                    <div className="mt-1 text-xl font-extrabold text-orange-600">{loyaltyPoints}</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-3">
                    <div className="text-[12px] text-gray-600">Produtos em Favoritos</div>
                    <div className="mt-1 text-xl font-extrabold text-orange-600">{wishlistCount}</div>
                  </div>
                </div>

                {/* Detalhes pessoais */}
                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">Detalhes Pessoais</h3>
                    <button
                      onClick={() => setEditMode(!editingProfile)}
                      className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-gray-50"
                    >{editingProfile ? 'Cancelar' : 'Editar Perfil'}</button>
                  </div>

                  {!editingProfile ? (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2">
                        <span className="text-gray-600">Nome de Usuário</span>
                        <span className="font-medium truncate">{profileName || '-'}</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2">
                        <span className="text-gray-600">Telefone</span>
                        <span className="font-medium truncate">{profilePhone || '-'}</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2 sm:col-span-2">
                        <span className="text-gray-600">E-mail</span>
                        <span className="font-medium truncate">{profileEmail || '-'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Área de upload com Drag & Drop à esquerda */}
                        <div
                          className={`rounded-xl bg-gray-50 border ${avatarDragOver ? 'border-orange-400 ring-2 ring-orange-200' : 'border-gray-200'} p-4 grid place-items-center text-center`}
                          onDragOver={(e)=>{ e.preventDefault(); setAvatarDragOver(true); }}
                          onDragLeave={()=> setAvatarDragOver(false)}
                          onDrop={(e)=>{
                            e.preventDefault(); setAvatarDragOver(false);
                            const file = e.dataTransfer?.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () => setProfileAvatar(String(reader.result||''));
                            reader.readAsDataURL(file);
                          }}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="relative h-28 w-28 rounded-lg overflow-hidden bg-white/70 border border-dashed border-gray-300 grid place-items-center">
                              {profileAvatar ? (
                                <Image src={profileAvatar} alt="Avatar" fill sizes="112px" className="object-cover" />
                              ) : (
                                <svg viewBox="0 0 64 64" className="h-16 w-16 text-gray-400" fill="currentColor">
                                  <rect x="14" y="10" width="36" height="44" rx="4"/>
                                  <rect x="20" y="18" width="24" height="18" rx="2" className="text-white" fill="currentColor" opacity="0.7"/>
                                  <rect x="20" y="40" width="24" height="4" rx="2" className="text-white" fill="currentColor" opacity="0.7"/>
                                </svg>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              Arraste e solte uma imagem aqui
                              <br />ou
                              <label className="inline-flex items-center justify-center ml-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-semibold hover:bg-gray-50 cursor-pointer">
                                escolher arquivo
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e)=>{
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = () => setProfileAvatar(String(reader.result||''));
                                    reader.readAsDataURL(file);
                                  }}
                                />
                              </label>
                            </div>
                            {profileAvatar && (
                              <button
                                type="button"
                                className="text-[12px] text-gray-600 underline"
                                onClick={()=> setProfileAvatar("")}
                              >Remover imagem</button>
                            )}
                          </div>
                        </div>

                        {/* Form à direita (2 colunas) */}
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="sm:col-span-2">
                            <label className="text-sm text-gray-700">Nome</label>
                            <input className="input mt-1" value={profileName} onChange={(e)=>setProfileName(e.target.value)} placeholder="Seu nome" />
                          </div>
                          <div>
                            <label className="text-sm text-gray-700">Telefone</label>
                            <input className="input mt-1" value={profilePhone} onChange={(e)=>setProfilePhone(maskPhone(e.target.value))} placeholder="(11) 99999-9999" inputMode="tel" />
                          </div>
                          <div>
                            <label className="text-sm text-gray-700">E-mail</label>
                            <input className="input mt-1" type="email" value={profileEmail} onChange={(e)=>setProfileEmail(e.target.value)} placeholder="seu@email.com" />
                          </div>

                          {/* Barra de ações */}
                          <div className="sm:col-span-2 flex items-center justify-end gap-2 mt-1">
                            <button disabled className="rounded-md bg-gray-100 text-gray-400 px-4 py-2 text-sm font-semibold cursor-not-allowed">Redefinir</button>
                            <button
                              className="rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                              onClick={() => {
                                setProfileErr(null); setProfileMsg(null);
                                const cpfDigits = (profileCPF || '').replace(/\D+/g,'');
                                if (cpfDigits && !isValidCPF(cpfDigits)) { setProfileErr('CPF inválido'); return; }
                                try {
                                  // IMPORTANTE: Usar nome real, não parte do email
                                  const newUser = { name: profileName.trim() || 'Cliente', email: profileEmail };
                                  localStorage.setItem('gb:user', JSON.stringify(newUser));
                                  setUser(newUser);
                                } catch {}
                                try {
                                  localStorage.setItem('gb:userProfile', JSON.stringify({ phone: profilePhone, cpf: cpfDigits, avatar: profileAvatar }));
                                } catch {}
                                // Disparar evento para atualizar Navbar e outros componentes
                                try {
                                  window.dispatchEvent(new CustomEvent('gb:user:changed'));
                                } catch {}
                                setProfileMsg('Perfil salvo com sucesso');
                                setEditMode(false);
                              }}
                            >Atualizar Perfil</button>
                          </div>
                        </div>
                      </div>

                      {/* Alterar senha */}
                      <div className="mt-6">
                        <h4 className="text-base font-semibold">Alterar Senha</h4>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                          <div>
                            <label className="text-sm text-gray-700">Senha</label>
                            <div className="mt-1 relative">
                              <input className="input pr-9" type="password" placeholder="8+ Caracteres" />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"/><circle cx="12" cy="12" r="3"/></svg>
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-700">Confirmar Senha</label>
                            <div className="mt-1 relative">
                              <input className="input pr-9" type="password" placeholder="8+ Caracteres" />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"/><circle cx="12" cy="12" r="3"/></svg>
                              </span>
                            </div>
                          </div>
                          <div className="sm:col-span-1">
                            <button className="w-full rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-95">Alterar</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Endereços */}
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-md">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">Meus Endereços</h3>
                    <button
                      onClick={() => { router.push('/minha-conta/enderecos' as any); }}
                      className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-gray-50"
                    >Adicionar Endereço</button>
                  </div>
                  {addresses.length === 0 ? (
                    <div className="mt-4 grid place-items-center text-center text-sm text-gray-600">
                      <div className="h-16 w-16 rounded-full bg-orange-50 grid place-items-center">
                        <svg viewBox="0 0 24 24" className="h-8 w-8 text-orange-400" fill="currentColor"><path d="M12 2a7 7 0 017 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 017-7zm0 9.5A2.5 2.5 0 1012 6a2.5 2.5 0 000 5z"/></svg>
                      </div>
                      <div className="mt-2 font-semibold">Nenhum endereço cadastrado!</div>
                      <div className="text-gray-500">Adicione um endereço para uma experiência melhor.</div>
                    </div>
                  ) : (
                    <div className="mt-3 grid grid-cols-1 gap-3">
                      {addresses.map((a) => (
                        <div key={a.id} className="rounded-xl border border-gray-200 p-3 text-sm shadow-none">
                          <div className="font-semibold">{a.street}{a.number ? `, ${a.number}` : ''}</div>
                          <div className="text-gray-600">{a.neighborhood} · {a.city} - {a.uf} {a.cep ? `(CEP: ${a.cep})` : ''}</div>
                          {a.complement && <div className="text-gray-600">Comp.: {a.complement}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeMenu !== "pedidos" && activeMenu !== "perfil" && activeMenu !== "cupons" && activeMenu !== "favoritos" && (
              <div className="text-sm text-gray-600">Em breve: {activeMenu.replace(/^./, c=>c.toUpperCase())}</div>
            )}

            {activeMenu === 'cupons' && (
              <div>
                <h2 className="text-base font-semibold">Cupons Disponíveis</h2>
                <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {coupons.map(c => (
                    <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-10 grid place-items-center rounded-md bg-orange-100 text-orange-600">
                            {c.type === 'percent' ? (
                              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 5 5 19"/><circle cx="7" cy="7" r="3"/><circle cx="17" cy="17" r="3"/></svg>
                            ) : (
                              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18v10H3z"/><path d="M7 12h5"/></svg>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-extrabold">{c.label}</div>
                            <div className="text-[12px] text-gray-600">{formatRange(c.start, c.end)}</div>
                            <div className="text-[12px] text-gray-500">Compra mínima R$ {c.min.toFixed(2)}</div>
                          </div>
                        </div>
                        <button
                          onClick={async ()=>{
                            try {
                              await navigator.clipboard.writeText(c.code);
                              setCopiedCode(c.code);
                              setTimeout(()=>setCopiedCode(null), 1500);
                            } catch {}
                            try {
                              localStorage.setItem('gb:checkout:coupon', c.code);
                            } catch {}
                            router.push('/checkout' as any);
                          }}
                          className="shrink-0 rounded-md border border-orange-300 text-orange-600 px-3 py-1.5 text-sm font-semibold hover:bg-orange-50"
                        >{copiedCode===c.code? 'Copiado!' : 'Copiar código'}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </section>
    );
  }

  // Mostrar loading enquanto carrega/redireciona
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando...</p>
      </div>
    </div>
  );
}

export default function MinhaContaPageClient() {
  return (
    <Suspense fallback={
      <div className="container-max py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    }>
      <MinhaContaPageContent />
    </Suspense>
  );
}

// Helpers fora do componente
function maskCPF(v: string) {
  const d = (v || '').replace(/\D+/g, '').slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function isValidCPF(cpf: string) {
  const d = (cpf || '').replace(/\D+/g, '');
  if (!d || d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false; // repetidos
  let sum = 0;
  for (let i=0; i<9; i++) sum += parseInt(d.charAt(i)) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(d.charAt(9))) return false;
  sum = 0;
  for (let i=0; i<10; i++) sum += parseInt(d.charAt(i)) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(d.charAt(10))) return false;
  return true;
}

function maskPhone(v: string) {
  const d = (v || '').replace(/\D+/g, '').slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/(\d{2})(\d{4})(\d{0,4})/, (m, a, b, c) => c ? `(${a}) ${b}-${c}` : `(${a}) ${b}`);
  }
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, (m, a, b, c) => c ? `(${a}) ${b}-${c}` : `(${a}) ${b}`);
}

function formatJoined(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const s = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    return `Entrou em ${s.replace(/\./g, '')}`;
  } catch {
    return '';
  }
}

function formatRange(start: string, end: string) {
  try {
    const s = new Date(start);
    const e = new Date(end);
    const fmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    const ss = fmt.format(s).replace(/\./g, '');
    const ee = fmt.format(e).replace(/\./g, '');
    return `${ss} a ${ee}`;
  } catch {
    return '';
  }
}

function getInitials(nameOrEmail: string) {
  const str = (nameOrEmail || '').trim();
  if (!str) return 'U';
  const parts = str.includes(' ') ? str.split(' ') : [str.replace(/@.+$/,'')];
  const first = (parts[0] || '').charAt(0).toUpperCase();
  const last = (parts[parts.length - 1] || '').charAt(0).toUpperCase();
  return (first + (last || '')).slice(0,2) || 'U';
}

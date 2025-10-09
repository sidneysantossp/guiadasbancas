"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function PedidoDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);
  const [order, setOrder] = useState<any | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // Primeiro tenta buscar do backend
        const res = await fetch(`/api/orders?id=${encodeURIComponent(orderId)}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('gb:token') || ''}`,
          },
          cache: 'no-store',
        });
        
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && active) {
            setOrder(json.data);
            return;
          }
        }
      } catch (e) {
        console.error('Erro ao buscar pedido da API:', e);
      }

      // Fallback: busca do localStorage
      try {
        const rawOrders = localStorage.getItem("gb:orders");
        let found: any | null = null;
        if (rawOrders) {
          const list = JSON.parse(rawOrders) as any[];
          found = list.find((o) => o.orderId === orderId) || null;
        }
        if (!found) {
          const raw = localStorage.getItem("gb:lastOrder");
          if (raw) {
            const o = JSON.parse(raw);
            if (o?.orderId === orderId) found = o;
          }
        }
        if (active) setOrder(found);
      } catch {}
    })();
    return () => { active = false; };
  }, [orderId]);

  const itens = useMemo(() => (order?.items ?? []) as any[], [order]);
  const numbers = useMemo(() => {
    const subtotal = Number(order?.pricing?.subtotal ?? 0);
    const baseDiscount = Number(order?.pricing?.discount ?? 0);
    // Se houver cupom, consideramos todo desconto como de cupom
    const cupomDiscount = order?.coupon ? baseDiscount : 0;
    const otherDiscount = order?.coupon ? 0 : baseDiscount;
    const delivery = Number(order?.pricing?.shipping ?? 0);
    const adicionais = Array.isArray(order?.items)
      ? order.items.reduce((s: number, it: any) => s + (Array.isArray(it.addons) ? it.addons.reduce((ss: number, ad: any) => ss + Number(ad?.price || 0), 0) * Number(it.qty || 1) : 0), 0)
      : 0;
    const taxBase = Math.max(0, subtotal - (otherDiscount + cupomDiscount) + adicionais);
    const tax = Math.round(taxBase * 0.10 * 100) / 100; // 10%
    const total = Math.max(0, subtotal - (otherDiscount + cupomDiscount) + adicionais + tax + delivery);
    return { subtotal, discount: otherDiscount, cupomDiscount, delivery, adicionais, tax, total };
  }, [order]);

  const methodLabel = useMemo(() => {
    const m = (order?.payment ?? "pix") as string;
    if (m === "pix") return "PIX";
    if (m === "card") return "Cartão";
    if (m === "cash") return "Pagamento Na Entrega";
    return m;
  }, [order]);
  const paymentStatusLabel = useMemo(() => {
    const m = (order?.payment ?? "pix") as string;
    return m === 'cash' ? 'À Pagar' : 'Pago';
  }, [order]);
  const methodIcon = useMemo(() => {
    const m = (order?.payment ?? "pix") as string;
    if (m === 'pix') {
      return (<svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 3.5l7.5 7.5L12 18.5 4.5 11 12 3.5z"/></svg>);
    }
    if (m === 'card') {
      return (<svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M2 6h20v12H2z"/><path d="M2 10h20"/></svg>);
    }
    return (<svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M4 7h16v10H4z"/><path d="M7 10h3M7 14h6"/></svg>);
  }, [order]);

  if (!order) {
    return (
      <section className="container-max py-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="text-sm">Pedido não encontrado.</div>
          <div className="mt-3">
            <button onClick={() => router.push("/minha-conta")} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50">Voltar</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container-max py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full overflow-hidden ring-1 ring-black/5 bg-gray-100" />
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{order?.customer?.name || 'Usuário'}</div>
              <div className="text-[12px] text-gray-600 truncate">{order?.customer?.email || ''}</div>
            </div>
          </div>

          <nav className="mt-4 space-y-1 text-sm">
            {[
              { href: "/minha-conta", key: "perfil", label: "Meu Perfil", icon: (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z"/><path d="M3 20c0-3.3 4-6 9-6s9 2.7 9 6"/></svg>
              ), activeMenu: 'perfil' },
              { href: "/minha-conta", key: "pedidos", label: "Pedidos", icon: (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
              ), activeMenu: 'pedidos' },
              { href: "/minha-conta", key: "cupons", label: "Cupons", icon: (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16v10H4z"/><path d="M8 7v10M16 7v10"/></svg>
              ), activeMenu: 'cupons' },
              { href: "/minha-conta", key: "favoritos", label: "Meus Favoritos", icon: (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-4.5-9-8.2A5.4 5.4 0 0 1 12 6a5.4 5.4 0 0 1 9 6.8C19 16.5 12 21 12 21Z"/></svg>
              ), activeMenu: 'favoritos' },
              { href: "/minha-conta", key: "inbox", label: "Caixa de Entrada", icon: (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18v10H3z"/><path d="M3 13h6l2 3h2l2-3h6"/></svg>
              ), activeMenu: 'inbox' },
              { href: "/minha-conta", key: "config", label: "Configurações", icon: (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 0 1 7 3.2l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V2a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 0 1 21 7l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H22a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1Z"/></svg>
              ), activeMenu: 'config' },
            ].map((m) => (
              <a
                key={m.key}
                href={m.href}
                onClick={() => { try { localStorage.setItem('gb:dashboardActiveMenu', m.activeMenu); } catch {} }}
                className={`flex items-center gap-2 rounded-md px-3 py-2 transition hover:bg-gray-50 text-gray-700`}
              >
                <span className="grid place-items-center h-5 w-5 text-gray-600">{m.icon}</span>
                <span className="font-medium">{m.label}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Conteúdo do pedido */}
        <div className="lg:col-span-3 space-y-4">
          {/* Cabeçalho */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-lg sm:text-xl font-semibold">Pedido # {order.orderId}</h1>
            {/* Badges de status e retirada */}
            <span className={`inline-flex items-center rounded-full px-2 py-[2px] text-[12px] font-semibold ${order.status==='completed'?'bg-emerald-50 text-emerald-700':order.status==='canceled'?'bg-rose-50 text-rose-700':'bg-blue-50 text-blue-700'}`}>
              {order.status==='completed' ? 'Concluído' : order.status==='canceled' ? 'Cancelado' : 'Pendente'}
            </span>
            {order.shippingMethod === 'retirada' && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-[2px] text-[12px] font-semibold">Retirar No Local</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {order.status !== 'completed' && order.status !== 'canceled' && (
              <button
                onClick={() => {
                  try {
                    const raw = localStorage.getItem('gb:orders');
                    const list = raw ? (JSON.parse(raw) as any[]) : [];
                    const updated = list.map(o => o.orderId === order.orderId ? { ...o, status: 'canceled' } : o);
                    localStorage.setItem('gb:orders', JSON.stringify(updated));
                    const lastRaw = localStorage.getItem('gb:lastOrder');
                    if (lastRaw) {
                      const lo = JSON.parse(lastRaw);
                      if (lo?.orderId === order.orderId) {
                        localStorage.setItem('gb:lastOrder', JSON.stringify({ ...lo, status: 'canceled' }));
                      }
                    }
                    alert('Pedido cancelado');
                    router.push('/minha-conta');
                  } catch {}
                }}
                className="rounded-md border border-rose-200 bg-white text-rose-700 px-3 py-2 text-sm font-semibold hover:bg-rose-50"
              >
                Cancelar Pedido
              </button>
            )}
          </div>
        </div>
        <div className="mt-1 text-[12px] text-gray-600">Data do pedido: {new Date(order.createdAt).toLocaleString()}</div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h2 className="text-base font-semibold">Itens</h2>
            <div className="mt-3 space-y-2">
              {itens.map((it, idx) => (
                <div key={idx} className="rounded-xl border border-gray-200 p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-50 border border-gray-200">
                      {it.image ? <Image src={it.image} alt={it.name} fill sizes="40px" className="object-cover" /> : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{it.name}</div>
                      <div className="text-[12px] text-gray-600">Preço : R$ {Number(it.price).toFixed(2)}</div>
                    </div>
                    <div className="text-sm font-semibold">R$ {(it.price * it.qty).toFixed(2)}</div>
                    <div className="text-[12px] text-gray-600 ml-2">Qtd: {it.qty}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resumo */}
        <aside className="rounded-2xl border border-gray-200 bg-white p-4 h-fit">
          <h2 className="text-base font-semibold">Resumo</h2>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between"><span className="text-gray-600">Preço dos Itens</span><span className="font-medium">R$ {numbers.subtotal.toFixed(2)}</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-600">Preço dos Adicionais</span><span className="font-medium">R$ {numbers.adicionais.toFixed(2)}</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-600">Desconto</span><span className="text-emerald-700">(-) R$ {numbers.discount.toFixed(2)}</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-600">Desconto do Cupom</span><span className="text-emerald-700">(-) R$ {numbers.cupomDiscount.toFixed(2)}</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-600">Impostos (10%)</span><span className="font-medium">(+) R$ {numbers.tax.toFixed(2)}</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-600">Taxa de Entrega</span><span className="font-medium">R$ {numbers.delivery.toFixed(2)}</span></div>
            <div className="h-px bg-gray-200" />
            <div className="flex items-center justify-between text-base"><span className="font-semibold">Total</span><span className="font-extrabold">R$ {numbers.total.toFixed(2)}</span></div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-semibold">Informações da Banca</h3>
            <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm space-y-2">
              {order.banca_name && (
                <div>
                  <div className="text-gray-700 font-medium">🏪 {order.banca_name}</div>
                </div>
              )}
              {order.banca_whatsapp && (
                <div>
                  <div className="text-gray-700">📱 WhatsApp:</div>
                  <a 
                    href={`https://wa.me/${order.banca_whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-700 font-medium hover:underline"
                  >
                    {order.banca_whatsapp}
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </a>
                </div>
              )}
              {order.banca_address && (
                <div>
                  <div className="text-gray-700">📍 Endereço:</div>
                  <div className="text-gray-900">{order.banca_address}</div>
                </div>
              )}
              {!order.banca_name && !order.banca_whatsapp && !order.banca_address && (
                <div className="text-gray-500">Informações da banca não disponíveis</div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-semibold">Informações de Pagamento</h3>
            <div className="mt-2 rounded-xl border border-gray-200 bg-white p-3 text-sm flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Método :</span>
                <span className="inline-flex items-center gap-1 font-medium">{methodIcon}{methodLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Status do Pagamento :</span>
                <span className={`inline-flex items-center rounded-full px-2 py-[2px] text-[12px] font-semibold ${paymentStatusLabel==='Pago' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{paymentStatusLabel}</span>
              </div>
              {(order?.payment === 'pix' || order?.payment === 'card') && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">ID da transação :</span>
                  <span className="font-medium">{order?.paymentTxnId || '—'}</span>
                </div>
              )}
              {order?.payment === 'cash' && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">Troco para :</span>
                  <span className="font-medium">R$ {Number(order?.paymentChange ?? 0).toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
      </div>
      </div>
    </section>
  );
}

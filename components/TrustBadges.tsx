"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Props = {
  className?: string;
  variant?: 'large' | 'compact' | 'ecom';
};

export default function TrustBadges({ className = "", variant = 'large' }: Props) {
  const isLarge = variant === 'large';
  const isEcom = variant === 'ecom';
  if (isEcom) {
    // Ecommerce style: no borders, no bg, small icons inline, smaller font, centered
    const wrap = `hidden sm:grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 md:gap-8 items-center justify-items-center ${className}`;
    const text = `font-medium text-gray-700 text-xs sm:text-sm md:text-sm`;
    const iconImgCls = `h-3 w-3 sm:h-4 sm:w-4 md:h-4 md:w-4 object-contain flex-shrink-0`;
    const item = `flex items-center gap-1.5 md:gap-1.5`;
    const IconPagamento = (<Image src="https://cdn-icons-png.flaticon.com/128/9409/9409781.png" alt="Pagamento Facilitado" width={48} height={48} className={iconImgCls} />);
    const IconCompraSegura = (<Image src="https://cdn-icons-png.flaticon.com/128/1332/1332646.png" alt="Compra Segura" width={48} height={48} className={iconImgCls} />);
    const IconBancaVerificada = (<Image src="https://cdn-icons-png.flaticon.com/128/1271/1271343.png" alt="Responde Rápido" width={48} height={48} className={iconImgCls} />);
    const IconProntaEntrega = (<Image src="https://cdn-icons-png.flaticon.com/128/2331/2331107.png" alt="Pronta Entrega" width={48} height={48} className={iconImgCls} />);
    // Dados base
    const entries = useMemo(() => ([
      { icon: IconCompraSegura, label: 'Compra Segura' },
      { icon: IconBancaVerificada, label: 'Responde Rápido' },
      { icon: IconPagamento, label: 'Pagamento Facilitado' },
      { icon: IconProntaEntrega, label: 'Pronta Entrega' },
    ]), []);

    // Mobile slider: 2 por slide
    const slides = useMemo(() => {
      const arr: { icon: JSX.Element; label: string }[][] = [];
      for (let i = 0; i < entries.length; i += 2) arr.push(entries.slice(i, i + 2));
      return arr;
    }, [entries]);
    const [idx, setIdx] = useState(0);
    useEffect(() => {
      if (slides.length <= 1) return;
      const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 3000);
      return () => clearInterval(t);
    }, [slides.length]);

    return (
      <>
        {/* Mobile grid - all 4 in one row */}
        <div className={`sm:hidden grid grid-cols-4 gap-1 items-center justify-items-center ${className}`}>
          <div className="flex flex-col items-center gap-1 group relative" title="Compra Segura" aria-label="Compra Segura">
            {IconCompraSegura}
            <span className="font-medium text-gray-700 text-[9px] text-center leading-tight">Compra<br />Segura</span>
          </div>
          <div className="flex flex-col items-center gap-1 group relative" title="Responde Rápido" aria-label="Responde Rápido">
            {IconBancaVerificada}
            <span className="font-medium text-gray-700 text-[9px] text-center leading-tight">Responde<br />Rápido</span>
          </div>
          <div className="flex flex-col items-center gap-1 group relative" title="Pagamento Facilitado" aria-label="Pagamento Facilitado">
            {IconPagamento}
            <span className="font-medium text-gray-700 text-[9px] text-center leading-tight">Pagamento<br />Facilitado</span>
          </div>
          <div className="flex flex-col items-center gap-1 group relative" title="Pronta Entrega" aria-label="Pronta Entrega">
            {IconProntaEntrega}
            <span className="font-medium text-gray-700 text-[9px] text-center leading-tight">Pronta<br />Entrega</span>
          </div>
        </div>
        {/* Desktop grid */}
        <div className={wrap}>
          <div className={`${item} group relative`} title="Compra Segura" aria-label="Compra Segura">
            {IconCompraSegura}
            <span className={`${text} whitespace-nowrap`}>Compra Segura</span>
          </div>
          <div className={`${item} group relative`} title="Responde Rápido" aria-label="Responde Rápido">
            {IconBancaVerificada}
            <span className={`${text} whitespace-nowrap`}>Responde Rápido</span>
          </div>
          <div className={`${item} group relative`} title="Pagamento Facilitado" aria-label="Pagamento Facilitado">
            {IconPagamento}
            <span className={`${text} whitespace-nowrap`}>Pagamento Facilitado</span>
          </div>
        </div>
      </>
    );
  }
  // Mobile (<= sm): mais compacto e ícone um pouco maior
  const cardBase = `w-full flex items-center ${isLarge ? 'justify-center md:justify-start' : 'justify-center md:justify-start'} gap-2.5 sm:gap-3 md:gap-2 rounded-lg bg-white border border-gray-200 ${isLarge ? 'px-2.5 sm:px-4 md:px-3 py-1.5 sm:py-2.5 md:py-2' : 'px-2 sm:px-3 md:px-2 py-1.5 md:py-1'} text-sm`;
  const iconCls = `${isLarge ? 'h-6 w-6 sm:h-6 sm:w-6 md:h-5 md:w-5' : 'h-5 w-5 sm:h-5 sm:w-5 md:h-4 md:w-4'} object-contain`;
  const textCls = `font-medium text-gray-800 ${isLarge ? 'text-[13px] sm:text-[14px] md:text-[13px]' : 'text-[12px] sm:text-[13px] md:text-[11px] md:leading-tight'} text-center md:text-left`;
  const profileEntries = useMemo(() => ([
    { src: 'https://cdn-icons-png.flaticon.com/128/1332/1332646.png', label: 'Compra Segura' },
    { src: 'https://cdn-icons-png.flaticon.com/128/1271/1271343.png', label: 'Bancas Verificadas' },
    { src: 'https://cdn-icons-png.flaticon.com/128/9409/9409781.png', label: 'Pagamento Facilitado' },
    { src: 'https://cdn-icons-png.flaticon.com/128/2331/2331107.png', label: 'Pronta Entrega' },
  ]), []);
  const slides = useMemo(() => {
    const arr: { src: string; label: string }[][] = [];
    for (let i = 0; i < profileEntries.length; i += 2) arr.push(profileEntries.slice(i, i + 2));
    return arr;
  }, [profileEntries]);
  const [pIdx, setPIdx] = useState(0);
  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setPIdx((i) => (i + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <>
      {/* Mobile slider (perfil) */}
      <div className={`md:hidden relative overflow-hidden ${className}`} aria-roledescription="carousel">
        <div className="flex transition-transform duration-500" style={{ width: `${slides.length * 100}%`, transform: `translateX(-${pIdx * (100 / slides.length)}%)` }}>
          {slides.map((pair, s) => (
            <div key={s} className="w-full flex-shrink-0 px-2" style={{ width: `${100 / slides.length}%` }}>
              <div className="grid grid-cols-2 gap-3 items-stretch">
                {pair.map((e, i) => (
                  <div key={i} className={cardBase} title={e.label} aria-label={e.label}>
                    <Image src={e.src} alt={e.label} width={24} height={24} className={iconCls} />
                    {(() => {
                      const [first, ...rest] = (e.label || '').split(' ');
                      return (
                        <span className={textCls}>
                          <span className="block sm:inline">{first}</span>
                          {rest.length > 0 && (
                            <span className="block sm:inline"> {rest.join(' ')}</span>
                          )}
                        </span>
                      );
                    })()}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Desktop grid (perfil) */}
      <div className={`hidden md:grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-2 w-full md:justify-items-start ${className}`}>
        {/* Compra Segura */}
        <div className={cardBase} title="Compra Segura" aria-label="Compra Segura">
          <Image src="https://cdn-icons-png.flaticon.com/128/1332/1332646.png" alt="Compra Segura" width={24} height={24} className={iconCls} />
          <span className={textCls}>Compra Segura</span>
        </div>
        {/* Bancas Verificadas */}
        <div className={cardBase} title="Bancas Verificadas" aria-label="Bancas Verificadas">
          <Image src="https://cdn-icons-png.flaticon.com/128/1271/1271343.png" alt="Bancas Verificadas" width={24} height={24} className={iconCls} />
          <span className={textCls}>Bancas Verificadas</span>
        </div>
        {/* Pagamento Facilitado */}
        <div className={cardBase} title="Pagamento Facilitado" aria-label="Pagamento Facilitado">
          <Image src="https://cdn-icons-png.flaticon.com/128/9409/9409781.png" alt="Pagamento Facilitado" width={24} height={24} className={iconCls} />
          <span className={textCls}>Pagamento Facilitado</span>
        </div>
        {/* Pronta Entrega */}
        <div className={cardBase} title="Pronta Entrega" aria-label="Pronta Entrega">
          <Image src="https://cdn-icons-png.flaticon.com/128/2331/2331107.png" alt="Pronta Entrega" width={24} height={24} className={iconCls} />
          <span className={textCls}>Pronta Entrega</span>
        </div>
      </div>
    </>
  );
}

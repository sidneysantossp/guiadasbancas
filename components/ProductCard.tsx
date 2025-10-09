"use client";

import Image from "next/image";
import Link from "next/link";

export type ProductCardProps = {
  id: string | number;
  name: string;
  price: number;
  priceOriginal?: number;
  image?: string;
  href?: string;
  badgeLabel?: string;
  badgeClassName?: string; // e.g. "bg-[#fff3ec] text-[#ff5c00]"
  savingsAmount?: number; // opcional: mostrar economia
  rating?: number; // 0..5
  sellerName?: string;
  sellerAvatar?: string;
  distanceKm?: number;
  readyToShip?: boolean;
  imagePadding?: boolean;
  borderOrange?: boolean;
  ctaLabel?: string;
  phone?: string; // para CTA WhatsApp
};

export default function ProductCard({ id, name, price, priceOriginal, image, href = "/", badgeLabel, badgeClassName, savingsAmount, rating, sellerName, sellerAvatar, distanceKm, readyToShip, imagePadding, borderOrange, ctaLabel, phone }: ProductCardProps) {
  const stars = Array.from({ length: 5 }).map((_, i) => {
    const filled = (rating || 0) >= i + 1 - 0.001; // arredonda simples
    return (
      <svg key={i} viewBox="0 0 24 24" className={`h-3.5 w-3.5 ${filled ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" aria-hidden>
        <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193L12 .587z"/>
      </svg>
    );
  });

  return (
    <div key={id} className={`rounded-xl border ${borderOrange ? 'border-[#ff7a33]' : 'border-gray-200'} bg-white overflow-hidden`}>
      <div className={`relative ${imagePadding ? 'p-3' : ''} h-72 sm:h-80 w-full bg-gray-50 border-b ${borderOrange ? 'border-[#ffd7bd]' : 'border-gray-200'}`}>
        {image ? (
          <Image src={image} alt={name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className={`${imagePadding ? 'object-contain' : 'object-cover'}`} />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-gray-400">
            <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 13l3-3 5 5"/><circle cx="8" cy="9" r="1.5"/></svg>
          </div>
        )}
        {badgeLabel && (
          <span className={`absolute left-2 top-2 rounded-md text-[11px] font-semibold px-2 py-[2px] ${badgeClassName || "bg-gray-100 text-gray-700"}`}>
            {badgeLabel}
          </span>
        )}
        {readyToShip && (
          <span className="absolute right-2 top-2 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-[2px]">Pronta entrega</span>
        )}
      </div>
      <div className="p-3">
        <div className="text-sm font-semibold line-clamp-2 min-h-[2.5rem]">{name}</div>
        {(typeof rating === 'number' || typeof distanceKm === 'number') && (
          <div className="mt-1 flex items-center justify-between">
            <div className="flex items-center gap-1" aria-label={`Avaliação ${rating ?? 0} de 5`}>
              {stars}
              {typeof rating === 'number' && <span className="text-[12px] text-gray-500 ml-1">{rating.toFixed(1)}</span>}
            </div>
            {typeof distanceKm === 'number' && <div className="text-[12px] text-gray-600">{distanceKm.toFixed(1)} km</div>}
          </div>
        )}
        {(sellerName || sellerAvatar) && (
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-block h-5 w-5 rounded-full overflow-hidden bg-orange-100 ring-1 ring-black/5">
              {sellerAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sellerAvatar} alt={sellerName || 'Banca'} className="h-full w-full object-cover" />
              ) : (
                <svg viewBox="0 0 24 24" className="h-full w-full text-[#ff7a33]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z"/></svg>
              )}
            </span>
            <span className="text-[12px] text-gray-700 truncate">{sellerName || 'Banca'}</span>
          </div>
        )}
        {typeof priceOriginal === "number" && priceOriginal > price ? (
          <div className="mt-1 text-[13px]">
            <span className="text-gray-400 line-through mr-2">R$ {priceOriginal.toFixed(2)}</span>
            <span className="text-gray-800 font-semibold">R$ {price.toFixed(2)}</span>
          </div>
        ) : (
          <div className="mt-1 text-[13px] text-gray-700">R$ {price.toFixed(2)}</div>
        )}
        {typeof savingsAmount === "number" && savingsAmount > 0 && (
          <div className="text-[12px] text-emerald-600 mt-0.5">Economize R$ {savingsAmount.toFixed(2)}</div>
        )}
        <div className="mt-2 flex items-center justify-between">
          {phone ? (
            <a
              href={`https://wa.me/${String(phone).replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Tenho interesse no produto: ${name} (R$ ${price.toFixed(2)}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-[#25D366]/30 bg-[#25D366]/10 px-2 py-1 text-[11px] font-medium text-[#25D366] hover:bg-[#25D366]/15"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                <path d="M20.52 3.48A11.93 11.93 0 0012.06 0C5.5.03.2 5.33.22 11.88a11.8 11.8 0 001.58 5.96L0 24l6.33-1.66a11.94 11.94 0 005.73 1.48h.01c6.56-.02 11.86-5.33 11.87-11.88a11.86 11.86 0 00-3.42-8.46zm-8.46 19.2h-.01a9.96 9.96 0 01-5.07-1.39l-.36-.21-3.76.98 1-3.66-.24-.38a9.96 9.96 0 01-1.53-5.33C2.07 6.45 6.53 2 12.06 2c2.67 0 5.18 1.04 7.07 2.93a9.93 9.93 0 012.93 7.06c-.01 5.54-4.54 10.01-9.99 10.01zm5.48-7.47c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.16-.2.3-.77.97-.95 1.17-.18.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.53.08-.8.38-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.13 4.55.72.31 1.28.5 1.72.64.72.23 1.37.2 1.88.12.58-.08 1.77-.72 2.02-1.43.25-.7.25-1.31.17-1.43-.08-.12-.3-.2-.6-.35z" />
              </svg>
              Comprar
            </a>
          ) : <span />}
          <Link href={href as any} className="rounded-md bg-[#ff5c00] px-2 py-1 text-[11px] font-semibold text-white hover:opacity-95">{ctaLabel || 'Ver'}</Link>
        </div>
      </div>
    </div>
  );
}

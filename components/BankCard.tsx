"use client";

import Image from "next/image";
import Link from "next/link";
import { buildBancaHref } from "@/lib/slug";
import { loadStoredLocation } from "@/lib/location";
import { useEffect, useState } from "react";

export type Props = {
  id: string;
  name: string;
  address: string;
  distanceKm?: number;
  rating?: number;
  imageUrl?: string;
  profileImageUrl?: string;
  openNow?: boolean;
  categories?: string[];
  featured?: boolean;
  closeTimeLabel?: string;
  description?: string;
};

export default function BankCard({ id, name, address, distanceKm, rating = 4.8, imageUrl, profileImageUrl, openNow = true, categories = [], featured = false, closeTimeLabel, description }: Props) {
  const badge = typeof distanceKm === "number"
    ? (distanceKm! > 3 ? "+3Km" : `${Math.max(1, Math.round(distanceKm!))}Km`)
    : undefined;
  const [loc, setLoc] = useState<any>(null);
  useEffect(() => {
    try { setLoc(loadStoredLocation()); } catch {}
  }, []);
  const distanceLabel = typeof distanceKm === 'number' ? (distanceKm > 3 ? '+3Km' : `${Math.max(1, Math.round(distanceKm))}Km`) : undefined;
  const [coverSrc, setCoverSrc] = useState<string | undefined>(imageUrl);
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(profileImageUrl);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-transform transition-shadow duration-200 hover:shadow-xl hover:-translate-y-0.5">
      <div className="relative h-44 w-full p-2">
        <div className="relative h-full w-full overflow-hidden rounded-xl">
          <Image
            src={coverSrc || "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=60"}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 700px"
            onError={() => setCoverSrc("https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=60")}
          />
        </div>
        {featured && (
          <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-[#ff5c00] px-2.5 py-1 text-[12px] font-semibold text-white shadow-sm">
            Destaque
          </span>
        )}
        {/* Removido badge de distância no topo direito para evitar poluição visual */}
        {/* Aberto/Fechado — movido para dentro da imagem (inferior esquerda) */}
        <span
          className={`absolute left-3 bottom-3 inline-flex items-center rounded-full px-2 py-[2px] text-[11px] font-semibold shadow ${openNow ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
          title={openNow ? (closeTimeLabel ? `Horário padrão: seg-sex 08:00–18:00; sáb 08:00–13:00. Fecha às ${closeTimeLabel}.` : "Horário padrão: seg-sex 08:00–18:00; sáb 08:00–13:00.") : undefined}
        >
          {openNow ? (closeTimeLabel ? `Aberto — fecha às ${closeTimeLabel}` : "Aberto agora") : "Fechado"}
        </span>
      </div>
      <div className="p-4">
        {/* Estrelas na esquerda */}
        <div className="flex items-center gap-1 text-amber-500" aria-label={`Nota ${rating}`}>
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i}>★</span>
          ))}
          <span>☆</span>
          <span className="ml-2 inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[12px] font-semibold text-emerald-700">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Avatar + nome abaixo das estrelas */
        }
        <div className="mt-2 flex items-center gap-2 min-w-0">
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-white ring-2 ring-gray-200 p-1">
            <Image src={avatarSrc || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=60"} alt={name} fill className="object-cover" sizes="36px" onError={() => setAvatarSrc("https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=60")} />
          </div>
          <h3 className="text-base font-semibold leading-snug line-clamp-2">{name}</h3>
        </div>
        {/* Descrição curta logo abaixo do título */}
        {description && (
          <div className="mt-1 text-[12px] text-gray-700 line-clamp-2">{description}</div>
        )}
        {/* Ver no Mapa abaixo do nome, alinhado ao início dos badges de categorias (sem indent) */}
        <div className="mt-2 flex items-center">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[12px] text-black hover:underline"
          >
            <Image src="https://cdn-icons-png.flaticon.com/128/2875/2875433.png" alt="Mapa" width={16} height={16} className="h-4 w-4 rounded-full object-contain" />
            Ver no Mapa
          </a>
          {typeof distanceKm === 'number' && isFinite(distanceKm) && (
            <span className="ml-2 text-[12px] text-gray-700" aria-label={`Distância ${distanceKm.toFixed(1)} KM`}>
              • {distanceKm.toFixed(1).replace('.', ',')} KM
            </span>
          )}
        </div>

        {/* Categorias */}
        {categories.length > 0 && (
          <div className="mt-2.5 flex flex-nowrap gap-1">
            {categories.slice(0, 3).map((c) => (
              <span key={c} className="inline-flex items-center rounded-md bg-gray-100 px-1.5 py-[1px] text-[10px] text-gray-700 border border-gray-200">
                {c}
              </span>
            ))}
          </div>
        )}

        {/* Ações */}
        <div className="mt-3">
          <Link href={(buildBancaHref(name, id, loc) as any)} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#ff5c00] px-3 py-2 text-sm font-semibold text-white hover:opacity-95">
            Ver Banca
          </Link>
        </div>
      </div>
    </div>
  );
}

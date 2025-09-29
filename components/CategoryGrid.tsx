"use client";

import Link from "next/link";

type Cat = { slug: string; name: string; color: string; icon: JSX.Element };

const CATEGORIES: Cat[] = [
  { slug: "revistas", name: "Revistas", color: "bg-[#FFE8DC]", icon: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#ff5c00]" fill="currentColor">
      <path d="M5 4h12a2 2 0 0 1 2 2v13a1 1 0 0 1-1 1H6a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2zm0 2v11a1 1 0 0 0 1 1h11V6H6a1 1 0 0 0-1 0z" />
    </svg>
  )},
  { slug: "jornais", name: "Jornais", color: "bg-[#E6F0FF]", icon: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#ff5c00]" fill="currentColor">
      <path d="M4 5h15a1 1 0 0 1 1 1v11a3 3 0 0 1-3 3H6a2 2 0 0 1-2-2V5zM6 7v9a1 1 0 0 0 1 1h9V7H6z" />
    </svg>
  )},
  { slug: "quadrinhos", name: "Quadrinhos", color: "bg-[#F0E7FF]", icon: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#ff5c00]" fill="currentColor">
      <path d="M4 6a2 2 0 0 1 2-2h10l4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zm12 0v2h2l-2-2z" />
    </svg>
  )},
  { slug: "papelaria", name: "Papelaria", color: "bg-[#FFF5CC]", icon: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#ff5c00]" fill="currentColor">
      <path d="M3 17l9-9 5 5-9 9H3v-5zM14 6l2-2 4 4-2 2-4-4z" />
    </svg>
  )},
  { slug: "snacks", name: "Snacks", color: "bg-[#E8F6FF]", icon: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#ff5c00]" fill="currentColor">
      <path d="M6 3h12l-1 6H7L6 3zm1 8h10l-1 9H8l-1-9z" />
    </svg>
  )},
  { slug: "bebidas", name: "Bebidas", color: "bg-[#FFE6EA]", icon: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#ff5c00]" fill="currentColor">
      <path d="M7 3h10l-1 4H8L7 3zm1 6h8l-1 10a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2L8 9z" />
    </svg>
  )},
  { slug: "recargas", name: "Recargas", color: "bg-[#E8FFF1]", icon: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#ff5c00]" fill="currentColor">
      <path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm5 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    </svg>
  )},
  { slug: "colecionaveis", name: "Colecionáveis", color: "bg-[#EAF1FF]", icon: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#ff5c00]" fill="currentColor">
      <path d="M12 2l3 7h7l-5.5 4 2 7L12 17l-6.5 3 2-7L2 9h7z" />
    </svg>
  )},
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {CATEGORIES.map((c) => (
        <Link key={c.slug} href={`/departamentos?cat=${c.slug}`} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-[var(--color-primary)]">
          <div className={`h-10 w-10 ${c.color} rounded-md grid place-items-center`}>{c.icon}</div>
          <div className="font-medium">{c.name}</div>
        </Link>
      ))}
    </div>
  );
}

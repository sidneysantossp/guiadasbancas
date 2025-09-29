"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useCategories } from "@/lib/useCategories";

export default function DepartmentsMegaMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const scheduleClose = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => setOpen(false), 200);
  };

  const cancelClose = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  };

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-sm font-medium hover:text-[var(--color-primary)]"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Categorias
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 mt-3 w-[640px] rounded-xl border border-gray-200 bg-white shadow-lg z-50"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <MenuContent onClickItem={()=>setOpen(false)} />
          <div className="px-5 pb-5">
            <Link
              href="/categorias"
              className="w-full inline-flex items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
              onClick={() => setOpen(false)}
            >
              Ver todos
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuContent({ onClickItem }: { onClickItem: () => void }) {
  const { items } = useCategories();
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-4 p-5">
      {items.map((c) => (
        <Link
          key={c.key}
          href={c.link as any}
          className="flex items-center gap-3 rounded-md p-2 hover:bg-gray-50"
          onClick={onClickItem}
        >
          <div className="relative h-10 w-10 rounded-md overflow-hidden ring-1 ring-black/10">
            {c.image ? (
              <Image src={c.image} alt={c.name} fill className="object-cover" />
            ) : (
              <div className="grid place-items-center h-full w-full bg-white">
                <span className="text-xs text-[#ff5c00] font-semibold">{c.name[0]}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-black font-medium">{c.name}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useCallback, useState } from "react";
import { useCategories } from "@/lib/useCategories";

interface DepartmentsMegaMenuProps {
  isActive: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function DepartmentsMegaMenu({ isActive, onOpen, onClose }: DepartmentsMegaMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [preloaded, setPreloaded] = useState(false);
  
  // Pré-carregar dados no hover/focus
  const { items, loading } = useCategories();

  const scheduleClose = useCallback(() => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => onClose(), 200);
  }, [onClose]);

  const cancelClose = useCallback(() => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) onClose();
    }
    if (isActive) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isActive, onClose]);

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => {
        cancelClose();
        if (!preloaded) setPreloaded(true);
        onOpen();
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => isActive ? onClose() : onOpen()}
        onFocus={() => {
          if (!preloaded) setPreloaded(true);
          onOpen();
        }}
        className="inline-flex items-center gap-1 text-sm font-medium text-white hover:text-white/90"
        aria-haspopup="menu"
        aria-expanded={isActive}
      >
        Categorias
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isActive && (
        <div
          role="menu"
          className="absolute left-0 mt-3 w-[800px] xl:w-[900px] rounded-xl border border-gray-200 bg-white shadow-lg z-50"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <MenuContent onClickItem={onClose} />
          <div className="px-5 pb-5">
            <Link
              href="/categorias"
              className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
              onClick={onClose}
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
  const { items, loading } = useCategories();
  
  // Mostrar loading state
  if (loading) {
    return (
      <div className="grid grid-rows-3 grid-flow-col gap-x-8 gap-y-4 p-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-md p-2">
            <div className="h-10 w-10 rounded-md bg-gray-200 animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }
  
  const visible = items.filter((c) => c.name !== 'Diversos' && c.name !== 'Sem Categoria');
  return (
    <div className="grid grid-rows-3 grid-flow-col gap-x-8 gap-y-4 p-5">
      {visible.map((c) => (
        <Link
          key={c.key}
          href={c.link as any}
          className="flex items-center gap-3 rounded-md p-2 hover:bg-gray-50"
          onClick={onClickItem}
        >
          <div className="relative h-10 w-10 rounded-md overflow-hidden ring-1 ring-black/10">
            {c.image ? (
              <Image 
                src={c.image} 
                alt={c.name} 
                fill 
                sizes="40px" 
                className="object-cover" 
                loading="eager"
                priority={true}
                quality={75}
              />
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

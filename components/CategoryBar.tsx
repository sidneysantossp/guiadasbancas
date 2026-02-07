"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { categoryMenu, type MainCategory } from "./categoryMenuData";

interface CategoryBarProps {
  visible?: boolean;
}

export default function CategoryBar({ visible = true }: CategoryBarProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleClose = useCallback(() => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => {
      setMenuOpen(false);
      setActiveIndex(null);
    }, 200);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  }, []);

  const handleCategoryHover = useCallback(
    (index: number) => {
      cancelClose();
      setActiveIndex(index);
      setMenuOpen(true);
    },
    [cancelClose]
  );

  const handleBarEnter = useCallback(() => {
    cancelClose();
  }, [cancelClose]);

  const handleBarLeave = useCallback(() => {
    scheduleClose();
  }, [scheduleClose]);

  // Close on click outside
  useEffect(() => {
    if (!menuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setActiveIndex(null);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setActiveIndex(null);
      }
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [menuOpen]);

  if (!visible) return null;

  const activeCategory: MainCategory | null =
    activeIndex !== null ? categoryMenu[activeIndex] : null;

  return (
    <div
      ref={barRef}
      className="hidden md:block border-t border-gray-100 bg-white relative z-40"
      onMouseEnter={handleBarEnter}
      onMouseLeave={handleBarLeave}
    >
      {/* Horizontal category links */}
      <div className="container-max">
        <nav className="flex items-center gap-0 text-sm overflow-x-auto scrollbar-hide">
          {/* "Todas as Categorias" trigger */}
          <button
            type="button"
            onMouseEnter={() => handleCategoryHover(0)}
            onClick={() => {
              if (menuOpen) {
                setMenuOpen(false);
                setActiveIndex(null);
              } else {
                handleCategoryHover(0);
              }
            }}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-2.5 font-semibold transition-colors ${
              menuOpen
                ? "text-[#ff5c00] bg-orange-50"
                : "text-gray-800 hover:text-[#ff5c00]"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            Todas as Categorias
            <svg
              viewBox="0 0 24 24"
              className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <div className="h-5 w-px bg-gray-200" />

          {/* Quick links to main categories */}
          {categoryMenu.slice(0, 8).map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/categorias/${cat.slug}`}
              onMouseEnter={() => handleCategoryHover(i)}
              className={`whitespace-nowrap px-3 py-2.5 font-medium transition-colors ${
                menuOpen && activeIndex === i
                  ? "text-[#ff5c00]"
                  : "text-gray-600 hover:text-[#ff5c00]"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mega menu panel */}
      {menuOpen && (
        <div
          className="absolute left-0 right-0 top-full bg-white border-t border-gray-200 shadow-xl z-50"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="container-max">
            <div className="flex min-h-[340px]">
              {/* Left sidebar - category list */}
              <div className="w-[240px] flex-shrink-0 border-r border-gray-100 py-3 overflow-y-auto max-h-[420px]">
                {categoryMenu.map((cat, i) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => {
                      setMenuOpen(false);
                      setActiveIndex(null);
                      window.location.href = `/categorias/${cat.slug}`;
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
                      activeIndex === i
                        ? "bg-orange-50 text-[#ff5c00] font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg leading-none w-6 text-center flex-shrink-0">
                      {cat.icon}
                    </span>
                    <span>{cat.name}</span>
                    <svg
                      viewBox="0 0 24 24"
                      className={`h-4 w-4 ml-auto flex-shrink-0 transition-opacity ${
                        activeIndex === i ? "opacity-100" : "opacity-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Right panel - subcategories */}
              <div className="flex-1 p-6">
                {activeCategory && (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">{activeCategory.icon}</span>
                      <h3 className="text-lg font-bold text-gray-900">
                        {activeCategory.name}
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-x-8 gap-y-1">
                      {activeCategory.subcategories.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/categorias/${activeCategory.slug}?sub=${sub.slug}`}
                          onClick={() => {
                            setMenuOpen(false);
                            setActiveIndex(null);
                          }}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#ff5c00] transition-colors"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Link
                        href={`/categorias/${activeCategory.slug}`}
                        onClick={() => {
                          setMenuOpen(false);
                          setActiveIndex(null);
                        }}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-[#ff5c00] hover:underline"
                      >
                        Ver tudo em {activeCategory.name}
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 6l6 6-6 6" />
                        </svg>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

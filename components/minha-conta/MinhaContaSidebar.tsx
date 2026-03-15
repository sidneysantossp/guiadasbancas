"use client";

import Link from "next/link";
import Image from "next/image";
import { buildMinhaContaMenuSections, type MinhaContaMenuKey } from "@/lib/minha-conta-navigation";

type MinhaContaSidebarProps = {
  currentKey: MinhaContaMenuKey;
  userName: string;
  userEmail: string;
  userMeta?: string | null;
  avatarUrl?: string | null;
  onMenuSelect?: (key: MinhaContaMenuKey) => void;
  onLogout?: () => void;
};

function renderIcon(key: MinhaContaMenuKey) {
  switch (key) {
    case "inteligencia":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19h16" />
          <path d="M7 16V9" />
          <path d="M12 16V5" />
          <path d="M17 16v-4" />
        </svg>
      );
    case "perfil":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
        </svg>
      );
    case "pedidos":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      );
    case "enderecos":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21s-7-4.5-7-11a7 7 0 1 1 14 0c0 6.5-7 11-7 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "favoritos":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21s-6.5-4.2-8.5-7.7A5.2 5.2 0 0 1 12 5.8a5.2 5.2 0 0 1 8.5 7.5C18.5 16.8 12 21 12 21Z" />
        </svg>
      );
    case "cupons":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7h16v10H4z" />
          <path d="M8 7v10M16 7v10" />
          <path d="M7 12h10" />
        </svg>
      );
  }
}

function getInitials(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "U";
  const parts = trimmed.includes(" ") ? trimmed.split(" ") : [trimmed.replace(/@.+$/, "")];
  const first = parts[0]?.charAt(0)?.toUpperCase() || "";
  const last = parts[parts.length - 1]?.charAt(0)?.toUpperCase() || "";
  return (first + last).slice(0, 2) || "U";
}

export default function MinhaContaSidebar({
  currentKey,
  userName,
  userEmail,
  userMeta,
  avatarUrl,
  onMenuSelect,
  onLogout,
}: MinhaContaSidebarProps) {
  const sections = buildMinhaContaMenuSections();

  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-100 ring-1 ring-black/5">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="Avatar" fill sizes="48px" className="object-cover" />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-orange-100 text-sm font-bold text-orange-700">
              {getInitials(userName || userEmail)}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-gray-900">{userName || "Usuário"}</div>
          <div className="truncate text-[12px] text-gray-500">{userEmail}</div>
          {userMeta ? <div className="truncate text-[11px] text-gray-500">{userMeta}</div> : null}
        </div>
      </div>

      <nav className="mt-5 space-y-4">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
              {section.title}
            </div>
            <div className="mt-2 space-y-1">
              {section.items.map((item) => {
                const active = item.key === currentKey;
                const content = (
                  <>
                    <span className={`h-4 w-[3px] rounded ${active ? "bg-[#ff5c00]" : "bg-transparent"}`} />
                    <span className={`grid h-5 w-5 place-items-center ${active ? "text-[#ff5c00]" : "text-gray-600"}`}>
                      {renderIcon(item.key)}
                    </span>
                    <span className={`font-medium ${active ? "text-black" : "text-gray-700"}`}>{item.label}</span>
                  </>
                );

                if (!item.routeScoped && onMenuSelect) {
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => onMenuSelect(item.key)}
                      className={`group flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition ${
                        active ? "bg-[#fff7f2]" : "hover:bg-[#fff7f2]"
                      }`}
                    >
                      {content}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => {
                      try {
                        localStorage.setItem("gb:dashboardActiveMenu", item.key);
                      } catch {}
                    }}
                    className={`group flex items-center gap-2 rounded-md px-3 py-2 transition ${
                      active ? "bg-[#fff7f2]" : "hover:bg-[#fff7f2]"
                    }`}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {onLogout ? (
          <div className="pt-2">
            <button
              type="button"
              onClick={onLogout}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Sair
            </button>
          </div>
        ) : null}
      </nav>
    </aside>
  );
}

"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { Route } from "next";

export type CatalogSidebarAction = {
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
};

export type CatalogSidebarItem =
  | {
      type: "group";
      label: string;
      active?: boolean;
      href?: string;
      onClick?: () => void;
      children: CatalogSidebarAction[];
      expanded?: boolean;
      onToggle?: () => void;
    }
  | {
      type: "standalone";
      label: string;
      active?: boolean;
      href?: string;
      onClick?: () => void;
    };

type CatalogSidebarProps = {
  title?: string;
  summary?: ReactNode;
  allItem?: CatalogSidebarAction;
  items: CatalogSidebarItem[];
};

function renderAction(
  action: CatalogSidebarAction,
  className: string,
  content?: ReactNode
) {
  if (action.href) {
    return (
      <Link href={action.href as Route} className={className}>
        {content ?? action.label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={action.onClick} className={className}>
      {content ?? action.label}
    </button>
  );
}

function Chevron({ expanded }: { expanded?: boolean }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function CatalogSidebar({
  title = "Categorias",
  summary,
  allItem,
  items,
}: CatalogSidebarProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">{title}</h3>
      {summary ? <div className="mb-3 text-xs text-gray-500">{summary}</div> : null}

      <nav className="space-y-1">
        {allItem
          ? renderAction(
              allItem,
              `block w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                allItem.active
                  ? "bg-[#ff5c00] text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            )
          : null}

        {items.map((item, index) => {
          const spacing = `${allItem || index > 0 ? "mt-2 border-t border-gray-100 pt-2" : ""}`;

          if (item.type === "standalone") {
            return (
              <div key={item.label} className={spacing}>
                {renderAction(
                  item,
                  `block w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    item.active
                      ? "bg-[#ff5c00] text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                )}
              </div>
            );
          }

          const hasPrimaryAction = Boolean(item.href || item.onClick);

          return (
            <div key={item.label} className={spacing}>
              {hasPrimaryAction ? (
                <div className="flex items-center gap-2">
                  {renderAction(
                    {
                      label: item.label,
                      active: item.active,
                      href: item.href,
                      onClick: item.onClick,
                    },
                    `flex-1 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      item.active
                        ? "text-[#ff5c00]"
                        : "text-gray-900 hover:bg-gray-50"
                    }`
                  )}
                  {item.children.length > 0 ? (
                    <button
                      type="button"
                      onClick={item.onToggle}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                      aria-label={item.expanded ? `Fechar ${item.label}` : `Abrir ${item.label}`}
                    >
                      <Chevron expanded={item.expanded} />
                    </button>
                  ) : null}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={item.onToggle}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-gray-900 transition-colors hover:bg-gray-50"
                >
                  <span>{item.label}</span>
                  {item.children.length > 0 ? <Chevron expanded={item.expanded} /> : null}
                </button>
              )}

              {item.children.length > 0 ? (
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    item.expanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mt-1 space-y-0.5 pl-3">
                    {item.children.map((child) => (
                      <div key={`${item.label}-${child.label}`}>
                        {renderAction(
                          child,
                          `block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                            child.active
                              ? "bg-[#ff5c00] text-white"
                              : "text-gray-600 hover:bg-gray-50"
                          }`,
                          <span>{child.label}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

"use client";

import Link from "next/link";
import type { Route } from "next";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface SEOBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function SEOBreadcrumbs({ items }: SEOBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3 overflow-hidden whitespace-nowrap">
      <ol className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center min-w-0">
              {index > 0 && (
                <svg
                  className="h-3 w-3 sm:h-4 sm:w-4 mx-0.5 sm:mx-1 text-gray-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {item.href ? (
                <Link
                  href={item.href as Route}
                  className={`hover:text-[#ff5c00] transition-colors ${isLast ? "truncate max-w-[60vw] sm:max-w-none" : ""}`}
                  itemProp="item"
                >
                  <span itemProp="name" className="block truncate">
                    {item.name}
                  </span>
                </Link>
              ) : (
                <span
                  className={`text-gray-600 ${isLast ? "truncate max-w-[60vw] sm:max-w-none" : ""}`}
                  itemProp="name"
                >
                  {item.name}
                </span>
              )}
              {index < items.length - 1 && (
                <meta itemProp="position" content={String(index + 1)} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

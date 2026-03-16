"use client";

import { usePathname } from "next/navigation";
import { findJornaleiroMenuContextByPathname } from "@/lib/jornaleiro-navigation";

type JornaleiroPageHeadingProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  note?: React.ReactNode;
  className?: string;
};

export default function JornaleiroPageHeading({
  title,
  description,
  eyebrow,
  actions,
  note,
  className = "",
}: JornaleiroPageHeadingProps) {
  const pathname = usePathname();
  const activeContext = findJornaleiroMenuContextByPathname(pathname);
  const resolvedEyebrow = eyebrow ?? activeContext?.section.section;
  const resolvedDescription = description ?? activeContext?.item.description;

  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${className}`.trim()}>
      <div className="min-w-0">
        {resolvedEyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff5c00]">
            {resolvedEyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 text-xl font-semibold text-gray-900 sm:text-2xl">{title}</h1>
        {resolvedDescription ? (
          <p className="mt-1 max-w-3xl text-sm text-gray-600 sm:text-base">
            {resolvedDescription}
          </p>
        ) : null}
        {note ? <div className="mt-2 text-sm text-gray-500">{note}</div> : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

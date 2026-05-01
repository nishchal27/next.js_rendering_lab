"use client";

import { useId, useState } from "react";

type CollapsibleSectionProps = {
  title: string;
  description?: string;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function CollapsibleSection({
  title,
  description,
  badge,
  defaultOpen = false,
  children
}: CollapsibleSectionProps) {
  const contentId = useId();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  function toggleOpen() {
    setIsOpen((current) => !current);
  }

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm transition hover:shadow-md">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={toggleOpen}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
      >
        <span>
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-base font-bold text-slate-950">{title}</span>
            {badge && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {badge}
              </span>
            )}
          </span>
          {description && <span className="mt-1 block text-sm leading-6 text-slate-500">{description}</span>}
        </span>

        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-black text-slate-600 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          v
        </span>
      </button>

      <div
        id={contentId}
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-100 px-4 py-4 sm:px-5">{children}</div>
        </div>
      </div>
    </section>
  );
}

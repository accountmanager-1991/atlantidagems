"use client";

import { useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { locales, localeNames, type Locale } from "@/lib/i18n";

const FLAGS: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  de: "DE",
};

export default function LocaleSwitcher() {
  const { locale, setLocale } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 font-ui text-xs tracking-wide px-3 py-2 rounded-md border border-gold/30 text-ocean hover:border-gold hover:text-gold transition-colors font-medium"
        aria-label="Change language"
      >
        {FLAGS[locale]}
        <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-cream border border-gold/20 rounded-md shadow-lg overflow-hidden min-w-[120px]">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLocale(l);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 font-ui text-xs tracking-wide transition-colors ${
                  locale === l
                    ? "bg-ambar-light/15 text-ambar font-semibold"
                    : "text-ocean hover:bg-gold/10 hover:text-gold"
                }`}
              >
                <span className="font-bold">{FLAGS[l]}</span>
                <span className="text-[11px] opacity-70">{localeNames[l]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

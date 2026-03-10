"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { defaultLocale } from "@/lib/i18n";
import { getTranslations, type TranslationKeys } from "@/lib/translations";

interface AppContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;

    if (savedLocale && ["en", "es", "de"].includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
    document.documentElement.lang = l;
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const t = getTranslations(locale);

  return (
    <AppContext.Provider value={{ locale, setLocale, t, theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    // Return defaults when context is not available (SSR / outside provider)
    return {
      locale: defaultLocale,
      setLocale: () => {},
      t: getTranslations(defaultLocale),
      theme: "light" as const,
      toggleTheme: () => {},
    };
  }
  return ctx;
}

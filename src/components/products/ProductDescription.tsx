"use client";

import { useApp } from "@/components/providers/AppProvider";

interface Props {
  en: string;
  es: string;
  de: string;
}

export default function ProductDescription({ en, es, de }: Props) {
  const { locale } = useApp();

  const text = locale === "es" && es ? es : locale === "de" && de ? de : en;

  return (
    <p className="font-body text-base text-ocean/80 leading-relaxed mb-8">
      {text}
    </p>
  );
}

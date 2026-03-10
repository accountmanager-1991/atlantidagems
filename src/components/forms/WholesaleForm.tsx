"use client";

import { useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { BRAND } from "@/lib/constants";

interface WholesaleFormProps {
  variant?: "dark" | "light";
}

export default function WholesaleForm({ variant = "dark" }: WholesaleFormProps) {
  const { t } = useApp();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const isDark = variant === "dark";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/wholesale-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: `${data.get("firstName")} ${data.get("lastName")}`,
          businessName: data.get("company") || "N/A",
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
        }),
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputClass = isDark
    ? "w-full border border-cream/15 bg-white/5 px-4 py-3.5 font-ui text-sm text-cream placeholder:text-cream/35 focus:outline-none focus:border-ambar-light/50 transition-colors rounded"
    : "w-full border border-gold/20 bg-cream px-4 py-3.5 font-ui text-sm text-ocean placeholder:text-ocean/35 focus:outline-none focus:border-gold transition-colors rounded";

  const successTextColor = isDark ? "text-cream" : "text-ocean";
  const successSubColor = isDark ? "text-cream/50" : "text-ocean/50";
  const errorColor = isDark ? "text-red-400" : "text-red-600";
  const noteColor = isDark ? "text-cream/25" : "text-ocean/30";

  if (status === "sent") {
    return (
      <div className="text-center py-14">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ambar-light/15 text-ambar-light mb-5">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className={`font-heading text-xl tracking-[0.1em] mb-3 ${successTextColor}`}>
          {t.form.successTitle}
        </h3>
        <p className={`font-body text-sm max-w-sm mx-auto ${successSubColor}`}>
          {t.form.successDesc}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          placeholder={`${t.form.firstName} *`}
          required
          className={inputClass}
        />
        <input
          type="text"
          name="lastName"
          placeholder={`${t.form.lastName} *`}
          required
          className={inputClass}
        />
      </div>
      <input
        type="email"
        name="email"
        placeholder={`${t.form.email} *`}
        required
        className={inputClass}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="tel"
          name="phone"
          placeholder={`${t.form.phone} *`}
          required
          className={inputClass}
        />
        <input
          type="text"
          name="company"
          placeholder={t.form.company}
          className={inputClass}
        />
      </div>
      <textarea
        name="message"
        placeholder={`${t.form.message} *`}
        required
        rows={5}
        className={inputClass}
      />

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-ambar-light hover:bg-ambar text-navy py-4 font-ui text-sm tracking-[0.15em] uppercase transition-colors disabled:opacity-50 font-medium rounded"
      >
        {status === "sending" ? t.form.sending : t.form.send}
      </button>

      {status === "error" && (
        <p className={`font-ui text-sm text-center ${errorColor}`}>
          {t.form.errorMsg} {BRAND.email}
        </p>
      )}

      <p className={`font-ui text-[11px] text-center pt-1 ${noteColor}`}>
        {t.form.noSpam}
      </p>
    </form>
  );
}

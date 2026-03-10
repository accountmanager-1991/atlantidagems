"use client";

import { useState } from "react";
import { useApp } from "@/components/providers/AppProvider";

export default function ContactForm() {
  const { t } = useApp();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
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

  const inputClass =
    "w-full border border-gold/20 bg-white px-4 py-3 font-ui text-sm text-ocean placeholder:text-ocean/30 focus:outline-none focus:border-gold transition-colors rounded-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <input
          type="text"
          name="name"
          placeholder={t.contact.name}
          required
          className={inputClass}
        />
      </div>
      <div>
        <input
          type="email"
          name="email"
          placeholder={t.contact.email}
          required
          className={inputClass}
        />
      </div>
      <div>
        <input
          type="text"
          name="subject"
          placeholder={t.contact.subject}
          required
          className={inputClass}
        />
      </div>
      <div>
        <textarea
          name="message"
          placeholder={t.contact.message}
          rows={6}
          required
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-gold hover:bg-gold-dark text-dark py-4 font-ui text-sm tracking-[0.15em] uppercase transition-colors disabled:opacity-50"
      >
        {status === "sending" ? t.contact.sending : t.contact.send}
      </button>
      {status === "sent" && (
        <p className="font-ui text-sm text-green-600 text-center">
          {t.contact.success}
        </p>
      )}
      {status === "error" && (
        <p className="font-ui text-sm text-red-600 text-center">
          {t.contact.error}
        </p>
      )}
    </form>
  );
}

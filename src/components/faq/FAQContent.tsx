"use client";

import { useApp } from "@/components/providers/AppProvider";

export default function FAQContent() {
  const { t } = useApp();

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="font-ui text-xs tracking-[0.4em] text-gold mb-3 uppercase">
            {t.faq.badge}
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl tracking-[0.1em] text-ocean">
            {t.faq.heading}
          </h1>
          <div className="gold-divider w-24 mx-auto mt-6" />
        </div>

        <div className="space-y-8">
          {t.faq.items.map((faq, i) => (
            <div key={i} className="border-b border-gold/10 pb-8">
              <h2 className="font-heading text-base tracking-[0.05em] text-ocean mb-3 normal-case">
                {faq.q}
              </h2>
              <p className="font-body text-base text-ocean/70 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

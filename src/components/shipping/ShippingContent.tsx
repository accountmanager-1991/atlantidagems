"use client";

import { useApp } from "@/components/providers/AppProvider";

export default function ShippingContent() {
  const { t } = useApp();

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="font-ui text-xs tracking-[0.4em] text-gold mb-3 uppercase">
            {t.shipping.badge}
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl tracking-[0.1em] text-ocean">
            {t.shipping.title}
          </h1>
          <div className="gold-divider w-24 mx-auto mt-6" />
        </div>

        <div className="space-y-12">
          {/* Shipping */}
          <section>
            <h2 className="font-heading text-xl tracking-[0.08em] text-ocean mb-6 normal-case">
              {t.shipping.shippingTitle}
            </h2>
            <div className="space-y-4 font-body text-base text-ocean/70 leading-relaxed">
              <p>{t.shipping.shippingIntro}</p>
              <div className="bg-white p-6 rounded-sm">
                <h3 className="font-heading text-sm tracking-[0.1em] text-gold mb-4 uppercase">
                  {t.shipping.deliveryTimes}
                </h3>
                <div className="space-y-3 font-ui text-sm">
                  <div className="flex justify-between">
                    <span className="text-ocean">{t.shipping.us}</span>
                    <span className="text-ocean/60">{t.shipping.usDays}</span>
                  </div>
                  <div className="gold-divider" />
                  <div className="flex justify-between">
                    <span className="text-ocean">{t.shipping.canada}</span>
                    <span className="text-ocean/60">{t.shipping.canadaDays}</span>
                  </div>
                  <div className="gold-divider" />
                  <div className="flex justify-between">
                    <span className="text-ocean">{t.shipping.europe}</span>
                    <span className="text-ocean/60">{t.shipping.europeDays}</span>
                  </div>
                  <div className="gold-divider" />
                  <div className="flex justify-between">
                    <span className="text-ocean">{t.shipping.restOfWorld}</span>
                    <span className="text-ocean/60">{t.shipping.restDays}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-sm">
                <h3 className="font-heading text-sm tracking-[0.1em] text-gold mb-4 uppercase">
                  {t.shipping.shippingRates}
                </h3>
                <div className="space-y-3 font-ui text-sm">
                  <div className="flex justify-between">
                    <span className="text-ocean">{t.shipping.usOver250}</span>
                    <span className="text-gold font-medium">{t.shipping.free}</span>
                  </div>
                  <div className="gold-divider" />
                  <div className="flex justify-between">
                    <span className="text-ocean">{t.shipping.usUnder250}</span>
                    <span className="text-ocean/60">$19.99 USD</span>
                  </div>
                  <div className="gold-divider" />
                  <div className="flex justify-between">
                    <span className="text-ocean">{t.shipping.intl}</span>
                    <span className="text-ocean/60">$19.99 USD</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="gold-divider" />

          {/* Returns */}
          <section>
            <h2 className="font-heading text-xl tracking-[0.08em] text-ocean mb-6 normal-case">
              {t.shipping.returnTitle}
            </h2>
            <div className="space-y-4 font-body text-base text-ocean/70 leading-relaxed">
              <p>{t.shipping.returnIntro}</p>
              <div className="bg-white p-6 rounded-sm">
                <h3 className="font-heading text-sm tracking-[0.1em] text-gold mb-4 uppercase">
                  {t.shipping.conditions}
                </h3>
                <ul className="space-y-2 font-ui text-sm text-ocean/70">
                  <li>&#8226; {t.shipping.cond1}</li>
                  <li>&#8226; {t.shipping.cond2}</li>
                  <li>&#8226; {t.shipping.cond3}</li>
                  <li>&#8226; {t.shipping.cond4}</li>
                  <li>&#8226; {t.shipping.cond5}</li>
                </ul>
              </div>
              <p>{t.shipping.customNote}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

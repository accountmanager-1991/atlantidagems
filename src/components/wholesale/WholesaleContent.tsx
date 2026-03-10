"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";
import { BRAND } from "@/lib/constants";
import WholesaleForm from "@/components/forms/WholesaleForm";

export default function WholesaleContent() {
  const { t } = useApp();

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy text-cream py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-ui text-xs tracking-[0.4em] text-ambar-light mb-4 uppercase">
            {t.wholesale.badge}
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl tracking-[0.08em] text-cream mb-6">
            {t.wholesale.title}
          </h1>
          <p className="font-body text-lg text-cream/70 leading-relaxed mb-10 max-w-2xl mx-auto">
            {t.wholesale.subtitle}
          </p>
          <a
            href="#contact"
            className="inline-block bg-ambar-light hover:bg-ambar text-navy px-10 py-4 font-ui text-sm tracking-[0.15em] uppercase transition-colors font-medium"
          >
            {t.wholesale.cta}
          </a>
        </div>
      </section>

      {/* Why Partner */}
      <section className="py-20 sm:py-24 bg-cream">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-2xl sm:text-3xl tracking-[0.1em] text-ocean">
              {t.wholesale.whyTitle}
            </h2>
            <div className="gold-divider w-24 mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ambar-light/15 text-ambar mb-4">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </div>
              <h3 className="font-heading text-sm tracking-[0.15em] text-ocean mb-2 uppercase">
                {t.wholesale.directTitle}
              </h3>
              <p className="font-body text-sm text-ocean/60 leading-relaxed normal-case">
                {t.wholesale.directDesc}
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ambar-light/15 text-ambar mb-4">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="font-heading text-sm tracking-[0.15em] text-ocean mb-2 uppercase">
                {t.wholesale.authTitle}
              </h3>
              <p className="font-body text-sm text-ocean/60 leading-relaxed normal-case">
                {t.wholesale.authDesc}
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ambar-light/15 text-ambar mb-4">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h-1.5V11.25m0 0h14.774a1.125 1.125 0 01.796.33l2.4 2.4a1.125 1.125 0 01.33.796V14.25m-17.25 0h17.25M6.75 3h10.5a1.5 1.5 0 011.5 1.5v6.75" />
                </svg>
              </div>
              <h3 className="font-heading text-sm tracking-[0.15em] text-ocean mb-2 uppercase">
                {t.wholesale.fastTitle}
              </h3>
              <p className="font-body text-sm text-ocean/60 leading-relaxed normal-case">
                {t.wholesale.fastDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-navy text-ambar-light font-heading text-sm mb-3">
                1
              </div>
              <h3 className="font-heading text-xs tracking-[0.15em] text-ocean mb-1 uppercase">
                {t.wholesale.step1}
              </h3>
              <p className="font-body text-sm text-ocean/50 normal-case">
                {t.wholesale.step1Desc}
              </p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-navy text-ambar-light font-heading text-sm mb-3">
                2
              </div>
              <h3 className="font-heading text-xs tracking-[0.15em] text-ocean mb-1 uppercase">
                {t.wholesale.step2}
              </h3>
              <p className="font-body text-sm text-ocean/50 normal-case">
                {t.wholesale.step2Desc}
              </p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-navy text-ambar-light font-heading text-sm mb-3">
                3
              </div>
              <h3 className="font-heading text-xs tracking-[0.15em] text-ocean mb-1 uppercase">
                {t.wholesale.step3}
              </h3>
              <p className="font-body text-sm text-ocean/50 normal-case">
                {t.wholesale.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form — side by side with contact info on cream background */}
      <section id="contact" className="py-20 sm:py-28 bg-cream">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left — Contact info */}
            <div className="flex flex-col justify-center">
              <h2 className="font-heading text-2xl sm:text-3xl tracking-[0.08em] text-ocean mb-4">
                {t.wholesale.formTitle}
              </h2>
              <p className="font-body text-base text-ocean/60 leading-relaxed mb-8">
                {t.wholesale.formSubtitle}
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-sm tracking-[0.15em] text-gold mb-2 uppercase">
                    Email
                  </h3>
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="font-ui text-sm text-ocean hover:text-gold transition-colors"
                  >
                    {BRAND.email}
                  </a>
                </div>
                <div>
                  <h3 className="font-heading text-sm tracking-[0.15em] text-gold mb-2 uppercase">
                    Phone
                  </h3>
                  <a
                    href={`tel:${BRAND.phone}`}
                    className="font-ui text-sm text-ocean hover:text-gold transition-colors"
                  >
                    {BRAND.phone}
                  </a>
                </div>
                <div>
                  <h3 className="font-heading text-sm tracking-[0.15em] text-gold mb-2 uppercase">
                    Follow Us
                  </h3>
                  <div className="flex gap-4">
                    <a
                      href={BRAND.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-ui text-sm text-ocean hover:text-gold transition-colors"
                    >
                      Instagram
                    </a>
                    <a
                      href={BRAND.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-ui text-sm text-ocean hover:text-gold transition-colors"
                    >
                      Facebook
                    </a>
                    <a
                      href={BRAND.pinterest}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-ui text-sm text-ocean hover:text-gold transition-colors"
                    >
                      Pinterest
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Form on white card */}
            <div className="bg-white rounded-sm p-8 sm:p-10 shadow-sm border border-gold/10">
              <WholesaleForm variant="light" />
            </div>
          </div>

          {/* Legal links */}
          <p className="font-ui text-[11px] text-ocean/30 text-center mt-8">
            By submitting this form you agree to our{" "}
            <Link href="/privacy" className="text-gold/60 hover:text-gold transition-colors">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="text-gold/60 hover:text-gold transition-colors">
              Terms of Service
            </Link>.
          </p>
        </div>
      </section>
    </div>
  );
}

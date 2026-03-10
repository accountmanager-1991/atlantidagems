"use client";

import { useApp } from "@/components/providers/AppProvider";

export default function AboutContent() {
  const { t } = useApp();

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-ui text-xs tracking-[0.4em] text-gold mb-3 uppercase">
            {t.about.badge}
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl tracking-[0.1em] text-ocean">
            {t.about.title}
          </h1>
          <div className="gold-divider w-24 mx-auto mt-6" />
        </div>

        {/* Story */}
        <div className="space-y-10">
          <div className="aspect-[16/7] bg-gradient-to-br from-larimar/20 to-ocean/20 rounded-sm flex items-center justify-center">
            <span className="font-heading text-gold/20 text-xl tracking-widest uppercase">
              Brand Story Image
            </span>
          </div>

          <div className="prose-custom">
            <h2 className="font-heading text-2xl tracking-[0.08em] text-ocean mb-4 normal-case">
              {t.about.bornTitle}
            </h2>
            <p className="font-body text-base text-ocean/70 leading-relaxed mb-6">
              {t.about.bornP1}
            </p>
            <p className="font-body text-base text-ocean/70 leading-relaxed mb-6">
              {t.about.bornP2}
            </p>
          </div>

          <div className="gold-divider" />

          <div>
            <h2 className="font-heading text-2xl tracking-[0.08em] text-ocean mb-4 normal-case">
              {t.about.atlantisTitle}
            </h2>
            <p className="font-body text-base text-ocean/70 leading-relaxed mb-6">
              {t.about.atlantisP1}
            </p>
            <p className="font-body text-base text-ocean/70 leading-relaxed">
              {t.about.atlantisP2}
            </p>
          </div>

          <div className="gold-divider" />

          <div>
            <h2 className="font-heading text-2xl tracking-[0.08em] text-ocean mb-4 normal-case">
              {t.about.commitTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="font-heading text-sm tracking-[0.15em] text-gold mb-2 uppercase">
                  {t.about.ethicalTitle}
                </h3>
                <p className="font-body text-sm text-ocean/60">
                  {t.about.ethicalDesc}
                </p>
              </div>
              <div>
                <h3 className="font-heading text-sm tracking-[0.15em] text-gold mb-2 uppercase">
                  {t.about.authenticTitle}
                </h3>
                <p className="font-body text-sm text-ocean/60">
                  {t.about.authenticDesc}
                </p>
              </div>
              <div>
                <h3 className="font-heading text-sm tracking-[0.15em] text-gold mb-2 uppercase">
                  {t.about.qualityTitle}
                </h3>
                <p className="font-body text-sm text-ocean/60">
                  {t.about.qualityDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

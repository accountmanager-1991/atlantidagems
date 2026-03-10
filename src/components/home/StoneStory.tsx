"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";

export default function StoneStory() {
  const { t } = useApp();

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="font-ui text-xs tracking-[0.4em] text-gold mb-3 uppercase">
            {t.stoneStory.badge}
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl tracking-[0.1em] text-ocean">
            {t.stoneStory.title}
          </h2>
          <div className="gold-divider w-24 mx-auto mt-6" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Larimar */}
          <div>
            <div className="aspect-[4/3] bg-gradient-to-br from-larimar/20 to-ocean/10 rounded-sm flex items-center justify-center mb-8">
              <span className="font-heading text-larimar/30 text-2xl tracking-widest uppercase">
                Larimar
              </span>
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl tracking-[0.08em] text-ocean mb-4 normal-case">
              {t.stoneStory.larimarTitle}
            </h3>
            <p className="font-body text-base text-ocean/70 leading-relaxed mb-6">
              {t.stoneStory.larimarDesc}
            </p>
            <Link
              href="/shop?stone=larimar"
              className="font-ui text-sm text-gold hover:text-gold-dark tracking-wider uppercase transition-colors"
            >
              {t.stoneStory.shopLarimar} &rarr;
            </Link>
          </div>

          {/* Amber */}
          <div>
            <div className="aspect-[4/3] bg-gradient-to-br from-gold/20 to-gold-dark/10 rounded-sm flex items-center justify-center mb-8">
              <span className="font-heading text-gold/30 text-2xl tracking-widest uppercase">
                Amber
              </span>
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl tracking-[0.08em] text-ocean mb-4 normal-case">
              {t.stoneStory.amberTitle}
            </h3>
            <p className="font-body text-base text-ocean/70 leading-relaxed mb-6">
              {t.stoneStory.amberDesc}
            </p>
            <Link
              href="/shop?stone=amber"
              className="font-ui text-sm text-gold hover:text-gold-dark tracking-wider uppercase transition-colors"
            >
              {t.stoneStory.shopAmber} &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

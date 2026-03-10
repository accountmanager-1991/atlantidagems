"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useApp } from "@/components/providers/AppProvider";

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1574101102896-f9446194d738?auto=format&fit=crop&w=1920&q=80",
    alt: "Dark Caribbean ocean waves",
  },
  {
    src: "https://images.unsplash.com/photo-1706187654778-e09f1db97843?auto=format&fit=crop&w=1920&q=80",
    alt: "Moody Caribbean seascape",
  },
  {
    src: "https://images.unsplash.com/photo-1484506662025-7e5929e7cf00?auto=format&fit=crop&w=1920&q=80",
    alt: "Tropical Caribbean sunset",
  },
  {
    src: "https://images.unsplash.com/photo-1629908513781-1857f7ec2c8a?auto=format&fit=crop&w=1920&q=80",
    alt: "Deep blue ocean",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const { t } = useApp();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Desktop: 70% text / 30% image */}
      <div className="hidden lg:grid lg:grid-cols-10 min-h-[600px] max-h-[900px]">
        {/* Text area — 7/10 columns (70%) */}
        <div className="col-span-7 relative z-10 flex items-center justify-center bg-navy px-12 xl:px-20 py-16">
          <div className="max-w-2xl">
            <p className="font-ui text-xs sm:text-sm tracking-[0.3em] text-ambar-light mb-6 uppercase animate-fade-in-up">
              {t.hero.badge}
            </p>
            <h1 className="font-heading text-5xl xl:text-7xl tracking-[0.1em] text-white mb-6 animate-fade-in-up">
              {t.hero.title1}
              <br />
              <span className="text-gold">{t.hero.title2}</span>
            </h1>
            <p className="font-body text-xl text-cream/80 max-w-lg mb-10 italic animate-fade-in-up">
              {t.hero.subtitle}
            </p>
            <div className="flex gap-4 animate-fade-in-up">
              <Link
                href="/shop"
                className="inline-block bg-ambar-light hover:bg-ambar text-navy px-10 py-4 font-ui text-sm tracking-[0.15em] uppercase transition-colors font-medium text-center"
              >
                {t.hero.shopBtn}
              </Link>
              <Link
                href="/about"
                className="inline-block border border-cream/30 hover:border-ambar-light text-cream hover:text-ambar-light px-10 py-4 font-ui text-sm tracking-[0.15em] uppercase transition-colors text-center"
              >
                {t.hero.storyBtn}
              </Link>
            </div>

            {/* Slide indicators */}
            <div className="flex gap-2 mt-12">
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    i === current
                      ? "bg-ambar-light w-6"
                      : "bg-cream/30 hover:bg-cream/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Image strip — 3/10 columns (30%) */}
        <div className="col-span-3 relative">
          {HERO_IMAGES.map((img, i) => (
            <div
              key={img.src}
              className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
              style={{ opacity: i === current ? 1 : 0 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="30vw"
                priority={i === 0}
              />
            </div>
          ))}
          {/* Gradient blending into navy */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-navy to-transparent z-10" />
        </div>
      </div>

      {/* Mobile: stacked layout */}
      <div className="lg:hidden">
        <div className="bg-navy px-6 sm:px-10 py-16 sm:py-20">
          <div className="max-w-lg mx-auto">
            <p className="font-ui text-xs tracking-[0.3em] text-ambar-light mb-6 uppercase animate-fade-in-up">
              {t.hero.badge}
            </p>
            <h1 className="font-heading text-3xl sm:text-5xl tracking-[0.1em] text-white mb-6 animate-fade-in-up">
              {t.hero.title1}
              <br />
              <span className="text-gold">{t.hero.title2}</span>
            </h1>
            <p className="font-body text-lg sm:text-xl text-cream/80 max-w-md mb-10 italic animate-fade-in-up">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
              <Link
                href="/shop"
                className="inline-block bg-ambar-light hover:bg-ambar text-navy px-10 py-4 font-ui text-sm tracking-[0.15em] uppercase transition-colors font-medium text-center"
              >
                {t.hero.shopBtn}
              </Link>
              <Link
                href="/about"
                className="inline-block border border-cream/30 hover:border-ambar-light text-cream hover:text-ambar-light px-10 py-4 font-ui text-sm tracking-[0.15em] uppercase transition-colors text-center"
              >
                {t.hero.storyBtn}
              </Link>
            </div>
            <div className="flex gap-2 mt-12">
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    i === current
                      ? "bg-ambar-light w-6"
                      : "bg-cream/30 hover:bg-cream/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Mobile image below text */}
        <div className="relative h-[250px]">
          {HERO_IMAGES.map((img, i) => (
            <div
              key={img.src}
              className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
              style={{ opacity: i === current ? 1 : 0 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          ))}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-navy to-transparent z-10" />
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          viewBox="0 0 1440 60"
          className="w-full h-8 sm:h-12"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C360,0 720,60 1440,20 L1440,60 L0,60 Z"
            fill="#FAF7F0"
          />
        </svg>
      </div>
    </section>
  );
}

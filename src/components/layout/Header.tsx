"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { BRAND } from "@/lib/constants";
import { useCartStore } from "@/lib/cart-store";
import { useApp } from "@/components/providers/AppProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";
import ThemeToggle from "@/components/layout/ThemeToggle";

const NAV_ITEMS = [
  { href: "/shop", key: "shop" as const },
  { href: "/wholesale", key: "wholesale" as const },
  { href: "/about", key: "about" as const },
  { href: "/blog", key: "blog" as const },
  { href: "/contact", key: "contact" as const },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const { t } = useApp();

  return (
    <>
      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-gold/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-ocean"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logos/logo-mark-2026-04.svg"
                alt={BRAND.name}
                width={48}
                height={48}
                className="h-12 w-auto"
                priority
              />
              <div className="flex flex-col">
                <span className="font-heading text-lg sm:text-xl tracking-[0.12em] text-ocean uppercase leading-tight">
                  {BRAND.name}
                </span>
                <span className="text-[10px] tracking-[0.2em] text-gold/80 font-ui uppercase hidden sm:block">
                  {BRAND.subtitle}
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-ui text-sm tracking-[0.1em] uppercase text-ocean hover:text-gold transition-colors duration-300"
                >
                  {t.nav[item.key]}
                </Link>
              ))}
            </nav>

            {/* Right side: locale, theme, cart */}
            <div className="flex items-center gap-1">
              <div className="hidden sm:flex items-center gap-2">
                <LocaleSwitcher />
                <ThemeToggle />
              </div>

              {/* Cart button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-ocean hover:text-gold transition-colors"
                aria-label="Open cart"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-dark text-xs font-ui font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gold/20 bg-cream">
            <nav className="flex flex-col px-4 py-4 gap-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-ui text-sm tracking-[0.1em] uppercase text-ocean hover:text-gold transition-colors py-2"
                >
                  {t.nav[item.key]}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2 px-4 pb-4 border-t border-gold/10 pt-4">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

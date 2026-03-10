"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";

// Blog posts (will be replaced with MDX or Google Sheets in the future)
const posts = [
  {
    slug: "what-is-larimar",
    title: "What Is Larimar? The Complete Guide to the Atlantis Stone",
    excerpt:
      "Discover the only gemstone found in one place on Earth — the volcanic mountains of the Dominican Republic. Learn about Larimar's origins, properties, and why it's called The Atlantis Stone.",
    date: "2026-03-09",
    category: "Education",
  },
  {
    slug: "dominican-amber-guide",
    title: "Dominican Amber: 25 Million Years of Caribbean History",
    excerpt:
      "From ancient forests to your jewelry box — the fascinating story of Dominican Amber, including the extraordinarily rare Blue Amber that glows under UV light.",
    date: "2026-03-09",
    category: "Education",
  },
  {
    slug: "caring-for-larimar-jewelry",
    title: "How to Care for Your Larimar Jewelry",
    excerpt:
      "Simple tips to keep your Larimar pieces looking beautiful for years. Learn about cleaning, storage, and what to avoid.",
    date: "2026-03-09",
    category: "Care",
  },
];

export default function BlogContent() {
  const { t, locale } = useApp();

  const localeMap: Record<string, string> = {
    en: "en-US",
    es: "es-ES",
    de: "de-DE",
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="font-ui text-xs tracking-[0.4em] text-gold mb-3 uppercase">
            {t.blog.badge}
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl tracking-[0.1em] text-ocean">
            {t.blog.heading}
          </h1>
          <div className="gold-divider w-24 mx-auto mt-6" />
        </div>

        <div className="space-y-10">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group p-8 bg-white rounded-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-3">
                <span className="font-ui text-[10px] tracking-wider text-gold uppercase bg-gold/10 px-2 py-1">
                  {post.category}
                </span>
                <span className="font-ui text-xs text-ocean/40">
                  {new Date(post.date).toLocaleDateString(localeMap[locale] || "en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <Link href={`/blog/${post.slug}`}>
                <h2 className="font-heading text-xl tracking-[0.05em] text-ocean group-hover:text-gold transition-colors mb-3 normal-case">
                  {post.title}
                </h2>
              </Link>
              <p className="font-body text-base text-ocean/60 leading-relaxed mb-4">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="font-ui text-sm text-gold hover:text-gold-dark tracking-wider uppercase transition-colors"
              >
                {t.blog.readMore} &rarr;
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

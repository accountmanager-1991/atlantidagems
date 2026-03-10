import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

// Static blog content (will migrate to MDX files later)
const blogPosts: Record<
  string,
  { title: string; content: string; date: string; category: string }
> = {
  "what-is-larimar": {
    title: "What Is Larimar? The Complete Guide to the Atlantis Stone",
    date: "2026-03-09",
    category: "Education",
    content: `Larimar is a rare blue variety of the mineral pectolite, found only in the mountainous region of Barahona in the Dominican Republic. It was first officially discovered in 1974 by Miguel Mendez, who named it by combining his daughter's name "Larissa" with "mar" (Spanish for sea).

What makes Larimar truly special is its volcanic origin. Unlike most gemstones formed deep underground, Larimar was created by volcanic activity millions of years ago. The blue coloring comes from copper substitution for calcium in the crystal structure, creating patterns that range from light sky blue to deep volcanic blue.

Larimar is often called "The Atlantis Stone" — a name that captures both its mystery and its Caribbean origin. The philosopher Edgar Cayce once predicted that a blue stone with extraordinary healing properties would be found on a Caribbean island — many believe Larimar fulfills that prophecy.

Each Larimar stone is completely unique. The swirling patterns of blue and white are never repeated, making every piece of Larimar jewelry one of a kind. On the Mohs hardness scale, Larimar rates between 4.5 and 5, making it suitable for jewelry but requiring gentle care.

For jewelry purposes, Larimar is typically graded by its color intensity. The deepest volcanic blue stones are the most valuable and rare, while lighter blue and green-blue pieces are more commonly available. At Ambar & Larimar Shop, we hand-select only premium AAA-grade stones for our collection.

The global supply of Larimar is limited to a few small mines in the Barahona province. As these mines age, the stone becomes increasingly rare, and prices have risen approximately 20% between 2020 and 2024 alone. For collectors and jewelry lovers alike, Larimar represents both beauty and a genuine investment.`,
  },
  "dominican-amber-guide": {
    title: "Dominican Amber: 25 Million Years of Caribbean History",
    date: "2026-03-09",
    category: "Education",
    content: `Dominican Amber is fossilized resin from the now-extinct Hymenaea protera tree, preserved over 25 to 40 million years. It is among the most transparent amber in the world, prized by scientists and collectors alike for its remarkable clarity and the often perfectly preserved organisms trapped inside.

Unlike Baltic Amber (found in Northern Europe), Dominican Amber is uniquely clear and comes in a wider range of colors — from honey gold to red, green, and the extraordinarily rare blue.

Dominican Blue Amber is perhaps the most remarkable variety. In normal daylight it appears golden or honey-colored like regular amber. But under ultraviolet light or fluorescent lighting, it transforms dramatically, emitting an ethereal blue glow. This phenomenon is caused by polycyclic aromatic hydrocarbons within the amber and makes Dominican Blue Amber one of the rarest and most valuable gems on the planet.

The most famous amber mines in the Dominican Republic are located in the northern mountain region near La Cumbre and Santiago. Mining amber is a careful, manual process — the resin-bearing stones are found in sedimentary layers and must be extracted by hand to avoid damage.

Dominican Amber frequently contains inclusions — perfectly preserved insects, flowers, seeds, and even small lizards trapped millions of years ago. These inclusions are not defects; they are windows into an ancient Caribbean ecosystem that no longer exists. In fact, amber with clear, well-preserved inclusions commands premium prices from collectors.

At Ambar & Larimar Shop, our amber jewelry features stones hand-selected for their clarity, color, and character. Each piece tells a story that began 25 million years ago in the forests of what would become the Dominican Republic.`,
  },
  "caring-for-larimar-jewelry": {
    title: "How to Care for Your Larimar Jewelry",
    date: "2026-03-09",
    category: "Care",
    content: `Your Larimar jewelry is a rare and beautiful treasure that will last a lifetime with proper care. Here are our expert tips for keeping your pieces looking their best.

Daily Wear: Larimar is rated 4.5 to 5 on the Mohs hardness scale, making it suitable for regular wear but softer than many other gemstones. We recommend removing Larimar jewelry before activities that could cause impact or scratching.

Cleaning: Clean your Larimar jewelry with a soft, damp cloth and mild soap. Gently wipe the stone and metal setting, then dry completely with a soft cloth. Never use ultrasonic cleaners, steam cleaners, or harsh chemical solutions.

Storage: Store Larimar pieces separately from harder gemstones (like diamonds, sapphires, or even quartz) to prevent scratching. A soft pouch or individual compartment in a jewelry box is ideal. Keep pieces in a cool, dry place.

Avoid Heat and Sunlight: Prolonged exposure to direct sunlight or extreme heat can cause Larimar to fade over time. While occasional sun exposure is fine, don't store your pieces on a windowsill or wear them for extended periods in direct, intense sunlight.

Avoid Chemicals: Remove Larimar jewelry before swimming in chlorinated pools, using household cleaners, or applying perfume, sunscreen, or hairspray. These chemicals can damage both the stone and the silver or gold setting.

Sterling Silver Care: The sterling silver in your jewelry may develop a natural patina (tarnish) over time. This is normal and can be removed with a silver polishing cloth. Do not use silver dip solutions, as they can damage the Larimar stone.

Professional Care: For deep cleaning or repair, take your pieces to a jeweler experienced with soft gemstones. Let them know the piece contains Larimar so they use appropriate techniques.

With these simple care steps, your Ambar & Larimar Shop jewelry will remain beautiful for generations to come.`,
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];
  if (!post) return {};
  return {
    title: post.title,
    description: post.content.slice(0, 160),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) notFound();

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 font-ui text-sm text-ocean/50">
          <Link href="/blog" className="hover:text-gold transition-colors">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ocean">{post.title}</span>
        </nav>

        <article>
          <div className="flex items-center gap-4 mb-4">
            <span className="font-ui text-[10px] tracking-wider text-gold uppercase bg-gold/10 px-2 py-1">
              {post.category}
            </span>
            <span className="font-ui text-xs text-ocean/40">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl tracking-[0.05em] text-ocean mb-8 normal-case">
            {post.title}
          </h1>

          <div className="gold-divider mb-8" />

          <div className="space-y-6">
            {post.content.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="font-body text-base text-ocean/70 leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="gold-divider mt-12 mb-8" />

          <div className="text-center">
            <Link
              href="/blog"
              className="font-ui text-sm text-gold hover:text-gold-dark tracking-wider uppercase transition-colors"
            >
              &larr; Back to Blog
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import StoneStory from "@/components/home/StoneStory";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import { getFeaturedProducts } from "@/lib/products";

export const revalidate = 600;

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <Hero />
      <FeaturedProducts products={featuredProducts} />
      <StoneStory />
      <WhyChooseUs />
    </>
  );
}

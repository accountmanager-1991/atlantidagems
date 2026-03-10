import type { Metadata } from "next";
import AboutContent from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The story behind Ambar & Larimar Shop — handcrafted Larimar and Amber jewelry from the Dominican Republic.",
};

export default function AboutPage() {
  return <AboutContent />;
}

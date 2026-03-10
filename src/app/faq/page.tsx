import type { Metadata } from "next";
import FAQContent from "@/components/faq/FAQContent";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Ambar & Larimar Shop, Larimar jewelry, Dominican Amber, shipping, and returns.",
};

export default function FAQPage() {
  return <FAQContent />;
}

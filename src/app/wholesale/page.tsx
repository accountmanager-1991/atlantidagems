import type { Metadata } from "next";
import WholesaleContent from "@/components/wholesale/WholesaleContent";

export const metadata: Metadata = {
  title: "Wholesale",
  description:
    "Wholesale Larimar and Amber jewelry from the Dominican Republic. Partner with us for premium Caribbean gemstone jewelry.",
};

export default function WholesalePage() {
  return <WholesaleContent />;
}

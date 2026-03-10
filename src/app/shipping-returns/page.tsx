import type { Metadata } from "next";
import ShippingContent from "@/components/shipping/ShippingContent";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "Shipping information and return policy for Ambar & Larimar Shop jewelry orders.",
};

export default function ShippingReturnsPage() {
  return <ShippingContent />;
}

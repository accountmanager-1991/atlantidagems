import type { Metadata } from "next";
import ContactContent from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Ambar & Larimar Shop. Questions about our Larimar and Amber jewelry? We are here to help.",
};

export default function ContactPage() {
  return <ContactContent />;
}

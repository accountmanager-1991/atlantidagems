import type { Metadata } from "next";
import BlogContent from "@/components/blog/BlogContent";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Learn about Larimar, Dominican Amber, jewelry care, and the stories behind Ambar & Larimar Shop.",
};

export default function BlogPage() {
  return <BlogContent />;
}

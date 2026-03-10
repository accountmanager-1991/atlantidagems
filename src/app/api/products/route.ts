import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products";

export const revalidate = 300;

export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json(products);
}

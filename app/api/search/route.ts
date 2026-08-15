import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/commerce/products";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }
  const results = await searchProducts(q);
  return NextResponse.json({ results });
}

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await db.product.findMany({
      select: {
        category: true,
        variants: true,
      },
    });

    const allCategories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

    const hasPromotions = products.some((product) => product.variants.some((v) => v.promotion && v.promotion > 0));

    const result = [...allCategories];

    if (hasPromotions) {
      result.unshift("promo");
    }

    return NextResponse.json({ categories: result });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ message: "Tivemos um problema ao tentar carregar categorias" }, { status: 500 });
  }
}

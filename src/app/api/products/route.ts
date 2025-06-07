import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const take = Number(req.nextUrl.searchParams.get("take") || 10);
  const page = Number(req.nextUrl.searchParams.get("page") || 0);
  const q = req.nextUrl.searchParams.get("q") || "";
  const highlights = req.nextUrl.searchParams.get("highlights");
  const category = req.nextUrl.searchParams.get("category") || "";
  try {
    const skip = page * take;
    const filters = [{ name: { contains: q, mode: "insensitive" } }] as any;

    if (category) {
      filters.push({ category: { contains: category, mode: "insensitive" } });
    }
    if (highlights) {
      filters.push({
        AND: [{ highlights: { isEmpty: false } }],
      });
    }

    const [products, count] = await Promise.all([
      db.product.findMany({
        take: skip + take,
        where: {
          AND: filters,
        },
      }),
      db.product.count(),
    ]);

    return NextResponse.json({ products, hasMore: count > take * (page + 1) });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json({ message: "An unexpected error occurred. Please try again later" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await db.product.create({
      data: {
        name: body.name,
        picture: body.picture,
        category: body.category,
        variants: body.variants,
        highlights: body.highlights,
      },
    });

    return NextResponse.json({ message: "product created successfully!!" }, { status: 201 });
  } catch (err) {
    console.error("Failed to create product:", err);
    return NextResponse.json({ message: "An unexpected error occurred. Please try again later" }, { status: 500 });
  }
}

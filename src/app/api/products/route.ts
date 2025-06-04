import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const take = Number(req.nextUrl.searchParams.get("take") || 10);
  const page = Number(req.nextUrl.searchParams.get("page") || 0);
  try {
    const skip = page * take;

    const [products, count] = await Promise.all([db.product.findMany({ take: skip + take }), db.product.count()]);
    return NextResponse.json({ products, hasMore: count > take * (page + 1) });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json({ message: "An unexpected error occurred. Please try again later" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newProduct = await db.product.create({
      data: {
        name: body.name,
        picture: body.picture,
        category: body.category,
        variants: body.variants,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error("Failed to create product:", err);
    return NextResponse.json({ message: "An unexpected error occurred. Please try again later" }, { status: 500 });
  }
}

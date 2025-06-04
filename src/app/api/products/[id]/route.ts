import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
  });

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const { id } = await params;
    const productData = await db.product.findFirst({ where: { id } });

    if (!productData) return NextResponse.json({ message: "Product not found." }, { status: 404 });
    await db.product.update({
      where: { id },
      data: {
        name: body.name || productData.name,
        picture: body.picture || productData.picture,
        category: body.category || productData.category,
        variants: body.variants || productData.variants,
      },
    });

    return NextResponse.json({ message: "Product updated successfully." }, { status: 201 });
  } catch (err) {
    console.error("Failed to update product:", err);
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted" });
  } catch (err) {
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
  }
}

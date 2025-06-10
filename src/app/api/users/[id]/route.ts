import { db } from "@/lib/db";
import { hashSync } from "bcrypt";
import { hash } from "crypto";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json({ message: "An unexpected error occurred. Please try again later" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const { id } = await params;
    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const hashed = hashSync(body.password||"", 10);

    await db.user.update({
      where: { id },
      data: {
        name: body.name || user.name,
        phone: body.phone || user.phone,
        password: body.password ? hashed : user.password,
        isAdmin: body.isAdmin || user.isAdmin,
        address: body.address || user.address,
      },
    });

    return NextResponse.json({ message: "User updated successfully." }, { status: 201 });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json({ message: "An unexpected error occurred. Please try again later" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully." }, { status: 204 });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json({ message: "An unexpected error occurred. Please try again later" }, { status: 500 });
  }
}

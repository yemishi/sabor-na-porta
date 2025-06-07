import { db } from "@/lib/db";
import { hashSync } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const take = Number(req.nextUrl.searchParams.get("take") || 10);
  const page = Number(req.nextUrl.searchParams.get("page") || 0);
  const phone = req.nextUrl.searchParams.get("phone");
  try {
    if (phone) {
      const user = await db.user.findFirst({
        where: { phone },
        select: { address: true, phone: true, id: true, isAdmin: true, name: true },
      });
      if (!user) return NextResponse.json({ message: "User not found." }, { status: 404 });
      return NextResponse.json({ message: "User found successfully", user }, { status: 200 });
    }
    const skip = page * take;

    const [users, count] = await Promise.all([db.user.findMany({ skip, take: take * page }), db.user.count()]);
    return NextResponse.json({ users, hasMore: count > take * (page + 1) });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json({ message: "An unexpected error occurred. Please try again later" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const hashedPass = body.password && hashSync(body.password, 10);
    await db.user.create({
      data: {
        name: body.name,
        phone: body.phone,
        password: hashedPass,
        isAdmin: body.isAdmin,
      },
    });

    return NextResponse.json({ message: "User created successfully." }, { status: 201 });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json({ message: "An unexpected error occurred. Please try again later" }, { status: 500 });
  }
}

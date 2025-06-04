import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone") as string;
  try {
    const user = await db.user.findFirst({
      where: { phone },
    });

    if (!user) return NextResponse.json({ message: "User not found", exists: false }, { status: 200 });

    return NextResponse.json({ message: "User exists!", exists: true, hasPassword: !!user.password }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json({ message: "An unexpected error occurred. Please try again later" }, { status: 500 });
  }
}

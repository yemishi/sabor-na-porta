import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const take = Number(req.nextUrl.searchParams.get("take") || 10);
  const page = Number(req.nextUrl.searchParams.get("page") || 0);
  const q = req.nextUrl.searchParams.get("q") || "";
  const status = req.nextUrl.searchParams.get("status") || "";
  const userPhone = req.nextUrl.searchParams.get("userPhone") || "";
  try {
    const skip = page * take;
    if (userPhone) {
      const user = await db.user.findUnique({ where: { phone: userPhone } });
      if (!user) return NextResponse.json({ message: "User not found." }, { status: 404 });
      const [orders, count] = await Promise.all([
        db.order.findMany({
          where: {
            AND: {
              user: {
                is: {
                  userId: user.id,
                },
              },
            },
            orderId: { contains: q, mode: "insensitive" },
            status: { contains: status, mode: "insensitive" },
          },
          take,
          skip,
        }),
        db.order.count({
          where: {
            AND: {
              user: {
                is: {
                  userId: user.id,
                },
              },
            },
            orderId: { contains: q, mode: "insensitive" },
            status: { contains: status, mode: "insensitive" },
          },
        }),
      ]);
      return NextResponse.json({ orders, hasMore: count > take * (page + 1) });
    }
    const [orders, count] = await Promise.all([
      db.order.findMany({
        where: { orderId: { contains: q, mode: "insensitive" }, status: { contains: status, mode: "insensitive" } },
        take,
        skip,
      }),
      db.order.count({
        where: { orderId: { contains: q, mode: "insensitive" }, status: { contains: status, mode: "insensitive" } },
      }),
    ]);

    return NextResponse.json({ orders, hasMore: count > take * (page + 1) });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ message: "An unexpected error occurred. Please try again later" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const schedule = await db.storeSchedule.findMany({
      orderBy: { day: "asc" },
    });
    return NextResponse.json(schedule);
  } catch (error) {
    console.error("GET /api/store/schedule error:", error);
    return NextResponse.json({ error: "Failed to fetch schedule." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { day, openTime, closeTime } = body;

    if (day === undefined || !openTime || !closeTime) {
      return NextResponse.json({ error: "Missing day, openTime, or closeTime." }, { status: 400 });
    }

    const updatedSchedule = await db.storeSchedule.upsert({
      where: { day },
      update: { openTime, closeTime },
      create: { day, openTime, closeTime },
    });

    return NextResponse.json(updatedSchedule);
  } catch (error) {
    console.error("POST /api/store/schedule error:", error);
    return NextResponse.json({ error: "Failed to update schedule." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const day = Number(searchParams.get("day"));

    if (isNaN(day)) {
      return NextResponse.json({ error: "Invalid day parameter." }, { status: 400 });
    }

    await db.storeSchedule.delete({
      where: { day },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/store/schedule error:", error);
    return NextResponse.json({ error: "Failed to delete schedule." }, { status: 500 });
  }
}

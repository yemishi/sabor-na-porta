import { db } from "@/lib/db";
import { sendWhatsAppMessage } from "@/lib/sendWppMsg";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ message: "id's missing" }, { status: 404 });
  const userPhone = req.nextUrl.searchParams.get("userPhone");

  try {
    if (!userPhone) return NextResponse.json({ message: "Usuario não encontrado" }, { status: 404 });
    const user = await db.user.findUnique({ where: { phone: userPhone } });
    if (!user) return NextResponse.json({ message: "Usuario não encontrado" }, { status: 404 });
    const order = await db.order.findUnique({ where: { id } });
    if (!order || (order.user.userId !== user.id && !user.isAdmin))
      return NextResponse.json({ message: "Pedido não encontrado." }, { status: 404 });

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erro interno ao processar o pedido." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ message: "id's missing" }, { status: 404 });
  console.log("AAAAAAAA", id);
  const userPhone = req.nextUrl.searchParams.get("userPhone");
  const status = req.nextUrl.searchParams.get("status");

  try {
    if (!userPhone || !status)
      return NextResponse.json({ message: "user not found || status missing" }, { status: 404 });
    const user = await db.user.findUnique({ where: { phone: userPhone } });
    if (!user) return NextResponse.json({ message: "user not found" }, { status: 404 });
    const order = await db.order.findUnique({ where: { id } });
    if (!order || (order.user.userId !== user.id && !user.isAdmin))
      return NextResponse.json({ message: "Order not found." }, { status: 404 });
    await db.order.update({ where: { id: order.id }, data: { status } });
    if (status.toLowerCase() === "canceled") {
      /*   await     sendWhatsAppMessage({phone:order.user.phone,message:"awdaw"}) */
    }
    return NextResponse.json({ order, message: "Status do pedido mudado com sucesso." }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Erro interno ao tentar mudar o pedido." }, { status: 500 });
  }
}

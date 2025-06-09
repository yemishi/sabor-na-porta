import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendWhatsAppMessage } from "@/lib/sendWppMsg";
import emailjs from "@emailjs/browser";
import { formatOrderEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, address, products, paymentMethod, shippingFee = 0, changeAmount = null } = body;

    let totalFromServer = 0;
    const validatedProducts = [] as any;

    for (const item of products) {
      const dbProduct = await db.product.findUnique({
        where: { id: item.id },
      });

      if (!dbProduct) {
        return NextResponse.json(
          {
            code: 409,
            message: `Produto '${item.name}' não encontrado.`,
            issues: [{ id: item.id, reason: `Produto '${item.name}' não encontrado.` }],
          },
          { status: 409 }
        );
      }

      const variant = dbProduct.variants.find((v) => v.id === item.variantId);

      if (!variant) {
        return NextResponse.json(
          {
            code: 409,
            message: `Variante inválida para o produto '${item.name}'.`,
            issues: [{ id: item.id, reason: `Variante inválida para o produto '${item.name}'.` }],
          },
          { status: 409 }
        );
      }

      if (variant.stock < item.qtd) {
        return NextResponse.json(
          {
            code: 409,
            message: `Produto '${item.name}' fora de estoque.`,
            issues: [{ id: item.id, reason: `Produto '${item.name}' fora de estoque.` }],
          },
          { status: 409 }
        );
      }

      let unitPrice = variant.promotion ?? variant.price;

      if (item.addons?.length) {
        for (const addon of item.addons) {
          const addonFromDB = variant.addons.find((a) => a.name === addon.name);
          if (addonFromDB) {
            unitPrice += addonFromDB.price;
          }
        }
      }

      const itemTotal = unitPrice * item.qtd;
      totalFromServer += itemTotal;

      validatedProducts.push({
        id: item.id,
        picture: item.picture,
        name: item.name,
        price: itemTotal,
        qtd: item.qtd,
        obs: item.obs,
        addons: item.addons?.map((a: { name: string }) => a.name) || [],
      });
    }

    totalFromServer += shippingFee;

    const orderId = `${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = await db.order.create({
      data: {
        orderId,
        address: { set: address },
        user: user,
        products: validatedProducts,
        price: totalFromServer,
        paymentMethod,
        shippingFee,
        changeAmount: changeAmount ? parseFloat(changeAmount) : null,
      },
    });

    for (const item of products) {
      await db.product.update({
        where: { id: item.id },
        data: {
          variants: {
            updateMany: {
              where: { id: item.variantId },
              data: {
                stock: {
                  decrement: item.qtd,
                },
              },
            },
          },
        },
      });
    }

    /*     await sendWhatsAppMessage({
      phone: user.phone,
      message: `testando wpp api raaaaaah` }); */
    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch (error) {
    console.error("We had an error trying to create the order.", error);
    return NextResponse.json({ message: "Erro interno ao processar o pedido." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, address, products, paymentMethod, shippingFee = 0, changeAmount = null } = body;

    let totalFromServer = 0;
    const validatedProducts = [] as any;
    if (!products.length) {
      return NextResponse.json(
        {
          message: "Seu carrinho esta vazio mas validamos esse processo! (nao tente ver pedido)",
          newOrder: { id: "" },
        },
        { status: 200 }
      );
    }
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
          const variantAddonGroup = variant.addons.find((a) => a.title === addon.title);

          if (variantAddonGroup) {
            const totalAddonPrice = addon.options.reduce((sum: number, selectedOption: { name: string }) => {
              const optionInVariant = variantAddonGroup.options.find((o) => o.name === selectedOption.name);
              return sum + (optionInVariant?.price ?? 0);
            }, 0);

            unitPrice += totalAddonPrice;
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
        addons: item.addons,
      });
    }

    totalFromServer += shippingFee;
    const orderId = `${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = await db.order.create({
      data: {
        orderId,
        address: { set: address },
        user,
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

    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch (error) {
    console.error("We had an error trying to create the order.", error);
    return NextResponse.json({ message: "Erro interno ao processar o pedido." }, { status: 500 });
  }
}

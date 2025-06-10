import { Order } from "@/types";

const formatPhone = (phone: string) => {
  const match = phone.match(/^55(\d{2})(\d{4,5})(\d{4})$/);
  if (!match) return phone;
  const [, ddd, part1, part2] = match;
  return `(${ddd}) ${part1}-${part2}`;
};
export function formatOrderEmail(order: Order): { order_html: string; subject: string } {
  const formattedDate = new Date(order.createdAt).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  const productLines = order.products
    .map((product) => {
      const addons = product.addons?.length ? `\n    ➕ Adicionais: ${product.addons.join(", ")}` : "";
      const obs = product.obs ? `\n    📝 Obs: ${product.obs}` : "";

      return `- ${product.name} (x${product.qtd}) - R$ ${product.price.toFixed(2)}${addons}${obs}`;
    })
    .join("\n");

  const fullAddressString = `${order.address.street} ${order.address.houseNumber}, ${order.address.neighborhood}, ${order.address.city}, ${order.address.cep}`;
  const encodedMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddressString)}`;

  const order_html = `
🧾 NOVO PEDIDO RECEBIDO
👤 Nome: ${order.user?.name}
📞 Tel: ${formatPhone(order.user?.phone!)}

📦 Nº do Pedido: ${order.orderId}
📅 Data: ${formattedDate}
📍 Endereço: ${order.address.street}, ${order.address.houseNumber}, ${order.address.neighborhood} ${
    order.address.complement
  }
🗺️ Maps: ${encodedMapUrl}
💳 Método de pagamento: ${order.paymentMethod}
${order.changeAmount ? `💰 Troco para: R$ ${order.changeAmount.toFixed(2)}` : ""}

🛒 Produtos:
${productLines}

🚚 Taxa de entrega: R$ ${(order.shippingFee ?? 0).toFixed(2)}
💰 Total: R$ ${order.price.toFixed(2)}

🔗 Ver pedido completo: ${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/orders?q=${order.orderId}
`.trim();

  const subject = `🧾 Pedido #${order.orderId} — R$ ${order.price.toFixed(2)} — ${formattedDate}`;

  return { order_html, subject };
}

export function formatCanceledOrderEmail(order: Order): { order_html: string; subject: string } {
  const formattedDate = new Date(order.createdAt).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  const productLines = order.products
    .map((product) => {
      const addons = product.addons?.length ? `\n    ➕ Adicionais: ${product.addons.join(", ")}` : "";
      const obs = product.obs ? `\n    📝 Obs: ${product.obs}` : "";

      return `- ${product.name} (x${product.qtd}) - R$ ${product.price.toFixed(2)}${addons}${obs}`;
    })
    .join("\n");

  const fullAddressString = `${order.address.street} ${order.address.houseNumber}, ${order.address.neighborhood}, ${order.address.city}, ${order.address.cep}`;
  const encodedMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddressString)}`;

  const order_html = `
❌ PEDIDO CANCELADO

👤 Nome: ${order.user?.name}
📞 Tel: ${formatPhone(order.user?.phone!)}

📦 Nº do Pedido: ${order.orderId}
📅 Data do pedido: ${formattedDate}
📍 Endereço: ${order.address.street}, ${order.address.houseNumber}, ${order.address.neighborhood} ${
    order.address.complement
  }
🗺️ Maps: ${encodedMapUrl}
💳 Método de pagamento: ${order.paymentMethod}
${order.changeAmount ? `💰 Troco para: R$ ${order.changeAmount.toFixed(2)}` : ""}

🛒 Produtos:
${productLines}

🚚 Taxa de entrega: R$ ${(order.shippingFee ?? 0).toFixed(2)}
💰 Total: R$ ${order.price.toFixed(2)}

📄 Status: Cancelado
🔗 Va para o painle: ${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/orders?q=${order.orderId}
`.trim();

  const subject = `❌ Pedido CANCELADO #${order.orderId} — R$ ${order.price.toFixed(2)} — ${formattedDate}`;

  return { order_html, subject };
}

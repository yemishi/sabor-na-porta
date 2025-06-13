import { Order } from "@/types";

export async function sendWhatsAppMessage({ phone, message }: { phone: string; message: string }) {
  const token = process.env.WHATSAPP_TOKEN!;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;

  const payload = {
    messaging_product: "whatsapp",
    to: phone.replace(/\D/g, ""),
    type: "text",
    text: {
      body: message,
    },
  };

  const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("WhatsApp error:", data);
    throw new Error("Erro ao enviar mensagem via WhatsApp");
  }

  return data;
}

export const generateWppUrl = (msg: string) => {
  const message = encodeURIComponent(msg);
  const wppUrl = `https://api.whatsapp.com/send?phone=${process.env.NEXT_PUBLIC_CONTACT_PHONE}&text=${message}`;
  return wppUrl;
};

export const formatOrderMessage = (order: Order) => {
  const date = new Date(order.createdAt).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const user = order.user;
  const address = order.address;

  const fullAddressString = `${address.street} ${address.houseNumber}, ${address.neighborhood}, ${address.city}, ${address.cep}`;
  const encodedMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddressString)}`;

  const deliveryAddress = `
🛵   Endereço de entrega
Rua: ${address.street} ${address.houseNumber}
${order.address.ref ? `Ponto de referencia: ${order.address.ref}` : ""}
Complemento: ${address.complement ?? "-"}
Bairro: ${address.neighborhood}
Cep: ${address.cep}
📍 Localização: ${encodedMapUrl}
`.trim();

  const itemList = order.products
    .map((item) => {
      const addons = item.addons?.length ? `\n    ➕ Extras: ${item.addons.join(", ")}` : "";
      const obs = item.obs ? `\n    📝 Obs: ${item.obs}` : "";
      return `
${item.qtd} x ${item.name}
💵 ${item.qtd} x R$ ${item.price / item.qtd} = R$ ${item.price.toFixed(2)}${addons}${obs}
`.trim();
    })
    .join("\n\n");

  const shippingFee = order.shippingFee ?? 0;
  const changeInfo =
    order.paymentMethod.toLowerCase() === "dinheiro" && order.changeAmount
      ? `Dinheiro: R$ ${order.changeAmount.toFixed(2)}`
      : order.paymentMethod;

  return `
#### NOVO PEDIDO ####

#️⃣   Nº pedido: ${order.orderId}
feito em ${date}

👤   ${user?.name}
📞   ${user?.phone}

${deliveryAddress}

------- ITENS DO PEDIDO -------
${itemList}
-------------------------------

SUBTOTAL: R$ ${(order.price - shippingFee).toFixed(2)}
${shippingFee === 0 ? "ENTREGA GRATUITA" : `ENTREGA: R$ ${shippingFee.toFixed(2)}`}
VALOR FINAL: R$ ${order.price.toFixed(2)}

PAGAMENTO
${changeInfo}
  `.trim();
};

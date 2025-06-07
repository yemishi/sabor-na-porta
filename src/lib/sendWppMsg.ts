// lib/whatsapp.ts
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

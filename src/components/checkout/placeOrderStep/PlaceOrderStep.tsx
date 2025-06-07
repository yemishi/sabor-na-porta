"use client";

import { formatBRL } from "@/helpers";
import { Button } from "@/ui";
import { CreatedOrder } from "../hooks/useCheckout";

type Props = {
  method: string;
  removeItemById: (id: string) => void;
  totalPrice: number;
  order: CreatedOrder;
  orderStatus: "idle" | "error" | "pending" | "success";
  orderRefetch: () => void;
  status: "idle" | "fix-needed";
  setStatus: (s: "idle" | "fix-needed") => void;
  cartFixIssues: { id: string; reason: string }[];
  trackOrder: () => void;
  setCartFixIssues: (issues: { id: string; reason: string }[]) => void;
  orderError: Error;
  isSuccess?: boolean;
  isCartEmpty?: boolean;
};

export default function PlaceOrderStep({
  order,
  cartFixIssues,
  setCartFixIssues,
  setStatus,
  totalPrice,
  isSuccess,
  orderRefetch,
  orderStatus,
  trackOrder,
  status,
  method,
  isCartEmpty,
  orderError,
  removeItemById,
}: Props) {
  if (isCartEmpty) {
    return (
      <div className="w-full flex justify-center text-2xl font-bold text-black mb-2">
        <h2>Seu carrinho está vazio</h2>
      </div>
    );
  }

  const handleCopyPix = () => {
    navigator.clipboard.writeText("(83) 99364-3672");
    alert("Chave Pix copiada! 📋");
  };

  if (status === "fix-needed" && cartFixIssues.length > 0) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 font-semibold mb-4">⚠️ Seu carrinho precisa de ajustes:</p>
        <ul className="max-w-md mx-auto mb-4">
          {cartFixIssues.map((item) => (
            <li key={item.id}>- {item.reason}</li>
          ))}
        </ul>
        <Button
          onClick={() => {
            cartFixIssues.forEach((item) => removeItemById(item.id));
            setStatus("idle");
            setCartFixIssues([]);
          }}
          className="bg-black text-white px-4 py-2 scale-100 hover:bg-gray-800 transition"
        >
          Corrigir Carrinho
        </Button>
      </div>
    );
  }
  if (orderStatus === "pending") {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
        <div className="text-6xl animate-spin">🍳</div>
        <p className="text-lg font-semibold"> Preparando seu pedido… Segure firme, a cozinha está a todo vapor!</p>
        <p className="text-sm text-accent ">
          <span className="italic"> Enquanto isso, já pensa no próximo prato.</span> 😋
        </p>
      </div>
    );
  }

  if (orderError || orderStatus === "error") {
    return (
      <div className="w-full flex flex-col items-center">
        <p className="text-center text-red-600 py-8">
          ❌ {orderError?.message ?? "Falha ao realizar o pedido. Tente novamente"}.
        </p>
        <Button onClick={orderRefetch} className="bg-black text-white px-4 py-2 scale-100 hover:bg-gray-800 transition">
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto text-center p-6">
        <div className="text-5xl mb-4">✔️</div>
        <h2 className="text-xl font-bold mb-2">Recebemos seu pedido</h2>

        {method === "pix" && (
          <>
            <p className="mb-6">
              Estamos aguardando o pagamento via <strong>{method}</strong>
            </p>
            <div className="border p-4 mb-6 text-left bg-cream rounded-lg">
              <h3 className="font-semibold mb-2">🔑 Chave Pix para pagamento</h3>
              <div className="flex items-center justify-between border border-dashed rounded p-2 mb-2 bg-white">
                <span>
                  <strong>Celular:</strong> (83) 99364-3672
                </span>
                <button className="bg-black text-white px-2 py-1 rounded text-sm" onClick={handleCopyPix}>
                  COPIAR
                </button>
              </div>
              <p className="mb-1">
                <strong>Total a pagar:</strong> {formatBRL(totalPrice)}
              </p>
              <p className="mb-1">
                <strong>Favorecido:</strong> Ze da silva ze
              </p>
              <p className="text-sm text-gray-600">BANCO DO BRASIL — Enviar comprovante para confirmação do pedido</p>
            </div>
          </>
        )}

        <div className="flex flex-col gap-3">
          {method === "pix" && (
            <button
              onClick={() => window.open("https://wa.me/5583993643672", "_blank")}
              className="border border-black py-2 rounded hover:bg-black hover:text-white transition"
            >
              📎 ENVIAR COMPROVANTE
            </button>
          )}
          <Button disabled={!order} onClick={trackOrder} className="bg-black text-white py-2 rounded">
            VER PEDIDO
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

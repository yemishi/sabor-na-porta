"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate, formatBRL } from "@/helpers";
import { Button, Loading, Image } from "@/ui";
import { ErrorWrapper, Login, PopConfirm } from "@/components";
import { Order, OrderStatus, translateOrderStatus } from "@/types";
import wppIcon from "@/assets/icons/wpp.svg";
import { useSession } from "next-auth/react";
import { generateWppUrl } from "@/lib/sendWppMsg";
import emailjs from "@emailjs/browser";
import { formatCanceledOrderEmail } from "@/lib/sendEmail";

const finalStages: OrderStatus[] = ["delivered", "out_for_delivery"];

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const session = useSession();
  const userPhone = session.data?.user.phone;

  const [isPopUp, setIsPopUp] = useState(false);
  const queryClient = useQueryClient();
  const [isCancelling, setIsCancelling] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const { data, isLoading, isError, error } = useQuery<{
    order: Order;
    hasMore: boolean;
  }>({
    queryKey: ["order", id],
    enabled: !!id && !!userPhone,
    queryFn: async () => {
      const res = await fetch(`/api/order/${id}?userPhone=${userPhone}`);
      const response = await res.json();
      if (!res.ok) throw { message: response.message || "Erro ao buscar pedido." };
      return response;
    },
  });

  const cancelOrder = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/order/${id}?userPhone=${userPhone}&status=canceled`, { method: "PATCH" });
      const response = await res.json();
      if (!res.ok) throw { message: response.message || "Erro ao cancelar pedido." };
      const templateParams = {
        name: "Sabor Na porta",
        ...formatCanceledOrderEmail(response.order),
      };
      try {
        const email = await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
          templateParams,
          { publicKey: process.env.NEXT_PUBLIC_EMAILJS_USER_ID! }
        );
        console.log("EmailJS success:", email);
      } catch (err) {
        console.error("EmailJS failed to send:", err);
        return data;
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
  });

  if (isLoading || session.status === "loading") return <Loading />;
  if (isError) return <ErrorWrapper error message={error?.message} />;

  if (!userPhone)
    return (
      <div className="flex flex-col items-center pt-20 my-auto h-full text-center px-4">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Acesso negado 😢</h2>
        <p className="text-base text-gray-700 max-w-md">
          Parece que você não está logado. Para ver os detalhes do seu pedido, por favor, faça login primeiro.
        </p>
        {isLogin && <Login onClose={() => setIsLogin(false)} />}
        <Button onClick={() => setIsLogin(true)} className="mt-4">
          Ir para login
        </Button>
      </div>
    );

  const order = data?.order;
  const isFinalized = finalStages.includes(order?.status!);
  const wppUrl = generateWppUrl(
    `Olá! Gostaria de falar sobre o pedido #${order?.orderId} que está ${translateOrderStatus(
      order?.status as OrderStatus
    )}`
  );
  return (
    <div className="min-h-screen px-4 py-8 w-full flex justify-center">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <h1 className="title md:hidden">Detalhes do Pedido</h1>
        <h2 className="title hidden md:block">Detalhes do Pedido</h2>

        {isPopUp && (
          <PopConfirm
            confirm={() => {
              setIsCancelling(true);
              cancelOrder.mutate(undefined, {
                onSettled: () => setIsCancelling(false),
              });
              setIsPopUp(false);
            }}
            onClose={() => setIsPopUp(false)}
            name={order?.orderId}
            desc="Você realmente deseja cancelar o pedido"
          />
        )}

        <div className="border border-dark/10 rounded-xl p-6 shadow-md bg-card flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-xl font-semibold md:text-xl">Pedido #{order?.orderId}</h2>
            <span
              className={`text-sm md:text-lg font-medium px-2 py-1 rounded-full ${
                isFinalized
                  ? "bg-green-100 text-green-800"
                  : order?.status === "canceled"
                  ? "bg-red-400 text-white"
                  : "bg-dark text-cream"
              }`}
            >
              {translateOrderStatus(order?.status!)}
            </span>
          </div>

          <div className="text-sm md:text-base text-primary leading-relaxed">
            <p>Feito em: {formatDate(order?.createdAt as Date)}</p>
            <p>Total: {formatBRL(order?.price || 0)}</p>
          </div>

          <div>
            <h3 className="font-medium mb-1">Produtos:</h3>
            <ul className="text-sm pl-4  md:text-base list-disc text-dark space-y-1">
              {order?.products.map((item, i) => (
                <li key={i}>
                  {item.qtd}x {item.name} {item.addons?.length ? `(+${item.addons.join(", ")})` : ""}
                </li>
              ))}
            </ul>
          </div>

          {!isFinalized && order?.status !== "canceled" && (
            <div className="flex justify-end">
              <Button onClick={() => setIsPopUp(true)} disabled={isCancelling} className="bg-red-500 hover:bg-red-600">
                {isCancelling ? "Cancelando..." : "Cancelar Pedido"}
              </Button>
            </div>
          )}
        </div>

        <div className="sticky bottom-6 self-center z-10">
          <Button
            onClick={() => window.open(wppUrl, "_blank")}
            className="bg-green-600 hover:bg-green-700 flex gap-2 items-center px-5 py-3"
          >
            <Image className="size-6" src={wppIcon} alt="WhatsApp icon" />
            <span>Enviar mensagem</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

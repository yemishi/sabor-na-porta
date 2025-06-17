"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate, formatBRL, getMapLocationUrl } from "@/helpers";
import { Button, Loading, Image } from "@/ui";
import { ErrorWrapper, Login, PopConfirm } from "@/components";
import { Order, OrderStatus, translateOrderStatus } from "@/types";
import wppIcon from "@/assets/icons/wpp.svg";
import { useSession } from "next-auth/react";
import { generateWppUrl } from "@/lib/sendWppMsg";
import emailjs from "@emailjs/browser";
import { formatCanceledOrderEmail } from "@/lib/sendEmail";
import mapIcon from "@/assets/icons/map-pin.svg";
import Link from "next/link";

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
          name={`#${order?.orderId}`}
          desc="Você realmente deseja cancelar o pedido"
        />
      )}
      <div className="border border-muted rounded-xl p-6 shadow-md bg-card flex flex-col gap-6">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h2 className="text-xl font-bold text-dark md:text-2xl">Pedido #{order?.orderId}</h2>
          <span
            className={`text-sm md:text-base font-medium px-3 py-1 rounded-full ${
              isFinalized
                ? "bg-accent text-dark"
                : order?.status === "canceled"
                ? "bg-primary text-cream"
                : "bg-dark text-cream"
            }`}
          >
            {translateOrderStatus(order?.status!)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-bae md:text-lg text-dark/80">
          <p>
            <strong className="text-dark">Data:</strong> {formatDate(order?.createdAt as Date)}
          </p>
          <p>
            <strong className="text-dark">Pagamento:</strong> {order?.paymentMethod}
          </p>
          {order?.shippingFee && (
            <p>
              <strong className="text-dark">Entrega:</strong> {formatBRL(order.shippingFee)}
            </p>
          )}
          {order?.changeAmount && (
            <p>
              <strong className="text-dark">Troco para:</strong> {formatBRL(order.changeAmount)}
            </p>
          )}
          <p>
            <strong className="text-dark">Total:</strong> {formatBRL(order?.price || 0)}
          </p>
        </div>

        <div className="bg-cream border border-muted rounded-lg p-4 text-sm md:text-lg text-dark/90">
          <div className="flex justify-between">
            <h3 className="font-semibold mb-1">Endereço de entrega</h3>
            {order && (
              <Link className="bg-black p-2 rounded-full w-fit" href={getMapLocationUrl(order.address)}>
                <Image src={mapIcon} className="size-5 invert" />
              </Link>
            )}
          </div>
          <p>
            {order?.address.street}, {order?.address.houseNumber} — {order?.address.neighborhood}
          </p>
          <p>
            {order?.address.city}, CEP: {order?.address.cep}
          </p>
          {order?.address.complement && <p>Complemento: {order.address.complement}</p>}
          {order?.address.ref && <p>Referência: {order.address.ref}</p>}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base md:text-lg text-dark">Produtos:</h3>
          <ul className="flex flex-col gap-3">
            {order?.products.map((item, i) => (
              <li key={i} className="flex items-start gap-4 p-4 bg-cream border border-muted rounded-lg shadow-sm">
                <div className="size-20 md:size-24 flex-shrink-0 bg-white rounded overflow-hidden flex items-center justify-center">
                  <Image src={item.picture} alt={item.name} className="object-contain h-full" />
                </div>
                <div className="flex flex-col text-sm md:text-lg text-dark w-full">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-semibold">
                      {item.qtd}x {item.name}
                    </span>
                    <span className="font-bold text-secondary">{formatBRL(item.price)}</span>
                  </div>
                  {item.addons && item.addons.length > 0 && (
                    <p className="text-xs md:text-base text-dark/70 mt-1">
                      <span className="font-medium text-primary">Adicionais:</span>{" "}
                      {item.addons.map(({ title, options }, idx) => (
                        <span key={title}>
                          {title} (
                          {options.map((o, i) => (
                            <span key={o.name}>
                              {o.name}
                              {i < options.length - 1 ? ", " : ""}
                            </span>
                          ))}
                          ){item.addons && idx < item.addons.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                  )}
                  {item.obs && (
                    <div className="mt-2 px-3 py-2 text-sm italic text-yellow-900 bg-card border-l-4 border-yellow-400 rounded">
                      Observação: {item.obs}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {!isFinalized && order?.status !== "canceled" && (
          <div className="flex justify-end">
            <Button
              onClick={() => setIsPopUp(true)}
              disabled={isCancelling}
              className="bg-primary hover:bg-primary/80 text-cream"
            >
              {isCancelling ? "Cancelando..." : "Cancelar Pedido"}
            </Button>
          </div>
        )}
        <div className=" self-center ">
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

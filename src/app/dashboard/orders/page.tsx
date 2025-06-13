"use client";

import { useScrollQuery } from "@/hooks";
import { Order, OrderStatus, User, translateOrderStatus } from "@/types";
import { formatBRL, formatDate } from "@/helpers";
import { Button, Loading, Select } from "@/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { useDashboardQuery } from "../context/DashboardProvider";
import { useSession } from "next-auth/react";
import { PopConfirm } from "@/components";

const statusOptions: OrderStatus[] = ["pending", "in_progress", "out_for_delivery", "delivered", "canceled"];

export default function PageWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardOrdersPage />
    </Suspense>
  );
}

function DashboardOrdersPage() {
  interface ResponseType extends Order {
    user: User;
  }

  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const { query } = useDashboardQuery();
  const { data, status: userStatus } = useSession();
  const [isDeleteOrder, setIsDeleteOrder] = useState("");

  const {
    values: orders,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    ref,
  } = useScrollQuery<ResponseType>({
    url: `/api/orders?q=${query}&status=${selectedStatus || ""}`,
    queryKey: ["dashboard-orders", selectedStatus, query],
    enabled: !!data?.user,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const res = await fetch(`/api/order/${id}?status=${status}&userPhone=${data?.user.phone}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-orders", selectedStatus] });
    },
  });

  const deleteOrder = useMutation({
    mutationFn: async (id: string) => {
      const payload = { id };
      const res = await fetch(`/api/order/${id}`, {
        method: "DELETE",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to delete order");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-orders", selectedStatus, query] });
    },
  });
  if (isLoading || userStatus === "loading") return <Loading isPage />;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {isDeleteOrder && (
        <PopConfirm
          confirm={() => {
            deleteOrder.mutate(isDeleteOrder);
            setIsDeleteOrder("");
          }}
          onClose={() => setIsDeleteOrder("")}
        />
      )}
      <h1 className="text-2xl font-bold mb-6">Pedidos</h1>

      <div className="mb-6">
        <label className="mr-2 font-medium">Filtrar por status:</label>
        <Select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | "")}
          className="bg-card w-52"
        >
          <option value="">Todos</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {translateOrderStatus(status)}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-6">
        {orders.map((order, i) => (
          <div key={`${order.id}_${i}`} className="border rounded-xl p-4 bg-card shadow-sm relative">
            <Button
              onClick={() => {
                setIsDeleteOrder(order.id);
              }}
              className="bg-red-500 px-4 py-1 hover:bg-red-600 absolute right-3 top-2"
            >
              Deletar
            </Button>

            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              {/* LEFT SIDE */}
              <div className="flex-1 flex flex-col gap-2 md:text-lg">
                <div>
                  <p className="font-semibold text-lg md:text-xl">Pedido #{order.orderId}</p>
                  <p className="font-semibold text-lg md:text-xl">
                    Método: {order.paymentMethod}{" "}
                    {order.changeAmount ? `— Troco para: ${formatBRL(order.changeAmount)}` : ""}
                  </p>
                </div>

                <p>
                  {formatDate(order.createdAt)} — <strong>{formatBRL(order.price)}</strong>
                </p>

                <p>
                  Cliente:
                  <span className="font-medium uppercase md:text-xl ml-1">
                    {order.user.name} — {order.user.phone}
                  </span>
                </p>

                <div className="flex flex-col space-y-1 font-medium">
                  <p>
                    Endereço:
                    <span className="text-primary uppercase md:text-xl ml-1">{order.address.street}</span>, Nº{" "}
                    <span className="text-primary uppercase md:text-xl ml-1">{order.address.houseNumber}</span>
                  </p>
                  <p>
                    Bairro:<span className="text-primary uppercase ml-1">{order.address.neighborhood}</span>
                    {order.address.complement && (
                      <>
                        {" "}
                        — Complemento:
                        <span className="text-primary md:text-xl uppercase ml-1">{order.address.complement}</span>
                      </>
                    )}
                  </p>

                  {order.address.ref && (
                    <p>
                      Ponto de referência:<span className="text-primary uppercase ml-1">{order.address.ref}</span>
                    </p>
                  )}
                </div>

                <div className="mt-4 border-t border-dark/10 pt-4 flex flex-col gap-3">
                  {order.products.map((product: any) => (
                    <div
                      key={product.id}
                      className="bg-cream p-4 rounded-lg shadow-sm border border-dark/5 flex flex-col gap-1"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-base md:text-lg font-semibold text-dark">
                          🧺 {product.qtd}x {product.name}
                        </p>
                        <p className="text-sm text-dark/70">
                          {formatBRL(product.price)} <span className="text-dark">cada</span>
                        </p>
                      </div>

                      {product.addons?.length > 0 && (
                        <p className="text-sm text-dark/80">
                          ➕ <span className="font-medium text-primary">Adicionais:</span>{" "}
                          <span className="italic">{product.addons.join(", ")}</span>
                        </p>
                      )}

                      {product.obs && (
                        <p className="text-sm text-dark/80">
                          📝 <span className="font-medium text-primary">Observações:</span>{" "}
                          <span className="italic">{product.obs}</span>
                        </p>
                      )}

                      <div className="text-right text-sm font-semibold text-dark mt-2">
                        💰 Subtotal: {formatBRL(product.qtd * product.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col self-center sm:items-center gap-3">
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full text-center min-w-[120px]
              ${
                order.status === "delivered"
                  ? "bg-green-100 text-green-800"
                  : order.status === "canceled"
                  ? "bg-red-400 text-white"
                  : "bg-dark/50 text-cream"
              }`}
                >
                  {translateOrderStatus(order.status)}
                </span>

                <Select
                  value={order.status}
                  onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value as OrderStatus })}
                  className="min-w-[160px]"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {translateOrderStatus(s)}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        ))}
        {isFetchingNextPage && <Loading isPage={false} />}
        {!isFetchingNextPage && hasNextPage && <div ref={ref} />}
      </div>
    </div>
  );
}

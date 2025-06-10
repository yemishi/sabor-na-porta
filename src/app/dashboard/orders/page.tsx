



export default function Page(){
  return <div>
    
  </div>
}


/* "use client";

import { useScrollQuery } from "@/hooks";
import { Order, OrderStatus, User, translateOrderStatus } from "@/types";
import { formatBRL, formatDate } from "@/helpers";
import { Button, Loading, Select } from "@/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { useDashboardQuery } from "../context/DashboardProvider";
import { useSession } from "next-auth/react";

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

  if (isLoading || userStatus === "loading") return <Loading isPage />;

  return (
    <div className="p-4 max-w-6xl mx-auto">
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
          <div key={`${order.id}_${i}`} className="border rounded-xl p-4 bg-card shadow-sm">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold text-lg">Pedido #{order.orderId}</p>
                <p className="text-sm mt-1">
                  {formatDate(order.createdAt)} — <strong>{formatBRL(order.price)}</strong>
                </p>
                <p className="text-sm mt-1">
                  Cliente: {order.user.name} — {order.user.phone}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row self-center sm:items-center gap-2 md:gap-4">
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
 */
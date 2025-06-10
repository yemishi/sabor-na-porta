"use client";


export default function Page(){
  return <div>
    
  </div>
}

/* import { Loading } from "@/ui";
import { formatBRL, formatDate } from "@/helpers";
import { Order, OrderStatus, translateOrderStatus } from "@/types";
import { useSession } from "next-auth/react";
import { ErrorWrapper } from "@/components";
import { useScrollQuery } from "@/hooks";
import Link from "next/link";
import { useState } from "react";
import { Select } from "@/ui";

const statusOptions: OrderStatus[] = ["pending", "in_progress", "out_for_delivery", "delivered", "canceled"];
const finalStages: OrderStatus[] = ["delivered", "out_for_delivery"];
export default function Page() {
  const session = useSession();
  const userPhone = session.data?.user.phone;
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");

  const {
    values: orders,
    isLoading,
    isError,
    ref,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useScrollQuery<Order>({
    url: `/api/orders?userPhone=${userPhone}&status=${selectedStatus}`,
    queryKey: ["orders", userPhone || "", selectedStatus],
    enabled: !!userPhone,
  });

  if (!userPhone) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <p className="text-lg text-muted">Você precisa estar logado para ver seus pedidos.</p>
      </div>
    );
  }

  if (isLoading) return <Loading isPage />;

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">
      <h1 className="title">Meus Pedidos</h1>

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

      <ErrorWrapper error={isError} message={error?.message}>
        {orders.length === 0 ? (
          <p className="text-muted text-center">Você ainda não fez nenhum pedido 😕</p>
        ) : (
          <div className="space-y-4">
            {orders.map(({ status, id, orderId, price, products, createdAt }) => {
              const isFinalized = finalStages.includes(status);
              const statusClass =
                status === "canceled"
                  ? "bg-red-400 text-white"
                  : isFinalized
                  ? "bg-green-100 text-green-800"
                  : "bg-dark text-cream";

              return (
                <div key={id} className="border border-dark/10 rounded-xl p-4 shadow-sm bg-card flex flex-col gap-3">
                  <div className="flex flex-wrap justify-between items-center gap-y-2">
                    <h2 className="font-semibold text-lg md:text-xl">Pedido #{orderId}</h2>
                    <span className={`text-xs md:text-sm font-medium px-2 py-1 rounded-full ${statusClass}`}>
                      {translateOrderStatus(status)}
                    </span>
                  </div>

                  <div className="text-sm md:text-base text-primary leading-snug">
                    <p>Feito em: {formatDate(createdAt)}</p>
                    <p>Total: {formatBRL(price)}</p>
                  </div>

                  {products?.length > 0 && (
                    <ul className="text-sm md:text-base text-dark pl-4 list-disc space-y-0.5">
                      {products.map((item: any, i: number) => (
                        <li key={i}>
                          {item.qtd}x {item.name}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link
                    href={`/order/${id}`}
                    className="self-center mt-2 md:self-end px-4 py-2 text-center bg-accent hover:bg-accent-dark text-white rounded-lg font-medium transition-all
                     active:scale-95"
                  >
                    Detalhes do pedido
                  </Link>
                </div>
              );
            })}
          </div>
        )}
        {isFetchingNextPage && <Loading isPage={false} />}
        {!isFetchingNextPage && hasNextPage && <div ref={ref} />}
      </ErrorWrapper>
    </div>
  );
}
 */
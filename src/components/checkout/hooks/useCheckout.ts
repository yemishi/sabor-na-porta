import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCart } from "@/hooks";
import { User } from "@/types";
import { useState } from "react";

type Props = {
  paymentMethod: string;
  sessionPhone?: string;
  changeAmount?: string;
};
export type CreatedOrder = {
  orderId: string;
  price: number;
  paymentMethod: string;
};

export function useCheckout({ sessionPhone, paymentMethod, changeAmount }: Props) {
  const queryClient = useQueryClient();
  const { getCartTotalPrice, cart, removeItemById, clearCart } = useCart({});
  const totalPrice = getCartTotalPrice();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [cartFixIssues, setCartFixIssues] = useState<{ id: string; reason: string }[]>([]);
  const [status, setStatus] = useState<"idle" | "fix-needed">("idle");

  const fetchUser = async (phone: string | undefined) => {
    if (!phone) throw new Error("No phone number provided");
    const res = await fetch(`/api/users?phone=${phone}`);
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  };

  const userQuery = useQuery<{ message: string; user: User }>({
    queryKey: ["user", sessionPhone],
    queryFn: () => fetchUser(sessionPhone),
    enabled: !!sessionPhone,
  });

  const placeOrderMutation = useMutation({
    mutationFn: async (): Promise<CreatedOrder> => {
      if (!userQuery.data) throw new Error("User not loaded");

      const newOrder = {
        address: userQuery.data.user.address,
        user: {
          name: userQuery.data.user.name,
          userId: userQuery.data.user.id,
          phone: userQuery.data.user.phone,
        },
        products: cart.map((p) => ({
          id: p.id,
          picture: p.picture,
          name: p.name,
          variantId: p.variantId,
          qtd: p.qtd,
          addons: p.addons ?? [],
        })),
        paymentMethod,
        changeAmount,
        shippingFee: totalPrice < 10 ? 2.0 : null,
      };
      console.log("Creating order...");
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      const data = await res.json();
      if (!res.ok) {
        throw {
          message: data.message || "Order failed",
          code: data.code,
          issues: data.issues,
        };
      }

      setOrderPlaced(true);
      setStatus("idle");
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      console.log("Order created successfully.");
      clearCart();
      setCartFixIssues([]);
    },
    onError: (error: any) => {
      if (error.code === 409 && error.issues) {
        console.log("Failed to place order.");
        setCartFixIssues(error.issues);
        setStatus("fix-needed");
      }
    },
  });

  return {
    user: userQuery.data?.user,
    userLoading: userQuery.isLoading,
    cart,
    totalPrice,
    removeItemById,
    clearCart,
    placeOrder: placeOrderMutation.mutate,
    orderError: placeOrderMutation.error,
    orderStatus: placeOrderMutation.status,
    orderPlaced,
    status,
    orderData: placeOrderMutation.data,
    orderRefetch: () => {
      placeOrderMutation.reset();
      setStatus("idle");
      setCartFixIssues([]);
      placeOrderMutation.mutate();
    },
    refetchUser: userQuery.refetch,

    cartFixIssues,
    setCartFixIssues,
    setStatus,
  };
}

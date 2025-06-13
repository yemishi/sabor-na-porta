import emailjs from "@emailjs/browser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCart } from "@/hooks";
import { Cart, User } from "@/types";
import { useState } from "react";
import { Order } from "@/types";
import { formatOrderEmail } from "@/lib/sendEmail";

type Props = {
  paymentMethod: string;
  sessionPhone?: string;
  changeAmount?: string;
};

export function useCheckout({ sessionPhone, paymentMethod, changeAmount }: Props) {
  const queryClient = useQueryClient();
  const { getCartTotalPrice, cart, removeItemById, clearCart } = useCart({});
  const totalPrice = getCartTotalPrice();
  const [cartSnapshot, setCartSnapshot] = useState<Cart>(cart);
  const [priceSnapshot, setPriceSnapshot] = useState(totalPrice < 10 ? totalPrice + 2.0 : totalPrice);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
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
    mutationFn: async (): Promise<{ order: Order }> => {
      if (!userQuery.data) throw new Error("User not loaded");

      setCartSnapshot([...cart]);
      setPriceSnapshot(totalPrice);

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
          obs: p.obs,
          addons: p.addons ?? [],
        })),
        paymentMethod,
        changeAmount,
        shippingFee: totalPrice < 10 ? 2.0 : null,
      };
      setIsPlacing(true);
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });
      setIsPlacing(false);

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
      const formattedDate = new Date(data.order.createdAt).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      });
      console.log(formattedDate);
      const templateParams = {
        formattedDate,
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
    cart: cartSnapshot,
    totalPrice: priceSnapshot,
    removeItemById,
    clearCart,
    placeOrder: placeOrderMutation.mutate,
    orderError: placeOrderMutation.error,
    orderStatus: placeOrderMutation.status,
    orderPlaced,
    isPlacing,
    status,
    orderData: placeOrderMutation.data?.order,
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

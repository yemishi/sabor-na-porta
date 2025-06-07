"use client";
import { Cart } from "@/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { createContext, ReactNode, useContext, useState } from "react";
const queryClient = new QueryClient();

const CartContext = createContext<{
  cart: Cart;
  setCart: (cart: Cart) => void;
} | null>(null);

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within a CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart>([]);

  return <CartContext value={{ cart, setCart }}>{children}</CartContext>;
};

export default function Provider({ children, session }: { children: React.ReactNode; session: Session | null }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <SessionProvider session={session}>{children}</SessionProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

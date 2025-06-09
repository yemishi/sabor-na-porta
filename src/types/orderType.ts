import { Address, User } from "@/types";

export type Order = {
  id: string;
  orderId: string;
  address: Address;
  price: number;
  createdAt: Date; // or string if from API
  paymentMethod: string;
  products: OrderProduct[];
  changeAmount?: number;
  status: OrderStatus;
  shippingFee?: number;
  user?: User;
};

export type OrderProduct = {
  id: string;
  picture: string;
  name: string;
  qtd: number;
  price: number;
  obs?: string;
  addons?: string[];
};

export type OrderStatus = "pending" | "in_progress" | "out_for_delivery" | "delivered" | "canceled";

export const ORDER_STATUS_TRANSLATIONS: Record<OrderStatus, string> = {
  pending: "Pendente",
  in_progress: "Em preparo",
  out_for_delivery: "Saiu para entrega",
  delivered: "Entregue",
  canceled: "Cancelado",
};

export function translateOrderStatus(status: OrderStatus): string {
  return ORDER_STATUS_TRANSLATIONS[status] ?? "Status desconhecido";
}
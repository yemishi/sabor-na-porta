import { Address } from "@/types";

export type Order = {
  id: string;
  orderId: string;
  address: Address;
  price: Number;
  paymentMethod: string;
  products: OrderProduct;
  changeAmount?: number;
  shippingFee?: number;
};

export type OrderProduct = {
  push(arg0: { id: any; picture: any; name: any; price: number; addons: any; }): unknown;
  id: string;
  picture: string;
  name: string;
  price: number;
  addons?: string[];
};

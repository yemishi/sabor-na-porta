import { AddOn } from "./productType";

export type Cart = CartProduct[];

export type CartProduct = {
  id: string;
  picture: string;
  name: string;
  variantId: string;
  qtd: number;
  price: number;
  promotion: number;
  priceTotal: number;
  addons?: AddOn[];
  obs?: string;
};

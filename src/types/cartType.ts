import { OrderAddons } from "./orderType";

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
  addons?: OrderAddons[];
  obs?: string;
};

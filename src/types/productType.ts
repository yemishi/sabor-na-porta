export type Product = {
  id: string;
  name: string;
  picture: string;
  category: string;
  variants: ProductVariant[];
  highlights?: string[];
};

export type ProductVariant = {
  id: string;
  name: string;
  stock: number;
  price: number;
  desc: string;
  addons: AddOnGroup[];
  promotion?: number;
};

export type AddOnGroup = {
  title: string;
  type: "single" | "multiple";
  required: boolean;
  options: AddOn[];
};

export type AddOn = {
  name: string;
  price: number;
};

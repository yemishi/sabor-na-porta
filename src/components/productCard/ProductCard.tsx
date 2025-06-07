"use client";
import { formatBRL } from "@/helpers";
import { Product, ProductVariant } from "@/types";
import { Image } from "@/ui";

import cartIcon from "@/assets/icons/cart.svg";
import AddToCartModal from "../modal/addToCartModal/AddToCartModal";
import { useState } from "react";
type Props = {
  product: Product;
  variant: ProductVariant;
};

export default function ProductCard({ product, variant }: Props) {
  const [modalProduct, setModalProduct] = useState<Product | false>(false);
  return (
    <div
      className="flex flex-col gap-3 border-primary-200 min-[385]:w-50 h-67 relative "
      key={`${product.id}_${product.name}`}
    >
      {modalProduct && (
        <AddToCartModal variant={variant} onClose={() => setModalProduct(false)} product={modalProduct} />
      )}
      <Image src={product.picture} className="h-38 w-full absolute z-0 top-0  hover:scale-110" />

      <div className=" bg-card h-full mt-20  pt-18 flex flex-col gap-2  pl-2 pr-1 rounded-xl">
        <div className="flex flex-col">
          <span className="font-medium first-letter:uppercase text-lg line-clamp-2">
            {product.name} - {variant.name}
          </span>
          <span className="font-medium text-primary text-sm first-letter:uppercase line-clamp-2">{variant.desc}</span>
        </div>
        <Image
          onClick={() => setModalProduct(product)}
          src={cartIcon}
          className="size-8 mt-auto mb-7 mx-auto bg-accent p-1.5 rounded-full"
        />
      </div>
      <div className="flex gap-1 font-semibold absolute -bottom-2.5 left-2/4 -translate-x-2/4 bg-primary px-2 py-1 rounded-full">
        <span className="text-white">{formatBRL(variant.promotion ? variant.promotion : variant.price)}</span>
        {variant.promotion && (
          <span className="text-xs line-through absolute top-0 -right-12 text-accent">{formatBRL(variant.price)}</span>
        )}
      </div>
    </div>
  );
}

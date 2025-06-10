"use client";
import { formatBRL } from "@/helpers";
import { Product, ProductVariant } from "@/types";
import { Image } from "@/ui";
import cartIcon from "@/assets/icons/cart.svg";
import AddToCartModal from "../modal/addToCartModal/AddToCartModal";
import { HTMLAttributes, useState } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  product: Product;
  variant: ProductVariant;
}

export default function ProductCard({ product, variant, ...props }: Props) {
  const [modalProduct, setModalProduct] = useState<Product | false>(false);
  const { className = "" } = props;
  const isOutOfStock = !variant.stock;
  return (
    <div
      className={`${className} relative flex flex-col md:flex-row gap-3 max-[400]:mx-auto max-[400]:w-full min-[400]:w-44 min-[480]:w-52 h-67 md:h-auto md:w-full border
       rounded-xl md:pt-3 md:rounded-none`}
      onClick={() => {
        if (!isOutOfStock) setModalProduct(product);
      }}
      key={`${product.id}_${product.name}`}
    >
      {modalProduct && (
        <AddToCartModal variant={variant} onClose={() => setModalProduct(false)} product={modalProduct} />
      )}
      {isOutOfStock && (
        <div className="absolute inset-0 z-1 bg-black/40 backdrop-blur rounded-xl flex items-center justify-center text-center p-4">
          <div>
            <p className="mt-1 absolute top-0 left-2/4 -translate-x-2/4 font-medium text-white/70">
              {product.name} - {variant.name}
            </p>
            <p className="text-lg md:text-2xl text-red-500 rotate-6 font-semibold">Fora de estoque</p>
          </div>
        </div>
      )}

      <div className="w-full absolute -top-5 md:static h-38 object-contain hover:scale-105 transition md:w-52 md:h-36 md:bg-cream p-1 rounded-xl">
        <Image src={product.picture} className=" object-contain size-full" />
      </div>

      <div className="flex flex-col pt-10 mt-auto justify-between p-3 bg-card rounded-xl md:rotate-none md:bg-transparent md:mt-0  md:p-2 w-full">
        <div className="flex flex-col gap-2 md:my-auto ">
          <div className="flex flex-col md:flex-row md:items-center md:gap-2">
            <span className="text-lg md:text-xl lg:text-2xl font-semibold capitalize line-clamp-1 md:line-clamp-2">
              {product.name}
            </span>

            <span className="text-base md:text-xl lg:text-2xl text-primary md:text-secondary font-medium md:font-semibold capitalize line-clamp-1">
              {variant.name}
            </span>
          </div>
          <span className="text-sm sm:text-base md:text-lg line-clamp-1 md:line-clamp-2">{variant.desc}</span>
        </div>

        <div className="flex justify-between items-center mt-2 md:mt-2">
          <div className="flex-col text-primary  font-semibold hidden md:flex md:text-xl sm:text-secondary sm:text-lg text-base">
            <span>{formatBRL(variant.promotion || variant.price)}</span>
            {variant.promotion && <span className="text-sm text-muted line-through">{formatBRL(variant.price)}</span>}
          </div>

          <button
            className={`flex mx-auto md:mx-0 mb-2 md:mb-0 items-center justify-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2 transition-all 
                font-medium bg-accent md:bg-secondary text-white hover:brightness-110`}
          >
            <Image src={cartIcon} className={`w-5 h-5 ${isOutOfStock ? "" : "md:invert md:brightness-0"}`} />
            <span className="hidden md:inline text-sm cursor-pointer">Adicionar</span>
          </button>
        </div>

        {!isOutOfStock && (
          <div className="md:hidden flex gap-1 font-semibold absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-primary px-2 py-1 rounded-full ">
            <span className="text-white">{formatBRL(variant.promotion || variant.price)}</span>
            {variant.promotion && (
              <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 font-medium rounded-full absolute top-0 -right-13">
                {formatBRL(variant.price)}
                <span className="absolute left-2 top-1/2 w-12 h-[1px] bg-red-500 rotate-[-20deg]"></span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

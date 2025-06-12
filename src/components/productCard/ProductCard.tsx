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
      className={`${className} ${
        variant.promotion ? "glow-shadow" : ""
      } relative rounded-2xl flex flex-col md:flex-row gap-3 max-[400]:mx-auto max-[400]:w-52 min-[400]:w-auto min-[480]:w-52
       h-67 md:h-auto md:w-full border md:pt-3 md:rounded-none`}
      onClick={() => {
        if (!isOutOfStock) setModalProduct(product);
      }}
      key={`${product.id}_${product.name}`}
    >
      {modalProduct && (
        <AddToCartModal variant={variant} onClose={() => setModalProduct(false)} product={modalProduct} />
      )}
      {isOutOfStock && (
        <div className="absolute inset-0 z-1 bg-black/40 backdrop-blur rounded-2xl flex items-center justify-center text-center p-4">
          <div>
            <h3 className="mt-1 absolute top-0 left-2/4 -translate-x-2/4 font-medium text-background">
              {product.name} - {variant.name}
            </h3>
            <p className="text-lg md:text-2xl text-secondary rotate-6 font-semibold">Fora de estoque</p>
          </div>
        </div>
      )}

      <div className="w-full absolute -top-5 md:static h-38 object-contain hover:scale-105 transition md:w-52 md:h-36 md:bg-cream p-1 rounded-2xl">
        <Image src={product.picture} alt={product.name} className=" object-contain size-full" />
      </div>

      <div className="flex flex-col h-3/4 md:h-auto pt-14 mt-auto pb-10 md:pb-2 justify-between p-3 bg-card rounded-2xl md:rotate-none md:bg-transparent md:mt-0  md:p-2 w-full">
        <div className="flex flex-col gap-2 md:my-auto ">
          <div className="flex flex-col md:gap-2">
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold capitalize line-clamp-2">{product.name}</h3>

            <span className="text-sm md:text-lg lg:text-xl text-primary md:text-secondary font-medium md:font-semibold capitalize line-clamp-2">
              {product.variants.map((v) => v.name).join(", ")}
            </span>
          </div>
          <h4 className="text-xs sm:text-base md:text-lg line-clamp-2">{variant.desc}</h4>
        </div>

        <div className="md:flex justify-between items-center mt-2 md:mt-2 hidden">
          <div className="text-primary font-semibold gap-2 flex text-xl sm:text-secondary sm:text-lg ">
            <span>{formatBRL(variant.promotion || variant.price)}</span>
            {variant.promotion && (
              <span className="text-base text-red-500/70 mt-auto font-medium line-through">
                {formatBRL(variant.price)}
              </span>
            )}
          </div>

          <button
            className="flex items-center justify-center gap-2 rounded-full px-4 py-2 transition-all 
                font-medium bg-secondary text-black hover:brightness-110"
          >
            <Image src={cartIcon} className="size-5 brightness-0" />
            <span className="inline text-sm cursor-pointer">Adicionar</span>
          </button>
        </div>

        {!isOutOfStock && (
          <div className="md:hidden flex gap-1 font-semibold absolute -bottom-2.5 left-1/2 w-3/4 justify-center -translate-x-1/2 bg-primary px-2 py-1 rounded-full ">
            <span className="text-white">{formatBRL(variant.promotion || variant.price)}</span>
            {variant.promotion && (
              <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 font-medium rounded-full absolute top-0  -right-5">
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

"use client";

import { useCart } from "@/hooks";
import { formatBRL } from "@/helpers";
import { Button, Image } from "@/ui";
import { useEffect, useRef, useState } from "react";
import bag from "@/assets/icons/bag.svg";
import exit from "@/assets/icons/exit.svg";
import { Checkout } from "@/components";

export default function Cart() {
  const [isCart, setIsCart] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest("#modal")) return;
      if (isCart && ref.current && !ref.current.contains(target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    if (isCart) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCart]);

  const { cart, getCartTotalPrice, removeItem } = useCart({});
  const onClose = () => setIsCart(false);
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <div ref={ref}>
      {isCheckout && (
        <Checkout
          onClose={() => {
            setIsCheckout(false);
            setIsCart(false);
          }}
        />
      )}
      <button
        onClick={() => setIsCart(!isCart)}
        aria-label="Toggle cart"
        className="cursor-pointer hover:brightness-110"
      >
        <Image src={bag} className="size-9" />
      </button>
      {isCart && (
        <div
          className="absolute top-15 left-0 md:right-0 md:left-auto md:max-w-96 w-full md:w-auto h-[calc(100dvh-52px)] md:h-auto 
              pt-4 border border-dark/20 rounded-lg shadow-lg bg-background
             grid grid-rows-[auto_1fr_auto]"
        >
          {!cart.length ? (
            <div className="flex flex-col justify-center h-full text-center px-4 py-6">
              <button
                onClick={onClose}
                className="size-8 ml-auto cursor-pointer active:scale-95 hover:scale-105 transition-all"
              >
                <Image src={exit} />
              </button>
              <span className="self-center">
                <h2 className="text-2xl font-bold text-primary mb-2">Seu carrinho está vazio</h2>
                <p className="text-muted">Adicione alguns itens deliciosos antes de continuar 😋</p>
              </span>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center px-2">
                <span className="flex flex-col ">
                  <h2 className="text-2xl font-bold text-primary">Seu Carrinho</h2>
                  <span className="text-xl font-bold text-secondary ml-">Total: {formatBRL(getCartTotalPrice())}</span>

                  {!(getCartTotalPrice() >= 10) && (
                    <span className="text-sm text-muted">+ R$2 de frete (grátis a partir de R$10)</span>
                  )}
                </span>
                <button
                  onClick={onClose}
                  className="size-8 ml-auto cursor-pointer active:scale-95 hover:scale-105 transition-all"
                >
                  <Image src={exit} />
                </button>
              </div>

              <div className="overflow-y-auto  p-2">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[auto_1fr_auto] gap-3 border-b border-dark/30 py-4 items-center"
                  >
                    <Image src={item.picture} className="object-cover size-22 rounded-md" alt={item.name} />

                    <div className="flex flex-col justify-between  ml-5">
                      <span className="font-medium text-lg">{item.name}</span>
                      <p className="text-sm text-primary">{item.name}</p>

                      {item.addons && item.addons?.length > 0 && (
                        <p className="text-sm text-accent">Extras: {item.addons.map((a) => a.name).join(", ")}</p>
                      )}
                      {item.obs && <p className="text-sm italic text-dark line-clamp-2 ">Obs: {item.obs}</p>}

                      <span className="text-lg font-semibold text-primary">{formatBRL(item.priceTotal)}</span>
                      <p className="text-sm font-semibold text-muted">Qtd: {item.qtd}</p>
                    </div>

                    <Button className="mt-auto" onClick={() => removeItem(item)}>
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}

          <Button
            onClick={() => setIsCheckout(true)}
            disabled={!cart.length}
            className="mt-auto md:rounded-b-xl scale-100"
          >
            Continuar
          </Button>
        </div>
      )}
    </div>
  );
}

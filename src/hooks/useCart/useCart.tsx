"use client";
import { useEffect } from "react";
import { AddOn, CartProduct, Product, ProductVariant } from "@/types";
import { useCartContext } from "@/context/Provider";

type Props = {
  product?: Product;
  variant?: ProductVariant;
};
const useCart = ({ product, variant }: Props) => {
  const { cart, setCart } = useCartContext();

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (product: Omit<CartProduct, "priceTotal">) => {
    const existingIndex = cart.findIndex(
      (item) =>
        item.id === product.id &&
        item.variantId === product.variantId &&
        JSON.stringify(item.addons) === JSON.stringify(product.addons)
    );

    if (existingIndex !== -1) {
      const updatedCart = [...cart];
      const existing = updatedCart[existingIndex];
      const priceTotal =
        existing.priceTotal +
        (product.price * product.qtd + (product.addons?.reduce((sum, a) => sum + a.price, 0) ?? 0));
      updatedCart[existingIndex] = {
        ...existing,
        qtd: existing.qtd + product.qtd,
        obs: product.obs ?? existing.obs,
        addons: product.addons ?? existing.addons,
        priceTotal,
      };
      setCart(updatedCart);
    } else {
      const priceTotal =
        (product.promotion ?? product.price) * product.qtd +
        (product.addons?.reduce((sum, a) => sum + a.price, 0) ?? 0);
      setCart([...cart, { ...product, priceTotal }]);
    }
  };

  const updateQuantity = (product: CartProduct, newQtd: number) => {
    if (newQtd <= 0) {
      removeItem(product);
      return;
    }

    const updatedCart = cart.map((item) =>
      item === product
        ? {
            ...item,
            qtd: newQtd,
            priceTotal: (item.price + (item.addons?.reduce((sum, a) => sum + a.price, 0) ?? 0)) * newQtd,
          }
        : item
    );

    setCart(updatedCart);
  };

  const removeItem = (product: CartProduct) => setCart(cart.filter((item) => item !== product));

  const clearCart = () => setCart([]);

  const areAddonsEqual = (a?: AddOn[], b?: AddOn[]) => {
    if (!a && !b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;

    const sortBy = (arr: AddOn[]) => [...arr].sort((x, y) => x.name.localeCompare(y.name) || x.price - y.price);

    const aSorted = sortBy(a);
    const bSorted = sortBy(b);

    return aSorted.every((addon, i) => {
      return addon.name === bSorted[i].name && addon.price === bSorted[i].price;
    });
  };

  const getCartTotalPrice = () => cart.reduce((total, item) => total + item.priceTotal, 0);
  const getQuantity = (variantToCheck: ProductVariant, addons: AddOn[] = []) => {
    if (!product || !variantToCheck) return 0;

    return cart
      .filter(
        (item) => item.id === product.id && item.variantId === variantToCheck.id && areAddonsEqual(item.addons, addons)
      )
      .reduce((sum, item) => sum + item.qtd, 0);
  };

  const removeItemById = (id: string) => {
    const updatedCart = cart.filter((i) => i.id !== id);
    setCart(updatedCart);
  };

  const getObs = (addons?: AddOn[]) => {
    if (!product || !variant) return null;

    const match = cart.find(
      (item) => item.id === product.id && item.variantId === variant.id && areAddonsEqual(item.addons, addons)
    );

    return match?.obs ?? "";
  };
  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotalPrice,
    removeItemById,
    getQuantity,
    getObs,
  };
};

export default useCart;

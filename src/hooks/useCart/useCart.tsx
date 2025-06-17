"use client";
import { useEffect } from "react";
import { AddOn, CartProduct, OrderAddons, Product, ProductVariant } from "@/types";
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

  const getAddonsTotalPrice = (addons?: OrderAddons[]) => {
    return (
      addons?.reduce((groupSum, group) => {
        return groupSum + group.options.reduce((optSum, opt) => optSum + opt.price, 0);
      }, 0) ?? 0
    );
  };
  const addItem = (product: Omit<CartProduct, "priceTotal">) => {
    const existingIndex = cart.findIndex(
      (item) =>
        item.id === product.id && item.variantId === product.variantId && areAddonsEqual(item.addons, product.addons)
    );

    if (existingIndex !== -1) {
      const updatedCart = [...cart];
      const existing = updatedCart[existingIndex];
      const priceTotal = existing.priceTotal + (product.price * product.qtd + getAddonsTotalPrice(product.addons));

      updatedCart[existingIndex] = {
        ...existing,
        qtd: existing.qtd + product.qtd,
        obs: product.obs ?? existing.obs,
        addons: product.addons ?? existing.addons,
        priceTotal,
      };
      setCart(updatedCart);
    } else {
      const priceTotal = (product.promotion ?? product.price) * product.qtd + getAddonsTotalPrice(product.addons);
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
            priceTotal: (item.price + getAddonsTotalPrice(item.addons)) * newQtd,
          }
        : item
    );

    setCart(updatedCart);
  };

  const removeItem = (product: CartProduct) => setCart(cart.filter((item) => item !== product));

  const clearCart = () => setCart([]);
  const areAddonsEqual = (a?: OrderAddons[], b?: OrderAddons[]) => {
    if (!a && !b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;

    const sortAddOnOptions = (addons: AddOn[]) =>
      [...addons].sort((x, y) => x.name.localeCompare(y.name) || x.price - y.price);

    const sortedA = [...a].sort((x, y) => x.title.localeCompare(y.title));
    const sortedB = [...b].sort((x, y) => x.title.localeCompare(y.title));

    return sortedA.every((groupA, index) => {
      const groupB = sortedB[index];
      if (groupA.title !== groupB.title) return false;

      const optionsA = sortAddOnOptions(groupA.options);
      const optionsB = sortAddOnOptions(groupB.options);

      if (optionsA.length !== optionsB.length) return false;

      return optionsA.every((opt, i) => opt.name === optionsB[i].name && opt.price === optionsB[i].price);
    });
  };

  const getCartTotalPrice = () => cart.reduce((total, item) => total + item.priceTotal, 0);
  const getQuantity = (variantToCheck: ProductVariant, addons: OrderAddons[] = []) => {
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

  const getObs = (addons?: OrderAddons[]) => {
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

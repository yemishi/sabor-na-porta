import { useEffect, useState } from "react";
import { AddOn, CartProduct, Product, ProductVariant } from "@/types";
import { Modal } from "@/components";
import { Button, Image, InputNumber, Select } from "@/ui";
import { formatBRL } from "@/helpers";
import exit from "@/assets/icons/exit.svg";
import cart from "@/assets/icons/cart.svg";

import { useCart } from "@/hooks";

type Props = {
  onClose: () => void;
  product: Product;
  variant: ProductVariant;
};

export default function AddToCartModal({ onClose, product, variant: variantSelected }: Props) {
  const { getQuantity, addItem, getObs } = useCart({ product, variant: variantSelected });

  const [selectedAddons, setSelectedAddons] = useState<AddOn[]>([]);
  const [variant, setVariant] = useState<ProductVariant>(variantSelected);

  const qtdData = getQuantity(variantSelected, selectedAddons);
  const isLimit = variant.stock > 0 && qtdData >= variant.stock;

  const [quantity, setQuantity] = useState(!isLimit && variant.stock > 0 ? 1 : 0);
  const [obs, setObs] = useState("");

  useEffect(() => {
    setObs(getObs(selectedAddons) || "");
  }, [selectedAddons]);

  const toggleAddon = (addon: AddOn) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.name === addon.name);
      return exists ? prev.filter((a) => a.name !== addon.name) : [...prev, addon];
    });
  };

  const totalAddOnPrice = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  const basePrice = variant.promotion ?? variant.price;
  const totalPrice = (basePrice + totalAddOnPrice) * quantity;

  const handleVariantChange = (variantId: string) => {
    const found = product.variants.find((v) => v.id === variantId);
    if (found) {
      setVariant(found);
      setSelectedAddons([]);
      setQuantity(!isLimit && variant.stock > 0 ? 1 : 0);
    }
  };
  const isOutOfStock = variant.stock === 0;
  const canAddToCart = quantity > 0 && quantity <= variant.stock;

  const addToCart = () => {
    const cartProduct: CartProduct = {
      id: product.id,
      name: `${product.name}-${variant.name}`,
      picture: product.picture,
      price: variant.price,
      qtd: quantity,
      variantId: variant.id,
      addons: selectedAddons,
      promotion: variant.promotion!,
      obs: obs,
      priceTotal: variant.promotion ?? variant.price,
    };
    addItem(cartProduct);
    onClose();
  };

  return (
    <Modal onClose={onClose} className="modal-container animate-dropDown ">
      <div className="flex flex-col gap-5 p-5 sm:p-6 mx-auto rounded-xl w-full md:px-10 h-full overflow-y-auto">
        <button
          onClick={onClose}
          className="size-10 ml-auto cursor-pointer active:scale-95 hover:scale-105 transition-all"
        >
          <Image src={exit} />
        </button>

        <div className="flex items-center gap-4">
          <Image
            src={product.picture}
            className="size-32 p-2 sm:size-36 md:size-36 rounded-md object-contain bg-white"
          />
          <div className="flex flex-col h-full pt-2">
            <div className="mb-auto md:mt-5">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-dark">
                {product.name} {variant.name}
              </h2>
              {variant.desc && (
                <p className="text-sm sm:text-base md:text-lg font-semibold text-primary">{variant.desc}</p>
              )}
            </div>
            <p className="text-lg md:text-2xl font-semibold text-primary">
              {formatBRL(variant.promotion ?? variant.price)}
            </p>
          </div>
        </div>

        {product.variants.length > 1 && (
          <div>
            <label className="text-sm font-medium text-dark block mb-2">Escolher variação</label>
            <Select value={variant.id} onChange={(e) => handleVariantChange(e.target.value)} className="w-full">
              {product.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} {v.stock === 0 ? " (Sem estoque)" : ""}
                </option>
              ))}
            </Select>
          </div>
        )}

        {variant.addons.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-dark mb-3">Adicionais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {variant.addons.map((addon) => {
                const isSelected = selectedAddons.some((a) => a.name === addon.name);
                return (
                  <button
                    key={addon.name}
                    type="button"
                    onClick={() => toggleAddon(addon)}
                    className={`flex justify-between items-center p-3 rounded-lg border transition-all text-left
          ${isSelected ? "bg-primary/10 border-primary text-primary" : "bg-card border-dark/20 text-dark"}
          hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium md:text-lg">{addon.name}</span>
                      <span className="text-sm text-dark md:text-base">{formatBRL(addon.price)}</span>
                    </div>
                    <div
                      className={`size-5 rounded border border-dark/20 flex items-center justify-center ${
                        isSelected ? "bg-primary text-white" : "bg-white"
                      }`}
                    >
                      {isSelected && <span className="text-sm font-bold">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {qtdData > 0 && (
          <div className="text-base sm:text-lg">
            Você já tem <strong>{qtdData}</strong> {qtdData === 1 ? "unidade" : "unidades"} no carrinho.
          </div>
        )}

        {isLimit && (
          <div className="text-orange-600 font-semibold mt-2">Você já adicionou todas as unidades disponíveis 🧃</div>
        )}

        <div
          className={`flex justify-between items-center mt-4 text-base ${
            isLimit ? "opacity-40 pointer-events-none" : ""
          }`}
        >
          <span className="font-medium text-dark">Quantidade</span>
          <InputNumber
            label=" "
            value={quantity}
            min={1}
            max={variant.stock}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val + qtdData <= variant.stock && val !== -1) setQuantity(val);
            }}
            className="w-24 text-base"
            disabled={isOutOfStock}
          />
        </div>

        <textarea
          className={`w-full min-h-28 text-base md:text-lg md:min-h-36 outline-none bg-cream border p-3 rounded-lg border-dark/40 transition ${
            isLimit ? "opacity-40 pointer-events-none" : ""
          }`}
          placeholder="Observação?"
          value={obs}
          onChange={(e) => setObs(e.target.value)}
        />

        <div className="flex justify-between items-center mt-auto mb-4">
          <span className="font-bold text-xl text-primary md:text-2xl">
            {isOutOfStock ? "Sem estoque" : `Total: ${formatBRL(totalPrice)}`}
          </span>
          <Button
            className="bg-primary text-white font-semibold px-5 py-2 rounded text-base md:text-lg disabled:opacity-50 flex items-center gap-1 justify-center"
            disabled={!canAddToCart || isLimit}
            onClick={addToCart}
          >
            Adicionar
            <Image src={cart} className="size-full invert brightness-0" />
          </Button>
        </div>
      </div>
    </Modal>
  );
}

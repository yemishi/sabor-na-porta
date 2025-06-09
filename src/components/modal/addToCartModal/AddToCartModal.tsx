import { useEffect, useState } from "react";
import { AddOn, CartProduct, Product, ProductVariant } from "@/types";
import { Modal } from "@/components";
import { Button, Image, InputNumber, Select } from "@/ui";
import { formatBRL } from "@/helpers";
import exit from "@/assets/icons/exit.svg";
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
      setQuantity(getQuantity(found, []));
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
          <Image src={product.picture} className="size-28 sm:size-32 rounded-md object-cover" />
          <div className="flex flex-col">
            <h2 className="text-xl sm:text-2xl font-bold text-dark">{product.name}</h2>
            <span className="text-base text-primary">{variant.name}</span>
            {variant.desc && <p className="text-sm sm:text-base text-primary">{variant.desc}</p>}
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
          ${isSelected ? "bg-primary/10 border-primary text-primary" : "bg-white border-dark/20 text-dark"}
          hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium md:text-lg">{addon.name}</span>
                      <span className="text-sm text-secondary md:text-base md:text-dark">{formatBRL(addon.price)}</span>
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
          <div className="text-base">
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
          className={`w-full min-h-28 text-base outline-none bg-background border p-3 rounded-lg border-dark/40 transition ${
            isLimit ? "opacity-40 pointer-events-none" : ""
          }`}
          placeholder="Observação?"
          value={obs}
          onChange={(e) => setObs(e.target.value)}
        />

        <div className="flex justify-between items-center mt-auto">
          <span className="font-bold text-xl text-primary">
            {isOutOfStock ? "Sem estoque" : `Total: ${formatBRL(totalPrice)}`}
          </span>
          <Button
            className="bg-primary text-white font-semibold px-5 py-3 rounded text-base disabled:opacity-50"
            disabled={!canAddToCart || isLimit}
            onClick={addToCart}
          >
            Adicionar ao carrinho
          </Button>
        </div>
      </div>
    </Modal>
  );
}

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
  const [quantity, setQuantity] = useState(0);
  const [obs, setObs] = useState("");

  useEffect(() => {
    setObs(getObs(selectedAddons) || "");
  }, [selectedAddons]);

  const toggleAddon = (addon: AddOn) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.name === addon.name);

      if (exists) {
        return prev.filter((a) => a.name !== addon.name);
      } else {
        return [...prev, addon];
      }
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
  const qtdData = getQuantity(variantSelected, selectedAddons);
  const isLimit = variant.stock > 0 && qtdData >= variant.stock;

  return (
    <Modal onClose={onClose} className="modal-container !bg-cream">
      <div className="flex flex-col gap-4 p-4  rounded-lg max-w-md w-full h-full overflow-y-auto">
        <button
          onClick={onClose}
          className="size-10 ml-auto cursor-pointer active:scale-95 hover:scale-105 transition-all"
        >
          <Image src={exit} />
        </button>

        <div className="flex items-center gap-4">
          <Image src={product.picture} className="size-28 rounded-md object-cover" />
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-dark">{product.name}</h2>
            <span className="text-sm text-primary">{variant.name}</span>
            {variant.desc && <p className="text-sm text-primary">{variant.desc}</p>}
          </div>
        </div>

        {product.variants.length > 1 && (
          <div>
            <label className="text-sm font-medium text-dark block mb-1">Escolher variação</label>
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
            <h3 className="text-md font-semibold text-dark mb-2">Adicionais</h3>
            <div className="flex flex-col gap-2">
              {variant.addons.map((addon) => (
                <label key={addon.name} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAddons.some((a) => a.name === addon.name)}
                    onChange={() => toggleAddon(addon)}
                  />
                  <span className="flex-1">{addon.name}</span>
                  <span className="text-sm text-secondary">{formatBRL(addon.price)}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        {qtdData > 0 && (
          <div>
            Você já tem <strong>{qtdData}</strong> {qtdData === 1 ? "unidade" : "unidades"} no carrinho.
          </div>
        )}
        {isLimit && (
          <div className="text-orange-600 font-semibold mt-2">Você já adicionou todas as unidades disponíveis 🧃</div>
        )}
        <div className={`flex justify-between items-center mt-2 ${isLimit ? "opacity-40 pointer-events-none" : ""}`}>
          <span className="font-medium text-dark">Quantidade</span>
          <InputNumber
            label=" "
            value={quantity}
            min={1}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val + qtdData <= variant.stock && val !== -1) setQuantity(val);
            }}
            max={variant.stock}
            className="w-20"
            disabled={isOutOfStock}
          />
        </div>
        <textarea
          className={`w-full min-h-30 outline-none bg-background border p-2 rounded-lg border-dark/50 ${
            isLimit ? "opacity-40 pointer-events-none" : ""
          }`}
          placeholder="Observação?"
          value={obs}
          onChange={(e) => setObs(e.target.value)}
        />
        <div className="flex justify-between  items-center  mt-auto mb-10">
          <span className="font-bold text-lg text-primary">
            {isOutOfStock ? "Sem estoque" : `Total: ${formatBRL(totalPrice)}`}
          </span>
          <Button
            className="bg-primary text-white  font-semibold px-4 py-2 rounded disabled:opacity-50"
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

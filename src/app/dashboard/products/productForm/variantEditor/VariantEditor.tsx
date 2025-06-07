"use client";

import { ProductVariant } from "@/types";
import { Button, Input, InputBRL, InputNumber } from "@/ui";
import { v4 as uuid } from "uuid";
export default function VariantsEditor({
  variants,
  highlights,
  setHighlights,
  setVariants,
}: {
  variants: any[];
  setVariants: (variants: any[]) => void;
  highlights: string[];
  setHighlights: (highlights: string[]) => void;
}) {
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        name: "",
        id: uuid(),
        stock: 0,
        price: 0,
        desc: "",
        promotion: undefined,
        addons: [],
      },
    ]);
  };

  const updateVariant = (index: number, key: string, value: any) => {
    const updated = [...variants];
    updated[index][key] = value;
    setVariants(updated);
  };

  const removeVariant = (index: number) => {
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);
  };

  const addAddon = (variantIndex: number) => {
    const updated = [...variants];
    updated[variantIndex].addons.push({ name: "", price: 0 });
    setVariants(updated);
  };

  const updateAddon = (variantIndex: number, addonIndex: number, key: string, value: any) => {
    const updated = [...variants];
    updated[variantIndex].addons[addonIndex][key] = value;
    setVariants(updated);
  };

  const removeAddon = (variantIndex: number, addonIndex: number, variantId: string) => {
    const updated = [...variants];
    setHighlights(highlights.filter((h) => h !== variantId));
    updated[variantIndex].addons.splice(addonIndex, 1);
    setVariants(updated);
  };

  return (
    <div className="flex flex-col gap-6 border-t pt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Variações</h2>
        <Button type="button" onClick={addVariant} className="py-1 font-medium bg-primary">
          Adicionar Variação
        </Button>
      </div>

      {variants.map((variant, i) => {
        const isHighlighted = highlights.includes(variant.id);

        const toggleHighlight = () => {
          if (isHighlighted) {
            setHighlights(highlights.filter((h) => h !== variant.id));
          } else {
            setHighlights([...highlights, variant.id]);
          }
        };

        return (
          <div key={i} className="p-4 border border-dark rounded-md flex flex-col gap-3 bg-cream">
            <button
              type="button"
              onClick={toggleHighlight}
              className={`ml-auto text-xs px-2 py-1  rounded-md font-medium transition  cursor-pointer
          ${isHighlighted ? "bg-primary text-white" : "bg-accent text-dark/60 hover:brightness-110"}
        `}
              title="Destacar variação"
            >
              {isHighlighted ? "Destacada ⭐" : "Destacar"}
            </button>
            <div className="flex gap-4 flex-wrap justify-center">
              <Input
                bgColor="bg-cream"
                label="Nome"
                name={`variant-name-${i}`}
                value={variant.name}
                onChange={(e) => updateVariant(i, "name", e.target.value)}
              />

              <InputBRL
                bgColor="bg-cream"
                label="Preço"
                name={`variant-price-${i}`}
                value={variant.price}
                onChange={(e) => updateVariant(i, "price", parseFloat(e.target.value))}
              />

              <InputNumber
                bgColor="bg-cream"
                label="Estoque"
                name={`variant-stock-${i}`}
                value={variant.stock ?? "a"}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    updateVariant(i, "stock", parseInt(val || "0", 10));
                  }
                }}
              />
            </div>

            <Input
              bgColor="bg-cream"
              label="Descrição (opcional)"
              name={`variant-desc-${i}`}
              value={variant.desc || ""}
              onChange={(e) => updateVariant(i, "desc", e.target.value)}
            />

            <InputBRL
              bgColor="bg-cream"
              label="Promoção (opcional)"
              name={`variant-promo-${i}`}
              value={variant.promotion ?? ""}
              onChange={(e) => updateVariant(i, "promotion", e.target.value ? parseFloat(e.target.value) : null)}
            />

            <div className="mt-2 border-t pt-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm text-dark cursor-pointer">Adicionais</h3>
                <button
                  type="button"
                  onClick={() => addAddon(i)}
                  className="text-sm text-primary hover:underline cursor-pointer"
                >
                  + Adicionar
                </button>
              </div>

              {variant.addons?.map((addon: any, j: number) => (
                <div key={j} className="flex gap-4 mt-2 items-center">
                  <Input
                    bgColor="bg-cream"
                    label="Nome"
                    name={`addon-name-${i}-${j}`}
                    value={addon.name}
                    onChange={(e) => updateAddon(i, j, "name", e.target.value)}
                  />

                  <InputBRL
                    bgColor="bg-cream"
                    label="Preço"
                    name={`addon-price-${i}-${j}`}
                    value={addon.price}
                    onChange={(e) => updateAddon(i, j, "price", parseFloat(e.target.value))}
                  />
                  <button
                    type="button"
                    onClick={() => removeAddon(i, j, variant.id)}
                    className="text-red-500 text-sm hover:underline mt-5 cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => removeVariant(i)}
              className="self-end text-sm text-red-500 hover:underline mt-4  cursor-pointer"
            >
              Remover Variação
            </button>
          </div>
        );
      })}
    </div>
  );
}

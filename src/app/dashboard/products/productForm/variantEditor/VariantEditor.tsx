"use client";

import { AddOn, AddOnGroup, ProductVariant } from "@/types";
import { Button, Input, InputBRL, InputNumber, Select } from "@/ui";
import { v4 as uuid } from "uuid";

interface Props {
  variants: ProductVariant[];
  setVariants: (variants: ProductVariant[]) => void;
  highlights: string[];
  setHighlights: (highlights: string[]) => void;
}

type VariantKeys = keyof ProductVariant;
type AddOnGroupKeys = keyof AddOnGroup;
type AddOnKeys = keyof AddOn;

export default function VariantsEditor({ variants, setVariants, highlights, setHighlights }: Props) {
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: uuid(),
        name: "",
        stock: 0,
        price: 0,
        desc: "",
        promotion: undefined,
        addons: [],
      },
    ]);
  };
  const updateVariant = (index: number, key: VariantKeys, value: string | number | null) => {
    const updated = [...variants];

    updated[index][key] = value as never;
    setVariants(updated);
  };

  const addAddOnGroup = (variantIndex: number) => {
    const updated = [...variants];
    updated[variantIndex].addons.push({
      title: "",
      type: "multiple",
      required: false,
      options: [],
    });
    setVariants(updated);
  };

  const updateAddOnGroup = (variantIndex: number, groupIndex: number, key: AddOnGroupKeys, value: any) => {
    const updated = [...variants];
    updated[variantIndex].addons[groupIndex][key] = value as never;
    setVariants(updated);
  };

  const removeAddOnGroup = (variantIndex: number, groupIndex: number) => {
    const updated = [...variants];
    updated[variantIndex].addons.splice(groupIndex, 1);
    setVariants(updated);
  };

  const addAddOnOption = (variantIndex: number, groupIndex: number) => {
    const updated = [...variants];
    updated[variantIndex].addons[groupIndex].options.push({ name: "", price: 0 });
    setVariants(updated);
  };

  const updateAddOnOption = (
    variantIndex: number,
    groupIndex: number,
    optionIndex: number,
    key: AddOnKeys,
    value: any
  ) => {
    const updated = [...variants];
    updated[variantIndex].addons[groupIndex].options[optionIndex][key] = value as never;
    setVariants(updated);
  };

  const removeAddOnOption = (variantIndex: number, groupIndex: number, optionIndex: number) => {
    const updated = [...variants];
    updated[variantIndex].addons[groupIndex].options.splice(optionIndex, 1);
    setVariants(updated);
  };

  const removeVariant = (index: number) => {
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);
  };

  const toggleHighlight = (id: string) => {
    if (highlights.includes(id)) {
      setHighlights(highlights.filter((h) => h !== id));
    } else {
      setHighlights([...highlights, id]);
    }
  };

  return (
    <div className="flex flex-col gap-6 border-t pt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Variações</h2>
        <Button type="button" onClick={addVariant} className="bg-primary py-1 font-medium">
          + Adicionar Variação
        </Button>
      </div>

      {variants.map((variant, i) => {
        const isHighlighted = highlights.includes(variant.id);

        return (
          <div key={variant.id} className="p-4 border border-dark rounded-md flex flex-col gap-4 bg-cream">
            <button
              type="button"
              onClick={() => toggleHighlight(variant.id)}
              className={`ml-auto text-xs px-2 py-1 rounded-md font-medium transition
                ${isHighlighted ? "bg-primary text-white" : "bg-accent text-dark/60 hover:brightness-110"}`}
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
                value={variant.stock}
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
              value={variant.promotion}
              onChange={(e) => updateVariant(i, "promotion", e.target.value ? parseFloat(e.target.value) : null)}
            />

            <div className="mt-2 border-t pt-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm text-dark">Adicionais (Grupos)</h3>
                <button type="button" onClick={() => addAddOnGroup(i)} className="text-sm text-primary hover:underline">
                  + Adicionar Grupo
                </button>
              </div>

              {variant.addons?.map((group, gi) => (
                <div key={gi} className="border border-gray-300 rounded-md p-3 mt-3 flex flex-col">
                  <div className="flex flex-col gap-4 md:flex-row md:justify-between items-center">
                    <Input
                      bgColor="bg-cream"
                      label="Título do Grupo"
                      name={`addon-group-title-${i}-${gi}`}
                      value={group.title}
                      onChange={(e) => updateAddOnGroup(i, gi, "title", e.target.value)}
                    />
                    <Select
                      className="ml-4 border bg-black text-white p-1"
                      value={group.type || ""}
                      onChange={(e) => updateAddOnGroup(i, gi, "type", e.target.value)}
                    >
                      <option value="single">Somente uma</option>
                      <option value="multiple">Múltiplas opções</option>
                    </Select>
                    <div className="flex flex-col gap-2 ml-auto">
                      <button
                        type="button"
                        onClick={() => updateAddOnGroup(i, gi, "required", !group.required)}
                        className={`ml-auto text-xs px-2 py-1 rounded-md font-medium transition
                         ${group.required ? "bg-primary text-white" : "bg-accent text-dark/60 hover:brightness-110"}`}
                      >
                        {group.required ? "Obrigatorio * " : "Opcional"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-sm">Opções do Grupo</h4>
                      <button
                        type="button"
                        onClick={() => addAddOnOption(i, gi)}
                        className="text-sm text-primary hover:underline"
                      >
                        + Adicionar Opção
                      </button>
                    </div>

                    {group.options.map((option, oi) => (
                      <div key={oi} className="flex flex-col mt-3 items-center md:flex-row">
                        <div className="flex gap-2">
                          <Input
                            bgColor="bg-cream"
                            label="Nome"
                            name={`addon-option-name-${i}-${gi}-${oi}`}
                            value={option.name}
                            onChange={(e) => updateAddOnOption(i, gi, oi, "name", e.target.value)}
                          />
                          <InputBRL
                            bgColor="bg-cream"
                            label="Preço"
                            name={`addon-option-price-${i}-${gi}-${oi}`}
                            value={option.price}
                            onChange={(e) => updateAddOnOption(i, gi, oi, "price", parseFloat(e.target.value))}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAddOnOption(i, gi, oi)}
                          className="text-sm ml-auto bg-red-400 text-white font-medium rounded-lg py-1 px-2 mt-2 mb-4"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAddOnGroup(i, gi)}
                    className="text-red-500 hover:underline ml-auto mt-5"
                  >
                    Remover Grupo
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => removeVariant(i)}
              className="self-end text-sm text-red-500 hover:underline mt-4"
            >
              Remover Variação
            </button>
          </div>
        );
      })}
    </div>
  );
}

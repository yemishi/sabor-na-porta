import { Modal } from "@/components";
import { useForm } from "@/hooks";
import { Product } from "@/types";
import { Button, Image, Input, Loading } from "@/ui";
import { FormEvent, useState } from "react";
import exit from "@/assets/icons/exit.svg";
import VariantsEditor from "./variantEditor/VariantEditor";

interface Props {
  onClose: () => void;
  refetch: () => void;
  product?: Product;
}
export default function ProductForm({ onClose, product, refetch }: Props) {
  const isEdit = !!product;
  const [isLoading, setIsLoading] = useState(false);
  const [variants, setVariants] = useState(product?.variants || []);
  const [highlights, setHighlights] = useState<string[]>(
    product?.highlights && product?.highlights?.length > 0 ? product?.highlights : []
  );

  const { values, errors, onChange, validateAll, setError } = useForm<{
    name: string;
    picture: string;
    category: string;
  }>({
    name: { value: product?.name || "", min: 3 },
    picture: { value: product?.picture || "", min: 1 },
    category: { value: product?.category || "", min: 1 },
  });


  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateAll() || variants.length === 0) return;

    setIsLoading(true);
    const payload = {
      ...values,
      highlights,
      variants,
    };

    const method = isEdit ? "PATCH" : "POST";
    const res = await fetch(`/api/products${isEdit ? `/${product.id}` : ""}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setIsLoading(false);

    const response = await res.json();
    if (!res.ok) {
      setError("name", response.message);
      console.error("Error saving product");
      return;
    }
    refetch();
    onClose();
  };
  return (
    <Modal
      className="w-full max-w-3xl md:rounded-xl mx-auto bg-background px-6 py-10 flex flex-col gap-4 h-full md:h-[900px] my-auto overflow-y-auto"
      onClose={onClose}
    >
      {isLoading && <Loading className="md:rounded-xl" />}
      <button
        onClick={onClose}
        className="size-10 ml-auto cursor-pointer active:scale-95 hover:scale-105 transition-all"
      >
        <Image src={exit} />
      </button>

      <h1 className="text-3xl font-title font-bold">{isEdit ? "Editar Produto" : "Novo Produto"}</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-6 h-full py-6">
        <Input label="Nome do Produto" name="name" value={values.name} onChange={onChange} error={errors.name || ""} />
        <Input
          label="Imagem (URL)"
          name="picture"
          value={values.picture}
          onChange={onChange}
          error={errors.picture || ""}
        />
        <Input
          label="Categoria"
          name="category"
          value={values.category}
          onChange={onChange}
          error={errors.category || ""}
        />

        <VariantsEditor
          highlights={highlights}
          setHighlights={setHighlights}
          variants={variants}
          setVariants={setVariants}
        />

        <Button
          className="mt-6 self-center sticky bottom-0 shadow-md shadow-black/20"
          disabled={!variants.length}
          type="submit"
        >
          {isEdit ? "Salvar Alterações" : "Criar Produto"}
        </Button>
      </form>
    </Modal>
  );
}

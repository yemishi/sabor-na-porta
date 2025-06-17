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
  const [highlights, setHighlights] = useState<string[]>(product?.highlights?.length ? product.highlights : []);

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
    const res = await fetch(`/api/products${isEdit ? `/${product?.id}` : ""}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await res.json();
    setIsLoading(false);

    if (!res.ok) {
      setError("name", response.message || "Erro ao salvar produto");
      console.error("Error saving product:", response.message);
      return;
    }

    refetch();
    onClose();
  };

  return (
    <Modal
      onClose={onClose}
      className="w-full max-w-3xl my-auto mx-auto bg-background h-full md:h-[900px] overflow-y-auto px-6 py-10 flex flex-col gap-4 md:rounded-xl"
    >
      {isLoading && <Loading className="absolute inset-0 z-50 bg-background/80 md:rounded-xl" />}

      <button onClick={onClose} className="size-10 ml-auto cursor-pointer active:scale-95 hover:scale-105 transition">
        <Image src={exit} alt="Fechar" />
      </button>

      <h1 className="text-3xl font-bold font-title">{isEdit ? "Editar Produto" : "Novo Produto"}</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-6 py-6 h-full">
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
          type="submit"
          disabled={isLoading || variants.length === 0}
          className="mt-6 self-center sticky bottom-0 shadow-md shadow-black/20"
        >
          {isEdit ? "Salvar Alterações" : "Criar Produto"}
        </Button>
      </form>
    </Modal>
  );
}

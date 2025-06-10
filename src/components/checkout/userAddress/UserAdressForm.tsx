import { useState } from "react";
import { useForm } from "@/hooks";
import { User } from "@/types";
import { Input, InputNumber, Loading } from "@/ui";

interface Props {
  userInfo: User;
  onClose: () => void;
  refetch: () => void;
}

export default function UserAddressForm({ userInfo, refetch, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    street: { value: userInfo.address?.street || "", min: 3 },
    houseNumber: { value: userInfo.address?.houseNumber || "", min: 1 },
    neighborhood: { value: userInfo.address?.neighborhood || "", min: 2 },
    cep: {
      value: userInfo.address?.cep || "",
      min: 9,
    },
    complement: { value: userInfo.address?.complement || "" },
  });

  const staticCity = "Barra de santa rosa";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.validateAll()) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/users/${userInfo.id}`, {
        method: "PATCH",
        body: JSON.stringify({ address: form.values }),
      });

      const response = await res.json();
      if (!res.ok) {
        form.setError("street", response.message);
        return;
      }

      refetch();
      onClose();
    } catch (err) {
      console.error("Error updating address", err);
    } finally {
      setIsLoading(false);
    }
  };

  const labels = {
    cep: "CEP",
    houseNumber: "Número",
    complement: "Complemento",
    neighborhood: "Bairro",
    street: "Rua",
  } as any;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 flex flex-col">
      {isLoading && <Loading />}

      {form.fieldsKey.map((field) => {
        const isHouseNumber = field === "houseNumber";
        const isCep = field === "cep";

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          let { value } = e.target;

          if (isCep) {
            value = value.replace(/\D/g, "").slice(0, 8);
            if (value.length > 5) {
              value = value.replace(/^(\d{5})(\d{1,3})$/, "$1-$2");
            }
          }

          form.onChange({ target: { name: field, value } } as any);
        };

        const value = form.rawValues[field].value as string;

        const commonProps = {
          name: field,
          value,
          onChange: handleChange,
          error: form.errors[field] || "",
          label: labels[field] || "",
        };
        return isHouseNumber ? <InputNumber key={field} {...commonProps} /> : <Input key={field} {...commonProps} />;
      })}

      <div className="flex flex-col">
        <label className="text-sm font-medium text-muted">Cidade</label>
        <input
          value={staticCity}
          disabled
          className="bg-muted/10 text-muted border border-dark/10 rounded px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        className="bg-secondary mx-auto cursor-pointer rounded-lg text-white px-4 py-2 hover:brightness-110 transition-all text-sm font-semibold"
      >
        Salvar endereço
      </button>
    </form>
  );
}

import { User } from "@/types";
import { Button } from "@/ui";

export default function UserAddress({ userInfo, toggleForm }: { userInfo: User; toggleForm: () => void }) {
  const { address, name } = userInfo;

  return address ? (
    <div className="text-lg space-y-2 text-dark animate-dropDown">
      <p className="font-semibold text-primary">{name}</p>
      <p>
        {address.street}, Nº {address.houseNumber}
      </p>
      <p>
        {address.cep} - {address.city}
      </p>
      {address.complement && <p>{address.complement}</p>}
      {address.ref && <p className="italic">{address.ref}</p>}
      <Button
        onClick={toggleForm}
        className="flex items-center bg-primary mt-6 cursor-pointer gap-1 font-medium hover:underline"
      >
        Editar
      </Button>
    </div>
  ) : (
    <div className="text-center space-y-3">
      <p className="text-red-500 font-anton text-lg">Você precisa cadastrar um endereço de entrega</p>
      <button
        onClick={toggleForm}
        className="font-semibold cursor-pointer text-accent underline underline-offset-4 hover:text-accent-foreground"
      >
        Adicionar endereço
      </button>
    </div>
  );
}

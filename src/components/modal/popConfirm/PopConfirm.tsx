import { Button } from "@/ui";
import Modal from "../Modal";

type PropsType = {
  confirm: () => void;
  onClose: () => void;
  name?: string;
  isLoading?: boolean;
  confirmDesc?: string;
  error?: string;
  desc?: string;
};

export default function PopConfirm({
  desc,
  onClose,
  error,
  confirm,
  name = " isto",
  isLoading,
  confirmDesc = "SIM!",
}: PropsType) {
  return (
    <Modal
      onClose={onClose}
      className="mx-auto my-auto flex flex-col bg-background rounded-xl px-8 py-6 text-center gap-6 shadow-xl max-w-md"
    >
      {error && <span className="text-red-300 text-lg font-semibold">{error}</span>}
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold">
          {desc ?? "Você realmente deseja deletar"} <span className="text-orange-600">{name}</span>?
        </h2>
        <p className="text-sm lg:text-base text-red-500 font-medium">Essa ação não poderá ser desfeita.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button disabled={isLoading} onClick={onClose} className="rounded-lg bg-accent text-gray-800">
          NÃO!
        </Button>
        <Button disabled={isLoading} onClick={confirm} className="rounded-lg bg-red-400 text-white ">
          {isLoading ? "Deletando..." : confirmDesc}
        </Button>
      </div>
    </Modal>
  );
}

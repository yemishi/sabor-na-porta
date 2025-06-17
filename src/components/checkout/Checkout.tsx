"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Login, Modal } from "@/components";
import { Button, Image, Loading } from "@/ui";

import UserAddress from "./userAddress/UserAddress";
import exit from "@/assets/icons/exit.svg";
import UserAddressForm from "./userAddress/UserAdressForm";
import MethodPicker from "./methodPicker/MethodPicker";
import CheckoutSummary from "./summary/CheckoutSummary";
import PlaceOrderStep from "./placeOrderStep/PlaceOrderStep";
import { useCheckout } from "./hooks/useCheckout";
import { useRouter } from "next/navigation";
import { formatOrderMessage, generateWppUrl } from "@/lib/sendWppMsg";

type Props = {
  onClose: () => void;
};
export default function Checkout({ onClose }: Props) {
  const { data: session, status: userStatus } = useSession();
  const [isSign, setIsSign] = useState(false);
  const [action, setAction] = useState<"address" | "editAddress" | "paymentMethod" | "summary" | "order">("address");
  const [method, setMethod] = useState("");
  const [changeAmount, setChangeAmount] = useState("");
  const { push } = useRouter();

  useEffect(() => {
    if (!session?.user) setIsSign(true);
  }, []);

  const {
    refetchUser,
    user,
    userLoading,
    totalPrice,
    cart,
    orderData,
    isPlacing,
    orderStatus,
    placeOrder,
    cartFixIssues,
    orderPlaced,
    orderRefetch,
    setCartFixIssues,
    orderError,
    setStatus,
    status,
    removeItemById,
  } = useCheckout({
    sessionPhone: session?.user.phone,
    paymentMethod: method,
    changeAmount,
  });

  const buttonText = {
    editAddress: "Voltar",
    address: "Continuar",
    paymentMethod: "Continuar",
    summary: "Finalizar",
    order: "Continuar comprando",
  }[action];

  const disabledNextAction = () => {
    if (action === "address" && !user?.address) return true;
    if (action === "paymentMethod" && ((Number(changeAmount) > 0 && Number(changeAmount) < totalPrice) || !method))
      return true;
    if (isPlacing) return true;
    return false;
  };

  const nextAction = () => {
    if (action === "editAddress") return setAction("address");
    if (action === "address" && user?.address) return setAction("paymentMethod");
    if (action === "paymentMethod") return setAction("summary");
    if (action === "summary") {
      placeOrder();
      setAction("order");
      return;
    }
    if (action === "order") {
      onClose();
      return;
    }
  };

  const stepOrder = ["address", "paymentMethod", "summary", "order"] as const;
  const stepIndex = stepOrder.indexOf(action as any);
  const curTitle = {
    editAddress: "Atualizar Endereço",
    address: "Confirmar Endereço",
    paymentMethod: "Escolher Pagamento",
    summary: "Revisar Pedido",
    order: "Pedido Confirmado 🎉",
  }[action];

  return (
    <Modal
      onClose={onClose}
      className="w-full h-full max-w-2xl md:h-fit overflow-y-auto overflow-x-hidden md:rounded-xl mx-auto relative my-auto bg-background flex flex-col gap-4 
       px-6 pt-10 md:pt-12"
    >
      {isSign && (
        <Login
          onClose={() => {
            if (!session?.user) {
              setIsSign(false);
              onClose();
            }
            setIsSign(false);
          }}
        />
      )}

      <button
        onClick={onClose}
        className="size-10 ml-auto cursor-pointer active:scale-95 hover:scale-105 transition-all"
      >
        <Image src={exit} />
        {userLoading && userStatus === "loading" && <Loading />}
      </button>

      <h2 className="title">{curTitle}</h2>
      <div className="flex justify-between items-center mb-2 text-sm md:text-base text-muted-foreground">
        <span>
          Passo {Math.min(stepIndex + 1, stepOrder.length)} de {stepOrder.length}
        </span>
        {stepIndex > 0 && stepIndex < stepOrder.length - 1 && (
          <button
            onClick={() => setAction(stepOrder[stepIndex - 1])}
            className="text-blue-600 font-semibold hover:underline"
          >
            Voltar
          </button>
        )}
      </div>

      {session?.user && user && (
        <div className="relative w-full max-w-xl mx-auto px-4 py-6 h-full overflow-y-auto overflow-x-hidden">
          {action === "address" && <UserAddress userInfo={user} toggleForm={() => setAction("editAddress")} />}

          {action === "editAddress" && (
            <UserAddressForm refetch={refetchUser} userInfo={user} onClose={() => setAction("address")} />
          )}

          {action === "paymentMethod" && (
            <MethodPicker
              totalPrice={totalPrice}
              changeAmount={changeAmount}
              setChangeAmount={setChangeAmount}
              method={method}
              setMethod={setMethod}
            />
          )}
          {action === "summary" && (
            <CheckoutSummary charge={changeAmount} totalPrice={totalPrice} method={method} cart={cart} />
          )}
          {action === "order" && (
            <PlaceOrderStep
              cartFixIssues={cartFixIssues}
              method={method.toLowerCase()}
              order={orderData!}
              orderError={orderError}
              orderRefetch={orderRefetch}
              orderStatus={orderStatus}
              trackOrder={() => {
                push(`/order/${orderData?.id}`);
                onClose();
              }}
              status={status}
              setStatus={setStatus}
              removeItemById={removeItemById}
              setCartFixIssues={setCartFixIssues}
              totalPrice={totalPrice}
              isCartEmpty={!cart.length && !placeOrder}
              isSuccess={orderData && orderPlaced}
            />
          )}
        </div>
      )}

      {action !== "order" && (
        <Button
          disabled={disabledNextAction()}
          onClick={nextAction}
          className="mt-auto max-sm:mb-20 bg-dark sm:mb-5 mx-auto animate-dropDown"
        >
          {buttonText}
        </Button>
      )}

      {orderData && (
        <button
          onClick={() => window.open(generateWppUrl(formatOrderMessage(orderData)), "_blank")}
          className="border mt-auto max-sm:mb-20 bg-dark text-white font-semibold sm:mb-5 mx-auto border-black rounded-xl py-2 px-4 hover:bg-black hover:text-white
           transition animate-dropDown"
        >
          {orderData.paymentMethod.toLowerCase() === "pix" ? "📎 ENVIAR COMPROVANTE" : "📦 ACOMPANHE O PEDIDO"}
        </button>
      )}
    </Modal>
  );
}

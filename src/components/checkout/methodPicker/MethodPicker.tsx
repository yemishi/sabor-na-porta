import { useState } from "react";
import coinSvg from "../assets/coins.svg";
import pixSvg from "../assets/pix.svg";
import cardSvg from "../assets/credit-card.svg";
import { Image, InputBRL } from "@/ui";
import { formatBRL } from "@/helpers";
interface PropsType {
  changeAmount?: string;
  setChangeAmount: React.Dispatch<React.SetStateAction<string>>;
  method: string;
  totalPrice: number;
  setMethod: React.Dispatch<React.SetStateAction<string>>;
}

export default function MethodPicker({ totalPrice, method, setMethod, changeAmount, setChangeAmount }: PropsType) {
  const methods = [
    { label: "Pix", icon: pixSvg },
    { label: "Cartão", icon: cardSvg },
    { label: "Dinheiro", icon: coinSvg },
  ];
  return (
    <div className="space-y-4">
      {methods.map((item) => {
        const isActive = item.label === method;
        return (
          <div
            key={item.label}
            onClick={() => setMethod(item.label)}
            className={`flex items-center gap-4 p-4 rounded-xl animate-dropDown cursor-pointer border transition-all w-full ${
              isActive ? "bg-accent" : ""
            }`}
          >
            <div className={`p-3 rounded-full  border-black/50  border-2  ${isActive ? "bg-black" : ""}`} />
            <div className="flex flex-col">
              <p className="font-anton text-md md:text-lg">{item.label}</p>
            </div>
            <Image src={item.icon} className="ml-auto size-10" />
          </div>
        );
      })}

      {method === "Dinheiro" && (
        <div className="mt-2  flex flex-col gap-1 transition-opacity animate-in fade-in duration-300">
          {Number(changeAmount) > 0 && Number(changeAmount) < totalPrice && (
            <span>
              Valor mínimo: <strong>{formatBRL(totalPrice)}</strong>
            </span>
          )}
          <label htmlFor="changeAmount" className="text-sm font-medium text-muted">
            Troco para quanto? <span className="text-muted text-xs">(opcional)</span>
          </label>
          <InputBRL
            name="changeAmount"
            id="changeAmount"
            className={!(Number(changeAmount) > 0) ? "opacity-40" : ""}
            value={Number(changeAmount)}
            onChange={(e) => setChangeAmount(e.target.value)}
            label=" "
          />
        </div>
      )}
    </div>
  );
}

import { Cart } from "@/types";
import { Image } from "../../../ui";
import { formatBRL } from "@/helpers";

export default function CheckoutSummary({
  cart,
  totalPrice,
  method,
}: {
  cart: Cart;
  totalPrice: number;
  method: string;
}) {
  return (
    <div className="w-full">
      <div className="flex font-bold mt-3 md:self-center md:gap-10 md:text-lg lg:text-xl w-full px-2 md:px-4">
        <span>{method}</span>
        <div className="flex ml-auto">
          <span className="ml-auto text-primary">{formatBRL(totalPrice)}</span>
          {totalPrice < 10 && (
            <span className="ml-1 text-xs text-red-500 font-normal absolute top-0 right-0">+ R$ 2,00 frete</span>
          )}
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto w-full mt-4 px-2 md:px-4">
        <div className="flex flex-col gap-4">
          {cart.map((product, index) => {
            const { qtd, picture, name, priceTotal } = product;
            return (
              <div
                key={`${name}_${index}`}
                className="flex flex-col md:flex-row items-center gap-4 p-4 border border-primary-200 bg-primary-550 rounded-xl shadow-sm"
              >
                <div className="w-full md:w-40 flex-shrink-0 flex items-center justify-center bg-cream rounded-lg p-2">
                  <Image className="h-36 object-contain lg:h-44" src={picture} />
                </div>

                <div className="flex flex-col w-full h-full justify-between">
                  <span className="font-semibold text-lg lg:text-xl">{name}</span>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted">Qtd: {qtd}</span>
                    <span className="font-bold text-secondary-500 text-base lg:text-lg">{formatBRL(priceTotal)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

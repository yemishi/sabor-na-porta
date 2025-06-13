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
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-dropDown">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-primary-200 shadow-md rounded-xl px-6 py-4">
        <span className="text-base font-medium text-primary-700 capitalize">
          Forma de pagamento: <span className="font-semibold text-primary-900">{method}</span>
        </span>
        <div className="relative mt-2 sm:mt-0">
          <span className="text-xl font-extrabold text-green-600 tracking-tight">{formatBRL(totalPrice)}</span>
          {totalPrice < 10 && <span className=" ml-2 text-xs text-red-500 font-medium">+ R$ 2,00 frete</span>}
        </div>
      </div>

      <div className="space-y-5 max-h-[500px] px-1 sm:px-0">
        {cart.map((product, index) => {
          const { qtd, picture, name, priceTotal, addons, obs } = product;
          return (
            <div
              key={`${name}_${index}`}
              className="flex flex-col md:flex-row items-start bg-gradient-to-br from-white to-primary-50 border border-primary-100 rounded-xl shadow-md p-4 md:p-5 gap-4 "
            >
              <div className="w-full md:w-32 flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-sm flex items-center justify-center p-2">
                <Image className="h-28 md:h-32 object-contain" src={picture} />
              </div>

              <div className="flex flex-col w-full space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">{name}</h3>
                  <span className="text-base font-bold text-secondary-500">{formatBRL(priceTotal)}</span>
                </div>

                <span className="text-sm text-gray-600">Quantidade: {qtd}</span>

                {addons && addons.length > 0 && (
                  <div className="text-sm text-primary-700">
                    <span className="font-medium">Adicionais:</span>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-primary-600">
                      {addons.map((addon, idx) => (
                        <li key={idx}>
                          {addon.name} — {formatBRL(addon.price)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {obs && (
                  <div className="mt-2 px-3 py-2 text-sm italic text-yellow-900 bg-yellow-100 border-l-4 border-yellow-400 rounded">
                    Observação: {obs}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

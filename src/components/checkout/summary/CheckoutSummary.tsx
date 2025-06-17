import { Cart } from "@/types";
import { Image } from "../../../ui";
import { formatBRL } from "@/helpers";

export default function CheckoutSummary({
  cart,
  totalPrice,
  method,
  charge,
}: {
  cart: Cart;
  totalPrice: number;
  method: string;
  charge?: string;
}) {
  return (
    <div className="w-full mx-auto space-y-6 ">
      <div className="flex flex-col sm:flex-row justify-between animate-dropDown items-start sm:items-center bg-cream border border-dark/30 shadow-md rounded-xl px-6 py-4 gap-2">
        <div className="flex flex-col text-base font-medium">
          <span>
            Forma de pagamento: <span className="font-semibold text-primary">{method}</span>
          </span>

          {charge && (
            <span>
              Troco para: <span className="font-semibold text-primary">{formatBRL(charge)}</span>
            </span>
          )}
        </div>

        <div className="relative">
          <span className="text-xl font-extrabold tracking-tight text-green-600">Total: {formatBRL(totalPrice)}</span>
          {totalPrice < 10 && <div className="text-xs text-red-500 font-medium">+ R$ 2,00 de taxa de entrega</div>}
        </div>
      </div>
      <div className="space-y-5 max-h-[500px] px-1 sm:px-0 animate-dropDown">
        {cart.map((product, index) => {
          const { qtd, picture, name, priceTotal, addons, obs, price } = product;
          return (
            <div
              key={`${name}_${index}`}
              className="flex flex-col md:flex-row items-start bg-gradient-to-br from-cream to-card/50 border border-dark/30 rounded-xl shadow-md p-4 md:p-5 gap-4 "
            >
              <div className="w-full md:w-32 flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-sm flex items-center justify-center p-2">
                <Image className="h-28 md:h-32 object-contain" src={picture} alt={name} />
              </div>

              <div className="flex flex-col w-full space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">{name}</h3>
                  <span className="text-base font-bold text-secondary-500">{formatBRL(priceTotal)}</span>
                </div>
                <span className="text-sm text-gray-600">Quantidade: {qtd}</span>
                <span className="text-sm text-gray-600">Preço unitário: {formatBRL(price)}</span>

                {addons && addons.length > 0 && (
                  <>
                    <span className="text-base text-primary font-semibold">➕ Adicionais</span>
                    <div className="text-sm text-primary">
                      <ul className="mt-1 space-y-1 text-primary">
                        {addons.map((addon, i) => (
                          <li key={`${addon.title}_${i}`} className="mb-1 flex flex-wrap items-center gap-x-1">
                            <div className="font-medium text-base first-letter:uppercase">{addon.title}:</div>
                            <div className="flex flex-wrap text-sm text-dark/80 gap-x-1">
                              {addon.options.map((o, j) => (
                                <span key={`${o.name}_${j}`}>
                                  {o.name} ({o.price ? formatBRL(o.price) : "Grátis"})
                                  {j < addon.options.length - 1 && ","}
                                </span>
                              ))}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
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

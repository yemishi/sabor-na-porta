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
    <>
      <div className="flex font-bold  mt-3 md:self-center md:gap-10 md:text-lg lg:text-xl w-full ">
        <span>{method}</span>
        <span className="ml-auto text-primary">{formatBRL(totalPrice)}</span>
      </div>

      <div className="max-h-[500px] overflow-y-auto w-full">
        <table className="flex items-center justify-center w-full  ">
          <tbody className="flex flex-col gap-5 pt-4 w-full rounded  md:grid md:grid-cols-2 ">
            {cart.map((product, index) => {
              const { qtd, picture, name, priceTotal } = product;
              return (
                <tr
                  key={`${name}_${index}`}
                  className=" flex md:flex-col gap-5 pr-2 
              w-full border-b border-primary-200 bg-primary-550 border lg:text-lg rounded-lg p-2"
                >
                  <td className="flex bg-cream rounded-lg items-center p-2 md:max-w-full  justify-center min-w-[40%] max-w-[40%]">
                    <Image className="h-36 object-contain lg:h-44" src={picture} />
                  </td>

                  <td>
                    <div className="flex flex-col h-full gap-2 font-anton overflow-hidden py-3 ">
                      <span className="font-semibold mr-5">{name}</span>
                      <span className="font-bold text-secondary-500 mt-auto">{formatBRL(priceTotal)}</span>
                      <span className="">Qtd: {qtd}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

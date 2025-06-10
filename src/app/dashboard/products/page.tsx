
export default function Page(){
  return <div>
    
  </div>
}
/* "use client";

import { useState } from "react";
import ProductForm from "./productForm/ProductForm";
import { ErrorWrapper, PopConfirm } from "@/components";
import { useScrollQuery } from "@/hooks";
import { Product } from "@/types";
import { Button, Image, Loading } from "@/ui";
import { formatBRL } from "@/helpers";
import { useDashboardQuery } from "../context/DashboardProvider";

export default function Page() {
  const [productForm, setProductForm] = useState<{ product: Product | undefined; isActive: boolean }>({
    product: undefined,
    isActive: false,
  });

  const [deleteProduct, setDeleteProduct] = useState({ error: "", id: "", isLoading: false });
  const { query } = useDashboardQuery();

  const closeEdit = () => setProductForm({ product: undefined, isActive: false });
  const closeDelete = () => setDeleteProduct({ error: "", id: "", isLoading: false });

  const {
    values: products,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    ref,
    refetch,
    error,
    isError,
  } = useScrollQuery<Product>({
    queryKey: ["dashboard-products", query],
    url: `/api/products?q=${query}`,
  });

  if (isLoading) return <Loading isPage={false} />;

  const fetchDelete = async () => {
    try {
      setDeleteProduct({ ...deleteProduct, isLoading: true });
      const data = await fetch(`/api/products/${deleteProduct.id}`, { method: "DELETE" });
      const response = await data.json();
      setDeleteProduct({ ...deleteProduct, isLoading: false });

      if (!data.ok) {
        setDeleteProduct({ ...deleteProduct, error: response.message });
        return;
      }

      setDeleteProduct({ id: "", isLoading: false, error: "" });
      refetch();
    } catch (error) {
      setDeleteProduct({ ...deleteProduct, error: "something went wrong :(" });
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      {productForm.isActive && <ProductForm refetch={refetch} product={productForm.product} onClose={closeEdit} />}
      {deleteProduct.id && (
        <PopConfirm
          confirm={fetchDelete}
          error={deleteProduct.error}
          isLoading={deleteProduct.isLoading}
          onClose={closeDelete}
        />
      )}

      <div className="flex justify-end sm:justify-center md:justify-end mb-4">
        <Button
          onClick={() => setProductForm({ product: undefined, isActive: true })}
          className="py-1 font-medium bg-primary"
        >
          Adicionar Produto
        </Button>
      </div>

      <ErrorWrapper error={isError} message={error?.message} refetch={refetch}>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-items-center">
          {products.length > 0 &&
            products.map((product) => {
              const variant = product.variants[0];
              const hasPromo = typeof variant.promotion === "number" && variant.promotion > 0;

              return (
                <div
                  key={`${product.id}_${product.name}`}
                  className="flex flex-col gap-3 w-full max-w-[250px] border border-muted bg-primary-550 rounded-xl h-72 md:h-80 transition-shadow hover:shadow-xl"
                >
                  <Image
                    src={product.picture}
                    className="h-40 w-full object-cover rounded-t-xl transition-transform duration-300 hover:scale-105"
                  />
                  <div className="flex flex-col w-full px-2">
                    <span className="font-medium first-letter:uppercase text-lg line-clamp-2">
                      {product.name} - {variant.name}
                    </span>

                    <div className="flex items-center gap-2 mt-1 text-secondary">
                      <div className="flex gap-1">
                        <span className="text-primary font-semibold text-base">
                          {formatBRL(hasPromo ? variant.promotion! : variant.price)}
                        </span>
                        {hasPromo && <span className="text-xs line-through">{formatBRL(variant.price)}</span>}
                      </div>
                      <span className="ml-auto font-medium line-clamp-2">{product.category}</span>
                    </div>
                  </div>

                  <div className="mt-auto grid grid-cols-2">
                    <Button
                      onClick={() => setDeleteProduct({ ...deleteProduct, id: product.id })}
                      className="rounded-bl-xl bg-accent text-dark py-1"
                    >
                      Deletar
                    </Button>
                    <Button onClick={() => setProductForm({ product, isActive: true })} className="rounded-br-xl py-1">
                      Editar
                    </Button>
                  </div>
                </div>
              );
            })}

          {isFetchingNextPage && <Loading isPage={false} />}
          {!isFetchingNextPage && hasNextPage && <div ref={ref} />}
        </div>
      </ErrorWrapper>
    </div>
  );
}
 */
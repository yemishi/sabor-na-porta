"use client";

import { useState } from "react";
import ProductForm from "./productForm/ProductForm";
import { ErrorWrapper, PopConfirm } from "@/components";
import { useScrollQuery } from "@/hooks";
import { Product } from "@/types";
import { Button, Image, Loading } from "@/ui";
import { formatBRL } from "@/helpers";
import { useDashboardQuery } from "../context/DashboardProvider";

export default function DashboardPage() {
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
      console.log("deleting product hodon...");

      const data = await fetch(`/api/products/${deleteProduct.id}`, { method: "DELETE" });
      const response = await data.json();
      setDeleteProduct({ ...deleteProduct, isLoading: false });

      if (!data.ok) {
        setDeleteProduct({ ...deleteProduct, error: response.message });
        return;
      }
      console.log("product deleted successfully :)");
      setDeleteProduct({ id: "", isLoading: false, error: "" });
      refetch();
      return;
    } catch (error) {
      setDeleteProduct({ ...deleteProduct, error: "something went wrong :(" });
    }
  };

  return (
    <div>
      {productForm.isActive && <ProductForm refetch={refetch} product={productForm.product} onClose={closeEdit} />}
      {deleteProduct.id && (
        <PopConfirm
          confirm={fetchDelete}
          error={deleteProduct.error}
          isLoading={deleteProduct.isLoading}
          onClose={closeDelete}
        />
      )}
      <div className="flex flex-col gap-4 p-4 md:w-[80%] self-center">
        <Button
          onClick={() => {
            setProductForm({ product: undefined, isActive: true });
          }}
          className="py-1 font-medium bg-primary ml-auto"
        >
          Adicionar Product
        </Button>
        <ErrorWrapper error={isError} message={error?.message} refetch={refetch}>
          <div className="flex flex-wrap  gap-4 items-center justify-center">
            {products.length > 0 &&
              products.map((product, i) => {
                const variant = product.variants[0];
                const hasPromo = typeof variant.promotion === "number" && variant.promotion > 0;

                return (
                  <div
                    className="flex flex-col gap-3 w-full border-primary-200 max-w-56 h-72 md:h-80 border-muted border-2 min-w-[170px]
                 bg-primary-550 rounded-xl md:min-w-[200px] md:max-w-[270px] "
                    key={`${product.id}_${product.name}`}
                  >
                    <Image src={product.picture} className="h-40 w-full md:h-48 flex  hover:scale-110   rounded-xl" />
                    <div className="flex flex-col  w-full pl-2 pr-1 ">
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

                    <span className="mt-auto grid grid-cols-2 gap-">
                      <Button
                        onClick={() => setDeleteProduct({ ...deleteProduct, id: product.id })}
                        className="rounded rounded-bl-xl bg-accent text-dark py-1"
                      >
                        Deletar
                      </Button>
                      <Button
                        onClick={() => setProductForm({ product, isActive: true })}
                        className="rounded py-1 rounded-br-xl"
                      >
                        Editar
                      </Button>
                    </span>
                  </div>
                );
              })}

            {isFetchingNextPage && <Loading isPage={false} />}
            {!isFetchingNextPage && hasNextPage && <div ref={ref} />}
          </div>
        </ErrorWrapper>
      </div>
    </div>
  );
}

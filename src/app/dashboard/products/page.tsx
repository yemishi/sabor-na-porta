"use client";

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

  const [deleteProduct, setDeleteProduct] = useState({ error: "", id: "", isLoading: false, name: "" });
  const { query } = useDashboardQuery();

  const closeEdit = () => setProductForm({ product: undefined, isActive: false });
  const closeDelete = () => setDeleteProduct({ error: "", id: "", isLoading: false, name: "" });

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

      setDeleteProduct({ id: "", isLoading: false, error: "", name: "" });
      refetch();
    } catch (error) {
      setDeleteProduct({ ...deleteProduct, error: "something went wrong :(" });
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4 flex flex-col">
      {productForm.isActive && <ProductForm refetch={refetch} product={productForm.product} onClose={closeEdit} />}
      {deleteProduct.id && (
        <PopConfirm
          confirm={fetchDelete}
          error={deleteProduct.error}
          isLoading={deleteProduct.isLoading}
          name={deleteProduct.name}
          onClose={closeDelete}
          desc="Você realmente deseja remover o produto"
        />
      )}

      <Button
        onClick={() => setProductForm({ product: undefined, isActive: true })}
        className="font-medium bg-green-600 ml-auto mb-4 md:text-lg md:font-semibold text-white"
      >
        Adicionar Produto
      </Button>

      <ErrorWrapper error={isError} message={error?.message} refetch={refetch}>
        <div className="flex flex-wrap gap-x-4 gap-y-7">
          {products.length > 0 &&
            products.map((product) => {
              const variant = product.variants[0];
              const hasPromo = typeof variant.promotion === "number" && variant.promotion > 0;

              return (
                <div
                  key={`${product.id}_${product.name}`}
                  onClick={() => setProductForm({ product, isActive: true })}
                  className="flex flex-col gap-3 w-full max-w-[250px] md:max-w-[280px] mx-auto  border border-muted bg-primary-550 rounded-xl h-72 md:h-80 transition-all shadow-secondary hover:shadow-lg animate-dropDown"
                >
                  <Image
                    src={product.picture}
                    className="h-40 w-full object-contain bg-gradient-to-b border-b border-muted from-secondary/30 rounded-t-xl"
                  />
                  <div className="flex flex-col w-full px-2 h-full">
                    <span className="font-medium first-letter:uppercase text-lg md:text-xl line-clamp-2">
                      {product.name} - {variant.name}
                    </span>

                    <div className="flex items-center gap-2 mt-auto">
                      <div className="flex gap-1">
                        <span className=" font-semibold text-base md:text-lg text-green-600">
                          {formatBRL(hasPromo ? variant.promotion! : variant.price)}
                        </span>
                        {hasPromo && (
                          <span className="text-xs md:text-sm line-through text-red-500">
                            {formatBRL(variant.price)}
                          </span>
                        )}
                      </div>
                      <span className="ml-auto font-medium line-clamp-2 md:text-lg text-primary">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteProduct({ ...deleteProduct, id: product.id, name: product.name });
                    }}
                    className="rounded-b-xl scale-100 mt-auto bg-rose-500 text-white md:text-lg py-1"
                  >
                    REMOVER
                  </Button>
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

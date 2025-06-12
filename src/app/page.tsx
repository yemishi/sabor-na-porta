"use client";

import { ErrorWrapper, ProductGrid } from "@/components";
import { useScrollQuery } from "@/hooks";
import { Product } from "@/types";
import { Image, Loading } from "@/ui";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import zoomIcon from "@/assets/icons/zoom.svg";
import { CategoryPicker, Search } from "./components";

export default function Page() {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const { data: categoryData, isLoading: loadingCategories } = useQuery({
    queryKey: ["products-categories"],
    queryFn: async () => {
      const res = await fetch("/api/products/categories");
      return res.json();
    },
  });
  const categories = categoryData?.categories ?? [];
  const {
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    ref,
    isError,
    error,
    values: products,
  } = useScrollQuery<Product>({
    url: `/api/products?${category === "promo" ? `promo=${true}` : `category=${category}`}&q=${search}`,
    queryKey: ["products", category, search],
  });
  return (
    <div className="flex flex-col md:flex-row md:gap-6 p-4 md:p-6">
      {loadingCategories ? (
        <div>
          <Loading className="mb-5" spinBorderColor="border-blue-500" isPage={false} />
        </div>
      ) : (
        <div className="md:w-[14rem] h-full flex-shrink-0 md:sticky md:mt-30 md:top-40 md:self-start">
          <CategoryPicker categories={categories as string[]} current={category} onChange={setCategory} />
        </div>
      )}
      <div className="w-full">
        <Search value={search} handleValue={(v: string) => setSearch(v)} />
        <ErrorWrapper error={isError} message={error?.message}>
          {isLoading ? (
            <div>
              <Loading className="mt-5" isPage={false} />
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                <div className="flex flex-col gap-3 flex-1 p-2 md:p-0">
                  <ProductGrid products={products} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-center text-muted mt-10">
                  <Image src={zoomIcon} className="size-12 opacity-50" />
                  <p className="text-lg md:text-xl font-medium">Nenhum produto encontrado</p>
                  <p className="text-sm md:text-base text-gray-500">Tente ajustar os filtros ou procurar por outro nome.</p>
                </div>
              )}
              {isFetchingNextPage && <Loading className="mt-5" isPage={false} />}
              {!isFetchingNextPage && hasNextPage && <div ref={ref} />}
            </>
          )}
        </ErrorWrapper>
      </div>
    </div>
  );
}

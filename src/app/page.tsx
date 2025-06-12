"use client";

import { ErrorWrapper, ProductGrid } from "@/components";
import { useScrollQuery } from "@/hooks";
import { Product } from "@/types";
import { Loading } from "@/ui";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CategoryPicker } from "./categoryPicker/CategoryPicker";

export default function Page() {
  const [category, setCategory] = useState("");
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
    url: `/api/products?${category === "promo" ? `promo=${true}` : `category=${category}`}`,
    queryKey: ["products", category],
  });
  if (isLoading) return <Loading isPage />;
  return (
    <div className="flex flex-col md:flex-row md:gap-6 p-4 md:p-6">
      <ErrorWrapper error={isError} message={error?.message}>
        {loadingCategories ? (
          <div>
            <Loading isPage={false} />
          </div>
        ) : (
          <div className="md:w-[14rem] h-full flex-shrink-0 md:sticky md:mt-30 md:top-40 md:self-start">
            <CategoryPicker categories={categories as string[]} current={category} onChange={setCategory} />
          </div>
        )}
        <div className="flex flex-col gap-3 flex-1 p-2 md:p-0">
          <ProductGrid products={products} />
        </div>

        {isFetchingNextPage && <Loading isPage={false} />}
        {!isFetchingNextPage && hasNextPage && <div ref={ref} />}
      </ErrorWrapper>
    </div>
  );
}

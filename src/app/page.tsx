"use client";

import { ErrorWrapper, ProductGrid } from "@/components";
import { useScrollQuery } from "@/hooks";
import { Product } from "@/types";
import { Loading } from "@/ui";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CategoryPicker } from "./categoryPicker/CategoryPicker";

export default function Page() {
  const [category, setCategory] = useState("");
  const { data: allProductsData, isLoading: loadingAll } = useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const res = await fetch("/api/products?highlights=true");
      return res.json();
    },
  });
  const allProducts = allProductsData?.products ?? [];

  const {
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    ref,
    isError,
    error,
    values: products,
  } = useScrollQuery<Product>({
    url: `/api/products?category=${category}&highlights=true`,
    queryKey: ["products", category],
  });

  const categories = useMemo(() => {
    if (loadingAll) return [];

    const unique = new Set(allProducts.map((p: { category: string }) => p.category).filter(Boolean));
    return Array.from(unique);
  }, [allProducts, loadingAll]);

  if (isLoading) return <Loading isPage />;
  return (
    <div className="flex flex-col md:flex-row md:gap-6 p-4 md:p-6">
    <CategoryPicker categories={categories as string[]} current={category} onChange={setCategory} />
    </div>
  );
}

"use client";

import { ErrorWrapper } from "@/components";
import { useScrollQuery } from "@/hooks";
import { Product } from "@/types";
import { Loading } from "@/ui";
import { useState } from "react";
import { ProductGrid } from "@/components";

export default function Page() {
  const [category, setCategory] = useState("");
  const {
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    ref,
    isError,
    error,
    values: products,
  } = useScrollQuery<Product>({
    url: `/api/products?category=${category}&highlights=${true}`,
    queryKey: ["products", category],
  });

  if (isLoading) return <Loading isPage={false} />;
  return (
    <div className="h-full w-full flex flex-col px-2">
      <ErrorWrapper error={isError} message={error?.message}>
        <ProductGrid products={products} />
        {isFetchingNextPage && <Loading isPage={false} />}
        {!isFetchingNextPage && hasNextPage && <div ref={ref} />}
      </ErrorWrapper>
    </div>
  );
}

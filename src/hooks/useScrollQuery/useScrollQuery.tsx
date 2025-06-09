"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";

type PageResponse<T> = {
  hasMore: boolean;
  data: T[];
};

type PropsType<T> = {
  url: string;
  queryKey: string[];
  stop?: boolean;
  enabled?: boolean;
};

export default function useScrollQuery<T>({ queryKey, url, stop, enabled = true }: PropsType<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchData = async (page: number): Promise<PageResponse<T>> => {
    const mark = url.includes("?") ? "&" : "?";
    const res = await fetch(`${url}${mark}page=${page - 1}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    return json;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, ...rest } = useInfiniteQuery<
    PageResponse<T>
  >({
    queryKey: [...queryKey, "infinite"],
    queryFn: ({ pageParam }) => fetchData(pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore && !stop ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    enabled,
  });

  const values = useMemo(() => {
    if (!data) return [];

    return data.pages.flatMap((page: any) => {
      const { hasMore, ...rest } = page;
      const list = Object.values(rest)[0];
      return Array.isArray(list) ? list : [];
    });
  }, [data]) as T[];
  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.current.observe(el);

    return () => {
      observer.current?.disconnect();
    };
  }, [ref.current, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    ref,
    values,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    ...rest,
  };
}

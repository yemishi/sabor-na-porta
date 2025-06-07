"use client";
import { createContext, useContext, useState, ReactNode } from "react";

const SearchContext = createContext<{
  query: string;
  setQuery: (val: string) => void;
} | null>(null);

export const DashBoardProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState("");

  return <SearchContext.Provider value={{ query, setQuery }}>{children}</SearchContext.Provider>;
};

export const useDashboardQuery = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within a SearchProvider");
  return ctx;
};

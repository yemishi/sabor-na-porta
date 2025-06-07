"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { clsMerge } from "@/helpers";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children?: ReactNode;
}

export default function Button({ children, isLoading, ...props }: ButtonProps) {
  const { className, ...rest } = props;
  const baseClasses = clsMerge(
    className,
    `cursor-pointer px-4 py-2 rounded-xl bg-primary text-white 
     hover:brightness-110 active:scale-90 transition-all disabled:opacity-50 disabled:pointer-events-none font-semibold ${
       isLoading ? "animate-pulse pointer-events-none" : ""
     }`
  );
  return (
    <button {...rest} className={baseClasses}>
      {children}
    </button>
  );
}

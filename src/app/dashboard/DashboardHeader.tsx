"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboardQuery } from "./context/DashboardProvider";
import { Image, Input } from "@/ui";
import { useState } from "react";
import minusIcon from "@/assets/icons/minus.svg";
import plusIcon from "@/assets/icons/plus.svg";

export default function DashboardHeader() {
  const pathname = usePathname();
  const [isSearch, setIsSearch] = useState(false);

  const links = [
    { href: "/dashboard/products", label: "Produtos" },
    { href: "/dashboard/orders", label: "Pedidos" },
    { href: "/dashboard/schedule", label: "Horários" },
  ];

  const getLabelByRoute = () => {
    if (pathname.startsWith("/dashboard/products")) return "Buscar produto";
    if (pathname.startsWith("/dashboard/orders")) return "Buscar pedido";
    return "Buscar";
  };
  const isSchedule = pathname.includes("schedule");
  const { setQuery, query } = useDashboardQuery();

  return (
    <header
      className={`sticky top-14 ${
        isSearch && !isSchedule ? "h-32 md:h-35" : "h-14 md:h-17"
      }  overflow-hidden md:top-20 max-w-2xl py-5 mx-auto md:rounded-b-3xl duration-200 md:shadow-lg z-2 backdrop-blur-lg bg-white/40 md:bg-dark px-4 
        gap-2 flex flex-col shadow-sm`}
    >
      <div className="flex items-center justify-center my-auto relative gap-3 md:gap-10">
        {!isSchedule && (
          <button
            className="absolute hover:rotate-180 transition-all cursor-pointer -right-2 bg-primary md:right-0 md:size-10 md:bg-cream rounded-full p-1 size-8"
            onClick={() => setIsSearch(!isSearch)}
          >
            <Image
              className="max-md:invert"
              src={isSearch ? minusIcon : plusIcon}
              alt={isSearch ? "Mostrar menos" : "Mostrar mais"}
            />
          </button>
        )}
        <nav aria-label="Dashboard navigation" className="space-x-3 md:space-x-5">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm md:text-lg rounded-lg transition-all
            ${
              isActive
                ? "bg-primary max-md:text-white font-semibold shadow-s md:bg-cream"
                : "text-dark md:text-white hover:text-primary bg-primary/5 md:bg-white/5"
            }
          `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {!isSchedule && (
        <div className="mt-4 md:bg-cream md:rounded-xl md:mt-6 max-w-md mx-auto w-full ">
          <Input
            value={query}
            className=""
            bgColor="opacity-0"
            onChange={(e) => setQuery(e.target.value)}
            label={getLabelByRoute()}
          />
        </div>
      )}
    </header>
  );
}

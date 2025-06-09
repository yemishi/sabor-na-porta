"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboardQuery } from "./context/DashboardProvider";
import { Input } from "@/ui";

export default function DashboardHeader() {
  const pathname = usePathname();

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
  const { setQuery, query } = useDashboardQuery();

  return (
    <header className=" gap-5 flex flex-col backdrop-blur-lg bg-white/40 md:bg-transparent z-0 px-4 py-3 shadow-sm sticky top-0">
      <nav className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-" aria-label="Dashboard navigation">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                ${isActive ? "text-primary border-b-2 border-primary pb-1" : "text-muted hover:text-primary"}
              font-medium transition-colors `}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      {!pathname.includes("schedule") && (
        <Input value={query} onChange={(e) => setQuery(e.target.value)} label={getLabelByRoute()} />
      )}
    </header>
  );
}

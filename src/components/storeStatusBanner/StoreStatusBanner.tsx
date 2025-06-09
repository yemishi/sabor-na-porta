"use client";

import { useQuery } from "@tanstack/react-query";
import { getStoreStatus } from "@/helpers";
import { Schedule } from "@/types";

export default function StoreStatusBar() {
  const { data, isLoading, isError } = useQuery<Schedule[]>({
    queryKey: ["storeSchedule"],
    queryFn: async () => {
      console.log("Buscando horários...");
      const res = await fetch("/api/schedule");
      if (!res.ok) {
        console.log("Erro ao tentar buscar horários de funcionamento </3");
        throw new Error("Failed to fetch schedule");
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const { open, message } = data ? getStoreStatus(data) : { open: false, message: "Carregando horário..." };

  const baseClass = `sticky top-16 md:top-20 z-2 w-full shadow-sm transition-colors md:w-[80%] md:rounded-b-xl md:mx-auto `;
  const commonBarStyle = `
    flex items-center justify-center gap-2 
    text-sm md:text-base 
    font-medium 
    px-4 md:px-6 
    py-2 md:py-3 
    md:h-14
  `;

  const pulseDot = (color: string) => `w-2 h-2 md:w-2.5 md:h-2.5 rounded-full animate-pulse ${color}`;

  if (isLoading) {
    return (
      <div className={`${baseClass} bg-white`}>
        <div className={`${commonBarStyle} text-gray-600`}>
          <span className={pulseDot("bg-gray-400")} />
          <span>Carregando horário...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`${baseClass} bg-red-100`}>
        <div className={`${commonBarStyle} text-red-800 text-center`}>Erro ao carregar horário de funcionamento.</div>
      </div>
    );
  }

  return (
    <div className={`${baseClass} ${open ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
      <div className={commonBarStyle}>
        <span className={pulseDot(open ? "bg-green-600" : "bg-red-400")} aria-hidden="true" />
        <span>{message}</span>
      </div>
    </div>
  );
}

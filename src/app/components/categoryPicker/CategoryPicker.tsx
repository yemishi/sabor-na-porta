"use client";
import { useRef } from "react";

type CategoryPickerProps = {
  categories: string[];
  current: string;
  onChange: (cat: string) => void;
};

export default function CategoryPicker({ categories, current, onChange }: CategoryPickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const handleMouseDown = (e: React.MouseEvent) => {
    isDown = true;
    startX = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft = scrollRef.current?.scrollLeft || 0;
  };

  const handleMouseLeave = () => {
    isDown = false;
  };

  const handleMouseUp = () => {
    isDown = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const baseClass =
    "px-5 py-2.5 rounded-full md:rounded-none md:bg-transparent cursor-pointer font-semibold whitespace-nowrap transition-all text-base md:text-lg";
  const isActiveClass = "bg-primary text-white shadow-sm md:shadow-none md:text-primary";
  const isInactiveClass = "bg-muted/20 text-dark/80 hover:bg-muted/30 md:hover:bg-transparent md:text-white";
  return (
    <div
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{ scrollbarWidth: "none" }}
      className={`
        flex gap-3 py-2  overflow-x-auto mb-4 md:divide-y md:divide-white/30 cursor-grab md:cursor-pointer active:cursor-grabbing md:active:cursor-pointer md:border md:border-dark/30
        md:flex-col md:overflow-x-hidden md:overflow-y-auto md:gap-4 md:bg-dark rounded-xl
        md:w-full md:max-h-[calc(100vh-120px)]
      `}
    >
      <button
        onClick={() => onChange("")}
        className={`${baseClass} ${current === "" ? isActiveClass : isInactiveClass}`}
      >
        Todas
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat.toLowerCase())}
          className={`${baseClass} ${cat === "promo" && current !== "promo" ? "glow-shadow" : ""} ${
            current.toLowerCase() === cat.toLowerCase() ? isActiveClass : isInactiveClass
          }          `}
        >
          {cat === "promo" ? "Promoções" : cat}
        </button>
      ))}
    </div>
  );
}

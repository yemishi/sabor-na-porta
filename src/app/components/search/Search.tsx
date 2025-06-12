import { Image } from "@/ui";
import { useState, useRef } from "react";
import zoomIcon from "@/assets/icons/zoom.svg";
import exit from "@/assets/icons/exit.svg";

export default function Search({ value, handleValue }: { handleValue: (value: string) => void; value: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    if (!value.trim()) {
      setIsExpanded(false);
    }
  };

  return (
    <div
      className={`flex cursor-pointer border border-muted/20 p-2 rounded-full overflow-hidden   h-10 transition-all duration-300 

          
        ${isExpanded ? "w-full bg-white shadow-sm" : "bg-secondary w-10"} `}
      onClick={() => {
        setIsExpanded(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }}
    >
      <Image src={zoomIcon} alt="magnifying glass" className={`w-5 mt-auto ${isExpanded ? "" : "invert"}`} />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => handleValue(e.target.value)}
        onBlur={handleBlur}
        className={`ml-2 bg-transparent  outline-none flex-1 text-sm transition-all duration-300 
          ${isExpanded ? "opacity-100 w-full" : "opacity-0 w-1 pointer-events-none"}`}
        placeholder="Procurar..."
      />
      {isExpanded && (
        <button onClick={() => handleValue("")}>
          <Image src={exit} alt="magnifying glass" className="w-4 ml-4 mr-1  brightness-0" />
        </button>
      )}
    </div>
  );
}

import { SelectHTMLAttributes, forwardRef } from "react";
import { clsMerge } from "@/helpers";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      {...props}
      className={clsMerge(
        className,
        `rounded-lg border border-primary/30 cursor-pointer bg-accent text-dark font-medium px-4 py-2
         text-sm md:text-base shadow-sm
         focus:ring-2 focus:ring-secondary focus:border-secondary focus:outline-none
         transition-all duration-150 ease-in-out
         disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary`
      )}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;

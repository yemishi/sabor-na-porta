import { formatBRL } from "@/helpers";
import { AddOn, AddOnGroup, OrderAddons } from "@/types";
import { Dispatch, SetStateAction } from "react";

interface AddOnSelectorProps {
  addons: AddOnGroup[];
  setSelectedAddons: Dispatch<SetStateAction<OrderAddons[]>>;
  selectedAddons: OrderAddons[];
  errors: { title: string; message?: string }[];
}

export default function AddOnSelector({ addons, setSelectedAddons, selectedAddons, errors }: AddOnSelectorProps) {
  const toggleAddon = (title: string, addon: AddOn) => {
    setSelectedAddons((prev) => {
      const addonGroup = addons.find((a) => a.title === title);
      if (!addonGroup) return prev;

      const currentGroup = prev.find((a) => a.title === title);

      const isMultiple = addonGroup.type === "multiple";

      if (!currentGroup) {
        return [...prev, { title, options: [addon] }];
      }

      const exists = currentGroup.options.some((o) => o.name === addon.name);

      if (isMultiple) {
        const updatedOptions = exists
          ? currentGroup.options.filter((o) => o.name !== addon.name)
          : [...currentGroup.options, addon];

        return updatedOptions.length === 0
          ? prev.filter((g) => g.title !== title)
          : prev.map((g) => (g.title === title ? { ...g, options: updatedOptions } : g));
      } else {
        return exists
          ? prev.filter((g) => g.title !== title)
          : prev.map((g) => (g.title === title ? { ...g, options: [addon] } : g));
      }
    });
  };

  return (
    <div className="space-y-6">
      {addons.map((group) => {
        const currentGroup = selectedAddons.find((a) => a.title === group.title);
        const error = errors.find((e) => e.title === group.title);
        return (
          <div key={group.title}>
            <span className="flex items-center gap-1 mb-1">
              <h4 className="text-lg font-semibold text-dark flex items-center gap-1">
                {group.title}
                {group.required && <span className="text-red-600">*</span>}
              </h4>

              {error && <p className="text-sm text-red-600">{error.message}</p>}
            </span>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {group.options.map((addon) => {
                const isSelected = currentGroup?.options.some((o) => o.name === addon.name);
                return (
                  <button
                    key={addon.name}
                    onClick={() => toggleAddon(group.title, addon)}
                    className={`flex justify-between items-center p-3 rounded-lg border transition-all text-left
                    ${isSelected ? "bg-primary/10 border-primary text-primary" : "bg-card border-dark/20 text-dark"}
                    hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium md:text-lg">{addon.name}</span>
                      <span className="text-sm text-dark md:text-base">
                        {addon.price ? formatBRL(addon.price) : "Gratis"}
                      </span>
                    </div>
                    <div
                      className={`size-5 rounded border border-dark/20 flex items-center justify-center ${
                        isSelected ? "bg-primary text-white" : "bg-white"
                      }`}
                    >
                      {isSelected && <span className="text-sm font-bold">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

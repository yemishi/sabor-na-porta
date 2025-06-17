import { Product } from "@/types";
import { ProductCard } from "@/components";

type Props = {
  products: Product[];
};

export default function ProductGrid({ products }: Props) {
  const highlightedVariants = products.flatMap((product) => {
    if (!product.highlights || !product.variants) return [];

    return product.highlights
      .map((variantId) => {
        const variant = product.variants.find((v) => v.id === variantId);
        if (!variant) return null;

        return {
          ...product,
          variant,
        };
      })
      .filter(Boolean) as Array<Product & { variant: any }>;
  });

  const groupedByCategory = highlightedVariants.reduce<Record<string, Array<Product & { variant: any }>>>(
    (acc, item) => {
      const category = item.category || "Sem categoria 😬";
      if (!acc[category]) acc[category] = [];

      acc[category].push(item);
      return acc;
    },
    {}
  );

  return Object.entries(groupedByCategory).map(([category, items]) => (
    <section key={category} className="mb-10">
      <h2 className="title">{category}</h2>
      <div
        className="flex md:py-2 flex-wrap md:flex-col gap-x-2 gap-y-15 md:gap-y-4
      md:bg-dark md:text-white md:p-4 md:rounded-xl md:border min-[400]:grid min-[400]:grid-cols-2 min-[500]:flex  md:border-white/30"
      >
        {items.map((item, i) => {
          return (
            <ProductCard
              className={i > 0 ? "md:border-b-0 md:border-x-0 md:border-t md:border-white/50" : "md:border-none"}
              key={`${item.id}-${item.variant.id}-${i}`}
              variant={item.variant}
              product={{ ...item }}
            />
          );
        })}
      </div>
    </section>
  ));
}

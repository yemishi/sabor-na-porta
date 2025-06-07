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
      <h2 className="text-xl font-bold mb-4 text-primary">{category}</h2>
      <div className="max-[385]:grid max-[385]:grid-cols-2 flex flex-wrap  gap-4">
        {items.map((item, i) => {
          return (
            <ProductCard key={`${item.id}-${item.variant.id}-${i}`} variant={item.variant} product={{ ...item }} />
          );
        })}
      </div>
    </section>
  ));
}

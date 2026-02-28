import { ProductCard } from "./ProductCard";
import type { ProductWithBrand } from "@/types";

export function ProductGrid({ products }: { products: ProductWithBrand[] }) {
  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-16 text-muted-foreground">
        <p className="text-lg">Няма намерени продукти.</p>
        <p className="text-sm mt-1">Опитайте да промените филтрите.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

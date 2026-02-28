import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Brand } from "@/types";

interface BrandFilterProps {
  brands: Brand[];
  currentBrand?: string;
  currentCategory?: string;
  currentSort?: string;
}

export function BrandFilter({
  brands,
  currentBrand,
  currentCategory,
  currentSort,
}: BrandFilterProps) {
  const buildUrl = (slug?: string) => {
    const params = new URLSearchParams();
    if (currentCategory) params.set("category", currentCategory);
    if (slug) params.set("brand", slug);
    if (currentSort) params.set("sort", currentSort);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={buildUrl()}
        className={cn(
          "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
          !currentBrand
            ? "bg-primary text-primary-foreground border-primary"
            : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
        )}
      >
        Всички
      </Link>
      {brands.map((b) => (
        <Link
          key={b.id}
          href={buildUrl(b.slug)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
            currentBrand === b.slug
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
          )}
        >
          {b.name}
        </Link>
      ))}
    </div>
  );
}

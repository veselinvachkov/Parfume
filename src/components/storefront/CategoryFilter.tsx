import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  currentCategory?: string;
  currentSort?: string;
}

const CATEGORIES = [
  { value: undefined, label: "Всички" },
  { value: "parfum", label: "Парфюми" },
  { value: "cosmetic", label: "Козметика" },
] as const;

export function CategoryFilter({ currentCategory, currentSort }: CategoryFilterProps) {
  const buildUrl = (category?: string) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (currentSort) params.set("sort", currentSort);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  };

  return (
    <div className="flex gap-2">
      {CATEGORIES.map(({ value, label }) => (
        <Link
          key={label}
          href={buildUrl(value)}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium border transition-colors",
            currentCategory === value
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
          )}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}

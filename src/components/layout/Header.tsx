"use client";

import Link from "next/link";
import { ShoppingBag, FlowerIcon, Gift } from "lucide-react";
import { useCartStore } from "@/stores/cart";
import { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: undefined, label: "Всички" },
  { value: "parfum", label: "Парфюми" },
  { value: "cosmetic", label: "Козметика" },
] as const;

export function Header() {
  const [hydrated, setHydrated] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => setHydrated(true), []);

  const currentCategory = searchParams.get("category") ?? undefined;
  const isHome = pathname === "/";

  const buildCategoryUrl = (category?: string) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-3 items-center">

        {/* Left: logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <FlowerIcon className="h-5 w-5 text-primary" />
          <span>Ароматно Магазинче</span>
        </Link>

        {/* Center: category nav */}
        <nav className="flex items-center justify-center gap-1">
          {CATEGORIES.map(({ value, label }) => {
            const active = isHome && currentCategory === value;
            return (
              <Link
                key={label}
                href={buildCategoryUrl(value)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {label}
              </Link>
            );
          })}

          <Link
            href="/sedmichno-predlozhenie"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors whitespace-nowrap",
              pathname === "/sedmichno-predlozhenie"
                ? "bg-amber-500 text-white"
                : "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
            )}
          >
            <Gift className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden md:inline">Седмично предложение</span>
            <span className="md:hidden">Оферта</span>
          </Link>
        </nav>

        {/* Right: За нас + cart — grouped flush right */}
        <div className="flex items-center justify-end gap-2">
          <Link
            href="/za-nas"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline px-3 py-1.5 rounded-md hover:bg-muted"
          >
            За нас
          </Link>

          <Button variant="ghost" size="sm" asChild className="relative">
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              {hydrated && totalItems() > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {totalItems()}
                </Badge>
              )}
              <span className="ml-2 hidden sm:inline">Количка</span>
            </Link>
          </Button>
        </div>

      </div>
    </header>
  );
}

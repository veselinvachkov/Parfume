"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/cart";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const [hydrated, setHydrated] = useState(false);
  const items = useCartStore((s) => s.items);

  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading cart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Продължи пазаруването
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Количка</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <p className="text-lg font-medium">Вашата количка e празна</p>
          <p className="text-muted-foreground text-sm">
            Добавете някои аромати, за да започнете.
          </p>
          <Button asChild variant="outline">
            <Link href="/">Разгледайте продуктите</Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {items.map((item) => (
              <CartLineItem key={item.productId} item={item} />
            ))}
          </div>
          <div>
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}

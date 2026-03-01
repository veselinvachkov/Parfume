"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/stores/cart";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingBag, ArrowLeft, Gift, Package, Trash2 } from "lucide-react";

export default function CartPage() {
  const [hydrated, setHydrated] = useState(false);
  const items = useCartStore((s) => s.items);
  const bundles = useCartStore((s) => s.bundles);
  const removeBundle = useCartStore((s) => s.removeBundle);
  const updateBundleQuantity = useCartStore((s) => s.updateBundleQuantity);

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

  const isEmpty = items.length === 0 && bundles.length === 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Продължи пазаруването
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Количка</h1>
      </div>

      {isEmpty ? (
        <div className="text-center py-16 space-y-4">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <p className="text-lg font-medium">Вашата количка e празна</p>
          <p className="text-muted-foreground text-sm">Добавете някои аромати, за да започнете.</p>
          <Button asChild variant="outline">
            <Link href="/">Разгледайте продуктите</Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Regular items */}
            {items.length > 0 && (
              <div>
                {items.map((item) => (
                  <CartLineItem key={item.productId} item={item} />
                ))}
              </div>
            )}

            {/* Bundle items */}
            {bundles.map((bundle) => (
              <div key={bundle.offerId} className="rounded-xl border-2 border-amber-200 bg-amber-50/50 dark:bg-amber-950/10 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 bg-amber-100/60 dark:bg-amber-900/20 border-b border-amber-200">
                  <Gift className="h-4 w-4 text-amber-600 shrink-0" />
                  <span className="font-semibold text-sm flex-1">{bundle.title}</span>
                  <Badge className="bg-amber-500 text-white text-xs">Пакет</Badge>
                </div>

                <div className="divide-y divide-amber-100">
                  {bundle.products.map((p) => (
                    <div key={p.productId} className="flex items-center gap-3 px-5 py-3">
                      <div className="h-10 w-10 rounded border bg-white overflow-hidden shrink-0 flex items-center justify-center">
                        {bundle.coverImageUrl && !p.isGift ? (
                          <Image src={bundle.coverImageUrl} alt={p.name} width={40} height={40}
                            className="object-cover w-full h-full" unoptimized />
                        ) : (
                          <Package className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <span className="flex-1 text-sm">{p.name}</span>
                      {p.isGift ? (
                        <Badge className="bg-amber-500 text-white text-xs">Подарък</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">{p.unitPrice.toFixed(2)} лв.</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between px-5 py-3 border-t border-amber-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Брой:</span>
                    <Input
                      type="number"
                      min={1}
                      max={99}
                      value={bundle.quantity}
                      onChange={(e) => updateBundleQuantity(bundle.offerId, parseInt(e.target.value, 10))}
                      className="w-16 text-center h-8"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{(bundle.comboPrice * bundle.quantity).toFixed(2)} лв.</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeBundle(bundle.offerId)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
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

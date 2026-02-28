"use client";

import Link from "next/link";
import { useCartStore } from "@/stores/cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  readOnly?: boolean;
}

export function CartSummary({ readOnly = false }: CartSummaryProps) {
  const totalItems = useCartStore((s) => s.totalItems);
  const totalPrice = useCartStore((s) => s.totalPrice);

  return (
    <div className="rounded-lg border p-6 space-y-4 bg-muted/30">
      <h2 className="font-semibold text-lg">Обобщение на поръчката</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Артикули ({totalItems()})</span>
          <span>${totalPrice().toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Доставка</span>
          <span className="text-green-600">Безплатна</span>
        </div>
      </div>
      <Separator />
      <div className="flex justify-between font-semibold">
        <span>Общо</span>
        <span>${totalPrice().toFixed(2)}</span>
      </div>
      {!readOnly && (
        <Button className="w-full" asChild disabled={totalItems() === 0}>
          <Link href="/checkout">Продължи към поръчка</Link>
        </Button>
      )}
    </div>
  );
}

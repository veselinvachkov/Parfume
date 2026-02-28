"use client";

import Image from "next/image";
import { useCartStore } from "@/stores/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ImageIcon } from "lucide-react";
import type { CartItem } from "@/stores/cart";

export function CartLineItem({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-center gap-4 py-4 border-b last:border-0">
      <div className="w-16 h-16 rounded-md border bg-muted overflow-hidden shrink-0 flex items-center justify-center">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={64}
            height={64}
            className="object-cover w-full h-full"
            unoptimized
          />
        ) : (
          <ImageIcon className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{item.name}</p>
        <p className="text-sm text-muted-foreground">
          ${item.price.toFixed(2)} бр.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={1}
          max={99}
          value={item.quantity}
          onChange={(e) =>
            updateQuantity(item.productId, parseInt(e.target.value, 10))
          }
          className="w-16 text-center"
        />
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => removeItem(item.productId)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="w-20 text-right font-medium">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
}

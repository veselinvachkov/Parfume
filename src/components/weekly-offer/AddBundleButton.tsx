"use client";

import { useCartStore } from "@/stores/cart";
import { Button } from "@/components/ui/button";
import { ShoppingBag, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { CartBundleProduct } from "@/types";

interface Props {
  offerId: number;
  title: string;
  comboPrice: number;
  stock: number;
  coverImageUrl: string | null;
  products: CartBundleProduct[];
}

export function AddBundleButton({ offerId, title, comboPrice, stock, coverImageUrl, products }: Props) {
  const addBundle = useCartStore((s) => s.addBundle);
  const bundles = useCartStore((s) => s.bundles);
  const [added, setAdded] = useState(false);

  const inCart = bundles.find((b) => b.offerId === offerId);
  const outOfStock = stock <= 0;

  function handleAdd() {
    addBundle({ offerId, title, comboPrice, coverImageUrl, products });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (outOfStock) {
    return (
      <Button size="lg" disabled className="w-full sm:w-auto">
        Изчерпано
      </Button>
    );
  }

  if (added || inCart) {
    return (
      <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-green-600 border-green-600" disabled={!!added}>
        <CheckCircle2 className="h-5 w-5" />
        {added ? "Добавено!" : `В количката (${inCart!.quantity} бр.)`}
      </Button>
    );
  }

  return (
    <Button size="lg" onClick={handleAdd} className="w-full sm:w-auto gap-2">
      <ShoppingBag className="h-5 w-5" />
      Добави пакета в количката
    </Button>
  );
}

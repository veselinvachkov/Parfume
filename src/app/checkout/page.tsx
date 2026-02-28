"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/cart";
import { CartSummary } from "@/components/cart/CartSummary";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export default function CheckoutPage() {
  const [hydrated, setHydrated] = useState(false);
  const items = useCartStore((s) => s.items);

  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center space-y-4">
        <p className="text-lg font-medium">Вашата количка е празна</p>
        <Button asChild variant="outline">
          <Link href="/">Разгледайте продуктите</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Toaster />
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Към количката
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Плащане</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Информация за доставка</h2>
            <Separator className="mb-6" />
            <CheckoutForm />
          </div>
        </div>
        <div>
          <CartSummary readOnly />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/stores/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, ImageIcon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { ProductWithBrand } from "@/types";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductWithBrand | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetch(`/api/products?slug=${params.slug}`)
      .then((r) => r.json())
      .then((data: { products: ProductWithBrand[] }) => {
        const found = data.products.find((p) => p.slug === params.slug);
        setProduct(found ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
        <Skeleton className="aspect-square rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
    return null;
  }

  function handleAddToCart() {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      });
    }
    toast.success(`${product.name} добавен в количката`);
  }

  const inStock = product.stock > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад към каталога
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square rounded-xl border bg-muted overflow-hidden relative">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-3">
              {product.brandName ?? "Неизвестна марка"}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          </div>

          <p className="text-3xl font-semibold text-primary">
            ${product.price.toFixed(2)}
          </p>

          {product.description && (
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="flex items-center gap-2">
            {inStock ? (
              <Badge variant="outline" className="text-green-600 border-green-200">
                В наличност ({product.stock} налични)
              </Badge>
            ) : (
              <Badge variant="destructive">Изчерпан</Badge>
            )}
          </div>

          {inStock && (
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-md">
                <button
                  className="px-3 py-2 text-sm hover:bg-muted transition-colors"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm font-medium w-12 text-center">
                  {quantity}
                </span>
                <button
                  className="px-3 py-2 text-sm hover:bg-muted transition-colors"
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                >
                  +
                </button>
              </div>
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingBag className="h-5 w-5 mr-2" />
                Добави в количката
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

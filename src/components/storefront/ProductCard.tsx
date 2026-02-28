import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "lucide-react";
import type { ProductWithBrand } from "@/types";

export function ProductCard({ product }: { product: ProductWithBrand }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <Card className="overflow-hidden h-full transition-shadow hover:shadow-md">
        <div className="aspect-square bg-muted relative overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <Badge variant="secondary">Изчерпан</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4 pb-2">
          <Badge variant="outline" className="text-xs mb-2">
            {product.brandName ?? "Неизвестна"}
          </Badge>
          <h3 className="font-medium leading-tight line-clamp-2">{product.name}</h3>
        </CardContent>
        <CardFooter className="px-4 pb-4">
          <span className="font-semibold text-primary">
            ${product.price.toFixed(2)}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}

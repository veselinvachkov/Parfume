import { db } from "@/db";
import { brands, products } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { ProductTable } from "@/components/admin/ProductTable";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import type { ProductWithBrand } from "@/types";

export default async function AdminProductsPage() {
  const rows = await db
    .select({
      id: products.id,
      brandId: products.brandId,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      stock: products.stock,
      imageUrl: products.imageUrl,
      category: products.category,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      brandName: brands.name,
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .orderBy(asc(brands.name), asc(products.name));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Продукти</h1>
          <p className="text-muted-foreground">{rows.length} продукта</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/api/export/products">
              <Download className="h-4 w-4 mr-2" />
              Експорт CSV
            </a>
          </Button>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Добавяне на продукт
            </Link>
          </Button>
        </div>
      </div>

      <ProductTable products={rows as ProductWithBrand[]} />
    </div>
  );
}

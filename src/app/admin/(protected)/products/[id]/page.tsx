export const dynamic = "force-dynamic";

import { db } from "@/db";
import { brands, products } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import type { ProductWithBrand } from "@/types";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  const [[row], allBrands] = await Promise.all([
    db
      .select({
        id: products.id,
        brandId: products.brandId,
        name: products.name,
        slug: products.slug,
        description: products.description,
        price: products.price,
        stock: products.stock,
        imageUrl: products.imageUrl,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        brandName: brands.name,
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(eq(products.id, productId)),
    db.select().from(brands).orderBy(asc(brands.name)),
  ]);

  if (!row) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Редактиране на продукт</h1>
        <p className="text-muted-foreground">{row.name}</p>
      </div>
      <ProductForm product={row as ProductWithBrand} brands={allBrands} />
    </div>
  );
}

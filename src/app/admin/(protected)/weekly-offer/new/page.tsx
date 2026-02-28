import { db } from "@/db";
import { brands, products } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { WeeklyOfferForm } from "@/components/admin/WeeklyOfferForm";
import type { ProductWithBrand } from "@/types";

export const dynamic = "force-dynamic";

export default async function NewWeeklyOfferPage() {
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ново седмично предложение</h1>
        <p className="text-muted-foreground">Изберете продукти за комбо и безплатен подарък.</p>
      </div>
      <WeeklyOfferForm products={rows as ProductWithBrand[]} />
    </div>
  );
}

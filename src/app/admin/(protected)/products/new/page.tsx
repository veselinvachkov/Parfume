export const dynamic = "force-dynamic";

import { db } from "@/db";
import { brands } from "@/db/schema";
import { asc } from "drizzle-orm";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const allBrands = await db.select().from(brands).orderBy(asc(brands.name));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Добавяне на продукт</h1>
        <p className="text-muted-foreground">Добавете нов парфюм към каталога</p>
      </div>
      <ProductForm brands={allBrands} />
    </div>
  );
}

export const dynamic = "force-dynamic";

import { db } from "@/db";
import { brands } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { BrandForm } from "@/components/admin/BrandForm";

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brandId = parseInt(id, 10);

  const [brand] = await db
    .select()
    .from(brands)
    .where(eq(brands.id, brandId));

  if (!brand) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Редактиране на марка</h1>
        <p className="text-muted-foreground">{brand.name}</p>
      </div>
      <BrandForm brand={brand} />
    </div>
  );
}

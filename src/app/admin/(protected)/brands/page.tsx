export const dynamic = "force-dynamic";

import { db } from "@/db";
import { brands } from "@/db/schema";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { BrandTable } from "@/components/admin/BrandTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminBrandsPage() {
  const allBrands = await db.select().from(brands).orderBy(asc(brands.name));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Марки</h1>
          <p className="text-muted-foreground">{allBrands.length} марки общо</p>
        </div>
        <Button asChild>
          <Link href="/admin/brands/new">
            <Plus className="h-4 w-4 mr-2" />
            Добавяне на марка
          </Link>
        </Button>
      </div>
      <BrandTable brands={allBrands} />
    </div>
  );
}

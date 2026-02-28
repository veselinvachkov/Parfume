export const dynamic = "force-dynamic";

import { BrandForm } from "@/components/admin/BrandForm";

export default function NewBrandPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Добавяне на марка</h1>
        <p className="text-muted-foreground">Създайте нова марка на аромат</p>
      </div>
      <BrandForm />
    </div>
  );
}

import { db } from "@/db";
import { weeklyOffers, weeklyOfferProducts, products, brands } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Gift } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WeeklyOfferAdminPage() {
  const offers = await db
    .select()
    .from(weeklyOffers)
    .orderBy(desc(weeklyOffers.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Седмично предложение</h1>
          <p className="text-muted-foreground">{offers.length} предложения</p>
        </div>
        <Button asChild>
          <Link href="/admin/weekly-offer/new">
            <Plus className="h-4 w-4 mr-2" />
            Ново предложение
          </Link>
        </Button>
      </div>

      {offers.length === 0 && (
        <div className="rounded-xl border-2 border-dashed p-12 text-center">
          <Gift className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Няма създадени предложения</p>
          <Button asChild className="mt-4" variant="outline">
            <Link href="/admin/weekly-offer/new">Създай първото</Link>
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="flex items-center justify-between rounded-lg border px-5 py-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{offer.title}</span>
                {offer.isActive && (
                  <Badge className="bg-green-500 text-white text-xs">Активно</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {offer.comboPrice.toFixed(2)} лв.
                {offer.startsAt && ` · ${offer.startsAt.slice(0, 10)}`}
                {offer.endsAt && ` – ${offer.endsAt.slice(0, 10)}`}
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/weekly-offer/${offer.id}`}>
                <Pencil className="h-4 w-4 mr-1.5" />
                Редактирай
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { db } from "@/db";
import { weeklyOffers, weeklyOfferProducts, products, brands } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import Image from "next/image";
import { Gift, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Седмично предложение + подарък – Aromaten",
  description:
    "Специална седмична оферта с безплатен подарък от Aromaten. Не пропускайте!",
};

export default async function SedmichnoPredlozheniePage() {
  // Find the active offer
  const [offer] = await db
    .select()
    .from(weeklyOffers)
    .where(eq(weeklyOffers.isActive, true))
    .limit(1);

  if (!offer) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="flex items-center gap-3">
          <Gift className="h-8 w-8 text-amber-500" />
          <h1 className="text-3xl font-bold tracking-tight">
            Седмично предложение + подарък
          </h1>
        </div>
        <div className="rounded-xl border-2 border-dashed border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-10 text-center">
          <Gift className="h-12 w-12 text-amber-400 mx-auto mb-4" />
          <p className="text-lg font-semibold text-amber-700 dark:text-amber-400">
            Предстои ни скоро!
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Следете ни в Instagram и Facebook за анонса.
          </p>
        </div>
      </div>
    );
  }

  // Fetch the offer's products
  const items = await db
    .select({
      id: weeklyOfferProducts.id,
      productId: weeklyOfferProducts.productId,
      isGift: weeklyOfferProducts.isGift,
      name: products.name,
      price: products.price,
      imageUrl: products.imageUrl,
      slug: products.slug,
      brandName: brands.name,
    })
    .from(weeklyOfferProducts)
    .leftJoin(products, eq(weeklyOfferProducts.productId, products.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(eq(weeklyOfferProducts.offerId, offer.id))
    .orderBy(asc(weeklyOfferProducts.isGift));

  const comboItems = items.filter((i) => !i.isGift);
  const giftItem = items.find((i) => i.isGift);
  const regularTotal = comboItems.reduce((s, i) => s + (i.price ?? 0), 0);
  const savings = regularTotal - offer.comboPrice;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Gift className="h-8 w-8 text-amber-500" />
          <h1 className="text-3xl font-bold tracking-tight">{offer.title}</h1>
        </div>
        {offer.startsAt && offer.endsAt && (
          <p className="text-sm text-muted-foreground">
            {offer.startsAt.slice(0, 10)} – {offer.endsAt.slice(0, 10)}
          </p>
        )}
        {offer.description && (
          <p className="text-muted-foreground leading-relaxed">{offer.description}</p>
        )}
      </div>

      {/* Combo products */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Продукти в комбото</h2>
        <div className="divide-y border rounded-xl overflow-hidden">
          {comboItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4">
              <div className="h-16 w-16 rounded-md border bg-muted overflow-hidden shrink-0">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name ?? ""}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                ) : (
                  <Package className="h-7 w-7 m-4.5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.brandName}</p>
              </div>
              <p className="font-semibold shrink-0">{item.price?.toFixed(2)} лв.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gift product */}
      {giftItem && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Gift className="h-5 w-5 text-amber-500" />
            Безплатен подарък
          </h2>
          <div className="flex items-center gap-4 px-5 py-4 rounded-xl border-2 border-amber-300 bg-amber-50 dark:bg-amber-950/20">
            <div className="h-16 w-16 rounded-md border bg-white overflow-hidden shrink-0">
              {giftItem.imageUrl ? (
                <Image
                  src={giftItem.imageUrl}
                  alt={giftItem.name ?? ""}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <Package className="h-7 w-7 m-4.5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{giftItem.name}</p>
              <p className="text-sm text-muted-foreground">{giftItem.brandName}</p>
            </div>
            <div className="text-right shrink-0 space-y-1">
              <Badge className="bg-amber-500 text-white">БЕЗПЛАТНО</Badge>
              <p className="text-sm line-through text-muted-foreground">
                {giftItem.price?.toFixed(2)} лв.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Pricing summary */}
      <section className="rounded-xl bg-primary/5 border border-primary/20 p-6 space-y-3">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Редовна цена</span>
          <span className="line-through">{regularTotal.toFixed(2)} лв.</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-sm text-green-600 font-medium">
            <span>Спестявате</span>
            <span>-{savings.toFixed(2)} лв.</span>
          </div>
        )}
        <div className="flex justify-between text-xl font-bold border-t pt-3">
          <span>Цена на комбото</span>
          <span>{offer.comboPrice.toFixed(2)} лв.</span>
        </div>
      </section>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg" asChild>
          <Link href="/cart">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Към количката
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a href="tel:+359888745410">Обади се за поръчка</a>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        * Офертата е валидна до изчерпване на количествата. За повече информация се свържете с нас.
      </p>
    </div>
  );
}

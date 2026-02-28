import { db } from "@/db";
import { brands, products, weeklyOffers, weeklyOfferProducts } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { WeeklyOfferForm } from "@/components/admin/WeeklyOfferForm";
import type { ProductWithBrand, WeeklyOfferWithProducts } from "@/types";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditWeeklyOfferPage({ params }: Props) {
  const { id } = await params;
  const offerId = Number(id);

  const [offer] = await db
    .select()
    .from(weeklyOffers)
    .where(eq(weeklyOffers.id, offerId));

  if (!offer) notFound();

  const offerItems = await db
    .select({
      id: weeklyOfferProducts.id,
      offerId: weeklyOfferProducts.offerId,
      productId: weeklyOfferProducts.productId,
      isGift: weeklyOfferProducts.isGift,
      product: {
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
      },
    })
    .from(weeklyOfferProducts)
    .leftJoin(products, eq(weeklyOfferProducts.productId, products.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(eq(weeklyOfferProducts.offerId, offerId));

  const allProducts = await db
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

  const offerWithProducts: WeeklyOfferWithProducts = {
    ...offer,
    items: offerItems.map((item) => ({
      id: item.id,
      offerId: item.offerId,
      productId: item.productId,
      isGift: item.isGift,
      product: item.product as ProductWithBrand,
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Редактиране на предложение</h1>
        <p className="text-muted-foreground">{offer.title}</p>
      </div>
      <WeeklyOfferForm
        products={allProducts as ProductWithBrand[]}
        offer={offerWithProducts}
      />
    </div>
  );
}

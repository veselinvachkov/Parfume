import { NextResponse } from "next/server";
import { db } from "@/db";
import { weeklyOffers, weeklyOfferProducts, products, brands } from "@/db/schema";
import { eq, asc, inArray } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";

interface Ctx {
  params: Promise<{ id: string }>;
}

// ── GET /api/weekly-offer/[id] ───────────────────────────────────────────────

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const offerId = Number(id);

  const [offer] = await db
    .select()
    .from(weeklyOffers)
    .where(eq(weeklyOffers.id, offerId));

  if (!offer) return NextResponse.json({ error: "Не е намерено" }, { status: 404 });

  const offerProducts = await db
    .select({
      id: weeklyOfferProducts.id,
      offerId: weeklyOfferProducts.offerId,
      productId: weeklyOfferProducts.productId,
      isGift: weeklyOfferProducts.isGift,
      productName: products.name,
      productPrice: products.price,
      productImageUrl: products.imageUrl,
      brandName: brands.name,
    })
    .from(weeklyOfferProducts)
    .leftJoin(products, eq(weeklyOfferProducts.productId, products.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(eq(weeklyOfferProducts.offerId, offerId))
    .orderBy(asc(weeklyOfferProducts.isGift));

  return NextResponse.json({ ...offer, items: offerProducts });
}

// ── PUT /api/weekly-offer/[id] ───────────────────────────────────────────────

export async function PUT(req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const offerId = Number(id);

  const body = await req.json() as {
    title: string;
    description?: string;
    comboPrice: number;
    stock: number;
    isActive: boolean;
    startsAt?: string;
    endsAt?: string;
    productIds: number[];
    giftProductId: number;
  };

  const { title, description, comboPrice, stock, isActive, startsAt, endsAt, productIds, giftProductId } = body;

  const [existing] = await db.select().from(weeklyOffers).where(eq(weeklyOffers.id, offerId));
  if (!existing) return NextResponse.json({ error: "Не е намерено" }, { status: 404 });

  const [updated] = await db.transaction(async (tx) => {
    if (isActive) {
      await tx
        .update(weeklyOffers)
        .set({ isActive: false, updatedAt: new Date().toISOString() });
    }

    const result = await tx
      .update(weeklyOffers)
      .set({
        title,
        description: description ?? null,
        comboPrice,
        stock: stock ?? 0,
        isActive,
        startsAt: startsAt ?? null,
        endsAt: endsAt ?? null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(weeklyOffers.id, offerId))
      .returning();

    // Replace all product associations
    await tx.delete(weeklyOfferProducts).where(eq(weeklyOfferProducts.offerId, offerId));

    const productRows = productIds.map((pid) => ({
      offerId,
      productId: pid,
      isGift: false,
    }));
    productRows.push({ offerId, productId: giftProductId, isGift: true });

    await tx.insert(weeklyOfferProducts).values(productRows);

    return result;
  });

  return NextResponse.json(updated);
}

// ── DELETE /api/weekly-offer/[id] ────────────────────────────────────────────

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const offerId = Number(id);

  const [existing] = await db.select().from(weeklyOffers).where(eq(weeklyOffers.id, offerId));
  if (!existing) return NextResponse.json({ error: "Не е намерено" }, { status: 404 });

  await db.delete(weeklyOffers).where(eq(weeklyOffers.id, offerId));
  return NextResponse.json({ ok: true });
}

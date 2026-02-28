import { NextResponse } from "next/server";
import { db } from "@/db";
import { weeklyOffers, weeklyOfferProducts, products, brands } from "@/db/schema";
import { eq, desc, asc, inArray } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";

// ── GET /api/weekly-offer — list all offers (admin) ─────────────────────────

export async function GET() {
  const offers = await db
    .select()
    .from(weeklyOffers)
    .orderBy(desc(weeklyOffers.createdAt));

  return NextResponse.json(offers);
}

// ── POST /api/weekly-offer — create a new offer ──────────────────────────────

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    title: string;
    description?: string;
    comboPrice: number;
    isActive: boolean;
    startsAt?: string;
    endsAt?: string;
    productIds: number[];
    giftProductId: number;
  };

  const { title, description, comboPrice, isActive, startsAt, endsAt, productIds, giftProductId } = body;

  if (!title || comboPrice <= 0 || productIds.length === 0) {
    return NextResponse.json({ error: "Невалидни данни" }, { status: 400 });
  }

  // Verify all referenced products exist
  const referenced = [...new Set([...productIds, giftProductId])];
  const found = await db
    .select({ id: products.id })
    .from(products)
    .where(inArray(products.id, referenced));

  if (found.length !== referenced.length) {
    return NextResponse.json({ error: "Невалиден продукт" }, { status: 400 });
  }

  const [offer] = await db.transaction(async (tx) => {
    // Deactivate all others if this one is active
    if (isActive) {
      await tx
        .update(weeklyOffers)
        .set({ isActive: false, updatedAt: new Date().toISOString() });
    }

    const inserted = await tx
      .insert(weeklyOffers)
      .values({
        title,
        description: description ?? null,
        comboPrice,
        isActive,
        startsAt: startsAt ?? null,
        endsAt: endsAt ?? null,
      })
      .returning();

    const newOffer = inserted[0]!;

    const productRows = productIds.map((pid) => ({
      offerId: newOffer.id,
      productId: pid,
      isGift: false,
    }));
    productRows.push({ offerId: newOffer.id, productId: giftProductId, isGift: true });

    await tx.insert(weeklyOfferProducts).values(productRows);

    return inserted;
  });

  return NextResponse.json(offer, { status: 201 });
}

// ── GET /api/weekly-offer?active=1 — active offer for storefront ─────────────

// (handled via query param on the same GET, below)

export async function OPTIONS() {
  // Allow CORS preflight if needed
  return new NextResponse(null, { status: 204 });
}

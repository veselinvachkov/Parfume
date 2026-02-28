import { db } from "@/db";
import { brands, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const brandId = parseInt(id, 10);
  const body = await req.json() as { name?: string };
  const name = body.name?.trim();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const [updated] = await db
    .update(brands)
    .set({ name })
    .where(eq(brands.id, brandId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const brandId = parseInt(id, 10);

  const linked = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.brandId, brandId))
    .limit(1);

  if (linked.length > 0) {
    return NextResponse.json(
      { error: "Cannot delete brand with existing products" },
      { status: 409 }
    );
  }

  await db.delete(brands).where(eq(brands.id, brandId));
  return NextResponse.json({ ok: true });
}

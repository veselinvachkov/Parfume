import { db } from "@/db";
import { brands } from "@/db/schema";
import { slugify } from "@/lib/slug";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const rows = await db.select().from(brands).orderBy(asc(brands.name));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json() as { name?: string };
  const name = body.name?.trim();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = slugify(name);

  try {
    const [brand] = await db
      .insert(brands)
      .values({ name, slug })
      .returning();
    return NextResponse.json(brand, { status: 201 });
  } catch (err) {
    try {
      const existing = await db
        .select()
        .from(brands)
        .where(eq(brands.slug, slug));
      if (existing.length > 0) {
        return NextResponse.json(
          { error: "A brand with this name already exists" },
          { status: 409 }
        );
      }
    } catch { /* ignore secondary check failure */ }
    const message = err instanceof Error ? err.message : "Failed to create brand";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

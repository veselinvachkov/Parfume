import { db } from "@/db";
import { brands, products } from "@/db/schema";
import { toCsv } from "@/lib/csv";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      brand: brands.name,
      price: products.price,
      stock: products.stock,
      description: products.description,
      slug: products.slug,
      imageUrl: products.imageUrl,
      createdAt: products.createdAt,
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .orderBy(asc(brands.name), asc(products.name));

  const date = new Date().toISOString().split("T")[0];
  const csv = toCsv(rows as Record<string, unknown>[]);
  const filename = `products-${date}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

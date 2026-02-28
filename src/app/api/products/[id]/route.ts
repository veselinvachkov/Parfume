import { db } from "@/db";
import { brands, orderItems, products } from "@/db/schema";
import { saveUploadedFile, UploadError } from "@/lib/image-upload";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  const [row] = await db
    .select({
      id: products.id,
      brandId: products.brandId,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      stock: products.stock,
      imageUrl: products.imageUrl,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      brandName: brands.name,
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(eq(products.id, productId));

  if (!row) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(row);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  const formData = await req.formData();

  const name = (formData.get("name") as string | null)?.trim();
  const brandId = parseInt(formData.get("brandId") as string, 10);
  const categoryRaw = formData.get("category") as string | null;
  const category = categoryRaw === "cosmetic" ? "cosmetic" : ("parfum" as const);
  const description =
    (formData.get("description") as string | null)?.trim() || null;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string, 10);
  const imageFile = formData.get("image") as File | null;

  if (!name || isNaN(brandId) || isNaN(price) || isNaN(stock)) {
    return NextResponse.json(
      { error: "name, brandId, price, and stock are required" },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId));

  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  let imageUrl = existing.imageUrl;
  if (imageFile && imageFile.size > 0) {
    try {
      imageUrl = await saveUploadedFile(imageFile);
    } catch (err) {
      if (err instanceof UploadError) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      throw err;
    }
  }

  const now = new Date().toISOString();
  const [updated] = await db
    .update(products)
    .set({ name, brandId, category, description, price, stock, imageUrl, updatedAt: now })
    .where(eq(products.id, productId))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  const linked = await db
    .select({ id: orderItems.id })
    .from(orderItems)
    .where(eq(orderItems.productId, productId))
    .limit(1);

  if (linked.length > 0) {
    return NextResponse.json(
      { error: "Cannot delete product that appears in existing orders" },
      { status: 409 }
    );
  }

  await db.delete(products).where(eq(products.id, productId));
  return NextResponse.json({ ok: true });
}

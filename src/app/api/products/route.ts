import { db } from "@/db";
import { brands, products } from "@/db/schema";
import { saveUploadedFile, UploadError } from "@/lib/image-upload";
import { slugify } from "@/lib/slug";
import { PAGE_SIZE } from "@/lib/constants";
import { asc, desc, eq, count } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const brandSlug = searchParams.get("brand");
  const sortDir = searchParams.get("sort") === "desc" ? desc : asc;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  const brandRow = brandSlug
    ? await db
        .select()
        .from(brands)
        .where(eq(brands.slug, brandSlug))
        .then((r) => r[0])
    : null;

  const brandFilter =
    brandRow ? eq(products.brandId, brandRow.id) : undefined;

  const [rows, [{ total }]] = await Promise.all([
    db
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
      .where(brandFilter)
      .orderBy(sortDir(brands.name), asc(products.name))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db
      .select({ total: count() })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(brandFilter),
  ]);

  return NextResponse.json({
    products: rows,
    total,
    pageCount: Math.ceil(total / PAGE_SIZE),
    page,
  });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const name = (formData.get("name") as string | null)?.trim();
  const brandId = parseInt(formData.get("brandId") as string, 10);
  const description = (formData.get("description") as string | null)?.trim() || null;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string, 10);
  const imageFile = formData.get("image") as File | null;

  if (!name || isNaN(brandId) || isNaN(price) || isNaN(stock)) {
    return NextResponse.json(
      { error: "name, brandId, price, and stock are required" },
      { status: 400 }
    );
  }

  let imageUrl: string | null = null;
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

  const categoryRaw = formData.get("category") as string | null;
  const category = categoryRaw === "cosmetic" ? "cosmetic" : ("parfum" as const);

  const slug = slugify(name);
  const [product] = await db
    .insert(products)
    .values({ name, slug, brandId, category, description, price, stock, imageUrl })
    .returning();

  return NextResponse.json(product, { status: 201 });
}

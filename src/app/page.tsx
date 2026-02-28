import { db } from "@/db";
import { brands, products } from "@/db/schema";
import { asc, desc, eq, count, and } from "drizzle-orm";
import { PAGE_SIZE } from "@/lib/constants";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { BrandFilter } from "@/components/storefront/BrandFilter";
import { SortSelect } from "@/components/storefront/SortSelect";
import Link from "next/link";
import type { ProductWithBrand } from "@/types";
import { Suspense } from "react";

interface HomeProps {
  searchParams: Promise<{
    brand?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

async function HomeContent({ searchParams }: HomeProps) {
  const params = await searchParams;
  const brandSlug = params.brand;
  const category =
    params.category === "parfum" || params.category === "cosmetic"
      ? params.category
      : undefined;
  const sortDir = params.sort === "desc" ? desc : asc;
  const currentSort = params.sort === "desc" ? "desc" : "asc";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const brandRow = brandSlug
    ? await db
        .select()
        .from(brands)
        .where(eq(brands.slug, brandSlug))
        .then((r) => r[0])
    : null;

  const filters = and(
    brandRow ? eq(products.brandId, brandRow.id) : undefined,
    category ? eq(products.category, category) : undefined,
  );

  // When a category is selected, show only brands that have products in it
  const brandsQuery = category
    ? db
        .selectDistinct({
          id: brands.id,
          name: brands.name,
          slug: brands.slug,
          createdAt: brands.createdAt,
        })
        .from(brands)
        .innerJoin(products, eq(products.brandId, brands.id))
        .where(eq(products.category, category))
        .orderBy(asc(brands.name))
    : db.select().from(brands).orderBy(asc(brands.name));

  const [rows, [{ total }], filteredBrands] = await Promise.all([
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
        category: products.category,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        brandName: brands.name,
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(filters)
      .orderBy(sortDir(brands.name), asc(products.name))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db
      .select({ total: count() })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(filters),
    brandsQuery,
  ]);

  const pageCount = Math.ceil(total / PAGE_SIZE);

  const buildPageUrl = (p: number) => {
    const sp = new URLSearchParams();
    if (category) sp.set("category", category);
    if (brandSlug) sp.set("brand", brandSlug);
    if (currentSort !== "asc") sp.set("sort", currentSort);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `/?${qs}` : "/";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hero */}
      <div className="text-center py-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Ароматно Магазинче
        </h1>
        <p className="text-muted-foreground text-lg">
          Магазин за парфюмерия и козметика в Монтана. Тук сме. Напръскай се!
        </p>
      </div>

      {/* Brand filter + sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <BrandFilter
          brands={filteredBrands}
          currentBrand={brandSlug}
          currentCategory={category}
          currentSort={currentSort !== "asc" ? currentSort : undefined}
        />
        <Suspense>
          <SortSelect currentSort={currentSort} />
        </Suspense>
      </div>

      <p className="text-sm text-muted-foreground">
        {total} {total === 1 ? "продукт намерен" : "продукта намерени"}
      </p>

      <ProductGrid products={rows as ProductWithBrand[]} />

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {page > 1 && (
            <Link
              href={buildPageUrl(page - 1)}
              className="px-4 py-2 rounded-md border text-sm hover:bg-muted transition-colors"
            >
              Назад
            </Link>
          )}
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildPageUrl(p)}
              className={`px-4 py-2 rounded-md border text-sm transition-colors ${
                p === page
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:bg-muted"
              }`}
            >
              {p}
            </Link>
          ))}
          {page < pageCount && (
            <Link
              href={buildPageUrl(page + 1)}
              className="px-4 py-2 rounded-md border text-sm hover:bg-muted transition-colors"
            >
              Напред
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function Home(props: HomeProps) {
  return (
    <Suspense>
      <HomeContent {...props} />
    </Suspense>
  );
}

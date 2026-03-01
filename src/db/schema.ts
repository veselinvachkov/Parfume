import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// re-exported so other modules can import from one place

export const brands = sqliteTable("brands", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
});

export const products = sqliteTable("products", {
  id: int("id").primaryKey({ autoIncrement: true }),
  brandId: int("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "restrict" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: real("price").notNull(),
  stock: int("stock").notNull().default(0),
  imageUrl: text("image_url"),
  category: text("category", { enum: ["parfum", "cosmetic"] })
    .notNull()
    .default("parfum"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
});

export const adminUsers = sqliteTable("admin_users", {
  id: int("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
});

export const orders = sqliteTable("orders", {
  id: int("id").primaryKey({ autoIncrement: true }),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  phone: text("phone"),
  address: text("address").notNull(),
  totalAmount: real("total_amount").notNull(),
  status: text("status", { enum: ["pending", "confirmed"] })
    .notNull()
    .default("confirmed"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
});

export const orderItems = sqliteTable("order_items", {
  id: int("id").primaryKey({ autoIncrement: true }),
  orderId: int("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: int("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }),
  productName: text("product_name").notNull(),
  unitPrice: real("unit_price").notNull(),
  quantity: int("quantity").notNull(),
});

// ── Weekly offer ──────────────────────────────────────────────────────────────

export const weeklyOffers = sqliteTable("weekly_offers", {
  id: int("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull().default("Седмично предложение"),
  description: text("description"),
  comboPrice: real("combo_price").notNull(),
  stock: int("stock").notNull().default(0),
  isActive: int("is_active", { mode: "boolean" }).notNull().default(false),
  startsAt: text("starts_at"),
  endsAt: text("ends_at"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
});

export const weeklyOfferProducts = sqliteTable("weekly_offer_products", {
  id: int("id").primaryKey({ autoIncrement: true }),
  offerId: int("offer_id")
    .notNull()
    .references(() => weeklyOffers.id, { onDelete: "cascade" }),
  productId: int("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  // true → this is the free gift; false → paid combo product
  isGift: int("is_gift", { mode: "boolean" }).notNull().default(false),
});

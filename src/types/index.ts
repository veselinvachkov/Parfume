import type { InferSelectModel } from "drizzle-orm";
import type {
  brands,
  products,
  orders,
  orderItems,
  weeklyOffers,
  weeklyOfferProducts,
} from "@/db/schema";

export type Brand = InferSelectModel<typeof brands>;
export type Product = InferSelectModel<typeof products>;
export type Order = InferSelectModel<typeof orders>;
export type OrderItem = InferSelectModel<typeof orderItems>;
export type WeeklyOffer = InferSelectModel<typeof weeklyOffers>;
export type WeeklyOfferProduct = InferSelectModel<typeof weeklyOfferProducts>;

export type WeeklyOfferProductRow = WeeklyOfferProduct & {
  product: ProductWithBrand;
};

export type WeeklyOfferWithProducts = WeeklyOffer & {
  items: WeeklyOfferProductRow[];
};

export type ProductWithBrand = Product & { brandName: string | null };

export type CartItemPayload = {
  productId: number;
  name: string;
  price: number;
  imageUrl: string | null;
};

export type CheckoutPayload = {
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  items: { productId: number; quantity: number }[];
};

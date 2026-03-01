import { db } from "@/db";
import { orders, orderItems, products, weeklyOffers } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { sendOrderConfirmation } from "@/lib/email";
import { NextResponse } from "next/server";

type OrderItemInput = { productId: number; quantity: number };
type BundleInput = {
  offerId: number;
  title: string;
  comboPrice: number;
  quantity: number;
  products: { productId: number; name: string; unitPrice: number; isGift: boolean }[];
};

export async function POST(req: Request) {
  const body = await req.json() as {
    customerName?: string;
    customerEmail?: string;
    phone?: string;
    address?: string;
    items?: OrderItemInput[];
    bundles?: BundleInput[];
  };

  const { customerName, customerEmail, phone, address, items = [], bundles = [] } = body;

  if (!customerName || !customerEmail || !phone || !address) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (items.length === 0 && bundles.length === 0) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const result = await db.transaction(async (tx) => {
      let totalAmount = 0;
      const snapshots: {
        productId: number;
        productName: string;
        unitPrice: number;
        quantity: number;
      }[] = [];

      // Process regular items
      for (const item of items) {
        const [row] = await tx
          .select({ id: products.id, name: products.name, price: products.price, stock: products.stock })
          .from(products)
          .where(eq(products.id, item.productId));

        if (!row) throw new Error(`Product ${item.productId} not found`);
        if (row.stock < item.quantity) throw new Error(`Insufficient stock for "${row.name}"`);

        snapshots.push({ productId: item.productId, productName: row.name, unitPrice: row.price, quantity: item.quantity });
        totalAmount += row.price * item.quantity;
      }

      // Process bundles
      for (const bundle of bundles) {
        // Check weekly offer stock
        const [offer] = await tx
          .select({ id: weeklyOffers.id, stock: weeklyOffers.stock })
          .from(weeklyOffers)
          .where(eq(weeklyOffers.id, bundle.offerId));

        if (!offer) throw new Error(`Offer ${bundle.offerId} not found`);
        if (offer.stock < bundle.quantity) throw new Error(`Insufficient stock for "${bundle.title}"`);

        // Deduct each product's stock
        for (const p of bundle.products) {
          const [row] = await tx
            .select({ id: products.id, stock: products.stock })
            .from(products)
            .where(eq(products.id, p.productId));

          if (!row) throw new Error(`Product ${p.productId} not found`);
          if (row.stock < bundle.quantity) throw new Error(`Insufficient stock for product in "${bundle.title}"`);

          await tx
            .update(products)
            .set({ stock: sql`${products.stock} - ${bundle.quantity}` })
            .where(eq(products.id, p.productId));
        }

        // Deduct bundle stock
        await tx
          .update(weeklyOffers)
          .set({ stock: sql`${weeklyOffers.stock} - ${bundle.quantity}` })
          .where(eq(weeklyOffers.id, bundle.offerId));

        // Add as single line item (first non-gift product as reference)
        const refProduct = bundle.products.find((p) => !p.isGift) ?? bundle.products[0];
        snapshots.push({
          productId: refProduct.productId,
          productName: `Пакет: ${bundle.title}`,
          unitPrice: bundle.comboPrice,
          quantity: bundle.quantity,
        });
        totalAmount += bundle.comboPrice * bundle.quantity;
      }

      const [insertedOrder] = await tx
        .insert(orders)
        .values({ customerName, customerEmail, phone, address, totalAmount, status: "confirmed" })
        .returning({ id: orders.id });

      for (const s of snapshots) {
        await tx.insert(orderItems).values({
          orderId: insertedOrder.id,
          productId: s.productId,
          productName: s.productName,
          unitPrice: s.unitPrice,
          quantity: s.quantity,
        });
      }

      // Deduct stock for regular items
      for (const item of items) {
        await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${item.quantity}` })
          .where(eq(products.id, item.productId));
      }

      return { orderId: insertedOrder.id, totalAmount, snapshots };
    });

    await sendOrderConfirmation({
      to: customerEmail,
      customerName,
      orderId: result.orderId,
      items: result.snapshots,
      totalAmount: result.totalAmount,
      address,
    }).catch((err) => console.error("Email send failed:", err));

    return NextResponse.json(
      { orderId: result.orderId, totalAmount: result.totalAmount },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Order failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  const rows = await db
    .select({
      id: orders.id,
      customerName: orders.customerName,
      customerEmail: orders.customerEmail,
      address: orders.address,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .orderBy(orders.createdAt);

  return NextResponse.json(rows);
}

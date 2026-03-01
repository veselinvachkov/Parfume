import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { sendOrderConfirmation } from "@/lib/email";
import { NextResponse } from "next/server";

type OrderItemInput = { productId: number; quantity: number };

export async function POST(req: Request) {
  const body = await req.json() as {
    customerName?: string;
    customerEmail?: string;
    phone?: string;
    address?: string;
    items?: OrderItemInput[];
  };

  const { customerName, customerEmail, phone, address, items } = body;

  if (!customerName || !customerEmail || !phone || !address || !items?.length) {
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

      for (const item of items) {
        const [row] = await tx
          .select({
            id: products.id,
            name: products.name,
            price: products.price,
            stock: products.stock,
          })
          .from(products)
          .where(eq(products.id, item.productId));

        if (!row) throw new Error(`Product ${item.productId} not found`);
        if (row.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${row.name}"`);
        }

        snapshots.push({
          productId: item.productId,
          productName: row.name,
          unitPrice: row.price,
          quantity: item.quantity,
        });
        totalAmount += row.price * item.quantity;
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
        await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${s.quantity}` })
          .where(eq(products.id, s.productId));
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

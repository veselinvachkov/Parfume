import { db } from "@/db";
import { orders } from "@/db/schema";
import { NextResponse } from "next/server";
import Database from "better-sqlite3";
import { sendOrderConfirmation } from "@/lib/email";

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

  // Use the raw SQLite connection for a synchronous transaction
  const sqlite = new Database(process.env.DATABASE_URL ?? "./local.db");
  sqlite.pragma("foreign_keys = ON");

  try {
    const result = sqlite.transaction(() => {
      let totalAmount = 0;
      const snapshots: {
        productId: number;
        productName: string;
        unitPrice: number;
        quantity: number;
      }[] = [];

      for (const item of items) {
        const row = sqlite
          .prepare("SELECT id, name, price, stock FROM products WHERE id = ?")
          .get(item.productId) as
          | { id: number; name: string; price: number; stock: number }
          | undefined;

        if (!row) {
          throw new Error(`Product ${item.productId} not found`);
        }
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

      const insertOrder = sqlite.prepare(
        `INSERT INTO orders (customer_name, customer_email, phone, address, total_amount, status)
         VALUES (?, ?, ?, ?, ?, 'confirmed')`
      );
      const orderResult = insertOrder.run(
        customerName,
        customerEmail,
        phone,
        address,
        totalAmount
      );
      const orderId = orderResult.lastInsertRowid as number;

      const insertItem = sqlite.prepare(
        `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity)
         VALUES (?, ?, ?, ?, ?)`
      );
      const updateStock = sqlite.prepare(
        "UPDATE products SET stock = stock - ? WHERE id = ?"
      );

      for (const s of snapshots) {
        insertItem.run(orderId, s.productId, s.productName, s.unitPrice, s.quantity);
        updateStock.run(s.quantity, s.productId);
      }

      return { orderId, totalAmount, snapshots };
    })();

    sendOrderConfirmation({
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
  } finally {
    sqlite.close();
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

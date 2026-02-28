import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { desc } from "drizzle-orm";
import { OrderTable } from "@/components/admin/OrderTable";
import type { Order, OrderItem } from "@/types";

export default async function AdminOrdersPage() {
  const [allOrders, allItems] = await Promise.all([
    db.select().from(orders).orderBy(desc(orders.createdAt)),
    db.select().from(orderItems),
  ]);

  const itemsByOrder = allItems.reduce<Record<number, OrderItem[]>>((acc, item) => {
    if (!acc[item.orderId]) acc[item.orderId] = [];
    acc[item.orderId].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Поръчки</h1>
        <p className="text-muted-foreground">{allOrders.length} поръчки общо</p>
      </div>
      <OrderTable orders={allOrders as Order[]} itemsByOrder={itemsByOrder} />
    </div>
  );
}

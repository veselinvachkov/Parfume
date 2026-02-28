"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Order, OrderItem } from "@/types";

interface OrderTableProps {
  orders: Order[];
  itemsByOrder: Record<number, OrderItem[]>;
}

export function OrderTable({ orders, itemsByOrder }: OrderTableProps) {
  const router = useRouter();
  const [viewing, setViewing] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState<Order | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const viewingItems = viewing ? (itemsByOrder[viewing.id] ?? []) : [];

  async function handleDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    const res = await fetch(`/api/orders/${deleting.id}`, { method: "DELETE" });
    setDeleteLoading(false);
    setDeleting(null);
    if (!res.ok) {
      const data = await res.json() as { error?: string };
      toast.error(data.error ?? "Неуспешно изтриване на поръчка");
      return;
    }
    toast.success("Поръчката е изтрита");
    router.refresh();
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>Клиент</TableHead>
            <TableHead>Имейл</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead>Адрес</TableHead>
            <TableHead>Общо</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                Няма поръчки.
              </TableCell>
            </TableRow>
          )}
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium text-muted-foreground">
                #{order.id}
              </TableCell>
              <TableCell className="font-medium">{order.customerName}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {order.customerEmail}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {order.phone ?? "—"}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm max-w-[180px] truncate">
                {order.address}
              </TableCell>
              <TableCell>{order.totalAmount.toFixed(2)} лв.</TableCell>
              <TableCell>
                <Badge
                  variant={order.status === "confirmed" ? "default" : "secondary"}
                >
                  {order.status === "confirmed" ? "Потвърдена" : "Изчакваща"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {new Date(order.createdAt).toLocaleDateString("bg-BG")}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewing(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleting(order)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Поръчка #{viewing?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
              <span className="font-medium text-foreground">Клиент</span>
              <span>{viewing?.customerName}</span>
              <span className="font-medium text-foreground">Имейл</span>
              <span>{viewing?.customerEmail}</span>
              <span className="font-medium text-foreground">Телефон</span>
              <span>{viewing?.phone ?? "—"}</span>
              <span className="font-medium text-foreground">Адрес</span>
              <span>{viewing?.address}</span>
            </div>
            <div className="border-t pt-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Продукт</TableHead>
                    <TableHead className="text-right">Ед. цена</TableHead>
                    <TableHead className="text-right">Бр.</TableHead>
                    <TableHead className="text-right">Общо</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viewingItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell className="text-right">
                        {item.unitPrice.toFixed(2)} лв.
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {(item.unitPrice * item.quantity).toFixed(2)} лв.
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end font-semibold border-t pt-2">
              Общо: {viewing?.totalAmount.toFixed(2)} лв.
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изтриване на поръчка</DialogTitle>
            <DialogDescription>
              Сигурни ли сте, че искате да изтриете поръчка #{deleting?.id} на{" "}
              <strong>{deleting?.customerName}</strong>? Това действие не може да
              бъде отменено.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Откажи
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Изтриване..." : "Изтрий"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

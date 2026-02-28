"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MoreHorizontal, Pencil, Trash2, ImageIcon } from "lucide-react";
import type { ProductWithBrand } from "@/types";

export function ProductTable({ products }: { products: ProductWithBrand[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<ProductWithBrand | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!deleting) return;
    setLoading(true);
    const res = await fetch(`/api/products/${deleting.id}`, {
      method: "DELETE",
    });
    setLoading(false);
    setDeleting(null);
    if (!res.ok) {
      const data = await res.json() as { error?: string };
      toast.error(data.error ?? "Неуспешно изтриване на продукт");
      return;
    }
    toast.success("Продуктът е изтрит");
    router.refresh();
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Снимка</TableHead>
            <TableHead>Име</TableHead>
            <TableHead>Марка</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Наличност</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground py-8"
              >
                Няма продукти. Добавете първия продукт.
              </TableCell>
            </TableRow>
          )}
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="w-12 h-12 rounded-md border bg-muted overflow-hidden flex items-center justify-center">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{product.brandName ?? "—"}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {product.category === "cosmetic" ? "Козметика" : "Парфюм"}
                </Badge>
              </TableCell>
              <TableCell>{product.price.toFixed(2)} лв.</TableCell>
              <TableCell>
                <Badge
                  variant={product.stock === 0 ? "destructive" : "outline"}
                >
                  {product.stock === 0 ? "Изчерпан" : product.stock}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/products/${product.id}`}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Редактирай
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setDeleting(product)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Изтрий
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изтриване на продукт</DialogTitle>
            <DialogDescription>
              Сигурни ли сте, че искате да изтриете &quot;{deleting?.name}&quot;?
              Това действие не може да бъде отменено.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Откажи
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Изтриване..." : "Изтрий"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

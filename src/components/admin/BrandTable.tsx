"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Brand } from "@/types";

export function BrandTable({ brands }: { brands: Brand[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!deleting) return;
    setLoading(true);
    const res = await fetch(`/api/brands/${deleting.id}`, { method: "DELETE" });
    setLoading(false);
    setDeleting(null);
    if (!res.ok) {
      const data = await res.json() as { error?: string };
      toast.error(data.error ?? "Неуспешно изтриване на марка");
      return;
    }
    toast.success("Марката е изтрита");
    router.refresh();
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Име</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Създадена</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                Няма марки. Добавете първата марка.
              </TableCell>
            </TableRow>
          )}
          {brands.map((brand) => (
            <TableRow key={brand.id}>
              <TableCell className="font-medium">{brand.name}</TableCell>
              <TableCell className="text-muted-foreground">{brand.slug}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {new Date(brand.createdAt).toLocaleDateString()}
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
                      <Link href={`/admin/brands/${brand.id}`}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Редактирай
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setDeleting(brand)}
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
            <DialogTitle>Изтриване на марка</DialogTitle>
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

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageIcon, Upload } from "lucide-react";
import type { Brand, ProductWithBrand } from "@/types";

const schema = z.object({
  name: z.string().min(1, "Името е задължително").max(200),
  brandId: z.string().min(1, "Марката е задължителна"),
  category: z.enum(["parfum", "cosmetic"]),
  description: z.string().max(2000).optional(),
  price: z.string().min(1, "Цената е задължителна"),
  stock: z.string().min(1, "Наличността е задължителна"),
});

type FormValues = z.infer<typeof schema>;

interface ProductFormProps {
  product?: ProductWithBrand;
  brands: Brand[];
}

export function ProductForm({ product, brands }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.imageUrl ?? null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name ?? "",
      brandId: product?.brandId?.toString() ?? "",
      category: (product?.category ?? "parfum") as "parfum" | "cosmetic",
      description: product?.description ?? "",
      price: product?.price?.toString() ?? "",
      stock: product?.stock?.toString() ?? "",
    },
  });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function onSubmit(values: FormValues) {
    const price = parseFloat(values.price);
    const stock = parseInt(values.stock, 10);

    if (isNaN(price) || price <= 0) {
      form.setError("price", { message: "Цената трябва да е положително число" });
      return;
    }
    if (isNaN(stock) || stock < 0) {
      form.setError("stock", { message: "Наличността трябва да е 0 или повече" });
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("brandId", values.brandId);
    formData.append("category", values.category);
    formData.append("description", values.description ?? "");
    formData.append("price", String(price));
    formData.append("stock", String(stock));
    if (imageFile) formData.append("image", imageFile);

    const url = isEdit ? `/api/products/${product.id}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, { method, body: formData });

    if (!res.ok) {
      const data = await res.json() as { error?: string };
      toast.error(data.error ?? "Неуспешно запазване на продукт");
      return;
    }

    toast.success(isEdit ? "Продуктът е обновен" : "Продуктът е създаден");
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Име на продукт</FormLabel>
              <FormControl>
                <Input placeholder="напр. Chanel No. 5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brandId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Марка</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Изберете марка" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Категория</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Изберете категория" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="parfum">Парфюм</SelectItem>
                  <SelectItem value="cosmetic">Козметика</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Опишете аромата..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Цена (лв.)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Наличност</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Image upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Снимка на продукт</label>
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-md border bg-muted flex items-center justify-center overflow-hidden shrink-0">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
              <Upload className="h-5 w-5 text-muted-foreground mb-1" />
              <span className="text-sm text-muted-foreground">
                {imageFile
                  ? imageFile.name
                  : "Натиснете за качване (JPEG, PNG, WebP, макс. 5 МБ)"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Запазване..."
              : isEdit
              ? "Обнови продукт"
              : "Създай продукт"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Откажи
          </Button>
        </div>
      </form>
    </Form>
  );
}

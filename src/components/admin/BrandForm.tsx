"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Brand } from "@/types";

const schema = z.object({
  name: z.string().min(1, "Името е задължително").max(100),
});

type FormValues = z.infer<typeof schema>;

interface BrandFormProps {
  brand?: Brand;
}

export function BrandForm({ brand }: BrandFormProps) {
  const router = useRouter();
  const isEdit = !!brand;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: brand?.name ?? "" },
  });

  async function onSubmit(values: FormValues) {
    const url = isEdit ? `/api/brands/${brand.id}` : "/api/brands";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        toast.error(data.error ?? "Неуспешно запазване на марка");
        return;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Мрежова грешка");
      return;
    }

    toast.success(isEdit ? "Марката е обновена" : "Марката е създадена");
    router.push("/admin/brands");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Име на марка</FormLabel>
              <FormControl>
                <Input placeholder="напр. Chanel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Запазване..." : isEdit ? "Обнови марка" : "Създай марка"}
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

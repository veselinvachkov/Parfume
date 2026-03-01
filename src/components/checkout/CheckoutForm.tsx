"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart";
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
import type { CheckoutPayload } from "@/types";

const schema = z.object({
  customerName: z.string().min(2, "Името трябва да е поне 2 символа"),
  customerEmail: z.string().email("Въведете валиден имейл"),
  phone: z.string().min(6, "Въведете валиден телефонен номер"),
  address: z.string().min(10, "Моля, въведете пълния си адрес"),
});

type FormValues = z.infer<typeof schema>;

export function CheckoutForm() {
  const router = useRouter();
  const { items, bundles, clearCart } = useCartStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      phone: "",
      address: "",
    },
  });

  async function onSubmit(values: FormValues) {
    if (items.length === 0 && bundles.length === 0) {
      toast.error("Вашата количка е празна");
      return;
    }

    const payload: CheckoutPayload = {
      ...values,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      bundles: bundles.map((b) => ({
        offerId: b.offerId,
        title: b.title,
        comboPrice: b.comboPrice,
        quantity: b.quantity,
        products: b.products,
      })),
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json() as { error?: string };
      toast.error(data.error ?? "Поръчката не беше успешна. Опитайте отново.");
      return;
    }

    const { orderId } = await res.json() as { orderId: number; totalAmount: number };
    clearCart();
    router.push(`/checkout/confirmation?orderId=${orderId}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пълно Име</FormLabel>
              <FormControl>
                <Input placeholder="Иван Иванов" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="customerEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имейл</FormLabel>
              <FormControl>
                <Input type="email" placeholder="ivan@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Телефон</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+359 88 888 8888" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Адрес за доставка</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="ул. Главна 1, гр. София, 1000"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={form.formState.isSubmitting || (items.length === 0 && bundles.length === 0)}
        >
          {form.formState.isSubmitting ? "Обработване..." : "Направи Поръчка"}
        </Button>
      </form>
    </Form>
  );
}

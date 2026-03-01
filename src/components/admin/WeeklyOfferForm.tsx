"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Gift, Package, Search, X } from "lucide-react";
import type { ProductWithBrand, WeeklyOfferWithProducts } from "@/types";

interface Props {
  products: ProductWithBrand[];
  offer?: WeeklyOfferWithProducts;
}

export function WeeklyOfferForm({ products, offer }: Props) {
  const router = useRouter();
  const isEdit = !!offer;

  // Pre-populate from existing offer
  const initialComboIds = offer
    ? offer.items.filter((i) => !i.isGift).map((i) => i.productId)
    : [];
  const initialGiftId = offer
    ? (offer.items.find((i) => i.isGift)?.productId ?? null)
    : null;

  const [title, setTitle] = useState(offer?.title ?? "Седмично предложение");
  const [description, setDescription] = useState(offer?.description ?? "");
  const [comboPrice, setComboPrice] = useState(
    offer?.comboPrice?.toString() ?? ""
  );
  const [stock, setStock] = useState(offer?.stock?.toString() ?? "0");
  const [isActive, setIsActive] = useState(offer?.isActive ?? false);
  const [startsAt, setStartsAt] = useState(offer?.startsAt?.slice(0, 10) ?? "");
  const [endsAt, setEndsAt] = useState(offer?.endsAt?.slice(0, 10) ?? "");
  const [selectedComboIds, setSelectedComboIds] = useState<number[]>(initialComboIds);
  const [giftProductId, setGiftProductId] = useState<number | null>(initialGiftId);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filtered = products.filter((p) =>
    `${p.name} ${p.brandName ?? ""}`.toLowerCase().includes(search.toLowerCase())
  );

  function toggleCombo(id: number) {
    setSelectedComboIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    // If this was the gift, clear it
    if (giftProductId === id) setGiftProductId(null);
  }

  function setGift(id: number) {
    setGiftProductId(id);
    // Gift can't also be a combo product
    setSelectedComboIds((prev) => prev.filter((x) => x !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const price = parseFloat(comboPrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Въведете валидна цена за комбото");
      return;
    }
    if (selectedComboIds.length === 0) {
      toast.error("Изберете поне един продукт за комбото");
      return;
    }
    if (!giftProductId) {
      toast.error("Изберете продукт-подарък");
      return;
    }

    setSubmitting(true);

    const payload = {
      title,
      description,
      comboPrice: price,
      stock: parseInt(stock, 10) || 0,
      isActive,
      startsAt: startsAt || undefined,
      endsAt: endsAt || undefined,
      productIds: selectedComboIds,
      giftProductId,
    };

    const url = isEdit ? `/api/weekly-offer/${offer.id}` : "/api/weekly-offer";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json() as { error?: string };
      toast.error(data.error ?? "Грешка при запазване");
      return;
    }

    toast.success(isEdit ? "Предложението е обновено" : "Предложението е създадено");
    router.push("/admin/weekly-offer");
    router.refresh();
  }

  const comboTotal = selectedComboIds.reduce((sum, id) => {
    const p = products.find((x) => x.id === id);
    return sum + (p?.price ?? 0);
  }, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">

      {/* Title & description */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Заглавие</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Седмично предложение"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Описание (незадължително)</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Опишете тази седмична оферта…"
            rows={3}
          />
        </div>
      </div>

      {/* Product picker */}
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold">Продукти</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Отбележете продуктите в комбото, после изберете кой е безплатният подарък.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Търсене на продукт…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="border rounded-lg divide-y max-h-80 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">Няма намерени продукти</p>
          )}
          {filtered.map((p) => {
            const inCombo = selectedComboIds.includes(p.id);
            const isGift = giftProductId === p.id;
            return (
              <div
                key={p.id}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  inCombo ? "bg-primary/5" : isGift ? "bg-amber-50 dark:bg-amber-950/20" : ""
                }`}
              >
                {/* Thumbnail */}
                <div className="h-10 w-10 rounded border bg-muted overflow-hidden shrink-0">
                  {p.imageUrl ? (
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  ) : (
                    <Package className="h-5 w-5 m-2.5 text-muted-foreground" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.brandName} · {p.price.toFixed(2)} лв.
                  </p>
                </div>

                {/* Status badges */}
                <div className="flex items-center gap-2 shrink-0">
                  {isGift && (
                    <Badge className="bg-amber-500 text-white text-xs gap-1">
                      <Gift className="h-3 w-3" /> Подарък
                    </Badge>
                  )}
                  {inCombo && (
                    <Badge variant="secondary" className="text-xs">В комбо</Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    variant={inCombo ? "default" : "outline"}
                    onClick={() => toggleCombo(p.id)}
                    disabled={isGift}
                    className="text-xs h-7 px-2"
                  >
                    {inCombo ? <X className="h-3 w-3" /> : "+ Комбо"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={isGift ? "default" : "outline"}
                    onClick={() => isGift ? setGiftProductId(null) : setGift(p.id)}
                    className={`text-xs h-7 px-2 ${isGift ? "bg-amber-500 hover:bg-amber-600 border-amber-500" : ""}`}
                  >
                    <Gift className="h-3 w-3" />
                    {isGift ? "Премахни" : "Подарък"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary of selections */}
      {(selectedComboIds.length > 0 || giftProductId) && (
        <div className="rounded-lg border p-4 space-y-2 bg-muted/30">
          <p className="text-sm font-semibold">Избрани:</p>
          {selectedComboIds.map((id) => {
            const p = products.find((x) => x.id === id)!;
            return (
              <div key={id} className="flex justify-between text-sm">
                <span>{p.name}</span>
                <span className="text-muted-foreground">{p.price.toFixed(2)} лв.</span>
              </div>
            );
          })}
          {giftProductId && (() => {
            const g = products.find((x) => x.id === giftProductId)!;
            return (
              <div className="flex justify-between text-sm text-amber-600">
                <span className="flex items-center gap-1">
                  <Gift className="h-3.5 w-3.5" /> {g.name} (подарък)
                </span>
                <span className="line-through text-muted-foreground">{g.price.toFixed(2)} лв.</span>
              </div>
            );
          })()}
          <div className="border-t pt-2 flex justify-between text-sm font-medium">
            <span>Редовна цена</span>
            <span>{comboTotal.toFixed(2)} лв.</span>
          </div>
        </div>
      )}

      {/* Pricing & dates */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Бройки (наличност)</label>
          <Input
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="напр. 10"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Цена на комбото (лв.)</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={comboPrice}
            onChange={(e) => setComboPrice(e.target.value)}
            placeholder="напр. 49.90"
            required
          />
          {comboTotal > 0 && parseFloat(comboPrice) > 0 && (
            <p className="text-xs text-green-600">
              Спестяване: {(comboTotal - parseFloat(comboPrice)).toFixed(2)} лв.
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">От дата</label>
          <Input
            type="date"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">До дата</label>
          <Input
            type="date"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
          />
        </div>
      </div>

      {/* Active toggle */}
      <label className="flex items-center gap-3 cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border accent-primary"
        />
        <span className="text-sm font-medium">
          Активно предложение{" "}
          <span className="text-muted-foreground font-normal">
            (само едно може да е активно едновременно)
          </span>
        </span>
      </label>

      {/* Submit */}
      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Запазване…" : isEdit ? "Обнови предложение" : "Създай предложение"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Откажи
        </Button>
      </div>
    </form>
  );
}

import type { Metadata } from "next";
import { Truck, MapPin, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Доставка – Aromaten",
  description:
    "Информация за доставка, цени и безплатна доставка за Монтана и поръчки над 40 лв.",
};

export default function DostavkaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <h1 className="text-3xl font-bold tracking-tight">Доставка</h1>

      <div className="grid gap-6">
        <div className="flex items-start gap-4 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <MapPin className="h-7 w-7 text-primary mt-0.5 shrink-0" />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Безплатна доставка за Монтана</h2>
            <p className="text-muted-foreground leading-relaxed">
              За клиенти от{" "}
              <strong className="text-foreground">град Монтана</strong>{" "}
              предлагаме{" "}
              <strong className="text-foreground">безплатна доставка</strong>{" "}
              независимо от размера на поръчката. Можете също да вземете
              поръчката си директно от нашия магазин на ул. „Свети Климент
              Охридски" 24.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl border p-6">
          <Truck className="h-7 w-7 text-primary mt-0.5 shrink-0" />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Метод на доставка</h2>
            <p className="text-muted-foreground leading-relaxed">
              Доставяме чрез куриерски услуги на{" "}
              <strong className="text-foreground">Speedy</strong> и{" "}
              <strong className="text-foreground">Econt</strong> до адрес или до
              офис на куриера по ваш избор. Поръчките се обработват в рамките на
              1 работен ден и доставката обичайно отнема 1–3 работни дни.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl border p-6">
          <Package className="h-7 w-7 text-primary mt-0.5 shrink-0" />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Цена на доставка</h2>
            <p className="text-muted-foreground leading-relaxed">
              Стандартната цена за доставка е{" "}
              <strong className="text-foreground">5 лв.</strong> за цялата
              страна.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                <span>
                  <strong className="text-foreground">Безплатна доставка</strong>{" "}
                  за поръчки над{" "}
                  <strong className="text-foreground">40 евро</strong>.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        За въпроси свържете се с нас на{" "}
        <a href="tel:+359888745410" className="text-primary hover:underline">
          +359 888 745 410
        </a>{" "}
        или{" "}
        <a
          href="mailto:aromatnomagazinche@abv.bg"
          className="text-primary hover:underline"
        >
          aromatnomagazinche@abv.bg
        </a>
        .
      </p>
    </div>
  );
}

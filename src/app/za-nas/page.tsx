import type { Metadata } from "next";
import { FlowerIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "За нас – Aromaten",
  description:
    "Открийте историята на Aromaten – магазин за луксозни парфюми и натурална козметика в Монтана.",
};

export default function ZaNasPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="flex items-center gap-3">
        <FlowerIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">За нас</h1>
      </div>

      <section className="space-y-4 text-muted-foreground leading-relaxed">
        <p className="text-foreground text-lg font-medium">
          Добре дошли в Aromaten – вашето място за луксозни аромати и натурална
          козметика в Монтана.
        </p>
        <p>
          Ние сме специализиран магазин, предлагащ внимателно подбрана колекция
          от арабска и европейска парфюмерия, както и натурална козметика от
          водещи световни марки. Вярваме, че всеки аромат разказва история – и
          нашата мисия е да ви помогнем да намерите тази, която разказва вашата.
        </p>
        <p>
          В нашия магазин ще намерите:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-2">
          <li>
            <strong className="text-foreground">Луксозни парфюми</strong> –
            арабски и европейски, от марки като Montale, Lattafa Paris, Khadlaj,
            LPDO, Montale, EOLÌA и много други.
          </li>
          <li>
            <strong className="text-foreground">Натурална козметика</strong> –
            продукти, грижещи се за вашата кожа с естествени съставки от марки
            като ORGANICA, AKBARi, Mitomo и EstiarA.
          </li>
          <li>
            <strong className="text-foreground">Персонализирана помощ</strong> –
            нашият екип е винаги на разположение да ви посъветва и да ви помогне
            да изберете аромата, подходящ именно за вас.
          </li>
        </ul>
        <p>
          Физическият ни магазин се намира в центъра на Монтана, на ул. „Свети
          Климент Охридски" 24, и е отворен всеки ден. Можете да ни посетите
          лично или да поръчате онлайн с доставка до вас.
        </p>
        <p>
          За контакт: <a href="tel:+359888745410" className="text-primary hover:underline">+359 888 745 410</a>
          {" "}или{" "}
          <a href="mailto:aromatnomagazinche@abv.bg" className="text-primary hover:underline">
            aromatnomagazinche@abv.bg
          </a>
        </p>
      </section>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Отказ от покупка | Aromaten",
  description: "Политика за отказ от покупка и връщане на стоки, закупени онлайн",
};

export default function OtkazOtPokupkaPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-8">
        Политика за отказ от покупка и връщане на стоки, закупени онлайн
      </h1>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold uppercase tracking-wide text-foreground mb-2">
            Право на отказ
          </h2>
          <p>
            Съгласно Закона за защита на потребителите, имате право да се откажете от
            направената онлайн поръчка без да посочвате причина в срок от{" "}
            <strong>14 (четиринадесет) дни</strong> от датата, на която сте получили стоката.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold uppercase tracking-wide text-foreground mb-2">
            Условия за връщане
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Стоката трябва да е в оригиналната си опаковка, неотваряна и неизползвана.</li>
            <li>Към върнатата стока трябва да приложите касовата бележка или фактурата.</li>
            <li>Стоката не трябва да носи следи от употреба или увреждане.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold uppercase tracking-wide text-foreground mb-2">
            Как да упражните правото си на отказ
          </h2>
          <p>
            За да се откажете от поръчката, свържете се с нас по един от следните начини:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              По телефон:{" "}
              <a href="tel:+359888745410" className="text-foreground hover:underline">
                +359 888 745 410
              </a>
            </li>
            <li>
              По имейл:{" "}
              <a href="mailto:aromatnomagazinche@abv.bg" className="text-foreground hover:underline">
                aromatnomagazinche@abv.bg
              </a>
            </li>
          </ul>
          <p className="mt-3">
            Моля, посочете номера на поръчката и причината за отказа.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold uppercase tracking-wide text-foreground mb-2">
            Разходи по връщането
          </h2>
          <p>
            Разходите за връщане на стоката са за сметка на клиента, освен в случай че стоката е
            дефектна или получена в грешен вид.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold uppercase tracking-wide text-foreground mb-2">
            Възстановяване на сумата
          </h2>
          <p>
            След получаване и проверка на върнатата стока, ще възстановим платената сума в срок
            до <strong>14 дни</strong> по същия начин, по който е извършено плащането.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold uppercase tracking-wide text-foreground mb-2">
            Изключения
          </h2>
          <p>Правото на отказ не се прилага за:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Стоки, които са отворени и по хигиенни причини не могат да бъдат върнати.</li>
            <li>Стоки, изработени по индивидуална поръчка на потребителя.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { BrandMarquee } from "@/components/layout/BrandMarquee";

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-5 w-5" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-5 w-5" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l-.02-8.43a8.25 8.25 0 0 0 4.83 1.55V5.02a4.85 4.85 0 0 1-1.04-.33z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t mt-16">
      {/* Brand logo marquee */}
      <BrandMarquee />

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* ПОСЛЕДВАЙТЕ НИ */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest mb-5">
              Последвайте ни
            </h2>
            <div className="flex flex-col gap-4">

              {/* Facebook — brand blue */}
              <a
                href="https://www.facebook.com/profile.php?id=61584327901576"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm font-medium hover:opacity-80 transition-opacity"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white shrink-0"
                  style={{ backgroundColor: "#1877F2" }}
                >
                  <FacebookIcon />
                </span>
                <span className="text-foreground">Facebook</span>
              </a>

              {/* Instagram — brand gradient */}
              <a
                href="https://www.instagram.com/aromatenmagazin.montana"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm font-medium hover:opacity-80 transition-opacity"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full shrink-0"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                  }}
                >
                  <InstagramIcon />
                </span>
                <span className="text-foreground">Instagram</span>
              </a>

              {/* TikTok — brand black */}
              <a
                href="https://www.tiktok.com/@aromatenmagazinmontana"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm font-medium hover:opacity-80 transition-opacity"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full shrink-0"
                  style={{ backgroundColor: "#010101" }}
                >
                  <TikTokIcon />
                </span>
                <span className="text-foreground">TikTok</span>
              </a>

            </div>
          </div>

          {/* ИНФОРМАЦИЯ */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest mb-5">
              Информация
            </h2>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/za-nas"
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  За нас
                </Link>
              </li>
              <li>
                <Link
                  href="/dostavka"
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Доставка
                </Link>
              </li>
              <li>
                <Link
                  href="/otkaz-ot-pokupka"
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Отказ от покупка
                </Link>
              </li>
              <li>
                <a
                  href="https://www.google.com/maps?hl=bg&gl=bg&um=1&ie=UTF-8&fb=1&sa=X&ftid=0x40aa87be1ef4e07f:0xddcf0d0de9a001fb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Намерете ни тук
                </a>
              </li>
            </ul>
          </div>

          {/* Контакти */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest mb-5">
              Контакти
            </h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a
                  href="tel:+359888745410"
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  +359 888 745 410
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a
                  href="mailto:aromatnomagazinche@abv.bg"
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  aromatnomagazinche@abv.bg
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <p className="text-base font-medium text-muted-foreground">
                  ул. „Св. Климент Охридски" 24, Монтана
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>© 2025 Aromaten. Всички права запазени.</p>
      </div>
    </footer>
  );
}

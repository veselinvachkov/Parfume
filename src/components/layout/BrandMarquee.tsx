const LOGOS = [
  { file: "Eolia.png",    alt: "EOLÌA" },
  { file: "Organica.png", alt: "ORGANICA" },
  { file: "Akbari.png",   alt: "AKBARi" },
  { file: "Lataffa.png",  alt: "Lattafa",  scale: "scale-125" },
  { file: "RPParis.png",  alt: "RP Paris", scale: "scale-125" },
  { file: "khadlaj.png",  alt: "Khadlaj" },
  { file: "LPDO.png",     alt: "LPDO" },
  { file: "Estiara.png",  alt: "EstiarA" },
  { file: "Mitomo.png",   alt: "Mitomo" },
  { file: "Montale.png",  alt: "Montale" },
];

export function BrandMarquee() {
  return (
    <div className="w-full overflow-hidden border-y bg-muted/20 py-5 select-none">
      <div className="flex w-max animate-marquee items-center">
        {[...LOGOS, ...LOGOS].map((logo, i) => (
          <div
            key={i}
            className="mx-8 flex h-16 w-40 shrink-0 items-center justify-center rounded-lg bg-white px-4 py-2 shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/logos/${logo.file}`}
              alt={logo.alt}
              className={`h-full w-full object-contain${"scale" in logo ? ` ${logo.scale}` : ""}`}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

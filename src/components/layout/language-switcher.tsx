"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";

const locales = [
  { code: "it", label: "IT", flag: "🇮🇹" },
  { code: "en", label: "EN", flag: "🇬🇧" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-0.5 border border-border/30">
      {locales.map((l) => {
        const isActive = locale === l.code;
        const href = l.code === "it"
          ? pathname.replace(/^\/en/, "/") || "/"
          : "/en" + (pathname === "/" ? "" : pathname);
        return (
          <Link
            key={l.code}
            href={href}
            className={`px-2 py-1 text-[0.6rem] font-semibold rounded-md transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {l.flag} {l.label}
          </Link>
        );
      })}
    </div>
  );
}

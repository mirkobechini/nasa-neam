"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";

const locales = ["it", "en"];

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  // /en/viewer → /viewer  /it → /   /en → /
  const cleanPath = pathname.replace(/^\/(it|en)(\/|$)/, "/") || "/";

  return (
    <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-0.5 border border-border/30">
      {locales.map((l) => {
        const isActive = locale === l;
        return (
          <Link
            key={l}
            href={cleanPath}
            locale={l}
            className={`px-2 py-1 text-[0.6rem] font-semibold rounded-md transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {l.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}

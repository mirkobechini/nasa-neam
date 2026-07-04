"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const locales = ["it", "en"];

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-0.5 border border-border/30">
      {locales.map((l) => {
        const isActive = locale === l;
        return (
          <button
            key={l}
            onClick={() => router.replace(pathname, { locale: l })}
            className={`px-2 py-1 text-[0.6rem] font-semibold rounded-md transition-colors ${isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {l.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

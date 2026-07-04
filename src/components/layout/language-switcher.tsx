"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

const locales = ["it", "en"];

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (newLocale: string) => {
    if (newLocale === locale) return;
    const newPath = newLocale === "it"
      ? pathname.replace(/^\/en/, "") || "/"
      : "/en" + pathname;
    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-0.5 border border-border/30">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => handleSwitch(l)}
          disabled={isPending}
          className={`px-2 py-1 text-[0.6rem] font-semibold rounded-md transition-colors ${locale === l
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
            } ${isPending ? "opacity-50" : ""}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

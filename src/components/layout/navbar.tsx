"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { RateLimitBadge } from "@/components/rate-limit/rate-limit-badge";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export function Navbar() {
    const t = useTranslations("nav");
    const pathname = usePathname();

    const links = [
        { href: "/", label: t("dashboard"), icon: "◆" },
        { href: "/catalog", label: t("asteroids"), icon: "☄" },
        { href: "/viewer", label: t("view3d"), icon: "◈" },
        { href: "/education", label: t("learn"), icon: "◎" },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border">
            <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-14">
                <Link href="/" className="flex items-center gap-2 font-heading font-black text-lg text-primary">
                    <span>☄️</span>
                    <span className="hidden sm:inline">N.E.A.M.</span>
                </Link>

                <div className="flex items-center gap-1">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${pathname === l.href
                                ? "bg-primary/20 text-primary"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {l.icon} {l.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <RateLimitBadge />
                    <LanguageSwitcher />
                </div>
            </div>
        </nav>
    );
}
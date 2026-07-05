import type { Metadata } from "next";
import { Exo_2, Orbitron, Noto_Sans_JP } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "../globals.css";
import { NavbarWrapper } from "@/components/layout/navbar-wrapper";
import { ClientProviders } from "@/components/layout/client-providers";

const exo2 = Exo_2({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const orbitron = Orbitron({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-jp",
  subsets: ["latin"],
  weight: ["300", "500", "700"],
});

export const metadata: Metadata = {
  title: "☄️ N.E.A.M. — Near Earth Asteroid Monitor",
  description:
    "Monitor near-Earth asteroids with real-time data from NASA NeoWs. Interactive visualizations, alerts, and educational resources.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${exo2.variable} ${orbitron.variable} ${notoSansJP.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <ClientProviders>
            <NavbarWrapper />
            {children}
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

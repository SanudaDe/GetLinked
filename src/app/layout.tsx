import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/data/store";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://getlinked.lk"),
  title: "Get Linked | Verified Creators & Stays in Sri Lanka",
  description:
    "Connecting verified social media creators with handpicked hotels, villas, and guesthouses across Sri Lanka through human review and curated introductions.",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Get Linked - Sri Lanka Creator & Stay Marketplace",
    description:
      "Connecting verified social media creators with handpicked hotels, villas, and guesthouses across Sri Lanka through human review and curated introductions.",
    url: "https://getlinked.lk",
    siteName: "Get Linked Sri Lanka",
    images: [
      {
        url: "/images/logo.png",
        width: 300,
        height: 61,
        alt: "GetLinked Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var stored = localStorage.getItem('getlinked-theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (stored === 'dark' || (!stored && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch(e) {}
            })();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-serif bg-white dark:bg-black text-[#1A3739] dark:text-white antialiased selection:bg-[#D7400B] selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <StoreProvider>
            <AppShell>{children}</AppShell>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

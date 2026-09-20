import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/data/store";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://getlinked.today"),
  title: "Get Linked | Verified Creators & Stays in Sri Lanka",
  description:
    "Connecting verified social media creators with handpicked hotels, villas, and guesthouses across Sri Lanka through human review and curated introductions.",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Get Linked — Sri Lanka Creator & Stay Marketplace",
    description:
      "Connecting verified social media creators with handpicked hotels, villas, and guesthouses across Sri Lanka through human review and curated introductions.",
    url: "https://getlinked.today",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#122026] antialiased selection:bg-[#25aca9] selection:text-white">
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}

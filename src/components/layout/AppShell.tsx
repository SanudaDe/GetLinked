"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // Render the isolated operational admin system with its own shell
    return <div className="min-h-screen bg-sand-100/50 flex flex-col">{children}</div>;
  }

  // Render public travel-commerce marketing site with public header and footer
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
};

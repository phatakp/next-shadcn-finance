import { SiteNavigation } from "@/components/nav/site-navigation";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import AppProvider from "./app-provider";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased scroll-smooth",
          fontSans.variable
        )}
      >
        <AppProvider>
          <SiteNavigation />
          <main className="container">{children}</main>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}

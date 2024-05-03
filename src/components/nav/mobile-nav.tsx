"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/lib/config/site";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { SiteLogo } from "./site-logo";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  function closeSidebar() {
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
          >
            <path
              d="M3 5H11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 12H16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 19H21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="sm:max-w-xs h-screen">
        <nav className="grid gap-6 text-lg font-medium">
          <SiteLogo />
          {siteConfig.navlinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              onClick={closeSidebar}
            >
              {link.icon}
              {link.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { siteConfig } from "@/lib/config/site";
import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";
import { NavLink } from "./nav-link";
import { SiteLogo } from "./site-logo";
import { ThemeSwitcher } from "./theme-switcher";

export function SiteNavigation() {
  const pathName = usePathname();
  const title = pathName.slice(1);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-4">
        <div className="mr-4 hidden md:flex">
          <SiteLogo />
          <nav className="flex items-center gap-4 text-sm lg:gap-6">
            {siteConfig.navlinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>
        </div>

        <MobileNav />

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <span className="md:hidden font-semibold capitalize text-lg">
              {title}
            </span>
          </div>
          <nav className="flex items-center">
            <ThemeSwitcher />
          </nav>
        </div>
      </div>
    </header>
  );
}

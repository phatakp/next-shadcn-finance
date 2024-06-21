import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";
import { getSignInUrl, getUser } from "@workos-inc/authkit-nextjs";
import Link from "next/link";
import { MobileNav } from "./mobile-nav";
import { NavHeader } from "./nav-header";
import { NavLink } from "./nav-link";
import { SiteLogo } from "./site-logo";
import { ThemeSwitcher } from "./theme-switcher";

export async function SiteNavigation() {
  const { user } = await getUser();
  const authorizationUrl = await getSignInUrl();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-4">
        <div className="mr-4 hidden md:flex">
          <SiteLogo />
          {!!user && (
            <nav className="flex items-center gap-4 text-sm lg:gap-6">
              {siteConfig.navlinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </nav>
          )}
        </div>

        <MobileNav />

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <NavHeader />
          <nav className="flex items-center gap-4">
            <ThemeSwitcher />
            {!user && (
              <Link href={authorizationUrl} className={cn(buttonVariants())}>
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

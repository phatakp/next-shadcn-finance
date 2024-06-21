"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  title: string;
};

export function NavLink({ href, title }: Props) {
  const pathName = usePathname();
  const isActive = pathName === href;

  return (
    <Link
      className={cn(
        "transition-colors hover:text-foreground/80 text-foreground/60",
        isActive && "text-primary dark:text-primary-light"
      )}
      href={href}
    >
      {title}
    </Link>
  );
}

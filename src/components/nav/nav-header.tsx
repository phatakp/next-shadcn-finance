"use client";

import { usePathname } from "next/navigation";

export function NavHeader() {
  const pathName = usePathname();
  const title = pathName.slice(1);
  return (
    <div className="w-full flex-1 md:w-auto md:flex-none">
      <span className="md:hidden font-semibold capitalize text-lg">
        {title}
      </span>
    </div>
  );
}

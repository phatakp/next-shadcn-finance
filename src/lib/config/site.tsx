import {
  Landmark,
  PieChart,
  ReceiptIndianRupee,
  UsersRound,
} from "lucide-react";

export const siteConfig = {
  name: "$PENDO",
  description: "Personal Finance Management app created in NextJS",
  navlinks: [
    {
      href: "/dashboard",
      title: "Dashboard",
      icon: <PieChart className="size-5" />,
    },
    {
      href: "/accounts",
      title: "Accounts",
      icon: <Landmark className="size-5" />,
    },
    {
      href: "/transactions",
      title: "Transactions",
      icon: <ReceiptIndianRupee className="size-5" />,
    },
    {
      href: "/groups",
      title: "Groups",
      icon: <UsersRound className="size-5" />,
    },
  ],
};

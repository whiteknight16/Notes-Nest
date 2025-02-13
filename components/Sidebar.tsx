"use client"; // Ensures this is a client component

import React from "react";
import { Home, Settings, CreditCard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SideBarItems {
  id: number;
  name: string;
  icon: React.ComponentType;
  href: string;
}

const sidebarItems: SideBarItems[] = [
  { id: 1, name: "Dashboard", icon: Home, href: "/dashboard" },
  { id: 2, name: "Settings", icon: Settings, href: "/dashboard/settings" },
  { id: 3, name: "Billing", icon: CreditCard, href: "/dashboard/billing" },
];

const Sidebar = () => {
  const pathname = usePathname(); // Ensures it's a client-side component

  return (
    <div className="h-screen bg-white text-black  dark:bg-gray-900 dark:text-white transition-all w-20 md:w-64 border-r-2 border-gray-200 dark:border-gray-700">
      <nav className="flex flex-col mt-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.id} href={item.href} prefetch>
              <div
                className={cn(
                  "flex items-center gap-3 p-3 mx-2 rounded-lg cursor-pointer transition-all",
                  isActive
                    ? "bg-primary text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-600"
                )}
              >
                <item.icon
                  className={(cn("w-5 h-5 "), isActive ? "" : "text-primary")}
                />
                <span className="hidden md:block">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;

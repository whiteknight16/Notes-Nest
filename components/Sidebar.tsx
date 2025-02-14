"use client";

import React from "react";
import { Home, Settings, CreditCard } from "lucide-react";
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
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-all w-20 md:w-64 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <nav className="flex flex-col pt-4 gap-3">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <a key={item.id} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 p-3 mx-2 rounded-lg cursor-pointer transition-all",
                  isActive
                    ? "bg-primary text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-600"
                )}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    isActive ? "text-white" : "text-primary"
                  }`}
                />
                <span className="hidden md:block">{item.name}</span>
              </div>
            </a>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;

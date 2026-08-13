"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { mainNav, adminOnlyNav } from "./nav-config";
import { LogoutButton } from "@/app/admin/dashboard/logout-button";
import { cn } from "@/lib/utils";

type SidebarProps = {
  role: "admin" | "staff";
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const navItems = role === "admin" ? [...mainNav, ...adminOnlyNav] : mainNav;

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-background">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <Image
          src="/images/dnhs-logo.png"
          alt="Dimasalang National High School Seal"
          width={32}
          height={32}
          className="h-8 w-8"
        />
        <div className="flex flex-col leading-tight">
          <span className="font-heading text-sm font-semibold text-foreground">
            DNHS Administrator
          </span>
          <span className="text-xs capitalize text-muted-foreground">
            {role} panel
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout, pinned bottom */}
      <div className="border-t border-border p-3">
        <LogoutButton />
      </div>
    </aside>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { mainNav, adminOnlyNav } from "./nav-config";
import { LogoutButton } from "@/app/admin/dashboard/logout-button";
import { cn } from "@/lib/utils";

type SidebarProps = {
  role: "admin" | "staff";
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const navItems = role === "admin" ? [...mainNav, ...adminOnlyNav] : mainNav;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* MOBILE & TABLET HEADER (Left-aligned Hamburger only, no logo/title) */}
      <div
        ref={containerRef}
        className="relative border-b border-border bg-background md:hidden"
      >
        <div className="flex items-center px-4 py-3">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute left-0 top-full z-50 w-full border-b border-border bg-background shadow-lg">
            <nav className="flex flex-col space-y-1 p-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
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

            <div className="border-t border-border p-3">
              <LogoutButton />
            </div>
          </div>
        )}
      </div>

      {/* DESKTOP SIDEBAR (Visible only on md+) */}
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-background md:flex">
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

        {/* Logout */}
        <div className="border-t border-border p-3">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}

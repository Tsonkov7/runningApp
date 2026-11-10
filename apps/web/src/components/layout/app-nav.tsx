"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAccessToken } from "@/lib/auth/token";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/plan", label: "Plan" },
  { href: "/calendar", label: "Calendar" },
  { href: "/runs", label: "Runs" },
  { href: "/progress", label: "Progress" },
] as const;

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  function onLogout() {
    clearAccessToken();
    router.replace("/login");
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <nav className="flex flex-wrap gap-3 text-sm" aria-label="Main">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "font-medium underline text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={onLogout}
          className="text-sm text-muted-foreground underline hover:text-foreground"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

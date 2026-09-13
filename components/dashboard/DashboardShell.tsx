"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, ChevronDown, LogOut, ChevronRight } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatusDot } from "@/components/ui/StatusDot";
import { findNavItem } from "@/lib/nav";
import type { HealthStatus, ServerOverview } from "@/lib/bot-api";

export function DashboardShell({
  username,
  avatarUrl,
  health,
  overview,
  children,
}: {
  username: string;
  avatarUrl: string | null;
  health: HealthStatus | null;
  overview: ServerOverview | null;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const crumb = findNavItem(pathname);

  return (
    <div className="flex min-h-screen bg-hl-bg">
      <div className="hidden shrink-0 border-r border-hl-border lg:block">
        <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((v) => !v)} health={health} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <div className="hl-glass absolute inset-y-0 left-0 border-r border-hl-border">
            <Sidebar onNavigate={() => setMobileOpen(false)} health={health} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="hl-glass sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-hl-border px-4 py-3 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-hl-border p-2 text-hl-muted lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={16} />
            </button>

            <div className="hidden min-w-0 items-center gap-1.5 text-sm text-hl-faint sm:flex">
              {crumb ? (
                <>
                  <span>{crumb.group.label}</span>
                  <ChevronRight size={13} />
                  <span className="truncate text-hl-text">{crumb.item.label}</span>
                </>
              ) : (
                <span className="text-hl-text">Dashboard</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {overview && (
              <div className="hidden items-center gap-1.5 rounded-full border border-hl-border px-2.5 py-1 text-xs text-hl-muted md:flex">
                <StatusDot tone={health?.status === "online" ? "success" : "danger"} />
                {overview.name}
              </div>
            )}

            <NotificationsMenu />
            <UserMenu username={username} avatarUrl={avatarUrl} />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

function useClickOutside(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);
  return ref;
}

function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-lg border border-hl-border p-2 text-hl-muted transition-colors hover:border-hl-border-strong hover:text-hl-text"
        aria-label="Notifications"
      >
        <Bell size={16} />
      </button>
      {open && (
        <div className="hl-animate-in absolute right-0 top-11 w-64 rounded-xl border border-hl-border bg-hl-surface-solid p-3 shadow-xl">
          <p className="px-1 pb-2 text-xs font-medium uppercase tracking-wide text-hl-faint">Notifications</p>
          <p className="px-1 py-3 text-sm text-hl-muted">
            No notifications yet — this isn&apos;t wired up to the bot yet.
          </p>
        </div>
      )}
    </div>
  );
}

function UserMenu({ username, avatarUrl }: { username: string; avatarUrl: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-hl-border py-1 pl-1 pr-2 transition-colors hover:border-hl-border-strong"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="h-6 w-6 rounded-md" />
        ) : (
          <div className="h-6 w-6 rounded-md bg-hl-surface-raised" />
        )}
        <span className="hidden max-w-[8rem] truncate text-sm text-hl-text sm:block">{username}</span>
        <ChevronDown size={13} className="text-hl-faint" />
      </button>

      {open && (
        <div className="hl-animate-in absolute right-0 top-11 w-48 rounded-xl border border-hl-border bg-hl-surface-solid p-1.5 shadow-xl">
          <Link
            href="/dashboard/settings"
            className="block rounded-lg px-3 py-2 text-sm text-hl-muted transition-colors hover:bg-hl-surface-raised hover:text-hl-text"
            onClick={() => setOpen(false)}
          >
            Settings
          </Link>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-hl-danger transition-colors hover:bg-hl-danger-soft"
            >
              <LogOut size={14} /> Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { NAV } from "@/lib/nav";
import { StatusDot } from "@/components/ui/StatusDot";
import type { HealthStatus } from "@/lib/bot-api";

export function Sidebar({
  onNavigate,
  collapsed,
  onToggleCollapse,
  health,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  health: HealthStatus | null;
}) {
  const pathname = usePathname();
  const online = health?.status === "online";

  return (
    <div className={`hl-brand-glow flex h-full flex-col ${collapsed ? "w-[68px]" : "w-64"} transition-[width] duration-200`}>
      <div className={`flex items-center gap-2.5 px-4 py-5 ${collapsed ? "justify-center px-0" : ""}`}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-hl-blue to-hl-violet text-sm font-bold text-white">
          H
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="hl-gradient-text font-display text-lg leading-tight">Heaven Land</p>
            <p className="truncate text-[11px] text-hl-faint">Private Control Panel</p>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="mx-4 mb-4 flex items-center gap-2 rounded-lg border border-hl-border bg-hl-surface-raised/60 px-3 py-2">
          <StatusDot tone={online ? "success" : "danger"} pulse={online} />
          <span className="text-xs text-hl-muted">
            Bot {online ? "online" : health ? "starting" : "offline"}
          </span>
          {online && health?.latency_ms !== null && health?.latency_ms !== undefined && (
            <span className="ml-auto text-[11px] text-hl-faint">{health.latency_ms}ms</span>
          )}
        </div>
      )}

      <nav className="hl-scroll flex-1 overflow-y-auto px-3 pb-4">
        {NAV.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <p className="px-2 pb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-hl-faint">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      title={collapsed ? item.label : undefined}
                      className={`group relative flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] transition-colors ${
                        collapsed ? "justify-center" : ""
                      } ${
                        active
                          ? "bg-hl-accent-soft text-hl-blue-strong"
                          : "text-hl-muted hover:bg-hl-surface-raised hover:text-hl-text"
                      }`}
                    >
                      {active && !collapsed && (
                        <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-hl-blue" />
                      )}
                      <Icon size={16} strokeWidth={1.75} className="shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {!collapsed && item.comingSoon && (
                        <span className="ml-auto rounded-full border border-hl-border-soft px-1.5 py-0.5 text-[9.5px] text-hl-faint">
                          soon
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="mx-3 mb-3 flex items-center justify-center gap-2 rounded-lg border border-hl-border py-2 text-xs text-hl-faint transition-colors hover:border-hl-border-strong hover:text-hl-muted"
        >
          {collapsed ? <ChevronsRight size={14} /> : (<><ChevronsLeft size={14} /> Collapse</>)}
        </button>
      )}
    </div>
  );
}

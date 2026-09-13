import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Bot,
  SlidersHorizontal,
  Globe,
  Hash,
  ShieldCheck,
  Lock,
  Gavel,
  TriangleAlert,
  ScrollText,
  PartyPopper,
  UserPlus,
  Users2,
  BookOpen,
  Gem,
  Swords,
  Sparkles,
  Coins,
  Gift,
  Shield,
  Users,
  UserCircle,
  Backpack,
  BarChart3,
  Trophy,
  Activity,
  Settings,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  comingSoon?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Bot",
    items: [
      { label: "Bot Status", href: "/dashboard/bot/status", icon: Bot },
      { label: "Bot Settings", href: "/dashboard/bot/settings", icon: SlidersHorizontal },
    ],
  },
  {
    label: "Server",
    items: [
      { label: "Server Overview", href: "/dashboard/server", icon: Globe },
      { label: "Channels", href: "/dashboard/server/channels", icon: Hash },
      { label: "Roles", href: "/dashboard/server/roles", icon: ShieldCheck },
      { label: "Permissions", href: "/dashboard/server/permissions", icon: Lock, comingSoon: true },
    ],
  },
  {
    label: "Moderation",
    items: [
      { label: "Moderation", href: "/dashboard/moderation", icon: Gavel },
      { label: "Warnings", href: "/dashboard/moderation/warnings", icon: TriangleAlert, comingSoon: true },
      { label: "Logs", href: "/dashboard/moderation/logs", icon: ScrollText, comingSoon: true },
    ],
  },
  {
    label: "Automation",
    items: [
      { label: "Welcome", href: "/dashboard/automation/welcome", icon: PartyPopper, comingSoon: true },
      { label: "Auto Roles", href: "/dashboard/automation/auto-roles", icon: UserPlus, comingSoon: true },
    ],
  },
  {
    label: "Character System",
    items: [
      { label: "Characters", href: "/dashboard/characters", icon: Users2 },
      { label: "Series", href: "/dashboard/series", icon: BookOpen },
      { label: "Rarities", href: "/dashboard/rarities", icon: Gem },
    ],
  },
  {
    label: "Game System",
    items: [
      { label: "Quests", href: "/dashboard/quests", icon: Swords },
      { label: "Summons", href: "/dashboard/summons", icon: Sparkles },
      { label: "Battles", href: "/dashboard/battles", icon: Shield },
      { label: "Economy", href: "/dashboard/economy", icon: Coins },
      { label: "Rewards", href: "/dashboard/rewards", icon: Gift },
      { label: "In-Game Guilds", href: "/dashboard/game-guilds", icon: Shield },
    ],
  },
  {
    label: "Users",
    items: [
      { label: "Users", href: "/dashboard/users", icon: Users },
      { label: "Profiles", href: "/dashboard/profiles", icon: UserCircle },
      { label: "Inventory", href: "/dashboard/inventory", icon: Backpack },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "Statistics", href: "/dashboard/statistics", icon: BarChart3 },
      { label: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
      { label: "Activity", href: "/dashboard/activity", icon: Activity, comingSoon: true },
    ],
  },
  {
    label: "System",
    items: [{ label: "Settings", href: "/dashboard/settings", icon: Settings }],
  },
];

export function findNavItem(pathname: string): { group: NavGroup; item: NavItem } | null {
  for (const group of NAV) {
    for (const item of group.items) {
      if (item.href === pathname) return { group, item };
    }
  }
  // Fallback: longest-prefix match for dynamic routes (e.g. /dashboard/characters/123)
  let best: { group: NavGroup; item: NavItem } | null = null;
  for (const group of NAV) {
    for (const item of group.items) {
      if (item.href !== "/dashboard" && pathname.startsWith(item.href)) {
        if (!best || item.href.length > best.item.href.length) {
          best = { group, item };
        }
      }
    }
  }
  return best;
}

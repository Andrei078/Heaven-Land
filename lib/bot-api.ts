import { config } from "@/lib/config";

export class BotApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  init?: RequestInit & { query?: Record<string, string | number | undefined> },
): Promise<T> {
  const baseUrl = config.botApi.url();
  const apiKey = config.botApi.key();

  const url = new URL(path, baseUrl);
  if (init?.query) {
    for (const [key, value] of Object.entries(init.query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = await response.json();
      detail = body?.detail ?? detail;
    } catch {
      // ignore
    }
    throw new BotApiError(response.status, detail);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

const get = <T>(path: string, query?: Record<string, string | number | undefined>) =>
  request<T>(path, { method: "GET", query });

const post = <T>(path: string, body?: unknown, query?: Record<string, string | number | undefined>) =>
  request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined, query });

const patch = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "PATCH", body: JSON.stringify(body) });

const put = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "PUT", body: JSON.stringify(body) });

const del = <T>(path: string) => request<T>(path, { method: "DELETE" });

// ---------------------------------------------------------------------
// Types (mirroring the bot's real JSON schema — see database analysis)
// ---------------------------------------------------------------------

export interface HealthStatus {
  status: "online" | "starting";
  bot_user: string | null;
  latency_ms: number | null;
  guild_count: number;
}

export interface Stats {
  users: number;
  characters: number;
  quests: number;
  series: number;
  rarities: number;
  in_game_guilds: number;
}

export interface Settings {
  bot_name: string;
  prefix: string;
  market_tax: number;
  daily_cooldown: number;
  daily_summon_cooldown: number;
  summon_cost: number;
  [key: string]: unknown;
}

export interface Character {
  global_id: number;
  name: string;
  series_id: number;
  rarity: string;
  base_hp: number;
  base_mp: number;
  base_stamina: number;
  base_attack: number;
  base_defense: number;
  special_ability: string;
  image: string;
  enabled: boolean;
  level: number;
}

export interface Series {
  id: number;
  name: string;
  type: string;
  description: string;
}

export interface Rarity {
  name: string;
  chance: number;
  summon_cost: number;
  max_ascension: number;
  max_level: number;
  color: number;
  border: string;
  special: boolean;
}

export interface Quest {
  id: number;
  name: string;
  description: string;
  type: string;
  difficulty: string;
  min_level: number;
  max_level: number;
  target: number;
  rewards: { xp?: number; money?: number; [key: string]: unknown };
  repeatable: boolean;
  enabled: boolean;
}

export interface UserSummary {
  discord_id: string;
  username: string;
  level: number;
  xp: number;
  money: number;
}

export interface UserDetail {
  discord_id: number;
  username: string;
  level: number;
  xp: number;
  money: number;
  inventory: unknown[];
  [key: string]: unknown;
}

export interface UserListResponse {
  total: number;
  limit: number;
  offset: number;
  items: UserSummary[];
}

export interface LeaderboardEntry {
  discord_id: string;
  username: string;
  level: number;
  xp: number;
}

export interface GameGuild {
  id: number;
  name: string;
  description: string;
  founder_id: number;
  founder_name: string;
  created_at: string;
  members: number[];
  requests: number[];
  requirements: { min_level: number; min_money: number };
}

export interface ServerOverview {
  id: number;
  name: string;
  icon_url: string | null;
  member_count: number;
  channel_count: number;
  role_count: number;
  created_at: string;
  owner_id: number;
}

export interface ServerChannel {
  id: number;
  name: string;
  type: string;
  position: number | null;
}

export interface ServerRole {
  id: number;
  name: string;
  color: string;
  position: number;
  member_count: number;
  managed: boolean;
}

// ---------------------------------------------------------------------
// API surface
// ---------------------------------------------------------------------

export const botApi = {
  health: () => get<HealthStatus>("/health"),
  stats: () => get<Stats>("/stats"),

  settings: {
    get: () => get<Settings>("/settings"),
    update: (updates: Partial<Settings>) => patch<Settings>("/settings", updates),
  },

  characters: {
    list: () => get<Record<string, Character>>("/characters"),
    get: (id: number) => get<Character>(`/characters/${id}`),
    create: (data: Partial<Character>) => post<Character>("/characters", data),
    update: (id: number, data: Partial<Character>) => patch<Character>(`/characters/${id}`, data),
    delete: (id: number) => del<{ deleted: boolean }>(`/characters/${id}`),
  },

  series: {
    list: () => get<Record<string, Series>>("/series"),
    create: (data: Partial<Series>) => post<Series>("/series", data),
    update: (id: number, data: Partial<Series>) => patch<Series>(`/series/${id}`, data),
    delete: (id: number) => del<{ deleted: boolean }>(`/series/${id}`),
  },

  rarities: {
    list: () => get<Record<string, Rarity>>("/rarities"),
    upsert: (name: string, data: Rarity) => put<Rarity>(`/rarities/${encodeURIComponent(name)}`, data),
    delete: (name: string) => del<{ deleted: boolean }>(`/rarities/${encodeURIComponent(name)}`),
  },

  quests: {
    list: () => get<Record<string, Quest>>("/quests"),
    create: (data: Partial<Quest>) => post<Quest>("/quests", data),
    update: (id: number, data: Partial<Quest>) => patch<Quest>(`/quests/${id}`, data),
    delete: (id: number) => del<{ deleted: boolean }>(`/quests/${id}`),
  },

  users: {
    list: (params?: { search?: string; limit?: number; offset?: number }) =>
      get<UserListResponse>("/users", params),
    get: (id: string | number) => get<UserDetail>(`/users/${id}`),
    update: (id: string | number, updates: Record<string, unknown>) =>
      patch<UserDetail>(`/users/${id}`, updates),
    addXp: (id: string | number, amount: number) =>
      post<UserDetail>(`/users/${id}/add-xp`, undefined, { amount }),
    addMoney: (id: string | number, amount: number) =>
      post<UserDetail>(`/users/${id}/add-money`, undefined, { amount }),
  },

  leaderboard: (limit = 10) => get<LeaderboardEntry[]>("/leaderboard", { limit }),

  gameGuilds: {
    list: () => get<Record<string, GameGuild>>("/game-guilds"),
    get: (id: number) => get<GameGuild>(`/game-guilds/${id}`),
  },

  server: {
    overview: () => get<ServerOverview>("/server/overview"),
    channels: () => get<ServerChannel[]>("/server/channels"),
    roles: () => get<ServerRole[]>("/server/roles"),
  },

  moderation: {
    ban: (user_id: string, reason?: string) => post("/moderation/ban", { user_id: Number(user_id), reason }),
    unban: (user_id: string, reason?: string) => post("/moderation/unban", { user_id: Number(user_id), reason }),
    mute: (user_id: string, minutes: number, reason?: string) =>
      post("/moderation/mute", { user_id: Number(user_id), minutes, reason }),
    unmute: (user_id: string, reason?: string) => post("/moderation/unmute", { user_id: Number(user_id), reason }),
    clean: (channel_id: string, amount: number) =>
      post<{ deleted_count: number }>("/moderation/clean", { channel_id: Number(channel_id), amount }),
    addRole: (user_id: string, role_id: string) =>
      post("/moderation/roles/add", { user_id: Number(user_id), role_id: Number(role_id) }),
    removeRole: (user_id: string, role_id: string) =>
      post("/moderation/roles/remove", { user_id: Number(user_id), role_id: Number(role_id) }),
  },
};

import { config } from "@/lib/config";

const DISCORD_API = "https://discord.com/api/v10";

export interface DiscordUser {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
}

export interface DiscordGuildSummary {
  id: string;
  name: string;
  owner: boolean;
  permissions: string; // stringified bitfield of the user's permissions in this guild
}

interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

/**
 * Builds the Discord OAuth2 authorize URL.
 * Scopes: identify + guilds, just enough to confirm who the user is
 * and whether they belong to the Heaven Land server — no bot token
 * is ever used or exposed on the dashboard side.
 */
export function buildAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: config.discord.clientId(),
    redirect_uri: config.discord.redirectUri(),
    response_type: "code",
    scope: "identify guilds",
    state,
    prompt: "consent",
  });

  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(
  code: string,
): Promise<DiscordTokenResponse> {
  const body = new URLSearchParams({
    client_id: config.discord.clientId(),
    client_secret: config.discord.clientSecret(),
    grant_type: "authorization_code",
    code,
    redirect_uri: config.discord.redirectUri(),
  });

  const response = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Discord token exchange failed (${response.status})`);
  }

  return response.json();
}

export async function fetchDiscordUser(
  accessToken: string,
): Promise<DiscordUser> {
  const response = await fetch(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Discord user (${response.status})`);
  }

  return response.json();
}

/**
 * Returns the guilds the logged-in Discord user belongs to.
 * Used only to confirm membership in HEAVEN_LAND_GUILD_ID — never
 * exposed as a "pick a server" selector.
 */
export async function fetchDiscordUserGuilds(
  accessToken: string,
): Promise<DiscordGuildSummary[]> {
  const response = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Discord guilds (${response.status})`);
  }

  return response.json();
}

export function discordAvatarUrl(user: DiscordUser): string | null {
  if (!user.avatar) return null;
  const ext = user.avatar.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=64`;
}

const ADMINISTRATOR_BIT = BigInt(0x8);

/**
 * Mirrors the bot's own moderation gate (has_guild_permissions(administrator=True)):
 * dashboard access requires the same Administrator permission on the
 * Heaven Land server, computed by Discord itself from the user's roles.
 */
export function hasAdministratorPermission(permissions: string): boolean {
  try {
    return (BigInt(permissions) & ADMINISTRATOR_BIT) === ADMINISTRATOR_BIT;
  } catch {
    return false;
  }
}

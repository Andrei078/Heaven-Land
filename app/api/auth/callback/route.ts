import { NextRequest, NextResponse } from "next/server";
import { BotApiError, botApi } from "@/lib/bot-api";
import {
  exchangeCodeForToken,
  fetchDiscordUser,
  fetchDiscordUserGuilds,
  hasAdministratorPermission,
} from "@/lib/discord";
import { consumeOAuthState, createSession } from "@/lib/session";

function denied(request: NextRequest, reason: string): NextResponse {
  const url = new URL("/access-denied", request.url);
  url.searchParams.set("reason", reason);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // The user can cancel consent on Discord's side.
  if (searchParams.get("error")) {
    return denied(request, "oauth_cancelled");
  }

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return denied(request, "oauth_error");
  }

  const expectedState = await consumeOAuthState();

  if (!expectedState || expectedState !== state) {
    return denied(request, "oauth_error");
  }

  try {
    const token = await exchangeCodeForToken(code);
    const user = await fetchDiscordUser(token.access_token);
    const userGuilds = await fetchDiscordUserGuilds(token.access_token);

    // The bot itself is the source of truth for which single Discord
    // server this dashboard controls — no duplicate GUILD_ID to keep
    // in sync on the dashboard side.
    let heavenLandGuildId: string;
    try {
      const overview = await botApi.server.overview();
      heavenLandGuildId = String(overview.id);
    } catch (error) {
      console.error("[auth/callback] Bot API unreachable:", error);
      return denied(request, "bot_unreachable");
    }

    const membership = userGuilds.find((g) => g.id === heavenLandGuildId);

    if (!membership) {
      return denied(request, "not_in_guild");
    }

    // Administrator (or ownership) on the Heaven Land server — the
    // same gate the bot's own moderation commands already require.
    const isAllowed =
      membership.owner || hasAdministratorPermission(membership.permissions);

    if (!isAllowed) {
      return denied(request, "insufficient_permissions");
    }

    await createSession({
      sub: user.id,
      username: user.global_name ?? user.username,
      avatar: user.avatar,
    });

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    if (error instanceof BotApiError) {
      console.error("[auth/callback] Bot API error:", error.message);
      return denied(request, "bot_unreachable");
    }
    console.error("[auth/callback] failed:", error);
    return denied(request, "oauth_error");
  }
}

import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { buildAuthorizeUrl } from "@/lib/discord";
import { setOAuthState } from "@/lib/session";

export async function GET() {
  const state = randomBytes(24).toString("hex");

  await setOAuthState(state);

  return NextResponse.redirect(buildAuthorizeUrl(state));
}

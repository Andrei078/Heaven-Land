import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { config } from "@/lib/config";

const SESSION_COOKIE = "hl_session";
const STATE_COOKIE = "hl_oauth_state";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const STATE_MAX_AGE_SECONDS = 60 * 10; // 10 minutes

export interface SessionPayload {
  sub: string; // Discord user ID — must equal OWNER_ID to be valid.
  username: string;
  avatar: string | null;
}

function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(config.session.secret());
}

/**
 * Signs a session JWT and sets it as an httpOnly cookie.
 * Must be called from a Route Handler or Server Function.
 */
export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Reads and verifies the session cookie from a Server Component.
 * Returns null if there is no session or it is invalid/expired.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());

    if (typeof payload.sub !== "string" || typeof payload.username !== "string") {
      return null;
    }

    return {
      sub: payload.sub,
      username: payload.username,
      avatar: (payload.avatar as string | null) ?? null,
    };
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * CSRF protection for the OAuth2 redirect: a random state value is
 * stored in a short-lived httpOnly cookie before redirecting to
 * Discord, then compared against the callback's `state` query param.
 */
export async function setOAuthState(state: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: STATE_MAX_AGE_SECONDS,
  });
}

export async function consumeOAuthState(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(STATE_COOKIE)?.value ?? null;
  cookieStore.delete(STATE_COOKIE);
  return value;
}

/**
 * Edge-compatible verification, used by proxy.ts. Kept separate from
 * getSession() because proxy runs before Node's `next/headers` cookie
 * store is available in the same way — it reads straight from the
 * incoming request instead.
 */
export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());

    if (typeof payload.sub !== "string" || typeof payload.username !== "string") {
      return null;
    }

    return {
      sub: payload.sub,
      username: payload.username,
      avatar: (payload.avatar as string | null) ?? null,
    };
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };

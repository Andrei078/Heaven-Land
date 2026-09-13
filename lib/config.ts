function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `[Heaven Land Dashboard] Missing required environment variable: ${name}. ` +
        `Check your .env.local against .env.example.`,
    );
  }

  return value;
}

export const config = {
  discord: {
    clientId: () => required("DISCORD_CLIENT_ID"),
    clientSecret: () => required("DISCORD_CLIENT_SECRET"),
    redirectUri: () => required("DISCORD_REDIRECT_URI"),
  },
  session: {
    secret: () => required("SESSION_SECRET"),
  },
  botApi: {
    url: () => required("BOT_API_URL"),
    key: () => required("BOT_API_KEY"),
  },
};

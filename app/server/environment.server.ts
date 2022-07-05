import invariant from "tiny-invariant";

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  invariant(value, `Missing required environment variable: ${key}`);
  return value;
};
export const EnvironmentVariables = {
  Discord: {
    ClientID: getRequiredEnv("DISCORD_CLIENT_ID"),
    ClientSecret: getRequiredEnv("DISCORD_CLIENT_SECRET"),
    GuildID: getRequiredEnv("DISCORD_GUILD_ID"),
    BotToken: getRequiredEnv("DISCORD_BOT_TOKEN"),
    RequiredRole: getRequiredEnv("DISCORD_REQUIRED_ROLE_TO_AUTH"),
  },
  Session: {
    Secret: getRequiredEnv("SESSION_SECRET"),
  },
  BaseURL: getRequiredEnv("BASE_URL"),
};

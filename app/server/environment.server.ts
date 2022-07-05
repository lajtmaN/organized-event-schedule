import invariant from "tiny-invariant";

type EnvironmentVariable =
  | "DISCORD_CLIENT_ID"
  | "DISCORD_CLIENT_SECRET"
  | "DISCORD_GUILD_ID"
  | "DISCORD_BOT_TOKEN"
  | "DISCORD_REQUIRED_ROLE_TO_AUTH"
  | "SESSION_SECRET"
  | "BASE_URL";

export const getOptionalEnvVariable = (
  key: EnvironmentVariable
): string | null => {
  const value = process.env[key];
  return value ?? null;
};

export const getEnvVariable = (key: EnvironmentVariable): string => {
  const value = getOptionalEnvVariable(key);
  invariant(value, `Missing required environment variable: ${key}`);
  return value;
};

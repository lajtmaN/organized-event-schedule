import { Authenticator, AuthorizationError } from "remix-auth";
import type { DiscordProfile } from "remix-auth-socials";
import { SocialsProvider, DiscordStrategy } from "remix-auth-socials";
import { sessionStorage } from "~/services/session.server";
import * as DiscordApi from "./discord-api.server";
import { getEnvVariable } from "./environment.server";

export let authenticator = new Authenticator<User>(sessionStorage, {
  sessionKey: "_session",
});

authenticator.use(
  new DiscordStrategy(
    {
      clientID: getEnvVariable("DISCORD_CLIENT_ID"),
      clientSecret: getEnvVariable("DISCORD_CLIENT_SECRET"),
      callbackURL: new URL(
        `/auth/${SocialsProvider.DISCORD}/callback`,
        getEnvVariable("BASE_URL")
      ).toString(),
      scope: ["identify", "guilds", "guilds.members.read"],
    },
    async ({ profile, accessToken }) => {
      const requiredRole = getEnvVariable("DISCORD_REQUIRED_ROLE_TO_AUTH");
      const hasRole = await DiscordApi.hasRole(
        profile,
        accessToken,
        requiredRole
      );
      if (!hasRole) {
        throw new AuthorizationError(
          `You do not have access. You need the '${requiredRole}' on the server to gain access.`
        );
      }
      return {
        ...profile,
        avatarUrl: DiscordApi.getAvatarUrl(profile),
      };
    }
  )
);

export interface User extends DiscordProfile {
  avatarUrl: string;
}

import { Authenticator, AuthorizationError } from "remix-auth";
import type { DiscordProfile } from "remix-auth-socials";
import { SocialsProvider, DiscordStrategy } from "remix-auth-socials";
import { sessionStorage } from "~/services/session.server";
import * as DiscordApi from "./discord-api.server";
import { EnvironmentVariables } from "./environment.server";

// Create an instance of the authenticator
export let authenticator = new Authenticator<User>(sessionStorage, {
  sessionKey: "_session",
});

const BASE_URL = "http://localhost:3000"; // TODO - calculate current url instead of localhost:3000

authenticator.use(
  new DiscordStrategy(
    {
      clientID: EnvironmentVariables.Discord.ClientID,
      clientSecret: EnvironmentVariables.Discord.ClientSecret,
      callbackURL: new URL(
        `/auth/${SocialsProvider.DISCORD}/callback`,
        BASE_URL
      ).toString(),
      scope: ["identify", "guilds", "guilds.members.read"],
    },
    async ({ profile, accessToken }) => {
      const hasRole = await DiscordApi.hasRole(
        profile,
        accessToken,
        EnvironmentVariables.Discord.RequiredRole
      );
      if (!hasRole) {
        throw new AuthorizationError(
          `You do not have access. You need the '${EnvironmentVariables.Discord.RequiredRole}' on the server to gain access.`
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

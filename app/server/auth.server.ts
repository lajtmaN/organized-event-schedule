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

authenticator.use(
  new DiscordStrategy(
    {
      clientID: EnvironmentVariables.Discord.ClientID,
      clientSecret: EnvironmentVariables.Discord.ClientSecret,
      callbackURL: `http://localhost:3000/auth/${SocialsProvider.DISCORD}/callback`, // TODO - calculate current url instead of localhost:3000
      scope: ["identify", "guilds", "guilds.members.read"],
    },
    async ({ profile, accessToken }) => {
      const hasRole = await DiscordApi.hasRole(profile, accessToken, "crew");
      if (!hasRole) {
        throw new AuthorizationError("You do not have the required role.");
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

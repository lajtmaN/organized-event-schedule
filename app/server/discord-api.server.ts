import type { DiscordProfile } from "remix-auth-socials";
import { getEnvVariable } from "./environment.server";

export const getAvatarUrl = (
  user: Pick<DiscordProfile, "id" | "__json">
): string => {
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.__json.avatar}.png`;
};

export const hasRole = async (
  user: DiscordProfile,
  accessToken: string,
  requiredRole: string
) => {
  const guildRoles = await fetch(
    `${BaseURL}/guilds/${getEnvVariable("DISCORD_GUILD_ID")}/roles`,
    {
      headers: {
        Authorization: `Bot ${getEnvVariable("DISCORD_BOT_TOKEN")}`,
      },
    }
  );
  const roles: GuildRolesResponse = await guildRoles.json();

  const matchingRole = roles.find(
    (role) => role.name.toLowerCase() === requiredRole.toLowerCase()
  );
  if (!matchingRole) {
    throw new Error(
      `The server does not have the "${requiredRole}" role configured.`
    );
  }

  const guildMember = await fetch(
    `${BaseURL}/users/@me/guilds/${getEnvVariable("DISCORD_GUILD_ID")}/member`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const memberData: GuildMemberResponse = await guildMember.json();

  // Does the user have the required role?
  return memberData.roles.includes(matchingRole.id);
};

const BaseURL = "https://discord.com/api";

interface GuildMemberResponse {
  roles: string[];
}
type GuildRolesResponse = Array<{
  id: string;
  name: string;
}>;

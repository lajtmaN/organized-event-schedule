import type { DiscordProfile } from "remix-auth-socials";
import { EnvironmentVariables } from "./environment.server";

export const getAvatarUrl = (user: DiscordProfile): string => {
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.__json.avatar}.png`;
};

export const hasRole = async (
  user: DiscordProfile,
  accessToken: string,
  requiredRole: string
) => {
  const guildRoles = await fetch(
    `${BaseURL}/guilds/${EnvironmentVariables.Discord.GuildID}/roles`,
    {
      headers: {
        Authorization: `Bot ${EnvironmentVariables.Discord.BotToken}`,
      },
    }
  );
  const roles: GuildRolesResponse = await guildRoles.json();

  const matchingRole = roles.find(
    (role) => role.name.toLowerCase() === requiredRole.toLowerCase()
  );
  if (!matchingRole) {
    throw new Error(
      `The server does not have the "${requiredRole}" role setup.`
    );
  }

  const guildMember = await fetch(
    `${BaseURL}/users/@me/guilds/${EnvironmentVariables.Discord.GuildID}/member`,
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

const BaseURL = "https://discord.com/api/v10";

interface GuildMemberResponse {
  roles: string[];
}
type GuildRolesResponse = Array<{
  id: string;
  name: string;
}>;

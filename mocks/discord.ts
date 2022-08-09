import type {
  DefaultRequestMultipartBody,
  MockedRequest,
  RestHandler,
} from "msw";
import { rest } from "msw";
import { getEnvVariable } from "~/server/environment.server";
import { requiredHeader, requiredParam } from "./utils";

const discordHandlers: Array<
  RestHandler<MockedRequest<DefaultRequestMultipartBody>>
> = [
  rest.post("https://discord.com/api/oauth2/token", async (req, res, ctx) => {
    if (typeof req.body !== "string") {
      throw new Error("request body must be a string of URLSearchParams");
    }
    if (
      req.headers.get("Content-Type") !== "application/x-www-form-urlencoded"
    ) {
      throw new Error(
        'Content-Type header must be "application/x-www-form-urlencoded"'
      );
    }
    const params = new URLSearchParams(req.body);
    requiredParam(params, "client_id");
    requiredParam(params, "client_secret");
    requiredParam(params, "grant_type");
    requiredParam(params, "redirect_uri");

    return res(
      ctx.json({
        token_type: "Bearer test_token_type",
        access_token: "Bearer test_access_token",
        scope: "identify",
      })
    );
  }),

  rest.get("https://discord.com/api/users/:userId", async (req, res, ctx) => {
    requiredHeader(req.headers, "Authorization");
    return res(
      ctx.json({
        id: "test_discord_id",
        username: "test_discord_username",
        discriminator: "0000",
      })
    );
  }),

  rest.post(
    "https://discord.com/api/channels/:channelId/messages",
    async (req, res, ctx) => {
      requiredHeader(req.headers, "Authorization");
      if (typeof req.body !== "object") {
        console.error("Request body:", req.body);
        throw new Error("Request body must be a JSON object");
      }

      console.log(
        `🤖 Sending bot message to ${req.params.channelId}:\n`,
        req.body?.content
      );

      return res(
        ctx.json({
          /* we ignore the response */
        })
      );
    }
  ),

  rest.get(
    "https://discord.com/api/users/@me/guilds/:guildId/member",
    async (req, res, ctx) => {
      requiredHeader(req.headers, "Authorization");
      return res(
        ctx.json({
          roles: ["required_test_role"],
        })
      );
    }
  ),

  rest.get(
    "https://discord.com/api/guilds/:guildId/roles",
    async (req, res, ctx) => {
      requiredHeader(req.headers, "Authorization");
      const role = getEnvVariable("DISCORD_REQUIRED_ROLE_TO_AUTH");
      return res(
        ctx.json([
          {
            name: role,
            id: "required_test_role",
          },
        ])
      );
    }
  ),
];

export { discordHandlers };

import { getAvatarUrl } from "./discord-api.server";

test("getAvatarUrl should join id and avatarId and return url", () => {
  expect(getAvatarUrl({ id: "123", __json: { avatar: "456" } as any })).toBe(
    "https://cdn.discordapp.com/avatars/123/456.png"
  );
});

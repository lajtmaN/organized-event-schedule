const { setupServer } = require("msw/node");

const server = setupServer();

server.listen({ onUnhandledRequest: "bypass" });
console.info("🔶 Mock server running");

process.once("SIGINT", () => server.close());
process.once("SIGTERM", () => server.close());

// Consider mocking discord? https://github.com/kentcdodds/kentcdodds.com/blob/main/mocks/discord.ts

import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { authController } from "./modules/auth/auth.controller";
import { isAuthenticated } from "./modules/auth/isAuthenticated.middleware";
import { migrateDatabase } from "./lib/database";
import { swagger } from "@elysiajs/swagger";
import { websocketServer } from "./modules/ws/ws";
import { logger } from "@bogeychan/elysia-logger";
import { server } from "./server";
import { chatGroupController } from "./modules/chat-group/chat-group.controller";

await migrateDatabase();

export const app = new Elysia()
  .use(cors())
  .use(swagger())
  .use(
    logger({
      level: "debug",
    })
  )
  .group("/auth", (app) => app.use(authController))
  .use(chatGroupController)
  .use(websocketServer)
  .get(
    "/get-token",
    async ({ jwt }) => await jwt.sign({ id: "fake-id", username: "John Doe" })
  )
  .use(isAuthenticated)
  .get("/", ({ user }) => `sup ${user?.username}`)
  .listen(3000, (s) => {
    server.instance = s;
  });

console.log(
  `> Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

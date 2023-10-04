import Elysia from "elysia";
import { isAuthenticated } from "../auth/isAuthenticated.middleware";
import { server } from "../../server";
import { addClient, getClient, removeClient } from "./ws-sessions-map";
import { subscribeUserToChatGroups } from "../../lib/methods";

export const websocketServer = new Elysia({ prefix: "/ws" })
  .use(isAuthenticated)
  .ws("/", {
    open(ws) {
      //@ts-ignore, object user exists in ws.data but ts complains because of type inheritance/inference bug in elysiaJs
      addClient(ws.data.user.id, ws);

      //@ts-ignore find all chat groups that the user is participating in and subscribe them to those chat groups
      subscribeUserToChatGroups(ws.data.user.id, ws);
    },
    // message(ws, message) {
    // },
    close(ws) {
      //@ts-ignore, object user exists in ws.data but ts complains because of type inheritance/inference bug in elysiaJs
      removeClient(ws.data.user.id);
    },
  });

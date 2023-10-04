import Elysia from "elysia";
import { isAuthenticated } from "../auth/isAuthenticated.middleware";
import { server } from "../../server";
import { addClient, getClient, removeClient } from "./ws-clients-ma";

export const websocketServer = new Elysia({ prefix: "/ws" })
  .use(isAuthenticated)
  .ws("/", {
    open(ws) {
      const msg = `someone has entered the chat`;
      ws.subscribe("the-group-chat");
      //@ts-ignore, object user exists in ws.data but ts complains because of type inheritance/inference bug in elysiaJs
      addClient(ws.data.user.id, ws);
      server.instance?.publish("the-group-chat", msg);
    },
    message(ws, message) {
      // the server re-broadcasts incoming messages to everyone
      setTimeout(() => {
        server.instance?.publish("the-group-chat", `someone: ${message}`);
      }, 1000);
      setTimeout(() => {
        //@ts-ignore
        getClient(ws.data.user.id)?.send("ayo sup");
      }, 1000);
    },
    close(ws) {
      const msg = `someone has left the chat`;
      ws.publish("the-group-chat", msg);
      ws.unsubscribe("the-group-chat");
      //@ts-ignore, object user exists in ws.data but ts complains because of type inheritance/inference bug in elysiaJs
      removeClient(ws.data.user.id);
    },
  });

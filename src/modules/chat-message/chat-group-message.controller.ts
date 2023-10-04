import Elysia, { t } from "elysia";
import { isAuthenticated } from "../auth/isAuthenticated.middleware";
import {
  createChatGroupMessageAndPublish,
  getChatGroupsWithParticipants,
} from "./chat-group-message.service";
import { chatGroupMessageCreationSchema } from "./types";

export const chatGroupMessageController = new Elysia({
  prefix: "chat-group-message",
})
  .use(isAuthenticated)
  .post(
    "/",
    async ({ body, set, user }) => {
      set.status = "Created";
      return await createChatGroupMessageAndPublish(user?.id as string, body);
    },
    {
      body: chatGroupMessageCreationSchema,
    }
  );

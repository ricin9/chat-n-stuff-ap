import Elysia, { t } from "elysia";
import { setup } from "../../setup";
import { userInsertSchema, userSelectSchema } from "../user/user.model";
import { restErrorType } from "../../types/error";
import { isAuthenticated } from "../auth/isAuthenticated.middleware";
import {
  createChatGroup,
  getChatGroupsWithParticipants,
} from "./chat-group.service";
import { chatGroupCreationSchema } from "./types";
import { chatGroupSelectTSchema } from "./chat-group.model";

export const chatGroupController = new Elysia({ prefix: "chat-group" })
  .use(isAuthenticated)
  .post(
    "/",
    async ({ body, set, user }) => {
      const createdChatGroup = await createChatGroup(user?.id as string, body);
      set.status = "Created";
      return createdChatGroup;
    },
    {
      body: chatGroupCreationSchema,
      response: {
        201: chatGroupSelectTSchema,
      },
    }
  )
  .get("/", async ({ user }) => {
    return await getChatGroupsWithParticipants(user?.id as string);
  });

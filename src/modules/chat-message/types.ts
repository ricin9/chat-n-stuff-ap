import { Static } from "@sinclair/typebox";
import { t } from "elysia";

export const chatGroupMessageCreationSchema = t.Object({
  body: t.String(),
  chatGroupId: t.String(),
});

export type ChatGroupMessageCreationSchema = Static<
  typeof chatGroupMessageCreationSchema
>;

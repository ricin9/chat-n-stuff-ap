import { Static } from "@sinclair/typebox";
import { t } from "elysia";

export const chatGroupCreationSchema = t.Object({
  name: t.String(),
  participants: t.Optional(t.Array(t.String())),
});

export type ChatGroupCreationSchema = Static<typeof chatGroupCreationSchema>;

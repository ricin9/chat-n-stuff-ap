import { t } from "elysia";
import { user, userInsertSchema, userSelectSchema } from "../user/user.model";
import { Static } from "@sinclair/typebox";
import { db } from "../../lib/database";
import { eq, getTableColumns } from "drizzle-orm";
import {
  chatGroup,
  chatGroupInsertSchema,
  chatGroupParticipants,
  chatGroupSelectSchema,
} from "./chat-group.model";

export async function createChatGroup(
  userCreatorId: string,
  body: chatGroupInsertSchema
): Promise<chatGroupSelectSchema> {
  let createdChatGroup = await db.transaction(async (tx) => {
    const [createdChatGroup] = await tx
      .insert(chatGroup)
      .values(body)
      .returning();

    await db.insert(chatGroupParticipants).values({
      chatGroupId: createdChatGroup.id,
      userId: userCreatorId,
    });
    return createdChatGroup;
  });

  return createdChatGroup;
}

export async function getChatGroupsForParticipant(
  userParticipantId: string
): Promise<chatGroupSelectSchema[]> {
  let chatGroups = await db
    .select({ ...getTableColumns(chatGroup) })
    .from(chatGroupParticipants)
    .innerJoin(chatGroup, eq(chatGroup.id, chatGroupParticipants.chatGroupId))
    .where(eq(chatGroupParticipants.userId, userParticipantId));
  return chatGroups;
}

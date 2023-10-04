import { db } from "../../lib/database";
import { and, eq, getTableColumns, sql } from "drizzle-orm";
import {
  chatGroup,
  chatGroupParticipants,
  chatGroupSelectSchema,
} from "./chat-group.model";
import { ChatGroupCreationSchema } from "./types";
import { alias } from "drizzle-orm/pg-core";
import { user } from "../user/user.model";

export async function createChatGroup(
  userCreatorId: string,
  body: ChatGroupCreationSchema
): Promise<chatGroupSelectSchema> {
  let createdChatGroup = await db.transaction(async (tx) => {
    const [createdChatGroup] = await tx
      .insert(chatGroup)
      .values({ name: body.name })
      .returning();

    const participants = [
      { chatGroupId: createdChatGroup.id, userId: userCreatorId },
    ];

    for (const participant of body.participants || []) {
      participants.push({
        chatGroupId: createdChatGroup.id,
        userId: participant,
      });
    }

    console.log(participants);

    await tx.insert(chatGroupParticipants).values(participants);
    return createdChatGroup;
  });

  return createdChatGroup;
}

export async function getChatGroupsWithParticipants(currentUserId: string) {
  const currentUserParticipant = alias(
    chatGroupParticipants,
    "current_user_participant"
  );
  return await db
    .select({
      ...getTableColumns(chatGroup),
      participants: sql`array_agg(JSON_OBJECT('id':${user.id}, 'username':${user.username}))`,
    })
    // get chatrooms that current user is participating in
    .from(currentUserParticipant)
    .innerJoin(chatGroup, eq(chatGroup.id, currentUserParticipant.chatGroupId))

    //get list of all other for select participants
    .innerJoin(
      chatGroupParticipants,
      eq(chatGroup.id, chatGroupParticipants.chatGroupId)
    )
    .innerJoin(user, eq(user.id, chatGroupParticipants.userId))
    .where(eq(currentUserParticipant.userId, currentUserId))
    .groupBy(chatGroup.id);
}

import { db } from "../../lib/database";
import { and, eq, getTableColumns, sql } from "drizzle-orm";
import { ChatGroupMessageCreationSchema } from "./types";
import { alias } from "drizzle-orm/pg-core";
import { user } from "../user/user.model";
import { chatGroupMessage } from "./chat-group-message.model";
import { server } from "../../server";

export async function createChatGroupMessageAndPublish(
  usreId: string,
  body: ChatGroupMessageCreationSchema
) {
  const [createdMessage] = await db
    .insert(chatGroupMessage)
    .values({
      ...body,
      userId: usreId,
    })
    .returning();

  const [createdMessageWithUsername] = await db
    .select({
      id: chatGroupMessage.id,
      body: chatGroupMessage.body,
      createdAt: chatGroupMessage.createdAt,
      username: user.username,
    })
    .from(chatGroupMessage)
    .innerJoin(user, eq(user.id, chatGroupMessage.userId))
    .where(eq(chatGroupMessage.id, createdMessage.id));

  server.instance?.publish(
    createdMessage.chatGroupId,
    JSON.stringify(createdMessageWithUsername)
  );

  return createdMessage;
}

export async function getChatGroupsWithParticipants(currentUserId: string) {}

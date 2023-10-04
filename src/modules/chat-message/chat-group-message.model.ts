import {
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "../../util/nanoid";
import { user } from "../user/user.model";
import { chatGroup } from "../chat-group/chat-group.model";

export const chatGroupMessage = pgTable(
  "chat_group_message",
  {
    id: text("id")
      .$defaultFn(() => nanoid())
      .notNull(),
    body: varchar("body", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    userId: text("user_id")
      .references(() => user.id)
      .notNull(),
    chatGroupId: text("chat_group_id")
      .notNull()
      .references(() => chatGroup.id, { onDelete: "cascade" }),
  },
  (table) => ({
    createdAtIndex: index("created_at_index").on(table.createdAt),
    pk: primaryKey(table.id, table.chatGroupId),
  })
);

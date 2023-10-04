import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "../../util/nanoid";
import { user } from "../user/user.model";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";

export const chatGroup = pgTable("chat_group", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type chatGroupInsertSchema = typeof chatGroup.$inferInsert;
export type chatGroupSelectSchema = typeof chatGroup.$inferSelect;
export const chatGroupInsertTSchema = createInsertSchema(chatGroup);
export const chatGroupSelectTSchema = createSelectSchema(chatGroup);

// relation table for m:n
export const chatGroupParticipants = pgTable(
  "chat_group_participants",
  {
    chatGroupId: text("chat_group_id")
      .notNull()
      .references(() => chatGroup.id),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey(table.chatGroupId, table.userId),
    };
  }
);

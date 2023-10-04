import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { nanoid } from "../../util/nanoid";

export const user = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => nanoid()),
    username: varchar("username", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
});

const userInsertSchemaWithId = createInsertSchema(user);
export const userInsertSchema = t.Omit(userInsertSchemaWithId, ["id"]);

export const userSelectSchemaWithPassword = createSelectSchema(user);
export const userSelectSchema = t.Omit(userSelectSchemaWithPassword, [
    "password",
]);

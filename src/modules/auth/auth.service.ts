import { t } from "elysia";
import { user, userInsertSchema, userSelectSchema } from "../user/user.model";
import { Static } from "@sinclair/typebox";
import { db } from "../../lib/database";
import { eq, getTableColumns } from "drizzle-orm";

export async function createUser(
    body: Static<typeof userInsertSchema>
): Promise<Static<typeof userSelectSchema>> {
    // exclude password
    const { password, ...rest } = getTableColumns(user);

    const [createdUser] = await db
        .insert(user)
        .values({
            username: body.username,
            password: await Bun.password.hash(body.password),
        })
        .returning({
            ...rest,
        });

    return createdUser;
}

export async function getUserAndVerifyPassword(
    body: Static<typeof userInsertSchema>
) {
    const [userData] = await db
        .select()
        .from(user)
        .where(eq(user.username, body.username))
        .limit(1);

    const validLogin = await Bun.password.verify(
        body.password,
        userData?.password ?? ""
    );

    if (!validLogin) {
        throw new Error("Invalid login");
    }

    return {
        id: userData.id,
        username: userData.username,
    };
}

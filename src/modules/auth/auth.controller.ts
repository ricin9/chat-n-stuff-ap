import Elysia, { t } from "elysia";
import { setup } from "../../setup";
import { createUser, getUserAndVerifyPassword } from "./auth.service";
import { userInsertSchema, userSelectSchema } from "../user/user.model";
import { restErrorType } from "../../types/error";

export const authController = new Elysia()
    .use(setup)
    .post(
        "/sign-up",
        async ({ body, set }) => {
            try {
                const user = await createUser(body);
                set.status = "Created";
                return user;
            } catch (err) {
                set.status = "Conflict";
                return {
                    status: 409,
                    code: "Conflict",
                    message: "username already exists",
                };
            }
        },
        {
            body: userInsertSchema,
            response: {
                201: userSelectSchema,
                409: restErrorType,
            },
        }
    )
    .post(
        "/sign-in",
        async ({ body, jwt, set }) => {
            try {
                const user = await getUserAndVerifyPassword(body);
                set.status = "OK";
                return {
                    token: await jwt.sign(user),
                };
            } catch (err) {
                set.status = "Unauthorized";
                return {
                    status: 401,
                    code: "Unauthorized",
                    message: "Invalid login",
                };
            }
        },
        {
            body: userInsertSchema,
            response: {
                200: t.Object({
                    token: t.String(),
                }),
                401: restErrorType,
            },
        }
    );

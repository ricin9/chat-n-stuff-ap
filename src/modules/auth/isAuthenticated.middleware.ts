import Elysia from "elysia";
import { setup } from "../../setup";

export const isAuthenticated = (app: Elysia) =>
    app
        .use(setup)
        .derive(async ({ jwt, bearer }) => {
            if (!bearer)
                return {
                    error: "Authentication failed, You must set a bearer token",
                };
            const user = await jwt.verify(bearer);
            if (!user) return { error: "Authentication failed, invalid token" };

            return { user };
        })
        .guard({
            beforeHandle: [
                ({ set, user, error }) => {
                    if (error) {
                        set.status = "Unauthorized";
                        return {
                            message: error,
                        };
                    }
                },
            ],
        });

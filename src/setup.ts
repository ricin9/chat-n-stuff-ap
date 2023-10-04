import bearer from "@elysiajs/bearer";
import { jwt } from "@elysiajs/jwt";
import Elysia, { t } from "elysia";

export const setup = new Elysia({ name: "setup" }).use(bearer()).use(
    jwt({
        name: "jwt",
        secret: "Fischl von Luftschloss Narfidort",
        exp: "1d",
        schema: t.Object({
            id: t.String(),
            username: t.String(),
        }),
    })
);

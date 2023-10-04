import type { Config } from "drizzle-kit";
import { DEFAULT_DATABASE_URL } from "./src/constants";

export default {
    schema: "./src/**/*.model.ts",
    out: "./drizzle",
    driver: "pg",
    dbCredentials: {
        connectionString:
            (process.env.DATABASE_URL as string) || DEFAULT_DATABASE_URL,
    },
} satisfies Config;

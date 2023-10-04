import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { DEFAULT_DATABASE_URL } from "../constants";

const client = postgres(
    (Bun.env.DATABASE_URL as string) || DEFAULT_DATABASE_URL
);
export const db = drizzle(client);

export const migrateDatabase = async () => {
    await migrate(db, { migrationsFolder: "drizzle" });
};

import { describe, expect, it } from "bun:test";
import { Elysia } from "elysia";
import { app } from "../src";

describe("Elysia", () => {
    it("return a response", async () => {
        const response = await app.handle(
            new Request("http://localhost:3000/auth/sign-up", {
                method: "POST",
                body: JSON.stringify({
                    username: "username1971",
                    password: "AbcD1487",
                }),
            })
        );

        const json = await response.json();
        expect(response.status).toBe(200);
        expect(json.username).toBe("usernale1970");
        expect(json.password).toBeUndefined();
        expect(json.id).toBeString();
    });

    it("return a response", async () => {
        const response = await app.handle(
            new Request("http://localhost:3000/auth/sign-up", {
                method: "POST",
            })
        );

        expect(response.status).toBe(400);
    });
});

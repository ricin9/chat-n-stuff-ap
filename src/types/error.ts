import { t } from "elysia";
import { ERROR_CODE } from "elysia/dist/error";

export const restErrorType = t.Object({
    code: t.String(),
    status: t.Number(),
    message: t.Optional(t.String()),
});

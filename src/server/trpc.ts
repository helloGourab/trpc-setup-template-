// src/server/trpc.ts ~annotator~
import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";
import { Context } from "./context";

const SECRET_TOKEN = "mysecrettoken123"; // hardcoded for now

const t = initTRPC.context<Context>().meta<OpenApiMeta>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.token || ctx.token !== SECRET_TOKEN) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or missing token",
    });
  }
  return next({ ctx });
});

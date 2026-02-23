// src/server/index.ts ~annotator~
import { z } from "zod";
import { db } from "../db";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  userList: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/users",
        tags: ["Users"],
        description: "Get all users",
      },
    })
    .input(z.void())
    .output(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          email: z.string().email(),
        }),
      ),
    )
    .query(() => {
      return db.user.findMany();
    }),

  userById: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/users/{id}",
        tags: ["Users"],
        description: "Get user by id",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(
      z
        .object({
          id: z.string(),
          name: z.string(),
          email: z.string().email(),
        })
        .nullable(),
    )
    .query(({ input }) => {
      return db.user.findById(input.id) ?? null;
    }),

  userCreate: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/users",
        tags: ["Users"],
        description: "Create a new user",
      },
    })
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
      }),
    )
    .output(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(({ input }) => {
      return db.user.create(input);
    }),
});

export type AppRouter = typeof appRouter;

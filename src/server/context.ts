import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export const createContext = ({ req }: CreateExpressContextOptions) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
  return { token };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

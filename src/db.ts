// src/db.ts ~annotator~
import { z } from "zod";

export const userModel = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof userModel>;

// fake in-memory "database"
export const db = {
  user: {
    data: [
      { id: "1", name: "John Doe", email: "john@example.com" },
      { id: "2", name: "Jane Smith", email: "jane@example.com" },
    ] as User[],

    findMany(): User[] {
      return db.user.data;
    },

    findById(id: string): User | undefined {
      return db.user.data.find((u) => u.id === id);
    },

    create(input: Omit<User, "id">): User {
      const newUser: User = { id: String(db.user.data.length + 1), ...input };
      db.user.data.push(newUser);
      return newUser;
    },
  },
};

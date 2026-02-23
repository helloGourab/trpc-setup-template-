// src/client/test-client.ts ~annotator~
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../server/index.js";

const client = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "http://localhost:8000" })],
});

async function main() {
  // get all users
  const users = await client.userList.query();
  console.log("All users:", users);

  // get user by id
  const user = await client.userById.query({ id: "1" });
  console.log("User by id:", user);

  // create a user
  const newUser = await client.userCreate.mutate({
    name: "Bob",
    email: "bob@example.com",
  });
  console.log("Created user:", newUser);
}

main();

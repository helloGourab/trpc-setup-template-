// src/index.ts ~annotator~
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import {
  generateOpenApiDocument,
  createOpenApiExpressMiddleware,
} from "trpc-to-openapi";
import fs from "fs/promises";
import swaggerUi from "swagger-ui-express";
import { createContext } from "./server/context";
import { appRouter } from "./server/index";

const app = express();
app.use(express.json());

// generate the openapi spec from your router
const openapiDocument = generateOpenApiDocument(appRouter, {
  baseUrl: "http://localhost:8000/api",
  title: "My User API",
  version: "1.0.0",
  securitySchemes: {
    Authorization: {
      type: "http",
      scheme: "bearer",
    },
  },
});

// write it to a file so you can see it
fs.writeFile(
  "./openapi-specification.json",
  JSON.stringify(openapiDocument, null, 2),
);

// basic health check
app.get("/", (req, res) => {
  res.json({ status: "server is up" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

// serve the raw openapi json
app.get("/openapi.json", (req, res) => {
  res.json(openapiDocument);
});

// REST endpoints — normal HTTP, anyone can hit this
app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

// tRPC native protocol — for type-safe TS clients
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.listen(8000, () => console.log("Server running on http://localhost:8000"));

import fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import swaggerPlugin from "./plugins/swagger";
import routesPlugin from "./plugins/routes";

import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

export const app = fastify({
  logger: true,
  trustProxy: true,
  ajv: {
    customOptions: {
      allErrors: true,
      strict: false,
    },
    plugins: [require("ajv-errors")],
  },
}).withTypeProvider<TypeBoxTypeProvider>();

app.register(cors, {
  origin: [
    "https://task-managerr.pp.ua",
    "http://localhost:5173",
    "http://localhost:4173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

app.register(swaggerPlugin);

app.register(cookie);
app.register(routesPlugin);

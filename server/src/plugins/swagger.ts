import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

export default fp(async (app) => {
  await app.register(swagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "API docs",
        version: "1.0.0",
      },
      tags: [
        { name: "Auth" },
        { name: "Projects" },
        { name: "Tasks" },
        { name: "Sections" },
      ],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "accessToken",
          },
        },
      },
      security: [{ cookieAuth: [] }],
    },
  });

  await app.register(swaggerUI, {
    routePrefix: "/docs",
  });
});

import { Response, createRouter } from "fets";
import { Slangroom } from "@slangroom/core";
import { wallet } from "@slangroom/wallet";
import { App, HttpRequest, HttpResponse } from "uWebSockets.js";
import pino from "pino";

const L = pino({
  transport: {
    target: "pino-pretty",
  },
});

interface ServerContext {
  req: HttpRequest;
  res: HttpResponse;
}

const router = createRouter<ServerContext>()
  .route({
    method: "GET",
    path: "/greetings",
    schemas: {
      responses: {
        200: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
          },
          required: ["message"],
          additionalProperties: false,
        },
      },
    } as const,
    handler: async () => {
      const s = new Slangroom(wallet);
      const { result } = await s.execute(
        `Rule unknown ignore
      Given I create p-256 key and output into 'issuer_jwk'
      Given I create p-256 key and output into 'holder_jwk'
      Given I send sk 'holder_jwk' and create p-256 public key and output into 'holder_public_jwk'
      Given I send sk 'issuer_jwk' and create p-256 public key and output into 'issuer_public_jwk'
      Given I send jwk 'issuer_jwk' and send holder 'holder_public_jwk' and send object 'object' and send fields 'fields' and create vc sd jwt and output into 'vcsdjwt'
      Given I send token 'vcsdjwt' and pretty print sd jwt and output into 'pretty_jwt'
      Given I have a 'string dictionary' named 'issuer_jwk'
      Given I have a 'string dictionary' named 'holder_jwk'
      Given I have a 'string dictionary' named 'holder_public_jwk'
      Given I have a 'string dictionary' named 'issuer_public_jwk'
      Given I have a 'string' named 'vcsdjwt'
      Given I have a 'string dictionary' named 'pretty_jwt'
      Then print data`,
        {
          keys: {
            object: {
              name: "test person",
              age: 25,
            },
            fields: ["name", "age"],
          },
        }
      );
      return Response.json(result);
    },
  })
  .route({
    method: "GET",
    path: "/:id/raw",
    handler: (request) => {
      return Response.json(request.params);
    },
  });

App()
  .any("/*", router)
  .listen(3000, () => {
    console.log(`Swagger UI is running on http://localhost:3000/docs`);
  });

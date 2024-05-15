import { Ai } from "@cloudflare/workers-types";
import { Hono } from "hono";
import { cors } from "hono/cors";

export interface Env {
  AI: Ai;
}

const app = new Hono();
app.use("/*", cors());

app.post("/", async (c) => {
  const { messages } = await c.req.json();
  console.log({ messages });

  const r = await c.env.AI.run("@hf/nousresearch/hermes-2-pro-mistral-7b", {
    messages,
    response_format: { type: "json_object" },
  });

  if (r.response) {
    return c.json(JSON.parse(r.response));
  } else {
    console.error({ r });
    throw "something went wrong";
  }
});

export default app;

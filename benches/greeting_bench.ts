import { makeGreeting } from "../src/core/greeting.ts";

Deno.bench("makeGreeting", () => {
  makeGreeting({ name: "HAKE", excited: true });
});

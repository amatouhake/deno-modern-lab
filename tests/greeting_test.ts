import { assertEquals } from "./test_helpers.ts";
import { makeGreeting, normalizeName } from "../src/core/greeting.ts";

Deno.test("normalizeName falls back to Deno", () => {
  assertEquals(normalizeName("   "), "Deno");
  assertEquals(normalizeName(null), "Deno");
});

Deno.test("makeGreeting supports a custom name", () => {
  assertEquals(makeGreeting({ name: "HAKE" }), "Hello, HAKE.");
  assertEquals(makeGreeting({ name: "HAKE", excited: true }), "Hello, HAKE!");
});

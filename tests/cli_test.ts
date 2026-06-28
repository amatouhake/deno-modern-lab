import { assertEquals } from "./test_helpers.ts";
import { parseCliArgs, runCli } from "../src/cli.ts";

Deno.test("parseCliArgs accepts --name=value", () => {
  assertEquals(parseCliArgs(["--name=HAKE", "--excited"]).name, "HAKE");
  assertEquals(parseCliArgs(["--name=HAKE", "--excited"]).excited, true);
});

Deno.test("runCli can render JSON", async () => {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const exitCode = await runCli(
    ["--name", "HAKE", "--json"],
    (message) => stdout.push(message),
    (message) => stderr.push(message),
  );

  assertEquals(exitCode, 0);
  assertEquals(stderr, []);
  assertEquals(JSON.parse(stdout.join("\n")).greeting, "Hello, HAKE.");
});

Deno.test("runCli reports unknown arguments", async () => {
  const stderr: string[] = [];
  const exitCode = await runCli(["--wat"], () => undefined, (message) => stderr.push(message));

  assertEquals(exitCode, 1);
  assertEquals(stderr[0], "Unknown argument: --wat");
});

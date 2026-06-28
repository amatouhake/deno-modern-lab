interface OperationResult {
  label: string;
  state: string;
  ok: boolean;
  detail: string;
}

const MOTD_PATH = "./data/motd.txt";
const ENV_NAME = "DENO_LAB_MESSAGE";

async function main(): Promise<void> {
  const results: OperationResult[] = [];

  const readPermission = await Deno.permissions.query({ name: "read", path: MOTD_PATH });
  const envPermission = await Deno.permissions.query({ name: "env", variable: ENV_NAME });

  results.push(
    await runOperation(
      `read ${MOTD_PATH}`,
      readPermission.state,
      async () => await Deno.readTextFile(MOTD_PATH),
    ),
  );

  results.push(
    await runOperation(
      `env ${ENV_NAME}`,
      envPermission.state,
      () => Deno.env.get(ENV_NAME) ?? "<undefined>",
    ),
  );

  console.table(results);
  console.log("\nTry both commands and compare:");
  console.log("  deno run src/permissions_demo.ts");
  console.log("  deno task permissions");
}

async function runOperation(
  label: string,
  state: string,
  operation: () => string | Promise<string>,
): Promise<OperationResult> {
  try {
    const value = await operation();
    return {
      label,
      state,
      ok: true,
      detail: value.trim().slice(0, 80),
    };
  } catch (error) {
    return {
      label,
      state,
      ok: false,
      detail: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
    };
  }
}

if (import.meta.main) {
  await main();
}

export {};

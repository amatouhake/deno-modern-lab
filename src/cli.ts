import { buildRuntimeDiagnostic, makeGreeting } from "./core/greeting.ts";

type Writer = (message: string) => void;

export interface CliOptions {
  name: string;
  excited: boolean;
  json: boolean;
  help: boolean;
  inspectRuntime: boolean;
}

export interface CliResult {
  greeting: string;
  runtime?: ReturnType<typeof buildRuntimeDiagnostic>;
}

const HELP = `Deno Modern Lab CLI

Usage:
  deno task hello [options]
  deno run src/cli.ts [options]

Options:
  --name <name>       Greeting target. Defaults to "Deno".
  --excited           Use an exclamation mark.
  --json              Print structured JSON.
  --inspect-runtime   Include Deno/V8/TypeScript versions in JSON output.
  -h, --help          Show this help.
`;

export function parseCliArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    name: "Deno",
    excited: false,
    json: false,
    help: false,
    inspectRuntime: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg === "--excited") {
      options.excited = true;
      continue;
    }

    if (arg === "--json") {
      options.json = true;
      continue;
    }

    if (arg === "--inspect-runtime") {
      options.inspectRuntime = true;
      continue;
    }

    if (arg === "--name") {
      const value = args[index + 1];
      if (!value) throw new Error("--name requires a value.");
      options.name = value;
      index += 1;
      continue;
    }

    if (arg.startsWith("--name=")) {
      options.name = arg.slice("--name=".length);
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

export function buildCliResult(options: CliOptions): CliResult {
  return {
    greeting: makeGreeting({ name: options.name, excited: options.excited }),
    runtime: options.inspectRuntime ? buildRuntimeDiagnostic() : undefined,
  };
}

export function renderCliResult(result: CliResult, json: boolean): string {
  if (json) {
    return JSON.stringify(result, null, 2);
  }

  const runtime = result.runtime
    ? `\nDeno ${result.runtime.deno} / V8 ${result.runtime.v8} / TypeScript ${result.runtime.typescript}`
    : "";
  return `${result.greeting}${runtime}`;
}

export function runCli(
  args: string[],
  out: Writer = console.log,
  err: Writer = console.error,
): number {
  try {
    const options = parseCliArgs(args);
    if (options.help) {
      out(HELP.trimEnd());
      return 0;
    }

    const result = buildCliResult(options);
    out(renderCliResult(result, options.json));
    return 0;
  } catch (error) {
    err(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

if (import.meta.main) {
  const exitCode = runCli(Deno.args);
  Deno.exit(exitCode);
}

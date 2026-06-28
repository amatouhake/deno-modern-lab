export interface GreetingOptions {
  name?: string | null;
  excited?: boolean;
  at?: Date;
}

export interface RuntimeDiagnostic {
  deno: string;
  v8: string;
  typescript: string;
  os: string;
  arch: string;
}

export function normalizeName(input: string | null | undefined): string {
  const normalized = input?.trim();
  return normalized ? normalized : "Deno";
}

export function makeGreeting(options: GreetingOptions = {}): string {
  const name = normalizeName(options.name);
  const suffix = options.excited ? "!" : ".";
  return `Hello, ${name}${suffix}`;
}

export function buildRuntimeDiagnostic(): RuntimeDiagnostic {
  return {
    deno: Deno.version.deno,
    v8: Deno.version.v8,
    typescript: Deno.version.typescript,
    os: Deno.build.os,
    arch: Deno.build.arch,
  };
}

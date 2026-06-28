const databasePath = Deno.args[0] ?? "./data/lab.kv";
const key = ["lab", "counter"] as const;

await Deno.mkdir("./data", { recursive: true });

const kv = await Deno.openKv(databasePath);
try {
  const current = await kv.get<number>(key);
  const before = current.value ?? 0;
  const after = before + 1;

  const result = await kv.atomic()
    .check(current)
    .set(key, after)
    .commit();

  console.log(`Deno KV database: ${databasePath}`);
  console.log(`counter: ${before} -> ${after}`);
  console.log(`atomic commit: ${result.ok ? "ok" : "conflict"}`);

  const entries: Array<{ key: Deno.KvKey; value: unknown; versionstamp: string }> = [];
  for await (const entry of kv.list({ prefix: ["lab"] })) {
    entries.push({ key: entry.key, value: entry.value, versionstamp: entry.versionstamp });
  }
  console.table(entries);
} finally {
  kv.close();
}

export {};

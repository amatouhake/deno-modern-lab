const targets = [
  "./dist",
  "./coverage",
  "./data/todos.json",
  "./data/lab.kv",
  "./data/lab.kv-shm",
  "./data/lab.kv-wal",
];

for (const target of targets) {
  try {
    await Deno.remove(target, { recursive: true });
    console.log(`removed ${target}`);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      continue;
    }
    throw error;
  }
}

export {};

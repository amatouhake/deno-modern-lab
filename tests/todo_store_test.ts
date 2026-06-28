import { assertEquals } from "./test_helpers.ts";
import { InMemoryTodoStore, JsonTodoStore } from "../src/core/todo_store.ts";

let memoryStore: InMemoryTodoStore;

Deno.test.beforeEach(() => {
  memoryStore = new InMemoryTodoStore();
});

Deno.test("InMemoryTodoStore adds and toggles todos", async () => {
  const todo = await memoryStore.add("Write docs");
  const toggled = await memoryStore.toggle(todo.id);

  assertEquals(toggled?.completed, true);
  assertEquals((await memoryStore.list()).length, 1);
});

Deno.test("JsonTodoStore persists todos", async () => {
  const tempDir = await Deno.makeTempDir({ prefix: "deno-modern-lab-" });
  try {
    const filePath = `${tempDir}/todos.json`;
    const store = new JsonTodoStore(filePath);
    await store.add("Persist me");

    const reloaded = new JsonTodoStore(filePath);
    const todos = await reloaded.list();

    assertEquals(todos.length, 1);
    assertEquals(todos[0].title, "Persist me");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

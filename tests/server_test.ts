import { assertEquals } from "./test_helpers.ts";
import { InMemoryTodoStore } from "../src/core/todo_store.ts";
import { createHandler } from "../src/server.ts";

Deno.test("GET /api/hello returns a greeting", async () => {
  const handler = createHandler({ store: new InMemoryTodoStore() });
  const response = await handler(new Request("http://localhost/api/hello?name=HAKE"));
  const body = await response.json();

  assertEquals(response.status, 200);
  assertEquals(body.greeting, "Hello, HAKE.");
});

Deno.test("POST /api/todos creates a todo", async () => {
  const handler = createHandler({ store: new InMemoryTodoStore() });
  const created = await handler(
    new Request("http://localhost/api/todos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Try Deno" }),
    }),
  );

  assertEquals(created.status, 201);

  const list = await handler(new Request("http://localhost/api/todos"));
  const body = await list.json();

  assertEquals(body.todos.length, 1);
  assertEquals(body.todos[0].title, "Try Deno");
});

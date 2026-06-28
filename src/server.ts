import { buildRuntimeDiagnostic, makeGreeting } from "./core/greeting.ts";
import { JsonTodoStore, type TodoStore } from "./core/todo_store.ts";

export interface HandlerOptions {
  store?: TodoStore;
}

export function createHandler(
  options: HandlerOptions = {},
): (request: Request) => Promise<Response> {
  const store = options.store ?? new JsonTodoStore();

  return async (request: Request): Promise<Response> => {
    try {
      return await route(request, store);
    } catch (error) {
      return jsonResponse({ error: formatError(error) }, { status: 500 });
    }
  };
}

async function route(request: Request, store: TodoStore): Promise<Response> {
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/") {
    return htmlResponse(renderHomePage());
  }

  if (request.method === "GET" && url.pathname === "/api/hello") {
    const name = url.searchParams.get("name") ?? "Deno";
    const excited = url.searchParams.get("excited") === "true";
    return jsonResponse({ greeting: makeGreeting({ name, excited }) });
  }

  if (request.method === "GET" && url.pathname === "/api/runtime") {
    return jsonResponse(buildRuntimeDiagnostic());
  }

  if (request.method === "GET" && url.pathname === "/api/todos") {
    return jsonResponse({ todos: await store.list() });
  }

  if (request.method === "POST" && url.pathname === "/api/todos") {
    const body = await safeJson(request);
    if (!isRecord(body) || typeof body.title !== "string") {
      return jsonResponse({ error: "Expected JSON body: { title: string }" }, { status: 400 });
    }

    const todo = await store.add(body.title);
    return jsonResponse({ todo }, { status: 201 });
  }

  const todoMatch = /^\/api\/todos\/([^/]+)$/.exec(url.pathname);
  if (request.method === "PATCH" && todoMatch) {
    const todo = await store.toggle(decodeURIComponent(todoMatch[1]));
    if (!todo) {
      return jsonResponse({ error: "Todo not found." }, { status: 404 });
    }
    return jsonResponse({ todo });
  }

  return jsonResponse({ error: "Not found." }, { status: 404 });
}

async function safeJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

function jsonResponse(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(`${JSON.stringify(data, null, 2)}\n`, { ...init, headers });
}

function htmlResponse(html: string, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set("content-type", "text/html; charset=utf-8");
  return new Response(html, { ...init, headers });
}

function renderHomePage(): string {
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Deno Modern Lab</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 4rem auto; line-height: 1.7; padding: 0 1rem; }
    code { background: #f5f5f5; padding: 0.1rem 0.3rem; border-radius: 0.25rem; }
  </style>
</head>
<body>
  <h1>Deno Modern Lab</h1>
  <p>Deno.serve で動く最小 API サーバーです。</p>
  <ul>
    <li><a href="/api/hello?name=HAKE">/api/hello?name=HAKE</a></li>
    <li><a href="/api/runtime">/api/runtime</a></li>
    <li><a href="/api/todos">/api/todos</a></li>
  </ul>
  <p>Todo を追加する例:</p>
  <pre><code>curl -X POST http://localhost:8000/api/todos \\
  -H 'content-type: application/json' \\
  -d '{"title":"Try Deno"}'</code></pre>
</body>
</html>`;
}

function readPort(): number {
  const value = Deno.env.get("PORT") ?? "8000";
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT: ${value}`);
  }
  return port;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

if (import.meta.main) {
  const port = readPort();
  console.log(`Listening on http://localhost:${port}/`);
  Deno.serve({ port }, createHandler());
}

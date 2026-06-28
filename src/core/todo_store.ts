export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TodoStore {
  list(): Promise<Todo[]>;
  add(title: string): Promise<Todo>;
  toggle(id: string): Promise<Todo | undefined>;
}

interface TodoDatabase {
  todos: Todo[];
}

export class InMemoryTodoStore implements TodoStore {
  #todos: Todo[] = [];

  list(): Promise<Todo[]> {
    return Promise.resolve(structuredClone(this.#todos));
  }

  add(title: string): Promise<Todo> {
    const todo = createTodo(title);
    this.#todos.push(todo);
    return Promise.resolve(structuredClone(todo));
  }

  toggle(id: string): Promise<Todo | undefined> {
    const index = this.#todos.findIndex((todo) => todo.id === id);
    if (index === -1) return Promise.resolve(undefined);

    const now = new Date().toISOString();
    const updated = {
      ...this.#todos[index],
      completed: !this.#todos[index].completed,
      updatedAt: now,
    };
    this.#todos[index] = updated;
    return Promise.resolve(structuredClone(updated));
  }
}

export class JsonTodoStore implements TodoStore {
  constructor(private readonly filePath = "./data/todos.json") {}

  async list(): Promise<Todo[]> {
    return await this.#readAll();
  }

  async add(title: string): Promise<Todo> {
    const todos = await this.#readAll();
    const todo = createTodo(title);
    todos.push(todo);
    await this.#writeAll(todos);
    return todo;
  }

  async toggle(id: string): Promise<Todo | undefined> {
    const todos = await this.#readAll();
    const index = todos.findIndex((todo) => todo.id === id);
    if (index === -1) return undefined;

    const updated = {
      ...todos[index],
      completed: !todos[index].completed,
      updatedAt: new Date().toISOString(),
    };
    todos[index] = updated;
    await this.#writeAll(todos);
    return updated;
  }

  async #readAll(): Promise<Todo[]> {
    try {
      const raw = await Deno.readTextFile(this.filePath);
      const parsed = JSON.parse(raw) as unknown;
      if (!isTodoDatabase(parsed)) {
        throw new Error(`Invalid todo database shape: ${this.filePath}`);
      }
      return parsed.todos;
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return [];
      }
      throw error;
    }
  }

  async #writeAll(todos: Todo[]): Promise<void> {
    await ensureParentDirectory(this.filePath);
    const database: TodoDatabase = { todos };
    const payload = `${JSON.stringify(database, null, 2)}\n`;
    const temporaryPath = `${this.filePath}.${crypto.randomUUID()}.tmp`;
    await Deno.writeTextFile(temporaryPath, payload);
    await Deno.rename(temporaryPath, this.filePath);
  }
}

function createTodo(title: string): Todo {
  const trimmed = title.trim();
  if (!trimmed) {
    throw new Error("Todo title must not be empty.");
  }

  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: trimmed,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
}

async function ensureParentDirectory(filePath: string): Promise<void> {
  const directory = parentDirectory(filePath);
  if (directory && directory !== ".") {
    await Deno.mkdir(directory, { recursive: true });
  }
}

function parentDirectory(filePath: string): string {
  const normalized = filePath.replaceAll("\\", "/");
  const lastSlash = normalized.lastIndexOf("/");

  if (lastSlash === -1) {
    return ".";
  }

  if (lastSlash === 0) {
    return normalized.startsWith("/") ? "/" : ".";
  }

  return normalized.slice(0, lastSlash);
}

function isTodoDatabase(value: unknown): value is TodoDatabase {
  return isRecord(value) && Array.isArray(value.todos) && value.todos.every(isTodo);
}

function isTodo(value: unknown): value is Todo {
  return isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.completed === "boolean" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

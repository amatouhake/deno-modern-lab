# Sample catalog

## `src/cli.ts`

Deno で TypeScript CLI をそのまま実行するサンプルです。

```bash
deno task hello --name HAKE --json --inspect-runtime
```

見るポイント:

- `Deno.args`
- `import.meta.main`
- `Deno.exit`
- pure function と CLI I/O の分離

## `src/server.ts`

`Deno.serve` で HTTP API を作るサンプルです。

```bash
deno task server
```

見るポイント:

- `Request` / `Response`
- handler の単体テスト
- JSON file store への read/write permission
- `PORT` env permission

## `src/permissions_demo.ts`

権限の有無で挙動が変わることを確認するサンプルです。

```bash
deno run src/permissions_demo.ts
deno task permissions
```

見るポイント:

- `Deno.permissions.query`
- `Deno.env.get`
- `Deno.readTextFile`
- named permission set

## `examples/jsr_std/main.ts`

JSR の `@std/path` を nested config 経由で使う optional サンプルです。

```bash
deno task jsr-std
```

見るポイント:

- `jsr:` package import
- root config と optional sample config の分離
- registry 依存のサンプルを通常の `deno task ok` から外す設計

## `examples/npm_node/main.ts`

Deno 2 系の Node / npm 互換を見るための optional サンプルです。

```bash
deno task npm-node 'hello npm and node'
```

見るポイント:

- `node:crypto`
- `node:path`
- `npm:picocolors` を `deno.json` の import map 経由で使う

## `src/kv_demo.ts`

Deno KV をローカルファイルで使うサンプルです。

```bash
deno task kv
```

見るポイント:

- `--unstable-kv`
- `Deno.openKv(path)`
- `kv.atomic().check(...).set(...).commit()`
- `kv.list({ prefix })`

## `src/otel_demo.ts`

OpenTelemetry を有効化して HTTP server を起動するサンプルです。

```bash
deno task otel
```

見るポイント:

- `OTEL_DENO=true`
- `console.log` と HTTP request の自動計装
- Collector を導入する余地

## `src/desktop_app.ts`

Deno Desktop の最小サンプルです。

```bash
deno task desktop
```

見るポイント:

- `deno desktop`
- `Deno.serve()` で UI を返すだけの構成
- WSL2 / GUI 環境依存

## `examples/browser_client/main.ts`

ブラウザ向け TypeScript を bundle するサンプルです。

```bash
deno task bundle:browser
```

生成後、`examples/browser_client/index.html` を静的サーバー経由で開くか、`deno task serve:static`
を使って確認します。

## `benches/greeting_bench.ts`

Deno.bench の最小サンプルです。

```bash
deno task bench
```

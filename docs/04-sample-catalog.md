# Sample catalog

## `src/cli.ts`

Deno で TypeScript CLI をそのまま実行するサンプルです。

```bash
deno task hello --name HAKE --json --inspect-runtime
```

見るポイント:

- `Deno.args` — `process.argv` に相当するコマンドライン引数の配列
- `import.meta.main` — Python の `if __name__ == "__main__":` に相当。このファイルが直接実行
  されたときだけ `true` になります。他のファイルから import された場合は `false` のため、
  同じファイルをライブラリとしても CLI としても使い分けられます。
- `Deno.exit` — プロセスを終了する（`process.exit` 相当）
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

- `jsr:` package import — `jsr:@std/path` のように specifier の先頭に `jsr:` を付けて JSR から
  パッケージを取得します。npm の `npm install` に相当する手順は不要で、import するだけで自動取得
  されます。
- `deno.lock` — このフォルダ内の lockfile です。`package-lock.json` と同様に、依存の正確な
  バージョンを記録して再現性を保証します。
- root config と optional sample config の分離 — `--config examples/jsr_std/deno.json` で root の
  `deno.json` とは別の設定を使い、外部 registry への通信を `deno task ok` から切り離しています。
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

- `--unstable-kv` — Deno は API が正式安定化される前に `--unstable-<機能名>` フラグで opt-in
  する段階を設けています。KV はまだこの段階です。フラグなしで実行するとエラーになります。
- `Deno.openKv(path)` — ローカルファイルをバックエンドにした key-value store を開きます
- `kv.atomic().check(...).set(...).commit()` — 楽観的ロックによるアトミック操作
- `kv.list({ prefix })` — prefix でキーを範囲走査

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

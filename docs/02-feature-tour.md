# Feature tour

この lab は、Deno を初期に触った人が「いま何ができるのか」を一気に見渡すための構成です。

## TypeScript をそのまま実行

```bash
deno task hello --name HAKE
```

`src/cli.ts` は TypeScript ですが、ビルドステップなしで実行できます。

## built-in toolchain

```bash
deno fmt
deno lint
deno test
deno bench
deno check
```

formatter、linter、test runner、benchmark、type check を Deno 本体で扱います。

## `deno.json`

このリポジトリでは `deno.json` を中心にしています。

- `imports`: root ではローカル alias、optional sample では JSR / npm import map
- `tasks`: よく使うコマンド
- `permissions`: named permission set
- `test.permissions`: テスト用権限
- `fmt` / `lint`: ツール設定
- `compile.include`: バイナリ化時に含めるファイル

## Deno.serve

`src/server.ts` は framework なしの `Deno.serve` サンプルです。handler を `createHandler()`
として切り出しているため、実際にポートを開かずに `Request` を渡してテストできます。

```ts
const response = await handler(new Request("http://localhost/api/hello?name=HAKE"));
```

## permission set

```bash
deno task permissions
```

`Deno.permissions.query()`、`Deno.readTextFile()`、`Deno.env.get()`
の挙動を見ます。権限なしで直接実行した場合との違いも確認できます。

```bash
deno run src/permissions_demo.ts
deno task permissions
```

## JSR と npm

```bash
deno task jsr-std
deno task npm-node
```

root の品質チェックは外部 registry に依存しない構成にし、JSR / npm は optional sample
に分離しています。

- `examples/jsr_std/main.ts`: `jsr:@std/path` を nested config 経由で使う
- `examples/npm_node/main.ts`: `node:crypto`、`node:path`、`npm:picocolors` を同じファイルで使う

Deno 2 系の package 解決と Node / npm 互換を軽く確認するための入口です。

## Deno KV

```bash
deno task kv
```

`Deno.openKv()` でローカル key-value store を使います。まだ unstable のため `--unstable-kv`
を明示しています。

## OpenTelemetry

```bash
deno task otel
```

`OTEL_DENO=true` で built-in OpenTelemetry を有効化した HTTP サーバーを起動します。Collector
を立てていない場合でも、どのように起動するかを確認できます。

## Deno Desktop

```bash
deno task desktop
```

Deno 2.9 の experimental な desktop サンプルです。WSL2 では GUI / webview
の環境差があるため、動かない場合は `docs/06-roadmap.md`
の「Desktop」を見て次の調査に進んでください。

## bundle / compile

```bash
deno task bundle:browser
deno task compile:server
```

browser bundle は `dist/browser-client.js` を作ります。compile は server
を実行可能バイナリにします。

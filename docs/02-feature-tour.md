# Feature tour

この lab は、Deno を初期に触った人が「いま何ができるのか」を一気に見渡すための構成です。

## TypeScript をそのまま実行

```bash
deno task hello --name HAKE
```

`src/cli.ts` は TypeScript ですが、`tsc` などのビルドステップなしで実行できます。Node.js では
TypeScript を直接実行するには `ts-node` や `tsx` が必要でしたが、Deno は標準でそれが不要です。

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

`deno.json` は Node.js の `package.json` に近い役割を持つ設定ファイルです。このリポジトリでは
`deno.json` を中心にしています。

- `imports`: import map。`"@/": "./"` のようにパスの alias を定義します。
- `tasks`: `deno task <名前>` で呼ぶコマンド（`npm run` 相当）。
- `permissions`: **named permission set**。`-P=server` で参照できる権限の定義です。
- `test.permissions`: `deno test -P` 実行時に使われるテスト専用の権限。
- `fmt` / `lint`: formatter・linter の設定。
- `compile.include`: `deno compile` でバイナリに含める静的ファイルの指定。

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

**JSR**（JavaScript Registry、`jsr.io`）は Deno が主導するパッケージレジストリです。TypeScript
ネイティブで型定義が常に付いており、npm とは別物です。

Deno でのパッケージ指定は URL に近い specifier 形式を使います。

```ts
import { join } from "jsr:@std/path"; // JSR から取得
import picocolors from "npm:picocolors"; // npm から取得
import { createHash } from "node:crypto"; // Node.js 組み込み API
```

`jsr:` / `npm:` / `node:` の prefix を見るだけでどこから来たパッケージかが分かります。

```bash
deno task jsr-std
deno task npm-node
```

root の品質チェックは外部 registry に依存しない構成にし、JSR / npm は optional sample
に分離しています。

- `examples/jsr_std/main.ts`: `jsr:@std/path` を nested config 経由で使う
- `examples/npm_node/main.ts`: `node:crypto`、`node:path`、`npm:picocolors` を同じファイルで使う

### なぜ `examples/` を分けているか（nested config）

`deno task jsr-std` は内部で `--config examples/jsr_std/deno.json` を指定しています。root の
`deno.json` から切り離すことで、通常の `deno task ok` が外部 registry への通信を必要としない構成を
保っています。各 `examples/` フォルダは独自の `deno.json` と `deno.lock`（依存バージョンを固定する
lockfile）を持ちます。

## Deno KV

```bash
deno task kv
```

`Deno.openKv()` でローカル key-value store を使います。Deno では API が安定化する前に
`--unstable-<機能名>` フラグで明示的に有効化する段階があります。KV はまだその段階にあるため
`--unstable-kv` を付けています。安定化された API は通常フラグなしで使えます。

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

browser bundle は `dist/browser-client.js` を作ります。`deno compile` は Deno ランタイムごと
単一の実行可能バイナリを生成します。生成されたバイナリは Deno が未インストールの環境でも動き、 Go や
Rust のシングルバイナリ配布に近い感覚です。

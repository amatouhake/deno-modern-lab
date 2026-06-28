# Deno Modern Lab

Deno を初期に少し触った人が、Deno 2
系の現在地を短時間で再把握するための実験用リポジトリです。CLI、HTTP サーバー、permission set、JSR /
npm の optional サンプル、Node 互換 API、Deno KV、OpenTelemetry、Deno Desktop、browser
bundle、テスト、ベンチ、compile を小さく分けて試せるようにしています。

このリポジトリは「完成品アプリ」ではなく、Deno
の機能確認・比較・メモのための足場です。コードはあえて小さめにし、各機能の境界が見えるようにしています。

## 想定環境

- Ubuntu 24.04 LTS on WSL2
- Deno 2.9.0 以上
- シェルは bash 想定

確認:

```bash
deno --version
```

## 5 分で触る

`deno task` は `npm run` に相当します。`deno.json` の `tasks` フィールドに書いたコマンドを
`deno task <名前>` で呼び出せます。

```bash
# root の品質チェック。外部 package 取得に依存しないようにしています。
deno task ok

# CLI サンプル。Deno は TypeScript をそのまま実行します。
deno task hello --name HAKE --excited

deno task hello --name HAKE --json
```

HTTP サーバー:

```bash
deno task server
```

別ターミナルから:

```bash
curl 'http://localhost:8000/api/hello?name=HAKE'
curl 'http://localhost:8000/api/todos'
curl -X POST 'http://localhost:8000/api/todos' \
  -H 'content-type: application/json' \
  -d '{"title":"Deno permission sets を試す"}'
```

## 主なタスク

| タスク                        | 目的                                                    |
| ----------------------------- | ------------------------------------------------------- |
| `deno task ok`                | fmt check、lint、type check、test をまとめて実行        |
| `deno task hello --name HAKE` | 小さな CLI を実行                                       |
| `deno task server`            | `Deno.serve` ベースの API サーバーを起動                |
| `deno task dev`               | watch 付きで API サーバーを起動                         |
| `deno task watch:server`      | Deno 2.9 の `deno watch` サブコマンドを試す             |
| `deno task permissions`       | scoped permission set と `Deno.permissions` を確認      |
| `deno task npm-node`          | optional: `npm:` 依存と `node:` API 互換を確認          |
| `deno task jsr-std`           | optional: JSR の `@std/path` を確認                     |
| `deno task kv`                | `Deno.openKv()` をローカルファイルで試す                |
| `deno task otel`              | Deno の built-in OpenTelemetry を有効化してサーバー起動 |
| `deno task desktop`           | Deno Desktop の最小サンプルを起動                       |
| `deno task bundle:browser`    | ブラウザ向け TypeScript を bundle                       |
| `deno task compile:server`    | サーバーを単体実行可能バイナリへ compile                |
| `deno task bench`             | built-in benchmark runner を実行                        |
| `deno task deps`              | 宣言済み依存を一覧表示                                  |
| `deno task clean`             | 生成物を削除                                            |

optional の JSR / npm / bundle / compile 系タスクは、初回に registry や Deno runtime component
を取得する場合があります。

## このリポジトリで見たいポイント

### 1. `deno.json` を中心にした開発体験

`deno.json` は Node.js の `package.json` に近い役割を持つ Deno の中心設定ファイルです。import
map（依存先の alias）、tasks（`deno task` で呼ぶコマンド）、formatter、linter、test
permissions、compile include を一か所に集約しています。

### 2. permission set

`deno task server` は `-P=server` を使い、サーバーに必要な権限だけを与えます。`-A`
は便利ですが、学習用でも常用しない方針にしています。

```json
"server": {
  "net": true,
  "read": ["./data", "./public"],
  "write": ["./data"],
  "env": ["PORT", "DENO_ENV"]
}
```

### 3. JSR / Node / npm 互換

**JSR**（JavaScript Registry）は Deno が管理するパッケージレジストリです。TypeScript
ネイティブで、npm とは別に `jsr:@std/path` のような specifier でインポートします。npm パッケージは
`npm:picocolors` のように `npm:` prefix を付けるだけで使えます。

root の `deno task ok` は外部 registry
に依存しないようにしています。一方で、実際に依存解決も試せるように optional sample を `examples/`
に分離しています。

- `deno task jsr-std`: `jsr:@std/path` を nested config 経由で使う
- `deno task npm-node`: `node:crypto`、`node:path`、`npm:picocolors` を使う

Deno 2 系では Node 由来の資産も段階的に取り込めるため、既存 Node
プロジェクトの移行検証にも使えます。

### 4. unstable な機能は明示的に試す

Deno KV は便利ですが、まだ `--unstable-kv` が必要です。`deno task kv` に閉じ込めて、通常の `ok`
では副作用が大きいデータベース操作をしないようにしています。

### 5. WSL2 での Deno Desktop

`deno task desktop` は Deno 2.9 の experimental な Desktop サンプルです。WSL2 では WSLg や webview
関連の環境差が出る場合があります。まずは CLI / server / KV を確認してから触るのがおすすめです。

## ディレクトリ構成

```text
.
├── AGENTS.md                    # エージェント向け運用ルール
├── README.md                    # 人間向け入口
├── deno.json                    # Deno の中心設定
├── docs/                        # 学習メモと設計メモ
├── src/                         # 実行できるサンプル
│   ├── cli.ts
│   ├── server.ts
│   ├── kv_demo.ts
│   ├── otel_demo.ts
│   ├── permissions_demo.ts
│   ├── desktop_app.ts
│   └── core/
├── tests/                       # Deno.test
├── benches/                     # Deno.bench
├── examples/browser_client/     # browser bundle 用サンプル
├── examples/jsr_std/            # optional JSR 依存サンプル
├── examples/npm_node/           # optional npm / node 互換サンプル
├── data/                        # サンプルデータ
└── scripts/                     # 補助スクリプト
```

## 次にやると価値が出ること

`docs/06-roadmap.md` に、Fresh / Hono、Deno Deploy、GitHub Actions、JSR publish、OpenTelemetry
Collector、Deno Desktop 配布形式などの発展案を置いています。まずはこの小さな実験台で Deno
の現在地を確認し、興味が残ったところを深掘りする流れを想定しています。

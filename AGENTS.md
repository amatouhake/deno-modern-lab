# AGENTS.md

このリポジトリで作業するエージェント向けの説明です。人間向けの入口は `README.md`、背景や学習用メモは
`docs/` を参照してください。

## リポジトリの目的

Deno を初期に触った経験がある開発者が、Deno 2 系の現在の開発体験を安全に試すための lab
です。完成されたプロダクションサービスよりも、機能の境界・権限・実行方法が読み取りやすいことを優先します。

## 重要な方針

1. `-A` / `--allow-all` を安易に使わない。
2. 新しい実行タスクを追加する場合は、まず `deno.json` の `permissions` に named permission set
   を追加する。
3. Deno 固有の設定は原則 `deno.json` に集約する。
4. root の必須コードは外部 registry に依存させない。JSR / npm を試す場合は
   `examples/<topic>/deno.json` の nested config に分離する。
5. サンプルは小さく、1 ファイル 1 テーマに近い形を保つ。
6. `docs/` の説明は日本語で書く。

## 変更前に把握するファイル

- `deno.json`: tasks、imports、formatter、linter、permission sets、test permissions
- `src/server.ts`: `Deno.serve` と HTTP API の中心
- `src/core/todo_store.ts`: read/write permission を使う JSON store
- `src/permissions_demo.ts`: permission API のサンプル
- `src/kv_demo.ts`: unstable KV のサンプル
- `docs/03-permissions-and-security.md`: 権限まわりの意図

## 推奨チェック

変更後はできるだけ以下を実行してください。

```bash
deno task ok
```

個別に見る場合:

```bash
deno task fmt:check
deno task lint
deno task check
deno task test
```

KV を触った変更では:

```bash
deno task kv
```

HTTP API を触った変更では:

```bash
deno task server
curl 'http://localhost:8000/api/hello?name=agent'
```

## 権限設計のルール

- `server`: `net`、`./data` read/write、`PORT` / `DENO_ENV` のみを想定。
- `permissions-demo`: `./data/motd.txt` と `DENO_LAB_MESSAGE` のみ。
- `npm-node`: nested config `examples/npm_node/deno.json` で npm package import と色設定用 env
  のみ。
- `jsr-std`: nested config `examples/jsr_std/deno.json` で JSR package import を確認。
- `kv`: `./data` read/write のみ。
- `test`: テスト用 temp dir を扱うため read/write
  を広めに許可。プロダクション用権限とは別物として扱う。

権限を広げる場合は、README または `docs/03-permissions-and-security.md` に理由を書いてください。

## コーディング規約

- TypeScript は strict 前提で書く。
- `unknown` を受けて型ガードする。安易な `any` は避ける。
- HTTP handler は `Request -> Promise<Response>` としてテストしやすく保つ。
- ファイル I/O を使うコードは、可能なら `InMemoryTodoStore`
  のような代替実装を用意してテストを高速化する。
- Deno KV、Desktop など unstable / experimental な機能は通常フローから分離する。

## ドキュメント更新

機能を増やしたら、最低限以下を更新してください。

- `README.md` の task 表
- `docs/04-sample-catalog.md`
- 必要なら `docs/06-roadmap.md`

## やらないこと

- この lab をいきなり framework-heavy にしない。
- permission を説明なしに `true` へ広げない。
- 生成物 `dist/`、`coverage/`、`data/todos.json`、`data/*.kv*` をコミット対象にしない。

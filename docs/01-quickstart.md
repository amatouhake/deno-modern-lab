# Quickstart

このリポジトリは Deno 2.9.0 以上を前提にしています。HAKE さんの WSL2 / Ubuntu 24.04
環境では、まず次を確認してください。

```bash
deno --version
```

## `deno task` について

`deno task` は `npm run` に相当します。`deno.json` の `tasks` フィールドに書いたコマンドを
`deno task <名前>` で実行します。このリポジトリ内のサンプルはすべて `deno task <名前>`
で動かします。

## 最初に実行するもの

```bash
deno task ok
```

root の品質チェックは外部 package 取得に依存しないようにしています。`deno task ok`
は次を順に実行します。

1. `deno fmt --check`
2. `deno lint`
3. `deno check --unstable-kv ...`
4. `deno test -P`

`-P` は **named permission set** を使う指定です。Deno はファイル・ネットワーク・環境変数などへの
アクセスがデフォルトで閉じており、実行時に必要な権限だけを明示します。`-P` 単体（引数なし）は
`deno.json` の `test.permissions` セクションを参照し、`-P=server` のように名前を付けると
`permissions.server` の定義を使います。詳しくは `docs/03-permissions-and-security.md` を参照。

JSR / npm の依存解決を試す場合は、後で `deno task jsr-std` や `deno task npm-node`
を個別に実行します。

## CLI を試す

```bash
deno task hello --name HAKE --excited
deno task hello --name HAKE --json --inspect-runtime
```

Deno task では、task 名の後ろにそのまま引数を書きます。

## HTTP サーバーを試す

```bash
deno task server
```

別ターミナルから:

```bash
curl 'http://localhost:8000/api/hello?name=HAKE'
curl 'http://localhost:8000/api/runtime'
curl 'http://localhost:8000/api/todos'
```

Todo 追加:

```bash
curl -X POST 'http://localhost:8000/api/todos' \
  -H 'content-type: application/json' \
  -d '{"title":"Deno.serve を試す"}'
```

## 生成物を消す

```bash
deno task clean
```

`dist/`、`coverage/`、サンプル実行で作られる `data/todos.json` や `data/lab.kv*` を消します。

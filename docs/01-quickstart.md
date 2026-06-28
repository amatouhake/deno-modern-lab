# Quickstart

このリポジトリは Deno 2.9.0 以上を前提にしています。HAKE さんの WSL2 / Ubuntu 24.04
環境では、まず次を確認してください。

```bash
deno --version
```

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

`-P` は `deno.json` の test permissions を明示的に使うための指定です。JSR / npm
の依存解決を試す場合は、後で `deno task jsr-std` や `deno task npm-node` を個別に実行します。

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

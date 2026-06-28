# Agent workflow

`AGENTS.md` の補足です。エージェントがこの repo を拡張するときの推奨手順をまとめます。

## 1. 追加する機能を分類する

- pure TypeScript だけで済むか。
- file / env / net / run / ffi / sys / import permission が必要か。
- unstable flag が必要か。
- WSL2 で動きやすいか。

## 2. サンプルを小さく置く

新しい実験は原則 `src/<topic>_demo.ts` に置きます。ライブラリとして再利用できる部分は `src/core/`
に分離します。

## 3. task を追加する

`deno.json` の `tasks` に追加し、必要なら `permissions` に named set を追加します。

悪い例:

```json
"new-demo": "deno run -A src/new_demo.ts"
```

良い例:

```json
"new-demo": "deno run -P=new-demo src/new_demo.ts"
```

## 4. テストを書く

HTTP や store は副作用を切り離し、`InMemory...` を使ってテストします。ファイル I/O のテストだけ
`Json...` を使います。

```bash
deno task test
```

## 5. docs を更新する

- README の task 表
- `docs/04-sample-catalog.md`
- 権限が増えたら `docs/03-permissions-and-security.md`

## 6. 最後に品質チェック

```bash
deno task ok
```

Deno Desktop や KV のような optional / unstable サンプルは、`ok`
に含めるかどうかを慎重に判断してください。副作用や環境依存が強いものは、個別 task に残す方が lab
として扱いやすいです。

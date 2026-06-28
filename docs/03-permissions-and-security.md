# Permissions and security

Deno の大きな特徴は、ファイル・ネットワーク・環境変数・subprocess
などへのアクセスがデフォルトで閉じていることです。この lab では、その特徴を見失わないように `-A`
を避け、named permission set を使っています。

## なぜ permission set を使うか

コマンドに毎回 `--allow-read=... --allow-write=... --allow-env=...`
と書くと、学習用でも長くなりがちです。Deno 2.5 以降は `deno.json` に permission set
を置き、`-P=name` で呼び出せます。

例:

```json
"permissions-demo": {
  "read": ["./data/motd.txt"],
  "env": ["DENO_LAB_MESSAGE"]
}
```

実行:

```bash
deno run -P=permissions-demo src/permissions_demo.ts
```

## この lab の permission set

| set                | 目的            | 主な権限                                              |
| ------------------ | --------------- | ----------------------------------------------------- |
| `server`           | HTTP API        | `net: true`, `./data` read/write, `PORT` / `DENO_ENV` |
| `permissions-demo` | 権限 API の学習 | `./data/motd.txt`, `DENO_LAB_MESSAGE`                 |
| `npm-node`         | npm / node 互換 | `registry.npmjs.org` import、色設定用 env             |
| `jsr-std`          | JSR sample      | static import の依存解決を nested config で確認       |
| `kv`               | Deno KV         | `./data` read/write                                   |
| `clean`            | 生成物削除      | `dist`, `coverage`, `data` read/write                 |

## `NotCapable` と `PermissionDenied`

Deno 2 では、Deno の permission が足りない場合は主に `Deno.errors.NotCapable` が使われます。OS
側のファイル権限などで失敗した場合は `PermissionDenied` になることがあります。permission error
を捕まえるコードを書くときは、どちらの失敗なのかを意識してください。

## `--allow-run` は特に慎重に

この lab では `--allow-run` を使っていません。subprocess は Deno の sandbox
の外側で動くため、権限設計上のリスクが大きくなります。必要になった場合は、実行可能ファイル名を限定し、理由を
docs に書いてください。

## `net: true` について

`server` では学習時の接続先・listen address の差異で詰まらないよう `net: true`
にしています。プロダクションに寄せる場合は、listen host / port と outbound
接続先を整理し、`net: ["127.0.0.1:8000"]` のように絞る余地があります。

## チェック観点

新しいサンプルを追加する場合は、次を確認してください。

- そのサンプルが本当に必要とする権限は何か。
- `deno task` に権限フラグを直書きするより permission set にした方が読みやすいか。
- 失敗時に Deno が出す permission hint を README / docs で邪魔していないか。
- 生成物やローカル DB を `.gitignore` に入れたか。

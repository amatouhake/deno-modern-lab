# Roadmap ideas

この lab をさらに価値あるリポジトリへ育てるための候補です。

## 1. CI

GitHub Actions で以下を実行します。

```bash
deno task ok
deno task bench
```

Deno 2.9.0 固定と latest の matrix にすると、学習用としてバージョン差分も見やすくなります。

## 2. Fresh / Hono / Oak の比較

現在は framework なしの `Deno.serve` に寄せています。次の段階で、同じ `/api/hello` を Hono や Fresh
で書いて比較すると、Deno の標準 API と framework の差が分かりやすくなります。

## 3. Deno Deploy

`src/server.ts` を Deno Deploy に載せるためのメモを追加します。KV を使う場合は Deploy 側の storage
と local KV の違いも整理します。

## 4. OpenTelemetry Collector

`docker compose` で OpenTelemetry Collector + Jaeger / Grafana Tempo
の最小構成を足すと、`deno task otel` の意味が見えやすくなります。

## 5. JSR publish の準備

`mod.ts` は export の入口として用意しています。JSR publish を試す場合は、scope、package
name、README、license、exports を整理してください。

## 6. Deno Desktop の深掘り

Deno 2.9 の Desktop は experimental です。次のような確認余地があります。

- WSL2 + WSLg での起動条件
- Linux ネイティブでの `.deb` / `.rpm` 出力
- HMR
- webview / CEF backend の違い
- `Deno.BrowserWindow` などの native API

## 7. Node プロジェクト移行サンプル

`examples/node_migration/` を作り、既存 `package.json` と npm dependencies を Deno
で動かす実験を追加します。`deno install`、`deno task`、lockfile migration を確認する用途です。

## 8. 権限をさらに狭める

`server` の `net: true` は学習時の詰まりを減らすために広めです。実運用寄りにする場合は listen host /
port と outbound を分け、より狭い allow list にします。

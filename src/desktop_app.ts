Deno.serve(() =>
  new Response(
    `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Deno Desktop Lab</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 2rem; line-height: 1.7; }
    code { background: #f5f5f5; padding: 0.1rem 0.3rem; border-radius: 0.25rem; }
  </style>
</head>
<body>
  <h1>Hello from Deno Desktop</h1>
  <p>Deno 2.9 の <code>deno desktop</code> 用最小サンプルです。</p>
  <p>WSL2 では WSLg / webview まわりの環境差が出ることがあります。</p>
</body>
</html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } },
  )
);

export {};

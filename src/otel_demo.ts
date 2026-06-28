const port = Number(Deno.env.get("PORT") ?? "8000");

console.log("OpenTelemetry demo server");
console.log("Run with: OTEL_DENO=true deno run -P=server src/otel_demo.ts");
console.log(`Listening on http://localhost:${port}/`);

Deno.serve({ port }, (request) => {
  const url = new URL(request.url);
  console.log("handling request", { method: request.method, pathname: url.pathname });

  return new Response(JSON.stringify({ ok: true, pathname: url.pathname }, null, 2), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
});

export {};

/// <reference lib="dom" />

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app element.");
}

const facts = [
  "Deno can run TypeScript directly.",
  "Deno has a built-in formatter, linter, test runner, and bundler.",
  "Deno uses explicit permissions for file, network, env, subprocess, and more.",
];

app.innerHTML = `
  <h1>Deno browser bundle sample</h1>
  <p>This script was written in TypeScript and can be bundled with <code>deno bundle</code>.</p>
  <ul>${facts.map((fact) => `<li>${fact}</li>`).join("")}</ul>
  <button type="button">Add timestamp</button>
  <pre></pre>
`;

const button = app.querySelector("button");
const output = app.querySelector("pre");

button?.addEventListener("click", () => {
  if (output) {
    output.textContent = new Date().toISOString();
  }
});

export {};

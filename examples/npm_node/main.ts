import { createHash, randomUUID } from "node:crypto";
import { basename, join } from "node:path";
import pc from "picocolors";

const input = Deno.args.join(" ") || "Deno 2.9";
const digest = createHash("sha256").update(input).digest("hex").slice(0, 16);
const fileName = basename(join("examples", "npm_node", "main.ts"));

console.log(pc.green("npm:picocolors is working."));
console.log(`node:crypto sha256('${input}') = ${digest}`);
console.log(`node:path basename(join('examples', 'npm_node', 'main.ts')) = ${fileName}`);
console.log(`randomUUID from node:crypto = ${randomUUID()}`);

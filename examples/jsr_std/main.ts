import { basename, join } from "@std/path";

const path = join("docs", "01-quickstart.md");
console.log("JSR @std/path is working.");
console.log(`join('docs', '01-quickstart.md') = ${path}`);
console.log(`basename(path) = ${basename(path)}`);

import { writeFileSync } from "node:fs";
import path from "node:path";
import { SEED } from "@/lib/projects";

const out = path.join(process.cwd(), "src", "data", "projects.json");
writeFileSync(out, JSON.stringify({ projects: SEED }, null, 2) + "\n", "utf8");
console.log(`wrote ${SEED.length} projects -> ${out}`);

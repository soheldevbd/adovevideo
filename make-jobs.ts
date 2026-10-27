// npm run jobs -> jobs.json (100 niche). Local server-render batch-er jonno (optional).
import fs from "node:fs";
import { NICHES } from "./lib/niches";
import { makeMeta } from "./lib/ui";
const jobs = NICHES.map((n) => ({ id: n.id, style: n.style, pal: n.pal, energy: n.energy, dur: 20, w: 3840, h: 2160, ...makeMeta(n.style, n.pal, false, n.name, n.kw) }));
if (new Set(jobs.map((j) => j.id)).size !== jobs.length) throw new Error("duplicate niche id");
fs.writeFileSync("jobs.json", JSON.stringify(jobs, null, 2));
console.log(jobs.length, "jobs -> jobs.json");

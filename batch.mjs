// node batch.mjs  (age `npm run dev` chalu rakho). Resume: already-done file skip hoy.
import fs from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
const API = process.env.API || "http://localhost:3000/api/render";
const OUT = "./videos"; fs.mkdirSync(OUT, { recursive: true });
const jobs = JSON.parse(fs.readFileSync("./jobs.json", "utf8"));
const doneFile = `${OUT}/done.txt`; const done = new Set(fs.existsSync(doneFile) ? fs.readFileSync(doneFile, "utf8").split("\n") : []);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (const [i, j] of jobs.entries()) {
  const key = j.id; if (done.has(key)) continue;
  const res = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...j, seed: Math.floor(Math.random() * 1e9) }) });
  const { id, error } = await res.json(); if (error) { console.log(`#${i + 1} skip: ${error}`); continue; }
  let st;
  do { await sleep(3000); st = await fetch(`${API}?id=${id}`).then((r) => r.json()); process.stdout.write(`\r#${i + 1}/${jobs.length} ${st.frame}/${st.total}   `); } while (st.status === "rendering");
  if (st.status === "error") { console.log(`\n#${i + 1} error: ${st.error}`); continue; }
  const file = `${OUT}/${st.name}.mp4`;
  const dl = await fetch(`${API}?id=${id}&download=1`);
  await pipeline(Readable.fromWeb(dl.body), fs.createWriteStream(file));
  fs.writeFileSync(file.replace(".mp4", ".txt"), `TITLE:\n${j.title}\n\nKEYWORDS:\n${j.keywords}\n`);
  fs.appendFileSync(doneFile, key + "\n"); console.log(`\n#${i + 1} done -> ${file}`);
}

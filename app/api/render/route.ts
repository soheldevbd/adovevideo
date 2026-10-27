import { createCanvas } from "@napi-rs/canvas";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";
import { drawGs, STYLE_IDS, PAL } from "../../../lib/gs";
import { fileSlug } from "../../../lib/ui";

export const runtime = "nodejs";
const FPS = 30, LOOP = 10; // 1 loop = 10s; durations are multiples so it loops seamlessly
const SIZES = [[3840, 2160], [2160, 3840], [2160, 2160], [1920, 1080]];
const DURS = [10, 20, 30];

type Job = { status: "rendering" | "done" | "error"; frame: number; total: number; file?: string; name?: string; error?: string };
const jobs: Map<string, Job> = ((globalThis as any).__cvjobs ??= new Map());

function findFfmpeg(): string {
  const exe = process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";
  const c = [process.env.FFMPEG_PATH || null, ffmpegPath as string | null, path.join(process.cwd(), "node_modules", "ffmpeg-static", exe)];
  return c.find((p) => p && existsSync(p)) || "ffmpeg";
}

async function run(id: string, W: number, H: number, seed: number, o: any, meta: { title: string; kw: string }) {
  const job = jobs.get(id)!;
  job.name = `${fileSlug(meta.title) || "green-screen"}-${id.slice(0, 4)}`;
  const fail = (m: string) => { job.status = "error"; job.error = m; };
  const MBPS = W * H > 4e6 ? 50 : 25; // CBR: size ~= MBPS x seconds / 8
  try {
    const dir = await mkdtemp(path.join(tmpdir(), "cv-"));
    const out = path.join(dir, "out.mp4");
    const ff = spawn(findFfmpeg(), [
      "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${W}x${H}`, "-r", String(FPS), "-i", "-",
      "-c:v", "libx264", "-preset", "veryfast", "-profile:v", "high", "-b:v", `${MBPS}M`, "-minrate", `${MBPS}M`, "-maxrate", `${MBPS}M`, "-bufsize", `${MBPS * 2}M`, "-x264-params", "nal-hrd=cbr:force-cfr=1", "-pix_fmt", "yuv420p",
      ...(meta.title ? ["-metadata", `title=${meta.title}`, "-metadata", `comment=${meta.kw}`] : []),
      "-movflags", "+faststart", out,
    ], { stdio: ["pipe", "ignore", "pipe"] });
    let log = "";
    ff.stderr.on("data", (d) => (log = (log + d).slice(-500)));
    ff.on("error", (e) => fail("ffmpeg start hoy nai: " + e.message));
    ff.stdin.on("error", () => {});
    const closed = new Promise<number>((res) => ff.on("close", (c) => res(c ?? 1)));
    const canvas = createCanvas(W, H), ctx = canvas.getContext("2d");
    for (let f = 0; f < job.total && job.status === "rendering"; f++) {
      drawGs(ctx, W, H, ((f / FPS) / LOOP) % 1, seed, o);
      if (!ff.stdin.write(canvas.data())) await new Promise((r) => ff.stdin.once("drain", r));
      job.frame = f + 1;
    }
    ff.stdin.end();
    const code = await closed;
    if (job.status === "error") return;
    if (code !== 0) return fail("ffmpeg error: " + log);
    job.file = out; job.status = "done";
  } catch (e: any) { fail(e.message); }
}

export async function POST(req: Request) {
  if (process.env.VERCEL) return Response.json({ error: "Vercel-e render hoy na. Local PC ba Docker server-e chalao (README dekho)." }, { status: 501 });
  const b = await req.json();
  const seed = Number(b.seed);
  if (!Number.isFinite(seed) || !STYLE_IDS.includes(b.style)) return Response.json({ error: "style ba seed thik na" }, { status: 400 });
  const [W, H] = SIZES.find(([w, h]) => w === b.w && h === b.h) || SIZES[0];
  const dur = DURS.includes(b.dur) ? b.dur : 10;
  const o = { style: b.style, pal: Number.isInteger(b.pal) && b.pal >= 0 && b.pal < PAL.length ? b.pal : 0, energy: [1, 2, 3].includes(b.energy) ? b.energy : 1 };
  const meta = { title: typeof b.title === "string" ? b.title.slice(0, 200) : "", kw: typeof b.keywords === "string" ? b.keywords.slice(0, 1500) : "" };
  const id = randomUUID();
  jobs.set(id, { status: "rendering", frame: 0, total: dur * FPS });
  run(id, W, H, seed, o, meta);
  return Response.json({ id });
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const id = u.searchParams.get("id") || "";
  const job = jobs.get(id);
  if (!job) return Response.json({ error: "job pawa jay nai (server restart hoyeche?)" }, { status: 404 });
  if (u.searchParams.get("download") && job.file) {
    const buf = await readFile(job.file);
    const name = job.name || "green-screen";
    await rm(path.dirname(job.file), { recursive: true, force: true }).catch(() => {});
    jobs.delete(id); // download-er por file muche dao, disk bhorbe na
    return new Response(buf, { headers: { "Content-Type": "video/mp4", "Content-Disposition": `attachment; filename="${name}.mp4"` } });
  }
  return Response.json({ status: job.status, frame: job.frame, total: job.total, name: job.name, error: job.error });
}

// Browser-e MP4 render: WebCodecs (H.264) + mp4-muxer. Server/ffmpeg lagbe na, tai Vercel-e kaj kore.
import { Muxer, ArrayBufferTarget } from "mp4-muxer";
import { drawGs } from "./gs";
const FPS = 30, LOOP = 10;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export type RenderOpts = { style: string; pal: number; energy: number; w: number; h: number; dur: number; seed: number; onProgress?: (pct: number) => void; cancel?: { current: boolean } };

export async function renderMp4(o: RenderOpts): Promise<Blob> {
  if (typeof VideoEncoder === "undefined") throw new Error("Ei browser WebCodecs support kore na. Desktop Chrome ba Edge use koro.");
  const { w, h } = o, big = w * h > 4e6;
  const config = { codec: big ? "avc1.640033" : "avc1.640028", width: w, height: h, bitrate: big ? 50e6 : 25e6, framerate: FPS, avc: { format: "avc" as const } };
  const sup = await VideoEncoder.isConfigSupported(config);
  if (!sup.supported) throw new Error(`Ei browser/PC ${w}x${h} H.264 encode korte pare na. 1080p try koro ba desktop Chrome/Edge use koro.`);

  const muxer = new Muxer({ target: new ArrayBufferTarget(), video: { codec: "avc", width: w, height: h, frameRate: FPS }, fastStart: "in-memory" });
  let err: Error | null = null;
  const enc = new VideoEncoder({ output: (c, m) => muxer.addVideoChunk(c, m), error: (e) => (err = e) });
  enc.configure(config);
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d")!;
  const total = o.dur * FPS, opts = { style: o.style, pal: o.pal, energy: o.energy };
  try {
    for (let f = 0; f < total; f++) {
      if (o.cancel?.current) throw new Error("Cancelled");
      if (err) throw err;
      while (enc.encodeQueueSize > 6) await sleep(2); // encoder-ke pichone felo na
      drawGs(ctx, w, h, ((f / FPS) / LOOP) % 1, o.seed, opts);
      const frame = new VideoFrame(cv, { timestamp: Math.round((f * 1e6) / FPS), duration: Math.round(1e6 / FPS) });
      enc.encode(frame, { keyFrame: f % 60 === 0 });
      frame.close();
      if (f % 4 === 0) { o.onProgress?.(Math.round((f / total) * 100)); await sleep(0); }
    }
    await enc.flush();
    if (err) throw err;
    muxer.finalize();
    o.onProgress?.(100);
    return new Blob([(muxer.target as ArrayBufferTarget).buffer], { type: "video/mp4" });
  } finally { if (enc.state !== "closed") enc.close(); }
}

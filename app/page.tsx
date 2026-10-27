"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { drawGs, PAL } from "../lib/gs";
import { makeMeta } from "../lib/ui";
import { NICHES, nicheFile, type Niche } from "../lib/niches";
import { renderMp4 } from "../lib/clientRender";

const SIZES = [{ l: "16:9 · 4K", w: 3840, h: 2160 }, { l: "9:16 · Vertical 4K", w: 2160, h: 3840 }, { l: "1:1 · Square", w: 2160, h: 2160 }, { l: "16:9 · 1080p", w: 1920, h: 1080 }];
const DURS = [10, 20, 30];
const metaOf = (n: Niche, vertical: boolean) => makeMeta(n.style, n.pal, vertical, n.name, n.kw);

function save(blob: Blob, name: string) {
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 10000);
}

export default function Page() {
  const [sel, setSel] = useState(NICHES[0]), [size, setSize] = useState(0), [dur, setDur] = useState(20);
  const [auto, setAuto] = useState(true), [q, setQ] = useState(""), [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0), [err, setErr] = useState(""), [queue, setQueue] = useState("");
  const [seed, setSeed] = useState(1234);
  const busyRef = useRef(false), cancel = useRef(false), cv = useRef<HTMLCanvasElement>(null);
  const s = SIZES[size], vertical = s.h > s.w, meta = metaOf(sel, vertical);
  const list = useMemo(() => NICHES.filter((n) => (n.name + " " + n.kw.join(" ")).toLowerCase().includes(q.toLowerCase())), [q]);

  useEffect(() => {
    const c = cv.current!, ctx = c.getContext("2d")!;
    c.width = 640; c.height = Math.round((640 * s.h) / s.w);
    let raf = 0; const t0 = performance.now();
    const tick = (n: number) => { drawGs(ctx, c.width, c.height, ((n - t0) / 10000) % 1, seed, sel); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [sel, size, seed]);

  async function create(n: Niche): Promise<boolean> {
    if (busyRef.current) return false;
    busyRef.current = true; setBusy(true); setErr(""); setPct(0);
    try {
      const blob = await renderMp4({ style: n.style, pal: n.pal, energy: n.energy, w: s.w, h: s.h, dur, seed: Math.floor(Math.random() * 1e9), onProgress: setPct, cancel });
      save(blob, nicheFile(n)); return true;
    } catch (e: any) { setErr(e.message); return false; }
    finally { busyRef.current = false; setBusy(false); }
  }
  const pick = (n: Niche) => { setSel(n); setSeed(Math.floor(Math.random() * 1e9)); if (auto && !busyRef.current) create(n); };
  async function all() {
    cancel.current = false;
    for (const [i, n] of list.entries()) {
      if (cancel.current) break;
      setSel(n); setQueue(`${i + 1}/${list.length}`);
      if (!(await create(n))) break;
      await new Promise((r) => setTimeout(r, 800));
    }
    setQueue("");
  }
  function csv() {
    const rows = NICHES.map((n) => { const m = metaOf(n, false); return [nicheFile(n), m.title, m.keywords, "", ""].map((x) => `"${x.replace(/"/g, '""')}"`).join(","); });
    save(new Blob([["Filename,Title,Keywords,Category,Releases", ...rows].join("\n")], { type: "text/csv" }), "adobe-stock-metadata.csv");
  }
  const Chip = ({ on, onClick, children }: any) => <button className={"chip" + (on ? " on" : "")} onClick={onClick}>{children}</button>;

  return (
    <main>
      <h1>ChromaVault</h1><p className="sub">{NICHES.length} niche · niche-e click korlei MP4 toiri hoye download hobe (browser-e render, server lage na)</p>
      <div className="grid">
        <div className="card"><canvas ref={cv} /><div className="mono">{sel.name} · {PAL[sel.pal].name} · energy {sel.energy}</div></div>
        <div className="card">
          <label>Video size</label><div className="row">{SIZES.map((x, i) => <Chip key={x.l} on={size === i} onClick={() => setSize(i)}>{x.l}</Chip>)}</div>
          <label>Duration (seamless loop)</label><div className="row">{DURS.map((d) => <Chip key={d} on={dur === d} onClick={() => setDur(d)}>{d} second</Chip>)}</div>
          <label><input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} /> Niche-e click korlei render + download</label>
          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn" disabled={busy} onClick={() => create(sel)}>{busy ? `Render hocche... ${pct}%` : "Render & download MP4"}</button>
            <button className="btn alt" disabled={busy} onClick={all}>Sob {list.length} ta ek ek kore banao</button>
            {busy && <button className="btn alt" onClick={() => (cancel.current = true)}>Stop</button>}
          </div>
          {queue && <div className="mono">Queue: {queue} (browser multiple download-er permission chaile Allow koro)</div>}
          {err && <div className="err">{err}</div>}
          <label>Title ({meta.title.length}/200)</label><textarea rows={2} readOnly value={meta.title} />
          <button className="btn alt" onClick={() => navigator.clipboard.writeText(meta.title)}>Copy title</button>
          <label>Keywords ({meta.keywords.split(",").length}/49)</label><textarea rows={3} readOnly value={meta.keywords} />
          <div className="row"><button className="btn alt" onClick={() => navigator.clipboard.writeText(meta.keywords)}>Copy keywords</button><button className="btn alt" onClick={csv}>Metadata CSV (sob niche)</button></div>
        </div>
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        <input className="search" placeholder="Niche khojo... (snow, wedding, fire)" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="niches">{list.map((n) => (
          <button key={n.id} className={"niche" + (sel.id === n.id ? " on" : "")} disabled={busy && auto} onClick={() => pick(n)}>
            <span className="dot" style={{ background: PAL[n.pal].cols[0] }} />{n.name}
          </button>))}</div>
      </div>
    </main>
  );
}

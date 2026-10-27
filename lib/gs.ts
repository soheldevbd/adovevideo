// Green screen particle animations. t = 0..1 = one seamless loop (LOOP seconds).
export const CHROMA = "#00B140";
export const PAL = [
  { id: "gold", name: "Gold", cols: ["#FFD34D", "#FFC107", "#FFE58A", "#F5B301"] },
  { id: "white", name: "White", cols: ["#FFFFFF", "#F4F8FF", "#E6EEF9"] },
  { id: "pink", name: "Pink", cols: ["#FF8FB8", "#FF5C9E", "#FFC2D9", "#FF3D8B"] },
  { id: "red", name: "Red", cols: ["#FF2D3F", "#E01E37", "#FF6B6B", "#B80F2A"] },
  { id: "blue", name: "Blue", cols: ["#5AB8FF", "#2F8BFF", "#A8DBFF", "#1E5EFF"] },
  { id: "orange", name: "Orange", cols: ["#FF9A1F", "#FF6A00", "#FFC15E", "#FF4500"] },
  { id: "purple", name: "Purple", cols: ["#B085FF", "#8A4DFF", "#D5BBFF", "#6C2BD9"] },
  { id: "rainbow", name: "Colorful", cols: ["#FF3B3B", "#FF9F1A", "#FFE14D", "#4DA6FF", "#B05CFF", "#FF5CAA"] },
];
type Cfg = { n: number; size: [number, number]; dir: 1 | -1; cyc: number; sway: number; spin: number; twinkle?: boolean };
export const STYLES: { id: string; name: string; noun: string; words: string[]; cfg: Cfg }[] = [
  { id: "snow", name: "Falling Snow", noun: "snow", words: ["snow", "snowfall", "winter", "christmas", "holiday", "snowflakes", "cold", "weather"], cfg: { n: 160, size: [0.004, 0.011], dir: 1, cyc: 1, sway: 0.03, spin: 0 } },
  { id: "rain", name: "Rain Drops", noun: "rain", words: ["rain", "raindrops", "storm", "weather", "wet", "rainy", "water", "drizzle"], cfg: { n: 260, size: [0.05, 0.11], dir: 1, cyc: 14, sway: 0, spin: 0 } },
  { id: "confetti", name: "Confetti", noun: "confetti", words: ["confetti", "party", "celebration", "birthday", "festive", "congratulations", "carnival", "winner"], cfg: { n: 170, size: [0.008, 0.016], dir: 1, cyc: 1, sway: 0.04, spin: 2 } },
  { id: "hearts", name: "Floating Hearts", noun: "hearts", words: ["hearts", "love", "valentine", "romantic", "romance", "wedding", "affection", "heart shape"], cfg: { n: 55, size: [0.02, 0.05], dir: -1, cyc: 1, sway: 0.04, spin: 0 } },
  { id: "petals", name: "Falling Petals", noun: "petals", words: ["petals", "flower petals", "spring", "romantic", "nature", "blossom", "floral", "wedding"], cfg: { n: 70, size: [0.012, 0.026], dir: 1, cyc: 1, sway: 0.05, spin: 2 } },
  { id: "sparkles", name: "Sparkles", noun: "sparkles", words: ["sparkles", "glitter", "shine", "magic", "twinkle", "stars", "glow", "shimmer"], cfg: { n: 90, size: [0.01, 0.03], dir: 1, cyc: 0, sway: 0, spin: 0, twinkle: true } },
  { id: "bubbles", name: "Rising Bubbles", noun: "bubbles", words: ["bubbles", "soap bubbles", "underwater", "water", "rising", "float", "clean", "fizz"], cfg: { n: 60, size: [0.015, 0.05], dir: -1, cyc: 1, sway: 0.03, spin: 0 } },
  { id: "embers", name: "Fire Embers", noun: "embers", words: ["embers", "fire", "sparks", "flame", "burning", "hot", "campfire", "glowing"], cfg: { n: 110, size: [0.003, 0.009], dir: -1, cyc: 1, sway: 0.06, spin: 0, twinkle: true } },
  { id: "leaves", name: "Autumn Leaves", noun: "leaves", words: ["leaves", "autumn", "fall", "foliage", "nature", "season", "thanksgiving", "wind"], cfg: { n: 45, size: [0.02, 0.04], dir: 1, cyc: 1, sway: 0.06, spin: 2 } },
  { id: "dust", name: "Dust Particles", noun: "dust particles", words: ["dust", "particles", "bokeh", "floating particles", "atmosphere", "cinematic", "dust motes", "dreamy"], cfg: { n: 140, size: [0.002, 0.006], dir: -1, cyc: 1, sway: 0.05, spin: 0, twinkle: true } },
];
export const STYLE_IDS = STYLES.map((s) => s.id);

const mul = (a: number) => () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);
const TAU = Math.PI * 2;

function shape(c: any, id: string, s: number, col: string) {
  c.fillStyle = col;
  c.beginPath();
  switch (id) {
    case "snow": case "dust": case "embers": c.arc(0, 0, s, 0, TAU); break;
    case "rain": c.rect(-s * 0.025, -s / 2, s * 0.05, s); break;
    case "confetti": c.rect(-s, -s * 0.5, s * 2, s); break;
    case "petals": c.ellipse(0, 0, s, s * 0.55, 0, 0, TAU); break;
    case "leaves": c.moveTo(0, -s); c.quadraticCurveTo(s * 0.9, -s * 0.2, 0, s); c.quadraticCurveTo(-s * 0.9, -s * 0.2, 0, -s); break;
    case "hearts": c.moveTo(0, s * 0.5); c.bezierCurveTo(-s, -s * 0.1, -s * 0.5, -s * 0.8, 0, -s * 0.3); c.bezierCurveTo(s * 0.5, -s * 0.8, s, -s * 0.1, 0, s * 0.5); break;
    case "sparkles": { const k = 0.18; c.moveTo(0, -s); c.lineTo(s * k, -s * k); c.lineTo(s, 0); c.lineTo(s * k, s * k); c.lineTo(0, s); c.lineTo(-s * k, s * k); c.lineTo(-s, 0); c.lineTo(-s * k, -s * k); c.closePath(); break; }
    case "bubbles": {
      const a = c.globalAlpha;
      c.arc(0, 0, s, 0, TAU); c.globalAlpha = a * 0.25; c.fill();
      c.globalAlpha = a; c.lineWidth = Math.max(1.5, s * 0.07); c.strokeStyle = col; c.stroke();
      c.beginPath(); c.arc(-s * 0.35, -s * 0.35, s * 0.15, 0, TAU); c.fillStyle = "#FFFFFF"; break;
    }
  }
  c.fill();
}

export function drawGs(c: any, W: number, H: number, t: number, seed: number, o: { style: string; pal: number; energy: number }) {
  const st = STYLES.find((s) => s.id === o.style) || STYLES[0];
  const cols = (PAL[o.pal] || PAL[0]).cols, cfg = st.cfg, e = o.energy;
  c.globalAlpha = 1; c.fillStyle = CHROMA; c.fillRect(0, 0, W, H);
  const r = mul(Math.imul(seed | 0, 2654435761) ^ hash(st.id));
  const m = 0.08;
  for (let i = 0; i < cfg.n; i++) {
    const x0 = r(), y0 = r(), ph = r(), sz = (cfg.size[0] + r() * (cfg.size[1] - cfg.size[0])) * H, col = cols[Math.floor(r() * cols.length)], v = r();
    const cyc = cfg.cyc * e * (1 + (i % 2)), sw = 1 + (i % 3);
    const yy = cfg.cyc ? ((((y0 + cfg.dir * t * cyc) % 1) + 1) % 1) * (1 + 2 * m) - m : y0;
    const x = x0 + cfg.sway * Math.sin(TAU * (t * sw + ph));
    const rot = cfg.spin ? TAU * (ph + t * cfg.spin * (i % 2 ? 1 : -1) * e) : st.id === "rain" ? 0.12 : 0;
    c.globalAlpha = cfg.twinkle ? 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(TAU * (t * (2 + (i % 3)) * e + ph))) : st.id === "rain" ? 0.7 : 0.75 + 0.25 * v;
    c.save(); c.translate(x * W, yy * H); c.rotate(rot);
    if (st.id === "petals" || st.id === "leaves") c.scale(1, Math.abs(Math.cos(TAU * (ph + t * e))) * 0.6 + 0.4);
    shape(c, st.id, sz, col);
    c.restore();
  }
  c.globalAlpha = 1;
}

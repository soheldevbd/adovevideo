import { PAL, STYLES } from "./gs";
export const fileSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90);
// Adobe: no "4K" / "video" in title or keywords.
export function makeMeta(style: string, pal: number, vertical = false, name?: string, extra: string[] = []) {
  const st = STYLES.find((s) => s.id === style) || STYLES[0];
  const p = PAL[pal] || PAL[0];
  const title = name ? `${name} Green Screen Animation, Chroma Key Overlay Loop` : `${p.name} ${st.name} Green Screen Animation, Chroma Key Overlay Loop${vertical ? ", Vertical" : ""}`;
  const base = [...(name ? [name.toLowerCase()] : []), ...extra, `${p.name.toLowerCase()} ${st.noun}`, ...st.words, "green screen", "greenscreen", "chroma key", "chromakey", "transparent background", "alpha overlay", "overlay", "effect", "vfx", "isolated", "compositing", "animation", "motion graphics", "footage", "loop", "looping", "seamless loop", "background", "abstract", "design", "visual effects", "digital", "template", "element"];
  if (vertical) base.unshift("vertical", "portrait", "social media", "reels");
  const kw = [...new Set(base.map((k) => k.toLowerCase()))].slice(0, 49);
  return { title: title.slice(0, 200), keywords: kw.join(", ") };
}

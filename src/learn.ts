/**
 * The Five Elements graph (Figma 1214:956 / 1217:1621) — drawn in code, not
 * shipped as a picture, so it can re-set itself for the phone: the SVG scales
 * with its column and the labels stay type, not outlines.
 *
 * Geometry: the five element glyphs sit on a pentagon. The GENERATING cycle
 * runs the ring as solid arcs (Wood → Fire → Earth → Metal → Water → Wood);
 * the OVERCOMING cycle cuts across as the dashed pentagram star.
 */
import woodSvg from '../assets/learn/element-wood.svg?raw';
import fireSvg from '../assets/learn/element-fire.svg?raw';
import earthSvg from '../assets/learn/element-earth.svg?raw';
import metalSvg from '../assets/learn/element-metal.svg?raw';
import waterSvg from '../assets/learn/element-water.svg?raw';

type El = { key: string; color: string; en: string; cn: string; raw: string };

/** Ring order = the generating cycle; overcoming skips one ahead. */
const ELEMENTS: El[] = [
  { key: 'wood', color: '#23680C', en: 'Wood', cn: '木', raw: woodSvg },
  { key: 'fire', color: '#CB2308', en: 'Fire', cn: '火', raw: fireSvg },
  { key: 'earth', color: '#692D25', en: 'Earth', cn: '土', raw: earthSvg },
  { key: 'metal', color: '#866132', en: 'Metal', cn: '金', raw: metalSvg },
  { key: 'water', color: '#001F90', en: 'Water', cn: '水', raw: waterSvg },
];

const W = 600;
const H = 460;
const CX = 300;
const CY = 233;
const R = 170;
const ICON = 54;
/** Degrees of ring kept clear around each glyph — 15° puts the arc tips
 *  ~46px from a glyph's centre, matching the dashed chords' 48. */
const ARC_GAP = 15;
/** Chord endpoints stop this far from a glyph's centre. */
const CHORD_GAP = 48;

const rad = (deg: number) => (deg * Math.PI) / 180;
const px = (n: number) => n.toFixed(1);
/** Pentagon points, Wood at the top, clockwise. */
const angle = (i: number) => -90 + i * 72;
const pt = (deg: number, r = R) => ({ x: CX + r * Math.cos(rad(deg)), y: CY + r * Math.sin(rad(deg)) });

/** The raw asset minus its outer <svg> tag, ready to nest. */
const inner = (raw: string) => raw.replace(/^[^>]*>/, '').replace(/<\/svg>\s*$/, '');

/** A solid arrowhead at (x,y), pointing along `dir` (radians). Drawn inline —
 *  <marker> refs break when the same id exists in the other language's hidden
 *  column, and per-strip copies (see `curled`) would multiply the ids again. */
function arrowAt(x: number, y: number, dir: number): string {
  const tip = { x: x + 5 * Math.cos(dir), y: y + 5 * Math.sin(dir) };
  const bx = x - 3 * Math.cos(dir);
  const by = y - 3 * Math.sin(dir);
  const nx = 3.5 * Math.cos(dir + Math.PI / 2);
  const ny = 3.5 * Math.sin(dir + Math.PI / 2);
  return `<path class="head" d="M ${px(tip.x)} ${px(tip.y)} L ${px(bx + nx)} ${px(by + ny)} L ${px(bx - nx)} ${px(by - ny)} Z" />`;
}

/**
 * The scroll curl needs a SURFACE, not a plane: a figure is rendered as
 * stacked full-size copies, each clipped to its own horizontal band, and the
 * cylinder tips every band by the angle at ITS height — a piecewise curve,
 * so a tall image bends like the text column instead of tilting whole.
 */
export const CURL_STRIPS = 16;
export function curled(content: string, aspect: string): string {
  const strips = Array.from(
    { length: CURL_STRIPS },
    (_, i) => `<div class="curl-strip" style="--i:${i}">${content}</div>`
  ).join('');
  // --n feeds the CSS clip and origin math, so this constant is the ONE knob.
  return `<div class="curl-box" style="--n:${CURL_STRIPS};aspect-ratio:${aspect}">${strips}</div>`;
}

export function elementsGraph(lang: 'en' | 'cn'): string {
  const parts: string[] = [];

  // Generating ring: solid arcs, one per neighbouring pair, arrow at the end.
  for (let i = 0; i < 5; i++) {
    const a = angle(i) + ARC_GAP;
    const b = angle(i + 1) - ARC_GAP;
    const p1 = pt(a);
    const p2 = pt(b);
    parts.push(
      `<path class="gen" d="M ${px(p1.x)} ${px(p1.y)} A ${R} ${R} 0 0 1 ${px(p2.x)} ${px(p2.y)}" />`
    );
    // Clockwise travel: the tangent at angle θ points along (−sinθ, cosθ).
    parts.push(arrowAt(p2.x, p2.y, Math.atan2(Math.cos(rad(b)), -Math.sin(rad(b)))));
  }

  // Overcoming star: dashed chords, each element to the one after next.
  // The chords cross each other; where two dash patterns overlap the point
  // turns to noise. So the star is WOVEN: each chord yields a small gap where
  // it passes "under" its previous neighbour — one crossing, one clean line.
  const chords = Array.from({ length: 5 }, (_, i) => {
    const from = pt(angle(i));
    const to = pt(angle(i + 2));
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy);
    const t1 = CHORD_GAP / len;
    return {
      sx: from.x + dx * t1,
      sy: from.y + dy * t1,
      ex: from.x + dx * (1 - t1),
      ey: from.y + dy * (1 - t1),
    };
  });
  /** Where two chords (as infinite lines) cross — they do, inside the star. */
  const cross = (a: (typeof chords)[0], b: (typeof chords)[0]) => {
    const d1x = a.ex - a.sx, d1y = a.ey - a.sy;
    const d2x = b.ex - b.sx, d2y = b.ey - b.sy;
    const t = ((b.sx - a.sx) * d2y - (b.sy - a.sy) * d2x) / (d1x * d2y - d1y * d2x);
    return { x: a.sx + d1x * t, y: a.sy + d1y * t };
  };
  const UNDER_GAP = 7;
  for (let i = 0; i < 5; i++) {
    const c = chords[i];
    const p = cross(c, chords[(i + 4) % 5]);
    const dx = c.ex - c.sx, dy = c.ey - c.sy;
    const len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len;
    parts.push(
      `<line class="ovr" x1="${px(c.sx)}" y1="${px(c.sy)}" x2="${px(p.x - ux * UNDER_GAP)}" y2="${px(p.y - uy * UNDER_GAP)}" />`,
      `<line class="ovr" x1="${px(p.x + ux * UNDER_GAP)}" y1="${px(p.y + uy * UNDER_GAP)}" x2="${px(c.ex)}" y2="${px(c.ey)}" />`,
      arrowAt(c.ex, c.ey, Math.atan2(dy, dx))
    );
  }

  // Glyphs and labels. The label sits where the glyph has sky: above for the
  // top one, outward to the side for the rest.
  ELEMENTS.forEach((el, i) => {
    const c = pt(angle(i));
    const s = ICON / 48;
    parts.push(
      `<g class="el" style="color:${el.color}" transform="translate(${px(c.x - ICON / 2)},${px(c.y - ICON / 2)}) scale(${s})">${inner(el.raw)}</g>`
    );
    const name = lang === 'cn' ? el.cn : el.en;
    let lx = c.x;
    let ly = c.y;
    let anchor = 'middle';
    if (i === 0) {
      ly = c.y - ICON / 2 - 12;
    } else if (i === 1 || i === 2) {
      lx = c.x + ICON / 2 + 12;
      ly = c.y + (i === 1 ? 4 : 4);
      anchor = 'start';
    } else {
      lx = c.x - ICON / 2 - 12;
      ly = c.y + 4;
      anchor = 'end';
    }
    parts.push(
      `<text class="el-label" x="${px(lx)}" y="${px(ly)}" text-anchor="${anchor}">${name}</text>`
    );
  });

  // The legend draws its swatches with the SAME strokes as the graph, so the
  // dash rhythm matches exactly.
  const swatch = (cls: string) =>
    `<svg class="swatch" width="24" height="2" viewBox="0 0 24 2" aria-hidden="true"><line class="${cls}" x1="0" y1="1" x2="24" y2="1" /></svg>`;
  const note =
    lang === 'cn'
      ? `<span>相生脉络${swatch('gen')}</span><span>相克脉络${swatch('ovr')}</span>`
      : `<span>Generate cycle${swatch('gen')}</span><span>Overcome cycle${swatch('ovr')}</span>`;

  const svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img"
        aria-label="${lang === 'cn' ? '五行相生相克图' : 'The generating and overcoming cycles of the Five Elements'}">
        ${parts.join('\n        ')}
      </svg>`;

  return `
    <figure class="doc-figure elements-graph">
      ${curled(svg, `${W}/${H}`)}
      <figcaption class="graph-note">${note}</figcaption>
    </figure>`;
}

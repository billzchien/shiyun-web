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

/**
 * TWO layouts, each drawn at the size it will be SEEN at — never stretched to
 * fill its column. One geometry scaled to fit can only be right at a single
 * width: at 600 units in a phone's 335px column the glyphs render at 30 and
 * the labels at 7; blown the other way, into the 600px column a small tablet
 * still has under the phone breakpoint, the same drawing came out half again
 * too big, arrowheads and all. So here the units ARE pixels: a label set at
 * 12 is 12 on screen in both, and the compact ring simply holds in tighter.
 */
type Geom = {
  W: number;
  H: number;
  CX: number;
  CY: number;
  R: number;
  ICON: number;
  /** Degrees of ring kept clear around each glyph, so the arcs never touch. */
  ARC_GAP: number;
  /** Chord endpoints stop this far from a glyph's centre. */
  CHORD_GAP: number;
  /** Label type, in viewBox units — it renders at LABEL × the column's scale. */
  LABEL: number;
  /** Air between a glyph and its label. */
  PAD: number;
  /** Whether the ring is named. The phone reads the five off the sentence
   *  above the drawing, so it drops them and spends the width on the ring. */
  LABELS: boolean;
};

/** The full column: 600 across, the ring at its Figma size. */
const WIDE: Geom = {
  W: 600, H: 460, CX: 300, CY: 233, R: 170,
  ICON: 54, ARC_GAP: 15, CHORD_GAP: 48, LABEL: 12, PAD: 12, LABELS: true,
};
/**
 * 335 across — a 375 phone's column exactly, so it lands 1:1 there and only
 * ever shrinks on something narrower. It runs UNNAMED: the five are read off
 * the sentence directly above the drawing, and dropping the labels hands the
 * whole half-width back to the ring, which opens from 110 to 150. What is
 * left is spent exactly — 143 of radius across plus 24 of glyph — so the
 * Water and Fire glyphs land flush on the page margins.
 */
const COMPACT: Geom = {
  W: 335, H: 326, CX: 167.5, CY: 174, R: 150,
  ICON: 48, ARC_GAP: 13, CHORD_GAP: 36, LABEL: 12, PAD: 8, LABELS: false,
};

const rad = (deg: number) => (deg * Math.PI) / 180;
const px = (n: number) => n.toFixed(1);
/** Pentagon points, Wood at the top, clockwise. */
const angle = (i: number) => -90 + i * 72;

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
export function curled(content: string, aspect: string, maxW?: number): string {
  const strips = Array.from(
    { length: CURL_STRIPS },
    (_, i) => `<div class="curl-strip" style="--i:${i}">${content}</div>`
  ).join('');
  // --n feeds the CSS clip and origin math, so this constant is the ONE knob.
  const cap = maxW ? `max-width:${maxW}px;margin-inline:auto;` : '';
  return `<div class="curl-box" style="--n:${CURL_STRIPS};aspect-ratio:${aspect};${cap}">${strips}</div>`;
}

export function elementsGraph(lang: 'en' | 'cn', compact = false): string {
  const { W, H, CX, CY, R, ICON, ARC_GAP, CHORD_GAP, LABEL, PAD, LABELS } = compact ? COMPACT : WIDE;
  const pt = (deg: number) => ({ x: CX + R * Math.cos(rad(deg)), y: CY + R * Math.sin(rad(deg)) });
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
    if (!LABELS) return;
    const name = lang === 'cn' ? el.cn : el.en;
    const pad = PAD;
    let lx = c.x;
    let ly = c.y;
    let anchor = 'middle';
    if (i === 0) {
      ly = c.y - ICON / 2 - pad;
    } else if (i === 1 || i === 2) {
      lx = c.x + ICON / 2 + pad;
      ly = c.y + LABEL / 3;
      anchor = 'start';
    } else {
      lx = c.x - ICON / 2 - pad;
      ly = c.y + LABEL / 3;
      anchor = 'end';
    }
    parts.push(
      `<text class="el-label" x="${px(lx)}" y="${px(ly)}" font-size="${LABEL}" text-anchor="${anchor}">${name}</text>`
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
    <figure class="doc-figure elements-graph${compact ? ' compact' : ''}">
      ${curled(svg, `${W}/${H}`, W)}
      <figcaption class="graph-note">${note}</figcaption>
    </figure>`;
}

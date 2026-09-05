/**
 * The twelve hours wheel (Figma 1258:4519) — the Twelve Hours section's figure.
 *
 * The home page's hour wheel, made answerable: the reader picks the branch
 * instead of the clock. The chosen cell turns over to its animal, the ring
 * lights from 子 round to it, and the centre names the two hours it covers.
 *
 * It opens on the reader's own 时辰, so the page arrives already telling them
 * what hour it is — clicking is how they explore the other eleven.
 *
 * Geometry is the Figma frame's own 492 box: ring radius 240, cells of 54
 * riding a 194 radius. Everything is placed in percent of that box, so the
 * wheel scales with the column, and the type scales with it in container
 * units. The arcs match the home wheel's rhythm: 27.5° each, butt-capped.
 */
import { BRANCHES, BRANCH_ANIMAL } from './tables';
import { SIGN_SVG, ANIMAL_CN, ANIMAL_EN } from './zodiac';

const BOX = 492;
const C = BOX / 2;
const RING_R = 240;
const STROKE = 2.5;
const ARC_SPAN = 27.5;
const CELL_R = 194;

/** 午 (index 6) at the top; the hours run clockwise, as on the home wheel. */
const angleOf = (i: number) => (i - 6) * 30;

function polar(r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: C + r * Math.sin(rad), y: C - r * Math.cos(rad) };
}

/** 子 opens at 23:00, and every branch runs two hours from there. */
const startHour = (i: number) => (23 + i * 2) % 24;
const hour12 = (h: number) => (h % 12 === 0 ? 12 : h % 12);
const meridiem = (h: number) => (h < 12 ? 'AM' : 'PM');
const clock24 = (h: number) => `${String(h).padStart(2, '0')}:00`;

export function hourRange(i: number, lang: 'en' | 'cn'): string {
  const a = startHour(i);
  const b = (a + 2) % 24;
  if (lang === 'cn') return `${clock24(a)} – ${clock24(b)}`;
  // Both ends in the same half of the day say AM/PM once: 5 – 7 AM, not
  // 5 AM – 7 AM. Only a range that crosses noon or midnight needs both.
  return meridiem(a) === meridiem(b)
    ? `${hour12(a)} – ${hour12(b)} ${meridiem(b)}`
    : `${hour12(a)} ${meridiem(a)} – ${hour12(b)} ${meridiem(b)}`;
}

const HINT = {
  en: 'Click on Branches to see corresponding hours',
  cn: '点击地支查看对应时辰',
};

/** The reader's own 时辰 (子 = 0), so the wheel opens on the hour they are in. */
export function shichenNow(now = new Date()): number {
  return Math.floor(((now.getHours() + 1) % 24) / 2);
}

export function hoursFigure(lang: 'en' | 'cn'): string {
  // The opening state is written into the markup, not painted after: Learn's
  // body is re-rendered on navigation and on the graph breakpoint, and a
  // post-render hook would have to be threaded through every one of them.
  const now = shichenNow();
  const arcs = Array.from({ length: 12 }, (_, i) => {
    const deg = angleOf(i);
    const a = polar(RING_R, deg - ARC_SPAN / 2);
    const b = polar(RING_R, deg + ARC_SPAN / 2);
    return `<path class="h-arc${i <= now ? ' lit' : ''}" data-i="${i}" fill="none" stroke-width="${STROKE}"
        d="M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${RING_R} ${RING_R} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}" />`;
  }).join('\n      ');

  const cells = BRANCHES.map((branch, i) => {
    const p = polar(CELL_R, angleOf(i));
    const animal = lang === 'cn' ? ANIMAL_CN[i] : ANIMAL_EN[i];
    return `
        <button type="button" class="h-cell" data-i="${i}" aria-pressed="${i === now}"
          style="left:${((p.x / BOX) * 100).toFixed(3)}%;top:${((p.y / BOX) * 100).toFixed(3)}%"
          aria-label="${branch} · ${animal} · ${hourRange(i, lang)}">
          <span class="z-disc">
            <span class="z-face z-front">${branch}</span>
            <span class="z-face z-back">${SIGN_SVG[BRANCH_ANIMAL[i]]}</span>
          </span>
        </button>`;
  }).join('');

  return `
    <figure class="doc-figure hours-figure" data-lang="${lang}" data-sel="${now}">
      <div class="h-wheel">
        <svg class="h-ring" viewBox="0 0 ${BOX} ${BOX}" aria-hidden="true">
      ${arcs}
        </svg>
        ${cells}
        <p class="h-range">${hourRange(now, lang)}</p>
      </div>
      <figcaption class="z-hint">${HINT[lang]}</figcaption>
    </figure>`;
}

function select(fig: HTMLElement, i: number) {
  const lang = (fig.dataset.lang as 'en' | 'cn') ?? 'en';
  fig.dataset.sel = String(i);
  for (const cell of fig.querySelectorAll<HTMLElement>('.h-cell'))
    cell.setAttribute('aria-pressed', String(Number(cell.dataset.i) === i));
  // Lit from 子 round to the chosen hour, as the home wheel reads the day.
  for (const arc of fig.querySelectorAll<SVGPathElement>('.h-arc'))
    arc.classList.toggle('lit', Number(arc.dataset.i) <= i);

  // The range swaps outright. Fading it drew the eye to the middle, away from
  // the cell the reader just turned.
  fig.querySelector<HTMLElement>('.h-range')!.textContent = hourRange(i, lang);
}

/** Delegated, like the other Learn figures: the markup is rebuilt per render. */
export function initHours(root: HTMLElement) {
  root.addEventListener('click', (e) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('.h-cell');
    const fig = cell?.closest<HTMLElement>('.hours-figure');
    if (!cell || !fig) return;
    const i = Number(cell.dataset.i);
    if (i !== Number(fig.dataset.sel)) select(fig, i);
  });
}

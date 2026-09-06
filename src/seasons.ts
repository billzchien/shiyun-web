/**
 * The Five Elements × branches (Figma 1263:5892) — the Convergence section's
 * third figure, on the Stems & Branches card. Three steps, each a class:
 *
 *   (none)     twelve branches in two rows of six.
 *   .seasons   MAP TO SEASONS: the cells walk into four rows of three — the
 *              months of each season — and the season names come in.
 *   .elements  MAP TO ELEMENTS: each cell turns over to its element, in
 *              reading order; the season names go, having done their work.
 *
 * The back arrow steps to the previous state; START OVER turns the cells
 * back and walks them home in one move. Geometry is one table below, in the card's
 * 600 × 332 stage; the cells hang off the stage's centre.
 */
import { BRANCHES, showLabel } from './stems';
import { ELEMENT_COLOR, type Element } from './tables';
import arrowRaw from '../assets/icon/arrow-left.svg?raw';
import woodSvg from '../assets/learn/element-wood.svg?raw';
import fireSvg from '../assets/learn/element-fire.svg?raw';
import earthSvg from '../assets/learn/element-earth.svg?raw';
import metalSvg from '../assets/learn/element-metal.svg?raw';
import waterSvg from '../assets/learn/element-water.svg?raw';

const ICON: Record<Element, string> = {
  Wood: woodSvg, Fire: fireSvg, Earth: earthSvg, Metal: metalSvg, Water: waterSvg,
};

/**
 * The seasons, three branches each in calendar order — spring opens at 寅 —
 * and the element each month carries: the season's own for its first two,
 * Earth for the turning month that closes it.
 */
const SEASONS: { branches: string[]; element: Element }[] = [
  { branches: ['寅', '卯', '辰'], element: 'Wood' },
  { branches: ['巳', '午', '未'], element: 'Fire' },
  { branches: ['申', '酉', '戌'], element: 'Metal' },
  { branches: ['亥', '子', '丑'], element: 'Water' },
];

const G = {
  CELL: 64,
  PITCH: 66,
  /** Two rows of six. */
  apartRows: [94, 174],
  /** Four rows of three; each season's name sits on its row's centre line. */
  seasonRows: [4, 84, 164, 244],
  /** The names' right edge, measured from the stage's centre. */
  labelRight: -126,
};

const TEXT = {
  en: {
    title: 'Branches', back: 'Back',
    seasons: ['Spring', 'Summer', 'Fall', 'Winter'],
    map1: 'Map to seasons', map2: 'Map to elements', reset: 'Start over',
  },
  cn: {
    title: '地支', back: '返回',
    seasons: ['春', '夏', '秋', '冬'],
    map1: '对应季节', map2: '对应五行', reset: '重新开始',
  },
};

const rowLeft = (n: number) => -(n * G.PITCH - 2) / 2;

export function seasonsFigure(lang: 'en' | 'cn'): string {
  const t = TEXT[lang];
  const cells = BRANCHES.map((ch, i) => {
    const x0 = rowLeft(6) + (i % 6) * G.PITCH;
    const y0 = G.apartRows[Math.floor(i / 6)];
    const s = SEASONS.findIndex((se) => se.branches.includes(ch));
    const k = SEASONS[s].branches.indexOf(ch);
    const x1 = rowLeft(3) + k * G.PITCH;
    const y1 = G.seasonRows[s];
    const el: Element = k === 2 ? 'Earth' : SEASONS[s].element;
    // Reading order in the season grid paces the turn.
    const order = s * 3 + k;
    return `
        <span class="sb-cell se-cell" style="--x0:${x0}px;--y0:${y0}px;--x1:${x1}px;--y1:${y1}px;--k:${order};--el:${ELEMENT_COLOR[el]}">
          <span class="z-disc">
            <span class="z-face z-front sb-glyph">${ch}</span>
            <span class="z-face z-back">${ICON[el]}</span>
          </span>
        </span>`;
  }).join('');

  const labels = t.seasons
    .map((name, i) => `<p class="sb-cap se-label" style="top:${G.seasonRows[i] + G.CELL / 2}px;right:calc(50% - ${G.labelRight}px)">${name}</p>`)
    .join('');

  return `
    <figure class="doc-figure sb-figure se-figure" data-lang="${lang}">
      <div class="se-head">
        <button type="button" class="se-back" data-act="se-back" aria-label="${t.back}">${arrowRaw}</button>
        <p class="sb-cap">${t.title}</p>
      </div>
      <div class="sb-stage se-stage">${cells}${labels}</div>
      <button type="button" class="sb-toggle se-toggle" data-act="se-next">
        <span class="sb-labels"><span class="se-l-1 on">${t.map1}</span><span class="se-l-2">${t.map2}</span><span class="se-l-3">${t.reset}</span></span>
      </button>
    </figure>`;
}

function setStep(fig: HTMLElement, step: 0 | 1 | 2) {
  // Start over is one gesture: the cells turn back and walk home together,
  // and the season names never reappear on the way.
  fig.classList.toggle('seasons', step >= 1);
  fig.classList.toggle('elements', step === 2);
  showLabel(fig, ['se-l-1', 'se-l-2', 'se-l-3'][step]);
}

export function initSeasons(root: HTMLElement) {
  root.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-act^="se-"]');
    const fig = btn?.closest<HTMLElement>('.se-figure');
    if (!btn || !fig) return;
    const step = fig.classList.contains('elements') ? 2 : fig.classList.contains('seasons') ? 1 : 0;
    if (btn.dataset.act === 'se-back') setStep(fig, (Math.max(0, step - 1) as 0 | 1 | 2));
    else setStep(fig, ((step + 1) % 3) as 0 | 1 | 2);
  });
}

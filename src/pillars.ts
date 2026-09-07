/**
 * The Birth Chart's two figures (Figma 1293:198 and 1293:236), on the
 * Stems & Branches card: three people, three charts.
 *
 * FOUR PILLARS — year, month, day, hour, each a small pillar with its pair,
 * and each pillar is a WHEEL like the big one: the neighbouring signs show
 * at the edges under a fade, so switching person turns each wheel to the new
 * pair instead of swapping the characters.
 *
 * DAY MASTER — the same four, each character with its element mark, and the
 * day stem picked out in its element's color. Switching person crossfades.
 *
 * The three charts are computed here from real birth moments, by the same
 * arithmetic the app uses (see tables.ts for the day stem): year from 立春,
 * month from the solar terms, day from the epoch count, hour by 五鼠遁.
 */
import { STEMS, BRANCHES } from './stems';
import { ELEMENT_COLOR, type Element } from './tables';
import woodSvg from '../assets/learn/element-wood.svg?raw';
import fireSvg from '../assets/learn/element-fire.svg?raw';
import earthSvg from '../assets/learn/element-earth.svg?raw';
import metalSvg from '../assets/learn/element-metal.svg?raw';
import waterSvg from '../assets/learn/element-water.svg?raw';

const ICON: Record<Element, string> = {
  Wood: woodSvg, Fire: fireSvg, Earth: earthSvg, Metal: metalSvg, Water: waterSvg,
};
const STEM_EL: Element[] = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];
const BRANCH_EL: Element[] = ['Water', 'Earth', 'Wood', 'Wood', 'Earth', 'Fire', 'Fire', 'Earth', 'Metal', 'Metal', 'Earth', 'Water'];
const EL_CN: Record<Element, string> = { Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水' };

type Pair = { s: number; b: number };
type Chart = { year: Pair; month: Pair; day: Pair; hour: Pair };

/** Day of the month each solar-term month opens on, Jan → Dec (丑 … 子).
 *  Approximate to a day; the profiles below keep well clear of the edges. */
const TERM_DAY = [6, 4, 6, 5, 6, 6, 7, 8, 8, 8, 7, 7];

function chart(y: number, m: number, d: number, h: number): Chart {
  const days = Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  const ds = (((days + 7) % 10) + 10) % 10;
  const db = (((days + 5) % 12) + 12) % 12;
  // The year turns at 立春, not New Year's Day.
  const yy = m > 2 || (m === 2 && d >= TERM_DAY[1]) ? y : y - 1;
  const ys = (((yy - 4) % 10) + 10) % 10;
  const yb = (((yy - 4) % 12) + 12) % 12;
  // Months count from 寅 (opens at 立春, early February).
  const mi = d >= TERM_DAY[m - 1] ? m : m - 1;
  const k = (((mi - 2) % 12) + 12) % 12;
  const mb = (2 + k) % 12;
  const ms = ([2, 4, 6, 8, 0][ys % 5] + k) % 10; // 五虎遁
  const hb = Math.floor(((h + 1) % 24) / 2);
  const hs = ((ds % 5) * 2 + hb) % 10; // 五鼠遁
  return { year: { s: ys, b: yb }, month: { s: ms, b: mb }, day: { s: ds, b: db }, hour: { s: hs, b: hb } };
}

const HOUR_EN = ['11 PM – 1 AM', '1 – 3 AM', '3 – 5 AM', '5 – 7 AM', '7 – 9 AM', '9 – 11 AM', '11 AM – 1 PM', '1 – 3 PM', '3 – 5 PM', '5 – 7 PM', '7 – 9 PM', '9 – 11 PM'];
const MONTH_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Three birth moments, chosen so the three day masters differ: 庚 Metal,
 *  癸 Water, 丁 Fire. */
const PEOPLE = [
  { y: 1995, m: 2, d: 8, h: 5 },
  { y: 1988, m: 6, d: 17, h: 7 },
  { y: 2003, m: 10, d: 21, h: 21 },
].map((p) => ({ ...p, chart: chart(p.y, p.m, p.d, p.h) }));

const TEXT = {
  en: {
    cols: ['Year', 'Month', 'Day', 'Hour'],
    person: ['Person 1', 'Person 2', 'Person 3'],
    master: (el: Element) => `The Day Master is ${el}`,
    when: (p: (typeof PEOPLE)[0]) => [String(p.y), MONTH_EN[p.m - 1], String(p.d), HOUR_EN[p.chart.hour.b]],
  },
  cn: {
    cols: ['年', '月', '日', '时'],
    person: ['第一位', '第二位', '第三位'],
    master: (el: Element) => `日主属${EL_CN[el]}`,
    when: (p: (typeof PEOPLE)[0]) => [`${p.y}年`, `${p.m}月`, `${p.d}日`, `${BRANCHES[p.chart.hour.b]}时`],
  },
};

const KEYS = ['year', 'month', 'day', 'hour'] as const;

const buttons = (lang: 'en' | 'cn') =>
  `<div class="bc-people">${TEXT[lang].person
    .map((n, i) => `<button type="button" class="bc-person${i === 0 ? ' on' : ''}" data-act="person" data-i="${i}">${n}</button>`)
    .join('')}</div>`;

/** Every person's values written in, per column, so a switch only swaps
 *  which is `on`; the figure never rebuilds. */
const values = (lang: 'en' | 'cn', col: number) =>
  `<span class="bc-vals">${PEOPLE.map((p, i) => `<span class="bc-val${i === 0 ? ' on' : ''}" data-i="${i}">${TEXT[lang].when(p)[col]}</span>`).join('')}</span>`;

export function fourPillarsFigure(lang: 'en' | 'cn'): string {
  const t = TEXT[lang];
  const wheel = (list: readonly string[], cls: string, at: number) =>
    `<span class="bc-wheel ${cls}" style="--cur:${at}">${list.map((c, i) => `<span class="bc-char${i === at ? ' current' : ''}">${c}</span>`).join('')}</span>`;
  const cols = KEYS.map((k, i) => {
    const p0 = PEOPLE[0].chart[k];
    return `
        <div class="bc-col">
          <p class="sb-cap bc-label">${t.cols[i]}</p>
          <div class="bc-pillar">
            ${wheel(STEMS, 'bc-stems', p0.s)}
            ${wheel(BRANCHES, 'bc-branches', p0.b)}
          </div>
          <p class="sb-cap bc-when">${values(lang, i)}</p>
        </div>`;
  }).join('');
  return `
    <figure class="doc-figure sb-figure bc-figure bc-four" data-lang="${lang}" data-person="0">
      <div class="sb-stage bc-stage"><div class="bc-row">${cols}</div></div>
      ${buttons(lang)}
    </figure>`;
}

export function dayMasterFigure(lang: 'en' | 'cn'): string {
  const t = TEXT[lang];
  // One layer per person, stacked; the switch crossfades between them.
  const layers = PEOPLE.map((p, i) => {
    const dm = STEM_EL[p.chart.day.s];
    const cols = KEYS.map((k) => {
      const pr = p.chart[k];
      const isDay = k === 'day';
      const stemEl = STEM_EL[pr.s];
      const color = isDay ? `style="color:${ELEMENT_COLOR[stemEl]}"` : '';
      return `
          <div class="bc-col">
            <div class="bc-pillar bc-marked">
              <span class="bc-sign" ${color}><span class="bc-glyph">${STEMS[pr.s]}</span><span class="bc-mark">${ICON[stemEl]}</span></span>
              <span class="bc-sign"><span class="bc-glyph">${BRANCHES[pr.b]}</span><span class="bc-mark">${ICON[BRANCH_EL[pr.b]]}</span></span>
            </div>
          </div>`;
    }).join('');
    return `
        <div class="bc-layer${i === 0 ? ' on' : ''}" data-i="${i}">
          <p class="bc-master">${t.master(dm)}</p>
          <div class="bc-row">${cols}</div>
        </div>`;
  }).join('');
  const whens = `<div class="bc-row bc-whens">${KEYS.map((_, i) => `<div class="bc-col"><p class="sb-cap bc-when">${values(lang, i)}</p></div>`).join('')}</div>`;
  return `
    <figure class="doc-figure sb-figure bc-figure bc-master-fig" data-lang="${lang}" data-person="0">
      <div class="sb-stage bc-stage">${layers}${whens}</div>
      ${buttons(lang)}
    </figure>`;
}

function choose(fig: HTMLElement, i: number) {
  fig.dataset.person = String(i);
  for (const b of fig.querySelectorAll<HTMLElement>('.bc-person')) b.classList.toggle('on', Number(b.dataset.i) === i);
  for (const v of fig.querySelectorAll<HTMLElement>('.bc-val, .bc-layer')) v.classList.toggle('on', Number(v.dataset.i) === i);
  const p = PEOPLE[i].chart;
  fig.querySelectorAll<HTMLElement>('.bc-col').forEach((col, c) => {
    const pr = p[KEYS[c]];
    const turn = (cls: string, at: number) => {
      const w = col.querySelector<HTMLElement>(`.${cls}`);
      if (!w) return;
      w.style.setProperty('--cur', String(at));
      [...w.children].forEach((ch, k) => ch.classList.toggle('current', k === at));
    };
    turn('bc-stems', pr.s);
    turn('bc-branches', pr.b);
  });
}

export function initPillars(root: HTMLElement) {
  root.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-act="person"]');
    const fig = btn?.closest<HTMLElement>('.bc-figure');
    if (!btn || !fig) return;
    const i = Number(btn.dataset.i);
    if (i !== Number(fig.dataset.person)) choose(fig, i);
  });
}

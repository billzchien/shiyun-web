/**
 * Stems & Branches (Figma 1217:1934 / 1217:1990) — the one figure on Learn
 * that is played, not looked at.
 *
 * Two states. SEPARATED: the ten stems and twelve branches sit as two blocks
 * of cells with a hairline between. PAIRED: the cells have collapsed into one
 * tall pillar through which the sixty pairs scroll, one at a time, the next
 * pair peeking through a fade at the right edge.
 *
 * The handover is choreographed in three beats, each a class on the figure:
 *   .pairing  — captions slide into the middle and fade, the line shrinks to
 *               nothing, every cell travels to the centre (its own --dx/--dy,
 *               measured at click time) while its glyph fades; the pillar
 *               grows up under them.
 *   .paired   — the pillar's glyphs fade in left to right, and the side
 *               captions and the <1/60> counter come with them.
 * Separate strips them in the reverse order.
 */

export const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const PAIRS = 60;

const TEXT = {
  en: { stems: 'Stems', branches: 'Branches', pair: 'Pair up', split: 'Separate', prev: 'Previous pair', next: 'Next pair' },
  cn: { stems: '天干', branches: '地支', pair: '搭配起来', split: '分开', prev: '上一对', next: '下一对' },
};

const chevron = (dir: 'prev' | 'next') =>
  `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="${dir === 'next' ? 'M6 3.5 10.5 8 6 12.5' : 'M10 3.5 5.5 8 10 12.5'}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export function stemsFigure(lang: 'en' | 'cn'): string {
  const t = TEXT[lang];
  const cells = (list: string[]) =>
    list.map((c) => `<span class="sb-cell"><span class="sb-glyph">${c}</span></span>`).join('');
  // The pillar's two rows hold exactly the ten and the twelve. Each row slides
  // on its own wheel (--si / --bi on the figure), so when the stems run out at
  // 癸 the row rides all the way back to 甲 while the branches carry on — the
  // sixty-pair cycle shown as it actually works. --i stages the fade-in.
  const row = (list: string[]) =>
    list.map((c, i) => `<span class="sb-char" style="--i:${i}">${c}</span>`).join('');

  return `
    <figure class="doc-figure sb-figure" data-lang="${lang}" data-index="0">
      <div class="sb-stage">
        <div class="sb-split">
          <div class="sb-grid sb-stems">${cells(STEMS)}</div>
          <p class="sb-cap sb-cap-stems">${t.stems}</p>
          <div class="sb-line"></div>
          <p class="sb-cap sb-cap-branches">${t.branches}</p>
          <div class="sb-grid sb-branches">${cells(BRANCHES)}</div>
        </div>
        <div class="sb-joined">
          <div class="sb-side">
            <p class="sb-cap">${t.stems}</p>
            <p class="sb-cap">${t.branches}</p>
          </div>
          <div class="sb-pillar">
            <div class="sb-track">
              <div class="sb-row sb-row-stems">${row(STEMS)}</div>
              <div class="sb-row sb-row-branches">${row(BRANCHES)}</div>
            </div>
          </div>
          <div class="sb-counter">
            <button type="button" class="sb-step" data-act="prev" aria-label="${t.prev}">${chevron('prev')}</button>
            <span class="sb-count"><span class="sb-n">1</span> / ${PAIRS}</span>
            <button type="button" class="sb-step" data-act="next" aria-label="${t.next}">${chevron('next')}</button>
          </div>
        </div>
      </div>
      <button type="button" class="sb-toggle" data-act="toggle">
        <span class="sb-pair-label">${t.pair}</span><span class="sb-split-label">${t.split}</span>
      </button>
    </figure>`;
}

/**
 * Pacing. The beats OVERLAP rather than queue: each starts ~100ms after the
 * one before, so the whole handover reads as one gesture, not three.
 */
/** Pair up: the pillar's glyphs start fading in this far into the cells'
 *  380ms travel (--sb-travel). */
const GLYPHS_AT = 180;
/** Separate: cells start flying home this long after the glyphs start out. */
const CELLS_AT = 100;
/** Separate: captions and line come in this long after the cells set off. */
const CAPS_AT = 120;

function setIndex(fig: HTMLElement, i: number) {
  const n = Math.max(0, Math.min(PAIRS - 1, i));
  fig.dataset.index = String(n);
  const si = n % STEMS.length;
  const bi = n % BRANCHES.length;
  fig.style.setProperty('--si', String(si));
  fig.style.setProperty('--bi', String(bi));
  fig.querySelector('.sb-n')!.textContent = String(n + 1);
  const mark = (sel: string, cur: number) =>
    fig.querySelectorAll<HTMLElement>(sel).forEach((c) => c.classList.toggle('current', Number(c.style.getPropertyValue('--i')) === cur));
  mark('.sb-row-stems .sb-char', si);
  mark('.sb-row-branches .sb-char', bi);
  (fig.querySelector('[data-act="prev"]') as HTMLButtonElement).disabled = n === 0;
  (fig.querySelector('[data-act="next"]') as HTMLButtonElement).disabled = n === PAIRS - 1;
}

/** Point every cell at the pillar's centre, measured now — the column width
 *  (and so the grids' spread) differs per breakpoint. */
function aimCells(fig: HTMLElement) {
  const stage = fig.querySelector<HTMLElement>('.sb-stage')!.getBoundingClientRect();
  const cx = stage.left + stage.width / 2;
  const cy = stage.top + stage.height / 2;
  for (const cell of fig.querySelectorAll<HTMLElement>('.sb-cell')) {
    const r = cell.getBoundingClientRect();
    cell.style.setProperty('--dx', `${(cx - (r.left + r.width / 2)).toFixed(1)}px`);
    cell.style.setProperty('--dy', `${(cy - (r.top + r.height / 2)).toFixed(1)}px`);
  }
}

function toggle(fig: HTMLElement) {
  const timer = Number(fig.dataset.timer || 0);
  if (timer) window.clearTimeout(timer);
  if (fig.classList.contains('pairing')) {
    // Reverse, three beats: glyphs out; cells fly home (captions and line
    // held back); then the captions and line come in over the settled cells.
    fig.classList.remove('paired');
    fig.dataset.timer = String(
      window.setTimeout(() => {
        fig.classList.add('settling');
        fig.classList.remove('pairing');
        fig.dataset.timer = String(
          window.setTimeout(() => {
            fig.classList.remove('settling');
            fig.dataset.timer = '';
          }, CAPS_AT)
        );
      }, CELLS_AT)
    );
  } else {
    fig.classList.remove('settling');
    aimCells(fig);
    setIndex(fig, 0);
    fig.classList.add('pairing');
    fig.dataset.timer = String(
      window.setTimeout(() => {
        fig.classList.add('paired');
        fig.dataset.timer = '';
      }, GLYPHS_AT)
    );
  }
}

/** One delegated listener: the figure is re-rendered with the doc body, and
 *  lives twice (once per language), so nothing is bound to an instance. */
export function initStems(root: HTMLElement) {
  // Swipe across the pillar: one pair per gesture, whatever its length, so
  // the wheels are read one turn at a time. Vertical drags stay scrolls.
  let swipe: { fig: HTMLElement; x: number; y: number; id: number } | null = null;
  root.addEventListener('pointerdown', (e) => {
    const pillar = (e.target as HTMLElement).closest<HTMLElement>('.sb-pillar');
    const fig = pillar?.closest<HTMLElement>('.sb-figure');
    if (!fig || !fig.classList.contains('paired')) return;
    swipe = { fig, x: e.clientX, y: e.clientY, id: e.pointerId };
  });
  root.addEventListener('pointermove', (e) => {
    if (!swipe || e.pointerId !== swipe.id) return;
    const dx = e.clientX - swipe.x;
    const dy = e.clientY - swipe.y;
    if (Math.abs(dx) < 24) return;
    if (Math.abs(dy) > Math.abs(dx)) { swipe = null; return; } // a scroll
    const { fig } = swipe;
    swipe = null;
    setIndex(fig, Number(fig.dataset.index) + (dx < 0 ? 1 : -1));
  });
  const end = () => { swipe = null; };
  root.addEventListener('pointerup', end);
  root.addEventListener('pointercancel', end);

  root.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-act]');
    if (!btn) return;
    const fig = btn.closest<HTMLElement>('.sb-figure');
    if (!fig) return;
    const act = btn.dataset.act;
    if (act === 'toggle') toggle(fig);
    else if (act === 'next') setIndex(fig, Number(fig.dataset.index) + 1);
    else if (act === 'prev') setIndex(fig, Number(fig.dataset.index) - 1);
  });
}

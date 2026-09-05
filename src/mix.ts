/**
 * Yin-yang × stems & branches (Figma 1259:5107) — the Convergence section's
 * first figure, built on the Stems & Branches card.
 *
 * The same ten and twelve, but now every sign takes a charge. ADD YIN-YANG
 * plays in two beats:
 *   .tint  — the yin cells darken (every second sign), the two captions go
 *            and the hairline between the blocks grows to fill their place.
 *   .mixed — every cell travels to its new row: yang stems, yin stems, yang
 *            branches, yin branches, and the four new captions come in.
 * UNMIX strips them in reverse.
 *
 * Every cell is placed absolutely from ONE geometry table (below), with both
 * of its homes written as CSS variables, so the travel is a single transform
 * transition and the layout can be retuned by editing numbers here.
 */
import { STEMS, BRANCHES } from './stems';

/** The stage is the card's inner box: 600 × 396 (Figma Frame 32). */
const STAGE = { W: 600, H: 396 };
const CELL = 48;
const PITCH = CELL + 2;
/** Unmixed rows (y of each row's top), captions, and the hairline. */
const APART = {
  stemRows: [24, 74],
  branchRows: [262, 318],
  caps: [138, 232],
  line: { y: 168, h: 48 },
  /** The line once the captions have gone: it spans their place too. */
  lineGrown: { y: 138, h: 108 },
};
/** Mixed: four rows and a caption under each. */
const MIXED = {
  rows: [18, 112, 206, 300],
  caps: [82, 176, 270, 364],
};

const TEXT = {
  en: {
    stems: 'Stems', branches: 'Branches',
    rows: ['Yang stems', 'Yin stems', 'Yang branches', 'Yin branches'],
    add: 'Add Yin-yang', mixing: 'Mixing', unmix: 'Unmix',
  },
  cn: {
    stems: '天干', branches: '地支',
    rows: ['阳干', '阴干', '阳支', '阴支'],
    add: '加入阴阳', mixing: '融合中', unmix: '还原',
  },
};

/** Left edge of a row of n cells, measured from the stage's CENTRE — the
 *  cells hang off left:50%, so the block stays centred in a narrower column. */
const rowLeft = (n: number) => -(n * PITCH - 2) / 2;

export function mixFigure(lang: 'en' | 'cn'): string {
  const t = TEXT[lang];
  const cells: string[] = [];
  const place = (
    list: readonly string[],
    apartRows: number[],
    perRow: number,
    mixedRows: [number, number]
  ) => {
    // Odd positions are yang, even are yin — 1-based, so index 0 is yang.
    const yang = list.filter((_, i) => i % 2 === 0);
    const yin = list.filter((_, i) => i % 2 === 1);
    list.forEach((ch, i) => {
      const x0 = rowLeft(perRow) + (i % perRow) * PITCH;
      const y0 = apartRows[Math.floor(i / perRow)];
      const isYin = i % 2 === 1;
      const group = isYin ? yin : yang;
      const x1 = rowLeft(group.length) + group.indexOf(ch) * PITCH;
      const y1 = mixedRows[isYin ? 1 : 0];
      cells.push(
        `<span class="sb-cell mx-cell${isYin ? ' yin' : ''}" style="--x0:${x0}px;--y0:${y0}px;--x1:${x1}px;--y1:${y1}px"><span class="sb-glyph">${ch}</span></span>`
      );
    });
  };
  place(STEMS, APART.stemRows, 5, [MIXED.rows[0], MIXED.rows[1]]);
  place(BRANCHES, APART.branchRows, 6, [MIXED.rows[2], MIXED.rows[3]]);

  const mixedCaps = t.rows
    .map((c, i) => `<p class="sb-cap mx-cap-mixed" style="top:${MIXED.caps[i]}px">${c}</p>`)
    .join('');

  return `
    <figure class="doc-figure sb-figure mix-figure" data-lang="${lang}"
      style="--line-y:${APART.line.y}px;--line-h:${APART.line.h}px;--line-y2:${APART.lineGrown.y}px;--line-h2:${APART.lineGrown.h}px">
      <div class="sb-stage mx-stage">
        ${cells.join('')}
        <p class="sb-cap mx-cap-apart" style="top:${APART.caps[0]}px">${t.stems}</p>
        <div class="mx-line"></div>
        <p class="sb-cap mx-cap-apart" style="top:${APART.caps[1]}px">${t.branches}</p>
        ${mixedCaps}
      </div>
      <button type="button" class="sb-toggle mx-toggle" data-act="mix">
        <span class="sb-labels"><span class="mx-l-add">${t.add}</span><span class="mx-l-mixing">${t.mixing}</span><span class="mx-l-unmix">${t.unmix}</span></span>
      </button>
    </figure>`;
}

/** The tint beat runs this long before the cells set off. */
const TINT = 420;
/** Unmix: the cells are home this long after they set off; then the tint lifts. */
const TRAVEL = 560;

function toggle(fig: HTMLElement) {
  const timer = Number(fig.dataset.timer || 0);
  if (timer) window.clearTimeout(timer);
  const btn = fig.querySelector<HTMLButtonElement>('.mx-toggle')!;
  if (fig.classList.contains('tint')) {
    fig.classList.remove('mixed');
    fig.classList.add('mixing');
    btn.disabled = true;
    fig.dataset.timer = String(
      window.setTimeout(() => {
        fig.classList.remove('tint', 'mixing');
        btn.disabled = false;
        fig.dataset.timer = '';
      }, TRAVEL)
    );
  } else {
    fig.classList.add('tint', 'mixing');
    btn.disabled = true;
    fig.dataset.timer = String(
      window.setTimeout(() => {
        fig.classList.add('mixed');
        fig.classList.remove('mixing');
        btn.disabled = false;
        fig.dataset.timer = '';
      }, TINT)
    );
  }
}

export function initMix(root: HTMLElement) {
  root.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-act="mix"]');
    const fig = btn?.closest<HTMLElement>('.mix-figure');
    if (fig) toggle(fig);
  });
}

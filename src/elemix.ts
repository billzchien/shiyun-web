/**
 * The Five Elements × stems (Figma 1263:5653) — the Convergence section's
 * second figure, on the Stems & Branches card.
 *
 * The ten stems, already sorted yang and yin, and MIX ELEMENTS turns each one
 * over to the element it carries, in that element's own color: 甲乙 Wood,
 * 丙丁 Fire, 戊己 Earth, 庚辛 Metal, 壬癸 Water — so each row reads Wood, Fire,
 * Earth, Metal, Water across. The turn is the zodiac cells' (see zodiac.ts),
 * running left to right. UNMIX turns them back.
 *
 * Geometry is one table below, in the card's 600 × 396 stage.
 */
import { STEMS, showLabel } from './stems';
import { ELEMENT_COLOR, type Element } from './tables';
import woodSvg from '../assets/learn/element-wood.svg?raw';
import fireSvg from '../assets/learn/element-fire.svg?raw';
import earthSvg from '../assets/learn/element-earth.svg?raw';
import metalSvg from '../assets/learn/element-metal.svg?raw';
import waterSvg from '../assets/learn/element-water.svg?raw';

const ICON: Record<Element, string> = {
  Wood: woodSvg, Fire: fireSvg, Earth: earthSvg, Metal: metalSvg, Water: waterSvg,
};
/** 甲→癸, two stems to an element down the list. */
const STEM_ELEMENT: Element[] = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];

/** Rows of 64-cells at 66 pitch; each row's caption sits 80 below its top.
 *  Two rows need less card than four, so this one stands 420 tall (see
 *  .ex-figure): a 276 stage, the rows at 20 and 162. */
const G = { CELL: 64, PITCH: 66, rows: [20, 162], capOffset: 80 };

const TEXT = {
  en: { rows: ['Yang stems', 'Yin stems'], mix: 'Mix elements', unmix: 'Unmix' },
  cn: { rows: ['阳干', '阴干'], mix: '融入五行', unmix: '还原' },
};

export function elemixFigure(lang: 'en' | 'cn'): string {
  const t = TEXT[lang];
  const row = (which: 0 | 1) => {
    // Yang stems sit at the odd (1-based) positions: index 0, 2, 4…
    const cells = STEMS.map((ch, i) => ({ ch, i })).filter(({ i }) => i % 2 === which);
    const items = cells
      .map(
        ({ ch, i }, k) => `
          <span class="sb-cell ex-cell${which ? ' yin' : ''}" style="--k:${k};--el:${ELEMENT_COLOR[STEM_ELEMENT[i]]}">
            <span class="z-disc">
              <span class="z-face z-front sb-glyph">${ch}</span>
              <span class="z-face z-back">${ICON[STEM_ELEMENT[i]]}</span>
            </span>
          </span>`
      )
      .join('');
    return `
        <div class="ex-row" style="top:${G.rows[which]}px">
          <div class="ex-cells">${items}</div>
          <p class="sb-cap ex-cap" style="top:${G.capOffset}px">${t.rows[which]}</p>
        </div>`;
  };

  return `
    <figure class="doc-figure sb-figure ex-figure" data-lang="${lang}">
      <div class="sb-stage ex-stage">${row(0)}${row(1)}</div>
      <button type="button" class="sb-toggle ex-toggle" data-act="elemix" aria-pressed="false">
        <span class="sb-labels"><span class="ex-l-mix on">${t.mix}</span><span class="ex-l-unmix">${t.unmix}</span></span>
      </button>
    </figure>`;
}

export function initElemix(root: HTMLElement) {
  root.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-act="elemix"]');
    const fig = btn?.closest<HTMLElement>('.ex-figure');
    if (!btn || !fig) return;
    const on = fig.classList.toggle('mixed');
    btn.setAttribute('aria-pressed', String(on));
    showLabel(fig, on ? 'ex-l-unmix' : 'ex-l-mix');
  });
}

/**
 * The twenty-four solar terms (Figma 1317:3179) — the Solar Terms section's
 * figure: the app's own term badges, four rows of six, one season a row,
 * spring first. Inlined rather than linked so each badge is type-sized by
 * the grid and takes the page's ink.
 */
const RAW = import.meta.glob('../assets/learn/terms/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** Calendar order, 立春 first: six to a season. */
const ORDER = [
  'lichun', 'yushui', 'jingzhe', 'chunfen', 'qingming', 'guyu',
  'lixia', 'xiaoman', 'mangzhong', 'xiazhi', 'xiaoshu', 'dashu',
  'liqiu', 'chushu', 'bailu', 'qiufen', 'hanlu', 'shuangjiang',
  'lidong', 'xiaoxue', 'daxue', 'dongzhi', 'xiaohan', 'dahan',
];

const badge = (key: string) => {
  const raw = RAW[`../assets/learn/terms/${key}.svg`];
  if (!raw) throw new Error(`solar term badge missing: ${key}`);
  // Every badge ships the same clip id; inlined side by side they would all
  // resolve to the first one's outline, so each gets its own.
  return raw.replace(/bgClip/g, `bgClip-${key}`);
};

/**
 * The pop's rhythm: six quick beats to a season, a breath between seasons —
 * pa-pa-pa-pa-pa-pa · pa-pa-pa-pa-pa-pa · … Each badge carries its own delay.
 */
const BEAT = 70;
const BREATH = 400;
const delay = (i: number) => Math.floor(i / 6) * (6 * BEAT + BREATH) + (i % 6) * BEAT;

export function termsFigure(): string {
  return `
    <figure class="doc-figure terms-figure">
      <div class="terms-grid">${ORDER.map((k, i) => `<span class="term" style="--d:${delay(i)}ms">${badge(k)}</span>`).join('')}</div>
    </figure>`;
}

/**
 * The badges pop in as the figure is scrolled to, and reset when it is left,
 * so the rhythm plays again on the way back. Runs after every render of the
 * doc body (see writeDoc in main.ts) and arms each figure once.
 */
export function mountTerms(root: HTMLElement) {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  for (const fig of root.querySelectorAll<HTMLElement>('.terms-figure:not([data-armed])')) {
    fig.dataset.armed = '1';
    if (still.matches) {
      fig.classList.add('in');
      continue;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.classList.toggle('in', e.isIntersecting);
      },
      { threshold: 0.3 }
    );
    io.observe(fig);
  }
}

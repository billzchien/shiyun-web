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

export function termsFigure(): string {
  return `
    <figure class="doc-figure terms-figure">
      <div class="terms-grid">${ORDER.map((k) => `<span class="term">${badge(k)}</span>`).join('')}</div>
    </figure>`;
}

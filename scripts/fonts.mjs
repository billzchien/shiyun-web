/**
 * Keep the CJK subset honest.
 *
 * OPPO Sans is 22MB whole (13MB even as woff2) because Chinese has ~21,000
 * glyphs. The site ships only the glyphs its own copy uses — a few hundred —
 * which is why the entire page weighs less than a photograph. The catch is
 * that a subset is only as current as the copy it was cut from: write a
 * sentence containing a character the site has never used and that character
 * has no glyph. Nothing throws; it renders as a fallback or a tofu box, and
 * both the build and the deploy still report success.
 *
 * So this runs on every build:
 *   · Source font present (a dev machine, where the app repo lives) → RE-CUT
 *     from today's copy, so the committed woff2 can never fall behind it.
 *   · Source font absent (CI) → VERIFY the committed woff2 covers the copy and
 *     FAIL, naming the characters, if it does not.
 *
 * Coverage is recorded next to the font rather than read back out of the
 * woff2: both files are written here, together, so they cannot disagree.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import subsetFont from 'subset-font';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
/** The variable original — it lives with the app, not with the site. */
const SOURCE = '/Users/billchien/Documents/Apps/Shiyun/assets/fonts/OPPOSans-Variable.ttf';
const OUT = path.join(root, 'src/fonts/oppo-sans-vf.woff2');
const MANIFEST = path.join(root, 'src/fonts/oppo-sans-vf.coverage.json');

/** Latin, digits and punctuation: cheap, fixed, and always wanted. */
const BASE =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ' +
  '.,:;!?()[]{}/\\|+=<>*%&@#$^~`_-\'"' +
  '—–…‘’“”·、。，！？：；（）〈〉《》「」『』【】';

/** Anything the wheel or the UI draws from code rather than from copy. */
const ALWAYS = '子丑寅卯辰巳午未申酉戌亥下载浏览隐私承诺时运即将上线关闭播放暂停静音全屏';

/** Every file that can put words on the screen. */
async function siteText() {
  const files = [path.join(root, 'index.html')];
  for (const f of await readdir(path.join(root, 'src'))) {
    if (f.endsWith('.ts')) files.push(path.join(root, 'src', f));
  }
  const parts = await Promise.all(files.map((f) => readFile(f, 'utf8')));
  return parts.join('');
}

/** The glyphs that cost real bytes: CJK, kana, and their punctuation. */
const isExpensive = (ch) => ch.codePointAt(0) > 0x2e7f;

const wanted = new Set([...(await siteText()), ...ALWAYS].filter(isExpensive));
const sorted = [...wanted].sort();

if (existsSync(SOURCE)) {
  const buf = await subsetFont(await readFile(SOURCE), BASE + sorted.join(''), {
    targetFormat: 'woff2',
  });
  await writeFile(OUT, buf);
  await writeFile(MANIFEST, JSON.stringify({ cjk: sorted.join('') }) + '\n');
  console.log(
    `fonts: re-cut from source — ${sorted.length} CJK glyphs, ${(buf.length / 1024).toFixed(0)}KB`
  );
} else {
  console.log('fonts: source not on this machine (CI) — verifying the committed subset');
}

const covered = new Set([...JSON.parse(await readFile(MANIFEST, 'utf8')).cjk]);
const missing = sorted.filter((c) => !covered.has(c));
if (missing.length) {
  console.error(
    `\nfonts: the shipped subset is missing ${missing.length} character(s): ${missing.join('')}\n` +
      `They would render as tofu. Run \`npm run fonts\` on a machine that has\n` +
      `${SOURCE}\nand commit src/fonts/.\n`
  );
  process.exit(1);
}
console.log(`fonts: subset covers all ${sorted.length} CJK characters in the copy`);

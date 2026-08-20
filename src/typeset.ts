/**
 * NO ORPHANS — the app's typesetting rule (theme/typeset.ts), same numbers:
 * a paragraph's last line is never a lone word or a lone character. Latin glues
 * the last two words with U+00A0 (unless the last word is 9+ chars — enough ink
 * to stand as a line); CJK glues the last two glyphs with zero-width U+2060.
 * Trailing punctuation rides along by the browser's own line-break rules.
 */

// As escapes on purpose (same as the app): literal glyphs are invisible in
// the source, and an NBSP retyped as a plain space silently disables the rule.
const NBSP = '\u00a0';
const WORD_JOINER = '\u2060';

const CJK = /[㐀-鿿豈-﫿぀-ヿ]/;
const TAIL_PUNCT = /[。！？、，；：）】」』.,!?;:)\]'"“”‘’]+$/;

function bindTail(paragraph: string): string {
  const punct = paragraph.match(TAIL_PUNCT)?.[0] ?? '';
  const core = punct ? paragraph.slice(0, -punct.length) : paragraph;
  if (core.length < 2) return paragraph;

  if (CJK.test(core[core.length - 1])) {
    return core.slice(0, -1) + WORD_JOINER + core.slice(-1) + punct;
  }

  const lastSpace = core.lastIndexOf(' ');
  if (lastSpace <= 0) return paragraph;
  if (core.length - (lastSpace + 1) >= 9) return paragraph;
  return core.slice(0, lastSpace) + NBSP + core.slice(lastSpace + 1) + punct;
}

export function noWidow(text: string): string {
  return text.split('\n').map(bindTail).join('\n');
}

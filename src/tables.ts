/**
 * The slice of the app's core/tables.ts the site needs: the twelve branches,
 * their elements (本气) and zodiac animals, plus the element accent colors
 * (light-mode values from theme/tokens.ts — the site is light-only).
 */

export const BRANCHES = [
  '子', '丑', '寅', '卯', '辰', '巳',
  '午', '未', '申', '酉', '戌', '亥',
] as const;

export type Element = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

/** 天干五行, 甲→癸 (core/tables.ts STEM_ELEMENT as an indexed list). */
const STEM_ELEMENT: Element[] = [
  'Wood', 'Wood', 'Fire', 'Fire', 'Earth',
  'Earth', 'Metal', 'Metal', 'Water', 'Water',
];

/**
 * The hour's element — the HOUR PILLAR'S STEM element (时干五行), exactly as
 * the app colors its Hour tab (core/pillars.ts): the hour stem comes from the
 * day stem by 五鼠遁 (起始时干索引 = 日干索引 % 5 × 2), so the same 时辰 wears
 * a different element on different days. NOT the branch's 本气.
 *
 * The day stem is pure sexagenary arithmetic on the local calendar date:
 * stem index = (days since 1970-01-01 + 7) % 10 — validated against the app's
 * lunar-javascript output for 1999–2030 (2026-08-15 辛 → 酉时 丁 Fire).
 */
export function hourElement(date: Date, shichen: number): Element {
  const epochDays = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000
  );
  const dayStemIndex = (((epochDays + 7) % 10) + 10) % 10;
  const hourStemIndex = ((dayStemIndex % 5) * 2 + shichen) % 10;
  return STEM_ELEMENT[hourStemIndex];
}

export const BRANCH_ANIMAL = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig',
] as const;

export const ELEMENT_COLOR: Record<Element, string> = {
  Wood: '#23680c',
  Fire: '#cb2308',
  Earth: '#692d25',
  Metal: '#866132',
  Water: '#001f90',
};

/** Current 时辰 index (子=0 … 亥=11): 23:00–00:59 is 子, and so on. */
export function shichenOf(date: Date): number {
  return Math.floor(((date.getHours() + 1) % 24) / 2);
}

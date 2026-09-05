/**
 * The lunisolar Venn (Figma 1262:5632) — the Chinese Calendar section's figure.
 *
 * Two circles, sun and moon, and the calendar itself is what they share. The
 * paragraph's whole argument is that "lunar calendar" is the wrong name, so
 * the drawing plays that argument out: the two calendars arrive apart, slide
 * together until they overlap, and only then does the Chinese calendar appear
 * in the lens they have made.
 *
 * GEOMETRY lives in one block below. Everything else is derived, so the
 * drawing can be resized by changing these numbers alone.
 */
import sunRaw from '../assets/learn/sun.svg?raw';
import moonRaw from '../assets/learn/moon.svg?raw';
import stampRaw from '../assets/learn/chinese-cal.svg?raw';

const G = {
  /** The drawing's own box; the figure scales to its column from here. */
  W: 600,
  H: 346,
  /** Each calendar's circle. */
  R: 172.5,
  /** How far apart the two centres sit once they have come together. */
  GAP: 151,
  /** How much further apart they START, before the drawing plays. */
  SPREAD: 100,
  /** The labels' text sits on this line; icons stack above it. */
  TEXT_Y: 181.5,
  /** Air between an icon and its label. */
  ICON_GAP: 12,
  /** Icon sizes: the two calendars, and the stamp in the middle. */
  SIDE_ICON: 24,
  STAMP: 40,
  /** Where each side's marker sits, measured from the drawing's centre. */
  MARKER_X: 166.5,
};

const CY = G.H / 2 + 0.5;
const CX_A = G.W / 2 - G.GAP / 2;
const CX_B = G.W / 2 + G.GAP / 2;

const pc = (n: number, of: number) => `${((n / of) * 100).toFixed(3)}%`;
/**
 * A length from the drawing's own units, as a share of the STAGE's width.
 * The markers are absolutely positioned inside themselves, so a plain % would
 * resolve against the label's box instead of the drawing — cqw always means
 * the stage (see .cal-stage's container-type).
 */
const cq = (n: number) => `${((n / G.W) * 100).toFixed(3)}cqw`;

/**
 * The three marks, drawn to take the page's ink: the assets are authored in
 * flat black (and the stamp in the brand's near-black, with cream cutouts),
 * so their fills are re-pointed at currentColor and at the page ground. The
 * cutouts must follow the PAGE, not the lens they sit on — the stamp lands on
 * the tinted overlap, and a hard cream would read as a hole in it.
 */
const ink = (raw: string) =>
  raw
    .replace(/fill="(black|#000000|#000|#120A01|#120a01)"/gi, 'fill="currentColor"')
    .replace(/fill="(white|#ffffff|#fff|#fffcf9)"/gi, 'fill="var(--bg)"');

const SUN = ink(sunRaw);
const MOON = ink(moonRaw);
const stamp = ink(stampRaw);

const TEXT = {
  en: { solar: 'Solar Calendar', lunar: 'Lunar Calendar', both: 'Chinese Calendar' },
  cn: { solar: '阳历', lunar: '阴历', both: '中国历法' },
};

export function calendarFigure(lang: 'en' | 'cn'): string {
  const t = TEXT[lang];
  const marker = (cls: string, x: number, size: number, icon: string, label: string) => `
        <div class="cal-marker ${cls}" style="left:${pc(x, G.W)};top:${pc(G.TEXT_Y, G.H)}">
          <span class="cal-icon" style="width:${cq(size)};bottom:calc(100% + ${cq(G.ICON_GAP)})">${icon}</span>
          <span class="cal-label">${label}</span>
        </div>`;

  return `
    <figure class="doc-figure cal-figure"
      style="--spread:${G.SPREAD}px;--spread-m:${cq(G.SPREAD)}">
      <div class="cal-stage" style="aspect-ratio:${G.W}/${G.H}">
        <svg class="cal-svg" viewBox="0 0 ${G.W} ${G.H}" aria-hidden="true">
          <defs>
            <clipPath id="cal-clip">
              <circle class="cal-side cal-a" cx="${CX_A}" cy="${CY}" r="${G.R}" />
            </clipPath>
          </defs>
          <!-- The lens is the second circle seen through the first, so it is
               re-cut on every frame while the two are still travelling. -->
          <circle class="cal-lens cal-side cal-b" cx="${CX_B}" cy="${CY}" r="${G.R}" clip-path="url(#cal-clip)" />
          <circle class="cal-ring cal-side cal-a" cx="${CX_A}" cy="${CY}" r="${G.R}" />
          <circle class="cal-ring cal-side cal-b" cx="${CX_B}" cy="${CY}" r="${G.R}" />
        </svg>
        ${marker('cal-side cal-a', G.W / 2 - G.MARKER_X, G.SIDE_ICON, SUN, t.solar)}
        ${marker('cal-side cal-b', G.W / 2 + G.MARKER_X, G.SIDE_ICON, MOON, t.lunar)}
        ${marker('cal-both', G.W / 2, G.STAMP, stamp, t.both)}
      </div>
    </figure>`;
}

/**
 * The drawing plays whenever it is scrolled to, and comes apart again when it
 * is left — so it is never found already finished, and a reader who scrolls
 * back sees the two calendars meet a second time.
 *
 * Learn's body is rebuilt on navigation and on the graph breakpoint, so this
 * runs after every render and skips figures it has already armed.
 */
export function mountCalendar(root: HTMLElement) {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  for (const fig of root.querySelectorAll<HTMLElement>('.cal-figure:not([data-armed])')) {
    fig.dataset.armed = '1';
    if (still.matches) {
      fig.classList.add('in');
      continue;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.classList.toggle('in', e.isIntersecting);
      },
      // A third of the way in: the drawing should start as the reader reaches
      // it, not while it is still a sliver at the edge of the window. The same
      // line takes it apart on the way back out.
      { threshold: 0.34 }
    );
    io.observe(fig);
  }
}

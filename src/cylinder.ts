/**
 * CYLINDER FOCUS — the long-form body reads as if it were wrapped around a
 * horizontal cylinder turning under the viewport.
 *
 * You are INSIDE the cylinder, not looking at one. The band across the middle
 * is the far wall: flat, sharp, unaltered. Above and below, the wall wraps
 * around towards you — so each block tips on its own X axis AND rides forward
 * in Z, which perspective renders as spreading outward to both sides. Two
 * fixed gradient stacks add the depth of field, blurring whatever has curved
 * past the band.
 *
 * Costs nothing per frame but style writes: every block's document position is
 * measured ONCE (re-measured on resize/content change), so scrolling never
 * reads layout back.
 */

/** Tilt at the very edge of the band. Sign = the far edge flares outward. */
const MAX_ANGLE = 16;
/** How far the wrapping edge rides TOWARDS the viewer (inside of the tube). */
const MAX_DEPTH = 40;
/**
 * Scroll left in a direction, below which that edge's curl and blur ease off.
 * At the very top and the very bottom nothing has curled away yet — and those
 * are exactly the lines the reader is meant to read, so nothing veils them.
 */
const EDGE_RAMP = 220;
const PERSPECTIVE = 900;
/** Below this tilt a block is left untransformed, so the middle stays crisp. */
const FLAT_DEG = 0.2;

type Block = { el: HTMLElement; top: number; half: number; applied: boolean };

export function initCylinder(docBody: HTMLElement) {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  /**
   * Phones sit this one out. Their viewport is short enough that the curl
   * eats the reading band it is meant to frame, and the transform work is
   * the least welcome there.
   */
  const phone = window.matchMedia('(max-width: 767px)');

  const dofTop = document.createElement('div');
  dofTop.className = 'dof dof-top';
  const dofBottom = document.createElement('div');
  dofBottom.className = 'dof dof-bottom';
  // Three ramps each: progressively stronger blur over progressively tighter
  // masks, which is how CSS fakes a continuous focus falloff.
  for (const host of [dofTop, dofBottom]) {
    for (let i = 0; i < 3; i++) host.appendChild(document.createElement('span'));
    document.body.appendChild(host);
  }

  let blocks: Block[] = [];
  let active = false;
  let queued = false;
  /** What the route asked for, independent of whether it is currently allowed. */
  let wanted = false;

  function measure() {
    if (!active) return;
    /**
     * Measured RELATIVE TO `.doc`, not to the viewport. Entering a doc page
     * slides that container on a transform, and a viewport-space read during
     * the slide reports every block far below the fold — they get skipped,
     * and the curl only lands on a later beat, which is what made the text
     * spread AFTER it had already arrived. A relative read cancels the
     * translate, so the geometry is right from the first frame.
     */
    const host = docBody.closest<HTMLElement>('.doc') ?? docBody;
    const hostTop = host.getBoundingClientRect().top;
    const hostDocTop = host.offsetTop;
    blocks = [...docBody.querySelectorAll<HTMLElement>(
      '.doc-title, .doc-en > *, .doc-cn > *, .doc-updated, .doc-soon'
    )].map((el) => {
      el.style.transform = '';
      const r = el.getBoundingClientRect();
      return { el, top: r.top - hostTop + hostDocTop, half: r.height / 2, applied: false };
    });
    paint();
  }

  function paint() {
    if (!active) return;
    const chrome = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--subnav-bottom')
    ) || 0;
    const bandTop = chrome;
    const bandBottom = window.innerHeight;
    const centre = (bandTop + bandBottom) / 2;
    const reach = (bandBottom - bandTop) / 2;
    const y = window.scrollY;

    // How much scroll is left in each direction, 0–1. A page with nothing to
    // scroll gets no effect at all, which is the honest answer.
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const upF = Math.max(0, Math.min(1, y / EDGE_RAMP));
    const downF = Math.max(0, Math.min(1, (maxY - y) / EDGE_RAMP));
    const root = document.documentElement.style;
    root.setProperty('--dof-top-o', upF.toFixed(3));
    root.setProperty('--dof-bottom-o', downF.toFixed(3));

    for (const b of blocks) {
      const mid = b.top + b.half - y;
      // Off-screen blocks keep whatever they had; clearing them costs writes
      // and nobody can see the difference.
      if (mid < bandTop - 600 || mid > bandBottom + 600) continue;

      let d = (mid - centre) / reach;
      d = Math.max(-1, Math.min(1, d));
      // Squared falloff: the facing band stays flat, the curl gathers pace
      // only as the surface turns away.
      /**
       * CUBIC falloff, not quadratic. What makes this effect dizzying is how
       * much text is deforming at once, so the reading band is held flat far
       * longer and the whole curl is packed into the last stretch: at half a
       * screen out the tilt is an eighth of full, not a quarter.
       */
      const eased = d * d * d;
      // Each half answers to its own scroll headroom.
      const angle = MAX_ANGLE * eased * (d < 0 ? upF : downF);

      if (Math.abs(angle) < FLAT_DEG) {
        if (b.applied) {
          b.el.style.transform = '';
          b.applied = false;
        }
        continue;
      }
      const z = MAX_DEPTH * Math.abs(eased) * (d < 0 ? upF : downF);
      b.el.style.transform =
        `perspective(${PERSPECTIVE}px) translateZ(${z.toFixed(1)}px) rotateX(${angle.toFixed(2)}deg)`;
      b.applied = true;
    }
  }

  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      paint();
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure);
  phone.addEventListener('change', () => {
    if (phone.matches) disable(true);
    else if (wanted) enable();
  });
  still.addEventListener('change', () => (still.matches ? disable() : void 0));

  /** Idempotent on purpose: a doc→doc swap re-enters here with new markup, so
   *  every call re-measures rather than trusting blocks that no longer exist. */
  function enable() {
    wanted = true;
    if (still.matches || phone.matches) return;
    active = true;
    document.body.classList.add('cyl');
    /**
     * Measure on a few beats, not once. Entering slides `.doc` on a transform
     * (so early rects lie), a doc→doc swap only writes the new markup 150ms
     * in, and webfonts reflow the whole column when they land.
     */
    // Hold the column back for one frame so it is never seen flat: measure,
    // paint the curl, and only then fade the text in.
    docBody.style.opacity = '0';
    measure();
    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      docBody.style.opacity = '1';
    };
    requestAnimationFrame(reveal);
    window.setTimeout(reveal, 120); // rAF never fires on a hidden tab
    for (const t of [200, 560]) window.setTimeout(measure, t);
    document.fonts?.ready.then(measure);
  }

  function disable(keepIntent = false) {
    if (!keepIntent) wanted = false;
    if (!active) return;
    docBody.style.opacity = '';
    active = false;
    document.body.classList.remove('cyl');
    for (const b of blocks) b.el.style.transform = '';
    blocks = [];
  }

  return { enable, disable, measure };
}

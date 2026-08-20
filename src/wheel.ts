/**
 * The hour wheel — the app's HourWheel reduced to its still form: twelve arc
 * segments (no arrows), twelve branch characters, the current hour's animal in
 * the centre, and a live clock where the app shows the tier tag.
 *
 * Geometry mirrors the Figma desktop frame (562 box): ring radius 279.5 with a
 * 3-wide butt-capped stroke (read off the exported ring SVG, not the bbox),
 * each arc spanning 27.5° centred on its hour; characters ride a 246 radius.
 * Everything is drawn in that 562 viewBox / percent space so the wheel scales
 * with its container.
 */
import { BRANCHES, BRANCH_ANIMAL, ELEMENT_COLOR, hourElement, shichenOf } from './tables';

const BOX = 562;
const C = 281;
const RING_R = 279.5;
const STROKE = 3;
const ARC_SPAN = 27.5;
const CHAR_R = 246;

/** 午 (index 6) at the top; hours run clockwise. Degrees from 12 o'clock. */
const angleOf = (i: number) => (i - 6) * 30;

function polar(r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: C + r * Math.sin(rad), y: C - r * Math.cos(rad) };
}

const signCache = new Map<string, Promise<string>>();
function fetchSign(animal: string): Promise<string> {
  let p = signCache.get(animal);
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}assets/sign/${animal}.svg`).then((r) => {
      if (!r.ok) throw new Error(`sign ${animal}: ${r.status}`);
      return r.text();
    });
    // A failed fetch must not poison the cache — the hour rollover retries.
    p.catch(() => signCache.delete(animal));
    signCache.set(animal, p);
  }
  return p;
}

export class HourWheel {
  private arcs: SVGPathElement[] = [];
  private chars: HTMLElement[] = [];
  private sign: HTMLElement;
  private timeEl: HTMLElement;
  private cityEl: HTMLElement;
  private shownAnimal = '';
  private shownShichen = -1;
  private shownAccent = '';

  constructor(private root: HTMLElement) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${BOX} ${BOX}`);
    svg.classList.add('ring');
    for (let i = 0; i < 12; i++) {
      const deg = angleOf(i);
      const a = polar(RING_R, deg - ARC_SPAN / 2);
      const b = polar(RING_R, deg + ARC_SPAN / 2);
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${a.x} ${a.y} A ${RING_R} ${RING_R} 0 0 1 ${b.x} ${b.y}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-width', String(STROKE));
      path.classList.add('arc');
      svg.appendChild(path);
      this.arcs.push(path);
    }
    root.appendChild(svg);

    this.sign = document.createElement('div');
    this.sign.className = 'sign';
    root.appendChild(this.sign);

    const clock = document.createElement('div');
    clock.className = 'clock';
    this.timeEl = document.createElement('div');
    this.timeEl.className = 'time en';
    this.cityEl = document.createElement('div');
    this.cityEl.className = 'city en';
    clock.append(this.timeEl, this.cityEl);
    root.appendChild(clock);

    for (let i = 0; i < 12; i++) {
      const p = polar(CHAR_R, angleOf(i));
      const el = document.createElement('div');
      el.className = 'hchar';
      el.textContent = BRANCHES[i];
      el.style.left = `${(p.x / BOX) * 100}%`;
      el.style.top = `${(p.y / BOX) * 100}%`;
      root.appendChild(el);
      this.chars.push(el);
    }

    this.cityEl.textContent = cityFromTimezone();
    this.update(new Date());
  }

  /** Re-reads the clock; re-paints the ring/animal only when the 时辰 turns. */
  update(now: Date) {
    this.timeEl.textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Keyed on hour AND color (子时 straddles midnight, where the day stem —
    // and with it the element — turns over while the 时辰 does not) AND the
    // animal, so a failed artwork fetch keeps retrying on later ticks.
    const shichen = shichenOf(now);
    const accent = ELEMENT_COLOR[hourElement(now, shichen)];
    const animal = BRANCH_ANIMAL[shichen];
    if (shichen === this.shownShichen && accent === this.shownAccent && animal === this.shownAnimal)
      return;
    this.shownShichen = shichen;
    this.shownAccent = accent;

    document.documentElement.style.setProperty('--accent', accent);

    // Color tells time, as on the app's live Hour tab: arcs from 子 up to the
    // current hour wear the accent, the hours ahead stay muted.
    this.arcs.forEach((arc, i) => arc.classList.toggle('lit', i <= shichen));
    this.chars.forEach((el, i) => el.classList.toggle('active', i === shichen));

    if (animal !== this.shownAnimal) {
      this.shownAnimal = animal;
      fetchSign(animal)
        .then((svgText) => {
          if (this.shownAnimal === animal) this.sign.innerHTML = svgText;
        })
        .catch(() => {
          // Couldn't load: forget we tried, so the next tick retries.
          if (this.shownAnimal === animal) this.shownAnimal = '';
        });
    }
  }
}

/**
 * The clock's place label: the representative city of the visitor's timezone
 * (America/New_York → "New York"). Read locally — nothing leaves the device.
 */
function cityFromTimezone(): string {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
  const city = tz.split('/').pop() ?? '';
  return city.replace(/_/g, ' ') || 'Local time';
}

/**
 * Boot + the home ⇄ doc choreography.
 *
 * The Links row is ONE element with two slots: footer (home) and subnav (doc).
 * Entering a doc page runs the app's phased handoff: the wheel, CTAs and
 * logotype clear first (fade, 300ms), then the row rides up to snap under the
 * header (travel, 400ms expressive) with the page content sliding up on the
 * same clock, and the subnav chrome (hairline + caret) resolves last.
 */
import './style.css';
import { HourWheel } from './wheel';
import { initPreview } from './preview';
import { initGetApp } from './getapp';
import { initCylinder } from './cylinder';
import { aboutSections, creditLinks, learnIntro, learnSections, navLabels, privacyCn, privacyEn, privacyUpdated, privacyUpdatedCn, supportFaq, taijiCaption, type AboutBlock, type LearnBlock } from './content';
import { curled, elementsGraph } from './learn';
import { initStems, stemsFigure } from './stems';
import { noWidow } from './typeset';

type Route = 'home' | 'about' | 'learn' | 'support' | 'privacy';

const TRAVEL = 400;
const FADE = 300;

const body = document.body;
const links = document.getElementById('links')!;
const doc = document.getElementById('doc')!;
const docBody = document.getElementById('docBody')!;
const caret = document.getElementById('caret')!;
const subnavRule = document.getElementById('subnavRule')!;

/** Not on the App Store yet. Flip to true when the link lands: restores the
 *  header pill, the QR flow, and the preview overlay's Get app — and turns
 *  the home CTA back into 下载 Get app (see body.app-soon in style.css). */
const APP_LIVE = false;

const wheelEl = document.getElementById('wheel')!;
const wheel = new HourWheel(wheelEl);
setInterval(() => wheel.update(new Date()), 1000);

const getAppCta = document.querySelector<HTMLElement>('.cta.getapp')!;
let openGetApp = () => {};
if (APP_LIVE) {
  openGetApp = initGetApp(getAppCta, wheelEl).open;
} else {
  body.classList.add('app-soon');
  getAppCta.innerHTML = '<span class="cn">即将上架</span><span class="en">Soon</span>';
  getAppCta.setAttribute('aria-disabled', 'true');
}
initPreview(document.querySelector<HTMLElement>('.cta.preview')!, wheelEl, openGetApp);

// The doc pages' header pill: come home, then raise the QR.
document.getElementById('getAppPill')!.addEventListener('click', (e) => {
  e.preventDefault();
  if (current !== 'home') navigate('home', true);
  openGetApp();
});

// ─── Doc content ─────────────────────────────────────────────────────────────

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
// The contact email is the one island of selectable text on the site.
const set = (s: string) =>
  esc(noWidow(s)).replace(
    /hello@myshiyun\.com/g,
    '<span class="selectable">hello@myshiyun.com</span>'
  );
const paras = (list: string[]) => list.map((p) => `<p>${set(p)}</p>`).join('');
const bullets = (list: string[]) => `<ul>${list.map((b) => `<li>${set(b)}</li>`).join('')}</ul>`;

/** About/Support blocks: an optional small display title (the Learn 小标题
 *  voice) above the body, [Name] becomes a link. */
const aboutBlock = (b: AboutBlock) => {
  const body = set(b.text).replace(/\[([^\]]+)\]/g, (_, name: string) => {
    return `<a class="doc-link" href="${creditLinks[name] ?? '#'}" target="_blank" rel="noopener">${name}</a>`;
  });
  return `${b.head ? `<p class="learn-sub">${set(b.head)}</p>` : ''}<p>${body}</p>`;
};

const ABOUT_HTML = aboutSections
  .map(
    (s) => `
    <section class="doc-section" id="${s.id}">
      <header class="doc-title">
        <span class="cn">${esc(s.titleCn)}</span>
        <span class="en">${esc(s.titleEn)}</span>
      </header>
      <div class="doc-en en">${s.en.map(aboutBlock).join('')}</div>
      <div class="doc-cn">${s.cn.map(aboutBlock).join('')}</div>
    </section>`
  )
  .join('');

/** Support: the one place the email is a live mailto, not just selectable. */
const SUPPORT_HTML = `
    <header class="doc-title">
      <span class="cn">常见问题</span>
      <span class="en">Frequently Asked Questions</span>
    </header>
    <div class="doc-en en">${supportFaq.en.map(aboutBlock).join('')}</div>
    <div class="doc-cn">${supportFaq.cn.map(aboutBlock).join('')}</div>`.replace(
  /<span class="selectable">hello@myshiyun\.com<\/span>/g,
  '<a class="doc-link selectable" href="mailto:hello@myshiyun.com">hello@myshiyun.com</a>'
);

// ─── Learn ───────────────────────────────────────────────────────────────────

const TAIJI_ALT = { en: 'Three Star Gods presenting a taiji diagram, Qing dynasty embroidery', cn: '三星太极献寿图刺绣局部' };

/**
 * The graph is drawn at true size for the column it lands in, so Learn's
 * markup is built per breakpoint rather than once. The switch is the COLUMN,
 * not the phone breakpoint: the body measures min(640,vw) − 40, so the full
 * 600 only exists from 640 up.
 */
const wideGraph = window.matchMedia('(min-width: 640px)');

function learnBlock(b: LearnBlock, lang: 'en' | 'cn'): string {
  if (b.fig === 'taiji')
    return `
    <figure class="doc-figure">
      ${curled(
        `<img src="${import.meta.env.BASE_URL}assets/learn/taiji.jpg" alt="${esc(TAIJI_ALT[lang])}" draggable="false" />`,
        '1200/675'
      )}
      <figcaption>${esc(taijiCaption[lang])}</figcaption>
    </figure>`;
  if (b.fig === 'elements') return elementsGraph(lang, !wideGraph.matches);
  if (b.fig === 'stems') return stemsFigure(lang);
  if (b.sub !== undefined) return `<p class="learn-sub">${esc(b.sub)}</p>`;
  return `<p>${set(b.p!).replace(/\n/g, '<br />')}</p>`;
}

const learnHtml = () => `
    <section class="doc-section learn">
      <div class="doc-en en">
        <p class="learn-sentence">${set(learnIntro.sentenceEn)}</p>
        ${learnIntro.en.map((p) => `<p>${set(p)}</p>`).join('')}
      </div>
      <div class="doc-cn">
        <p class="learn-sentence">${set(learnIntro.sentenceCn).replace(/\n/g, '<br />')}</p>
        ${learnIntro.cn.map((p) => `<p>${set(p)}</p>`).join('')}
      </div>
    </section>
    ${learnSections
      .map(
        (s) => `
    <section class="doc-section learn" id="${s.id}">
      <header class="doc-title">
        <span class="cn">${esc(s.titleCn)}</span>
        <span class="en">${esc(s.titleEn)}</span>
      </header>
      <div class="doc-en en">${s.en.map((b) => learnBlock(b, 'en')).join('')}</div>
      <div class="doc-cn">${s.cn.map((b) => learnBlock(b, 'cn')).join('')}</div>
    </section>`
      )
      .join('')}`;

const DOC_HTML: Record<Exclude<Route, 'home'>, string> = {
  privacy: `
    <header class="doc-title">
      <span class="cn">隐私承诺</span>
      <span class="en">Privacy Policy</span>
    </header>
    <div class="doc-en en">
      ${paras(privacyEn.paras1)}${bullets(privacyEn.bullets)}${paras(privacyEn.paras2)}
    </div>
    <div class="doc-cn">
      ${paras(privacyCn.paras1)}${bullets(privacyCn.bullets)}${paras(privacyCn.paras2)}
    </div>
    <p class="doc-updated en">${set(privacyUpdated)}</p>
    <p class="doc-updated cn">${set(privacyUpdatedCn)}</p>`,
  about: ABOUT_HTML,
  support: SUPPORT_HTML,
  learn: '', // built per breakpoint — see docHtml()
};

/** Every render goes through here so Learn always gets the current layout. */
const docHtml = (route: Exclude<Route, 'home'>) =>
  route === 'learn' ? learnHtml() : DOC_HTML[route];

const TITLES: Record<Route, string> = {
  home: '时运 Shiyun',
  about: '时运 · About',
  learn: '时运 · Learn',
  support: '时运 · Support',
  privacy: '时运 · Privacy',
};

// ─── Language ────────────────────────────────────────────────────────────────
// Doc pages read in ONE language; the header's circle toggles it. First visit
// follows the browser, after that the choice sticks. Home stays bilingual.

type Lang = 'en' | 'cn';
const LANG_KEY = 'shiyun-lang';

let lang: Lang = (() => {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'en' || saved === 'cn') return saved;
  } catch {}
  return /^zh/i.test(navigator.language) ? 'cn' : 'en';
})();

const langToggle = document.getElementById('langToggle')!;

/** Everything the language touches outside the doc body: the body class the
 *  CSS hides columns by, the nav labels, the section rail, the toggle glyph. */
function applyLang() {
  body.classList.toggle('lang-en', lang === 'en');
  body.classList.toggle('lang-cn', lang === 'cn');
  links.querySelectorAll('a[data-route]').forEach((a) => {
    a.textContent = navLabels[lang][a.getAttribute('data-route')!];
  });
  // The toggle names the OTHER language, in that language's own face.
  langToggle.textContent = lang === 'en' ? '中' : 'EN';
  langToggle.classList.toggle('en', lang === 'cn');
  langToggle.setAttribute('aria-label', lang === 'en' ? '切换到中文' : 'Switch to English');
  buildSectionNav();
  placeCaret(current);
}

/** Same beat as a doc→doc swap: the column fades, flips language, returns. */
function setLang(next: Lang) {
  if (next === lang) return;
  lang = next;
  try {
    localStorage.setItem(LANG_KEY, next);
  } catch {}
  const g = ++gen;
  docBody.style.opacity = '0';
  window.setTimeout(() => {
    if (g !== gen) return;
    applyLang();
    cylinder.measure();
    spySections();
    docBody.style.opacity = '1';
  }, FADE);
}

langToggle.addEventListener('click', () => setLang(lang === 'en' ? 'cn' : 'en'));

// ─── Routing ─────────────────────────────────────────────────────────────────

let current: Route = 'home';

/** Bumped on every route change: a timeout from an interrupted transition
 *  (fast clicks) must not fire its stale state over the new one. */
let gen = 0;

function routeFromLocation(): Route {
  const seg = location.pathname.replace(/\/+$/, '').split('/').pop() ?? '';
  return seg === 'about' || seg === 'learn' || seg === 'support' || seg === 'privacy'
    ? seg
    : 'home';
}

/** The selected link holds weight 500, same voice as its hover. */
function markActive(route: Route) {
  links.querySelectorAll('a').forEach((a) =>
    a.classList.toggle('active', a.getAttribute('data-route') === route)
  );
}

function placeCaret(route: Route) {
  if (route === 'home') return;
  const link = links.querySelector<HTMLElement>(`[data-route="${route}"]`);
  if (!link) return;
  const rect = link.getBoundingClientRect();
  caret.style.left = `${rect.left + rect.width / 2 - 4}px`;
}

/** FLIP the links row between its two slots, measured off the first link. */
/** The subnav chrome that rides with the links row but has no second slot. */
const riders = [subnavRule, caret];

function flipLinks() {
  const before = links.firstElementChild!.getBoundingClientRect().top;
  const entering = body.classList.contains('at-home');
  body.classList.toggle('at-doc');
  body.classList.toggle('at-home');
  const after = links.firstElementChild!.getBoundingClientRect().top;
  const shift = before - after;

  links.style.transform = `translateY(${shift}px)`;
  /**
   * The hairline and caret hold ONE layout spot in both slots, so they can't
   * FLIP like the row: entering, they start a row's travel below and ride up;
   * leaving, they start in place and ride down. Either way they move with the
   * links — fading them where they stand read as a separate, later event.
   */
  if (entering) for (const el of riders) el.style.transform = `translateY(${shift}px)`;
  links.getBoundingClientRect(); // commit the offset before transitioning off it

  for (const el of [links, ...riders]) el.classList.add('traveling');
  if (!entering) for (const el of riders) el.classList.add('leaving');
  links.style.transform = '';
  for (const el of riders) {
    if (entering) {
      el.style.transform = '';
      continue;
    }
    /**
     * Leaving, each rider is pushed clear of the viewport rather than the
     * row's distance: the row's travel left the hairline a few pixels short
     * of the bottom edge, where it stopped, waited out the rest of the
     * gesture and then blinked away — the caret's triangle most of all.
     * Measured live, so a chrome-away offset is already accounted for.
     */
    const r = el.getBoundingClientRect();
    el.style.transform = `translateY(${window.innerHeight - r.top + 8}px)`;
  }

  /**
   * Only the row's OWN transform ends the travel. transitionend bubbles, and
   * the links' anchors run a 200ms font-weight transition as the active page
   * changes — that child event used to land here first, strip `traveling`
   * mid-flight and SNAP the row to its slot at ~190ms while the hairline was
   * still riding: the two came apart, which is the doubling you could see.
   */
  const done = (e: TransitionEvent) => {
    if (e.target !== links || e.propertyName !== 'transform') return;
    links.removeEventListener('transitionend', done);
    links.classList.remove('traveling');
    // Leaving, the riders are cleared with the chrome itself (see exitDoc)
    // — resetting them here would flash the line back into place.
    if (entering) for (const el of riders) el.classList.remove('traveling');
  };
  links.addEventListener('transitionend', done);
}

function enterDoc(route: Exclude<Route, 'home'>) {
  const g = ++gen;
  docBody.innerHTML = docHtml(route);
  docBody.style.opacity = '1';
  // One gesture: the row starts riding the moment the wheel starts clearing —
  // the fade is quick (half window + parallax drift), so the outgoing page is
  // gone while the incoming one is still early in its travel.
  body.classList.add('veiled');
  window.scrollTo(0, 0);
  doc.hidden = false;
  flipLinks();
  doc.style.transform = `translateY(${window.innerHeight}px)`;
  doc.getBoundingClientRect();
  doc.classList.add('traveling');
  doc.style.transform = '';
  placeCaret(route);
  // The hairline and caret belong TO the row: they resolve on its clock, not
  // after it — held back they read as a second, late arrival.
  body.classList.remove('chrome-exit');
  body.classList.add('chrome-in');
  window.setTimeout(() => {
    if (g !== gen) return;
    doc.classList.remove('traveling');
  }, TRAVEL);
}

function exitDoc() {
  const g = ++gen;
  // The band goes at once (it would mask the home stage); the hairline and
  // caret hold their ink through the ride down.
  body.classList.remove('chrome-in');
  body.classList.add('chrome-exit');
  flipLinks();
  doc.classList.add('traveling');
  // Clear the scrolled height too: one viewport of travel from deep in a page
  // only brings EARLIER content through the frame, over the arriving wheel.
  doc.style.transform = `translateY(${window.scrollY + window.innerHeight}px)`;
  // The wheel starts its descent early enough to arrive just as the row
  // lands — continuous both ways, no pause.
  window.setTimeout(() => {
    if (g === gen) body.classList.remove('veiled');
  }, FADE / 2);
  window.setTimeout(() => {
    if (g !== gen) return;
    doc.classList.remove('traveling');
    doc.style.transform = '';
    doc.hidden = true;
    docBody.style.opacity = '1'; // an interrupted swap may have left it at 0
    // The riders lose their ink here, but KEEP the offset that carried them
    // off the page: snapping them home in the same breath would play that
    // fade in full view. The next entry assigns their offset outright, and
    // applyInstant clears it for deep links.
    body.classList.remove('chrome-exit');
    for (const el of riders) el.classList.remove('traveling', 'leaving');
  }, TRAVEL);
}

/** Doc → doc: the caret rides over (like the app's 中文/EN tabs), content swaps. */
function swapDoc(route: Exclude<Route, 'home'>) {
  const g = ++gen;
  placeCaret(route);
  docBody.style.opacity = '0';
  // Wait out the WHOLE fade before swapping: cut it short and the old text is
  // still half there when the new markup lands. Then curl the fresh column
  // while it is invisible, so it is never seen flat.
  window.setTimeout(() => {
    if (g !== gen) return;
    docBody.innerHTML = docHtml(route);
    window.scrollTo(0, 0);
    cylinder.measure();
    if (RAILS[route]) showSectionNav();
    docBody.style.opacity = '1';
  }, FADE);
}

function navigate(route: Route, push: boolean) {
  if (route === current) return;
  const swapping = current !== 'home' && route !== 'home';
  if (current === 'home') enterDoc(route as Exclude<Route, 'home'>);
  else if (route === 'home') exitDoc();
  else swapDoc(route as Exclude<Route, 'home'>);
  markActive(route);
  current = route;
  syncSectionNav(route, swapping);
  document.title = TITLES[route];
  if (push) history.pushState(null, '', route === 'home' ? './' : `./${route}`);
}

/** Deep links and back/forward while veiled: settle the state without motion. */
function applyInstant(route: Route) {
  gen++;
  for (const el of riders) {
    el.classList.remove('traveling', 'leaving');
    el.style.transform = '';
  }
  docBody.style.opacity = '1';
  body.classList.add('no-anim');
  body.classList.toggle('at-home', route === 'home');
  body.classList.toggle('at-doc', route !== 'home');
  body.classList.toggle('veiled', route !== 'home');
  body.classList.toggle('chrome-in', route !== 'home');
  body.classList.remove('chrome-exit');
  doc.hidden = route === 'home';
  if (route !== 'home') {
    docBody.innerHTML = docHtml(route);
    placeCaret(route);
  }
  markActive(route);
  current = route;
  syncSectionNav(route);
  document.title = TITLES[route];
  requestAnimationFrame(() => requestAnimationFrame(() => body.classList.remove('no-anim')));
}

// ─── About's section nav: rail / sticky bar, scrollspy, chrome hide ─────────

const sectionNav = document.getElementById('sectionNav')!;
const sectionVeil = document.getElementById('sectionVeil')!;
const sectionNavInner = sectionNav.querySelector('.section-nav-inner')!;

/** The routes that carry a section rail, and what it lists. */
const RAILS: Partial<Record<Route, { id: string; nav: string; navCn: string }[]>> = {
  about: aboutSections,
  learn: learnSections,
};

function buildSectionNav() {
  sectionNavInner.innerHTML = (RAILS[current] ?? [])
    .map((s) => `<a href="#${s.id}" data-section="${s.id}">${esc(lang === 'cn' ? s.navCn : s.nav)}</a>`)
    .join('');
  // Fresh labels: forget where the bar was and let the next spy place it.
  lastActive = '';
  sectionNav.scrollLeft = 0;
}

sectionNavInner.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest('a[data-section]');
  if (!a) return;
  e.preventDefault();
  document.getElementById(a.getAttribute('data-section')!)?.scrollIntoView({ behavior: 'smooth' });
});

/** The section whose start has passed the sticky line owns the bold. */
function spySections() {
  const list = RAILS[current];
  if (!list) return;
  const line = window.scrollY + 275; // where a jumped-to title comes to rest
  let active = list[0].id;
  for (const s of list) {
    const el = document.getElementById(s.id);
    if (el && el.offsetTop <= line) active = s.id;
  }
  // At the very bottom the LAST title can never reach the line — but the
  // whole closing section is on screen, so it owns the bold.
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
    active = list[list.length - 1].id;
  }
  sectionNavInner.querySelectorAll('a').forEach((a) =>
    a.classList.toggle('active', a.getAttribute('data-section') === active)
  );
  if (active !== lastActive) {
    lastActive = active;
    centreLabel(active, true);
  }
}

/**
 * Phone and tablet read the rail as a scrolling bar wider than the screen.
 * Once the bold label has travelled past the middle, the bar carries it back
 * there — clamped at both ends, so the opening labels stay put on the left
 * and the closing ones are free to sit right of centre.
 */
let lastActive = '';
function centreLabel(id: string, smooth: boolean) {
  if (!window.matchMedia('(max-width: 1199px)').matches) return; // desktop rail
  const a = sectionNavInner.querySelector<HTMLElement>(`[data-section="${id}"]`);
  if (!a) return;
  const max = sectionNav.scrollWidth - sectionNav.clientWidth;
  if (max <= 0) return;
  const want = a.offsetLeft + a.offsetWidth / 2 - sectionNav.clientWidth / 2;
  const next = Math.max(0, Math.min(max, want));
  if (Math.abs(next - sectionNav.scrollLeft) < 1) return;
  sectionNav.scrollTo({ left: next, behavior: smooth ? 'smooth' : 'auto' });
}

/**
 * Mobile, any doc page: reading on (scrolling down) sends the logo header and
 * main nav away — on About the section bar stays stuck to the top; any scroll
 * up brings the chrome back down. Desktop chrome never moves.
 */
let lastScrollY = 0;
function chromeOnScroll() {
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  const y = window.scrollY;
  const delta = y - lastScrollY;
  lastScrollY = y;
  if (current === 'home') {
    body.classList.remove('chrome-away', 'chrome-compact');
    return;
  }
  if (mobile) {
    body.classList.remove('chrome-compact');
    if (y < 60 || delta < -4) body.classList.remove('chrome-away');
    else if (delta > 4 && y > 160) body.classList.add('chrome-away');
    return;
  }
  // Desktop and tablet keep the row, condensed: 99 → 60, circles 48 → 40.
  body.classList.remove('chrome-away');
  if (y < 60 || delta < -4) body.classList.remove('chrome-compact');
  else if (delta > 4 && y > 160) body.classList.add('chrome-compact');
}

window.addEventListener('scroll', () => {
  spySections();
  chromeOnScroll();
}, { passive: true });

/** Cylinder focus for the long-form reads (About, Privacy). */
const cylinder = initCylinder(docBody);
initStems(docBody);

/**
 * Leaving: the rail fades WITH the column it belongs to, starting on the click
 * — dropped at the swap instead, it stayed lit through the whole fade and then
 * vanished in one frame.
 */
function hideSectionNav() {
  if (sectionNav.hidden) return;
  sectionNav.style.opacity = '0';
  sectionVeil.style.opacity = '0';
  window.setTimeout(() => {
    if (RAILS[current]) return; // came back before the fade was out
    sectionNav.hidden = true;
    sectionVeil.hidden = true;
  }, FADE);
}

/**
 * Arriving: the rail comes up WITH the new column, never ahead of it. Raised
 * at click time it appeared ~560ms early, which read as the page announcing
 * itself twice.
 */
function showSectionNav() {
  buildSectionNav(); // the rail lists the CURRENT route's sections
  sectionNav.hidden = false;
  sectionVeil.hidden = false;
  sectionNav.style.opacity = '0';
  sectionVeil.style.opacity = '0';
  // Commit the 0 with a layout read before asking for 1 — straight off
  // display:none the two land in one style resolution and no fade runs.
  sectionNav.getBoundingClientRect();
  sectionNav.style.opacity = '1';
  sectionVeil.style.opacity = '1';
  requestAnimationFrame(spySections);
}

/** Route-driven visibility for the section nav. `defer` = a doc→doc swap is
 *  in flight and will raise the rail itself, on the content's own beat.
 *  Hiding is never deferred: it belongs to the OUTGOING column. */
function syncSectionNav(route: Route, defer = false) {
  if (!RAILS[route]) hideSectionNav();
  else if (!defer) showSectionNav();
  body.classList.remove('chrome-away', 'chrome-compact'); // a new page opens full
  // The cylinder belongs to the long reads; Learn is a single centred line.
  if (route === 'about' || route === 'learn' || route === 'support' || route === 'privacy')
    cylinder.enable();
  else cylinder.disable();
}

links.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest('a[data-route]');
  if (!a) return;
  e.preventDefault();
  navigate(a.getAttribute('data-route') as Route, true);
});

document.getElementById('brandHome')!.addEventListener('click', (e) => {
  e.preventDefault();
  navigate('home', true);
});

/**
 * Home has nothing to scroll, so a scroll gesture there reads as "go in":
 * one swipe up — or a wheel notch down — raises the doc pages at About, the
 * same travel a link click runs. Downward gestures do nothing; home is
 * already the top of the site.
 */
const PULL_IN = 48; // px of gesture before the page commits
let pulled = 0;
let pullLocked = false;
let pullTimer = 0;

/**
 * The gesture that raised the page must not also scroll it — a trackpad's
 * momentum runs on long after the flick, and About would arrive already
 * halfway down. So the lock holds the page still and every further event of
 * the SAME gesture pushes it out; it lifts once the wheel falls quiet.
 */
function holdPull(ms: number) {
  clearTimeout(pullTimer);
  pullTimer = window.setTimeout(() => {
    pullLocked = false;
    body.classList.remove('pulling');
  }, ms);
}

const overlayUp = () =>
  body.classList.contains('peeking') ||
  body.classList.contains('qr-peeking') ||
  body.classList.contains('qr-open') ||
  document.documentElement.classList.contains('video-open');

function pullFromHome(delta: number) {
  if (pullLocked) {
    holdPull(200); // still the same gesture: keep the page still
    return;
  }
  if (current !== 'home' || overlayUp()) {
    pulled = 0;
    return;
  }
  if (delta <= 0) {
    pulled = 0; // a downward twitch resets the run
    return;
  }
  pulled += delta;
  if (pulled < PULL_IN) return;
  pulled = 0;
  pullLocked = true; // one page per gesture, not one per wheel event
  body.classList.add('pulling');
  holdPull(TRAVEL);
  navigate('about', true);
}

window.addEventListener('wheel', (e) => pullFromHome(e.deltaY), { passive: true });

let touchY = 0;
window.addEventListener(
  'touchstart',
  (e) => {
    touchY = e.touches[0].clientY;
    pulled = 0;
  },
  { passive: true }
);
window.addEventListener(
  'touchmove',
  (e) => {
    const y = e.touches[0].clientY;
    pullFromHome(touchY - y); // finger travelling up = positive
    touchY = y;
  },
  { passive: true }
);

window.addEventListener('popstate', () => navigate(routeFromLocation(), false));

// No "Save image as…" on the artwork (a deterrent; the files still ship).
document.addEventListener('contextmenu', (e) => {
  if ((e.target as HTMLElement).closest?.('img, svg')) e.preventDefault();
});

window.addEventListener('resize', () => {
  placeCaret(current);
  centreLabel(lastActive, false); // the bar's width changed under the bold
});

/** Crossing it re-lays the Five Elements graph, which is drawn for its column
 *  rather than scaled into it. */
wideGraph.addEventListener('change', () => {
  if (current !== 'learn') return;
  const y = window.scrollY;
  docBody.innerHTML = docHtml('learn');
  window.scrollTo(0, y);
  cylinder.measure();
});

applyLang();
applyInstant(routeFromLocation());

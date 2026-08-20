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
import { aboutSections, creditLinks, privacyCn, privacyEn, privacyUpdated, type AboutBlock } from './content';
import { noWidow } from './typeset';

type Route = 'home' | 'about' | 'learn' | 'privacy';

const TRAVEL = 400;
const FADE = 300;

const body = document.body;
const links = document.getElementById('links')!;
const doc = document.getElementById('doc')!;
const docBody = document.getElementById('docBody')!;
const caret = document.getElementById('caret')!;

const wheelEl = document.getElementById('wheel')!;
const wheel = new HourWheel(wheelEl);
setInterval(() => wheel.update(new Date()), 1000);
const getApp = initGetApp(document.querySelector<HTMLElement>('.cta.getapp')!, wheelEl);
initPreview(document.querySelector<HTMLElement>('.cta.preview')!, wheelEl, getApp.open);

// The doc pages' header pill: come home, then raise the QR.
document.getElementById('getAppPill')!.addEventListener('click', (e) => {
  e.preventDefault();
  if (current !== 'home') navigate('home', true);
  getApp.open();
});

// ─── Doc content ─────────────────────────────────────────────────────────────

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const set = (s: string) => esc(noWidow(s));
const paras = (list: string[]) => list.map((p) => `<p>${set(p)}</p>`).join('');
const bullets = (list: string[]) => `<ul>${list.map((b) => `<li>${set(b)}</li>`).join('')}</ul>`;

/** About blocks: an optional 小标题 above the body, [Name] becomes a link. */
const aboutBlock = (b: AboutBlock) => {
  const body = set(b.text).replace(/\[([^\]]+)\]/g, (_, name: string) => {
    return `<a class="doc-link" href="${creditLinks[name] ?? '#'}" target="_blank" rel="noopener">${name}</a>`;
  });
  return `<p>${b.head ? `<span class="doc-sub">${set(b.head)}</span><br />` : ''}${body}</p>`;
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
    <p class="doc-updated en">${set(privacyUpdated)}</p>`,
  about: ABOUT_HTML,
  learn: `<p class="doc-soon">即将上线 · Coming soon</p>`,
};

const TITLES: Record<Route, string> = {
  home: '时运 Shiyun',
  about: '时运 · About',
  learn: '时运 · Learn',
  privacy: '时运 · Privacy',
};

// ─── Routing ─────────────────────────────────────────────────────────────────

let current: Route = 'home';

function routeFromLocation(): Route {
  const seg = location.pathname.replace(/\/+$/, '').split('/').pop() ?? '';
  return seg === 'about' || seg === 'learn' || seg === 'privacy' ? seg : 'home';
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
function flipLinks() {
  const before = links.firstElementChild!.getBoundingClientRect().top;
  body.classList.toggle('at-doc');
  body.classList.toggle('at-home');
  const after = links.firstElementChild!.getBoundingClientRect().top;
  links.style.transform = `translateY(${before - after}px)`;
  links.getBoundingClientRect(); // commit the offset before transitioning off it
  links.classList.add('traveling');
  links.style.transform = '';
  links.addEventListener(
    'transitionend',
    () => links.classList.remove('traveling'),
    { once: true }
  );
}

function enterDoc(route: Exclude<Route, 'home'>) {
  docBody.innerHTML = DOC_HTML[route];
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
  window.setTimeout(() => {
    doc.classList.remove('traveling');
    body.classList.add('chrome-in');
  }, TRAVEL);
}

function exitDoc() {
  body.classList.remove('chrome-in');
  flipLinks();
  doc.classList.add('traveling');
  doc.style.transform = `translateY(${window.innerHeight}px)`;
  // The wheel starts its descent early enough to arrive just as the row
  // lands — continuous both ways, no pause.
  window.setTimeout(() => body.classList.remove('veiled'), FADE / 2);
  window.setTimeout(() => {
    doc.classList.remove('traveling');
    doc.style.transform = '';
    doc.hidden = true;
  }, TRAVEL);
}

/** Doc → doc: the caret rides over (like the app's 中文/EN tabs), content swaps. */
function swapDoc(route: Exclude<Route, 'home'>) {
  placeCaret(route);
  docBody.style.opacity = '0';
  window.setTimeout(() => {
    docBody.innerHTML = DOC_HTML[route];
    window.scrollTo(0, 0);
    docBody.style.opacity = '1';
  }, 150);
}

function navigate(route: Route, push: boolean) {
  if (route === current) return;
  if (current === 'home') enterDoc(route as Exclude<Route, 'home'>);
  else if (route === 'home') exitDoc();
  else swapDoc(route as Exclude<Route, 'home'>);
  markActive(route);
  current = route;
  syncSectionNav(route);
  document.title = TITLES[route];
  if (push) history.pushState(null, '', route === 'home' ? './' : `./${route}`);
}

/** Deep links and back/forward while veiled: settle the state without motion. */
function applyInstant(route: Route) {
  body.classList.add('no-anim');
  body.classList.toggle('at-home', route === 'home');
  body.classList.toggle('at-doc', route !== 'home');
  body.classList.toggle('veiled', route !== 'home');
  body.classList.toggle('chrome-in', route !== 'home');
  doc.hidden = route === 'home';
  if (route !== 'home') {
    docBody.innerHTML = DOC_HTML[route];
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
const sectionNavInner = sectionNav.querySelector('.section-nav-inner')!;
sectionNavInner.innerHTML = aboutSections
  .map((s) => `<a href="#${s.id}" data-section="${s.id}">${esc(s.nav)}</a>`)
  .join('');

sectionNavInner.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest('a[data-section]');
  if (!a) return;
  e.preventDefault();
  document.getElementById(a.getAttribute('data-section')!)?.scrollIntoView({ behavior: 'smooth' });
});

/** The section whose start has passed the sticky line owns the bold. */
function spySections() {
  if (current !== 'about') return;
  const line = window.scrollY + 220; // just under the chrome + bar
  let active = aboutSections[0].id;
  for (const s of aboutSections) {
    const el = document.getElementById(s.id);
    if (el && el.offsetTop <= line) active = s.id;
  }
  sectionNavInner.querySelectorAll('a').forEach((a) =>
    a.classList.toggle('active', a.getAttribute('data-section') === active)
  );
}

/**
 * Mobile: reading on (scrolling down) sends the logo header and main nav
 * away, leaving only the section bar stuck to the top; any scroll up brings
 * them back down. Desktop chrome never moves.
 */
let lastScrollY = 0;
function chromeOnScroll() {
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  const y = window.scrollY;
  const delta = y - lastScrollY;
  lastScrollY = y;
  if (!mobile || current !== 'about') {
    body.classList.remove('chrome-away');
    return;
  }
  if (y < 60 || delta < -4) body.classList.remove('chrome-away');
  else if (delta > 4 && y > 160) body.classList.add('chrome-away');
}

window.addEventListener('scroll', () => {
  spySections();
  chromeOnScroll();
}, { passive: true });

/** Route-driven visibility for the section nav. */
function syncSectionNav(route: Route) {
  sectionNav.hidden = route !== 'about';
  body.classList.remove('chrome-away');
  if (route === 'about') requestAnimationFrame(spySections);
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

window.addEventListener('popstate', () => navigate(routeFromLocation(), false));

window.addEventListener('resize', () => placeCaret(current));

applyInstant(routeFromLocation());

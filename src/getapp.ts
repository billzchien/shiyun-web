/**
 * The Get app flow (Figma "Get app" section, 1002:6437) — the Preview flow's
 * sibling, without a player. HOVER swaps the wheel for a circle in the hour's
 * element color holding a white QR card; PRESS expands it to cover the screen
 * (same 400ms expressive ride), the App Store badge and a glass close arrive
 * on the bottom rank, and the logotype above turns inverse. Close/Esc reverses
 * everything back to the wheel.
 */

const TRAVEL = 400;
const FADE = 300;
/** The App Store page — placeholder until the app is live (user will supply). */
const APP_STORE_URL = '#';

type State = 'idle' | 'peek' | 'expanded';

export function initGetApp(button: HTMLElement, wheel: HTMLElement): { open: () => void } {
  const layer = document.createElement('div');
  layer.className = 'qr-layer';
  layer.hidden = true;
  layer.innerHTML = `
    <div class="qr-circle">
      <div class="qr-card">
        <img src="${import.meta.env.BASE_URL}assets/qr-placeholder.png" alt="下载时运 Download Shiyun" draggable="false" />
      </div>
    </div>
    <a class="qr-badge" href="${APP_STORE_URL}" aria-label="Download on the App Store">
      <img src="${import.meta.env.BASE_URL}assets/app-store-badge.svg" alt="Download on the App Store" draggable="false" />
    </a>
    <button class="qr-close" type="button" aria-label="关闭 Close">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" />
      </svg>
    </button>`;
  document.body.appendChild(layer);

  const circle = layer.querySelector<HTMLElement>('.qr-circle')!;
  const closeBtn = layer.querySelector<HTMLElement>('.qr-close')!;

  let state: State = 'idle';

  function boxAtWheel() {
    const r = wheel.getBoundingClientRect();
    circle.style.left = `${r.left}px`;
    circle.style.top = `${r.top}px`;
    circle.style.width = `${r.width}px`;
    circle.style.height = `${r.height}px`;
  }

  function boxFullscreen() {
    const side = Math.hypot(window.innerWidth, window.innerHeight) * 1.1; // overshoot: the arc must clear the corners, not graze them
    circle.style.left = `${(window.innerWidth - side) / 2}px`;
    circle.style.top = `${(window.innerHeight - side) / 2}px`;
    circle.style.width = `${side}px`;
    circle.style.height = `${side}px`;
  }

  function peek() {
    if (state !== 'idle') return;
    state = 'peek';
    layer.hidden = false;
    boxAtWheel();
    circle.getBoundingClientRect();
    layer.classList.add('peek');
    document.body.classList.add('qr-peeking');
  }

  function unpeek() {
    if (state !== 'peek') return;
    state = 'idle';
    layer.classList.remove('peek');
    document.body.classList.remove('qr-peeking');
    document.body.classList.add('unpeeking');
    window.setTimeout(() => {
      document.body.classList.remove('unpeeking');
      if (state === 'idle') layer.hidden = true;
    }, FADE);
  }

  function expand() {
    if (state === 'expanded') return;
    if (state === 'idle') peek();
    state = 'expanded';
    document.body.classList.add('qr-open');
    requestAnimationFrame(() => {
      boxFullscreen();
      layer.classList.add('expanded');
    });
    window.setTimeout(() => {
      if (state === 'expanded') layer.classList.add('ready');
    }, TRAVEL);
  }

  function collapse() {
    if (state !== 'expanded') return;
    state = 'peek';
    layer.classList.remove('ready', 'expanded');
    document.body.classList.remove('qr-open');
    boxAtWheel();
    window.setTimeout(() => {
      if (state === 'peek') unpeek();
    }, TRAVEL);
  }

  const hoverable = window.matchMedia('(hover: hover)');

  /**
   * The one entry every Get app button shares: a phone can't scan its own
   * screen, so touch devices go straight to the App Store (once the link is
   * live); everyone else gets the QR takeover.
   */
  function open() {
    if (!hoverable.matches) {
      if (APP_STORE_URL !== '#') window.location.href = APP_STORE_URL;
      return;
    }
    expand();
  }

  button.addEventListener('mouseenter', () => {
    if (hoverable.matches) peek();
  });
  button.addEventListener('mouseleave', () => unpeek());
  button.addEventListener('click', (e) => {
    e.preventDefault();
    open();
  });
  closeBtn.addEventListener('click', collapse);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') collapse();
  });
  window.addEventListener('resize', () => {
    if (state === 'expanded') boxFullscreen();
    else if (state === 'peek') boxAtWheel();
  });

  return { open };
}

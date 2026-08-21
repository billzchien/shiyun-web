/**
 * The Preview flow (Figma "Preview" section, 1002:6361).
 *
 * HOVER on the Preview button: the hour wheel scales down and fades while a
 * circle of the video's thumbnail scales up into its place — the circle is
 * 624/562 of the wheel's box (the Hover frame), accent-colored under the
 * thumbnail, thumbnail cover-cropped at ~115% like the design.
 *
 * PRESS: the circle expands to cover the screen (expressive, 400ms), its
 * ground turning to the pressed frame's near-black, and the Vimeo player
 * fades in letterboxed 16:9 with its own controls, playing. An overlay
 * header (dark Get app pill + close) rides on top.
 *
 * ENDED (or close / Esc): everything reverses — fullscreen back to the
 * circle, circle back to the wheel.
 */
import Player from '@vimeo/player';

const VIDEO_ID = 1217504030;
/**
 * BACKGROUND MODE — the only way to a fully chromeless player on any Vimeo
 * plan (the per-button hide flags are paid-tier only). It boots muted and
 * looping; the SDK unwinds both on load (setLoop(false), unmute — the iframe's
 * allow="autoplay" delegates our click's activation, so unmuted playback is
 * permitted), and OUR overlay is the whole control surface: tap anywhere to
 * toggle, one play/pause button, both idle-fading while playing.
 */
const PLAYER_URL = `https://player.vimeo.com/video/${VIDEO_ID}?background=1&autopause=0&player_id=0&app_id=58479`;
/** While playing, the overlay controls clear after this much pointer quiet. */
const IDLE_MS = 2000;
/** The peek circle wears the wheel's exact box (user call, over the Figma 624). */
const CIRCLE_RATIO = 1;
const TRAVEL = 400;
const FADE = 300;

type State = 'idle' | 'peek' | 'expanded';

/**
 * iOS Safari tints its toolbars from `theme-color`, but only applies a change
 * reliably from INSIDE a user gesture — set from a later timer it arrives
 * late or not at all. So this is called synchronously on the press, while the
 * page canvas (which would swallow the circle's ride) waits for touchdown.
 */
function setThemeColor(color: string) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
}

export function initPreview(button: HTMLElement, wheel: HTMLElement, onGetApp: () => void) {
  const layer = document.createElement('div');
  layer.className = 'preview-layer';
  layer.hidden = true;
  layer.innerHTML = `
    <div class="preview-circle">
      <img class="preview-thumb" alt="" draggable="false" />
      <div class="preview-video"></div>
    </div>
    <div class="preview-stage">
    <div class="preview-tap"></div>
    <div class="preview-controls">
      <button class="preview-play" type="button" aria-label="播放/暂停 Play / Pause">
        <svg class="ic-play" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5.5v13l11-6.5z" />
        </svg>
        <svg class="ic-pause" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
        </svg>
      </button>
      <button class="preview-mute" type="button" aria-label="静音 Mute / Unmute">
        <svg class="ic-vol" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
          <path d="M16.5 8.5a5 5 0 0 1 0 7" stroke="currentColor" stroke-width="2" />
        </svg>
        <svg class="ic-muted" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
          <path d="M16 9.5l5 5M21 9.5l-5 5" stroke="currentColor" stroke-width="2" />
        </svg>
      </button>
      <button class="preview-fs" type="button" aria-label="全屏 Fullscreen">
        <svg class="ic-fs-open" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" stroke="currentColor" stroke-width="2" />
        </svg>
        <svg class="ic-fs-close" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 9h5V4M20 9h-5V4M4 15h5v5M20 15h-5v5" stroke="currentColor" stroke-width="2" />
        </svg>
      </button>
    </div>
    <div class="preview-chrome">
      <a class="preview-pill en" href="#">Get app</a>
      <button class="preview-close" type="button" aria-label="关闭 Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" />
        </svg>
      </button>
    </div>
    </div>`;
  document.body.appendChild(layer);

  const circle = layer.querySelector<HTMLElement>('.preview-circle')!;
  const thumb = layer.querySelector<HTMLImageElement>('.preview-thumb')!;
  const videoBox = layer.querySelector<HTMLElement>('.preview-video')!;
  const closeBtn = layer.querySelector<HTMLElement>('.preview-close')!;
  const tap = layer.querySelector<HTMLElement>('.preview-tap')!;
  const playBtn = layer.querySelector<HTMLElement>('.preview-play')!;
  const muteBtn = layer.querySelector<HTMLElement>('.preview-mute')!;
  const fsBtn = layer.querySelector<HTMLElement>('.preview-fs')!;

  let state: State = 'idle';
  let player: Player | null = null;
  let idleTimer = 0;

  /** Playing: the controls step back after a quiet spell; any pointer wakes them. */
  function poke() {
    layer.classList.remove('controls-idle');
    window.clearTimeout(idleTimer);
    if (layer.classList.contains('is-playing')) {
      idleTimer = window.setTimeout(() => layer.classList.add('controls-idle'), IDLE_MS);
    }
  }

  function togglePlayback() {
    player?.getPaused().then((paused) => (paused ? player?.play() : player?.pause()));
  }

  function toggleMute() {
    player?.getMuted().then((muted) => {
      player?.setMuted(!muted);
      layer.classList.toggle('is-muted', !muted);
      poke();
    });
  }

  // The poster is a local asset (user-made, square, on the circle's own dark
  // ground) — no Vimeo contact until the video is actually pressed.
  thumb.src = `${import.meta.env.BASE_URL}assets/thumbnail.jpg`;

  /** Park the circle over the wheel, 624/562 of its box, sharing its centre. */
  function boxAtWheel() {
    const r = wheel.getBoundingClientRect();
    const size = r.width * CIRCLE_RATIO;
    circle.style.left = `${r.left + r.width / 2 - size / 2}px`;
    circle.style.top = `${r.top + r.height / 2 - size / 2}px`;
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
  }

  /** A centred square whose circle covers every corner of the viewport. */
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
    circle.getBoundingClientRect(); // land the start box before transitioning
    layer.classList.add('peek');
    document.body.classList.add('peeking');
  }

  function unpeek() {
    if (state !== 'peek') return;
    state = 'idle';
    layer.classList.remove('peek');
    document.body.classList.remove('peeking');
    // Return leg of the no-crossfade handoff: the wheel waits for the circle.
    document.body.classList.add('unpeeking');
    window.setTimeout(() => {
      document.body.classList.remove('unpeeking');
      if (state === 'idle') layer.hidden = true;
    }, FADE);
  }

  function expand() {
    if (state === 'expanded') return;
    // Both signals Safari reads leave in the SAME gesture — split across two
    // moments, its two toolbars sampled different ones and disagreed. The
    // canvas's colour still waits for touchdown, via CSS delay.
    setThemeColor('#120900');
    document.documentElement.classList.add('video-open');
    /**
     * A TOUCH TAP HAS NO HOVER STAGE, so the circle would be born and told to
     * cover the screen in one frame — the browser has no start box to animate
     * FROM and simply cuts to fullscreen. Seed the peek, let it paint at the
     * wheel's size, and only then ride out.
     */
    if (state === 'idle') {
      peek();
      state = 'expanded';
      window.setTimeout(runExpand, FADE / 2);
    } else {
      state = 'expanded';
      runExpand();
    }
  }

  function runExpand() {
    if (state !== 'expanded') return;
    // Pin the poster at its current size — the circle expands around it.
    const tr = thumb.getBoundingClientRect();
    thumb.style.width = `${tr.width}px`;
    thumb.style.height = `${tr.height}px`;
    // Commit the start box with a layout READ, then set the end box — the
    // transition needs the two in separate style resolutions. A reflow does
    // that deterministically; rAF would stall while the tab is hidden.
    circle.getBoundingClientRect();
    boxFullscreen();
    layer.classList.add('expanded');
    // Mount the player NOW, not after the travel: it loads at its final rect
    // behind the growing circle, which unmasks it — by touchdown the video is
    // usually already painted exactly where the still sits.
    {
      const iframe = document.createElement('iframe');
      iframe.src = PLAYER_URL;
      iframe.allow = 'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media';
      iframe.title = '时运 Shiyun';
      videoBox.appendChild(iframe);
      player = new Player(iframe);
      player.on('loaded', () => {
        // Unwind background mode's forced loop + mute; our overlay takes over.
        player?.setLoop(false);
        player?.setMuted(false);
        player?.setVolume(1);
        layer.classList.add('playing');
      });
      player.on('play', () => {
        layer.classList.add('is-playing');
        poke();
      });
      player.on('pause', () => {
        layer.classList.remove('is-playing');
        poke();
      });
      player.on('ended', collapse);
    }
  }

  /**
   * The way down never shows the poster: the circle shrinks over the LIVE
   * video, cropping it ('playing' stays on, which keeps the thumb hidden and
   * the iframe visible), then the whole circle fades and the wheel returns.
   * The player is destroyed only once nothing of it can be seen.
   */
  function collapse() {
    if (state !== 'expanded') return;
    state = 'peek';
    window.clearTimeout(idleTimer);
    layer.classList.add('closing'); // the video dissolves as the circle shrinks
    layer.classList.remove('controls-idle', 'rotated', 'rotating', 'expanded');
    boxAtWheel();
    document.documentElement.classList.remove('video-open');
    setThemeColor('#fffcf9');
    window.setTimeout(() => {
      if (state !== 'peek') return;
      unpeek();
      window.setTimeout(() => {
        player?.destroy();
        player = null;
        videoBox.innerHTML = '';
        layer.classList.remove('playing', 'is-playing', 'is-muted', 'closing');
        thumb.style.width = '';
        thumb.style.height = '';
      }, FADE);
    }, TRAVEL);
  }

  const hoverable = window.matchMedia('(hover: hover)');
  button.addEventListener('mouseenter', () => {
    if (hoverable.matches) peek();
  });
  button.addEventListener('mouseleave', () => unpeek());
  button.addEventListener('click', (e) => {
    e.preventDefault();
    expand();
  });
  closeBtn.addEventListener('click', collapse);
  // The overlay's Get app pill: fold the video away, then hand to the QR flow
  // once the circle has ridden back to the wheel.
  layer.querySelector<HTMLElement>('.preview-pill')!.addEventListener('click', (e) => {
    e.preventDefault();
    collapse();
    window.setTimeout(onGetApp, TRAVEL);
  });
  tap.addEventListener('click', togglePlayback);
  playBtn.addEventListener('click', togglePlayback);
  muteBtn.addEventListener('click', toggleMute);
  // The spin is chaperoned: controls fade out (150ms), the stage rotates
  // (150ms), controls fade back in at their new positions.
  fsBtn.addEventListener('click', () => {
    if (layer.classList.contains('rotating')) return;
    layer.classList.add('rotating');
    window.setTimeout(() => layer.classList.toggle('rotated'), 150);
    window.setTimeout(() => {
      layer.classList.remove('rotating');
      poke();
    }, 300);
  });
  // If the screen itself turns landscape (device rotated), the plain layout
  // already fills it — drop the artificial rotation rather than doubling up.
  const landscape = window.matchMedia('(orientation: landscape)');
  landscape.addEventListener('change', (e) => {
    if (e.matches) layer.classList.remove('rotated');
  });
  layer.addEventListener('pointermove', poke);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') collapse();
    if (e.key === ' ' && state === 'expanded') {
      e.preventDefault();
      togglePlayback();
    }
  });
  window.addEventListener('resize', () => {
    if (state === 'expanded') boxFullscreen();
    else if (state === 'peek') boxAtWheel();
  });
}

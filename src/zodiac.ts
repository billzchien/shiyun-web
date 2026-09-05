/**
 * The twelve zodiac cells (Figma 1258:4313) — the Zodiac section's figure.
 *
 * Twelve circles, one per Earthly Branch, each showing its branch character.
 * Click one and it turns over to the animal that branch carries. The point of
 * the paragraph is that the animals ARE the branches, so the turn happens in
 * place: one disc, two faces, nothing moves.
 *
 * The cells fill their column — six to a row from tablet up, four on a phone.
 */
import { BRANCHES, BRANCH_ANIMAL } from './tables';

// The app's own day-sign icons (light): the disc takes currentColor, the
// animal is cut out of it in the page's cream.
import rat from '../assets/learn/sign/rat.svg?raw';
import ox from '../assets/learn/sign/ox.svg?raw';
import tiger from '../assets/learn/sign/tiger.svg?raw';
import rabbit from '../assets/learn/sign/rabbit.svg?raw';
import dragon from '../assets/learn/sign/dragon.svg?raw';
import snake from '../assets/learn/sign/snake.svg?raw';
import horse from '../assets/learn/sign/horse.svg?raw';
import goat from '../assets/learn/sign/goat.svg?raw';
import monkey from '../assets/learn/sign/monkey.svg?raw';
import rooster from '../assets/learn/sign/rooster.svg?raw';
import dog from '../assets/learn/sign/dog.svg?raw';
import pig from '../assets/learn/sign/pig.svg?raw';

const ICON: Record<string, string> = {
  rat, ox, tiger, rabbit, dragon, snake, horse, goat, monkey, rooster, dog, pig,
};

const ANIMAL_CN = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const ANIMAL_EN = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

const HINT = {
  en: 'Click on Branches to reveal animal',
  cn: '点击地支看对应生肖',
};

export function zodiacFigure(lang: 'en' | 'cn'): string {
  const cells = BRANCHES.map((branch, i) => {
    const animal = lang === 'cn' ? ANIMAL_CN[i] : ANIMAL_EN[i];
    return `
        <button type="button" class="z-cell" aria-pressed="false" aria-label="${branch} · ${animal}">
          <span class="z-disc">
            <span class="z-face z-front">${branch}</span>
            <span class="z-face z-back">${ICON[BRANCH_ANIMAL[i]]}</span>
          </span>
        </button>`;
  }).join('');

  return `
    <figure class="doc-figure zodiac-figure">
      <div class="z-grid">${cells}</div>
      <figcaption class="z-hint">${HINT[lang]}</figcaption>
    </figure>`;
}

/** Delegated, like the stems figure: the markup is rebuilt with the page. */
export function initZodiac(root: HTMLElement) {
  root.addEventListener('click', (e) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('.z-cell');
    if (!cell) return;
    const turned = cell.getAttribute('aria-pressed') === 'true';
    cell.setAttribute('aria-pressed', turned ? 'false' : 'true');
  });
}

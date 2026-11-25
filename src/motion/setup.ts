// Sitenin genel hareketi: yükleme ekranı (asansör katları sayar, kapılar açılır), sayfa geçişi
// (kapılar kapanır, göstergede gidilen sayfanın adı yazar, kapılar açılır) ve diğer modüller.
import { gsap } from 'gsap';
import { setTransition, ease } from '../engine';
import { ledSVG } from './led';
import { kesit } from './kesit';
import { lift } from './lift';
import { ui } from './ui';

const labels: [RegExp, string][] = [
  [/^\/$/, 'ANA SAYFA'],
  [/^\/projeler\/?$/, 'PROJELER'],
  [/^\/projeler\/esentepe-park/, 'ESENTEPE'],
  [/^\/projeler\/goztepe-14/, 'GÖZTEPE 14'],
  [/^\/projeler\/cevizli-evleri/, 'CEVİZLİ'],
  [/^\/projeler\/tasdelen-konaklari/, 'TAŞDELEN'],
  [/^\/ilanlar\/?$/, 'İLANLAR'],
  [/^\/kentsel-donusum/, 'DÖNÜŞÜM'],
  [/^\/iletisim/, 'İLETİŞİM'],
  [/^\/kvkk/, 'KVKK'],
];
const labelFor = (rawPath: string) => {
  const path = rawPath.replace(import.meta.env.BASE_URL.replace(/\/$/, ''), '') || '/';
  const ilan = path.match(/^\/ilanlar\/([a-z]+-\d+)/i);
  if (ilan) return ilan[1].toUpperCase();
  return labels.find(([re]) => re.test(path))?.[1] ?? '--';
};

let destination = '/';
let goingUp = false;

export function setupMotion() {
  // Hedef sayfayı tıklamadan önce yakala (kapı göstergesi onu yazacak).
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest?.('a');
    if (!a || !a.href) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin) return;
    destination = u.pathname;
    goingUp = u.pathname.split('/').filter(Boolean).length < location.pathname.split('/').filter(Boolean).length;
  }, true);

  setTransition({
    leave: (c) => {
      const screen = c.querySelector<HTMLElement>('.doors__screen')!;
      screen.querySelector<HTMLElement>('[data-led-word]')!.innerHTML = ledSVG(labelFor(destination));
      screen.querySelector<HTMLElement>('[data-led-arrow]')!.innerHTML = ledSVG(goingUp ? '▲' : '▼');
      return gsap
        .timeline()
        .set(c, { autoAlpha: 1 })
        .set(screen, { autoAlpha: 0 })
        .fromTo(c.querySelector('.door--l'), { xPercent: -100 }, { xPercent: 0, duration: 0.7, ease: ease.inOut }, 0)
        .fromTo(c.querySelector('.door--r'), { xPercent: 100 }, { xPercent: 0, duration: 0.7, ease: ease.inOut }, 0)
        .to(screen, { autoAlpha: 1, duration: 0.25 }, 0.5);
    },
    enter: (c) =>
      gsap
        .timeline()
        .to(c.querySelector('.doors__screen'), { autoAlpha: 0, duration: 0.2 }, 0.15)
        .to(c.querySelector('.door--l'), { xPercent: -100, duration: 0.8, ease: ease.inOut }, 0.25)
        .to(c.querySelector('.door--r'), { xPercent: 100, duration: 0.8, ease: ease.inOut }, 0.25)
        .set(c, { autoAlpha: 0 }),
  });

  kesit();
  lift();
  ui();
}

// Asansör göstergesi: sayfanın hangi katında olduğunuzu ve kaydırma yönünü gösterir.
// Her sayfa kendi katlarını [data-floor] bölümleriyle tanımlar; gösterge düğmesi o katların listesini açar.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onPage, onScroll, prefersReducedMotion, scrollToTarget } from '../engine';
import { ledSVG } from './led';

let lastCode = '';

export function renderCode(el: HTMLElement, code: string, dir = 0) {
  if (code === lastCode && el.childElementCount) return;
  lastCode = code;
  const next = document.createElement('span');
  next.className = 'lift__glyphs';
  next.innerHTML = ledSVG(code, { min: 2 });
  const prev = [...el.children] as HTMLElement[];
  el.appendChild(next);
  if (prefersReducedMotion() || !dir || !prev.length) { prev.forEach((p) => p.remove()); return; }
  gsap.fromTo(next, { yPercent: dir * 110 }, { yPercent: 0, duration: 0.45, ease: 'power3.out' });
  prev.forEach((p) => gsap.to(p, { yPercent: -dir * 110, duration: 0.45, ease: 'power3.out', onComplete: () => p.remove() }));
}

export function lift() {
  const root = () => document.querySelector<HTMLElement>('[data-lift]');
  let arrowTimer: gsap.core.Tween | null = null;
  let arrowState = 0;

  const setArrow = (el: HTMLElement | null, dir: number) => {
    if (!el || dir === arrowState) return;
    arrowState = dir;
    el.innerHTML = ledSVG(dir > 0 ? '▼' : dir < 0 ? '▲' : ' ');
  };

  onScroll(({ velocity }) => {
    const r = root();
    if (!r || Math.abs(velocity) < 0.4) return;
    const arrow = r.querySelector<HTMLElement>('[data-lift-arrow]');
    setArrow(arrow, velocity > 0 ? 1 : -1);
    arrowTimer?.kill();
    arrowTimer = gsap.delayedCall(0.9, () => setArrow(arrow, 0));
  });

  onPage(() => {
    const r = root();
    if (!r) return;
    const btn = r.querySelector<HTMLButtonElement>('[data-lift-btn]')!;
    const panel = r.querySelector<HTMLElement>('[data-lift-panel]')!;
    const list = panel.querySelector<HTMLOListElement>('ol')!;
    const code = r.querySelector<HTMLElement>('[data-lift-code]')!;
    const name = r.querySelector<HTMLElement>('[data-lift-name]')!;
    const floors = [...document.querySelectorAll<HTMLElement>('section[data-floor], footer[data-floor]')];
    lastCode = '';
    arrowState = 2;
    setArrow(r.querySelector('[data-lift-arrow]'), 0);

    list.innerHTML = floors
      .map((f) => `<li><a href="#${f.id}" data-floor-link="${f.id}"><span class="lift__k">${f.dataset.floor}</span><span>${f.dataset.floorName}</span><span class="lift__kot">${f.dataset.kot ?? ''}</span></a></li>`)
      .join('');
    btn.hidden = floors.length === 0;

    const set = (f: HTMLElement, dir = 0) => {
      renderCode(code, f.dataset.floor || '', dir);
      name.textContent = f.dataset.floorName || '';
      btn.setAttribute('aria-label', `Katlar menüsü. Şu an: ${f.dataset.floorName}`);
      list.querySelectorAll('a').forEach((a) => a.toggleAttribute('aria-current', a.dataset.floorLink === f.id));
    };
    if (floors[0]) set(floors[0]);
    floors.forEach((f) =>
      ScrollTrigger.create({
        trigger: f,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => self.isActive && set(f, self.direction),
      }),
    );

    const open = (v: boolean) => {
      btn.setAttribute('aria-expanded', String(v));
      panel.hidden = !v;
      if (v) (panel.querySelector<HTMLAnchorElement>('a[aria-current]') ?? panel.querySelector<HTMLAnchorElement>('a'))?.focus();
    };
    const onBtn = () => open(!!panel.hidden);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !panel.hidden) { open(false); btn.focus(); } };
    const onDoc = (e: Event) => { if (!panel.hidden && !r.contains(e.target as Node)) open(false); };
    const onLink = (e: Event) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[data-floor-link]');
      if (!a) return;
      e.preventDefault();
      open(false);
      const t = document.getElementById(a.dataset.floorLink!);
      if (t) { scrollToTarget(t); t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
    };
    btn.addEventListener('click', onBtn);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDoc);
    list.addEventListener('click', onLink);
    return () => {
      open(false);
      btn.removeEventListener('click', onBtn);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDoc);
      list.removeEventListener('click', onLink);
    };
  });
}

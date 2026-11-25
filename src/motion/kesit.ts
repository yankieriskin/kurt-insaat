// Kesit davranışı: kesim çizgisi (işaretçi, daire, boşta salınım) ve asansör kabini.
// Tek saat: gsap.ticker. Görünmüyorsa durur. Azaltılmış harekette çizgi ve kabin anında yer değiştirir.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onPage, prefersReducedMotion } from '../engine';

export type UnitInfo = {
  no: number; floor: number; side: 0 | 1; type: string; net: number; brut: number; facade: string; extra: string;
  status: string; statusLabel: string; price: string; floorName: string; x0: number; x1: number;
};

export function kesit() {
  onPage(() => {
    const offs = [...document.querySelectorAll<HTMLElement>('[data-kesit]')].map(init);
    return () => offs.forEach((f) => f());
  });
}

function init(fig: HTMLElement) {
  const svg = fig.querySelector<SVGSVGElement>('svg')!;
  const clip = fig.querySelector<SVGRectElement>('[data-kesit-clip]')!;
  const cut = fig.querySelector<SVGGElement>('[data-kesit-cut]')!;
  const cabin = fig.querySelector<SVGGElement>('[data-kesit-cabin]')!;
  const cable = fig.querySelector<SVGLineElement>('[data-kesit-cable]')!;
  const readout = fig.querySelector<HTMLElement>('[data-kesit-readout]');
  const select = fig.dataset.mode === 'select';
  const d = fig.dataset;
  const bx0 = +d.bx0!, bx1 = +d.bx1!, FH = +d.fh!, T = +d.t!, yG = +d.yg!, N = +d.n!;
  const yL = (l: number) => yG - l * FH;
  const cabinY = (l: number) => yL(l + 1) + T + 7;
  const base = bx0 + (bx1 - bx0) * 0.5;
  let t0 = -1;
  const reduced = prefersReducedMotion();
  const units = [...fig.querySelectorAll<SVGAElement>('.u')];
  const infoOf = (a: Element) => JSON.parse((a as SVGAElement).dataset.unit!) as UnitInfo;

  const s = { x: base, target: base, cab: +(cabin.dataset.cabFloor || 0) };
  let mode: 'idle' | 'pointer' | 'unit' = 'idle';
  let hovered: SVGAElement | null = null;
  let selected: SVGAElement | null = null;
  let running = false;
  let cabTween: gsap.core.Tween | null = null;
  let idleCall: gsap.core.Tween | null = null;
  let release: gsap.core.Tween | null = null;

  const apply = () => {
    clip.setAttribute('x', s.x.toFixed(2));
    cut.setAttribute('transform', `translate(${s.x.toFixed(2)} 0)`);
  };
  const applyCab = () => {
    const y = cabinY(s.cab);
    cabin.setAttribute('transform', `translate(0 ${y.toFixed(2)})`);
    cable.setAttribute('y2', y.toFixed(2));
  };
  const moveCab = (floor: number) => {
    cabTween?.kill();
    if (reduced) { s.cab = floor; return applyCab(); }
    const dist = Math.abs(floor - s.cab);
    if (dist < 0.01) return;
    cabTween = gsap.to(s, { cab: floor, duration: 0.5 + dist * 0.22, ease: 'power2.inOut', onUpdate: applyCab });
  };

  // Boşta: kabin gerçek bir asansör gibi katlar arasında gidip gelir.
  const idleCab = () => {
    idleCall?.kill();
    idleCall = gsap.delayedCall(2.4 + Math.random() * 2.2, () => {
      if (mode === 'idle' && running) {
        let f = Math.floor(Math.random() * (N + 1));
        if (f === Math.round(s.cab)) f = (f + 2) % (N + 1);
        moveCab(f);
      }
      idleCab();
    });
  };

  const tick = (time: number) => {
    if (t0 < 0) t0 = time;
    if (mode === 'idle') s.target = base + Math.sin((time - t0) * 0.3) * (bx1 - bx0) * 0.17;
    const k = 1 - Math.pow(mode === 'idle' ? 0.97 : 0.86, gsap.ticker.deltaRatio());
    const nx = s.x + (s.target - s.x) * k;
    if (Math.abs(nx - s.x) > 0.01) { s.x = nx; apply(); }
  };

  const setTarget = (x: number) => {
    s.target = Math.min(bx1 + 6, Math.max(bx0 - 6, x));
    if (reduced || !running) { s.x = s.target; apply(); }
  };

  const write = (i: UnitInfo) => {
    if (!readout) return;
    const q = (k: string) => readout.querySelector<HTMLElement>(`[data-r="${k}"]`)!;
    q('title').textContent = `Daire ${i.no}`;
    q('line').textContent = `${i.floorName}, ${i.type}, net ${i.net} m², ${i.facade.toLocaleLowerCase('tr')} cephe${i.extra ? `, ${i.extra.toLocaleLowerCase('tr')}` : ''}`;
    q('price').textContent = i.price ? `${i.price}, ${i.statusLabel.toLocaleLowerCase('tr')}` : i.statusLabel;
  };

  const focusUnit = (a: SVGAElement) => {
    hovered = a;
    mode = 'unit';
    release?.kill();
    const i = infoOf(a);
    units.forEach((u) => u.classList.toggle('is-hover', u === a));
    setTarget(i.x1 + 5);
    moveCab(i.floor);
    write(i);
  };
  const blurUnit = () => {
    hovered = null;
    units.forEach((u) => u.classList.remove('is-hover'));
    if (selected) write(infoOf(selected));
  };
  const toIdle = () => {
    blurUnit();
    if (selected) { const i = infoOf(selected); mode = 'unit'; setTarget(i.x1 + 5); moveCab(i.floor); return; }
    mode = 'idle';
    if (reduced) setTarget(base);
  };

  const svgX = (e: PointerEvent) => {
    const m = svg.getScreenCTM();
    if (!m) return s.x;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return pt.x;
  };

  const onMove = (e: PointerEvent) => {
    const a = (e.target as Element).closest<SVGAElement>('.u');
    if (a) { if (a !== hovered) focusUnit(a); return; }
    if (hovered) blurUnit();
    mode = 'pointer';
    release?.kill();
    setTarget(svgX(e));
  };
  const onLeave = () => {
    release?.kill();
    release = gsap.delayedCall(0.6, toIdle);
  };
  const onDown = (e: PointerEvent) => { if (e.pointerType !== 'mouse') onMove(e); };
  const onUp = (e: PointerEvent) => { if (e.pointerType !== 'mouse') { release?.kill(); release = gsap.delayedCall(2.2, toIdle); } };

  svg.addEventListener('pointermove', onMove);
  svg.addEventListener('pointerdown', onDown);
  svg.addEventListener('pointerup', onUp);
  svg.addEventListener('pointerleave', onLeave);
  svg.addEventListener('pointercancel', onLeave);

  const offs: (() => void)[] = [];
  units.forEach((a) => {
    const f = () => focusUnit(a);
    const b = () => { blurUnit(); onLeave(); };
    a.addEventListener('focus', f);
    a.addEventListener('blur', b);
    offs.push(() => { a.removeEventListener('focus', f); a.removeEventListener('blur', b); });
    if (select) {
      const c = (e: Event) => {
        e.preventDefault();
        choose(a);
      };
      a.addEventListener('click', c);
      offs.push(() => a.removeEventListener('click', c));
    }
  });

  const choose = (a: SVGAElement, emit = true) => {
    selected = a;
    units.forEach((u) => u.classList.toggle('is-selected', u === a));
    focusUnit(a);
    if (emit) fig.dispatchEvent(new CustomEvent('kesit:select', { detail: infoOf(a), bubbles: true }));
  };
  // Dışarıdan seçim (tablo satırı): figure üstüne 'kesit:choose' olayı
  const onChoose = (e: Event) => {
    const no = (e as CustomEvent<number>).detail;
    const a = units.find((u) => infoOf(u).no === no);
    if (a) choose(a, false);
  };
  fig.addEventListener('kesit:choose', onChoose);

  if (select) {
    const first = units.find((u) => infoOf(u).status === 'satista') ?? units[0];
    if (first) { selected = first; first.classList.add('is-selected'); }
  }

  const start = () => {
    if (running || reduced) return;
    running = true;
    gsap.ticker.add(tick);
    idleCab();
  };
  const stop = () => {
    running = false;
    gsap.ticker.remove(tick);
    idleCall?.kill();
  };
  const st = ScrollTrigger.create({ trigger: fig, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? start() : stop()) });
  if (st.isActive) start();
  if (selected) { mode = 'unit'; const i = infoOf(selected); s.x = s.target = i.x1 + 5; apply(); }

  return () => {
    stop();
    release?.kill();
    cabTween?.kill();
    st.kill();
    svg.removeEventListener('pointermove', onMove);
    svg.removeEventListener('pointerdown', onDown);
    svg.removeEventListener('pointerup', onUp);
    svg.removeEventListener('pointerleave', onLeave);
    svg.removeEventListener('pointercancel', onLeave);
    fig.removeEventListener('kesit:choose', onChoose);
    offs.forEach((f) => f());
  };
}

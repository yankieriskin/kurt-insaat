// Sayfa parçaları: alttan açılan çekmeceler, kayan listeler, ilan süzgeci, daire seçimi, proje sekmeleri, galeri, WhatsApp formları.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onPage, onScroll, prefersReducedMotion, stopScroll, startScroll, ease } from '../engine';
import type { UnitInfo } from './kesit';

export function ui() {
  headerState();
  sheets();
  rails();
  ptabs();
  filters();
  unitPicker();
  gallery();
  waForms();
  bars();
}

/* İş programı ve ilerleme çubukları soldan dolar */
function bars() {
  onPage(() => {
    if (prefersReducedMotion()) return;
    document.querySelectorAll<HTMLElement>('[data-bars]').forEach((wrap) => {
      gsap.from(wrap.querySelectorAll('[data-bar]'), {
        scaleX: 0, duration: 1.3, ease: ease.out, stagger: 0.07,
        scrollTrigger: { trigger: wrap, start: 'top 82%', once: true },
      });
    });
  });
}

/* Başlık: sayfa kayınca alt çizgi alır. Bilgisayardaki yüzen alt panel aşağı kayarken çekilir, yukarı kayınca döner. */
function headerState() {
  const html = document.documentElement;
  onScroll(({ y, velocity }) => {
    html.classList.toggle('is-scrolled', y > 8);
    if (y < 240 || velocity < -0.8) html.classList.remove('dock-away');
    else if (velocity > 0.8) html.classList.add('dock-away');
  });
  onPage(() => { html.classList.toggle('is-scrolled', scrollY > 8); html.classList.remove('dock-away'); });
}

/* Alttan açılan çekmece (<dialog>): kaydırarak, dışına dokunarak, Escape ya da Kapat ile kapanır. */
function sheets() {
  onPage(() => {
    const offs = [...document.querySelectorAll<HTMLDialogElement>('dialog[data-sheet]')].map((dlg) => {
      let closing = false;
      const openers = [...document.querySelectorAll<HTMLElement>(`[data-sheet-open="${dlg.id}"]`)];
      const reduced = prefersReducedMotion();
      const open = (e: Event) => {
        e.preventDefault();
        if (dlg.open) return;
        dlg.showModal();
        stopScroll();
        if (!reduced) gsap.fromTo(dlg, { yPercent: 100, y: 0 }, { yPercent: 0, duration: 0.55, ease: ease.out, overwrite: true });
      };
      const finish = () => { closing = false; gsap.set(dlg, { clearProps: 'transform' }); if (dlg.open) dlg.close(); };
      const close = () => {
        if (!dlg.open || closing) return;
        closing = true;
        if (reduced) finish();
        else gsap.to(dlg, { yPercent: 100, duration: 0.35, ease: ease.inOut, overwrite: true, onComplete: finish });
      };
      const onCancel = (e: Event) => { e.preventDefault(); close(); };
      const onClick = (e: MouseEvent) => {
        if ((e.target as Element).closest('[data-sheet-close]')) { close(); return; }
        if (e.target !== dlg) return;
        const r = dlg.getBoundingClientRect();
        if (e.clientY < r.top || e.clientX < r.left || e.clientX > r.right) close();
      };
      const onClose = () => { closing = false; startScroll(); };
      // tutamaktan aşağı sürükleyince kapanır
      const grip = dlg.querySelector<HTMLElement>('[data-sheet-grip]');
      let y0 = 0, dy = 0, drag = false;
      const down = (e: PointerEvent) => { drag = true; y0 = e.clientY; dy = 0; grip!.setPointerCapture(e.pointerId); };
      const move = (e: PointerEvent) => { if (!drag) return; dy = Math.max(0, e.clientY - y0); gsap.set(dlg, { y: dy }); };
      const up = () => {
        if (!drag) return;
        drag = false;
        if (dy > 80) { closing = true; gsap.to(dlg, { y: dlg.offsetHeight, duration: 0.3, ease: ease.out, onComplete: finish }); }
        else gsap.to(dlg, { y: 0, duration: 0.35, ease: ease.out });
      };
      openers.forEach((o) => o.addEventListener('click', open));
      dlg.addEventListener('cancel', onCancel);
      dlg.addEventListener('click', onClick);
      dlg.addEventListener('close', onClose);
      grip?.addEventListener('pointerdown', down);
      grip?.addEventListener('pointermove', move);
      grip?.addEventListener('pointerup', up);
      grip?.addEventListener('pointercancel', up);
      return () => {
        openers.forEach((o) => o.removeEventListener('click', open));
        dlg.removeEventListener('cancel', onCancel);
        dlg.removeEventListener('click', onClick);
        dlg.removeEventListener('close', onClose);
        grip?.removeEventListener('pointerdown', down);
        grip?.removeEventListener('pointermove', move);
        grip?.removeEventListener('pointerup', up);
        grip?.removeEventListener('pointercancel', up);
        if (dlg.open) dlg.close();
      };
    });
    return () => offs.forEach((f) => f());
  });
}

/* Yatay kayan listeler: kaçıncı kartta olunduğu sayılır, bilgisayarda oklarla kayar. Kaydırma dinleyicisi yok, görünürlük gözlemcisi var. */
function rails() {
  onPage(() => {
    // Telefonda yana kayan ama içinde bağlantı olmayan kutular klavyeyle de kaydırılabilsin
    document.querySelectorAll<HTMLElement>('.antet, .types').forEach((el) => {
      if (el.scrollWidth > el.clientWidth + 1) el.tabIndex = 0;
      else el.removeAttribute('tabindex');
    });
    const offs = [...document.querySelectorAll<HTMLElement>('[data-rail]')].map((rail) => {
      const items = [...rail.children] as HTMLElement[];
      if (!items.length) return () => {};
      const counters = [...document.querySelectorAll<HTMLElement>(`[data-rail-count="${rail.id}"]`)];
      const prev = document.querySelector<HTMLButtonElement>(`[data-rail-prev="${rail.id}"]`);
      const next = document.querySelector<HTMLButtonElement>(`[data-rail-next="${rail.id}"]`);
      const ratio = new Map<HTMLElement, number>();
      const update = () => {
        const seen = items.filter((el) => (ratio.get(el) ?? 0) >= 0.6);
        if (seen.length) counters.forEach((c) => (c.textContent = String(items.indexOf(seen[0]) + 1)));
        if (prev) prev.disabled = (ratio.get(items[0]) ?? 0) > 0.97;
        if (next) next.disabled = (ratio.get(items[items.length - 1]) ?? 0) > 0.97;
      };
      const io = new IntersectionObserver((es) => { es.forEach((e) => ratio.set(e.target as HTMLElement, e.intersectionRatio)); update(); }, { root: rail, threshold: [0, 0.6, 0.98] });
      items.forEach((el) => io.observe(el));
      const step = (d: number) => () => {
        const w = items[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(rail).columnGap) || 0);
        const per = Math.max(1, Math.floor((rail.clientWidth + 1) / w));
        rail.scrollBy({ left: d * w * per, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      };
      const p = step(-1), n = step(1);
      prev?.addEventListener('click', p);
      next?.addEventListener('click', n);
      return () => { io.disconnect(); prev?.removeEventListener('click', p); next?.removeEventListener('click', n); };
    });
    return () => offs.forEach((f) => f());
  });
}

/* Proje sayfası: yapışkan bölüm sekmeleri, okunan bölümü işaretler */
function ptabs() {
  onPage(() => {
    const nav = document.querySelector<HTMLElement>('[data-ptabs]');
    if (!nav) return;
    const list = nav.querySelector<HTMLElement>('ul')!;
    const links = [...nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
    const set = (a: HTMLAnchorElement | null) => {
      links.forEach((l) => (l === a ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current')));
      if (a) list.scrollTo({ left: a.offsetLeft - 12, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    };
    links.forEach((a) => {
      const t = document.querySelector<HTMLElement>(a.hash);
      if (!t) return;
      ScrollTrigger.create({ trigger: t, start: 'top 35%', end: 'bottom 35%', onToggle: (st) => { if (st.isActive) set(a); else if (a.hasAttribute('aria-current') && st.direction < 0 && a === links[0]) set(null); } });
    });
  });
}

/* İlan süzgeci: çipler + çekmece; adres çubuğuyla eşleşir, paylaşılabilir */
function filters() {
  onPage(() => {
    const form = document.querySelector<HTMLFormElement>('[data-filters]');
    const grid = document.querySelector<HTMLElement>('[data-results]');
    if (!form || !grid) return;
    const count = document.querySelector<HTMLElement>('[data-count]')!;
    const empty = document.querySelector<HTMLElement>('[data-empty]')!;
    const fcount = form.querySelector<HTMLElement>('[data-fcount]');
    const showBtn = form.querySelector<HTMLElement>('[data-count-btn]');
    const inlineReset = document.querySelector<HTMLElement>('[data-reset-inline]');
    const cards = [...grid.querySelectorAll<HTMLElement>('[data-l]')];
    const controls = () => [...form.elements] as HTMLInputElement[];
    const q = new URLSearchParams(location.search);
    for (const el of controls()) {
      if (!el.name || !q.has(el.name)) continue;
      const vals = q.getAll(el.name);
      if (el.type === 'checkbox' || el.type === 'radio') el.checked = vals.includes(el.value);
      else el.value = vals[0];
    }
    const run = () => {
      const f = new FormData(form);
      const tur = String(f.get('tur') || '');
      const odas = f.getAll('oda').map(String);
      const ilce = String(f.get('ilce') || '');
      const max = Number(f.get('max') || 0);
      const sira = String(f.get('sira') || 'yeni');
      let n = 0;
      for (const c of cards) {
        const d = c.dataset;
        const ok = (!tur || d.tur === tur) && (!odas.length || odas.includes(d.oda!)) && (!ilce || d.ilce === ilce) && (!max || Number(d.fiyat) <= max);
        c.hidden = !ok;
        if (ok) n++;
      }
      const sorted = [...cards].sort((a, b) => {
        if (sira === 'ucuz') return Number(a.dataset.fiyat) - Number(b.dataset.fiyat);
        if (sira === 'pahali') return Number(b.dataset.fiyat) - Number(a.dataset.fiyat);
        if (sira === 'genis') return Number(b.dataset.net) - Number(a.dataset.net);
        return Number(a.dataset.i) - Number(b.dataset.i);
      });
      sorted.forEach((c) => grid.appendChild(c));
      count.textContent = `${n} ilan`;
      if (showBtn) showBtn.textContent = n ? `${n} ilanı göster` : 'Uyan ilan yok';
      empty.hidden = n > 0;
      const inSheet = (ilce ? 1 : 0) + (max ? 1 : 0) + (sira !== 'yeni' ? 1 : 0);
      if (fcount) { fcount.textContent = String(inSheet); fcount.hidden = !inSheet; }
      if (inlineReset) inlineReset.hidden = !(tur || odas.length || inSheet);
      const p = new URLSearchParams();
      for (const [k, v] of f) if (v && !(k === 'sira' && v === 'yeni')) p.append(k, String(v));
      history.replaceState(history.state, '', `${location.pathname}${p.size ? `?${p}` : ''}`);
    };
    const reset = (e: Event) => { e.preventDefault(); form.reset(); run(); };
    const resets = [...document.querySelectorAll<HTMLElement>('[data-reset]')];
    const submit = (e: Event) => { e.preventDefault(); run(); };
    form.addEventListener('change', run);
    form.addEventListener('submit', submit);
    resets.forEach((r) => r.addEventListener('click', reset));
    run();
    return () => { form.removeEventListener('change', run); form.removeEventListener('submit', submit); resets.forEach((r) => r.removeEventListener('click', reset)); };
  });
}

/* Proje sayfası: kesit, tablo ve daire kartı birbirine bağlı */
function unitPicker() {
  onPage(() => {
    const fig = document.querySelector<HTMLElement>('[data-kesit][data-mode="select"]');
    const card = document.querySelector<HTMLElement>('[data-unit-card]');
    if (!fig || !card) return;
    const rows = [...document.querySelectorAll<HTMLTableRowElement>('[data-unit-row]')];
    const project = card.dataset.project || '';
    const waBase = card.dataset.wa || '';
    const set = (i: UnitInfo) => {
      const q = (k: string) => card.querySelector<HTMLElement>(`[data-c="${k}"]`)!;
      q('no').textContent = `Daire ${i.no}`;
      q('status').textContent = i.statusLabel;
      q('status').dataset.status = i.status;
      q('floor').textContent = i.floorName;
      q('type').textContent = i.type;
      q('net').textContent = `${i.net} m²`;
      q('brut').textContent = `${i.brut} m²`;
      q('facade').textContent = i.facade;
      q('extra').textContent = i.extra || 'Yok';
      q('price').textContent = i.price || (i.status === 'malik' ? 'Satılık değil' : 'Satıldı');
      const wa = card.querySelector<HTMLAnchorElement>('[data-c="wa"]')!;
      wa.href = `${waBase}${encodeURIComponent(`Merhaba, ${project} daire ${i.no} (${i.type}, ${i.floorName.toLocaleLowerCase('tr')}) hakkında bilgi almak istiyorum.`)}`;
      const plan = card.querySelector<HTMLAnchorElement>('[data-c="plan"]')!;
      plan.href = `#tip-${i.type.replace('+', '-')}`;
      const ab = document.querySelector<HTMLAnchorElement>('[data-ab-wa]');
      if (ab) {
        ab.href = wa.href;
        const sub = ab.querySelector<HTMLElement>('[data-ab-s]');
        if (sub) sub.textContent = `Daire ${i.no}, ${i.price || i.floorName.toLocaleLowerCase('tr')}`;
      }
      rows.forEach((r) => r.classList.toggle('is-selected', Number(r.dataset.unitRow) === i.no));
      card.classList.remove('is-flash');
      void card.offsetWidth;
      card.classList.add('is-flash');
    };
    const onSel = (e: Event) => set((e as CustomEvent<UnitInfo>).detail);
    fig.addEventListener('kesit:select', onSel);
    const offs = rows.map((r) => {
      const btn = r.querySelector('button')!;
      const c = () => {
        const no = Number(r.dataset.unitRow);
        fig.dispatchEvent(new CustomEvent('kesit:choose', { detail: no }));
        const a = fig.querySelector<SVGAElement>(`#kesit-d${no}`);
        if (a) set(JSON.parse(a.dataset.unit!));
        (innerWidth < 768 ? card : fig).scrollIntoView({ block: innerWidth < 768 ? 'center' : 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      };
      btn.addEventListener('click', c);
      return () => btn.removeEventListener('click', c);
    });
    return () => { fig.removeEventListener('kesit:select', onSel); offs.forEach((f) => f()); };
  });
}

/* Galeri: tam ekran görüntüleyici (<dialog>) */
function gallery() {
  onPage(() => {
    const dlg = document.querySelector<HTMLDialogElement>('[data-lightbox]');
    const items = [...document.querySelectorAll<HTMLAnchorElement>('[data-gallery] a[data-full]')];
    if (!dlg || !items.length) return;
    const img = dlg.querySelector('img')!;
    const cap = dlg.querySelector('[data-lb-cap]')!;
    const num = dlg.querySelector('[data-lb-num]')!;
    let i = 0;
    const show = (n: number) => {
      i = (n + items.length) % items.length;
      const a = items[i];
      img.src = a.dataset.full!;
      img.alt = a.querySelector('img')?.alt || '';
      cap.textContent = a.dataset.caption || img.alt;
      num.textContent = `${i + 1} / ${items.length}`;
    };
    const open = (e: Event) => {
      e.preventDefault();
      show(items.indexOf(e.currentTarget as HTMLAnchorElement));
      dlg.showModal();
      stopScroll();
    };
    const close = () => { dlg.close(); };
    const onClose = () => { startScroll(); items[i]?.focus(); };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') show(i + 1);
      if (e.key === 'ArrowLeft') show(i - 1);
    };
    const click = (e: Event) => {
      const t = e.target as Element;
      if (t.closest('[data-lb-next]')) show(i + 1);
      else if (t.closest('[data-lb-prev]')) show(i - 1);
      else if (t.closest('[data-lb-close]') || t === dlg) close();
    };
    items.forEach((a) => a.addEventListener('click', open));
    dlg.addEventListener('close', onClose);
    dlg.addEventListener('keydown', key);
    dlg.addEventListener('click', click);
    return () => {
      items.forEach((a) => a.removeEventListener('click', open));
      dlg.removeEventListener('close', onClose);
      dlg.removeEventListener('keydown', key);
      dlg.removeEventListener('click', click);
      if (dlg.open) dlg.close();
    };
  });
}

/* Formlar sunucuya gitmez: yazılanlar WhatsApp mesajı olarak açılır, kullanıcı kendisi gönderir. */
function waForms() {
  onPage(() => {
    const forms = [...document.querySelectorAll<HTMLFormElement>('form[data-wa]')];
    const offs = forms.map((form) => {
      const submit = (e: Event) => {
        e.preventDefault();
        if (!form.reportValidity()) return;
        const lines = [form.dataset.msg || 'Merhaba,'];
        for (const el of [...form.elements] as HTMLInputElement[]) {
          if (!el.name || !el.value || el.type === 'submit') continue;
          if ((el.type === 'radio' || el.type === 'checkbox') && !el.checked) continue;
          const label = form.querySelector(`label[for="${el.id}"]`)?.textContent?.replace(/\s*\(isteğe bağlı\)/, '').trim() || el.name;
          lines.push(`${label}: ${el.value}`);
        }
        const url = `https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(lines.join('\n'))}`;
        const w = window.open(url, '_blank', 'noopener');
        if (!w) location.href = url;
        const note = form.querySelector<HTMLElement>('[data-sent]');
        if (note) note.hidden = false;
      };
      form.addEventListener('submit', submit);
      return () => form.removeEventListener('submit', submit);
    });
    return () => offs.forEach((f) => f());
  });
}

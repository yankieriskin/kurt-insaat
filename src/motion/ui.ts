// Sayfa parçaları: mobil menü, proje listesi önizlemesi, ilan süzgeci, daire seçimi, galeri, WhatsApp formları.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onPage, onScroll, isTouch, prefersReducedMotion, stopScroll, startScroll, ease } from '../engine';
import type { UnitInfo } from './kesit';

export function ui() {
  headerState();
  menu();
  indexPreview();
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

/* Başlık: sayfa kayınca alt çizgi ve zemin rengi alır */
function headerState() {
  onScroll(({ y }) => document.documentElement.classList.toggle('is-scrolled', y > 8));
  onPage(() => { document.documentElement.classList.toggle('is-scrolled', scrollY > 8); });
}

/* Mobil menü: odak içeride kalır, Escape kapatır, odak düğmeye döner */
function menu() {
  onPage(() => {
    const btn = document.querySelector<HTMLButtonElement>('[data-menu-btn]');
    const panel = document.getElementById('menu');
    if (!btn || !panel) return;
    const links = () => [...panel.querySelectorAll<HTMLElement>('a, button')];
    const set = (open: boolean) => {
      btn.setAttribute('aria-expanded', String(open));
      btn.querySelector('[data-menu-label]')!.textContent = open ? 'Kapat' : 'Menü';
      document.documentElement.classList.toggle('menu-open', open);
      if (open) {
        panel.hidden = false;
        stopScroll();
        if (!prefersReducedMotion()) {
          gsap.fromTo(panel, { clipPath: 'inset(0% 50% 0% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: ease.inOut });
          gsap.fromTo(panel.querySelectorAll('.menu__big a'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: ease.out, stagger: 0.05, delay: 0.25 });
        }
        links()[0]?.focus();
      } else {
        startScroll();
        const done = () => { panel.hidden = true; };
        if (prefersReducedMotion()) done();
        else gsap.to(panel, { clipPath: 'inset(0% 50% 0% 50%)', duration: 0.5, ease: ease.inOut, onComplete: done });
      }
    };
    const toggle = () => set(btn.getAttribute('aria-expanded') !== 'true');
    const key = (e: KeyboardEvent) => {
      if (btn.getAttribute('aria-expanded') !== 'true') return;
      if (e.key === 'Escape') { set(false); btn.focus(); }
      if (e.key === 'Tab') {
        const l = [btn, ...links()];
        const i = l.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); l[l.length - 1].focus(); }
        else if (!e.shiftKey && i === l.length - 1) { e.preventDefault(); l[0].focus(); }
      }
    };
    const navClose = (e: Event) => { if ((e.target as Element).closest('a')) { document.documentElement.classList.remove('menu-open'); startScroll(); } };
    btn.addEventListener('click', toggle);
    document.addEventListener('keydown', key);
    panel.addEventListener('click', navClose);
    return () => {
      btn.removeEventListener('click', toggle);
      document.removeEventListener('keydown', key);
      panel.removeEventListener('click', navClose);
      document.documentElement.classList.remove('menu-open');
    };
  });
}

/* Proje listesi: masaüstünde imleci izleyen görsel */
function indexPreview() {
  onPage(() => {
    const list = document.querySelector<HTMLElement>('[data-index]');
    const box = document.querySelector<HTMLElement>('[data-preview]');
    if (!list || !box || isTouch() || prefersReducedMotion()) return;
    const img = box.querySelector('img')!;
    const x = gsap.quickTo(box, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(box, 'y', { duration: 0.6, ease: 'power3.out' });
    let px = 0, py = 0, shown = false;
    const move = (e: PointerEvent) => { px = e.clientX; py = e.clientY; x(px); y(py); };
    const show = (e: Event) => {
      const a = e.currentTarget as HTMLElement;
      if (img.getAttribute('src') !== a.dataset.img) img.src = a.dataset.img!;
      if (!shown) gsap.fromTo(box, { clipPath: 'inset(0% 50% 0% 50%)', autoAlpha: 1 }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: ease.out, overwrite: true });
      shown = true;
    };
    const hide = () => {
      if (!shown) return;
      shown = false;
      gsap.to(box, { clipPath: 'inset(0% 50% 0% 50%)', duration: 0.35, ease: ease.soft, overwrite: true, onComplete: () => { if (!shown) gsap.set(box, { autoAlpha: 0 }); } });
    };
    const hideNow = () => { shown = false; gsap.killTweensOf(box); gsap.set(box, { autoAlpha: 0, clipPath: 'inset(0% 50% 0% 50%)' }); };
    document.addEventListener('click', hideNow, true);
    const rows = [...list.querySelectorAll<HTMLAnchorElement>('a[data-img]')];
    rows.forEach((a) => a.addEventListener('pointerenter', show));
    list.addEventListener('pointerleave', hide);
    addEventListener('pointermove', move, { passive: true });
    const check = () => { if (shown && !list.contains(document.elementFromPoint(px, py))) hide(); };
    const off = onScroll(check);
    // Liste nasıl kayarsa kaysın (tekerlek, klavye, betik) görünümden çıkınca önizleme kapanır.
    ScrollTrigger.create({ trigger: list, start: 'top bottom', end: 'bottom top', onUpdate: check, onToggle: (st) => { if (!st.isActive) hide(); } });
    rows.slice(0, 4).forEach((a) => { const i = new Image(); i.src = a.dataset.img!; });
    return () => { removeEventListener('pointermove', move); document.removeEventListener('click', hideNow, true); off(); hideNow(); };
  });
}

/* İlan süzgeci: adres çubuğuyla eşleşir, paylaşılabilir */
function filters() {
  onPage(() => {
    const form = document.querySelector<HTMLFormElement>('[data-filters]');
    const grid = document.querySelector<HTMLElement>('[data-results]');
    if (!form || !grid) return;
    const count = document.querySelector<HTMLElement>('[data-count]')!;
    const empty = document.querySelector<HTMLElement>('[data-empty]')!;
    const cards = [...grid.querySelectorAll<HTMLElement>('[data-l]')];
    const q = new URLSearchParams(location.search);
    for (const [k, v] of q) {
      const el = form.elements.namedItem(k) as HTMLInputElement | RadioNodeList | null;
      if (el) (el as HTMLInputElement).value = v;
    }
    const run = () => {
      const f = new FormData(form);
      const tur = String(f.get('tur') || '');
      const oda = String(f.get('oda') || '');
      const ilce = String(f.get('ilce') || '');
      const max = Number(f.get('max') || 0);
      const sira = String(f.get('sira') || 'yeni');
      let n = 0;
      for (const c of cards) {
        const d = c.dataset;
        const ok = (!tur || d.tur === tur) && (!oda || d.oda === oda) && (!ilce || d.ilce === ilce) && (!max || Number(d.fiyat) <= max);
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
      empty.hidden = n > 0;
      const p = new URLSearchParams();
      for (const [k, v] of f) if (v && !(k === 'sira' && v === 'yeni')) p.set(k, String(v));
      history.replaceState(history.state, '', `${location.pathname}${p.size ? `?${p}` : ''}`);
    };
    const reset = (e: Event) => { e.preventDefault(); form.reset(); run(); };
    form.addEventListener('change', run);
    form.addEventListener('submit', (e) => { e.preventDefault(); run(); });
    form.querySelector('[data-reset]')?.addEventListener('click', reset);
    empty.querySelector('[data-reset]')?.addEventListener('click', reset);
    run();
    return () => form.removeEventListener('change', run);
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
        fig.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
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

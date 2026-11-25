// Astro adapter (ClientRouter). Call start(setup) once from the layout's <script>.
import { boot, cleanup, enter, leave, syncFlags } from './index';

let navigating = false;
let isBack = false;

export function start(setup?: () => void) {
  document.addEventListener('astro:before-preparation', (e) => {
    navigating = true;
    isBack = e.navigationType === 'traverse';
    if (isBack) return;
    const load = e.loader;
    e.loader = async () => { await Promise.all([leave(), load()]); };
  });
  document.addEventListener('astro:before-swap', () => cleanup());
  document.addEventListener('astro:after-swap', () => {
    syncFlags();
    const l = document.getElementById('loader');
    if (l) l.hidden = true;
  });
  document.addEventListener('astro:page-load', () => {
    if (!navigating) return void boot(setup);
    navigating = false;
    enter(isBack ? { transition: false, scrollTop: false } : undefined);
  });
  boot(setup);
}

// GitHub Pages için: derlenmiş sitedeki "/..." ile başlayan sabit yolların başına
// repo adını ekler (ör. /ilanlar/ → /kurt-insaat/ilanlar/). Gerçek alan adında gerekmez.
// Kullanım: node scripts/pages-base.mjs dist /kurt-insaat
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const [dir = 'dist', base = ''] = process.argv.slice(2);
const b = base.replace(/\/$/, '');
if (!b) process.exit(0);
const esc = b.slice(1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const attr = new RegExp(`(\\s(?:href|src|action|poster|data-href)=["'])/(?!/|${esc}/)`, 'g');
const css = new RegExp(`(url\\(\\s*["']?)/(?!/|${esc}/)`, 'g');

async function* walk(d) {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let n = 0;
for await (const f of walk(dir)) {
  const ext = extname(f);
  if (ext !== '.html' && ext !== '.css') continue;
  const src = await readFile(f, 'utf8');
  let out = src.replace(css, `$1${b}/`);
  if (ext === '.html') out = out.replace(attr, `$1${b}/`);
  if (out !== src) { await writeFile(f, out); n++; }
}
console.log(`pages-base: ${n} dosya güncellendi (${b})`);

// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Yayına almadan önce `site` adresini gerçek alan adıyla değiştirin (src/data/site.ts içindeki url ile aynı).
export default defineConfig({
  // SITE/BASE yalnızca GitHub Pages derlemesinde verilir (.github/workflows/pages.yml).
  site: process.env.SITE || 'https://kurtinsaat.com.tr',
  base: process.env.BASE || undefined,
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  build: { inlineStylesheets: 'auto' },
  trailingSlash: 'always',
});

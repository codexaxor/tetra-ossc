// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// NOTE: `site` is a placeholder until the client confirms the subdomain.
// Update this to e.g. https://ossc.tetrabd.com before the public launch.
export default defineConfig({
  site: 'https://ossc.tetrabd.com',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
});

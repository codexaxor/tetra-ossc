# Tetra OSSC — Product Catalogue & Quote Site

Static catalogue for **Tetra Private Limited's** OSSC water-treatment range. Visitors browse
25 products across 5 categories and request a quotation over **WhatsApp** (with call & email
backups). Built with **Astro**; branded to match [tetrabd.com](https://tetrabd.com).

See **[PRD.md](./PRD.md)** for full requirements and **Tetra_OSSC_Proposal.pdf** for the
client-facing proposal.

## Develop

```bash
npm install
npm run dev        # local dev server (http://localhost:4321)
npm run build      # static build to ./dist
npm run preview    # preview the production build
```

## Project structure

```
src/
  consts.ts               # site config, categories, WhatsApp/contact + wa.me helpers
  content.config.ts       # product content-collection schema
  content/products/*.md   # 25 product entries (frontmatter only)
  assets/products/*.jpg    # normalized product images (extracted from source PDFs)
  styles/global.css       # design tokens (brand #086abd / coral #eb5a3e, Poppins/Open Sans)
  layouts/Base.astro      # HTML shell, SEO/OG, header/footer/WhatsApp FAB
  components/              # Header, Footer, ProductCard, QuoteButtons, WhatsappFab
  pages/
    index.astro           # home
    about.astro
    404.astro
    category/[slug].astro # 5 category pages (with in-category filter)
    products/[slug].astro # 25 product detail pages
```

## Product images

Images are **extracted from the source catalogue PDFs** (client does not supply photos) and
normalized to consistent 800×800 white tiles. Astro optimizes them to responsive WebP at build.
To (re)generate from the PDFs, see the pipeline described in PRD §4.

Clean-ups applied: **#02 Non-return valve** — black background removed → white. **#15 20" PP
Filter Slim** — original was a low-res promo collage (third-party phone/price); replaced with a
clean slim-cartridge stand-in (mirrored from #17, same product family). Both are flagged to swap
for genuine photos when available.

## ⚠️ Placeholders pending client confirmation

Update these before launch (see PRD §6):

- `src/consts.ts` → `CONTACT.whatsapp`, `CONTACT.phone`, `CONTACT.email` (currently placeholders)
- `src/consts.ts` `SITE.url` and `astro.config.mjs` `site` → real subdomain
- `public/` → real logo if provided (currently a droplet favicon)

## Deploy

Static output in `dist/`. Deploys as-is to Netlify / Cloudflare Pages / Vercel. Set the
build command to `npm run build` and publish directory to `dist`.

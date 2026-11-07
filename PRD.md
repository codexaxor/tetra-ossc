# OSSC Product Catalogue & Quote Site — Product Requirements Document

| | |
|---|---|
| **Document version** | **v0.2.4** |
| **Status** | Build in progress — home reworked to a paginated, filterable listing |
| **Last updated** | 2026-09-18 |
| **Client** | Tetra Private Limited |
| **Parent site** | tetrabd.com (WordPress) |
| **Source material** | OSSC Product Catalogue — 25 listings (2 supplied PDFs) |

> **Note:** This PRD is a living document. It **will** change after client modifications.
> The version number (top of file) and the [Version History](#version-history) log at the
> bottom **must be updated on every change**. See [Versioning policy](#versioning-policy).
>
> This document and the client-facing **`Tetra_OSSC_Proposal.pdf`** are kept **consistent** —
> when one changes, reconcile the other.

---

## 0. Decisions locked

Confirmed with stakeholder. These set scope and stack.

| Question | Decision | Why |
|---|---|---|
| **Site type** | Catalogue + Quote request | Browse & inquire. No cart, checkout, online payment, or displayed prices — the source lists none ("contact for quotation"). |
| **Quote channel** | **WhatsApp (primary)** | The "Request a quote" / price action opens a WhatsApp chat (`wa.me` deep-link) pre-filled with the product name. **Call (`tel:`)** and **email (`mailto:`)** are backups. No backend needed. |
| **Product images** | **Extracted from source PDFs** | Client will **not** supply photos. We extract all images from the two catalogue PDFs and run them through a consistent treatment pipeline (see §4) so the set looks uniform across the theme. |
| **Integration** | Standalone subdomain | On a subdomain of tetrabd.com (exact name to be confirmed by client). Linked from the main site; does not touch the WordPress install. |
| **Stack** | Astro (static) | Content-driven SSG, near-zero JS, Markdown/JSON product data. Grows gradually; filters/search added later. |
| **Branding** | Match tetrabd.com | Reuse the parent site's palette, fonts & feel. Real design tokens extracted from the live site — see §4. |

---

## 1. Current status & context

- **Build starting now.** Docs reconciled (PRD v0.2.0 + proposal); toolchain confirmed (Node 22, npm 10, git, `pdfimages`/`pdftoppm`/ImageMagick for image extraction).
- **The two PDFs are the same 25 products, not two product sets.**
  - `[WIP] OSSC Product Catalogue.pdf` — the raw source (a plain SL / Product Name / Picture table).
  - `Tetra_OSSC_Product_Catalogue_Professional.pdf` — a redesigned edition of that same list, grouped into five categories. Its own note states the source shows no readable prices, so **no prices exist**.
- **The parent site is an informational NGO/WordPress site** for a social enterprise doing solar desalination in coastal Bangladesh — no shop today. OSSC (water-treatment components & accessories) is a commercial line being added alongside it, which is why a separate subdomain fits cleanly.
- **The product data is thin.** Each entry is a name plus one image — no descriptions, specs, SKUs, or prices. Several entries are variant groups (e.g. Solenoid valve 1/2″ / 3/4″ / 1″), so 25 listings map to ~40+ sellable variants.

### The observation that shapes everything

> Every product reads **"PRICE: CONTACT FOR CURRENT QUOTATION."** This is a **lead-generation
> catalogue**, not a transactional store. Effort goes into clean browsing and a frictionless quote
> request — which we route straight to **WhatsApp** — not carts, payment gateways, or inventory.

---

## 2. Goals & non-goals

### In scope
- Fast, mobile-first catalogue of the 25 OSSC listings, grouped by the 5 categories
- Category browse pages + individual product pages
- **Quote/enquiry via WhatsApp** as the primary channel, with **call** and **email** as backups — each pre-filled with the product context
- Search & filter by category (added once catalogue is populated)
- Consistent Tetra branding, header/footer linking back to tetrabd.com
- A consistent product-image pipeline (extract from PDFs → normalise → responsive)
- SEO basics, sitemap, Open Graph, decent Lighthouse scores

### Out of scope (for now)
- Shopping cart & checkout
- Online payment (bKash / SSLCommerz / card)
- Displayed prices & live inventory / stock levels — **client has no price requirement**
- User accounts / login
- Changes to the existing WordPress site
- Multi-language (Bangla) — flagged as a possible later phase

---

## 3. Product taxonomy & inventory

25 listings across 5 categories, extracted from the source catalogue. Variant counts noted where a listing covers multiple sizes. **All images are extracted from the source PDFs** (see §4 image pipeline).

### Category 1 — Valves, Heads & Pipe Fittings (01–07)

| SL | Listing | Variants / notes |
|---|---|---|
| 01 | Solenoid valve | 3 sizes — 1/2″, 3/4″, 1″ |
| 02 | Non-return valve | — |
| 03 | Carbon Head 1″ | — |
| 04 | Thread Tape | — |
| 05 | Male Adapter | 3 sizes — 2″, 1″, 1/2″ |
| 06 | Female Adapter | 3 sizes — 1″, 1/2″, 3/4″ |
| 07 | Union | 3 sizes — 1-1/2″, 1″, 3/4″ |

### Category 2 — Filter Media & Treatment Chemicals (08–14)

| SL | Listing | Variants / notes |
|---|---|---|
| 08 | Gravel 3/4 | — |
| 09 | Sand | — |
| 10 | Resin Cation | ion-exchange resin |
| 11 | Manganese Zeolite | — |
| 12 | Activated Carbon | — |
| 13 | Anthracite | — |
| 14 | Antiscalant (UK) -LF | — |

### Category 3 — PP Filtration Components (15–17)

| SL | Listing | Variants / notes |
|---|---|---|
| 15 | 20″ PP Filter (Logic) Slim | — |
| 16 | 20″ Jumbo PP Filter (Logic) | — |
| 17 | 30″ PP Filter (Logic) Slim | — |

### Category 4 — Adhesives & UV Components (18–20)

| SL | Listing | Variants / notes |
|---|---|---|
| 18 | ERA Gum UPVC | 2 sizes — 500 ml, 250 ml |
| 19 | 55 Watt UV | 3 items — set, lamp adaptor, lamp |
| 20 | 25 Watt UV | 3 items — set, lamp adaptor, lamp |

### Category 5 — Treatment Chemical, Storage & Control (21–25)

| SL | Listing | Variants / notes |
|---|---|---|
| 21 | Antiascelent Genesys LS | "Best Quality" (sic — spelling per source) |
| 22 | Jar 18 LTR | — |
| 23 | Change Over Switch 32 amp | Brand: Lotus · Origin: India |
| 24 | Radar Level Switch | — |
| 25 | Conductivity Monitor | — |

> **Data note:** spellings (e.g. "Antiascelent", "Swicth") are kept verbatim from the source and
> will be normalised with client sign-off.

---

## 4. Technical & content architecture

### Design tokens (verified from tetrabd.com rendered pages)

Sampled from the **live rendered** home and `/team/` pages (an earlier raw-HTML hex count was
misleading — `#086abd` was over-represented by icons and is **not** the brand identity). The real
brand is a **blue → indigo → purple** system with an **orange** accent and **serif display**
headings.

| Token | Value | Role |
|---|---|---|
| Primary (royal blue) | `#1f4e96` | Solid buttons, primary UI |
| Indigo | `#4a4dd6` | Core brand identity / gradient middle |
| Purple | `#6a5cd8` | Gradient end, highlights |
| Deep indigo (nav) | `#2f2a83` | Header/nav dark end |
| **Hero / header gradient** | `linear-gradient(135deg, #3a5aa0, #4a4dd6, #6a5cd8)` | Hero & header bands (echoes the parent) |
| Accent orange | `#fd8127` | Small accents / icon chips — use sparingly |
| Accent blue | `#255e97` | Eyebrows, links |
| Ink | `#1a1a1a` | Headings & body text |
| Surface | `#ffffff` | Page/base surface |
| **Display font** | **Playfair Display** (serif) | Large page & hero headings |
| **Heading / UI font** | **Poppins** | Section heads, buttons, labels |
| **Body font** | **Open Sans** | Body copy |

> **WhatsApp CTA colour:** keep WhatsApp green `#25d366` for the quote button so it's instantly
> recognisable — it sits well against the indigo/purple palette and stays distinct from the orange
> accent.

**Theme & chrome (mirrors tetrabd.com):**
- **Light theme only** — white page background, no dark mode (matches the parent site).
- **Header** — full-width indigo→purple **gradient bar** with the white Tetra triangle (triforce) mark, white nav, and a green WhatsApp "Quote" button.
- **Footer** — deep-indigo gradient block: centred Tetra logo, contact row (phone · email · address with light-blue icons), quick links, and copyright — structured like the parent footer.

### Stack & hosting
- **Astro** static build — HTML-first, JS only where needed (search/filter)
- Products as **content collections** (Markdown + typed frontmatter), one file per product — easy gradual authoring
- Images optimised at build (`astro:assets`), responsive `srcset`, lazy-loaded
- Host on **Netlify / Cloudflare Pages / Vercel** (static, free tier, CDN)
- Git repo + CI: push to `main` → auto-deploy

### Content model (per product)
- `title`, `slug`, `category`, `order`
- `image` — extracted-from-PDF asset, processed to the consistent treatment below
- `variants[]` — size/spec label (+ optional SKU)
- `shortDesc`, `specs{}`, `brand`, `origin` — all optional, fill over time
- `whatsappText` — optional per-product override for the pre-filled enquiry message
- `price` field reserved but **unused/hidden** — client has no price requirement; kept only so a future pivot is additive

### Image pipeline (extract → normalise → ship)
Because the client will not supply photos, image consistency is our responsibility:
1. **Extract** every product image from both PDFs at the highest available resolution (`pdfimages` / `pdftoppm`).
2. **Select** the best copy of each of the 25 (the two PDFs may hold different-quality copies).
3. **Normalise** for a uniform look across the theme:
   - consistent **aspect ratio** (square/4:3 product frame)
   - consistent **background** (clean white/neutral matching the surface token)
   - even **padding**, centred subject, trimmed borders
   - gentle clean-up/upscale where the source is small
4. **Crop out** third-party brand packaging/watermarks where feasible (see risks).
5. **Export** responsive sizes (e.g. 400/800/1200 w) + modern formats (WebP/AVIF) via `astro:assets`.
6. Provide a neutral **placeholder** for any image too poor to use, so layout stays consistent.

### Pages / information architecture
- **Home** — hero + the full **product listing** with a **category-filter dropdown** (in-place, shareable via `?cat=`) and **pagination** (9/page), plus the quote CTA. *(Replaces the earlier category-tiles + featured layout.)*
- **Category** (×5) — still generated for SEO/direct links; primary browsing is the home listing
- **Product detail** — image, variants, spec table, **"Request quote on WhatsApp"** (+ call/email)
- **About / Contact** — ties back to tetrabd.com; WhatsApp/call/email surfaced
- *(Optional later)* a standalone enquiry form page

**Global nav (kept lean, no repeated category links):** header = Home · Products · About · Quote;
footer = Home · Products · About · Get a quote · tetrabd.com. Categories are browsed via the
home dropdown rather than repeated across the chrome.

### Quote / inquiry flow (WhatsApp-first)
- **Primary:** every product's quote button opens `https://wa.me/<number>?text=<pre-filled message>` — message includes the product name (and variant if chosen).
- **Backups:** `tel:` call button and `mailto:` email button, both with product context.
- Global WhatsApp/call buttons in header/footer and a floating WhatsApp button on mobile.
- No backend or form service required for MVP. An optional multi-item "enquiry list" and/or a form that emails sales can come in a later phase.

---

## 5. Phased delivery

Ship gradually — each phase is independently useful and shippable.

### Phase 0 — Foundation & assets `Ship first`
Goal: repo, deploy pipeline, a Tetra-matched design system, and clean images — before product pages.
- Init Astro repo, CI/CD to a preview subdomain
- Encode extracted design tokens (colours, Poppins/Open Sans) into the theme
- Base layout, nav, footer, typography — one static page to prove the look
- **Run the image pipeline** — extract & normalise all 25 product images from the PDFs

### Phase 1 — Catalogue MVP `MVP`
Goal: a browsable catalogue with working WhatsApp quote requests — first usable release.
- Content model + all 25 products authored (names, images, variants, categories)
- Home, 5 category pages, product detail pages
- **WhatsApp quote buttons** wired (per-product pre-filled) + call/email backups
- Responsive, accessible, SEO basics, sitemap, launch on the confirmed subdomain

### Phase 2 — Discovery & multi-item inquiry `Next`
Goal: make a growing catalogue easy to navigate and inquire against.
- Client-side search + filters (category, keyword)
- Optional "enquiry list" → single WhatsApp message with several products
- Richer product content: descriptions, spec tables, brand/origin, galleries
- Analytics + basic lead tracking

### Phase 3 — Optional: commerce & localisation `Later / if needed`
Goal: only if the business later wants prices, transactions, or Bangla.
- Show prices (reveal the reserved price field) if an approved list ever exists
- Cart + checkout + payment gateway (bKash / SSLCommerz / card) — a larger, separate scope
- Bangla / bilingual content
- Light CMS (e.g. a headless CMS) so non-devs can add products

---

## 6. What I need from client

These unblock the build. None stop us starting; work proceeds on a preview URL meanwhile.

| # | Item | Detail | Status |
|---|---|---|---|
| 01 | **Subdomain & DNS access** | Confirm the subdomain name and who can add a DNS record — needed to point it at the static host. | ⏳ awaiting |
| 02 | **WhatsApp number (+ backups)** | The **WhatsApp business number** for quote enquiries (primary), plus an email and phone for the call/email backups. | ⏳ awaiting |
| 03 | **Brand assets** | Logo (SVG/PNG). Colours/fonts already extracted from the live site (see §4) — confirm they're correct. | ⏳ awaiting |
| 04 | ~~Clean product images~~ | **Resolved:** client will not supply photos → we extract & normalise from the PDFs (§4 pipeline). Quality is limited by the source; better originals can be swapped in later. | ✅ resolved |
| 05 | **Product copy & corrections** | Sign-off on cleaned names/spellings, and any short descriptions or specs to show. Can launch names-only and enrich later. | ⏳ awaiting |
| 06 | **Technical point of contact** | Who to coordinate with on domain/hosting, the WhatsApp number, and content questions. | ⏳ awaiting |
| 07 | **Hosting & repo preference** | Any preference among Netlify / Cloudflare Pages / Vercel, and where the git repo should live (GitHub org?). | ⏳ awaiting |

---

## 7. Assumptions & risks

- **Assumption:** the catalogue stays quote-based (WhatsApp) for the near term; the architecture reserves prices/cart so a later pivot to commerce is additive, not a rewrite.
- **Risk — image resolution:** the only image source is the PDFs, which are low-resolution. The normalise pipeline mitigates this, but sharpness is capped by the source. Mitigation: consistent framing/background so the set still looks intentional; swap in better photos later if provided.
- **Risk — image rights:** several source images show third-party brand packaging (Parker, Quikrete, Dynamic, Radar, etc.). Where feasible we crop to the product; flagged for the client's legal comfort, and generic/own imagery can replace them later.
- **Image clean-ups applied:** #02 Non-return valve — black background removed to white (corner floodfill + despeckle). #15 20″ PP Filter Slim — original source was a low-resolution promotional collage (with a third-party phone number/price); replaced with a clean slim-cartridge stand-in (mirrored from #17, same product family) pending a genuine photo. Both remain flagged to swap for real photos when available.
- **Risk — data completeness:** names-only launch is fine, but a catalogue with no specs/prices converts on trust and clarity of the enquiry path — so the WhatsApp/contact flow gets first-class attention.
- **Dependency:** the subdomain + WhatsApp number are the two external inputs needed for a public go-live; everything else can proceed on a preview URL.

---

## Versioning policy

This document uses **semantic-style versioning** `vMAJOR.MINOR.PATCH`:

- **MAJOR** — fundamental change in direction/scope (e.g. catalogue → full ecommerce, stack change).
- **MINOR** — new or materially changed requirements, sections, or product data.
- **PATCH** — clarifications, typo/wording fixes, small corrections with no requirement change.

**On every change:** bump the version at the top of this file, update **Last updated**, and add a
row to the [Version History](#version-history) table describing what changed and who requested it.

---

## Version History

| Version | Date | Author | Change summary |
|---|---|---|---|
| v0.2.4 | 2026-09-18 | Tetra dev team | Home reworked: replaced the "Shop by category" tiles + featured section with a **paginated, category-filterable product listing** (dropdown filter, 9/page, shareable `?cat=`). Slimmed the header nav (Home · Products · About · Quote) and footer to stop repeating the five category links across the chrome. |
| v0.2.3 | 2026-09-18 | Tetra dev team | Switched to **light theme only** (white background, dark mode removed). Rebuilt the **header** as an indigo→purple gradient bar with the white Tetra triforce logo + white nav, and the **footer** as a deep-indigo block (centred logo, contact row with icons, links, copyright) — both mirroring tetrabd.com. Added the real public company address to the footer. |
| v0.2.2 | 2026-09-18 | Tetra dev team | **Design-token correction.** Re-verified branding from the live rendered home + /team/ pages: the brand is a blue→indigo→purple gradient system (`#1f4e96` / `#4a4dd6` / `#6a5cd8`) with an orange accent (`#fd8127`) and **serif (Playfair Display) display headings** — not the flat `#086abd`/coral first recorded (that hex was over-counted from icons). Replaced §4 token table; site re-theme to follow. |
| v0.2.1 | 2026-09-18 | Tetra dev team | Image clean-ups: removed the black background on #02 Non-return valve; replaced the #15 20″ PP Filter Slim promo collage (third-party phone/price) with a clean slim-cartridge stand-in. Recorded in §7; status updated to reflect the in-progress Astro build (Phase 0 + Catalogue MVP scaffolded). |
| v0.2.0 | 2026-09-18 | Tetra dev team | Client alignment: quote channel locked to **WhatsApp** (call/email backups); **product images confirmed extracted from PDFs** (client won't supply) with a new image-pipeline spec; removed price ambiguity (no price requirement); added **real design tokens** extracted from tetrabd.com (`#086abd` primary, `#eb5a3e` accent, Poppins/Open Sans); updated flows, phases, client-needs & risks to match; reconciled with `Tetra_OSSC_Proposal.pdf`. |
| v0.1.0 | 2026-09-16 | Tetra dev team | Initial PRD draft — analysis of supplied catalogue, locked decisions (catalogue+quote / subdomain / Astro / match branding), product inventory, architecture, phased roadmap, open items & risks. |

<!--
  TEMPLATE for the next entry (copy, fill, and place at the top of the table body):
  | vX.Y.Z | YYYY-MM-DD | <author> | <what changed and why / who requested it> |
-->

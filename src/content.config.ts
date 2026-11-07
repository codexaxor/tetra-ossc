import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const CATEGORY_SLUGS = [
  'valves-fittings',
  'filter-media',
  'pp-filtration',
  'adhesives-uv',
  'chemical-storage-control',
] as const;

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number(),
      category: z.enum(CATEGORY_SLUGS),
      image: image(),
      // Size / spec variants covered by this listing (e.g. 1/2", 3/4", 1").
      variants: z.array(z.string()).default([]),
      brand: z.string().optional(),
      origin: z.string().optional(),
      // Short marketing line; optional — catalogue can launch names-only.
      shortDesc: z.string().optional(),
      note: z.string().optional(),
      featured: z.boolean().default(false),
      // Reserved for a future price reveal; unused for now (PRD §4).
      price: z.string().optional(),
    }),
});

export const collections = { products };

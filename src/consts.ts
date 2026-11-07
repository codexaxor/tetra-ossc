// ---------------------------------------------------------------------------
// Central site configuration for the OSSC catalogue.
// Values marked PLACEHOLDER are pending client confirmation (see PRD §6).
// ---------------------------------------------------------------------------

export const SITE = {
  name: 'Tetra OSSC',
  legalName: 'Tetra Private Limited',
  tagline: 'Water Treatment Components & Accessories',
  description:
    'Browse Tetra Private Limited’s OSSC range of water-treatment components — valves, filter media, treatment chemicals, PP filtration, UV and control equipment. Request a quotation on WhatsApp.',
  parentSite: 'https://tetrabd.com',
  url: 'https://ossc.tetrabd.com', // PLACEHOLDER — confirm subdomain with client
};

// Contact channels. WhatsApp is the primary quote channel (PRD decision).
// PLACEHOLDER numbers — replace with the client's real details before launch.
export const CONTACT = {
  // International format, digits only, no '+' or spaces (used in wa.me links).
  whatsapp: '8801000000000', // PLACEHOLDER
  phone: '+8801000000000', // PLACEHOLDER
  email: 'info@tetrabd.com', // PLACEHOLDER
  // Public company address (from tetrabd.com) — confirm/replace if needed.
  address: '218/3, Shefali Complex, Begum Rokeya Sarani, Dhaka 1207, Bangladesh',
};

/** Build a WhatsApp deep-link pre-filled with an enquiry message. */
export function waLink(message: string): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Standard product enquiry message. */
export function productEnquiry(title: string, variant?: string): string {
  const item = variant ? `${title} (${variant})` : title;
  return `Hello Tetra, I would like a quotation for: ${item}. Please share current pricing and availability.`;
}

export type CategorySlug =
  | 'valves-fittings'
  | 'filter-media'
  | 'pp-filtration'
  | 'adhesives-uv'
  | 'chemical-storage-control';

export interface Category {
  slug: CategorySlug;
  title: string;
  short: string;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: 'valves-fittings',
    title: 'Valves, Heads & Pipe Fittings',
    short: 'Valves & Fittings',
    blurb: 'Solenoid and non-return valves, control heads, adapters, unions and sealing tape.',
  },
  {
    slug: 'filter-media',
    title: 'Filter Media & Treatment Chemicals',
    short: 'Filter Media',
    blurb: 'Gravel, sand, resin, zeolite, activated carbon, anthracite and antiscalant.',
  },
  {
    slug: 'pp-filtration',
    title: 'PP Filtration Components',
    short: 'PP Filtration',
    blurb: 'Slim and jumbo polypropylene sediment filter cartridges.',
  },
  {
    slug: 'adhesives-uv',
    title: 'Adhesives & UV Components',
    short: 'Adhesives & UV',
    blurb: 'UPVC solvent cement and UV disinfection lamps, adaptors and sets.',
  },
  {
    slug: 'chemical-storage-control',
    title: 'Treatment Chemical, Storage & Control',
    short: 'Storage & Control',
    blurb: 'Dosing chemicals, storage jars, changeover switches and monitoring instruments.',
  },
];

export const categoryBySlug = (slug: string): Category | undefined =>
  CATEGORIES.find((c) => c.slug === slug);

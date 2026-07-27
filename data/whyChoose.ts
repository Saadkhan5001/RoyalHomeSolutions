import {
  BadgeDollarSign,
  Home,
  Workflow,
  CalendarClock,
  type LucideIcon,
} from "lucide-react";

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const whyChooseItems: WhyChooseItem[] = [
  {
    id: "fair-cash-offer",
    title: "Fair Cash Offer",
    description:
      "We review your property and situation so you can understand your selling options clearly.",
    icon: BadgeDollarSign,
  },
  {
    id: "sell-as-is",
    title: "Sell As-Is",
    description:
      "No repairs, cleaning, or updates required before reaching out.",
    icon: Home,
  },
  {
    id: "simple-guided-process",
    title: "Simple Guided Process",
    description:
      "Our team walks you through each step so you know what to expect.",
    icon: Workflow,
  },
  {
    id: "flexible-timeline",
    title: "Flexible Timeline",
    description:
      "Move forward on a timeline that works for your situation.",
    icon: CalendarClock,
  },
];

/**
 * Value badges shown in the Trust section. Deliberately no hard numbers —
 * these are qualitative promises, not unverified stats.
 */
export interface TrustBadge {
  id: string;
  label: string;
}

export const trustBadges: TrustBadge[] = [
  { id: "homeowners-helped", label: "Local Homeowners Helped" },
  { id: "simple-process", label: "Simple Selling Process" },
  { id: "no-repairs", label: "No Repairs Needed" },
  { id: "flexible-closing", label: "Flexible Closing Options" },
];

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: "g1",
    src: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85",
    alt: "Bright modern family home with a manicured lawn",
  },
  {
    id: "g2",
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
    alt: "Classic white two-storey home with a welcoming porch",
  },
  {
    id: "g3",
    src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85",
    alt: "Contemporary home with a pool on a sunny day",
  },
  {
    id: "g4",
    src: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85",
    alt: "Modern home with large glass windows at dusk",
  },
  {
    id: "g5",
    src: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1200&q=85",
    alt: "Suburban house with a landscaped front yard",
  },
];

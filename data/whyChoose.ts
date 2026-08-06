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
    id: "direct-buyer",
    title: "Direct Buyer, Not a Listing Agent",
    description:
      "We buy your house directly, so there is no listing process, no agent commission, and no waiting for a third-party buyer.",
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

/**
 * All five slides are real Royal Home Solutions photos — no stock imagery.
 * Ordered so the looping track alternates on-site portraits with work shots
 * rather than clustering two of a kind (including across the loop seam).
 * Files live in /public/Assets/Images (spaces URL-encoded).
 */
export const galleryImages: GalleryImage[] = [
  {
    id: "neighborhood-visit",
    src: "/Assets/Images/Jonah%20Stevens%207.jpeg",
    alt: "Jonah Stevens standing on a residential street in front of a two-storey home",
  },
  {
    id: "renovation-walkthrough",
    src: "/Assets/Images/Jonah%20Stevens%202.jpeg",
    alt: "Jonah Stevens walking a home mid-renovation, with fresh paint and new flooring going in",
  },
  {
    id: "property-visit",
    src: "/Assets/Images/Jonah%20Stevens%206.jpeg",
    alt: "Jonah Stevens outside a single-storey Florida home on a sunny day",
  },
  {
    id: "contractor-handshake",
    src: "/Assets/Images/Jonah%20Stevens%205.jpeg",
    alt: "Jonah Stevens shaking hands with a contractor beside a newly installed washer and dryer",
  },
  {
    id: "closing-paperwork",
    src: "/Assets/Images/Jonah%20Stevens%203.jpeg",
    alt: "Royal Home Solutions reviewing and signing closing paperwork with a homeowner",
  },
];

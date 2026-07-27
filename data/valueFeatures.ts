import {
  Wrench,
  Percent,
  MessageSquare,
  CalendarClock,
  type LucideIcon,
} from "lucide-react";

export interface ValueFeature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

/** Feature cards rendered in the left column of the value grid. */
export const valueFeaturesLeft: ValueFeature[] = [
  {
    id: "no-repairs",
    title: "No Repairs",
    description:
      "Sell your home exactly as it is today. No fixing, cleaning, or updating before you reach out.",
    icon: Wrench,
  },
  {
    id: "no-commissions",
    title: "No Agent Commissions",
    description:
      "Work directly with our team and keep more of your proceeds — no listing agent fees or commissions.",
    icon: Percent,
  },
];

/** Feature cards rendered in the right column of the value grid. */
export const valueFeaturesRight: ValueFeature[] = [
  {
    id: "clear-communication",
    title: "Fast, Clear Communication",
    description:
      "Honest answers and quick responses at every step, so you always know exactly what comes next.",
    icon: MessageSquare,
  },
  {
    id: "flexible-closing",
    title: "Flexible Closing",
    description:
      "Close on the timeline that fits your life — move quickly or take the time you need.",
    icon: CalendarClock,
  },
];

export interface ValueImage {
  id: string;
  src: string;
  alt: string;
}

/** Stacked imagery in the centre column of the value grid. */
export const valueImages: ValueImage[] = [
  {
    id: "v1",
    src: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1000&q=85",
    alt: "Modern home glowing warmly at twilight",
  },
  {
    id: "v2",
    src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
    alt: "Bright, comfortable open-plan living room",
  },
  {
    id: "v3",
    src: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1000&q=85",
    alt: "Lakeview home glowing at sunset",
  },
];

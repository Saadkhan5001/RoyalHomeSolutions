import { Home, CalendarCheck, Wallet, BadgeCheck, type LucideIcon } from "lucide-react";

export interface ProcessStep {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const processSteps: ProcessStep[] = [
  { id: "discover", label: "Discover House", icon: Home },
  { id: "schedule", label: "Schedule to Visit", icon: CalendarCheck },
  { id: "purchase", label: "Hassle-Free Purchase", icon: Wallet },
  { id: "buyback", label: "Buyback Guarantee", icon: BadgeCheck },
];

export interface ProcessSlide {
  id: string;
  heading: string;
  description: string;
  checklist: string[];
  image: string;
  imageAlt: string;
}

export const processSlides: ProcessSlide[] = [
  {
    id: "find-the-perfect-house",
    heading: "Find the perfect house",
    description:
      "Find your perfect home with personalized searches, expert guidance, and seamless viewings—all tailored to your dream lifestyle and budget.",
    checklist: [
      "Handpicked homes matching your needs",
      "Expert guidance every step of the buying journey",
      "Seamless process from search to closing",
    ],
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Advisor reviewing options with a client on a sofa",
  },
  {
    id: "schedule-with-confidence",
    heading: "Schedule with confidence",
    description:
      "Book viewings that fit your calendar and explore each property with a dedicated advisor who knows the neighbourhood inside out.",
    checklist: [
      "Flexible viewing times that suit you",
      "Local advisors with deep market insight",
      "Honest answers to every question",
    ],
    image:
      "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Two people discussing property paperwork at a table",
  },
  {
    id: "close-without-stress",
    heading: "Close without the stress",
    description:
      "From the offer to the keys in your hand, we handle the details so your move stays smooth, transparent, and entirely on your terms.",
    checklist: [
      "Clear, transparent paperwork",
      "Support through negotiation and closing",
      "A hassle-free path from offer to ownership",
    ],
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "New homeowners standing in front of their house",
  },
  {
    id: "buy-back-with-confidence",
    heading: "Buy back with confidence",
    description:
      "Change of plans? Our buyback guarantee lets you sell back with confidence, so your investment always stays protected.",
    checklist: [
      "Protected investment from day one",
      "Flexible buyback options that suit you",
      "Lasting peace of mind after you move in",
    ],
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Real estate advisor handing over house keys to a client",
  },
];

import {
  Home,
  ClipboardCheck,
  Scale,
  CalendarCheck,
  type LucideIcon,
} from "lucide-react";

export interface ProcessStep {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const processSteps: ProcessStep[] = [
  { id: "tell-us", label: "Tell Us About Your Property", icon: Home },
  { id: "home-review", label: "Get a Free Home Review", icon: ClipboardCheck },
  { id: "review-options", label: "Review Your Options", icon: Scale },
  { id: "close", label: "Close on Your Timeline", icon: CalendarCheck },
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
    id: "start-a-conversation",
    heading: "Start with a simple conversation",
    description:
      "Tell us a little about your property and your situation. There's no obligation and no pressure — just a straightforward first step.",
    checklist: [
      "No obligation",
      "No repairs required",
      "Clear next steps from our team",
    ],
    image:
      "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Homeowner talking with an advisor at a kitchen table",
  },
  {
    id: "get-a-free-home-review",
    heading: "Get a free home review",
    description:
      "Our team reviews your property and situation, then walks you through what your options could look like — in plain language.",
    checklist: [
      "Honest, no-pressure review",
      "We buy houses as-is",
      "Answers to all your questions",
    ],
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "A team reviewing property details together at a table",
  },
  {
    id: "review-your-options",
    heading: "Review your options",
    description:
      "Compare your paths forward with clear guidance. Choose what fits your goals — there's never any obligation to move ahead.",
    checklist: [
      "Transparent, easy to understand",
      "No hidden fees or commissions",
      "You decide what's right for you",
    ],
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Person reviewing paperwork and comparing options",
  },
  {
    id: "close-on-your-timeline",
    heading: "Close on your timeline",
    description:
      "Ready to move forward? We handle the details and close on the date that works for you — fast or flexible, your call.",
    checklist: [
      "Flexible closing dates",
      "We handle the details",
      "Sell without the stress",
    ],
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Homeowner receiving keys after a smooth closing",
  },
];

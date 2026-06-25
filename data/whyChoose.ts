import { Users, Building2, Workflow, Crown, type LucideIcon } from "lucide-react";

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const whyChooseItems: WhyChooseItem[] = [
  {
    id: "expert-guidance",
    title: "Expert Guidance",
    description:
      "Get personalized support from experienced real estate professionals to help you navigate the property market with confidence and clarity.",
    icon: Users,
  },
  {
    id: "premium-selection",
    title: "Premium Property Selection",
    description:
      "Explore carefully selected properties that match your lifestyle, investment goals, and budget in the most desirable locations.",
    icon: Building2,
  },
  {
    id: "stress-free-process",
    title: "Stress-Free Process",
    description:
      "Stay ahead with the latest market trends, pricing insights, and neighborhood updates to make smarter property decisions.",
    icon: Workflow,
  },
  {
    id: "proven-track-record",
    title: "Proven Track Record",
    description:
      "Trust our years of experience and successful client relationships to deliver reliable real estate solutions and outstanding results.",
    icon: Crown,
  },
];

export interface TrustStat {
  id: string;
  value: string;
  label: string;
}

export const trustStats: TrustStat[] = [
  { id: "units", value: "+112", label: "Unit Already" },
  { id: "customers", value: "+17K", label: "Customer" },
  { id: "satisfied", value: "99%", label: "Satisfied" },
  { id: "reviews", value: "+41K", label: "Reviews" },
];

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: "g1",
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    alt: "Timber-clad modern home among greenery",
  },
  {
    id: "g2",
    src: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80",
    alt: "Family standing in front of a suburban house",
  },
  {
    id: "g3",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    alt: "Single-storey glass house with landscaped steps",
  },
  {
    id: "g4",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    alt: "Homeowner smiling beside a sunlit doorway",
  },
  {
    id: "g5",
    src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
    alt: "Contemporary villa with a manicured front garden",
  },
];

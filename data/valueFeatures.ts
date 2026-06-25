import { GraduationCap, Bus, Tag, Activity, type LucideIcon } from "lucide-react";

export interface ValueFeature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

/** Feature cards rendered in the left column of the value grid. */
export const valueFeaturesLeft: ValueFeature[] = [
  {
    id: "schools",
    title: "Schools",
    description:
      "Find homes in top-rated school districts by filtering listings to ensure the best education opportunities for your family.",
    icon: GraduationCap,
  },
  {
    id: "public-transport",
    title: "Public transport",
    description:
      "Find homes with excellent public transit access for a convenient, connected, and hassle-free commute.",
    icon: Bus,
  },
];

/** Feature cards rendered in the right column of the value grid. */
export const valueFeaturesRight: ValueFeature[] = [
  {
    id: "market-comparison",
    title: "Market comparison",
    description:
      "Find homes by filtering for bidding wars and recent market price updates to make informed buying decisions easily.",
    icon: Tag,
  },
  {
    id: "risk-insights",
    title: "Risk insights",
    description:
      "Filter homes by seismic risks, flood risks, and more to find a safe and secure property effortlessly.",
    icon: Activity,
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
    src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    alt: "White modern home on a hillside street",
  },
  {
    id: "v2",
    src: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
    alt: "Bright multi-storey residence under a clear blue sky",
  },
  {
    id: "v3",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    alt: "Contemporary house with glass façade and landscaping",
  },
];

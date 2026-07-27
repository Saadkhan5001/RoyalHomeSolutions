import {
  Building,
  ScrollText,
  Wrench,
  Clock,
  Truck,
  DoorClosed,
  type LucideIcon,
} from "lucide-react";

export interface SellerSituation {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

/**
 * The homeowner situations Royal Home Solutions can help with. Replaces the
 * old buyer-facing property listings — no prices, no fake houses for sale.
 */
export const sellerSituations: SellerSituation[] = [
  {
    id: "tired-landlords",
    title: "Tired Landlords",
    description:
      "Done with tenants, repairs, and management? Sell your rental as-is and move on.",
    icon: Building,
  },
  {
    id: "inherited-properties",
    title: "Inherited Properties",
    description:
      "Inherited a home you don't want to maintain? We make selling simple and stress-free.",
    icon: ScrollText,
  },
  {
    id: "homes-needing-repairs",
    title: "Homes Needing Repairs",
    description:
      "Skip the contractors and cleanup. We buy houses in any condition, exactly as they are.",
    icon: Wrench,
  },
  {
    id: "time-sensitive",
    title: "Foreclosure or Time-Sensitive Situations",
    description:
      "Facing a tight deadline? We help homeowners understand their options quickly.",
    icon: Clock,
  },
  {
    id: "relocation",
    title: "Relocation",
    description:
      "Moving for work or family? Sell fast and close on a timeline that fits your move.",
    icon: Truck,
  },
  {
    id: "vacant-properties",
    title: "Vacant Properties",
    description:
      "An empty home is a cost every month. Turn a vacant property into a simple cash sale.",
    icon: DoorClosed,
  },
];

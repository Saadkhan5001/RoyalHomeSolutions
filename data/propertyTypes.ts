import {
  Home,
  Building2,
  Building,
  Caravan,
  Trees,
  KeyRound,
  type LucideIcon,
} from "lucide-react";

/**
 * What Royal Home Solutions buys, shown on /sell-your-home.
 *
 * Deliberately criteria rather than listings — the company buys houses, it does
 * not sell them, so there is no inventory to show. Same reasoning as
 * `sellerSituations.ts`: no prices, no fake houses for sale.
 */

export interface PropertyType {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const propertyTypes: PropertyType[] = [
  {
    id: "single-family",
    title: "Single-Family Homes",
    description:
      "The homes we buy most often — any age, any size, in any neighborhood.",
    icon: Home,
  },
  {
    id: "condos-townhouses",
    title: "Condos & Townhouses",
    description:
      "Including units with outstanding HOA dues or special assessments.",
    icon: Building2,
  },
  {
    id: "multi-family",
    title: "Multi-Family",
    description:
      "Duplexes, triplexes, and small apartment buildings — occupied or vacant.",
    icon: Building,
  },
  {
    id: "manufactured",
    title: "Mobile & Manufactured",
    description:
      "Manufactured homes on owned land, including older units.",
    icon: Caravan,
  },
  {
    id: "land",
    title: "Vacant Land & Lots",
    description:
      "Empty lots and unused parcels that have become a tax bill and nothing more.",
    icon: Trees,
  },
  {
    id: "rentals",
    title: "Rental Properties",
    description:
      "Single rentals or a whole portfolio — we can buy with tenants in place.",
    icon: KeyRound,
  },
];

/**
 * Conditions that stop a traditional listing but not a cash sale. Framed as
 * "we still buy it" rather than judgments about the property.
 */
export interface PropertyCondition {
  id: string;
  title: string;
  description: string;
}

export const propertyConditions: PropertyCondition[] = [
  {
    id: "major-repairs",
    title: "Needs Major Repairs",
    description:
      "Roof, foundation, plumbing, electrical — you don't need to fix any of it first.",
  },
  {
    id: "damage",
    title: "Fire, Water, or Storm Damage",
    description:
      "Damaged properties are still properties. We'll look at it as it stands.",
  },
  {
    id: "dated",
    title: "Dated or Unrenovated",
    description:
      "No staging, no updates, no fresh paint. The house can stay exactly as it is.",
  },
  {
    id: "cleanout",
    title: "Full of Belongings",
    description:
      "Leave behind whatever you don't want to move. We handle the cleanout.",
  },
  {
    id: "title-issues",
    title: "Liens, Back Taxes, or Title Issues",
    description:
      "These are common and usually solvable. Tell us early and we'll work through it.",
  },
  {
    id: "occupied",
    title: "Tenant-Occupied",
    description:
      "Difficult tenants or an awkward lease doesn't have to stop your sale.",
  },
];

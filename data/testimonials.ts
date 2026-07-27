export interface Testimonial {
  id: string;
  name: string;
  role: string;
  /** Rating out of 5; supports halves, e.g. 4.5. */
  rating: number;
  quote: string;
  propertyName: string;
  propertyAddress: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "marcus-lee",
    name: "Marcus Lee",
    role: "Homeowner",
    rating: 5,
    quote:
      "Jonah and the team made the process clear from the first conversation. We understood our options and never felt pressured.",
    propertyName: "Sold as-is",
    propertyAddress: "No repairs needed",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "sophia-carter",
    name: "Sophia Carter",
    role: "Inherited a property",
    rating: 5,
    quote:
      "We inherited a house we couldn't manage. Royal Home Solutions walked us through everything and closed on our timeline.",
    propertyName: "Inherited home",
    propertyAddress: "Closed in weeks, not months",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "amara-okafor",
    name: "Amara Okafor",
    role: "Relocating homeowner",
    rating: 5,
    quote:
      "I needed to move quickly for work. They gave me honest answers, no agent fees, and a closing date that fit my move.",
    propertyName: "Relocation sale",
    propertyAddress: "Flexible closing date",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "david-nguyen",
    name: "David Nguyen",
    role: "Former landlord",
    rating: 5,
    quote:
      "I was tired of managing a rental that needed work. Selling as-is was simple and there were no commissions taken out.",
    propertyName: "Tired landlord",
    propertyAddress: "Sold without commissions",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=160&q=80",
  },
];
